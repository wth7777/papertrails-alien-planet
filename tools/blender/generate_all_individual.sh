#!/usr/bin/env bash
# Generate all buildings one at a time to avoid Blender memory issues

OUT_DIR="/home/clawman/papertrails-laramie-original/public/models/buildings"
SCRIPT="/home/clawman/papertrails-laramie-original/tools/blender/generate_facade.py"

mkdir -p "$OUT_DIR"

# Load registry and iterate
python3 -c "
import json
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

for b in registry:
    print(b['osm_id'])
" | while read osm_id; do
    if [ -z "$osm_id" ]; then continue; fi
    
    out_file="$OUT_DIR/${osm_id}.glb"
    if [ -f "$out_file" ]; then
        echo "SKIP: $osm_id (already exists)"
        continue
    fi
    
    echo "Generating $osm_id..."
    blender --background --python "$SCRIPT" -- --test-osm "$osm_id" 2>&1 | grep -E "(generated|Error|Traceback)" || true
    
    if [ -f "$out_file" ]; then
        echo "  OK: $osm_id"
    else
        echo "  FAIL: $osm_id"
    fi
done

echo "All done!"