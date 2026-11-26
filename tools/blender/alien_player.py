#!/usr/bin/env blender --background --python
"""
Generate round green cute alien player model for the Paper Trails engine.

Contract:
- Single root node named 'alien_player'
- Parts as children: body, head, eye_l, eye_r, antenna_l, antenna_r, leg_l, leg_r, arm_l, arm_r
- Origin at feet (y=0), height ~0.6 world units (TRAVELLER_HEIGHT)
- Vertex colors drive the paper material
- Export: GLB, export_yup=False
"""

import bpy
import math
import random
from mathutils import Color

# --- Colors ---
LIME_GREEN = Color((0.35, 0.85, 0.25))   # Main body color
DARK_GREEN = Color((0.20, 0.55, 0.15))   # Darker accents
WHITE = Color((0.95, 0.95, 0.95))        # Eyes
BLACK = Color((0.05, 0.05, 0.05))        # Pupils
YELLOW = Color((0.95, 0.85, 0.15))       # Antenna tips

def scene_reset():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for m in list(bpy.data.meshes):
        bpy.data.meshes.remove(m)
    for c in list(bpy.data.collections):
        if c.name != 'Scene Collection':
            bpy.data.collections.remove(c)

def mat_slot(ob, name):
    if not ob.data.materials:
        m = bpy.data.materials.new(name=name)
        m.use_nodes = False
        m.diffuse_color = (1, 1, 1, 1)
        ob.data.materials.append(m)

def vcol(ob, color):
    me = ob.data
    if len(me.vertex_colors) > 0:
        vc = me.vertex_colors[0]
    else:
        vc = me.vertex_colors.new()
    import random
    random.seed(hash(ob.name) & 0xffff)
    for poly in me.polygons:
        for li in poly.loop_indices:
            c = vc.data[li].color
            j = 0.03
            c[0] = min(1, max(0, color.r + random.uniform(-j, j)))
            c[1] = min(1, max(0, color.g + random.uniform(-j, j)))
            c[2] = min(1, max(0, color.b + random.uniform(-j, j)))
            c[3] = 1.0

def add_mesh(name, verts, faces, color, parent=None, location=(0, 0, 0), rotation=(0, 0, 0)):
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts, [], faces)
    me.update()
    ob = bpy.data.objects.new(name, me)
    ob.location = location
    ob.rotation_euler = rotation
    if parent:
        ob.parent = parent
        ob.matrix_parent_inverse = parent.matrix_world.inverted()
    else:
        bpy.data.scenes[0].collection.objects.link(ob)
    mat_slot(ob, name)
    vcol(ob, color)
    return ob

def add_empty(name, parent=None, location=(0, 0, 0)):
    ob = bpy.data.objects.new(name, None)
    ob.empty_display_type = 'PLAIN_AXES'
    ob.location = location
    if parent:
        ob.parent = parent
        ob.matrix_parent_inverse = parent.matrix_world.inverted()
    else:
        bpy.data.scenes[0].collection.objects.link(ob)
    return ob

def ico_sphere(radius, subdivisions=2):
    """Create an icosphere verts/faces."""
    bpy.ops.mesh.primitive_ico_sphere_add(radius=radius, subdivisions=subdivisions)
    ob = bpy.context.active_object
    verts = [(v.co.x, v.co.y, v.co.z) for v in ob.data.vertices]
    faces = [(p.vertices[0], p.vertices[1], p.vertices[2]) for p in ob.data.polygons]
    bpy.data.objects.remove(ob, do_unlink=True)
    return verts, faces

def cylinder_verts(radius, height, segments=12):
    """Create cylinder verts/faces (vertical along Y)."""
    verts = []
    faces = []
    # Bottom center
    verts.append((0, 0, 0))
    # Top center
    verts.append((0, height, 0))
    # Bottom ring
    for i in range(segments):
        a = (i / segments) * 2 * math.pi
        verts.append((radius * math.cos(a), 0, radius * math.sin(a)))
    # Top ring
    for i in range(segments):
        a = (i / segments) * 2 * math.pi
        verts.append((radius * math.cos(a), height, radius * math.sin(a)))
    bottom_center = 0
    top_center = 1
    bottom_ring_start = 2
    top_ring_start = 2 + segments
    # Bottom cap
    for i in range(segments):
        i2 = (i + 1) % segments
        faces.append((bottom_center, bottom_ring_start + i2, bottom_ring_start + i))
    # Top cap
    for i in range(segments):
        i2 = (i + 1) % segments
        faces.append((top_center, top_ring_start + i, top_ring_start + i2))
    # Sides
    for i in range(segments):
        i2 = (i + 1) % segments
        faces.append((bottom_ring_start + i, bottom_ring_start + i2, top_ring_start + i2))
        faces.append((bottom_ring_start + i, top_ring_start + i2, top_ring_start + i))
    return verts, faces

