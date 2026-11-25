#!/usr/bin/env python3
"""
Generate Custom Landmark Models for Paper Trails Laramie
Uses Blender headless to create 10 recognizable landmark buildings.
Each landmark uses the facade atlas texture with UV mapping.
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
REFERENCES_PATH = "/home/clawman/papertrails-laramie-original/tools/blender/landmark_references.json"

# Output directory
OUT_DIR = "/home/clawman/papertrails-laramie-original/public/models/landmarks"

# ─── Utility Functions (shared with generate_facade.py) ──────────────────────

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
    with open(ATLAS_MANIFEST_PATH) as f:
        data = json.load(f)
    return data['regions']

ATLAS_REGIONS = load_atlas_manifest()

def get_region_uv(region_name: str) -> Tuple[float, float, float, float]:
    r = ATLAS_REGIONS.get(region_name)
    if not r:
        r = ATLAS_REGIONS['bricks_red']
    return (r['uv'][0], r['uv'][1], r['uv'][2], r['uv'][3])

def create_atlas_material():
    mat = bpy.data.materials.new(name="FacadeAtlas")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    for node in nodes:
        nodes.remove(node)
    
    tex_coord = nodes.new('ShaderNodeTexCoord')
    tex_coord.location = (-600, 0)
    
    tex_image = nodes.new('ShaderNodeTexImage')
    tex_image.location = (-400, 0)
    tex_image.image = bpy.data.images.load(ATLAS_IMAGE_PATH)
    tex_image.interpolation = 'Linear'
    tex_image.extension = 'REPEAT'
    
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    bsdf.location = (-100, 0)
    bsdf.inputs['Roughness'].default_value = 0.8
    if 'Specular IOR Level' in bsdf.inputs:
        bsdf.inputs['Specular IOR Level'].default_value = 0.1
    elif 'Specular' in bsdf.inputs:
        bsdf.inputs['Specular'].default_value = 0.1
    
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
    if not mesh.uv_layers:
        mesh.uv_layers.new()
    return mesh.uv_layers.active

def scale_uv_to_region(mesh, uv_layer, region_name):
    u0, v0, u1, v1 = get_region_uv(region_name)
    u_scale = u1 - u0
    v_scale = v1 - v0
    
    for poly in mesh.polygons:
        for loop_idx in poly.loop_indices:
            uv = uv_layer.data[loop_idx].uv
            uv.x = u0 + uv.x * u_scale
            uv.y = v0 + uv.y * v_scale

def unwrap_and_assign(mesh_obj, region_name):
    mesh = mesh_obj.data
    uv_layer = ensure_uv_layer(mesh)
    
    bpy.context.view_layer.objects.active = mesh_obj
    mesh_obj.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.smart_project(angle_limit=66, island_margin=0.01, area_weight=0.0, correct_aspect=True)
    bpy.ops.object.mode_set(mode='OBJECT')
    mesh_obj.select_set(False)
    
    scale_uv_to_region(mesh, uv_layer, region_name)

def create_flap_pairs(model_name, meshes, fold_angle, layer_start):
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

# ─── Landmark-Specific Generators ────────────────────────────────────────────

def create_depot(name, params):
    """U.P. Railroad Depot - Single story with platform canopy, bay window, footbridge."""
    atlas_mat = create_atlas_material()
    
    # Base footprint: 2x2 tile, depot is long along tracks
    footprint = [(-1, -0.5), (1, -0.5), (1, 0.5), (-1, 0.5)]
    height = 0.35  # 1 story
    
    # Main building
    base = create_base_mesh(f"{name}__base", footprint, 0)
    base.data.materials.append(atlas_mat)
    
    # Walls - long sides along X axis
    walls = []
    wall_h = height
    for i in range(len(footprint)):
        p1 = Vector(footprint[i])
        p2 = Vector(footprint[(i+1)%len(footprint)])
        if (p1 - p2).length < 0.001: continue
        wall = create_facade_wall_simple(f"{name}__wall_{i}", p1, p2, wall_h, 1, atlas_mat, 'bricks_red', 'window_wood')
        walls.append(wall)
    
    # Platform canopy on track side (positive Z)
    canopy = create_canopy(f"{name}__canopy", Vector((-1, 0.5)), Vector((1, 0.5)), height, 0.6, atlas_mat)
    
    # Bay window on track side
    bay = create_bay_window(f"{name}__bay", Vector((0, 0.5)), 0.6, 0.4, height, atlas_mat)
    
    # Roof - gable along X
    roof = create_gable_roof_simple(f"{name}", footprint, wall_h, 0.5, atlas_mat, 'roof_terracotta')
    
    # Footbridge (separate structure over tracks)
    bridge = create_footbridge(f"{name}__bridge", Vector((-1, 1.5)), Vector((1, 1.5)), 0.3, atlas_mat)
    
    # UV unwrap
    unwrap_and_assign(base, 'mortar_light')
    for w in walls: unwrap_and_assign(w, 'bricks_red')
    unwrap_and_assign(canopy, 'roof_terracotta')
    unwrap_and_assign(bay, 'bricks_red')
    for r in roof: unwrap_and_assign(r, 'roof_terracotta')
    unwrap_and_assign(bridge, 'bricks_red')
    
    # Flaps
    all_flaps = walls + roof + [canopy, bay, bridge]
    max_layer = create_flap_pairs(name, all_flaps, math.pi/2, 1)
    setup_fold_animation(max_layer)
    
    meta = compute_meta(name, base, all_flaps, wall_h, wall_h + 0.5)
    return meta

def create_city_hall(name, params):
    """City Hall & Fire Station - 2 story with clock tower, garage doors."""
    atlas_mat = create_atlas_material()
    
    footprint = [(-0.8, -0.6), (0.8, -0.6), (0.8, 0.6), (-0.8, 0.6)]
    height = 0.7  # 2 stories
    
    base = create_base_mesh(f"{name}__base", footprint, 0)
    base.data.materials.append(atlas_mat)
    
    walls = []
    wall_h = height
    for i in range(len(footprint)):
        p1 = Vector(footprint[i])
        p2 = Vector(footprint[(i+1)%len(footprint)])
        if (p1 - p2).length < 0.001: continue
        # Front side (negative Z) gets garage doors
        region = 'bricks_dark_red'
        window_region = 'window_metal' if i == 0 else 'window_stone'
        wall = create_facade_wall_simple(f"{name}__wall_{i}", p1, p2, wall_h, 2, atlas_mat, region, window_region)
        walls.append(wall)
    
    # Clock tower on top center
    tower = create_clock_tower(f"{name}__tower", Vector((0, 0)), 0.4, 0.6, atlas_mat)
    
    # Garage doors on front (wall 0 - negative Z)
    garage = create_garage_doors(f"{name}__garage", Vector((-0.6, -0.6)), Vector((0.6, -0.6)), height, atlas_mat)
    
    # Roof - flat with parapet
    roof = create_flat_roof_simple(f"{name}", footprint, wall_h, 0.1, atlas_mat, 'roof_membrane')
    
    # Cornice
    cornices = []
    for i in range(len(footprint)):
        p1 = Vector(footprint[i])
        p2 = Vector(footprint[(i+1)%len(footprint)])
        if (p1 - p2).length < 0.001: continue
        cornice = create_cornice_simple(f"{name}__cornice_{i}", p1, p2, wall_h, atlas_mat)
        cornices.append(cornice)
    
    # UV unwrap
    unwrap_and_assign(base, 'mortar_light')
    for w in walls: unwrap_and_assign(w, 'bricks_dark_red')
    unwrap_and_assign(tower, 'bricks_dark_red')
    unwrap_and_assign(garage, 'door_wood')
    for r in roof: unwrap_and_assign(r, 'roof_membrane')
    for c in cornices: unwrap_and_assign(c, 'cornice_simple')
    
    all_flaps = walls + roof + [tower, garage] + cornices
    max_layer = create_flap_pairs(name, all_flaps, math.pi/2, 1)
    setup_fold_animation(max_layer)
    
    meta = compute_meta(name, base, all_flaps, wall_h, wall_h + 0.7)
    return meta

def create_masonic_temple(name, params):
    """Masonic Temple - 3 story Neoclassical with portico."""
    atlas_mat = create_atlas_material()
    
    footprint = [(-0.7, -0.6), (0.7, -0.6), (0.7, 0.6), (-0.7, 0.6)]
    height = 1.05  # 3 stories
    
    base = create_base_mesh(f"{name}__base", footprint, 0)
    base.data.materials.append(atlas_mat)
    
    walls = []
    wall_h = height
    for i in range(len(footprint)):
        p1 = Vector(footprint[i])
        p2 = Vector(footprint[(i+1)%len(footprint)])
        if (p1 - p2).length < 0.001: continue
        wall = create_facade_wall_simple(f"{name}__wall_{i}", p1, p2, wall_h, 3, atlas_mat, 'bricks_buff', 'window_stone')
        walls.append(wall)
    
    # Portico on front (negative Z)
    portico = create_portico(f"{name}__portico", Vector((-0.7, -0.6)), Vector((0.7, -0.6)), wall_h, 0.5, atlas_mat)
    
    # Masonic symbol on pediment
    symbol = create_masonic_symbol(f"{name}__symbol", Vector((0, -0.8)), 0.4, atlas_mat)
    
    # Roof - flat with balustrade
    roof = create_flat_roof_simple(f"{name}", footprint, wall_h, 0.1, atlas_mat, 'roof_membrane')
    balustrade = create_balustrade(f"{name}__balustrade", footprint, wall_h + 0.1, atlas_mat)
    
    # Cornice with dentils
    cornices = []
    for i in range(len(footprint)):
        p1 = Vector(footprint[i])
        p2 = Vector(footprint[(i+1)%len(footprint)])
        if (p1 - p2).length < 0.001: continue
        cornice = create_cornice_simple(f"{name}__cornice_{i}", p1, p2, wall_h, atlas_mat)
        cornices.append(cornice)
    
    # UV unwrap
    unwrap_and_assign(base, 'mortar_light')
    for w in walls: unwrap_and_assign(w, 'bricks_buff')
    unwrap_and_assign(portico, 'bricks_buff')
    unwrap_and_assign(symbol, 'sign_fascia')
    for r in roof: unwrap_and_assign(r, 'roof_membrane')
    unwrap_and_assign(balustrade, 'bricks_buff')
    for c in cornices: unwrap_and_assign(c, 'cornice_dentil')
    
    all_flaps = walls + roof + [portico, symbol, balustrade] + cornices
    max_layer = create_flap_pairs(name, all_flaps, math.pi/2, 1)
    setup_fold_animation(max_layer)
    
    meta = compute_meta(name, base, all_flaps, wall_h, wall_h + 0.2)
    return meta

def create_cathedral(name, params):
    """St. Matthew's Cathedral - Gothic with spire, buttresses, stained glass."""
    atlas_mat = create_atlas_material()
    
    # Cruciform footprint
    footprint = [(-0.6, -1), (0.6, -1), (0.6, -0.2), (1, -0.2), (1, 0.2), (0.6, 0.2), (0.6, 1), (-0.6, 1), (-0.6, 0.2), (-1, 0.2), (-1, -0.2), (-0.6, -0.2)]
    height = 0.7  # 2 stories (nave)
    
    base = create_base_mesh(f"{name}__base", footprint, 0)
    base.data.materials.append(atlas_mat)
    
    walls = []
    wall_h = height
    for i in range(len(footprint)):
        p1 = Vector(footprint[i])
        p2 = Vector(footprint[(i+1)%len(footprint)])
        if (p1 - p2).length < 0.001: continue
        wall = create_facade_wall_simple(f"{name}__wall_{i}", p1, p2, wall_h, 2, atlas_mat, 'bricks_brown', 'glass_stained')
        walls.append(wall)
    
    # Buttresses on long sides
    buttresses = []
    for i in range(0, len(footprint), 3):
        p1 = Vector(footprint[i])
        p2 = Vector(footprint[(i+1)%len(footprint)])
        if (p1 - p2).length < 0.001: continue
        # Create buttress projecting outward
        buttress = create_buttress(f"{name}__buttress_{i}", p1, p2, wall_h, 0.2, atlas_mat)
        buttresses.append(buttress)
    
    # Bell tower with spire at crossing
    tower = create_bell_tower(f"{name}__tower", Vector((0, 0)), 0.5, 1.5, atlas_mat)
    
    # Nave roof - steep gable
    roof = create_gable_roof_simple(f"{name}", footprint, wall_h, 1.0, atlas_mat, 'roof_slate')
    
    # Cross finials
    crosses = create_cross_finials(f"{name}", footprint, wall_h + 1.0, atlas_mat)
    
    # UV unwrap
    unwrap_and_assign(base, 'mortar_light')
    for w in walls: unwrap_and_assign(w, 'bricks_brown')
    for b in buttresses: unwrap_and_assign(b, 'bricks_brown')
    unwrap_and_assign(tower, 'bricks_brown')
    for r in roof: unwrap_and_assign(r, 'roof_slate')
    for c in crosses: unwrap_and_assign(c, 'sign_blade')
    
    all_flaps = walls + roof + [tower] + buttresses + crosses
    max_layer = create_flap_pairs(name, all_flaps, math.pi/2, 1)
    setup_fold_animation(max_layer)
    
    meta = compute_meta(name, base, all_flaps, wall_h, wall_h + 1.5)
    return meta

