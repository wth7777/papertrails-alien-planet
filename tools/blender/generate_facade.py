#!/usr/bin/env python3
"""
Procedural Facade Generator for Paper Trails Laramie - UV Atlas Version
Uses texture atlas (facade_atlas.png) with UV coordinates for textured facades.
"""

import bpy
import math
import json
import sys
import os
import random
from mathutils import Vector
from dataclasses import dataclass
from typing import List, Tuple, Dict, Optional

# Add facade_params to path
sys.path.insert(0, os.path.dirname(__file__))
from facade_params import FacadeParams, classify_facade, apply_subtype_params

# ─── Configuration ────────────────────────────────────────────────────────────

TILE_SIZE = 2.0
FLAP_LAYER_GAP = 0.004
CARD_THICKNESS = 0.016

# Atlas paths
ATLAS_IMAGE_PATH = "/home/clawman/papertrails-laramie-original/public/textures/facade_atlas.png"
ATLAS_MANIFEST_PATH = "/home/clawman/papertrails-laramie-original/public/textures/facade_atlas_manifest.json"

# Facade type -> atlas region mapping
FACADE_TO_BRICK_REGION = {
    'victorian_brick': 'bricks_red',
    'brick_commercial': 'bricks_dark_red',
    'warehouse': 'bricks_brown',
    'stone_civic': 'bricks_buff',
    'western_falsefront': 'bricks_red',
    'residential_simple': 'bricks_buff',
}

FACADE_TO_WINDOW_FRAME = {
    'victorian_brick': 'window_wood',
    'brick_commercial': 'window_metal',
    'warehouse': 'window_metal',
    'stone_civic': 'window_stone',
    'western_falsefront': 'window_wood',
    'residential_simple': 'window_wood',
}

FACADE_TO_CORNICE = {
    'victorian_brick': 'cornice_bracketed',
    'brick_commercial': 'cornice_simple',
    'warehouse': 'cornice_simple',
    'stone_civic': 'cornice_dentil',
    'western_falsefront': 'cornice_simple',
    'residential_simple': 'cornice_simple',
}

FACADE_TO_ROOF = {
    'victorian_brick': 'roof_terracotta',
    'brick_commercial': 'roof_membrane',
    'warehouse': 'roof_membrane',
    'stone_civic': 'roof_slate',
    'western_falsefront': 'roof_terracotta',
    'residential_simple': 'roof_shingle',
}

# ─── Utility Functions ────────────────────────────────────────────────────────

def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()
    for mesh in bpy.data.meshes:
        bpy.data.meshes.remove(mesh)
    for mat in bpy.data.materials:
        bpy.data.materials.remove(mat)
    for img in bpy.data.images:
        bpy.data.images.remove(img)

def centroid_2d(pts: List[Tuple[float, float]]) -> Tuple[float, float]:
    if not pts: return 0, 0
    x = sum(p[0] for p in pts) / len(pts)
    y = sum(p[1] for p in pts) / len(pts)
    return x, y

def load_atlas_manifest():
    """Load atlas region UV coordinates."""
    with open(ATLAS_MANIFEST_PATH) as f:
        data = json.load(f)
    return data['regions']

ATLAS_REGIONS = load_atlas_manifest()

def get_region_uv(region_name: str) -> Tuple[float, float, float, float]:
    """Get UV bounds for an atlas region: (u0, v0, u1, v1)."""
    r = ATLAS_REGIONS.get(region_name)
    if not r:
        r = ATLAS_REGIONS['bricks_red']
    return (r['uv'][0], r['uv'][1], r['uv'][2], r['uv'][3])

