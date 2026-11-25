#!/usr/bin/env python3
"""
Test window UV unwrap.
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

def create_window(name, wx, wy, nx, ny, z_base, z_top, w, h):
    frame_depth = 0.015
    fw = w + 0.02
    fh = h + 0.02
    
    cx = wx + nx * frame_depth
    cy = wy + ny * frame_depth
    
    hw, hh = fw/2, fh/2
    verts = [
        (cx - hw*nx - hh*ny, cy - hw*ny + hh*nx, z_base),
        (cx + hw*nx - hh*ny, cy + hw*ny + hh*nx, z_base),
        (cx + hw*nx - hh*ny, cy + hw*ny + hh*nx, z_top),
        (cx - hw*nx - hh*ny, cy - hw*ny + hh*nx, z_top),
        (cx - hw*nx + 0.01*ny, cy - hw*ny - 0.01*nx, z_base + 0.01),
        (cx + hw*nx + 0.01*ny, cy + hw*ny - 0.01*nx, z_base + 0.01),
        (cx + hw*nx + 0.01*ny, cy + hw*ny - 0.01*nx, z_top - 0.01),
        (cx - hw*nx + 0.01*ny, cy - hw*ny - 0.01*nx, z_top - 0.01),
    ]
    
    faces = [
        [0,1,2,3],
        [4,5,6,7],
    ]
    
    mesh = bpy.data.meshes.new(name + "_mesh")
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    print(f"Created window: {len(mesh.polygons)} polys, {len(mesh.vertices)} verts")
    return obj

def main():
    clear_scene()
    
    atlas_mat = create_atlas_material()
    
    wx, wy = 0, 0
    nx, ny = 0, 1
    z_base, z_top = 0.2, 0.6
    w, h = 0.2, 0.4
    
    window = create_window("test_window", wx, wy, nx, ny, z_base, z_top, w, h)
    window.data.materials.append(atlas_mat)
    
    # UV unwrap window
    unwrap_and_assign(window, 'window_wood')
    print("Window unwrapped successfully")
    
    # Export
    output_path = "/tmp/test_window_uv.glb"
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.export_scene.gltf(filepath=output_path, export_format='GLB', export_apply=True,
        export_animations=True, export_materials='EXPORT', export_extras=True, export_yup=True)
    print(f"Exported to {output_path}")

if __name__ == "__main__":
    main()