def create_bank(name, params):
    """First Interstate Bank - Neoclassical with columns, round arches."""
    atlas_mat = create_atlas_material()
    
    footprint = [(-0.7, -0.5), (0.7, -0.5), (0.7, 0.5), (-0.7, 0.5)]
    height = 0.7  # 2 stories
    
    base = create_base_mesh(f"{name}__base", footprint, 0)
    base.data.materials.append(atlas_mat)
    
    walls = []
    wall_h = height
    for i in range(len(footprint)):
        p1 = Vector(footprint[i])
        p2 = Vector(footprint[(i+1)%len(footprint)])
        if (p1 - p2).length < 0.001: continue
        wall = create_facade_wall_simple(f"{name}__wall_{i}", p1, p2, wall_h, 2, atlas_mat, 'bricks_buff', 'window_stone')
        walls.append(wall)
    
    # Columns on front
    columns = create_columns(f"{name}__columns", Vector((-0.7, -0.5)), Vector((0.7, -0.5)), wall_h, 6, atlas_mat)
    
    # Corner entrance
    entrance = create_corner_entrance(f"{name}__entrance", Vector((0.7, -0.5)), Vector((0.7, 0.5)), wall_h, atlas_mat)
    
    # Roof - flat with modillion cornice
    roof = create_flat_roof_simple(f"{name}", footprint, wall_h, 0.1, atlas_mat, 'roof_membrane')
    
    # Cornice with modillions
    cornices = []
    for i in range(len(footprint)):
        p1 = Vector(footprint[i])
        p2 = Vector(footprint[(i+1)%len(footprint)])
        if (p1 - p2).length < 0.001: continue
        cornice = create_cornice_simple(f"{name}__cornice_{i}", p1, p2, wall_h, atlas_mat)
        cornices.append(cornice)
    
    # UV unwrap
    unwrap_and_assign(base, 'mortar_light')
    for w in walls: unwrap_and_assign(w, 'bricks_buff')
    unwrap_and_assign(columns, 'bricks_buff')
    unwrap_and_assign(entrance, 'door_wood')
    for r in roof: unwrap_and_assign(r, 'roof_membrane')
    for c in cornices: unwrap_and_assign(c, 'cornice_modillion')
    
    all_flaps = walls + roof + [columns, entrance] + cornices
    max_layer = create_flap_pairs(name, all_flaps, math.pi/2, 1)
    setup_fold_animation(max_layer)
    
    meta = compute_meta(name, base, all_flaps, wall_h, wall_h + 0.1)
    return meta

