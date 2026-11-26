#!/usr/bin/env blender --background --python
"""
Generate a CUTE ROUND GREEN ALIEN player model for the Paper Trails engine.

Design goals:
- Round, chubby, adorable alien (not a plain sphere)
- Large expressive eyes with highlights
- Cute antennae with glowing tips
- Proper limbs with hands/feet (3 fingers/toes)
- Belly patch, little spots for character
- Expressive face with little mouth
- Height ~0.6 world units (TRAVELLER_HEIGHT)

Contract:
- Single root node named 'alien_player'
- Parts as children: body, head, eye_l, eye_r, pupil_l, pupil_r, antenna_l, antenna_r, antenna_tip_l, antenna_tip_r, arm_l, arm_r, hand_l, hand_r, leg_l, leg_r, foot_l, foot_r, belly, spots
- Origin at feet (y=0), height ~0.6 world units
- Vertex colors drive the paper material
- Export: GLB, export_yup=False
"""

import bpy
import math
import random
from mathutils import Color

# --- Colors ---
LIME_GREEN      = Color((0.35, 0.85, 0.25))   # Main body color
DARK_GREEN      = Color((0.20, 0.55, 0.15))   # Darker accents (limbs, spots)
BRIGHT_GREEN    = Color((0.55, 0.95, 0.35))   # Highlights
BELLY_GREEN     = Color((0.65, 0.98, 0.55))   # Light belly
WHITE           = Color((0.98, 0.98, 0.98))   # Eyes
BLACK           = Color((0.02, 0.02, 0.02))   # Pupils
YELLOW_GLOW     = Color((1.0, 0.95, 0.2))     # Antenna tips
PINK_BLUSH      = Color((1.0, 0.6, 0.7))      # Cheek blush
MOUTH_COLOR     = Color((0.15, 0.1, 0.1))     # Mouth

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

def vcol(ob, color, jitter=0.03):
    me = ob.data
    if len(me.vertex_colors) > 0:
        vc = me.vertex_colors[0]
    else:
        vc = me.vertex_colors.new()
    random.seed(hash(ob.name) & 0xffff)
    for poly in me.polygons:
        for li in poly.loop_indices:
            c = vc.data[li].color
            c[0] = min(1, max(0, color.r + random.uniform(-jitter, jitter)))
            c[1] = min(1, max(0, color.g + random.uniform(-jitter, jitter)))
            c[2] = min(1, max(0, color.b + random.uniform(-jitter, jitter)))
            c[3] = 1.0

def add_mesh(name, verts, faces, color, parent=None, location=(0, 0, 0), rotation=(0, 0, 0), smooth=True):
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts, [], faces)
    me.update()
    if smooth:
        for poly in me.polygons:
            poly.use_smooth = True
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
    bpy.ops.mesh.primitive_ico_sphere_add(radius=radius, subdivisions=subdivisions)
    ob = bpy.context.active_object
    verts = [(v.co.x, v.co.y, v.co.z) for v in ob.data.vertices]
    faces = [(p.vertices[0], p.vertices[1], p.vertices[2]) for p in ob.data.polygons]
    bpy.data.objects.remove(ob, do_unlink=True)
    return verts, faces

def uv_sphere(radius, segments=16, rings=12):
    """Create a UV sphere with more control over shape."""
    verts = []
    faces = []
    for ring in range(rings + 1):
        phi = math.pi * ring / rings
        for seg in range(segments):
            theta = 2 * math.pi * seg / segments
            x = radius * math.sin(phi) * math.cos(theta)
            y = radius * math.cos(phi)
            z = radius * math.sin(phi) * math.sin(theta)
            verts.append((x, y, z))
    for ring in range(rings):
        for seg in range(segments):
            next_seg = (seg + 1) % segments
            v1 = ring * segments + seg
            v2 = ring * segments + next_seg
            v3 = (ring + 1) * segments + next_seg
            v4 = (ring + 1) * segments + seg
            faces.append((v1, v2, v3))
            faces.append((v1, v3, v4))
    return verts, faces

def cylinder_verts(radius, height, segments=12, taper=1.0):
    """Create cylinder verts/faces (vertical along Y). taper=1.0 = cylinder, <1 = cone."""
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
        r = radius * taper
        verts.append((r * math.cos(a), height, r * math.sin(a)))
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
    verts = []
    faces = []
    verts.append((0, 0, 0))
    verts.append((0, height, 0))
    for i in range(segments):
        a = (i / segments) * 2 * math.pi
        verts.append((radius * math.cos(a), 0, radius * math.sin(a)))
    base_center = 0
    tip = 1
    base_ring_start = 2
    for i in range(segments):
        i2 = (i + 1) % segments
        faces.append((base_center, base_ring_start + i2, base_ring_start + i))
        faces.append((base_ring_start + i, base_ring_start + i2, tip))
    return verts, faces