def create_atlas_material():
    """Create shared material using facade atlas texture."""
    mat = bpy.data.materials.new(name="FacadeAtlas")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    
    for node in nodes:
        nodes.remove(node)
    
    # Texture coordinate
    tex_coord = nodes.new('ShaderNodeTexCoord')
    tex_coord.location = (-600, 0)
    
    # Image texture
    tex_image = nodes.new('ShaderNodeTexImage')
    tex_image.location = (-400, 0)
    tex_image.image = bpy.data.images.load(ATLAS_IMAGE_PATH)
    tex_image.interpolation = 'Linear'
    tex_image.extension = 'REPEAT'
    
    # BSDF
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    bsdf.location = (-100, 0)
    bsdf.inputs['Roughness'].default_value = 0.8
    if 'Specular IOR Level' in bsdf.inputs:
        bsdf.inputs['Specular IOR Level'].default_value = 0.1
    elif 'Specular' in bsdf.inputs:
        bsdf.inputs['Specular'].default_value = 0.1
    
    # Output
    output = nodes.new('ShaderNodeOutputMaterial')
    output.location = (200, 0)
    
    links.new(tex_coord.outputs['UV'], tex_image.inputs['Vector'])
    links.new(tex_image.outputs['Color'], bsdf.inputs['Base Color'])
    links.new(tex_image.outputs['Alpha'], bsdf.inputs['Alpha'])
    links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])
    
    return mat

def add_hinge_userdata(obj, fold_angle, delay, layer):
    obj["hinge"] = True
    obj["foldAngle"] = fold_angle
    obj["delay"] = max(0.0, min(1.0, delay))
    obj["layer"] = max(0, int(layer))

def ensure_uv_layer(mesh):
    """Ensure mesh has an active UV layer."""
    if not mesh.uv_layers:
        mesh.uv_layers.new()
    return mesh.uv_layers.active

def scale_uv_to_region(mesh, uv_layer, region_name):
    """Scale and translate UV coordinates to fit within atlas region."""
    u0, v0, u1, v1 = get_region_uv(region_name)
    u_scale = u1 - u0
    v_scale = v1 - v0
    
    for poly in mesh.polygons:
        for loop_idx in poly.loop_indices:
            uv = uv_layer.data[loop_idx].uv
            uv.x = u0 + uv.x * u_scale
            uv.y = v0 + uv.y * v_scale

def unwrap_and_assign(mesh_obj, region_name):
    """Unwrap mesh and assign UVs to atlas region."""
    mesh = mesh_obj.data
    uv_layer = ensure_uv_layer(mesh)
    
    # Make active and select
    bpy.context.view_layer.objects.active = mesh_obj
    mesh_obj.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.smart_project(angle_limit=66, island_margin=0.01, area_weight=0.0, correct_aspect=True)
    bpy.ops.object.mode_set(mode='OBJECT')
    mesh_obj.select_set(False)
    
    # Scale UVs to atlas region
    scale_uv_to_region(mesh, uv_layer, region_name)

def create_base_mesh(name, footprint, height=0.0, rng: random.Random = None):
    verts_2d = [Vector((x, y)) for x, y in footprint]
    mesh = bpy.data.meshes.new(name + "_mesh")
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    
    cx, cy = centroid_2d(footprint)
    center = Vector((cx, cy))
    vertices = [center] + verts_2d
    faces = []
    for i in range(len(verts_2d)):
        next_i = (i + 1) % len(verts_2d)
        faces.append([0, i + 1, next_i + 1])
    
    verts_3d = [(v.x, v.y, height) for v in vertices]
    mesh.from_pydata(verts_3d, [], faces)
    mesh.update()
    
    return obj