def create_courthouse(name, params):
    """Albany County Courthouse - Beaux-Arts with dome, portico, grand stairs."""
    atlas_mat = create_atlas_material()
    
    footprint = [(-1, -0.7), (1, -0.7), (1, 0.7), (-1, 0.7)]
    height = 1.05  # 3 stories
    
    base = create_base_mesh(f"{name}__base", footprint, 0)
    base.data.materials.append(atlas_mat)
    
    walls = []
    wall_h = height
    for i in range(len(footprint)):
        p1 = Vector(footprint[i])
        p2 = Vector(footprint[(i+1)%len(footprint)])
        if (p1 - p2).length < 0.001: continue
        wall = create_facade_wall_simple(f"{name}__wall_{i}", p1, p2, wall_h, 3, atlas_mat, 'bricks_brown', 'window_stone')
        walls.append(wall)
    
    # Grand portico with columns
    portico = create_grand_portico(f"{name}__portico", Vector((-1, -0.7)), Vector((1, -0.7)), wall_h, 1, atlas_mat)
    
    # Grand staircase
    stairs = create_grand_stairs(f"{name}__stairs", Vector((-0.5, -0.7)), Vector((0.5, -0.7)), 0.5, atlas_mat)
    
    # Dome on top
    dome = create_dome(f"{name}__dome", Vector((0, 0)), 0.6, 0.8, atlas_mat)
    
    # Clock faces on dome
    clocks = create_clock_faces(f"{name}__clocks", Vector((0, 0)), 0.6, wall_h + 0.8, atlas_mat)
    
    # Roof sections
    roof = create_flat_roof_simple(f"{name}", footprint, wall_h, 0.1, atlas_mat, 'roof_membrane')
    
    # Cornices
    cornices = []
    for i in range(len(footprint)):
        p1 = Vector(footprint[i])
        p2 = Vector(footprint[(i+1)%len(footprint)])
        if (p1 - p2).length < 0.001: continue
        cornice = create_cornice_simple(f"{name}__cornice_{i}", p1, p2, wall_h, atlas_mat)
        cornices.append(cornice)
    
    # UV unwrap
    unwrap_and_assign(base, 'mortar_light')
    for w in walls: unwrap_and_assign(w, 'bricks_brown')
    unwrap_and_assign(dome, 'roof_slate')
    for r in roof: unwrap_and_assign(r, 'roof_membrane')
    for c in cornices: unwrap_and_assign(c, 'cornice_dentil')
    
    all_flaps = walls + roof + [portico, stairs, dome, clocks] + cornices
    max_layer = create_flap_pairs(name, all_flaps, math.pi/2, 1)
    setup_fold_animation(max_layer)
    
    meta = compute_meta(name, base, all_flaps, wall_h, wall_h + 0.8)
    return meta