def cone_verts(radius, height, segments=12):
    """Create cone verts/faces (point up along Y)."""
    verts = []
    faces = []
    # Base center
    verts.append((0, 0, 0))
    # Tip
    verts.append((0, height, 0))
    # Base ring
    for i in range(segments):
        a = (i / segments) * 2 * math.pi
        verts.append((radius * math.cos(a), 0, radius * math.sin(a)))
    base_center = 0
    tip = 1
    base_ring_start = 2
    for i in range(segments):
        i2 = (i + 1) % segments
        # Base
        faces.append((base_center, base_ring_start + i2, base_ring_start + i))
        # Side
        faces.append((base_ring_start + i, base_ring_start + i2, tip))
    return verts, faces

def build_alien_player():
    scene_reset()
    random.seed(42)

    root = add_empty('alien_player', None, (0, 0, 0))

    # --- Body (main sphere) ---
    body_verts, body_faces = ico_sphere(0.28, 2)
    body = add_mesh('body', body_verts, body_faces, LIME_GREEN, parent=root, location=(0, 0.28, 0))

    # --- Head (smaller sphere on top) ---
    head_verts, head_faces = ico_sphere(0.18, 2)
    head = add_mesh('head', head_verts, head_faces, LIME_GREEN, parent=root, location=(0, 0.52, 0))

    # --- Eyes (two small spheres on front of head) ---
    eye_r = 0.035
    eye_verts, eye_faces = ico_sphere(eye_r, 1)
    # Left eye
    eye_l = add_mesh('eye_l', eye_verts, eye_faces, WHITE, parent=root, location=(-0.06, 0.53, 0.16))
    # Left pupil
    pupil_verts, pupil_faces = ico_sphere(0.015, 1)
    add_mesh('pupil_l', pupil_verts, pupil_faces, BLACK, parent=root, location=(-0.06, 0.53, 0.175))
    # Right eye
    eye_r_obj = add_mesh('eye_r', eye_verts, eye_faces, WHITE, parent=root, location=(0.06, 0.53, 0.16))
    add_mesh('pupil_r', pupil_verts, pupil_faces, BLACK, parent=root, location=(0.06, 0.53, 0.175))

    # --- Antennae (curved tubes) ---
    for side, x_off in [('l', -0.08), ('r', 0.08)]:
        # Base segment
        ant_verts, ant_faces = cylinder_verts(0.012, 0.12, 8)
        ant = add_mesh(f'antenna_{side}', ant_verts, ant_faces, LIME_GREEN, parent=root,
                       location=(x_off, 0.62, 0.05), rotation=(math.radians(-15 * (1 if side == 'l' else -1)), 0, 0))
        # Tip
        tip_verts, tip_faces = ico_sphere(0.025, 1)
        add_mesh(f'antenna_tip_{side}', tip_verts, tip_faces, YELLOW, parent=root,
                 location=(x_off * 1.3, 0.72, 0.08))

    # --- Legs (short cylinders) ---
    leg_verts, leg_faces = cylinder_verts(0.045, 0.22, 10)
    leg_l = add_mesh('leg_l', leg_verts, leg_faces, DARK_GREEN, parent=root,
                     location=(-0.07, 0.11, 0))
    leg_r = add_mesh('leg_r', leg_verts, leg_faces, DARK_GREEN, parent=root,
                     location=(0.07, 0.11, 0))
    # Feet (flattened spheres)
    foot_verts, foot_faces = ico_sphere(0.055, 1)
    add_mesh('foot_l', foot_verts, foot_faces, DARK_GREEN, parent=root, location=(-0.07, 0, 0.02))
    add_mesh('foot_r', foot_verts, foot_faces, DARK_GREEN, parent=root, location=(0.07, 0, 0.02))

    # --- Arms (short cylinders at sides) ---
    arm_verts, arm_faces = cylinder_verts(0.03, 0.18, 8)
    add_mesh('arm_l', arm_verts, arm_faces, LIME_GREEN, parent=root,
             location=(-0.22, 0.3, 0), rotation=(0, 0, math.radians(20)))
    add_mesh('arm_r', arm_verts, arm_faces, LIME_GREEN, parent=root,
             location=(0.22, 0.3, 0), rotation=(0, 0, math.radians(-20)))

    # Export
    out = '/home/clawman/papertrails-laramie-original/public/models/alien_player.glb'
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', export_yup=False)
    print('EXPORTED', out)

if __name__ == '__main__':
    build_alien_player()