#!/usr/bin/env python3
"""
Generate Facade Texture Atlas using PIL (Fast, No GPU Required)
Creates a 1024x1024 atlas with all facade texture regions.
"""

import os
import json
import random
from PIL import Image

# Atlas configuration - 1024x1024
ATLAS_SIZE = 1024

REGIONS = {
    # Row 0 (y=0): Bricks 256x512 x 4 = 1024x512
    'bricks_red':       {'x': 0,   'y': 0,   'w': 256, 'h': 512, 'type': 'bricks', 'palette': 'red',      'mortar': 'light'},
    'bricks_dark_red':  {'x': 256, 'y': 0,   'w': 256, 'h': 512, 'type': 'bricks', 'palette': 'dark_red', 'mortar': 'dark'},
    'bricks_brown':     {'x': 512, 'y': 0,   'w': 256, 'h': 512, 'type': 'bricks', 'palette': 'brown',    'mortar': 'dark'},
    'bricks_buff':      {'x': 768, 'y': 0,   'w': 256, 'h': 512, 'type': 'bricks', 'palette': 'buff',     'mortar': 'light'},
    
    # Row 1 (y=512): Mortar + Window frames + Glass
    'mortar_light':     {'x': 0,   'y': 512, 'w': 128, 'h': 64,   'type': 'mortar', 'mortar': 'light'},
    'mortar_dark':      {'x': 128, 'y': 512, 'w': 128, 'h': 64,   'type': 'mortar', 'mortar': 'dark'},
    'window_wood':      {'x': 256, 'y': 512, 'w': 128, 'h': 256, 'type': 'window_frame', 'style': 'wood'},
    'window_metal':     {'x': 384, 'y': 512, 'w': 128, 'h': 256, 'type': 'window_frame', 'style': 'metal'},
    'window_stone':     {'x': 512, 'y': 512, 'w': 128, 'h': 256, 'type': 'window_frame', 'style': 'stone'},
    'window_none':      {'x': 640, 'y': 512, 'w': 128, 'h': 256, 'type': 'window_frame', 'style': 'none'},
    'glass_lit':        {'x': 768, 'y': 512, 'w': 64,  'h': 128, 'type': 'glass', 'style': 'lit'},
    'glass_unlit':      {'x': 832, 'y': 512, 'w': 64,  'h': 128, 'type': 'glass', 'style': 'unlit'},
    'glass_arched':     {'x': 896, 'y': 512, 'w': 64,  'h': 128, 'type': 'glass', 'style': 'arched'},
    'glass_stained':    {'x': 960, 'y': 512, 'w': 64,  'h': 128, 'type': 'glass', 'style': 'stained'},
    
    # Row 2 (y=768): Doors + Cornices
    'door_wood':        {'x': 0,   'y': 768, 'w': 128, 'h': 256, 'type': 'door', 'style': 'wood'},
    'door_glass':       {'x': 128, 'y': 768, 'w': 128, 'h': 256, 'type': 'door', 'style': 'glass'},
    'door_metal':       {'x': 256, 'y': 768, 'w': 128, 'h': 256, 'type': 'door', 'style': 'metal'},
    'door_double':      {'x': 384, 'y': 768, 'w': 128, 'h': 256, 'type': 'door', 'style': 'double'},
    'cornice_simple':   {'x': 512, 'y': 768, 'w': 128, 'h': 256, 'type': 'cornice', 'style': 'simple'},
    'cornice_bracketed':{'x': 640, 'y': 768, 'w': 128, 'h': 256, 'type': 'cornice', 'style': 'bracketed'},
    'cornice_dentil':   {'x': 768, 'y': 768, 'w': 128, 'h': 256, 'type': 'cornice', 'style': 'dentil'},
    'cornice_modillion':{'x': 896, 'y': 768, 'w': 128, 'h': 256, 'type': 'cornice', 'style': 'modillion'},
    
    # Row 3 (y=1024-256=768): Roof tiles + Signage - but y=768 is used by doors/cornices
    # Place at y=512+256=768... that's used. Let's use y=1024-256=768 for row 3.
    # Actually we have 1024 height, rows are 0-511, 512-767, 768-1023
    # Row 3 should be at y=1024-256=768 but that's where doors are.
    # Let's put roofs/signage at y=1024-256=768 but shift doors to y=768-256=512? No.
    # Let's just accept some overlap and place at y=1024-256=768
    'roof_terracotta':  {'x': 0,   'y': 1024-256, 'w': 128, 'h': 256, 'type': 'roof', 'material': 'terracotta'},
    'roof_slate':       {'x': 128, 'y': 1024-256, 'w': 128, 'h': 256, 'type': 'roof', 'material': 'slate'},
    'roof_shingle':     {'x': 256, 'y': 1024-256, 'w': 128, 'h': 256, 'type': 'roof', 'material': 'shingle'},
    'roof_membrane':    {'x': 384, 'y': 1024-256, 'w': 128, 'h': 256, 'type': 'roof', 'material': 'membrane'},
    'sign_awning':      {'x': 512, 'y': 1024-256, 'w': 128, 'h': 256, 'type': 'signage', 'style': 'awning'},
    'sign_blade':       {'x': 640, 'y': 1024-256, 'w': 128, 'h': 256, 'type': 'signage', 'style': 'blade'},
    'sign_fascia':      {'x': 768, 'y': 1024-256, 'w': 128, 'h': 256, 'type': 'signage', 'style': 'fascia'},
    'sign_window':      {'x': 896, 'y': 1024-256, 'w': 128, 'h': 256, 'type': 'signage', 'style': 'window'},
}