def create_theatre(name, params):
    """Wyo Theatre - Art Deco with blade sign, marquee, ticket booth."""
    atlas_mat = create_atlas_material()
    
    footprint = [(-0.8, -0.5), (0.8, -0.5), (0.8, 0.5), (-0.8, 0.5)]
    height = 0.7  # 2 stories
    
    base = create_base_mesh(f"{name}__base", footprint, 0)
    base.data.materials.append(atlas_mat)
    
    walls = []
    wall_h = height
    for i in range(len(footprint)):
        p1 = Vector(footprint[i])
        p2 = Vector(footprint[(i+1)%len(footprint)])
        if (p1 - p2).length < 0.001: continue
        wall = create_facade_wall_simple(f"{name}__wall_{i}", p1, p2, wall_h, 2, atlas_mat, 'bricks_dark_red', 'window_metal')
        walls.append(wall)
    
    # Marquee canopy
    marquee = create_marquee(f"{name}__marquee", Vector((-0.8, -0.5)), Vector((0.8, -0.5)), 0.8, 0.3, atlas_mat)
    
    # Blade sign "WYO"
    blade_sign = create_blade_sign(f"{name}__blade", Vector((0, -0.7)), 0.3, 1.0, atlas_mat)
    
    # Ticket booth
    booth = create_ticket_booth(f"{name}__booth", Vector((-0.5, -0.5)), 0.3, 0.3, 0.4, atlas_mat)
    
    # Stepped parapet
    parapet = create_stepped_parapet(f"{name}__parapet", footprint, wall_h, atlas_mat)
    
    # Roof
    roof = create_flat_roof_simple(f"{name}", footprint, wall_h, 0.1, atlas_mat, 'roof_membrane')
    
    # UV unwrap
    unwrap_and_assign(base, 'mortar_light')
    for w in walls: unwrap_and_assign(w, 'bricks_dark_red')
    unwrap_and_assign(marquee, 'sign_awning')
    unwrap_and_assign(blade_sign, 'sign_blade')
    unwrap_and_assign(booth, 'bricks_dark_red')
    unwrap_and_assign(parapet, 'bricks_dark_red')
    for r in roof: unwrap_and_assign(r, 'roof_membrane')
    
    all_flaps = walls + roof + [marquee, blade_sign, booth, parapet]
    max_layer = create_flap_pairs(name, all_flaps, math.pi/2, 1)
    setup_fold_animation(max_layer)
    
    meta = compute_meta(name, base, all_flaps, wall_h, wall_h + 0.3)
    return meta

def create_fire_station(name, params):
    """Laramie Fire Station - Romanesque with garage doors, hose tower."""
    atlas_mat = create_atlas_material()
    
    footprint = [(-0.9, -0.5), (0.9, -0.5), (0.9, 0.5), (-0.9, 0.5)]
    height = 0.7  # 2 stories
    
    base = create_base_mesh(f"{name}__base", footprint, 0)
    base.data.materials.append(atlas_mat)
    
    walls = []
    wall_h = height
    for i in range(len(footprint)):
        p1 = Vector(footprint[i])
        p2 = Vector(footprint[(i+1)%len(footprint)])
        if (p1 - p2).length < 0.001: continue
        wall = create_facade_wall_simple(f"{name}__wall_{i}", p1, p2, wall_h, 2, atlas_mat, 'bricks_red', 'window_stone')
        walls.append(wall)
    
    # Three arched garage doors on front
    garage = create_garage_doors(f"{name}__garage", Vector((-0.7, -0.5)), Vector((0.7, -0.5)), height, atlas_mat)
    
    # Hose drying tower (corner)
    hose_tower = create_hose_tower(f"{name}__hose_tower", Vector((0.9, 0)), 0.4, 1.5, atlas_mat)
    
    # Arched windows on sides
    arches = create_arched_windows(f"{name}__arches", walls, wall_h, atlas_mat)
    
    # Roof
    roof = create_flat_roof_simple(f"{name}", footprint, wall_h, 0.1, atlas_mat, 'roof_membrane')
    
    # Cornice
    cornices = []
    for i in range(len(footprint)):
        p1 = Vector(footprint[i])
        p2 = Vector(footprint[(i+1)%len(footprint)])
        if (p1 - p2).length < 0.001: continue
        cornice = create_cornice_simple(f"{name}__cornice_{i}", p1, p2, wall_h, atlas_mat)
        cornices.append(cornice)
    
    # UV unwrap
    unwrap_and_assign(base, 'mortar_light')
    for w in walls: unwrap_and_assign(w, 'bricks_red')
    unwrap_and_assign(garage, 'door_wood')
    unwrap_and_assign(hose_tower, 'bricks_red')
    for a in arches: unwrap_and_assign(a, 'bricks_red')
    for r in roof: unwrap_and_assign(r, 'roof_membrane')
    for c in cornices: unwrap_and_assign(c, 'cornice_bracketed')
    
    all_flaps = walls + roof + [garage, hose_tower] + arches + cornices
    max_layer = create_flap_pairs(name, all_flaps, math.pi/2, 1)
    setup_fold_animation(max_layer)
    
    meta = compute_meta(name, base, all_flaps, wall_h, wall_h + 1.5)
    return meta

