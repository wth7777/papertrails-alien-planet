#!/usr/bin/env blender --background --python
"""
Generate the Paper Trails alien traveller (lime-green hairy alien).

Node-name contract (src/player/traveller.js):
  top node named 'traveller'
  animated parts found by name: body, head, leg_l, leg_r, arm_l, arm_r, lantern
  (aliases: torso/cloak for body; legl/leg_left/leftleg/left_leg for leg_l; etc.)
  each part is re-parented under a runtime X-axis pivot placed at its hinge.
  Height must equal CONFIG.TRAVELLER_HEIGHT = 0.6 world units (feet at y=0).
  Vertex colours drive the paper material colour (lime green here).

Output: public/models/traveller.glb  (replaces the original)
"""

import bpy
import math
from mathutils import Vector, Color

LIME = Color((0.62, 0.95, 0.25))   # lime-green body
LIME_DARK = Color((0.45, 0.7, 0.15))
CREAM = Color((0.92, 0.9, 0.82))   # face / belly
INK = Color((0.18, 0.14, 0.10))    # eyes / pupils

HEIGHT = 0.6  # world units, feet at y=0

def scene_reset():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for m in list(bpy.data.meshes):
        bpy.data.meshes.remove(m)
    for c in list(bpy.data.collections):
        if c.name != 'Scene Collection':
            bpy.data.collections.remove(c)


def mat_slot(ob, name):
    """Ensure object has a material slot (kept minimal; loader swaps material)."""
    if not ob.data.materials:
        m = bpy.data.materials.new(name=name)
        m.use_nodes = False
        m.diffuse_color = (1, 1, 1, 1)
        ob.data.materials.append(m)


def set_vertex_colors(ob, color):
    """Paint every vertex loop color to `color` (with slight per-vertex jitter)."""
    me = ob.data
    if me.vertex_colors:
        vcol = me.vertex_colors[0]
    else:
        vcol = me.vertex_colors.new()
    import random
    random.seed(42)
    for poly in me.polygons:
        for li in poly.loop_indices:
            c = vcol.data[li].color
            j = 0.04
            c[0] = min(1, max(0, color.r + random.uniform(-j, j)))
            c[1] = min(1, max(0, color.g + random.uniform(-j, j)))
            c[2] = min(1, max(0, color.b + random.uniform(-j, j)))
            c[3] = 1.0


def add_cone(name, loc, rot_deg, scale, color, parent=None):
    bpy.ops.mesh.primitive_cone_add(vertices=8, radius1=scale[0], radius2=0.0, depth=scale[2],
                                    location=loc, rotation=(math.radians(rot_deg[0]),
                                                           math.radians(rot_deg[1]),
                                                           math.radians(rot_deg[2])))
    ob = bpy.context.active_object
    ob.name = name
    if parent:
        ob.parent = parent
    mat_slot(ob, name)
    set_vertex_colors(ob, color)
    return ob


def add_capsule(name, loc, rot_deg, radius, height, color, parent=None, segments=8):
    # Build a capsule from two hemispheres + a cylinder
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=segments,
                                         radius=radius, location=loc)
    ob = bpy.context.active_object
    ob.name = name
    # squash to capsule-ish: we'll just use a stretched sphere for simplicity
    ob.scale = (radius, radius, height / (radius * 2))
    if parent:
        ob.parent = parent
    mat_slot(ob, name)
    set_vertex_colors(ob, color)
    return ob


def add_sphere(name, loc, radius, color, parent=None, segments=12, ring_count=8):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=ring_count,
                                         radius=radius, location=loc)
    ob = bpy.context.active_object
    ob.name = name
    if parent:
        ob.parent = parent
    mat_slot(ob, name)
    set_vertex_colors(ob, color)
    return ob


def add_cube(name, loc, rot_deg, scale, color, parent=None):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc,
                                    rotation=(math.radians(rot_deg[0]),
                                              math.radians(rot_deg[1]),
                                              math.radians(rot_deg[2])))
    ob = bpy.context.active_object
    ob.name = name
    ob.scale = scale
    if parent:
        ob.parent = parent
    mat_slot(ob, name)
    set_vertex_colors(ob, color)
    return ob


