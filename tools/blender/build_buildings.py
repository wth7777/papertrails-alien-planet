#!/usr/bin/env python3
"""
Blender Building Generator for Paper Trails Laramie
Generates parametric building models with flap animations matching tiles.glb conventions.

Usage:
  blender --background --python tools/blender/build_buildings.py -- --courthouse
  blender --background --python tools/blender/build_buildings.py -- --batch-all
"""

import bpy
import math
import json
import sys
import os
from mathutils import Vector, Matrix
from dataclasses import dataclass
from typing import List, Tuple, Optional

# ─── Configuration ────────────────────────────────────────────────────────────

TILE_SIZE = 2.0  # World units per tile
FLAP_LAYER_GAP = 0.004  # Gap between flap layers
CARD_THICKNESS = 0.016  # Cardstock thickness

# Paper material colors (vertex colors)
PAPER_COLOR = (0.96, 0.94, 0.90, 1.0)      # Kraft paper
PAPER_SHADE = (0.70, 0.68, 0.62, 1.0)      # Darker paper
TERRACOTTA = (0.75, 0.35, 0.20, 1.0)       # Roof/brick
INK = (0.12, 0.10, 0.08, 1.0)              # Dark lines
OLIVE = (0.40, 0.45, 0.25, 1.0)            # Foliage
MOSS = (0.25, 0.35, 0.20, 1.0)             # Dark foliage

# ─── Data Structures ──────────────────────────────────────────────────────────

@dataclass
class BuildingParams:
    name: str
    footprint_pts: List[Tuple[float, float]]  # UTM coordinates
    levels: int
    roof_type: str  # 'gable', 'hip', 'flat'
    wall_height_per_level: float = 0.35
    roof_pitch: float = 0.6
    footprint_scale: float = 0.5  # UTM meters → world units (1 UTM m = 0.5 world units)

@dataclass
class HingeData:
    fold_angle: float
    delay: float
    layer: int

# ─── Utility Functions ────────────────────────────────────────────────────────

def clear_scene():
    """Remove all objects from scene."""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()

def utm_to_world(utm_e: float, utm_n: float, ref_e: float, ref_n: float) -> Tuple[float, float]:
    """Convert UTM to world coordinates (X east, Z south)."""
    x = (utm_e - ref_e) * 0.5
    z = (utm_n - ref_n) * 0.5  # Note: UTM northing increases north, world Z increases south
    return x, -z

def centroid_2d(pts: List[Tuple[float, float]]) -> Tuple[float, float]:
    """Calculate centroid of 2D polygon."""
    if not pts:
        return 0, 0
    x = sum(p[0] for p in pts) / len(pts)
    y = sum(p[1] for p in pts) / len(pts)
    return x, y

def create_material(name: str, color: Tuple[float, float, float, float], emissive: bool = False):
    """Create a material with given color."""
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    
    # Clear default nodes
    for node in nodes:
        nodes.remove(node)
    
    # Create output and BSDF
    output = nodes.new('ShaderNodeOutputMaterial')
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    output.location = (300, 0)
    bsdf.location = (0, 0)
    
    if emissive:
        bsdf.inputs['Emission Strength'].default_value = 2.0
        bsdf.inputs['Emission Color'].default_value = color
        bsdf.inputs['Base Color'].default_value = color
    else:
        bsdf.inputs['Base Color'].default_value = color
        bsdf.inputs['Roughness'].default_value = 0.9
        # Specular may not exist in newer Blender versions
        if 'Specular' in bsdf.inputs:
            bsdf.inputs['Specular'].default_value = 0.1
        elif 'Specular IOR Level' in bsdf.inputs:
            bsdf.inputs['Specular IOR Level'].default_value = 0.1
    
    links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])
    
    # Add vertex color input
    vc = nodes.new('ShaderNodeVertexColor')
    vc.location = (-300, 0)
    vc.layer_name = "Col"
    links.new(vc.outputs['Color'], bsdf.inputs['Base Color'])
    
    return mat

def add_hinge_userdata(obj: bpy.types.Object, fold_angle: float, delay: float, layer: int):
    """Add hinge userData to object matching loader expectations."""
    obj["hinge"] = True
    obj["foldAngle"] = fold_angle
    obj["delay"] = max(0.0, min(1.0, delay))
    obj["layer"] = max(0, int(layer))

