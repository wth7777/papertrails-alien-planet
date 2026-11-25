#!/usr/bin/env python3
"""
Robust building generator - runs Blender for each building individually with error handling.
"""

import subprocess
import os
import json
import sys

OUT_DIR = "/home/clawman/papertrails-laramie-original/public/models/buildings"
SCRIPT = "/home/clawman/papertrails-laramie-original/tools/blender/generate_facade.py"

def load_registry():
    with open('/home/clawman/papertrails-laramie-original/public/gis/pt_buildings.geojson') as f:
        data = json.load(f)
    
    registry = []
    for feat in data['features']:
        props = feat.get('properties', {})
        geom = feat.get('geometry', {})
        if geom.get('type') != 'Polygon': continue
        coords = geom['coordinates'][0]
        if len(coords) < 4: continue
        
        area = 0
        for i in range(len(coords)-1):
            area += coords[i][0]*coords[i+1][1] - coords[i+1][0]*coords[i][1]
        area = abs(area)/2
        
        classification = props.get('classification','')
        building = props.get('building','')
        amenity = props.get('amenity','')
        shop = props.get('shop','')
        is_comm = shop or amenity in ['restaurant','cafe','pub','bar','bank','office'] or classification=='COMMERCIAL'
        is_pub = amenity in ['school','university','hospital','courthouse','townhall'] or building=='civic'
        if area<100: levels = 2 if is_comm else 1
        elif area<400: levels = 2 if is_comm else (2 if is_pub else 1)
        elif area<1000: levels = 3 if is_comm else (3 if is_pub else 2)
        else: levels = 4 if is_comm else (3 if is_pub else 3)
        levels = min(max(levels,1),5)
        
        registry.append({
            'osm_id': props.get('osm_id'),
            'name': props.get('name',''),
            'footprint': coords,
            'area': area,
            'levels': levels,
            'orientation': 0,
            'props': props,
        })
    return registry

def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    
    registry = load_registry()
    print(f"Total buildings in registry: {len(registry)}")
    
    # Check already generated
    generated = set()
    for f in os.listdir(OUT_DIR):
        if f.endswith('.glb'):
            generated.add(f.replace('.glb', ''))
    
    print(f"Already generated: {len(generated)}")
    
    # Process each building
    for i, b in enumerate(registry):
        osm_id = str(b['osm_id'])
        
        if osm_id in generated:
            print(f"[{i+1}/{len(registry)}] SKIP {osm_id} (already exists)")
            continue
        
        out_file = os.path.join(OUT_DIR, f"{osm_id}.glb")
        print(f"[{i+1}/{len(registry)}] Generating {osm_id}...")
        
        try:
            result = subprocess.run(
                ["blender", "--background", "--python", SCRIPT, "--", "--test-osm", osm_id],
                capture_output=True,
                text=True,
                timeout=120
            )
            
            if result.returncode == 0 and os.path.exists(out_file):
                print(f"  OK: {osm_id}")
                generated.add(osm_id)
            else:
                print(f"  FAIL: {osm_id} (returncode={result.returncode})")
                if result.stderr:
                    print(f"    stderr: {result.stderr[:500]}")
                if result.stdout:
                    print(f"    stdout: {result.stdout[:500]}")
        except subprocess.TimeoutExpired:
            print(f"  TIMEOUT: {osm_id}")
        except Exception as e:
            print(f"  ERROR: {osm_id} - {e}")
    
    print(f"\nDone! Generated: {len(generated)}/{len(registry)}")

if __name__ == "__main__":
    main()