def rounded_box(w, h, d, radius=0.05):
    """Create a box with slightly rounded corners using beveled approach."""
    # Simple box for now - can be enhanced
    hw, hh, hd = w/2, h/2, d/2
    verts = [
        (-hw, -hh, -hd), (hw, -hh, -hd), (hw, hh, -hd), (-hw, hh, -hd),
        (-hw, -hh, hd),  (hw, -hh, hd),  (hw, hh, hd),  (-hw, hh, hd),
    ]
    faces = [
        (0,1,2),(0,2,3), (4,5,6),(4,6,7),
        (0,1,5),(0,5,4), (1,2,6),(1,6,5),
        (2,3,7),(2,7,6), (3,0,4),(3,4,7),
    ]
    return verts, faces

def build_alien_player():
    scene_reset()
    random.seed(42)

    root = add_empty('alien_player', None, (0, 0, 0))

    # ========================================================================
    # BODY - chubby rounded body, slightly wider than tall
    # ========================================================================
    # Main body - slightly squashed sphere for chubby look
    body_verts, body_faces = uv_sphere(0.26, 20, 16)
    # Scale Y slightly less for chubby look
    body_verts = [(x, y * 0.85, z) for x, y, z in body_verts]
    body = add_mesh('body', body_verts, body_faces, LIME_GREEN, parent=root, location=(0, 0.26, 0))

    # Belly patch - lighter green oval on front
    belly_verts, belly_faces = uv_sphere(0.18, 12, 10)
    belly_verts = [(x * 0.7, y * 0.9, z * 0.05 + 0.22) for x, y, z in belly_verts]
    belly = add_mesh('belly', belly_verts, belly_faces, BELLY_GREEN, parent=root, location=(0, 0.18, 0.18))

    # Little spots on body (3-4 small darker spots)
    for i in range(4):
        angle = random.uniform(0, 6.28)
        height = random.uniform(0.1, 0.4)
        radius = 0.18
        x = math.cos(angle) * radius
        z = math.sin(angle) * radius
        spot_verts, spot_faces = uv_sphere(0.025, 6, 5)
        add_mesh(f'spot_{i}', spot_verts, spot_faces, DARK_GREEN, parent=root, location=(x, height, z))

    # ========================================================================
    # HEAD - slightly larger than realistic proportion for cuteness
    # ========================================================================
    head_verts, head_faces = uv_sphere(0.19, 16, 12)
    head_verts = [(x, y * 0.95, z) for x, y, z in head_verts]  # slightly squashed
    head = add_mesh('head', head_verts, head_faces, LIME_GREEN, parent=root, location=(0, 0.5, 0))

    # ========================================================================
    # EYES - large, expressive with highlights
    # ========================================================================
    eye_r = 0.05
    eye_verts, eye_faces = uv_sphere(eye_r, 12, 8)
    # Left eye
    eye_l = add_mesh('eye_l', eye_verts, eye_faces, WHITE, parent=root, location=(-0.065, 0.51, 0.15))
    # Left pupil - slightly larger for cute look
    pupil_verts, pupil_faces = uv_sphere(0.028, 8, 6)
    pupil_l = add_mesh('pupil_l', pupil_verts, pupil_faces, BLACK, parent=root, location=(-0.065, 0.51, 0.175))
    # Eye highlight (tiny white dot on pupil)
    highlight_verts, highlight_faces = uv_sphere(0.01, 6, 4)
    add_mesh('highlight_l', highlight_verts, highlight_faces, WHITE, parent=root, location=(-0.055, 0.515, 0.18))

    # Right eye
    eye_r_obj = add_mesh('eye_r', eye_verts, eye_faces, WHITE, parent=root, location=(0.065, 0.51, 0.15))
    pupil_r = add_mesh('pupil_r', pupil_verts, pupil_faces, BLACK, parent=root, location=(0.065, 0.51, 0.175))
    add_mesh('highlight_r', highlight_verts, highlight_faces, WHITE, parent=root, location=(0.075, 0.515, 0.18))

    # ========================================================================
    # CHEEK BLUSH - cute pink circles under eyes
    # ========================================================================
    blush_verts, blush_faces = uv_sphere(0.035, 8, 6)
    add_mesh('blush_l', blush_verts, blush_faces, PINK_BLUSH, parent=root, location=(-0.095, 0.46, 0.13))
    add_mesh('blush_r', blush_verts, blush_faces, PINK_BLUSH, parent=root, location=(0.095, 0.46, 0.13))

    # ========================================================================
    # MOUTH - tiny curved line for expression
    # ========================================================================
    # Simple curved line made of small quads
    mouth_verts = []
    mouth_faces = []
    for i in range(7):
        t = i / 6
        x = (t - 0.5) * 0.06
        y = 0.45 + math.sin(t * math.pi) * 0.015
        z = 0.17
        base = i * 4
        mouth_verts.append((x - 0.01, y - 0.005, z))
        mouth_verts.append((x + 0.01, y - 0.005, z))
        mouth_verts.append((x + 0.01, y + 0.005, z))
        mouth_verts.append((x - 0.01, y + 0.005, z))
        mouth_faces.append((base, base+1, base+2, base+3))
    add_mesh('mouth', mouth_verts, mouth_faces, MOUTH_COLOR, parent=root)

    # ========================================================================
    # ANTENNAE - curved with glowing tips
    # ========================================================================
    for side, x_off in [('l', -0.07), ('r', 0.07)]:
        # Antenna base - curved tube using multiple segments
        for seg in range(5):
            seg_h = 0.07
            y_base = 0.62 + seg * seg_h
            bend = math.radians(-12 * (1 if side == 'l' else -1)) * (seg + 1) / 5
            ant_verts, ant_faces = cylinder_verts(0.012, seg_h, 8)
            ant = add_mesh(f'antenna_{side}_{seg}', ant_verts, ant_faces, LIME_GREEN, parent=root,
                           location=(x_off, y_base, 0.04), rotation=(bend, 0, 0))

        # Antenna tip - glowing bulb
        tip_verts, tip_faces = uv_sphere(0.032, 8, 6)
        add_mesh(f'antenna_tip_{side}', tip_verts, tip_faces, YELLOW_GLOW, parent=root,
                 location=(x_off * 1.4, 0.95, 0.06))

    # ========================================================================
    # ARMS & HANDS - cute chubby arms with 3-finger hands
    # ========================================================================
    for side, x_off in [('l', -0.22), ('r', 0.22)]:
        # Upper arm
        arm_verts, arm_faces = cylinder_verts(0.035, 0.14, 8)
        arm = add_mesh(f'arm_{side}', arm_verts, arm_faces, LIME_GREEN, parent=root,
                       location=(x_off, 0.32, 0), rotation=(0, 0, math.radians(20 * (1 if side == 'l' else -1))))

        # Forearm
        fore_verts, fore_faces = cylinder_verts(0.03, 0.12, 8)
        add_mesh(f'forearm_{side}', fore_verts, fore_faces, LIME_GREEN, parent=root,
                 location=(x_off * 1.3, 0.18, 0), rotation=(0, 0, math.radians(30 * (1 if side == 'l' else -1))))

        # Hand - simple 3-finger hand
        hand_verts, hand_faces = uv_sphere(0.045, 8, 6)
        hand = add_mesh(f'hand_{side}', hand_verts, hand_faces, LIME_GREEN, parent=root,
                        location=(x_off * 1.5, 0.06, 0))

        # Three little fingers
        for f in range(3):
            finger_verts, finger_faces = cylinder_verts(0.012, 0.05, 5)
            add_mesh(f'finger_{side}_{f}', finger_verts, finger_faces, LIME_GREEN, parent=root,
                     location=(x_off * 1.5 + (f - 1) * 0.025, 0.09, 0.015),
                     rotation=(math.radians(-90), 0, 0))

    # ========================================================================
    # LEGS & FEET - chubby legs with 3-toed feet
    # ========================================================================
    for side, x_off in [('l', -0.07), ('r', 0.07)]:
        # Thigh
        thigh_verts, thigh_faces = cylinder_verts(0.045, 0.14, 8)
        thigh = add_mesh(f'thigh_{side}', thigh_verts, thigh_faces, DARK_GREEN, parent=root,
                         location=(x_off, 0.2, 0))

        # Lower leg
        calf_verts, calf_faces = cylinder_verts(0.04, 0.12, 8)
        add_mesh(f'calf_{side}', calf_verts, calf_faces, DARK_GREEN, parent=root,
                 location=(x_off, 0.06, 0))

        # Foot - rounded with 3 toes
        foot_verts, foot_faces = uv_sphere(0.055, 10, 8)
        foot_verts = [(x, y * 0.5, z * 1.2) for x, y, z in foot_verts]  # flatten and elongate
        foot = add_mesh(f'foot_{side}', foot_verts, foot_faces, DARK_GREEN, parent=root,
                        location=(x_off, 0, 0.03))

        # Three toes
        for t in range(3):
            toe_verts, toe_faces = uv_sphere(0.025, 6, 5)
            add_mesh(f'toe_{side}_{t}', toe_verts, toe_faces, DARK_GREEN, parent=root,
                     location=(x_off + (t - 1) * 0.022, 0.015, 0.08))

    # ========================================================================
    # TAIL - small cute tail
    # ========================================================================
    tail_verts, tail_faces = cone_verts(0.025, 0.1, 8)
    add_mesh('tail', tail_verts, tail_faces, DARK_GREEN, parent=root,
             location=(0, 0.18, -0.26), rotation=(math.radians(30), 0, 0))

    # Export
    out = '/home/clawman/papertrails-laramie-original/public/models/alien_player.glb'
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', export_yup=False)
    print('EXPORTED', out)

if __name__ == '__main__':
    build_alien_player()