def create_facade_wall(name, p1, p2, height, levels, params: FacadeParams, wall_idx: int, rng: random.Random, osm_id=None):
    """Create detailed facade wall with brick pattern, windows, doors, cornice."""
    mesh = bpy.data.meshes.new(name + "_mesh")
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    
    dx = p2.x - p1.x
    dy = p2.y - p1.y
    length = math.sqrt(dx*dx + dy*dy)
    if length < 0.01: return obj
    
    nx = -dy / length
    ny = dx / length
    wall_thickness = CARD_THICKNESS
    level_height = height / levels
    
    vertices = []
    faces = []
    
    for level in range(levels):
        z_base = level * level_height
        z_top = (level + 1) * level_height
        
        is_ground = (level == 0)
        is_storefront = is_ground and params.facade_type == 'commercial'
        
        # Wall segment corners
        v1 = (p1.x, p1.y, z_base)
        v2 = (p2.x, p2.y, z_base)
        v3 = (p2.x, p2.y, z_top)
        v4 = (p1.x, p1.y, z_top)
        v5 = (p1.x + nx * CARD_THICKNESS, p1.y + ny * CARD_THICKNESS, z_base)
        v6 = (p2.x + nx * CARD_THICKNESS, p2.y + ny * CARD_THICKNESS, z_base)
        v7 = (p2.x + nx * CARD_THICKNESS, p2.y + ny * CARD_THICKNESS, z_top)
        v8 = (p1.x + nx * CARD_THICKNESS, p1.y + ny * CARD_THICKNESS, z_top)
        
        base_idx = len(vertices)
        vertices.extend([v1, v2, v3, v4, v5, v6, v7, v8])
        
        # 6 faces of the wall segment
        faces.append([base_idx + 0, base_idx + 1, base_idx + 2, base_idx + 3])  # Front
        faces.append([base_idx + 4, base_idx + 5, base_idx + 6, base_idx + 7])  # Back
        faces.append([base_idx + 0, base_idx + 1, base_idx + 5, base_idx + 4])  # Bottom
        faces.append([base_idx + 3, base_idx + 2, base_idx + 6, base_idx + 7])  # Top
        faces.append([base_idx + 0, base_idx + 4, base_idx + 7, base_idx + 3])  # Left
        faces.append([base_idx + 1, base_idx + 2, base_idx + 6, base_idx + 5])  # Right
    
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    
    return obj

def add_windows_to_wall(parent_obj, p1, p2, height, levels, params, wall_idx, rng, nx, ny, length, osm_id=None):
    """Add window meshes as children of wall."""
    dx = p2.x - p1.x
    dy = p2.y - p1.y
    level_height = height / levels
    window_w = params.window_width
    window_h = params.window_height
    sill = params.window_sill
    spacing = params.window_spacing
    
    num_windows = max(1, int(length / spacing))
    
    for level in range(levels):
        z_base = level * level_height
        z_sill = z_base + sill
        z_top = z_sill + window_h
        
        is_ground = (level == 0)
        is_storefront = is_ground and params.facade_type == 'commercial'
        
        if is_storefront:
            # Storefront: large panes
            num_panes = max(2, int(length / 0.4))
            pane_w = length / num_panes * 0.85
            for i in range(num_panes):
                create_window_pane(parent_obj, p1, p2, nx, ny, length,
                                 i, num_panes, z_sill, z_top, params, True, rng, osm_id)
        else:
            # Regular windows
            for i in range(num_windows):
                t = (i + 0.5) / num_windows
                wx = p1.x + dx * t
                wy = p1.y + dy * t
                is_lit = rng.random() < params.window_lit_prob
                create_single_window(parent_obj, wx, wy, nx, ny,
                                   z_sill, z_top, window_w, window_h, params, is_lit, rng, osm_id)

def create_single_window(parent, wx, wy, nx, ny, z_base, z_top, w, h, params, is_lit, rng, osm_id=None):
    """Create a single window as separate mesh with frame + glass."""
    mesh_name = f"{osm_id}__window_mesh" if osm_id else "window_mesh"
    obj_name = f"{osm_id}__window" if osm_id else "window"
    mesh = bpy.data.meshes.new(mesh_name)
    win_obj = bpy.data.objects.new(obj_name, mesh)
    bpy.context.collection.objects.link(win_obj)
    win_obj.parent = parent
    
    # Window frame (slightly larger than glass)
    frame_depth = 0.015
    fw = w + 0.02
    fh = h + 0.02
    
    # Position centered on wall
    cx = wx + nx * frame_depth
    cy = wy + ny * frame_depth
    
    # Frame vertices
    hw, hh = fw/2, fh/2
    verts = [
        (cx - hw*nx - hh*ny, cy - hw*ny + hh*nx, z_base),  # bottom-left outer
        (cx + hw*nx - hh*ny, cy + hw*ny + hh*nx, z_base),  # bottom-right outer
        (cx + hw*nx - hh*ny, cy + hw*ny + hh*nx, z_top),   # top-right outer
        (cx - hw*nx - hh*ny, cy - hw*ny + hh*nx, z_top),   # top-left outer
        # Inner glass
        (cx - hw*nx + 0.01*ny, cy - hw*ny - 0.01*nx, z_base + 0.01),
        (cx + hw*nx + 0.01*ny, cy + hw*ny - 0.01*nx, z_base + 0.01),
        (cx + hw*nx + 0.01*ny, cy + hw*ny - 0.01*nx, z_top - 0.01),
        (cx - hw*nx + 0.01*ny, cy - hw*ny - 0.01*nx, z_top - 0.01),
    ]
    
    faces = [
        [0,1,2,3],  # frame outer
        [4,5,6,7],  # glass inner
    ]
    
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    
    return win_obj

