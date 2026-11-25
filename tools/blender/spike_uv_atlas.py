#!/usr/bin/env python3
"""
SPIKE: Test UV mapping one building with facade atlas.
Quick throwaway experiment to validate the approach.
"""

import bpy
import os
import json
import math
from mathutils import Vector

# Load atlas manifest
with open("/home/clawman/papertrails-laramie-original/public/textures/facade_atlas_manifest.json") as f:
    manifest = json.load(f)

REGIONS = manifest['regions']
ATLAS_SIZE = 1024

def uv_to_atlas(u, v, region_name):
    """Convert local UV (0-1) to atlas UV coordinates."""
    r = REGIONS[region_name]
    u0, v0, u1, v1 = r['uv']
    # v is flipped in Blender (0 at bottom)
    return (u0 + u * (u1 - u0), v0 + (1 - v) * (v1 - v0))

def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()
    for mesh in bpy.data.meshes:
        bpy.data.meshes.remove(mesh)
    for mat in bpy.data.materials:
        bpy.data.materials.remove(mat)
    for img in bpy.data.images:
        bpy.data.images.remove(img)

def load_building(glb_path):
    """Load a building GLB."""
    bpy.ops.import_scene.gltf(filepath=glb_path)
    # Get all mesh objects from the import
    meshes = [obj for obj in bpy.context.selected_objects if obj.type == 'MESH']
    if meshes:
        # Create a parent empty to group them
        parent = bpy.data.objects.new("BuildingRoot", None)
        bpy.context.collection.objects.link(parent)
        for m in meshes:
            m.parent = parent
        return parent
    return None

def assign_uvs(obj, facade_type):
    """Assign UV coordinates based on facade type."""
    # Map facade types to atlas regions
    # For now, use a simple mapping
    wall_region = 'bricks_red'
    window_frame_region = 'window_wood'
    glass_region = 'glass_lit'
    door_region = 'door_wood'
    cornice_region = 'cornice_simple'
    roof_region = 'roof_terracotta'
    
    def get_all_children(obj):
        children = []
        for child in obj.children:
            children.append(child)
            children.extend(get_all_children(child))
        return children
    
    all_children = get_all_children(obj)
    
    for child in all_children:
        if child.type != 'MESH':
            continue
        mesh = child.data
        name = child.name.lower()
        
        # Ensure UV layer exists
        if not mesh.uv_layers:
            mesh.uv_layers.new()
        uv_layer = mesh.uv_layers.active
        
        # Assign based on name
        if 'wall' in name or 'brick' in name:
            assign_region_uv(mesh, uv_layer, wall_region)
        elif 'window' in name and 'pane' not in name and 'glass' not in name:
            assign_region_uv(mesh, uv_layer, window_frame_region)
        elif 'pane' in name or 'glass' in name:
            assign_region_uv(mesh, uv_layer, glass_region)
        elif 'door' in name:
            assign_region_uv(mesh, uv_layer, door_region)
        elif 'cornice' in name:
            assign_region_uv(mesh, uv_layer, cornice_region)
        elif 'roof' in name:
            assign_region_uv(mesh, uv_layer, roof_region)
        else:
            assign_region_uv(mesh, uv_layer, wall_region)

def assign_region_uv(mesh, uv_layer, region_name):
    """Assign a single region's UV to all faces of a mesh."""
    r = REGIONS[region_name]
    u0, v0, u1, v1 = r['uv']
    
    # Simple planar mapping - assign full region to all faces
    # In production, we'd do proper unwrapping per face
    for poly in mesh.polygons:
        for loop_idx in poly.loop_indices:
            loop = mesh.loops[loop_idx]
            uv = uv_layer.data[loop_idx].uv
            # Map to region - for now just use center
            uv.x = (u0 + u1) / 2
            uv.y = (v0 + v1) / 2

def create_atlas_material():
    """Create material using atlas texture."""
    mat = bpy.data.materials.new(name="AtlasMaterial")
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
    atlas_path = "/home/clawman/papertrails-laramie-original/public/textures/facade_atlas.png"
    tex_image.image = bpy.data.images.load(atlas_path)
    tex_image.interpolation = 'Linear'
    
    # BSDF - Blender 4.3 uses 'Specular IOR Level' instead of 'Specular'
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    bsdf.location = (-100, 0)
    bsdf.inputs['Roughness'].default_value = 0.8
    # Check for Specular IOR Level (Blender 4.3+) or Specular (older)
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

def main():
    clear_scene()
    
    # Test with one building
    test_building = "/home/clawman/papertrails-laramie-original/public/models/buildings/1079799218.glb"
    print(f"Loading {test_building}...")
    
    obj = load_building(test_building)
    if not obj:
        print("Failed to load building")
        return
    
    print(f"Loaded: {obj.name}")
    # Get all mesh children recursively
    def get_all_children(obj):
        children = []
        for child in obj.children:
            children.append(child)
            children.extend(get_all_children(child))
        return children
    
    all_children = get_all_children(obj)
    print(f"Children: {len(all_children)}")
    for child in all_children:
        if child.type == 'MESH':
            print(f"  Mesh: {child.name}, verts: {len(child.data.vertices)}")
    
    # Assign UVs
    print("Assigning UVs...")
    assign_uvs(obj, 'victorian_brick')
    
    # Create and assign atlas material
    print("Creating atlas material...")
    mat = create_atlas_material()
    for child in all_children:
        if child.type == 'MESH':
            if child.data.materials:
                child.data.materials[0] = mat
            else:
                child.data.materials.append(mat)
    
    # Export test GLB
    output_path = "/tmp/test_uv_building.glb"
    print(f"Exporting to {output_path}...")
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        use_selection=True,
        export_materials='EXPORT',
        export_texcoords=True,
        export_normals=True,
        export_tangents=False,
    )
    
    print("Done!")
    
    # Verify export
    import struct
    with open(output_path, 'rb') as f:
        data = f.read()
    chunk_len = struct.unpack('<I', data[12:16])[0]
    json_data = data[20:20+chunk_len]
    import json as jsonlib
    gltf = jsonlib.loads(json_data)
    print(f"Exported: {len(gltf.get('meshes', []))} meshes, {len(gltf.get('nodes', []))} nodes")
    print(f"Materials: {len(gltf.get('materials', []))}")
    print(f"Textures: {len(gltf.get('textures', []))}")
    print(f"Images: {len(gltf.get('images', []))}")

if __name__ == "__main__":
    main()