def main():
    scene_reset()

    # Root traveller group (empty)
    bpy.ops.object.empty_add(type='PLAIN_AXES', location=(0, 0, 0))
    root = bpy.context.active_object
    root.name = 'traveller'

    H = HEIGHT

    # ---- body (pear/egg shape): stretched sphere, origin at HIPS (bottom) for torso pivot
    body = add_sphere('body', (0, H * 0.22, 0), 0.135, LIME, parent=root)
    body.scale = (0.9, 1.0, 1.15)  # taller than wide, egg-like
    body.location.z = 0
    # shift origin down: we want hinge at hips (bottom). Place body so its bottom is near y=0.
    # sphere center at H*0.22 with radius 0.135 => bottom at ~H*0.22-0.135*1.15 = 0.132-0.155 < 0.
    # good enough; the runtime pivot finds the part's bbox top for torso='bottom'.

    # ---- head: round, sits on body, pivot at its BOTTOM (neck)
    head_r = 0.095
    head = add_sphere('head', (0, H * 0.22 + 0.135 + head_r, 0), head_r, CREAM, parent=body)

    # ---- face features (eyes)
    eye_r = 0.022
    leye = add_sphere('leye', (-head_r * 0.35, H * 0.22 + 0.135 + head_r + head_r * 0.25, 0.075), eye_r, INK, parent=head)
    reye = add_sphere('reye', (head_r * 0.35, H * 0.22 + 0.135 + head_r + head_r * 0.25, 0.075), eye_r, INK, parent=head)

    # ---- hair (lime-green strands on head, parented to body so it moves with lean)
    hair_count = 0
    import random as _r
    _r.seed(7)
    for i in range(44):
        a = _r.uniform(0, 6.283)
        r_off = _r.uniform(0.0, head_r * 0.85)
        hx = math.cos(a) * r_off
        hy = head_r * 0.55 + _r.uniform(0.02, 0.09)
        hz = math.sin(a) * r_off + 0.05
        # strand leans outward/up
        ha = _r.uniform(15, 45)
        strand = add_cone(f'hair_{i}', (hx, H * 0.22 + 0.135 + hy, hz),
                          (ha, _r.uniform(0, 360), 0),
                          (0.035, 0.035, _r.uniform(0.07, 0.14)), LIME_DARK, parent=body)
        hair_count += 1

    # ---- arms: small cones, origin at SHOULDER (top), sides of body
    arm_rad = 0.045
    arm_len = H * 0.34
    arm_y = H * 0.22 + 0.135 * 0.75  # shoulder height
    arm_l = add_cone('arm_l', (0.135 + 0.03, arm_y, 0), (-90, 0, 15),
                     (arm_rad, arm_rad, arm_len), CREAM, parent=body)
    arm_r = add_cone('arm_r', (-0.135 - 0.03, arm_y, 0), (-90, 0, -15),
                     (arm_rad, arm_rad, arm_len), CREAM, parent=body)

    # ---- legs: cones, origin at HIP (top), bottom at y~0 (feet)
    leg_rad = 0.055
    leg_len = H * 0.42
    leg_y = H * 0.22 + 0.135 * 0.3  # hip height
    leg_l = add_cone('leg_l', (0.065, leg_y, 0), (-90, 0, 8),
                     (leg_rad, leg_rad, leg_len), LIME, parent=body)
    leg_r = add_cone('leg_r', (-0.065, leg_y, 0), (-90, 0, -8),
                     (leg_rad, leg_rad, leg_len), LIME, parent=body)

    # ---- lantern: small box in left hand (held arm), pivot at top
    lantern = add_cube('lantern', (0.135 + 0.03 + 0.03, arm_y - arm_len * 0.55, 0.05),
                       (0, 0, 0), (0.05, 0.05, 0.07), LIME, parent=arm_l)

    # ---- base_tab: small disc under feet (loader may hide it)
    bpy.ops.mesh.primitive_circle_add(vertices=16, radius=0.14, location=(0, 0.01, 0),
                                      rotation=(math.radians(90), 0, 0))
    base_tab = bpy.context.active_object
    base_tab.name = 'base_tab'
    base_tab.parent = root
    mat_slot(base_tab, 'base_tab')
    set_vertex_colors(base_tab, CREAM)

    # ---- world origin check: feet should sit at y=0. Move whole root so lowest foot = 0.
    bpy.context.view_layer.update()
    lowest = 1e9
    for ob in (leg_l, leg_r):
        mw = ob.matrix_world
        for v in ob.data.vertices:
            w = mw @ v.co
            lowest = min(lowest, w.z)
    root.location.z = -lowest
    bpy.context.view_layer.update()

    # Parent everything under root explicitly (hair/eyes already parented to body/head; base_tab done above)
    for ob in (body, head, leye, reye, arm_l, arm_r, leg_l, leg_r, lantern, base_tab):
        if ob.parent != root and ob.parent != body and ob.parent != head and ob.parent != arm_l:
            ob.parent = root

    # Deselect all, select root so its hierarchy exports
    bpy.ops.object.select_all(action='DESELECT')
    root.select_set(True)
    bpy.context.view_layer.objects.active = root

    out = '/home/clawman/papertrails-laramie-original/public/models/traveller.glb'
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', export_yup=False)
    print('EXPORTED', out, '| hair strands:', hair_count, '| objects:', len(bpy.context.selected_objects))


main()
