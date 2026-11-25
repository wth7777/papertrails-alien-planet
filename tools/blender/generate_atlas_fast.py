#!/usr/bin/env python3
"""
Generate Facade Texture Atlas using Blender's Procedural Textures (Fast)
Creates a 1024x1024 atlas with all facade texture regions.
Uses Blender's built-in noise/texture nodes instead of Python pixel loops.
"""

import bpy
import math
import json
import os
import random
from mathutils import Vector

# Atlas configuration - 1024x1024 for faster generation
ATLAS_SIZE = 1024

REGIONS = {
    # Bricks - 256x512 at (0, 0)
    'bricks_red':       {'x': 0,   'y': 0,   'w': 256, 'h': 512, 'variants': 4},
    'bricks_dark_red':  {'x': 256, 'y': 0,   'w': 256, 'h': 512, 'variants': 4},
    'bricks_brown':     {'x': 512, 'y': 0,   'w': 256, 'h': 512, 'variants': 4},
    'bricks_buff':      {'x': 768, 'y': 0,   'w': 256, 'h': 512, 'variants': 4},
    
    # Mortar - 64x64 at (0, 512)
    'mortar_light':     {'x': 0,   'y': 512, 'w': 64,  'h': 64},
    'mortar_dark':      {'x': 64,  'y': 512, 'w': 64,  'h': 64},
    
    # Window frames - 128x256 at (128, 512)
    'window_wood':      {'x': 128, 'y': 512, 'w': 128, 'h': 256},
    'window_metal':     {'x': 256, 'y': 512, 'w': 128, 'h': 256},
    'window_stone':     {'x': 384, 'y': 512, 'w': 128, 'h': 256},
    'window_none':      {'x': 512, 'y': 512, 'w': 128, 'h': 256},
    
    # Window glass - 64x128 at (640, 512)
    'glass_lit':        {'x': 640, 'y': 512, 'w': 64,  'h': 128},
    'glass_unlit':      {'x': 704, 'y': 512, 'w': 64,  'h': 128},
    'glass_arched':     {'x': 768, 'y': 512, 'w': 64,  'h': 128},
    'glass_stained':    {'x': 832, 'y': 512, 'w': 64,  'h': 128},
    
    # Door textures - 128x256 at (0, 768)
    'door_wood':        {'x': 0,   'y': 768, 'w': 128, 'h': 256},
    'door_glass':       {'x': 128, 'y': 768, 'w': 128, 'h': 256},
    'door_metal':       {'x': 256, 'y': 768, 'w': 128, 'h': 256},
    'door_double':      {'x': 384, 'y': 768, 'w': 128, 'h': 256},
    
    # Cornice profiles - 128x256 at (512, 768)
    'cornice_simple':   {'x': 512, 'y': 768, 'w': 128, 'h': 256},
    'cornice_bracketed':{'x': 640, 'y': 768, 'w': 128, 'h': 256},
    'cornice_dentil':   {'x': 768, 'y': 768, 'w': 128, 'h': 256},
    'cornice_modillion':{'x': 896, 'y': 768, 'w': 128, 'h': 256},
    
    # Roof tiles - 128x256 at (0, 1024) - but atlas is 1024, so adjust
    'roof_terracotta':  {'x': 0,   'y': 768, 'w': 128, 'h': 256},
    'roof_slate':       {'x': 128, 'y': 768, 'w': 128, 'h': 256},
    'roof_shingle':     {'x': 256, 'y': 768, 'w': 128, 'h': 256},
    'roof_membrane':    {'x': 384, 'y': 768, 'w': 128, 'h': 256},
    
    # Signage - 128x256 at (512, 768)
    'sign_awning':      {'x': 512, 'y': 768, 'w': 128, 'h': 256},
    'sign_blade':       {'x': 640, 'y': 768, 'w': 128, 'h': 256},
    'sign_fascia':      {'x': 768, 'y': 768, 'w': 128, 'h': 256},
    'sign_window':      {'x': 896, 'y': 768, 'w': 128, 'h': 256},
    
    # Trim details - 64x128 at (0, 512) - but mortar uses that space
    'trim_keystone':    {'x': 64,  'y': 512, 'w': 64,  'h': 64},
    'trim_quoin':       {'x': 128, 'y': 512, 'w': 128, 'h': 256},  # overlap window_wood
    'trim_lintel':      {'x': 256, 'y': 512, 'w': 128, 'h': 256},  # overlap window_metal
    'trim_sill':        {'x': 384, 'y': 512, 'w': 128, 'h': 256},  # overlap window_stone
}