def create_window_pane(parent, p1, p2, nx, ny, length, i, num, z_base, z_top, params, is_storefront, rng, osm_id=None):
    """Create a storefront pane."""
    dx = p2.x - p1.x
    dy = p2.y - p1.y
    t_start = i / num
    t_end = (i + 1) / num
    cx = p1.x + dx * (t_start + t_end) / 2
    cy = p1.y + dy * (t_start + t_end) / 2
    pane_w = length / num * 0.85
    
    create_single_window(parent, cx, cy, nx, ny, z_base, z_top, pane_w, z_top - z_base, params, True, rng, osm_id)

def create_cornice(name, p1, p2, height, params, rng):
    """Create decorative cornice."""
    dx = p2.x - p1.x
    dy = p2.y - p1.y
    length = math.sqrt(dx*dx + dy*dy)
    if length < 0.001: 
        mesh = bpy.data.meshes.new(name + "_mesh")
        obj = bpy.data.objects.new(name, mesh)
        bpy.context.collection.objects.link(obj)
        return obj
    
    nx = -dy / length
    ny = dx / length
    proj = params.cornice_projection
    ch = params.cornice_height
    
    v1 = (p1.x + nx*proj, p1.y + ny*proj, height)
    v2 = (p2.x + nx*proj, p2.y + ny*proj, height)
    v3 = (p2.x + nx*proj, p2.y + ny*proj, height + ch)
    v4 = (p1.x + nx*proj, p1.y + ny*proj, height + ch)
    v5 = (p1.x, p1.y, height)
    v6 = (p2.x, p2.y, height)
    v7 = (p2.x, p2.y, height + ch)
    v8 = (p1.x, p1.y, height + ch)
    
    verts = [v1,v2,v3,v4,v5,v6,v7,v8]
    faces = [[0,1,2,3],[4,5,6,7],[0,4,7,3],[1,2,6,5],[0,3,7,4],[1,5,4,2]]
    
    mesh = bpy.data.meshes.new(name + "_mesh")
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    
    return obj

def create_gable_roof(name, footprint, wall_height, pitch, params, rng):
    cx, cy = centroid_2d(footprint)
    min_x = min(p[0] for p in footprint)
    max_x = max(p[0] for p in footprint)
    min_y = min(p[1] for p in footprint)
    max_y = max(p[1] for p in footprint)
    width = max_x - min_x
    depth = max_y - min_y
    ridge_h = (min(width, depth) / 2) * pitch
    
    roof_objs = []
    for side in [-1, 1]:
        mesh = bpy.data.meshes.new(f"{name}_roof_{side}_mesh")
        obj = bpy.data.objects.new(f"{name}_roof_{side}", mesh)
        bpy.context.collection.objects.link(obj)
        
        y_center = cy + side * depth / 2
        y_ridge = cy
        
        v1 = (min_x, y_center, wall_height)
        v2 = (max_x, y_center, wall_height)
        v3 = (max_x, y_ridge, wall_height + ridge_h)
        v4 = (min_x, y_ridge, wall_height + ridge_h)
        
        verts = [v1,v2,v3,v4]
        faces = [[0,1,2,3]]
        mesh.from_pydata(verts, [], faces)
        mesh.update()
        
        roof_objs.append(obj)
    return roof_objs