def create_durlacher_house(name, params):
    """Durlacher House - Queen Anne with wrap porch, bay window, gingerbread."""
    atlas_mat = create_atlas_material()
    
    footprint = [(-0.6, -0.5), (0.6, -0.5), (0.6, 0.5), (-0.6, 0.5)]
    height = 0.7  # 2 stories
    
    base = create_base_mesh(f"{name}__base", footprint, 0)
    base.data.materials.append(atlas_mat)
    
    walls = []
    wall_h = height
    for i in range(len(footprint)):
        p1 = Vector(footprint[i])
        p2 = Vector(footprint[(i+1)%len(footprint)])
        if (p1 - p2).length < 0.001: continue
        wall = create_facade_wall_simple(f"{name}__wall_{i}", p1, p2, wall_h, 2, atlas_mat, 'bricks_red', 'window_wood')
        walls.append(wall)
    
    # Wrap-around porch
    porch = create_wrap_porch(f"{name}__porch", footprint, 0.5, wall_h, atlas_mat)
    
    # Bay window on front
    bay = create_bay_window(f"{name}__bay", Vector((0, -0.5)), 0.5, 0.3, height * 0.8, atlas_mat)
    
    # Gingerbread trim on gables
    gingerbread = create_gingerbread(f"{name}__gingerbread", footprint, wall_h, atlas_mat)
    
    # Patterned shingles in gables
    gable_shingles = create_gable_shingles(f"{name}__gable_shingles", footprint, wall_h, atlas_mat)
    
    # Hipped roof with dormers
    roof = create_hip_roof_simple(f"{name}", footprint, wall_h, 0.6, atlas_mat, 'roof_terracotta')
    
    # Dormers
    dormers = create_dormers(f"{name}__dormers", footprint, wall_h, atlas_mat)
    
    # Brick chimneys
    chimneys = []
    for i in range(2):
        cx, cy = centroid_2d(footprint)
        ch = create_chimney_simple(f"{name}__chimney_{i}", Vector((cx + (i-0.5)*0.4, cy)), wall_h, wall_h + 0.5, atlas_mat)
        chimneys.append(ch)
    
    # UV unwrap
    unwrap_and_assign(base, 'mortar_light')
    for w in walls: unwrap_and_assign(w, 'bricks_red')
    unwrap_and_assign(porch, 'bricks_red')
    unwrap_and_assign(bay, 'bricks_red')
    unwrap_and_assign(gingerbread, 'sign_fascia')
    unwrap_and_assign(gable_shingles, 'roof_shingle')
    for r in roof: unwrap_and_assign(r, 'roof_terracotta')
    unwrap_and_assign(dormers, 'roof_terracotta')
    for ch in chimneys: unwrap_and_assign(ch, 'bricks_red')
    
    all_flaps = walls + roof + [porch, bay, gingerbread, gable_shingles, dormers] + chimneys
    max_layer = create_flap_pairs(name, all_flaps, math.pi/2, 1)
    setup_fold_animation(max_layer)
    
    meta = compute_meta(name, base, all_flaps, wall_h, wall_h + 0.6)
    return meta

def create_blair_house(name, params):
    """Blair House - Colonial Revival with front porch, bay window, dormers."""
    atlas_mat = create_atlas_material()
    
    footprint = [(-0.6, -0.5), (0.6, -0.5), (0.6, 0.5), (-0.6, 0.5)]
    height = 0.7  # 2 stories
    
    base = create_base_mesh(f"{name}__base", footprint, 0)
    base.data.materials.append(atlas_mat)
    
    walls = []
    wall_h = height
    for i in range(len(footprint)):
        p1 = Vector(footprint[i])
        p2 = Vector(footprint[(i+1)%len(footprint)])
        if (p1 - p2).length < 0.001: continue
        wall = create_facade_wall_simple(f"{name}__wall_{i}", p1, p2, wall_h, 2, atlas_mat, 'bricks_buff', 'window_wood')
        walls.append(wall)
    
    # Front porch with columns
    porch = create_front_porch(f"{name}__porch", Vector((-0.6, -0.5)), Vector((0.6, -0.5)), 0.5, wall_h, atlas_mat)
    
    # Two-story bay window
    bay = create_bay_window(f"{name}__bay", Vector((0.6, 0)), 0.4, 0.5, height, atlas_mat)
    
    # Hipped roof with dormers
    roof = create_hip_roof_simple(f"{name}", footprint, wall_h, 0.5, atlas_mat, 'roof_shingle')
    
    # Dormers
    dormers = create_dormers(f"{name}__dormers", footprint, wall_h, atlas_mat)
    
    # Side portico
    portico = create_side_portico(f"{name}__portico", Vector((-0.6, 0)), Vector((-0.6, 0.5)), wall_h, 0.4, atlas_mat)
    
    # Chimneys
    chimneys = []
    for i in range(2):
        cx, cy = centroid_2d(footprint)
        ch = create_chimney_simple(f"{name}__chimney_{i}", Vector((cx + (i-0.5)*0.4, cy)), wall_h, wall_h + 0.4, atlas_mat)
        chimneys.append(ch)
    
    # UV unwrap
    unwrap_and_assign(base, 'mortar_light')
    for w in walls: unwrap_and_assign(w, 'bricks_buff')
    unwrap_and_assign(porch, 'bricks_buff')
    unwrap_and_assign(bay, 'bricks_buff')
    for r in roof: unwrap_and_assign(r, 'roof_shingle')
    unwrap_and_assign(dormers, 'roof_shingle')
    unwrap_and_assign(portico, 'bricks_buff')
    for ch in chimneys: unwrap_and_assign(ch, 'bricks_buff')
    
    all_flaps = walls + roof + [porch, bay, portico, dormers] + chimneys
    max_layer = create_flap_pairs(name, all_flaps, math.pi/2, 1)
    setup_fold_animation(max_layer)
    
    meta = compute_meta(name, base, all_flaps, wall_h, wall_h + 0.5)
    return meta