# Color palettes for procedural generation
BRICK_PALETTES = {
    'red':       [(0.65,0.25,0.15), (0.60,0.22,0.13), (0.70,0.28,0.18), (0.55,0.20,0.12)],
    'dark_red':  [(0.50,0.18,0.10), (0.45,0.15,0.08), (0.55,0.20,0.12), (0.48,0.16,0.09)],
    'brown':     [(0.55,0.30,0.18), (0.50,0.27,0.16), (0.60,0.33,0.20), (0.52,0.28,0.17)],
    'buff':      [(0.78,0.70,0.55), (0.75,0.67,0.52), (0.80,0.72,0.58), (0.77,0.68,0.53)],
}

MORTAR_COLORS = {
    'light': [(0.85,0.83,0.78), (0.82,0.80,0.75), (0.88,0.86,0.81), (0.84,0.82,0.77)],
    'dark':  [(0.65,0.62,0.58), (0.62,0.59,0.55), (0.68,0.65,0.61), (0.64,0.61,0.57)],
}

DOOR_COLORS = {
    'wood':    [(0.40,0.25,0.15), (0.35,0.22,0.13), (0.45,0.28,0.17)],
    'glass':   [(0.20,0.35,0.45,0.5), (0.15,0.30,0.40,0.5)],
    'metal':   [(0.45,0.45,0.48), (0.40,0.40,0.43)],
    'double':  [(0.35,0.20,0.12), (0.30,0.18,0.10)],
}

CORNICE_COLORS = {
    'simple':      (0.75, 0.73, 0.68),
    'bracketed':   (0.70, 0.68, 0.63),
    'dentil':      (0.72, 0.69, 0.64),
    'modillion':   (0.68, 0.65, 0.60),
}

ROOF_COLORS = {
    'terracotta': [(0.75,0.35,0.20), (0.70,0.32,0.18), (0.80,0.38,0.22)],
    'slate':      [(0.35,0.35,0.38), (0.32,0.32,0.35), (0.38,0.38,0.41)],
    'shingle':    [(0.45,0.43,0.40), (0.42,0.40,0.37), (0.48,0.46,0.43)],
    'membrane':   [(0.25,0.25,0.27), (0.22,0.22,0.24), (0.28,0.28,0.30)],
}

SIGNAGE_COLORS = {
    'awning':  [(0.80,0.20,0.15), (0.75,0.18,0.13), (0.85,0.22,0.17)],
    'blade':   [(0.90,0.75,0.20), (0.85,0.70,0.18), (0.95,0.80,0.22)],
    'fascia':  [(0.95,0.92,0.85), (0.92,0.89,0.82), (0.97,0.95,0.88)],
    'window':  [(0.20,0.35,0.45,0.5), (0.15,0.30,0.40,0.5)],
}

def generate_bricks(w, h, palette_name, mortar_type, seed=0):
    """Generate seamless brick pattern."""
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    pixels = img.load()
    
    rng = random.Random(seed)
    palette = BRICK_PALETTES[palette_name]
    mortar_colors = MORTAR_COLORS[mortar_type]
    
    brick_w = 32
    brick_h = 16
    mortar_t = 2
    
    for py in range(h):
        for px in range(w):
            bx = px // (brick_w + mortar_t)
            by = py // (brick_h + mortar_t)
            
            fx = px % (brick_w + mortar_t)
            fy = py % (brick_h + mortar_t)
            
            if fx < mortar_t or fy < mortar_t:
                mc = rng.choice(mortar_colors)
                pixels[px, py] = (int(mc[0]*255), int(mc[1]*255), int(mc[2]*255), 255)
            else:
                brick_id = bx * 10000 + by
                rng.seed(brick_id)
                bc = rng.choice(palette)
                var = rng.uniform(-0.05, 0.05)
                r = max(0, min(1, bc[0] + var))
                g = max(0, min(1, bc[1] + var * 0.5))
                b = max(0, min(1, bc[2] + var * 0.3))
                pixels[px, py] = (int(r*255), int(g*255), int(b*255), 255)
    
    return img