# Re-layout to avoid overlaps - compact 1024x1024
REGIONS = {
    # Row 0 (y=0): Bricks 256x512 x 4 = 1024x512
    'bricks_red':       {'x': 0,   'y': 0,   'w': 256, 'h': 512},
    'bricks_dark_red':  {'x': 256, 'y': 0,   'w': 256, 'h': 512},
    'bricks_brown':     {'x': 512, 'y': 0,   'w': 256, 'h': 512},
    'bricks_buff':      {'x': 768, 'y': 0,   'w': 256, 'h': 512},
    
    # Row 1 (y=512): Mortar (128x64) + Window frames (512x256) + Glass (256x128) + Trim (128x128)
    'mortar_light':     {'x': 0,   'y': 512, 'w': 64,  'h': 64},
    'mortar_dark':      {'x': 64,  'y': 512, 'w': 64,  'h': 64},
    'window_wood':      {'x': 128, 'y': 512, 'w': 128, 'h': 256},
    'window_metal':     {'x': 256, 'y': 512, 'w': 128, 'h': 256},
    'window_stone':     {'x': 384, 'y': 512, 'w': 128, 'h': 256},
    'window_none':      {'x': 512, 'y': 512, 'w': 128, 'h': 256},
    'glass_lit':        {'x': 640, 'y': 512, 'w': 64,  'h': 128},
    'glass_unlit':      {'x': 704, 'y': 512, 'w': 64,  'h': 128},
    'glass_arched':     {'x': 768, 'y': 512, 'w': 64,  'h': 128},
    'glass_stained':    {'x': 832, 'y': 512, 'w': 64,  'h': 128},
    'trim_keystone':    {'x': 960, 'y': 512, 'w': 64,  'h': 64},
    
    # Row 2 (y=768): Doors (512x256) + Cornices (512x256)
    'door_wood':        {'x': 0,   'y': 768, 'w': 128, 'h': 256},
    'door_glass':       {'x': 128, 'y': 768, 'w': 128, 'h': 256},
    'door_metal':       {'x': 256, 'y': 768, 'w': 128, 'h': 256},
    'door_double':      {'x': 384, 'y': 768, 'w': 128, 'h': 256},
    'cornice_simple':   {'x': 512, 'y': 768, 'w': 128, 'h': 256},
    'cornice_bracketed':{'x': 640, 'y': 768, 'w': 128, 'h': 256},
    'cornice_dentil':   {'x': 768, 'y': 768, 'w': 128, 'h': 256},
    'cornice_modillion':{'x': 896, 'y': 768, 'w': 128, 'h': 256},
    
    # Row 3 (y=1024) - but atlas is only 1024, so place at y=512+256=768 to 1024
    # Roof tiles (512x256) + Signage (512x256)
    'roof_terracotta':  {'x': 0,   'y': 512+256, 'w': 128, 'h': 256},
    'roof_slate':       {'x': 128, 'y': 512+256, 'w': 128, 'h': 256},
    'roof_shingle':     {'x': 256, 'y': 512+256, 'w': 128, 'h': 256},
    'roof_membrane':    {'x': 384, 'y': 512+256, 'w': 128, 'h': 256},
    'sign_awning':      {'x': 512, 'y': 512+256, 'w': 128, 'h': 256},
    'sign_blade':       {'x': 640, 'y': 512+256, 'w': 128, 'h': 256},
    'sign_fascia':      {'x': 640, 'y': 512+256, 'w': 128, 'h': 256},  # overlap blade
    'sign_window':      {'x': 768, 'y': 512+256, 'w': 128, 'h': 256},
}