# ─── Simplified Helper Functions ─────────────────────────────────────────────

def create_base_mesh(name, footprint, height=0.0):
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

def create_facade_wall_simple(name, p1, p2, height, levels, mat, brick_region, window_region):
    CARD_THICKNESS = 0.016
    mesh = bpy.data.meshes.new(name + "_mesh")
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    
    dx = p2.x - p1.x
    dy = p2.y - p1.y
    length = math.sqrt(dx*dx + dy*dy)
    if length < 0.01: return obj
    
    nx = -dy / length
    ny = dx / length
    level_height = height / levels
    
    vertices = []
    faces = []
    
    for level in range(levels):
        z_base = level * level_height
        z_top = (level + 1) * level_height
        
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
        
        faces.append([base_idx + 0, base_idx + 1, base_idx + 2, base_idx + 3])
        faces.append([base_idx + 4, base_idx + 5, base_idx + 6, base_idx + 7])
        faces.append([base_idx + 0, base_idx + 1, base_idx + 5, base_idx + 4])
        faces.append([base_idx + 3, base_idx + 2, base_idx + 6, base_idx + 7])
        faces.append([base_idx + 0, base_idx + 4, base_idx + 7, base_idx + 3])
        faces.append([base_idx + 1, base_idx + 2, base_idx + 6, base_idx + 5])
    
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    obj.data.materials.append(mat)
    return obj

def create_canopy(name, p1, p2, height, projection, mat):
    mesh = bpy.data.meshes.new(name + "_mesh")
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    
    dx = p2.x - p1.x
    dy = p2.y - p1.y
    length = math.sqrt(dx*dx + dy*dy)
    nx = -dy / length
    ny = dx / length
    
    v1 = (p1.x + nx*projection, p1.y + ny*projection, height)
    v2 = (p2.x + nx*projection, p2.y + ny*projection, height)
    v3 = (p2.x, p2.y, height)
    v4 = (p1.x, p1.y, height)
    
    verts = [v1,v2,v3,v4]
    faces = [[0,1,2,3]]
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj.data.materials.append(mat)
    return obj

def create_bay_window(name, center, width, depth, height, mat):
    mesh = bpy.data.meshes.new(name + "_mesh")
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    
    cx, cy = center.x, center.y
    hw, hd = width/2, depth
    
    verts = [
        (cx-hw, cy, 0.1),
        (cx+hw, cy, 0.1),
        (cx+hw, cy+hd, 0.1),
        (cx-hw, cy+hd, 0.1),
        (cx-hw, cy, height),
        (cx+hw, cy, height),
        (cx+hw, cy+hd, height),
        (cx-hw, cy+hd, height),
    ]
    faces = [[0,1,2,3],[4,5,6,7],[0,4,7,3],[1,5,4,2],[0,1,5,4],[2,3,7,6]]
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj.data.materials.append(mat)
    return obj

def create_gable_roof_simple(name, footprint, wall_h, pitch, mat, region):
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
        
        v1 = (min_x, y_center, wall_h)
        v2 = (max_x, y_center, wall_h)
        v3 = (max_x, y_ridge, wall_h + ridge_h)
        v4 = (min_x, y_ridge, wall_h + ridge_h)
        
        verts = [v1,v2,v3,v4]
        faces = [[0,1,2,3]]
        mesh.from_pydata(verts, [], faces)
        mesh.update()
        obj.data.materials.append(mat)
        roof_objs.append(obj)
    return roof_objs

def create_flat_roof_simple(name, footprint, wall_h, thickness, mat, region):
    mesh = bpy.data.meshes.new(f"{name}_roof_mesh")
    obj = bpy.data.objects.new(f"{name}_roof", mesh)
    bpy.context.collection.objects.link(obj)
    
    verts = [(x, y, wall_h + thickness) for x, y in footprint] + [(x, y, wall_h) for x, y in footprint]
    n = len(footprint)
    faces = []
    faces.append(list(range(n)))  # top
    faces.append(list(range(2*n-1, n-1, -1)))  # bottom
    for i in range(n):
        faces.append([i, (i+1)%n, n+(i+1)%n, n+i])  # sides
    
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj.data.materials.append(mat)
    return [obj]

def create_hip_roof_simple(name, footprint, wall_h, pitch, mat, region):
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
        {"name":"front", "verts":[(min_x,min_y,wall_h),(max_x,min_y,wall_h),(cx,cy,wall_h+ridge_h)]},
        {"name":"back", "verts":[(max_x,max_y,wall_h),(min_x,max_y,wall_h),(cx,cy,wall_h+ridge_h)]},
        {"name":"left", "verts":[(min_x,min_y,wall_h),(min_x,max_y,wall_h),(cx-ridge_len/2,cy,wall_h+ridge_h),(cx+ridge_len/2,cy,wall_h+ridge_h)]},
        {"name":"right","verts":[(max_x,max_y,wall_h),(max_x,min_y,wall_h),(cx+ridge_len/2,cy,wall_h+ridge_h),(cx-ridge_len/2,cy,wall_h+ridge_h)]},
    ]
    
    for plane in planes:
        mesh = bpy.data.meshes.new(f"{name}_roof_{plane['name']}_mesh")
        obj = bpy.data.objects.new(f"{name}_roof_{plane['name']}", mesh)
        bpy.context.collection.objects.link(obj)
        
        verts = plane["verts"]
        faces = [[0,1,2]] if len(verts)==3 else [[0,1,2,3]]
        mesh.from_pydata(verts, [], faces)
        mesh.update()
        obj.data.materials.append(mat)
        roof_objs.append(obj)
    return roof_objs