def create_base_mesh(name: str, footprint: List[Tuple[float, float]], height: float = 0.0) -> bpy.types.Object:
    """Create base mesh from footprint polygon."""
    # Convert to 2D points (X, Z)
    verts_2d = [Vector((x, y)) for x, y in footprint]
    
    # Create mesh
    mesh = bpy.data.meshes.new(name + "_mesh")
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    
    # Triangulate polygon (fan from centroid)
    cx, cy = centroid_2d(footprint)
    center = Vector((cx, cy))
    
    # Build vertices: center + perimeter
    vertices = [center] + verts_2d
    faces = []
    for i in range(len(verts_2d)):
        next_i = (i + 1) % len(verts_2d)
        faces.append([0, i + 1, next_i + 1])
    
    # Create 3D vertices with height
    verts_3d = [(v.x, v.y, height) for v in vertices]
    mesh.from_pydata(verts_3d, [], faces)
    mesh.update()
    
    # Add vertex color layer
    vc_layer = mesh.vertex_colors.new(name="Col")
    for poly in mesh.polygons:
        for loop_idx in poly.loop_indices:
            vc_layer.data[loop_idx].color = PAPER_COLOR
    
    return obj

def create_wall_mesh(name: str, p1: Vector, p2: Vector, height: float, color: Tuple) -> bpy.types.Object:
    """Create a wall mesh between two points."""
    mesh = bpy.data.meshes.new(name + "_mesh")
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    
    # Wall is a vertical quad
    dx = p2.x - p1.x
    dy = p2.y - p1.y
    length = math.sqrt(dx*dx + dy*dy)
    
    if length < 0.01:
        return obj
    
    # Normal pointing outward
    nx = -dy / length
    ny = dx / length
    
    # Four corners
    v1 = (p1.x, p1.y, 0)
    v2 = (p2.x, p2.y, 0)
    v3 = (p2.x + nx * CARD_THICKNESS, p2.y + ny * CARD_THICKNESS, 0)
    v4 = (p1.x + nx * CARD_THICKNESS, p1.y + ny * CARD_THICKNESS, 0)
    v5 = (p1.x, p1.y, height)
    v6 = (p2.x, p2.y, height)
    v7 = (p2.x + nx * CARD_THICKNESS, p2.y + ny * CARD_THICKNESS, height)
    v8 = (p1.x + nx * CARD_THICKNESS, p1.y + ny * CARD_THICKNESS, height)
    
    vertices = [v1, v2, v3, v4, v5, v6, v7, v8]
    faces = [
        [0, 1, 5, 4],    # Front (outside)
        [3, 2, 6, 7],    # Back (inside)
        [1, 2, 6, 5],    # Right edge
        [3, 0, 4, 7],    # Left edge
        [4, 5, 6, 7],    # Top
        [3, 2, 1, 0],    # Bottom
    ]
    
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    
    # Vertex colors
    vc_layer = mesh.vertex_colors.new(name="Col")
    for poly in mesh.polygons:
        for loop_idx in poly.loop_indices:
            vc_layer.data[loop_idx].color = color
    
    return obj

def create_gable_roof(name: str, footprint: List[Tuple[float, float]], wall_height: float, pitch: float, color: Tuple) -> List[bpy.types.Object]:
    """Create gable roof (two sloped planes meeting at ridge)."""
    # Find long axis for ridge direction
    # For simplicity, assume ridge runs along X axis
    cx, cy = centroid_2d(footprint)
    
    # Get bounding box
    min_x = min(p[0] for p in footprint)
    max_x = max(p[0] for p in footprint)
    min_y = min(p[1] for p in footprint)
    max_y = max(p[1] for p in footprint)
    
    width = max_x - min_x
    depth = max_y - min_y
    ridge_height = (min(width, depth) / 2) * pitch
    
    roof_objs = []
    
    # Two roof planes
    for side in [-1, 1]:  # -1 = front, 1 = back
        mesh = bpy.data.meshes.new(f"{name}_roof_{side}_mesh")
        obj = bpy.data.objects.new(f"{name}_roof_{side}", mesh)
        bpy.context.collection.objects.link(obj)
        
        y_center = cy + side * depth / 2
        y_ridge = cy
        
        # Four corners of this roof plane
        v1 = (min_x, y_center, wall_height)
        v2 = (max_x, y_center, wall_height)
        v3 = (max_x, y_ridge, wall_height + ridge_height)
        v4 = (min_x, y_ridge, wall_height + ridge_height)
        
        vertices = [v1, v2, v3, v4]
        faces = [[0, 1, 2, 3]]
        
        mesh.from_pydata(vertices, [], faces)
        mesh.update()
        
        vc_layer = mesh.vertex_colors.new(name="Col")
        for poly in mesh.polygons:
            for loop_idx in poly.loop_indices:
                vc_layer.data[loop_idx].color = color
        
        roof_objs.append(obj)
    
    return roof_objs