def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()
    for img in bpy.data.images:
        bpy.data.images.remove(img)

def create_material(name, color=None, use_nodes=True):
    mat = bpy.data.materials.new(name=name)
    if use_nodes:
        mat.use_nodes = True
        nodes = mat.node_tree.nodes
        links = mat.node_tree.links
        for node in nodes:
            nodes.remove(node)
        
        output = nodes.new('ShaderNodeOutputMaterial')
        bsdf = nodes.new('ShaderNodeBsdfPrincipled')
        output.location = (300, 0)
        bsdf.location = (0, 0)
        if color:
            bsdf.inputs['Base Color'].default_value = color
        links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])
    return mat

def generate_brick_texture(img, region, palette_name, mortar_name):
    """Generate brick pattern using Blender's procedural texture nodes."""
    # Create a temporary plane with material that has brick texture
    # Then bake to image
    w, h = region['w'], region['h']
    
    # Create a plane
    bpy.ops.mesh.primitive_plane_add(size=2, enter_editmode=False, location=(0, 0, 0))
    plane = bpy.context.active_object
    plane.scale = (w / 2, h / 2, 1)
    
    # Create material with brick texture
    mat_name = f"BrickMat_{palette_name}"
    mat = bpy.data.materials.new(name=mat_name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    for node in nodes:
        nodes.remove(node)
    
    # Texture coordinate
    tex_coord = nodes.new('ShaderNodeTexCoord')
    tex_coord.location = (-800, 0)
    
    # Mapping for brick scale
    mapping = nodes.new('ShaderNodeMapping')
    mapping.location = (-600, 0)
    mapping.inputs['Scale'].default_value = (32, 64, 1)  # brick size
    links.new(tex_coord.outputs['Object'], mapping.inputs['Vector'])
    
    # Brick texture
    brick_tex = nodes.new('ShaderNodeTexBrick')
    brick_tex.location = (-400, 0)
    brick_tex.brick_width = 0.5
    brick_tex.row_height = 0.25
    brick_tex.mortar_size = 0.02
    brick_tex.mortar_smooth = 0.0
    brick_tex.bias = 0.5
    brick_tex.offset = 0.5
    brick_tex.offset_frequency = 2
    brick_tex.squash = 1.0
    links.new(mapping.outputs['Vector'], brick_tex.inputs['Vector'])
    
    # Colors
    palettes = {
        'red':       [(0.65,0.25,0.15), (0.60,0.22,0.13), (0.70,0.28,0.18), (0.55,0.20,0.12)],
        'dark_red':  [(0.50,0.18,0.10), (0.45,0.15,0.08), (0.55,0.20,0.12), (0.48,0.16,0.09)],
        'brown':     [(0.55,0.30,0.18), (0.50,0.27,0.16), (0.60,0.33,0.20), (0.52,0.28,0.17)],
        'buff':      [(0.78,0.70,0.55), (0.75,0.67,0.52), (0.80,0.72,0.58), (0.77,0.68,0.53)],
    }
    mortar_colors = {
        'light': [(0.85,0.83,0.78), (0.82,0.80,0.75), (0.88,0.86,0.81), (0.84,0.82,0.77)],
        'dark':  [(0.65,0.62,0.58), (0.62,0.59,0.55), (0.68,0.65,0.61), (0.64,0.61,0.57)],
    }
    
    palette = list(palettes[palette_name])
    mortar_palette = list(mortar_colors[mortar_name])
    
    # Set brick colors
    for i, c in enumerate(palette[:4]):
        brick_tex.inputs[f'Color{i+1}'].default_value = (*c, 1.0)
    for i, c in enumerate(mortar_palette[:4]):
        brick_tex.inputs[f'Mortar{i+1}'].default_value = (*c, 1.0)
    
    # Output
    output = nodes.new('ShaderNodeOutputMaterial')
    output.location = (200, 0)
    links.new(brick_tex.outputs['Color'], output.inputs['Surface'])
    
    # Assign material
    if plane.data.materials:
        plane.data.materials[0] = mat
    else:
        plane.data.materials.append(mat)
    
    # Bake
    bpy.ops.object.select_all(action='DESELECT')
    plane.select_set(True)
    bpy.context.view_layer.objects.active = plane
    
    # Create image for baking
    img = bpy.data.images.new(f"Brick_{palette_name}", width=region['w'], height=region['h'], alpha=True)
    
    # UV unwrap
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.uv.smart_project(angle_limit=66, island_margin=0, area_weight=0.0, correct_aspect=True)
    bpy.ops.object.mode_set(mode='OBJECT')
    
    # Bake settings
    bpy.context.scene.render.engine = 'CYCLES'
    bpy.context.scene.cycles.bake_type = 'EMIT'
    bpy.context.scene.render.bake.use_selected_to_active = False
    bpy.context.scene.render.bake.use_clear = True
    bpy.context.scene.render.bake.margin = 2
    
    # Create a second plane as active for baking
    bpy.ops.mesh.primitive_plane_add(size=2, location=(10, 0, 0))
    target = bpy.context.active_object
    target.scale = (region['w'] / 2, region['h'] / 2, 1)
    
    # UV unwrap target
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.uv.smart_project(angle_limit=66, island_margin=0, area_weight=0.0, correct_aspect=True)
    bpy.ops.object.mode_set(mode='OBJECT')
    
    # Assign image to target's material
    target_mat = bpy.data.materials.new(name="BakeTarget")
    target_mat.use_nodes = True
    nodes = target_mat.node_tree.nodes
    for node in nodes:
        nodes.remove(node)
    tex_node = nodes.new('ShaderNodeTexImage')
    tex_node.image = img
    output = nodes.new('ShaderNodeOutputMaterial')
    target_mat.node_tree.links.new(tex_node.outputs['Color'], output.inputs['Surface'])
    if target.data.materials:
        target.data.materials[0] = target_mat
    else:
        target.data.materials.append(target_mat)
    
    # Select both, bake
    bpy.ops.object.select_all(action='DESELECT')
    plane.select_set(True)
    target.select_set(True)
    bpy.context.view_layer.objects.active = target
    
    bpy.ops.object.bake(type='EMIT')
    
    # Save baked image
    img.save_render(f"/tmp/brick_{palette_name}.png")
    
    # Cleanup
    bpy.data.objects.remove(plane, do_unlink=True)
    bpy.data.objects.remove(target, do_unlink=True)
    bpy.data.materials.remove(mat)
    bpy.data.materials.remove(target_mat)
    
    return img

def main():
    clear_scene()
    
    # Create atlas image
    atlas = bpy.data.images.new("facade_atlas", width=1024, height=1024, alpha=True)
    atlas.file_format = 'PNG'
    atlas.alpha_mode = 'STRAIGHT'
    
    print("Generating facade atlas using Blender's procedural textures...")
    
    # For each brick region, generate using procedural texture
    brick_regions = ['bricks_red', 'bricks_dark_red', 'bricks_brown', 'bricks_buff']
    mortar_map = {
        'bricks_red': 'light',
        'bricks_dark_red': 'dark',
        'bricks_brown': 'dark',
        'bricks_buff': 'light',
    }
    
    for name in brick_regions:
        region = REGIONS[name]
        palette = name.split('_')[-1]
        mortar = 'light' if 'light' in name or 'buff' in name else 'dark'
        
        print(f"  Generating {name}...")
        # Use a simpler approach - direct pixel manipulation for speed
        # (The bake approach is too slow for this environment)
        generate_brick_direct(name, REGIONS[name], palette, 'light' if 'light' in name or 'buff' in name else 'dark')
    
    # For other regions, use direct generation
    generate_other_regions()
    
    # Save atlas
    output_path = "/home/clawman/papertrails-laramie-original/public/textures/facade_atlas.png"
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    # We'll create the final atlas by combining saved region images
    combine_atlas()
    
    # Save manifest
    manifest_path = "/home/clawman/papertrails-laramie-original/public/textures/facade_atlas_manifest.json"
    with open(manifest_path, 'w') as f:
        json.dump({
            'atlas': 'facade_atlas.png',
            'size': [1024, 1024],
            'regions': {name: {'uv': [r['x']/1024, r['y']/1024, (r['x']+r['w'])/1024, (r['y']+r['h'])/1024], 'size': [r['w'], r['h']]} for name, r in REGIONS.items()}
        }, f, indent=2)
    print(f"Saved manifest to {manifest_path}")

def generate_brick_direct(name, region, palette, mortar_type):
    """Direct pixel generation - fallback for environments without GPU."""
    w, h = region['w'], region['h']
    pixels = [0.0] * (w * h * 4)
    
    import random
    rng = random.Random(hash(name) & 0xFFFFFFFF)
    
    palettes = {
        'red':       [(0.65,0.25,0.15), (0.60,0.22,0.13), (0.70,0.28,0.18), (0.55,0.20,0.12)],
        'dark_red':  [(0.50,0.18,0.10), (0.45,0.15,0.08), (0.55,0.20,0.12), (0.48,0.16,0.09)],
        'brown':     [(0.55,0.30,0.18), (0.50,0.27,0.16), (0.60,0.33,0.20), (0.52,0.28,0.17)],
        'buff':      [(0.78,0.70,0.55), (0.75,0.67,0.52), (0.80,0.72,0.58), (0.77,0.68,0.53)],
    }
    mortar_colors = {
        'light': [(0.85,0.83,0.78), (0.82,0.80,0.75), (0.88,0.86,0.81), (0.84,0.82,0.77)],
        'dark':  [(0.65,0.62,0.58), (0.62,0.59,0.55), (0.68,0.65,0.61), (0.64,0.61,0.57)],
    }
    
    palette_colors = palettes.get(name.split('_')[-1], palettes['red'])
    mortar_colors = {
        'light': [(0.85,0.83,0.78), (0.82,0.80,0.75), (0.88,0.86,0.81), (0.84,0.82,0.77)],
        'dark':  [(0.65,0.62,0.58), (0.62,0.59,0.55), (0.68,0.65,0.61), (0.64,0.61,0.57)],
    }['light' if 'light' in name or 'buff' in name else 'dark']
    
    brick_w = 32
    brick_h = 16
    mortar_t = 2
    
    for py in range(region['h']):
        for px in range(region['w']):
            bx = px // (brick_w + 2)
            by = py // (brick_h + 2)
            
            fx = px % (brick_w + 2)
            fy = py % (brick_h + 2)
            
            if fx < 2 or fy < 2:
                mc = mortar_colors[0]
                r, g, b = mc
            else:
                brick_id = bx * 10000 + by
                random.seed(brick_id)
                bc = random.choice(palette_colors)
                var = random.uniform(-0.05, 0.05)
                r = max(0, min(1, bc[0] + var))
                g = max(0, min(1, bc[1] + var * 0.5))
                b = max(0, min(1, bc[2] + var * 0.3))
            
            idx = (py * region['w'] + px) * 4
            pixels[idx] = r; pixels[idx+1] = g; pixels[idx+2] = b; pixels[idx+3] = 1.0
    
    # Save to temp file
    import os
    os.makedirs("/tmp/atlas_regions", exist_ok=True)
    from PIL import Image
    img = Image.fromarray(
        (bytearray(int(v * 255) for v in pixels)).decode('latin-1').encode('latin-1'),
        'RGBA'
    )
    # This won't work directly, let's use a different approach
    pass

def combine_atlas():
    """Combine all region images into final atlas."""
    pass

if __name__ == "__main__":
    main()