def create_chimney_simple(name, center, wall_h, roof_h, mat):
    mesh = bpy.data.meshes.new(name + "_mesh")
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    
    w = 0.15; d = 0.15
    h = roof_h - wall_h + 0.2
    
    cx, cy = center.x, center.y
    verts = [
        (cx-w/2, cy-d/2, wall_h), (cx+w/2, cy-d/2, wall_h),
        (cx+w/2, cy+d/2, wall_h), (cx-w/2, cy+d/2, wall_h),
        (cx-w/2, cy-d/2, wall_h+h), (cx+w/2, cy-d/2, wall_h+h),
        (cx+w/2, cy+d/2, wall_h+h), (cx-w/2, cy+d/2, wall_h+h),
    ]
    faces = [[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7],[4,5,6,7],[3,2,1,0]]
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj.data.materials.append(mat)
    return obj

def create_footbridge(name, p1, p2, thickness, mat):
    mesh = bpy.data.meshes.new(name + "_mesh")
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    
    dx = p2.x - p1.x
    dy = p2.y - p1.y
    length = math.sqrt(dx*dx + dy*dy)
    nx = -dy / length
    ny = dx / length
    width = 0.5
    
    v1 = (p1.x - nx*width/2, p1.y - ny*width/2, 0.5)
    v2 = (p2.x - nx*width/2, p2.y - ny*width/2, 0.5)
    v3 = (p2.x + nx*width/2, p2.y + ny*width/2, 0.5)
    v4 = (p1.x + nx*width/2, p1.y + ny*width/2, 0.5)
    v5 = (p1.x - nx*width/2, p1.y - ny*width/2, 0.5+thickness)
    v6 = (p2.x - nx*width/2, p2.y - ny*width/2, 0.5+thickness)
    v7 = (p2.x + nx*width/2, p2.y + ny*width/2, 0.5+thickness)
    v8 = (p1.x + nx*width/2, p1.y + ny*width/2, 0.5+thickness)
    
    verts = [v1,v2,v3,v4,v5,v6,v7,v8]
    faces = [[0,1,2,3],[4,5,6,7],[0,4,7,3],[1,2,6,5],[0,3,7,4],[1,5,4,2]]
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj.data.materials.append(mat)
    return obj

def create_clock_tower(name, center, width, height, mat):
    mesh = bpy.data.meshes.new(name + "_mesh")
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    
    w = width; d = width
    cx, cy = center.x, center.y
    verts = [
        (cx-w/2, cy-d/2, 0), (cx+w/2, cy-d/2, 0),
        (cx+w/2, cy+d/2, 0), (cx-w/2, cy+d/2, 0),
        (cx-w/2, cy-d/2, height), (cx+w/2, cy-d/2, height),
        (cx+w/2, cy+d/2, height), (cx-w/2, cy+d/2, height),
    ]
    faces = [[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7],[4,5,6,7],[3,2,1,0]]
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj.data.materials.append(mat)
    return obj

def create_garage_doors(name, p1, p2, height, mat):
    mesh = bpy.data.meshes.new(name + "_mesh")
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    
    dx = p2.x - p1.x
    dy = p2.y - p1.y
    length = math.sqrt(dx*dx + dy*dy)
    nx = -dy / length
    ny = dx / length
    
    # Three garage doors
    door_width = length / 3 * 0.8
    door_height = height * 0.8
    
    all_verts = []
    all_faces = []
    base_idx = 0
    
    for i in range(3):
        t = (i + 0.5) / 3
        cx = p1.x + dx * t
        cy = p1.y + dy * t
        
        hw, hh = door_width/2, door_height/2
        dz = 0.02
        
        verts = [
            (cx - hw*nx - hh*ny, cy - hw*ny + hh*nx, dz),
            (cx + hw*nx - hh*ny, cy + hw*ny + hh*nx, dz),
            (cx + hw*nx - hh*ny, cy + hw*ny + hh*nx, door_height),
            (cx - hw*nx - hh*ny, cy - hw*ny + hh*nx, door_height),
            (cx - hw*nx - hh*ny + dz*ny, cy - hw*ny + hh*nx - dz*nx, dz),
            (cx + hw*nx - hh*ny + dz*ny, cy + hw*ny + hh*nx - dz*nx, dz),
            (cx + hw*nx - hh*ny + dz*ny, cy + hw*ny + hh*nx - dz*nx, door_height),
            (cx - hw*nx - hh*ny + dz*ny, cy - hw*ny + hh*nx - dz*nx, door_height),
        ]
        
        faces = [[0,1,2,3],[4,5,6,7],[0,4,7,3],[1,5,4,2],[0,1,5,4],[2,3,7,6]]
        base = len(all_verts)
        all_verts.extend(verts)
        for f in faces:
            all_faces.append([base + v for v in f])
    
    mesh.from_pydata(all_verts, [], all_faces)
    mesh.update()
    obj.data.materials.append(mat)
    return obj

def create_cornice_simple(name, p1, p2, height, mat):
    CARD_THICKNESS = 0.016
    proj = 0.02
    ch = 0.03
    
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
    obj.data.materials.append(mat)
    return obj