def create_hip_roof(name: str, footprint: List[Tuple[float, float]], wall_height: float, pitch: float, color: Tuple) -> List[bpy.types.Object]:
    """Create hip roof (four sloped planes meeting at ridge)."""
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
    
    # Four roof planes: two trapezoids (sides) + two triangles (ends)
    planes = [
        # Front (triangle)
        {"name": "front", "verts": [
            (min_x, min_y, wall_height),
            (max_x, min_y, wall_height),
            (cx, cy, wall_height + ridge_height),
        ]},
        # Back (triangle)
        {"name": "back", "verts": [
            (max_x, max_y, wall_height),
            (min_x, max_y, wall_height),
            (cx, cy, wall_height + ridge_height),
        ]},
        # Left (trapezoid)
        {"name": "left", "verts": [
            (min_x, min_y, wall_height),
            (min_x, max_y, wall_height),
            (cx - ridge_length/2, cy, wall_height + ridge_height),
            (cx + ridge_length/2, cy, wall_height + ridge_height),
        ]},
        # Right (trapezoid)
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
                vc_layer.data[loop_idx].color = color
        
        roof_objs.append(obj)
    
    return roof_objs

def create_flat_roof(name: str, footprint: List[Tuple[float, float]], wall_height: float, color: Tuple) -> bpy.types.Object:
    """Create flat roof."""
    return create_base_mesh(name + "_roof", footprint, wall_height)

def create_chimney(name: str, base_x: float, base_y: float, wall_height: float, roof_height: float, color: Tuple) -> bpy.types.Object:
    """Create a chimney."""
    mesh = bpy.data.meshes.new(name + "_mesh")
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    
    w = 0.15
    d = 0.15
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
    
    faces = [
        [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7],
        [4, 5, 6, 7], [3, 2, 1, 0],
    ]
    
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    
    vc_layer = mesh.vertex_colors.new(name="Col")
    for poly in mesh.polygons:
        for loop_idx in poly.loop_indices:
            vc_layer.data[loop_idx].color = color
    
    return obj

def create_flap_pairs(base_name: str, meshes: List[bpy.types.Object], fold_angle: float, layer_start: int, layer_increment: int = 1) -> int:
    """Create _xb and _xf flap pairs for each mesh.
    Meshes should already be named like '{base_name}__part'.
    Returns the next available layer number.
    """
    next_layer = layer_start
    total_flaps = len(meshes)
    
    for mesh_obj in meshes:
        # mesh_obj already has name like 'courthouse__wall_0'
        # Rename to _xb variant
        if not mesh_obj.name.endswith('_xb') and not mesh_obj.name.endswith('_xf'):
            mesh_obj.name = f"{mesh_obj.name}_xb"
        
        # Distribute delays evenly across all flaps (0.0 to 1.0)
        delay = 1.0 - (next_layer - layer_start) / max(1, total_flaps - 1) if total_flaps > 1 else 0.5
        add_hinge_userdata(mesh_obj, fold_angle, delay, next_layer)
        
        # Create _xf copy (folded forward)
        xf_obj = mesh_obj.copy()
        xf_obj.data = mesh_obj.data.copy()
        xf_obj.name = mesh_obj.name.replace('_xb', '_xf')
        bpy.context.collection.objects.link(xf_obj)
        add_hinge_userdata(xf_obj, -fold_angle, delay, next_layer)
        
        next_layer += layer_increment
    
    return next_layer

def setup_fold_animation(model_name: str, max_layer: int):
    """Create fold_ref animation action driving rotation on hinge meshes."""
    # Create action
    action = bpy.data.actions.new(name="fold_ref")
    
    # Get all hinge objects
    hinge_objects = [obj for obj in bpy.data.objects if obj.get("hinge", False)]
    
    for obj in hinge_objects:
        fold_angle = obj.get("foldAngle", 0)
        
        # Ensure animation data exists
        if not obj.animation_data:
            obj.animation_data_create()
        obj.animation_data.action = action
        
        # Add rotation keyframes at frame 0 (flat) and frame 30 (folded)
        # Frame 0: rotation = 0
        obj.rotation_euler = (0, 0, 0)
        obj.keyframe_insert(data_path="rotation_euler", frame=0)
        
        # Frame 30: rotation = fold_angle around X axis (for upright flaps)
        obj.rotation_euler = (fold_angle, 0, 0)
        obj.keyframe_insert(data_path="rotation_euler", frame=30)
        
        # Set interpolation to linear
        if obj.animation_data and obj.animation_data.action:
            for fcu in obj.animation_data.action.fcurves:
                for kp in fcu.keyframe_points:
                    kp.interpolation = 'LINEAR'

def compute_assets_meta(model_name: str, base_obj: bpy.types.Object, flap_objs: List[bpy.types.Object], 
                        wall_height: float, roof_height: float) -> dict:
    """Compute assets_meta.json entry for model."""
    # Count triangles
    total_tris = 0
    hinge_data = []
    
    # Base mesh
    if base_obj.data:
        total_tris += len(base_obj.data.polygons)
    
    # Flap meshes - include both _xb and _xf variants
    all_flaps = []
    for flap in flap_objs:
        all_flaps.append(flap)
        # Find the _xf counterpart
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
    
    # Sort by layer
    hinge_data.sort(key=lambda h: h["layer"])
    
    max_layer = max([h["layer"] for h in hinge_data]) if hinge_data else 0
    height = roof_height
    
    return {
        "name": model_name,
        "flaps": len(hinge_data),
        "top": sum(1 for h in hinge_data if h["foldAngle"] > 0),
        "flatTop": 0.0,
        "oob": 0.0,
        "tris": total_tris,
        "maxLayer": max_layer,
        "height": height,
        "hinges": hinge_data
    }

# ─── Building Generators ──────────────────────────────────────────────────────

def generate_courthouse():
    """Generate Albany County Courthouse model."""
    # Real footprint (UTM coordinates)
    footprint_utm = [
        (450568.94, 4573492.37),
        (450568.70, 4573489.42),
        (450564.11, 4573489.78),
        (450563.76, 4573485.38),
        (450561.86, 4573485.53),
        (450561.40, 4573479.79),
        (450567.70, 4573479.29),
        (450567.09, 4573471.70),
        (450586.88, 4573470.11),
        (450592.25, 4573469.68),
        (450614.53, 4573467.90),
        (450614.82, 4573471.52),
        (450620.12, 4573471.09),
        (450621.50, 4573488.16),
        (450592.75, 4573490.46),
        (450568.94, 4573492.37),
    ]
    
    # Reference point (from constraints.js)
    REF_UTM_E = 450112
    REF_UTM_N = 4573356
    
    # Convert to world coordinates
    footprint = [utm_to_world(e, n, REF_UTM_E, REF_UTM_N) for e, n in footprint_utm]
    
    # Normalize to tile grid (center at origin)
    cx, cy = centroid_2d(footprint)
    footprint = [(x - cx, y - cy) for x, y in footprint]
    
    # Scale to fit in tile (roughly 2x2 tiles for large building)
    # The courthouse is ~1134 m², which at 4m/tile = ~71 tiles² → ~8x9 tiles
    # But we'll scale to ~2x2 tiles for the model
    scale = 0.03  # Adjust to fit
    footprint = [(x * scale, y * scale) for x, y in footprint]
    
    params = BuildingParams(
        name="courthouse",
        footprint_pts=footprint,
        levels=3,
        roof_type="hip",
        wall_height_per_level=0.35,
        roof_pitch=0.5,
    )
    
    return build_building(params)

def build_building(params: BuildingParams):
    """Build a complete building model."""
    clear_scene()
    
    # Create materials
    mat_paper = create_material("paper", PAPER_COLOR)
    mat_glow = create_material("glow", (1.0, 0.55, 0.10, 1.0), emissive=True)
    mat_terracotta = create_material("terracotta", TERRACOTTA)
    mat_ink = create_material("ink", INK)
    
    # Calculate heights
    wall_height = params.levels * params.wall_height_per_level
    roof_base_height = wall_height
    
    # 1. Base mesh
    base = create_base_mesh(f"{params.name}__base", params.footprint_pts, 0.0)
    base.data.materials.append(mat_paper)
    
    # 2. Walls
    wall_objs = []
    footprint = params.footprint_pts
    for i in range(len(footprint)):
        p1 = Vector(footprint[i])
        p2 = Vector(footprint[(i + 1) % len(footprint)])
        wall = create_wall_mesh(f"{params.name}__wall_{i}", p1, p2, wall_height, PAPER_COLOR)
        wall.data.materials.append(mat_paper)
        wall_objs.append(wall)
    
    # 3. Roof
    if params.roof_type == "gable":
        roof_objs = create_gable_roof(params.name, params.footprint_pts, wall_height, params.roof_pitch, TERRACOTTA)
    elif params.roof_type == "hip":
        roof_objs = create_hip_roof(params.name, params.footprint_pts, wall_height, params.roof_pitch, TERRACOTTA)
    else:
        roof_objs = [create_flat_roof(params.name, params.footprint_pts, wall_height, TERRACOTTA)]
    
    for roof in roof_objs:
        roof.data.materials.append(mat_terracotta)
    
    # 4. Chimney (for courthouse)
    chimney_objs = []
    if params.name == "courthouse":
        cx, cy = centroid_2d(params.footprint_pts)
        chimney = create_chimney(f"{params.name}__chimney", cx, cy, wall_height, wall_height + 0.5, TERRACOTTA)
        chimney.data.materials.append(mat_terracotta)
        chimney_objs.append(chimney)
    
    # 5. Create flap pairs for walls and roof
    all_flap_objs = wall_objs + roof_objs + chimney_objs
    max_layer = create_flap_pairs(params.name, all_flap_objs, math.pi / 2, layer_start=1)
    
    # 6. Setup animation
    setup_fold_animation(params.name, max_layer)
    
    # 7. Compute assets_meta
    meta = compute_assets_meta(params.name, base, all_flap_objs, wall_height, wall_height + 0.5)
    
    return {
        "name": params.name,
        "base": base,
        "walls": wall_objs,
        "roof": roof_objs,
        "chimneys": chimney_objs,
        "meta": meta,
        "wall_height": wall_height,
        "roof_height": wall_height + 0.5,
    }

def export_glb(model_name: str, output_path: str):
    """Export current scene as GLB."""
    # Select all objects
    bpy.ops.object.select_all(action='SELECT')
    
    # Export
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        export_apply=True,
        export_animations=True,
        export_materials='EXPORT',
        export_extras=True,
        export_yup=True,
    )