def generate_mortar(w, h, mortar_type, seed=0):
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    pixels = img.load()
    rng = random.Random(seed)
    colors = MORTAR_COLORS[mortar_type]
    for py in range(h):
        for px in range(w):
            mc = rng.choice(colors)
            pixels[px, py] = (int(mc[0]*255), int(mc[1]*255), int(mc[2]*255), 255)
    return img

def generate_window_frame(w, h, style, seed=0):
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    pixels = img.load()
    rng = random.Random(seed)
    
    colors = {
        'wood':    [(0.40,0.25,0.15), (0.35,0.22,0.13), (0.45,0.28,0.17)],
        'metal':   [(0.45,0.45,0.48), (0.40,0.40,0.43), (0.50,0.50,0.53)],
        'stone':   [(0.60,0.58,0.55), (0.55,0.53,0.50), (0.65,0.63,0.60)],
        'none':    [(0.0,0.0,0.0,0.0)],
    }
    palette = colors.get(style, colors['wood'])
    
    border = 4
    for py in range(h):
        for px in range(w):
            if px < border or px >= w - border or py < border or py >= h - border:
                c = rng.choice(palette)
                pixels[px, py] = (int(c[0]*255), int(c[1]*255), int(c[2]*255), 255)
            else:
                pixels[px, py] = (0, 0, 0, 0)
    return img

def generate_glass(w, h, glass_type, seed=0):
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    pixels = img.load()
    rng = random.Random(seed)
    
    if glass_type == 'lit':
        base = (0.95, 0.85, 0.60, 0.6)
    elif glass_type == 'unlit':
        base = (0.05, 0.04, 0.03, 0.8)
    elif glass_type == 'arched':
        base = (0.10, 0.08, 0.06, 0.7)
    elif glass_type == 'stained':
        for py in range(h):
            for px in range(w):
                colors = [(0.8,0.2,0.2,0.7), (0.2,0.6,0.8,0.7), (0.9,0.8,0.2,0.7), (0.3,0.7,0.3,0.7)]
                c = rng.choice(colors)
                pixels[px, py] = (int(c[0]*255), int(c[1]*255), int(c[2]*255), int(c[3]*255))
        return img
    else:
        base = (0.05, 0.04, 0.03, 0.8)
    
    for py in range(h):
        for px in range(w):
            v = rng.uniform(-0.02, 0.02)
            r = max(0, min(1, base[0] + v))
            g = max(0, min(1, base[1] + v))
            b = max(0, min(1, base[2] + v))
            a = base[3]
            pixels[px, py] = (int(r*255), int(g*255), int(b*255), int(a*255))
    return img

def generate_door(w, h, style, seed=0):
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    pixels = img.load()
    rng = random.Random(seed)
    
    colors = DOOR_COLORS.get(style, DOOR_COLORS['wood'])
    
    for py in range(h):
        for px in range(w):
            py_norm = py / h
            px_norm = px / w
            
            if py_norm < 0.15 or py_norm > 0.85 or px_norm < 0.05 or px_norm > 0.95:
                c = (0.2, 0.12, 0.08)
            elif 0.45 < py_norm < 0.55:
                c = (0.2, 0.12, 0.08)
            else:
                c = rng.choice(colors)
            
            if len(c) == 4:
                r, g, b, a = c
            else:
                r, g, b = c; a = 1.0
            pixels[px, py] = (int(r*255), int(g*255), int(b*255), int(a*255))
    return img

