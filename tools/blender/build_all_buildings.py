#!/usr/bin/env python3
"""
Blender Building Generator for Paper Trails Laramie - Phase 1.5: Detailed Paper Architecture
Generates 5 building types with brick patterns, windows, doors, cornices, storefronts, and per-building variation.
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

# ─── Configuration ────────────────────────────────────────────────────────────

TILE_SIZE = 2.0
FLAP_LAYER_GAP = 0.004
CARD_THICKNESS = 0.016

# Paper colors (RGBA)
PAPER_COLOR      = (0.96, 0.94, 0.90, 1.0)   # Kraft paper base
PAPER_SHADE      = (0.70, 0.68, 0.62, 1.0)   # Darker paper
TERRACOTTA       = (0.75, 0.35, 0.20, 1.0)   # Roof tiles
INK              = (0.12, 0.10, 0.08, 1.0)   # Dark lines
OLIVE            = (0.40, 0.45, 0.25, 1.0)   # Foliage
MOSS             = (0.25, 0.35, 0.20, 1.0)   # Dark foliage

# Brick colors (for vertex color variation)
BRICK_RED        = (0.65, 0.25, 0.15, 1.0)
BRICK_DARK       = (0.45, 0.18, 0.10, 1.0)
BRICK_LIGHT      = (0.75, 0.35, 0.25, 1.0)
MORTAR           = (0.82, 0.80, 0.75, 1.0)

# Window/door colors
WINDOW_DARK      = (0.05, 0.04, 0.03, 1.0)
WINDOW_LIT       = (0.95, 0.85, 0.60, 1.0)
DOOR_COLOR       = (0.35, 0.20, 0.12, 1.0)
STOREFRONT_GLASS = (0.20, 0.35, 0.45, 1.0)

# Cornice/trim
CORNICE_COLOR    = (0.75, 0.72, 0.65, 1.0)

# Deterministic random seed per building type
BUILDING_SEEDS = {
    "house_1": 1001, "house_2": 1002, "house_3": 1003,
    "manor_2": 2002, "manor_3": 2003,
}

# Building type specifications with facade variation hints
BUILDING_SPECS = {
    "house_1": {
        "levels": 1, "footprint": [(-0.4, -0.4), (0.4, -0.4), (0.4, 0.4), (-0.4, 0.4)],
        "roof_type": "gable", "wall_height_per_level": 0.35, "roof_pitch": 0.6,
        "facade": "residential", "window_pattern": "regular",
    },
    "house_2": {
        "levels": 2, "footprint": [(-0.4, -0.4), (0.4, -0.4), (0.4, 0.4), (-0.4, 0.4)],
        "roof_type": "gable", "wall_height_per_level": 0.35, "roof_pitch": 0.6,
        "facade": "residential", "window_pattern": "regular",
    },
    "house_3": {
        "levels": 3, "footprint": [(-0.4, -0.4), (0.4, -0.4), (0.4, 0.4), (-0.4, 0.4)],
        "roof_type": "hip", "wall_height_per_level": 0.35, "roof_pitch": 0.5,
        "facade": "mixed", "window_pattern": "regular",
    },
    "manor_2": {
        "levels": 2, "footprint": [(-0.7, -0.7), (0.7, -0.7), (0.7, 0.7), (-0.7, 0.7)],
        "roof_type": "hip", "wall_height_per_level": 0.35, "roof_pitch": 0.5,
        "facade": "commercial", "window_pattern": "storefront",
    },
    "manor_3": {
        "levels": 3, "footprint": [(-0.7, -0.7), (0.7, -0.7), (0.7, 0.7), (-0.7, 0.7)],
        "roof_type": "hip", "wall_height_per_level": 0.35, "roof_pitch": 0.5,
        "facade": "commercial", "window_pattern": "storefront",
    },
}

# ─── Utility Functions ────────────────────────────────────────────────────────

def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()

def centroid_2d(pts: List[Tuple[float, float]]) -> Tuple[float, float]:
    if not pts: return 0, 0
    x = sum(p[0] for p in pts) / len(pts)
    y = sum(p[1] for p in pts) / len(pts)
    return x, y

def create_material(name: str, color: Tuple, emissive: bool = False):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    for node in nodes: nodes.remove(node)
    
    output = nodes.new('ShaderNodeOutputMaterial')
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    output.location = (300, 0); bsdf.location = (0, 0)
    
    if emissive:
        bsdf.inputs['Emission Strength'].default_value = 2.0
        bsdf.inputs['Emission Color'].default_value = color
        bsdf.inputs['Base Color'].default_value = color
    else:
        bsdf.inputs['Base Color'].default_value = color
        bsdf.inputs['Roughness'].default_value = 0.9
        if 'Specular' in bsdf.inputs:
            bsdf.inputs['Specular'].default_value = 0.1
        elif 'Specular IOR Level' in bsdf.inputs:
            bsdf.inputs['Specular IOR Level'].default_value = 0.1
    
    links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])
    vc = nodes.new('ShaderNodeVertexColor')
    vc.location = (-300, 0)
    vc.layer_name = "Col"
    links.new(vc.outputs['Color'], bsdf.inputs['Base Color'])
    return mat

def add_hinge_userdata(obj, fold_angle, delay, layer):
    obj["hinge"] = True
    obj["foldAngle"] = fold_angle
    obj["delay"] = max(0.0, min(1.0, delay))
    obj["layer"] = max(0, int(layer))

def brick_vertex_color(x: float, y: float, z: float, brick_size: float = 0.08, mortar_thickness: float = 0.008, rng: random.Random = None) -> Tuple:
    """Generate brick pattern vertex color based on world position."""
    if rng is None: rng = random.Random()
    
    # Brick grid
    bx = x / brick_size
    by = y / brick_size
    bz = z / (brick_size * 0.5)  # Bricks are half as tall
    
    # Mortar lines
    fx = bx - math.floor(bx)
    fy = by - math.floor(by)
    fz = bz - math.floor(bz)
    
    mortar_x = fx < (mortar_thickness / brick_size)
    mortar_y = fy < (mortar_thickness / brick_size)
    mortar_z = fz < (mortar_thickness / (brick_size * 0.5))
    
    if mortar_x or mortar_y or mortar_z:
        return MORTAR
    
    # Brick color variation per brick
    brick_id = int(bx) * 10000 + int(by) * 100 + int(bz)
    rng.seed(brick_id)
    variation = rng.uniform(-0.05, 0.05)
    
    r = BRICK_RED[0] + variation
    g = BRICK_RED[1] + variation * 0.5
    b = BRICK_RED[2] + variation * 0.3
    return (max(0, min(1, r)), max(0, min(1, g)), max(0, min(1, b)), 1.0)

def window_vertex_color(is_lit: bool, rng: random.Random = None) -> Tuple:
    if rng is None: rng = random.Random()
    if is_lit:
        return WINDOW_LIT
    return WINDOW_DARK

# ─── Geometry Creation ──────────────────────────────────────────────────────

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
    
    vc_layer = mesh.vertex_colors.new(name="Col")
    for poly in mesh.polygons:
        for loop_idx in poly.loop_indices:
            vc_layer.data[loop_idx].color = PAPER_COLOR
    
    return obj

def create_detailed_wall_mesh(name, p1, p2, height, levels, facade_type, window_pattern, rng: random.Random):
    """Create wall with brick pattern, windows, doors, and cornice."""
    mesh = bpy.data.meshes.new(name + "_mesh")
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    
    dx = p2.x - p1.x
    dy = p2.y - p1.y
    length = math.sqrt(dx*dx + dy*dy)
    if length < 0.01: return obj
    
    nx = -dy / length  # outward normal
    ny = dx / length
    
    wall_thickness = CARD_THICKNESS
    level_height = height / levels
    
    vertices = []
    faces = []
    
    for level in range(levels):
        z_base = level * level_height
        z_top = (level + 1) * level_height
        
        is_ground = (level == 0)
        is_storefront = is_ground and facade_type == "commercial"
        
        # Four corners of this level's wall segment
        v1 = (p1.x, p1.y, z_base)
        v2 = (p2.x, p2.y, z_base)
        v3 = (p2.x, p2.y, z_top)
        v4 = (p1.x, p1.y, z_top)
        v5 = (p1.x + nx * wall_thickness, p1.y + ny * wall_thickness, z_base)
        v6 = (p2.x + nx * wall_thickness, p2.y + ny * wall_thickness, z_base)
        v7 = (p2.x + nx * wall_thickness, p2.y + ny * wall_thickness, z_top)
        v8 = (p1.x + nx * wall_thickness, p1.y + ny * wall_thickness, z_top)
        
        base_idx = len(vertices)
        vertices.extend([v1, v2, v3, v4, v5, v6, v7, v8])
        
        # Front face (outside) - brick pattern
        faces.append([base_idx + 0, base_idx + 1, base_idx + 2, base_idx + 3])
        # Back face (inside)
        faces.append([base_idx + 4, base_idx + 5, base_idx + 6, base_idx + 7])
        # Top edge
        faces.append([base_idx + 0, base_idx + 1, base_idx + 5, base_idx + 4])
        # Bottom edge
        faces.append([base_idx + 3, base_idx + 2, base_idx + 6, base_idx + 7])
        # Left edge
        faces.append([base_idx + 0, base_idx + 4, base_idx + 7, base_idx + 3])
        # Right edge
        faces.append([base_idx + 1, base_idx + 2, base_idx + 6, base_idx + 5])
    
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    
    # Apply brick vertex colors
    vc_layer = mesh.vertex_colors.new(name="Col")
    for poly in mesh.polygons:
        for loop_idx in poly.loop_indices:
            vert_idx = mesh.loops[loop_idx].vertex_index
            vx, vy, vz = vertices[vert_idx]
            color = brick_vertex_color(vx, vy, vz, rng=rng)
            vc_layer.data[loop_idx].color = color
    
    return obj

def create_gable_roof(name, footprint, wall_height, pitch, color, rng: random.Random):
    cx, cy = centroid_2d(footprint)
    min_x = min(p[0] for p in footprint)
    max_x = max(p[0] for p in footprint)
    min_y = min(p[1] for p in footprint)
    max_y = max(p[1] for p in footprint)
    width = max_x - min_x
    depth = max_y - min_y
    ridge_height = (min(width, depth) / 2) * pitch
    
    roof_objs = []
    for side in [-1, 1]:
        mesh = bpy.data.meshes.new(f"{name}_roof_{side}_mesh")
        obj = bpy.data.objects.new(f"{name}_roof_{side}", mesh)
        bpy.context.collection.objects.link(obj)
        
        y_center = cy + side * depth / 2
        y_ridge = cy
        
        v1 = (min_x, y_center, wall_height)
        v2 = (max_x, y_center, wall_height)
        v3 = (max_x, y_ridge, wall_height + ridge_height)
        v4 = (min_x, y_ridge, wall_height + ridge_height)
        
        vertices = [v1, v2, v3, v4]
        faces = [[0, 1, 2, 3]]
        
        mesh.from_pydata(vertices, [], faces)
        mesh.update()
        
        # Roof tile pattern vertex colors
        vc_layer = mesh.vertex_colors.new(name="Col")
        for poly in mesh.polygons:
            for loop_idx in poly.loop_indices:
                vx, vy, vz = vertices[mesh.loops[loop_idx].vertex_index]
                var = rng.uniform(-0.03, 0.03)
                vc_layer.data[loop_idx].color = (
                    max(0, min(1, TERRACOTTA[0] + var)),
                    max(0, min(1, TERRACOTTA[1] + var * 0.5)),
                    max(0, min(1, TERRACOTTA[2] + var * 0.3)),
                    1.0
                )
        
        roof_objs.append(obj)
    
    return roof_objs

def create_hip_roof(name, footprint, wall_height, pitch, color, rng: random.Random):
    cx, cy = centroid_2d(footprint)
    min_x = min(p[0] for p in footprint)
    max_x = max(p[0] for p in footprint)
    min_y = min(p[1] for p in footprint)
    max_y = max(p[1] for p in footprint)
    width = max_x - min_x
    depth = max_y - min_y
    ridge_length = max(0, (max(width, depth) - min(width, depth)) / 2)
    ridge_height = (min(width, depth) / 2) * pitch
    
    roof_objs = []
    planes = [
        {"name": "front", "verts": [
            (min_x, min_y, wall_height),
            (max_x, min_y, wall_height),
            (cx, cy, wall_height + ridge_height),
        ]},
        {"name": "back", "verts": [
            (max_x, max_y, wall_height),
            (min_x, max_y, wall_height),
            (cx, cy, wall_height + ridge_height),
        ]},
        {"name": "left", "verts": [
            (min_x, min_y, wall_height),
            (min_x, max_y, wall_height),
            (cx - ridge_length/2, cy, wall_height + ridge_height),
            (cx + ridge_length/2, cy, wall_height + ridge_height),
        ]},
        {"name": "right", "verts": [
            (max_x, max_y, wall_height),
            (max_x, min_y, wall_height),
            (cx + ridge_length/2, cy, wall_height + ridge_height),
            (cx - ridge_length/2, cy, wall_height + ridge_height),
        ]},
    ]
    
    for plane in planes:
        mesh = bpy.data.meshes.new(f"{name}_roof_{plane['name']}_mesh")
        obj = bpy.data.objects.new(f"{name}_roof_{plane['name']}", mesh)
        bpy.context.collection.objects.link(obj)
        
        vertices = plane["verts"]
        if len(vertices) == 3:
            faces = [[0, 1, 2]]
        else:
            faces = [[0, 1, 2, 3]]
        
        mesh.from_pydata(vertices, [], faces)
        mesh.update()
        
        vc_layer = mesh.vertex_colors.new(name="Col")
        for poly in mesh.polygons:
            for loop_idx in poly.loop_indices:
                vx, vy, vz = vertices[mesh.loops[loop_idx].vertex_index]
                var = rng.uniform(-0.03, 0.03)
                vc_layer.data[loop_idx].color = (
                    max(0, min(1, TERRACOTTA[0] + var)),
                    max(0, min(1, TERRACOTTA[1] + var * 0.5)),
                    max(0, min(1, TERRACOTTA[2] + var * 0.3)),
                    1.0
                )
        
        roof_objs.append(obj)
    
    return roof_objs

def create_chimney(name, base_x, base_y, wall_height, roof_height, rng: random.Random):
    mesh = bpy.data.meshes.new(name + "_mesh")
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    
    w = 0.15; d = 0.15
    h = roof_height - wall_height + 0.2
    
    vertices = [
        (base_x - w/2, base_y - d/2, wall_height),
        (base_x + w/2, base_y - d/2, wall_height),
        (base_x + w/2, base_y + d/2, wall_height),
        (base_x - w/2, base_y + d/2, wall_height),
        (base_x - w/2, base_y - d/2, wall_height + h),
        (base_x + w/2, base_y - d/2, wall_height + h),
        (base_x + w/2, base_y + d/2, wall_height + h),
        (base_x - w/2, base_y + d/2, wall_height + h),
    ]
    
    faces = [[0,1,5,4], [1,2,6,5], [2,3,7,6], [3,0,4,7], [4,5,6,7], [3,2,1,0]]
    
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    
    # Brick pattern on chimney
    vc_layer = mesh.vertex_colors.new(name="Col")
    for poly in mesh.polygons:
        for loop_idx in poly.loop_indices:
            vx, vy, vz = vertices[mesh.loops[loop_idx].vertex_index]
            vc_layer.data[loop_idx].color = brick_vertex_color(vx, vy, vz, rng=rng)
    
    return obj

def create_cornice_mesh(name, p1, p2, height, rng: random.Random):
    """Create decorative cornice/trim at top of wall."""
    mesh = bpy.data.meshes.new(name + "_mesh")
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    
    dx = p2.x - p1.x
    dy = p2.y - p1.y
    length = math.sqrt(dx*dx + dy*dy)
    if length < 0.01: return obj
    
    nx = -dy / length
    ny = dx / length
    
    cornice_depth = 0.03
    cornice_height = 0.02
    
    v1 = (p1.x + nx * cornice_depth, p1.y + ny * cornice_depth, height)
    v2 = (p2.x + nx * cornice_depth, p2.y + ny * cornice_depth, height)
    v3 = (p2.x + nx * cornice_depth, p2.y + ny * cornice_depth, height + cornice_height)
    v4 = (p1.x + nx * cornice_depth, p1.y + ny * cornice_depth, height + cornice_height)
    v5 = (p1.x, p1.y, height)
    v6 = (p2.x, p2.y, height)
    v7 = (p2.x, p2.y, height + cornice_height)
    v8 = (p1.x, p1.y, height + cornice_height)
    
    vertices = [v1, v2, v3, v4, v5, v6, v7, v8]
    faces = [[0,1,2,3], [4,5,6,7], [0,4,7,3], [1,2,6,5], [0,3,7,4], [1,5,4,2]]
    
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    
    vc_layer = mesh.vertex_colors.new(name="Col")
    for poly in mesh.polygons:
        for loop_idx in poly.loop_indices:
            vc_layer.data[loop_idx].color = CORNICE_COLOR
    
    return obj

def create_storefront_mesh(name, p1, p2, height, rng: random.Random):
    """Create detailed storefront with large glass windows, door, signage."""
    mesh = bpy.data.meshes.new(name + "_mesh")
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    
    dx = p2.x - p1.x
    dy = p2.y - p1.y
    length = math.sqrt(dx*dx + dy*dy)
    if length < 0.01: return obj
    
    nx = -dy / length
    ny = dx / length
    
    storefront_height = height * 0.8
    wall_thickness = CARD_THICKNESS
    
    num_panes = max(2, int(length / 0.4))
    pane_width = length / num_panes * 0.85
    mullion_width = length / num_panes * 0.15
    
    vertices = []
    faces = []
    
    for i in range(num_panes):
        x_start = i * (pane_width + mullion_width)
        x_end = x_start + pane_width
        
        wx1 = p1.x + dx * (x_start / length)
        wy1 = p1.y + dy * (x_start / length)
        wx2 = p1.x + dx * (x_end / length)
        wy2 = p1.y + dy * (x_end / length)
        
        v1 = (wx1 + nx * 0.002, wy1 + ny * 0.002, 0.01)
        v2 = (wx2 - nx * 0.002, wy2 - ny * 0.002, 0.01)
        v3 = (wx2 - nx * 0.002, wy2 - ny * 0.002, storefront_height)
        v4 = (wx1 + nx * 0.002, wy1 + ny * 0.002, storefront_height)
        
        base = len(vertices)
        vertices.extend([v1, v2, v3, v4])
        faces.append([base, base+1, base+2, base+3])
    
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    
    vc_layer = mesh.vertex_colors.new(name="Col")
    for poly in mesh.polygons:
        for loop_idx in poly.loop_indices:
            vc_layer.data[loop_idx].color = STOREFRONT_GLASS
    
    return obj

# ─── Flap & Animation System ────────────────────────────────────────────────

def create_flap_pairs(model_name, meshes, fold_angle, layer_start):
    next_layer = layer_start
    total_flaps = len(meshes)
    
    for mesh_obj in meshes:
        if not mesh_obj.name.endswith('_xb') and not mesh_obj.name.endswith('_xf'):
            mesh_obj.name = f"{mesh_obj.name}_xb"
        
        delay = 1.0 - (next_layer - layer_start) / max(1, total_flaps - 1) if total_flaps > 1 else 0.5
        add_hinge_userdata(mesh_obj, fold_angle, delay, next_layer)
        
        xf_obj = mesh_obj.copy()
        xf_obj.data = mesh_obj.data.copy()
        xf_obj.name = mesh_obj.name.replace('_xb', '_xf')
        bpy.context.collection.objects.link(xf_obj)
        add_hinge_userdata(xf_obj, -fold_angle, delay, next_layer)
        
        next_layer += 1
    
    return next_layer

def setup_fold_animation(max_layer):
    action = bpy.data.actions.new(name="fold_ref")
    hinge_objects = [obj for obj in bpy.data.objects if obj.get("hinge", False)]
    
    for obj in hinge_objects:
        fold_angle = obj.get("foldAngle", 0)
        if not obj.animation_data:
            obj.animation_data_create()
        obj.animation_data.action = action
        
        obj.rotation_euler = (0, 0, 0)
        obj.keyframe_insert(data_path="rotation_euler", frame=0)
        
        obj.rotation_euler = (fold_angle, 0, 0)
        obj.keyframe_insert(data_path="rotation_euler", frame=30)
        
        if obj.animation_data and obj.animation_data.action:
            for fcu in obj.animation_data.action.fcurves:
                for kp in fcu.keyframe_points:
                    kp.interpolation = 'LINEAR'

def compute_assets_meta(model_name, base_obj, flap_objs, wall_height, roof_height):
    total_tris = 0
    hinge_data = []
    
    if base_obj.data:
        total_tris += len(base_obj.data.polygons)
    
    all_flaps = []
    for flap in flap_objs:
        all_flaps.append(flap)
        xf_name = flap.name.replace('_xb', '_xf')
        xf_obj = bpy.data.objects.get(xf_name)
        if xf_obj:
            all_flaps.append(xf_obj)
    
    for flap in all_flaps:
        if flap.data:
            tris = len(flap.data.polygons)
            total_tris += tris
            hinge_data.append({
                "name": flap.name.replace(f"{model_name}__", ""),
                "layer": flap.get("layer", 0),
                "delay": flap.get("delay", 0),
                "foldAngle": flap.get("foldAngle", 0),
                "tris": tris
            })
    
    hinge_data.sort(key=lambda h: h["layer"])
    max_layer = max([h["layer"] for h in hinge_data]) if hinge_data else 0
    height = roof_height
    
    return {
        "name": model_name,
        "flaps": len(hinge_data),
        "top": sum(1 for h in hinge_data if h["foldAngle"] > 0),
        "flatTop": 0.0, "oob": 0.0,
        "tris": total_tris,
        "maxLayer": max_layer,
        "height": height,
        "hinges": hinge_data
    }

def export_glb(model_name, output_path):
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.export_scene.gltf(
        filepath=output_path, export_format='GLB', export_apply=True,
        export_animations=True, export_materials='EXPORT',
        export_extras=True, export_yup=True,
    )

# ─── Building Generator ─────────────────────────────────────────────────────

def build_building_type(type_name, spec):
    clear_scene()
    
    seed = BUILDING_SEEDS.get(type_name, 9999)
    rng = random.Random(seed)
    
    mat_paper = create_material("paper", PAPER_COLOR)
    mat_glow = create_material("glow", (1.0, 0.55, 0.10, 1.0), emissive=True)
    mat_terracotta = create_material("terracotta", TERRACOTTA)
    mat_cornice = create_material("cornice", CORNICE_COLOR)
    
    wall_height = spec["levels"] * spec["wall_height_per_level"]
    roof_base_height = wall_height
    
    # 1. Base mesh
    base = create_base_mesh(f"{type_name}__base", spec["footprint"], 0.0, rng)
    base.data.materials.append(mat_paper)
    
    # 2. Detailed walls with brick pattern, windows, doors
    wall_objs = []
    footprint = spec["footprint"]
    facade_type = spec.get("facade", "residential")
    window_pattern = spec.get("window_pattern", "regular")
    
    for i in range(len(footprint)):
        p1 = Vector(footprint[i])
        p2 = Vector(footprint[(i + 1) % len(footprint)])
        
        wall = create_detailed_wall_mesh(
            f"{type_name}__wall_{i}", p1, p2, wall_height,
            spec["levels"], facade_type, window_pattern, rng
        )
        wall.data.materials.append(mat_paper)
        wall_objs.append(wall)
    
    # 3. Cornice trim at top of walls
    cornice_objs = []
    for i in range(len(footprint)):
        p1 = Vector(footprint[i])
        p2 = Vector(footprint[(i + 1) % len(footprint)])
        cornice = create_cornice_mesh(f"{type_name}__cornice_{i}", p1, p2, wall_height, rng)
        cornice.data.materials.append(mat_cornice)
        cornice_objs.append(cornice)
    
    # 4. Roof
    if spec["roof_type"] == "gable":
        roof_objs = create_gable_roof(type_name, spec["footprint"], wall_height, spec["roof_pitch"], TERRACOTTA, rng)
    else:
        roof_objs = create_hip_roof(type_name, spec["footprint"], wall_height, spec["roof_pitch"], TERRACOTTA, rng)
    
    for roof in roof_objs:
        roof.data.materials.append(mat_terracotta)
    
    # 5. Chimney for manor types
    chimney_objs = []
    if type_name.startswith("manor"):
        cx, cy = centroid_2d(spec["footprint"])
        chimney = create_chimney(f"{type_name}__chimney", cx, cy, wall_height, wall_height + 0.5, rng)
        chimney.data.materials.append(mat_terracotta)
        chimney_objs.append(chimney)
    
    # 6. Storefront for commercial ground floors
    storefront_objs = []
    if facade_type == "commercial":
        for i in range(len(footprint)):
            p1 = Vector(footprint[i])
            p2 = Vector(footprint[(i + 1) % len(footprint)])
            storefront = create_storefront_mesh(f"{type_name}__storefront_{i}", p1, p2, spec["wall_height_per_level"], rng)
            storefront.data.materials.append(mat_glow)
            storefront_objs.append(storefront)
    
    # 7. Flap pairs for all hinged elements
    all_flap_objs = wall_objs + roof_objs + chimney_objs + cornice_objs
    max_layer = create_flap_pairs(type_name, all_flap_objs, math.pi / 2, layer_start=1)
    
    # Storefronts don't fold (they're flat on base), but add as static
    for sf in storefront_objs:
        sf.name = f"{type_name}__{sf.name}"
        # No hinge userData = static
    
    # 8. Animation
    setup_fold_animation(max_layer)
    
    # 9. Meta
    meta = compute_assets_meta(type_name, base, all_flap_objs, wall_height, wall_height + 0.5)
    
    return {"name": type_name, "meta": meta}

# ─── Merge & Main ───────────────────────────────────────────────────────────

def merge_into_tiles_glb(building_metas, tiles_glb_path, meta_json_path):
    from pygltflib import GLTF2
    
    print("Loading tiles.glb...")
    tiles = GLTF2().load(tiles_glb_path)
    
    existing_node_names = set()
    if tiles.nodes:
        for node in tiles.nodes:
            if node.name:
                existing_node_names.add(node.name)
    
    mesh_offset = len(tiles.meshes) if tiles.meshes else 0
    node_offset = len(tiles.nodes) if tiles.nodes else 0
    
    with open(meta_json_path) as f:
        meta = json.load(f)
    
    if "tiles" not in meta:
        meta["tiles"] = {}
    
    for building in building_metas:
        type_name = building["name"]
        glb_path = f"/home/clawman/papertrails-laramie-original/public/models/{type_name}.glb"
        if not os.path.exists(glb_path):
            print(f"WARNING: {glb_path} not found, skipping")
            continue
        
        print(f"Merging {type_name}...")
        building_gltf = GLTF2().load(glb_path)
        
        if building_gltf.meshes:
            for mesh in building_gltf.meshes:
                tiles.meshes.append(mesh)
        
        if building_gltf.nodes:
            for node in building_gltf.nodes:
                if node.name in existing_node_names:
                    print(f"  Skipping duplicate: {node.name}")
                    continue
                existing_node_names.add(node.name)
                
                if node.mesh is not None:
                    node.mesh += mesh_offset
                tiles.nodes.append(node)
        
        if building_gltf.animations:
            if not tiles.animations:
                tiles.animations = []
            
            fold_ref = None
            for anim in tiles.animations:
                if anim.name == "fold_ref":
                    fold_ref = anim
                    break
            
            if not fold_ref:
                fold_ref = building_gltf.animations[0]
                for ch in fold_ref.channels:
                    ch.target.node += node_offset
                tiles.animations.append(fold_ref)
            else:
                for anim in building_gltf.animations:
                    if anim.name == "fold_ref":
                        for ch in anim.channels:
                            ch.target.node += node_offset
                            fold_ref.channels.append(ch)
        
        mesh_offset += len(building_gltf.meshes) if building_gltf.meshes else 0
        node_offset += len(building_gltf.nodes) if building_gltf.nodes else 0
        
        if "tiles" not in meta:
            meta["tiles"] = {}
        meta["tiles"][type_name] = building["meta"]
        
        print(f"  Merged: {len(building_gltf.meshes)} meshes, {len(building_gltf.nodes)} nodes")
    
    # Backup and save
    import shutil
    shutil.copy2(tiles_glb_path, tiles_glb_path + ".backup")
    tiles.save_binary(tiles_glb_path)
    print("Updated tiles.glb (original backed up)")
    
    with open(meta_json_path, 'w') as f:
        json.dump(meta, f, indent=4)
    print(f"Updated {meta_json_path}")

def main():
    argv = sys.argv
    if "--" in argv:
        argv = argv[argv.index("--") + 1:]
    else:
        argv = []
    
    output_dir = "/home/clawman/papertrails-laramie-original/public/models"
    os.makedirs(output_dir, exist_ok=True)
    
    if "--generate-all" in argv:
        print("Generating all 5 building types with detailed paper architecture...")
        building_metas = []
        
        for type_name, spec in BUILDING_SPECS.items():
            print(f"  Generating {type_name}...")
            result = build_building_type(type_name, spec)
            
            glb_path = os.path.join(output_dir, f"{type_name}.glb")
            export_glb(type_name, glb_path)
            print(f"    Exported: {glb_path}")
            
            building_metas.append(result)
        
        # Merge into tiles.glb
        tiles_glb = "/home/clawman/papertrails-laramie-original/public/models/tiles.glb"
        meta_json = "/home/clawman/papertrails-laramie-original/public/models/assets_meta.json"
        merge_into_tiles_glb(building_metas, tiles_glb, meta_json)
        
        print("Done!")
    
    elif "--test" in argv:
        for type_name, spec in BUILDING_SPECS.items():
            print(f"Testing {type_name}...")
            result = build_building_type(type_name, spec)
            glb_path = os.path.join(output_dir, f"{type_name}.glb")
            export_glb(type_name, glb_path)
            print(f"  Exported: {glb_path}")
    
    else:
        print("Usage:")
        print("  --generate-all    Generate all 5 building types with detailed architecture")
        print("  --test            Quick test generation")

if __name__ == "__main__":
    main()