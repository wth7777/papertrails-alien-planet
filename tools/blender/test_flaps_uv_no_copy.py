#!/usr/bin/env python3
"""
Test flap creation WITH UV but without the copy (just create xb, not xf).
"""

import bpy
import math
import json
import sys
import os
import random
from mathutils import Vector

ATLAS_IMAGE_PATH = "/home/clawman/papertrails-laramie-original/public/textures/facade_atlas.png"
ATLAS_MANIFEST_PATH = "/home/clawman/papertrails-laramie-original/public/textures/facade_atlas_manifest.json"

def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()
    for mesh in bpy.data.meshes:
        bpy.data.meshes.remove(mesh)
    for mat in bpy.data.materials:
        bpy.data.materials.remove(mat)
    for img in bpy.data.images:
        bpy.data.images.remove(img)

def centroid_2d(pts):
    if not pts: return 0, 0
    x = sum(p[0] for p in pts) / len(pts)
    y = sum(p[1] for p in pts) / len(pts)
    return x, y

def load_atlas_manifest():
    with open(ATLAS_MANIFEST_PATH) as f:
        data = json.load(f)
    return data['regions']

ATLAS_REGIONS = load_atlas_manifest()

def get_region_uv(region_name: str):
    r = ATLAS_REGIONS.get(region_name)
    if not r:
        r = ATLAS_REGIONS['bricks_red']
    return (r['uv'][0], r['uv'][1], r['uv'][2], r['uv'][3])

def create_atlas_material():
    mat = bpy.data.materials.new(name="FacadeAtlas")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    for node in nodes: nodes.remove(node)
    
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
    print(f"  Unwrapping {mesh_obj.name} to {region_name}...")
    mesh = mesh_obj.data
    print(f"  Mesh has {len(mesh.polygons)} polygons, {len(mesh.vertices)} vertices")
    uv_layer = ensure_uv_layer(mesh)
    print(f"  UV layer: {uv_layer.name}")
    
    bpy.context.view_layer.objects.active = mesh_obj
    mesh_obj.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    print("  Calling smart_project...")
    bpy.ops.uv.smart_project(angle_limit=66, island_margin=0.01, area_weight=0.0, correct_aspect=True)
    print("  smart_project done")
    bpy.ops.object.mode_set(mode='OBJECT')
    mesh_obj.select_set(False)
    
    scale_uv_to_region(mesh, uv_layer, region_name)
    print(f"  Done unwrapping {mesh_obj.name}")

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
    print(f"Created base mesh: {len(mesh.polygons)} polys, {len(mesh.vertices)} verts")
    return obj

def create_facade_wall(name, p1, p2, height, levels):
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
    wall_thickness = CARD_THICKNESS
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
    print(f"Created wall: {len(mesh.polygons)} polys, {len(mesh.vertices)} verts")
    return obj

def create_cornice(name, p1, p2, height):
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
    print(f"Created cornice: {len(mesh.polygons)} polys, {len(mesh.vertices)} verts")
    return obj

def create_hip_roof(name, footprint, wall_height, pitch):
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
        print(f"Created roof {plane['name']}: {len(mesh.polygons)} polys, {len(mesh.vertices)} verts")
        roof_objs.append(obj)
    return roof_objs

def add_hinge_userdata(obj, fold_angle, delay, layer):
    obj["hinge"] = True
    obj["foldAngle"] = fold_angle
    obj["delay"] = max(0.0, min(1.0, delay))
    obj["layer"] = max(0, int(layer))

def create_flap_pairs(model_name, meshes, fold_angle, layer_start):
    """Create only _xb versions, no _xf copies."""
    next_layer = layer_start
    total = len(meshes)
    for m in meshes:
        if not m.name.endswith('_xb') and not m.name.endswith('_xf'):
            m.name = f"{m.name}_xb"
        delay = 1.0 - (next_layer - layer_start) / max(1, total-1) if total>1 else 0.5
        add_hinge_userdata(m, fold_angle, delay, next_layer)
        # NO COPY - just use the original
        next_layer += 1
    return next_layer

def main():
    clear_scene()
    
    atlas_mat = create_atlas_material()
    
    footprint = [(-0.5, -0.5), (0.5, -0.5), (0.5, 0.5), (-0.5, 0.5)]
    levels = 3
    wall_h = levels * 0.35
    pitch = 0.5
    
    base = create_base_mesh("test_base", footprint, 0)
    base.data.materials.append(atlas_mat)
    
    walls = []
    for i in range(len(footprint)):
        p1 = Vector(footprint[i])
        p2 = Vector(footprint[(i+1)%len(footprint)])
        if (p1 - p2).length < 0.001:
            continue
        wall = create_facade_wall(f"test_wall_{i}", p1, p2, wall_h, levels)
        wall.data.materials.append(atlas_mat)
        walls.append(wall)
    
    cornices = []
    for i in range(len(footprint)):
        p1 = Vector(footprint[i])
        p2 = Vector(footprint[(i+1)%len(footprint)])
        if (p1 - p2).length < 0.001:
            continue
        cornice = create_cornice(f"test_cornice_{i}", p1, p2, wall_h)
        cornice.data.materials.append(atlas_mat)
        cornices.append(cornice)
    
    roof = create_hip_roof("test", footprint, wall_h, pitch)
    for r in roof: r.data.materials.append(atlas_mat)
    
    # UV unwrap everything
    unwrap_and_assign(base, 'mortar_light')
    for wall in walls:
        unwrap_and_assign(wall, 'bricks_red')
    for cornice in cornices:
        unwrap_and_assign(cornice, 'cornice_simple')
    for r in roof:
        unwrap_and_assign(r, 'roof_terracotta')
    
    print("All UV unwrapped successfully")
    
    # Create flaps (no copies)
    all_flaps = walls + roof
    max_layer = create_flap_pairs("test", all_flaps, math.pi/2, 1)
    print(f"Created flaps, max_layer={max_layer}")
    
    # Export
    output_path = "/tmp/test_flaps_uv_no_copy.glb"
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.export_scene.gltf(filepath=output_path, export_format='GLB', export_apply=True,
        export_animations=True, export_materials='EXPORT', export_extras=True, export_yup=True)
    print(f"Exported to {output_path}")

if __name__ == "__main__":
    main()