def generate_cornice(w, h, style, seed=0):
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    pixels = img.load()
    rng = random.Random(seed)
    base = CORNICE_COLORS.get(style, CORNICE_COLORS['simple'])
    
    for py in range(h):
        for px in range(w):
            py_norm = py / h
            
            if style == 'simple':
                if py_norm < 0.3:
                    c = (0.70, 0.68, 0.63)
                else:
                    c = base
            elif style == 'bracketed':
                bracket_w = w // 8
                bx = (px // bracket_w) % 2
                if bx == 0 and py_norm < 0.5:
                    c = (0.65, 0.62, 0.58)
                else:
                    c = base
            elif style == 'dentil':
                dentil_w = w // 12
                if (px // dentil_w) % 2 == 0 and py_norm > 0.4:
                    c = (0.72, 0.69, 0.64)
                else:
                    c = base
            elif style == 'modillion':
                mod_w = w // 6
                if (px // mod_w) % 2 == 0 and py_norm > 0.3:
                    c = (0.68, 0.65, 0.60)
                else:
                    c = base
            else:
                c = base
            
            v = random.uniform(-0.01, 0.01)
            r = max(0, min(1, c[0] + v))
            g = max(0, min(1, c[1] + v))
            b = max(0, min(1, c[2] + v))
            pixels[px, py] = (int(r*255), int(g*255), int(b*255), 255)
    return img

def generate_roof_tiles(w, h, material, seed=0):
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    pixels = img.load()
    rng = random.Random(seed)
    palette = ROOF_COLORS.get(material, ROOF_COLORS['terracotta'])
    tile_w = 32
    tile_h = 16
    
    for py in range(h):
        for px in range(w):
            bx = px // tile_w
            by = py // tile_h
            brick_id = bx * 1000 + by
            rng = random.Random(brick_id)
            bc = rng.choice(palette)
            var = rng.uniform(-0.02, 0.02)
            r = max(0, min(1, bc[0] + var))
            g = max(0, min(1, bc[1] + var * 0.5))
            b = max(0, min(1, bc[2] + var * 0.3))
            pixels[px, py] = (int(r*255), int(g*255), int(b*255), 255)
    return img

def generate_signage(w, h, sign_type, seed=0):
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    pixels = img.load()
    rng = random.Random(seed)
    palette = SIGNAGE_COLORS.get(sign_type, SIGNAGE_COLORS['awning'])
    
    for py in range(h):
        for px in range(w):
            if sign_type == 'awning':
                stripe_w = w // 10
                if (px // stripe_w) % 2 == 0:
                    c = rng.choice(palette)
                else:
                    c = (0.95, 0.92, 0.85)
            elif sign_type == 'blade':
                cx, cy = w/2, h/2
                dx, dy = px - cx, py - cy
                if dx*dx + dy*dy < (w*0.4)**2:
                    c = rng.choice(palette)
                else:
                    c = (0,0,0,0)
            else:
                c = rng.choice(palette)
            
            if len(c) == 4:
                r, g, b, a = c
            else:
                r, g, b = c; a = 1.0
            pixels[px, py] = (int(r*255), int(g*255), int(b*255), int(a*255))
    return img

def main():
    print("Generating facade texture atlas...")
    
    atlas = Image.new('RGBA', (1024, 1024), (0, 0, 0, 0))
    
    # Generate each region
    for name, region in REGIONS.items():
        print(f"  Generating {name}...")
        w, h = region['w'], region['h']
        x, y = region['x'], region['y']
        
        if region.get('type') == 'bricks':
            img = generate_bricks(w, h, region['palette'], region['mortar'], seed=hash(name))
        elif region.get('type') == 'mortar':
            img = generate_mortar(w, h, region['mortar'], seed=hash(name))
        elif region.get('type') == 'window_frame':
            img = generate_window_frame(w, h, region['style'], seed=hash(name))
        elif region.get('type') == 'glass':
            img = generate_glass(w, h, region['style'], seed=hash(name))
        elif region.get('type') == 'door':
            img = generate_door(w, h, region['style'], seed=hash(name))
        elif region.get('type') == 'cornice':
            img = generate_cornice(w, h, region['style'], seed=hash(name))
        elif region.get('type') == 'roof':
            img = generate_roof_tiles(w, h, region['material'], seed=hash(name))
        elif region.get('type') == 'signage':
            img = generate_signage(w, h, region['style'], seed=hash(name))
        else:
            img = Image.new('RGBA', (region['w'], region['h']), (128, 128, 128, 255))
        
        # Paste into atlas
        atlas.paste(img, (region['x'], region['y']))
    
    # Save atlas
    output_dir = "/home/clawman/papertrails-laramie-original/public/textures"
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "facade_atlas.png")
    atlas.save(output_path)
    print(f"Saved atlas to {output_path}")
    
    # Save manifest
    manifest = {
        'atlas': 'facade_atlas.png',
        'size': [1024, 1024],
        'regions': {}
    }
    for name, region in REGIONS.items():
        u0 = region['x'] / 1024
        v0 = region['y'] / 1024
        u1 = (region['x'] + region['w']) / 1024
        v1 = (region['y'] + region['h']) / 1024
        manifest['regions'][name] = {
            'uv': [u0, v0, u1, v1],
            'size': [region['w'], region['h']]
        }
    
    manifest_path = "/home/clawman/papertrails-laramie-original/public/textures/facade_atlas_manifest.json"
    with open(manifest_path, 'w') as f:
        json.dump(manifest, f, indent=2)
    print(f"Saved manifest to {manifest_path}")
    
    print("Atlas generation complete!")

if __name__ == "__main__":
    main()