def create_hip_roof(name, footprint, wall_height, pitch, params, rng):
    cx, cy = centroid_2d(footprint)
    min_x = min(p[0] for p in footprint)
    max_x = max(p[0] for p in footprint)
    min_y = min(p[1] for p in footprint)
    max_y = max(p[1] for p in footprint)
    width = max_x - min_x
    depth = max_y - min_y
    ridge_len = max(0, (max(width,depth)-min(width,depth))/2)
    ridge_h = (min(width,depth)/2) * pitch
    
    roof_objs = []
    planes = [
        {"name":"front", "verts":[(min_x,min_y,wall_height),(max_x,min_y,wall_height),(cx,cy,wall_height+ridge_h)]},
        {"name":"back", "verts":[(max_x,max_y,wall_height),(min_x,max_y,wall_height),(cx,cy,wall_height+ridge_h)]},
        {"name":"left", "verts":[(min_x,min_y,wall_height),(min_x,max_y,wall_height),(cx-ridge_len/2,cy,wall_height+ridge_h),(cx+ridge_len/2,cy,wall_height+ridge_h)]},
        {"name":"right","verts":[(max_x,max_y,wall_height),(max_x,min_y,wall_height),(cx+ridge_len/2,cy,wall_height+ridge_h),(cx-ridge_len/2,cy,wall_height+ridge_h)]},
    ]
    
    for plane in planes:
        mesh = bpy.data.meshes.new(f"{name}_roof_{plane['name']}_mesh")
        obj = bpy.data.objects.new(f"{name}_roof_{plane['name']}", mesh)
        bpy.context.collection.objects.link(obj)
        
        verts = plane["verts"]
        faces = [[0,1,2]] if len(verts)==3 else [[0,1,2,3]]
        mesh.from_pydata(verts, [], faces)
        mesh.update()
        
        roof_objs.append(obj)
    return roof_objs

def create_chimney(name, cx, cy, wall_height, roof_height, rng):
    mesh = bpy.data.meshes.new(name + "_mesh")
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    
    w = 0.15; d = 0.15
    h = roof_height - wall_height + 0.2
    
    verts = [
        (cx-w/2, cy-d/2, wall_height), (cx+w/2, cy-d/2, wall_height),
        (cx+w/2, cy+d/2, wall_height), (cx-w/2, cy+d/2, wall_height),
        (cx-w/2, cy-d/2, wall_height+h), (cx+w/2, cy-d/2, wall_height+h),
        (cx+w/2, cy+d/2, wall_height+h), (cx-w/2, cy+d/2, wall_height+h),
    ]
    faces = [[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7],[4,5,6,7],[3,2,1,0]]
    
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    
    return obj

# ─── Flap & Animation ────────────────────────────────────────────────────────

def create_flap_pairs(model_name, meshes, fold_angle, layer_start):
    """
    Create flap pairs for folding animation.
    Cornices have degenerate geometry and crash when copied, so they get only _xb (no _xf).
    """
    next_layer = layer_start
    total = len(meshes)
    for m in meshes:
        if not m.name.endswith('_xb') and not m.name.endswith('_xf'):
            m.name = f"{m.name}_xb"
        delay = 1.0 - (next_layer - layer_start) / max(1, total-1) if total>1 else 0.5
        add_hinge_userdata(m, fold_angle, delay, next_layer)
        
        # Cornices have degenerate geometry - don't copy them
        if 'cornice' not in m.name.lower():
            xf = m.copy(); xf.data = m.data.copy()
            xf.name = m.name.replace('_xb', '_xf')
            bpy.context.collection.objects.link(xf)
            add_hinge_userdata(xf, -fold_angle, delay, next_layer)
        
        next_layer += 1
    return next_layer

def setup_fold_animation(max_layer):
    action = bpy.data.actions.new(name="fold_ref")
    for obj in bpy.data.objects:
        if obj.get("hinge"):
            fa = obj.get("foldAngle", 0)
            if not obj.animation_data: obj.animation_data_create()
            obj.animation_data.action = action
            obj.rotation_euler = (0,0,0); obj.keyframe_insert("rotation_euler", frame=0)
            obj.rotation_euler = (fa,0,0); obj.keyframe_insert("rotation_euler", frame=30)
            if obj.animation_data and obj.animation_data.action:
                for fcu in obj.animation_data.action.fcurves:
                    for kp in fcu.keyframe_points: kp.interpolation = 'LINEAR'