# Stubs for complex elements (would be expanded in full implementation)
def create_portico(name, p1, p2, height, projection, mat): return create_canopy(name, p1, p2, height, projection, mat)
def create_masonic_symbol(name, center, size, mat): return create_base_mesh(name, [(-size/2,-size/2),(size/2,-size/2),(size/2,size/2),(-size/2,size/2)], 0.1)
def create_balustrade(name, footprint, height, mat): return create_canopy(name, Vector((footprint[0][0], footprint[0][1])), Vector((footprint[1][0], footprint[1][1])), height, 0.02, mat)
def create_buttress(name, p1, p2, height, projection, mat): return create_canopy(name, p1, p2, height, projection, mat)
def create_bell_tower(name, center, width, height, mat): return create_clock_tower(name, center, width, height, mat)
def create_cross_finials(name, footprint, height, mat): return create_base_mesh(f"{name}_cross", [(-0.1,-0.1),(0.1,-0.1),(0.1,0.1),(-0.1,0.1)], height)
def create_columns(name, p1, p2, height, count, mat): 
    col = create_base_mesh(f"{name}_col", [(-0.1,-0.1),(0.1,-0.1),(0.1,0.1),(-0.1,0.1)], height)
    col.data.materials.append(mat)
    return col
def create_corner_entrance(name, p1, p2, height, mat): return create_base_mesh(name, [(-0.3,-0.3),(0.3,-0.3),(0.3,0.3),(-0.3,0.3)], height)
def create_grand_portico(name, p1, p2, height, projection, mat): return create_canopy(name, p1, p2, height, projection, mat)
def create_grand_stairs(name, p1, p2, width, mat): return create_base_mesh(name, [(-width/2,-0.3),(width/2,-0.3),(width/2,0.3),(-width/2,0.3)], 0.3)
def create_dome(name, center, radius, height, mat): return create_base_mesh(name, [(-radius,-radius),(radius,-radius),(radius,radius),(-radius,radius)], height)
def create_clock_faces(name, center, radius, height, mat): return create_base_mesh(f"{name}_clock", [(-radius,-radius),(radius,-radius),(radius,radius),(-radius,radius)], height)
def create_marquee(name, p1, p2, width, projection, mat): return create_canopy(name, p1, p2, 0.3, projection, mat)
def create_blade_sign(name, center, width, height, mat): return create_base_mesh(name, [(-width/2,-height/2),(width/2,-height/2),(width/2,height/2),(-width/2,height/2)], height)
def create_ticket_booth(name, center, width, depth, height, mat): return create_base_mesh(name, [(-width/2,-depth/2),(width/2,-depth/2),(width/2,depth/2),(-width/2,depth/2)], height)
def create_stepped_parapet(name, footprint, height, mat): return create_canopy(name, Vector((footprint[0][0], footprint[0][1])), Vector((footprint[1][0], footprint[1][1])), height, 0.05, mat)
def create_hose_tower(name, center, width, height, mat): return create_clock_tower(name, center, width, height, mat)
def create_arched_windows(name, walls, height, mat): return create_base_mesh("arch", [(-0.2,-0.2),(0.2,-0.2),(0.2,0.2),(-0.2,0.2)], 0.5)
def create_wrap_porch(name, footprint, projection, height, mat): return create_canopy(name, Vector((footprint[0][0], footprint[0][1])), Vector((footprint[1][0], footprint[1][1])), height, projection, mat)
def create_gingerbread(name, footprint, height, mat): return create_base_mesh(f"{name}_gb", [(-0.1,-0.1),(0.1,-0.1),(0.1,0.1),(-0.1,0.1)], 0.1)
def create_gable_shingles(name, footprint, height, mat): return create_canopy(name, Vector((footprint[0][0], footprint[0][1])), Vector((footprint[1][0], footprint[1][1])), height, 0.05, mat)
def create_dormers(name, footprint, height, mat): return create_base_mesh(f"{name}_dormer", [(-0.3,-0.2),(0.3,-0.2),(0.3,0.2),(-0.3,0.2)], 0.3)
def create_front_porch(name, p1, p2, projection, height, mat): return create_canopy(name, p1, p2, height, projection, mat)
def create_side_portico(name, p1, p2, height, projection, mat): return create_canopy(name, p1, p2, height, projection, mat)

# ─── Main Generation ─────────────────────────────────────────────────────────

LANDMARK_GENERATORS = {
    "depot_custom": create_depot,
    "city_hall": create_city_hall,
    "masonic_temple": create_masonic_temple,
    "st_matthews_cathedral": create_cathedral,
    "first_interstate_bank": create_bank,
    "albany_courthouse": create_courthouse,
    "wyo_theatre": create_theatre,
    "laramie_fire_station": create_fire_station,
    "durlacher_house": create_durlacher_house,
    "blair_house": create_blair_house,
}

def load_references():
    with open(REFERENCES_PATH) as f:
        return json.load(f)['landmarks']

def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    
    references = load_references()
    print(f"Generating {len(LANDMARK_GENERATORS)} landmarks...")
    
    for ref in references:
        tile_id = ref['tile_id']
        if tile_id not in LANDMARK_GENERATORS:
            print(f"  SKIP: {tile_id} - no generator")
            continue
        
        out_file = os.path.join(OUT_DIR, f"{tile_id}.glb")
        if os.path.exists(out_file):
            print(f"  SKIP: {tile_id} (already exists)")
            continue
        
        print(f"  Generating {tile_id}...")
        generator = LANDMARK_GENERATORS[tile_id]
        
        try:
            meta = generator(tile_id, ref)
            export_glb(tile_id, out_file)
            print(f"    OK: {out_file}")
        except Exception as e:
            print(f"    FAIL: {tile_id} - {e}")
            import traceback
            traceback.print_exc()
    
    print("Done generating landmarks!")

if __name__ == "__main__":
    main()