def save_assets_meta(meta: dict, output_path: str):
    """Save or update assets_meta.json."""
    # Load existing
    existing = {}
    if os.path.exists(output_path):
        with open(output_path) as f:
            existing = json.load(f)
    
    # Update tiles section
    if "tiles" not in existing:
        existing["tiles"] = {}
    
    existing["tiles"][meta["name"]] = meta
    
    # Write back
    with open(output_path, 'w') as f:
        json.dump(existing, f, indent=4)

# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    argv = sys.argv
    if "--" in argv:
        argv = argv[argv.index("--") + 1:]
    else:
        argv = []
    
    output_dir = "/home/clawman/papertrails-laramie-original/public/models"
    os.makedirs(output_dir, exist_ok=True)
    
    if "--courthouse" in argv:
        print("Generating Albany County Courthouse...")
        result = generate_courthouse()
        
        # Export GLB
        glb_path = os.path.join(output_dir, f"{result['name']}.glb")
        export_glb(result['name'], glb_path)
        print(f"Exported: {glb_path}")
        
        # Save meta
        meta_path = os.path.join(output_dir, "assets_meta.json")
        save_assets_meta(result['meta'], meta_path)
        print(f"Updated: {meta_path}")
        
        print("Done!")
    
    elif "--batch-all" in argv:
        # TODO: Generate all 5 types
        print("Batch generation not yet implemented")
    
    elif "--test-house" in argv:
        # Quick test with simple house
        clear_scene()
        params = BuildingParams(
            name="test_house",
            footprint_pts=[(-0.5, -0.5), (0.5, -0.5), (0.5, 0.5), (-0.5, 0.5)],
            levels=1,
            roof_type="gable",
        )
        result = build_building(params)
        glb_path = os.path.join(output_dir, f"{result['name']}.glb")
        export_glb(result['name'], glb_path)
        print(f"Test house exported: {glb_path}")
    
    else:
        print("Usage:")
        print("  --courthouse    Generate Albany County Courthouse")
        print("  --batch-all     Generate all 5 building types")
        print("  --test-house    Quick test with simple house")

if __name__ == "__main__":
    main()