def compute_meta(model_name, base, flaps, wall_h, roof_h):
    tris = len(base.data.polygons) if base.data else 0
    hinges = []
    all_flaps = []
    for f in flaps:
        all_flaps.append(f)
        xf = bpy.data.objects.get(f.name.replace('_xb','_xf'))
        if xf: all_flaps.append(xf)
    for f in all_flaps:
        if f.data:
            t = len(f.data.polygons)
            tris += t
            hinges.append({"name":f.name.replace(f"{model_name}__",""),"layer":f.get("layer",0),"delay":f.get("delay",0),"foldAngle":f.get("foldAngle",0),"tris":t})
    hinges.sort(key=lambda h:h["layer"])
    return {"name":model_name,"flaps":len(hinges),"top":sum(1 for h in hinges if h["foldAngle"]>0),"flatTop":0,"oob":0,"tris":tris,"maxLayer":max([h["layer"] for h in hinges]) if hinges else 0,"height":roof_h,"hinges":hinges}

def export_glb(name, path):
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', export_apply=True,
        export_animations=True, export_materials='EXPORT', export_extras=True, export_yup=True)

# ─── Building Generator ──────────────────────────────────────────────────────

def generate_building(osm_id, footprint_utm, area, levels, orientation, params, footprint_scale=0.025):
    """Generate a single building GLB from footprint and params."""
    clear_scene()
    
    rng = random.Random(osm_id)
    
    # Create shared atlas material
    atlas_mat = create_atlas_material()
    
    # Determine atlas regions for this facade type
    brick_region = FACADE_TO_BRICK_REGION.get(params.facade_type, 'bricks_red')
    window_frame_region = FACADE_TO_WINDOW_FRAME.get(params.facade_type, 'window_wood')
    cornice_region = FACADE_TO_CORNICE.get(params.facade_type, 'cornice_simple')
    roof_region = FACADE_TO_ROOF.get(params.facade_type, 'roof_terracotta')
    
    # Convert UTM footprint to world coords
    REF_E, REF_N = 450112, 4573356
    footprint = []
    for e, n in footprint_utm:
        x = (e - REF_E) * 0.5
        z = -(n - REF_N) * 0.5
        footprint.append((x * footprint_scale, z * footprint_scale))
    
    # Center at origin
    cx, cy = centroid_2d(footprint)
    footprint = [(x-cx, z-cy) for x,z in footprint]
    
    wall_h = levels * 0.35
    
    # Base
    base = create_base_mesh(f"{osm_id}__base", footprint, 0, rng)
    base.data.materials.append(atlas_mat)
    
    # Walls
    walls = []
    for i in range(len(footprint)):
        p1 = Vector(footprint[i])
        p2 = Vector(footprint[(i+1)%len(footprint)])
        # Skip degenerate edges (zero length)
        if (p1 - p2).length < 0.001:
            continue
        wall = create_facade_wall(f"{osm_id}__wall_{i}", p1, p2, wall_h, levels, params, i, rng, osm_id)
        wall.data.materials.append(atlas_mat)
        walls.append(wall)
    
    # UV unwrap walls
    for wall in walls:
        unwrap_and_assign(wall, brick_region)
    
    # UV unwrap windows (children of walls)
    for wall in walls:
        for child in wall.children:
            if 'window' in child.name.lower():
                unwrap_and_assign(child, window_frame_region)
    
    # Cornices
    cornices = []
    for i in range(len(footprint)):
        p1 = Vector(footprint[i])
        p2 = Vector(footprint[(i+1)%len(footprint)])
        # Skip degenerate edges
        if (p1 - p2).length < 0.001:
            continue
        cornice = create_cornice(f"{osm_id}__cornice_{i}", p1, p2, wall_h, params, rng)
        cornice.data.materials.append(atlas_mat)
        cornices.append(cornice)
    
    # UV unwrap cornices
    for cornice in cornices:
        unwrap_and_assign(cornice, cornice_region)
    
    # Roof
    if params.roof_type == "gable":
        roof = create_gable_roof(osm_id, footprint, wall_h, params.roof_pitch, params, rng)
    else:
        roof = create_hip_roof(osm_id, footprint, wall_h, params.roof_pitch, params, rng)
    for r in roof: r.data.materials.append(atlas_mat)
    
    # UV unwrap roof
    for r in roof:
        unwrap_and_assign(r, roof_region)
    
    # Chimneys
    chimneys = []
    if params.chimney_count > 0:
        cx, cy = centroid_2d(footprint)
        for i in range(params.chimney_count):
            ch = create_chimney(f"{osm_id}__chimney_{i}", cx + (i-0.5)*0.3, cy, wall_h, wall_h+0.5, rng)
            chimneys.append(ch)
            ch.data.materials.append(atlas_mat)
    
    # UV unwrap chimneys (brick)
    for ch in chimneys:
        unwrap_and_assign(ch, brick_region)
    
    # Base UV unwrap (ground plane - use paper/mortar)
    unwrap_and_assign(base, 'mortar_light')
    
    # Flaps & animation
    # NOTE: Cornices have degenerate geometry and crash when copied.
    # They get only _xb (fold up), not _xf (fold down).
    all_flaps = walls + roof + chimneys  # exclude cornices from _xf copy
    max_layer = create_flap_pairs(str(osm_id), all_flaps, math.pi/2, 1)
    setup_fold_animation(max_layer)
    
    # Meta
    meta = compute_meta(str(osm_id), base, all_flaps, wall_h, wall_h + 0.5)
    
    return {"osm_id": osm_id, "meta": meta, "params": params}

# ─── Main Batch Generation ───────────────────────────────────────────────────

def load_registry():
    """Load building registry with OSM tags."""
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
        
        # Estimate levels
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
    argv = sys.argv
    if "--" in argv:
        argv = argv[argv.index("--")+1:]
    else:
        argv = []
    
    out_dir = "/home/clawman/papertrails-laramie-original/public/models/buildings"
    os.makedirs(out_dir, exist_ok=True)
    
    # Parse arguments
    test_osm_id = None
    if "--test" in argv:
        # Quick test with first building
        registry = load_registry()
        b = registry[0]
        params = classify_facade(b['props'], b['area'], b['levels'])
        result = generate_building(b['osm_id'], b['footprint'], b['area'], b['levels'], b['orientation'], params)
        glb_path = os.path.join(out_dir, f"{b['osm_id']}.glb")
        export_glb(str(b['osm_id']), glb_path)
        print(f"Test generated: {glb_path}")
        return
    
    if "--test-osm" in argv:
        test_osm_id = argv[argv.index("--test-osm")+1]
    
    if "--generate-all" in argv:
        print("Loading registry...")
        registry = load_registry()
        print(f"Generating {len(registry)} buildings...")
        
        for i, b in enumerate(registry):
            if i % 50 == 0:
                print(f"  {i}/{len(registry)}")
            
            glb_path = os.path.join(out_dir, f"{b['osm_id']}.glb")
            if os.path.exists(glb_path):
                continue
            
            params = classify_facade(b['props'], b['area'], b['levels'])
            result = generate_building(b['osm_id'], b['footprint'], b['area'], b['levels'], b['orientation'], params)
            
            glb_path = os.path.join(out_dir, f"{b['osm_id']}.glb")
            export_glb(str(b['osm_id']), glb_path)
        
        print("Done generating buildings!")
        return
    
    if test_osm_id:
        # Generate specific building by OSM ID
        registry = load_registry()
        for b in registry:
            if str(b['osm_id']) == str(test_osm_id):
                params = classify_facade(b['props'], b['area'], b['levels'])
                result = generate_building(b['osm_id'], b['footprint'], b['area'], b['levels'], b['orientation'], params)
                glb_path = os.path.join(out_dir, f"{b['osm_id']}.glb")
                export_glb(str(b['osm_id']), glb_path)
                print(f"Generated: {glb_path}")
                return
        print(f"Building {test_osm_id} not found in registry")
        return
    
    print("Usage: --test or --generate-all or --test-osm <osm_id>")

if __name__ == "__main__":
    main()