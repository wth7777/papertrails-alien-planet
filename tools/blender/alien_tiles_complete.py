#!/usr/bin/env blender --background --python
"""
Generate ALL ALIEN ASSETS for the Paper Trails engine (ALIEN PLANET).

This script creates alien versions of ALL original Paper Trails tile models:
- Ground cover: alien_meadow, alien_meadow_flowers, alien_hills
- Trees: alien_grove, alien_forest, alien_spire_forest
- Rocks: alien_rocks, alien_boulders, alien_crystals
- Water: alien_pond, alien_glowpool, alien_river
- Structures: alien_pod_dwelling, alien_ruin_arch, alien_ruin_wall
- Landmarks: alien_spire, alien_bone_spire, alien_giant_mushroom
- Vegetation: alien_bulb_patch, alien_lantern_flower, alien_frost_moss, alien_ash_cones
- Dunes: alien_glass_dunes

Output: public/models/alien_tiles.glb (all 30+ models)
"""

import bpy
import math
import random
from mathutils import Color

TILE = 2.0

# --- Alien Planet Palette ---
TEAL      = Color((0.15, 0.65, 0.72))
LIME      = Color((0.55, 0.95, 0.35))
EMERALD   = Color((0.25, 0.85, 0.55))
PINK_GLOW = Color((0.95, 0.45, 0.75))
INK       = Color((0.10, 0.08, 0.10))
YELLOW_GLOW = Color((1.0, 0.95, 0.2))     # Antenna/flower tips

LAVENDER  = Color((0.55, 0.45, 0.75))
CYAN      = Color((0.20, 0.85, 0.90))
VIOLET    = Color((0.45, 0.25, 0.70))

INDIGO    = Color((0.15, 0.20, 0.35))
TEAL_GLOW = Color((0.20, 0.70, 0.65))
DARK_TEAL = Color((0.08, 0.40, 0.38))

ASH_WHITE = Color((0.85, 0.88, 0.92))
BONE      = Color((0.75, 0.72, 0.68))
BLUE_GREY = Color((0.45, 0.52, 0.60))

GLASS_CLEAR = Color((0.60, 0.85, 0.95))
GLASS_TINT  = Color((0.30, 0.65, 0.80))

MAGENTA   = Color((0.75, 0.25, 0.60))
PLUM      = Color((0.55, 0.20, 0.50))

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

def vcol(ob, color, jitter=0.04):
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

def set_hinge(ob, fold_angle, delay, layer):
    ob['_hinge_fold_angle'] = fold_angle
    ob['_hinge_delay'] = delay
    ob['_hinge_layer'] = layer

# ---- geometry helpers ----------------------------------------------------
def flat_base(w, d):
    return [(-w/2, 0, -d/2), (w/2, 0, -d/2), (w/2, 0, d/2), (-w/2, 0, d/2)], [(0, 1, 2), (0, 2, 3)]

def flap_card(w, h):
    return [(-w/2, 0, 0), (w/2, 0, 0), (w/2, h, 0), (-w/2, h, 0)], [(0, 1, 2), (0, 2, 3)]

def box_xz(w, h, d):
    hw, hh, hd = w/2, h/2, d/2
    verts = [(-hw,0,-hd),(hw,0,-hd),(hw,0,hd),(-hw,0,hd),
             (-hw,h,-hd),(hw,h,-hd),(hw,h,hd),(-hw,h,hd)]
    faces = [(0,1,2),(0,2,3),(4,5,6),(4,6,7),
             (0,1,5),(0,5,4),(1,2,6),(1,6,5),
             (2,3,7),(2,7,6),(3,0,4),(3,4,7)]
    return verts, faces

def uv_sphere(radius, segments=16, rings=12):
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
    verts = []
    faces = []
    verts.append((0, 0, 0))
    verts.append((0, height, 0))
    for i in range(segments):
        a = (i / segments) * 2 * math.pi
        verts.append((radius * math.cos(a), 0, radius * math.sin(a)))
    for i in range(segments):
        a = (i / segments) * 2 * math.pi
        r = radius * taper
        verts.append((r * math.cos(a), height, r * math.sin(a)))
    bottom_center = 0
    top_center = 1
    bottom_ring_start = 2
    top_ring_start = 2 + segments
    for i in range(segments):
        i2 = (i + 1) % segments
        faces.append((bottom_center, bottom_ring_start + i2, bottom_ring_start + i))
    for i in range(segments):
        i2 = (i + 1) % segments
        faces.append((top_center, top_ring_start + i, top_ring_start + i2))
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

def build_model(model_id, base_color, flaps, base_size=TILE):
    root = add_empty(model_id, None, (0, 0, 0))
    bverts, bfaces = flat_base(base_size, base_size)
    add_mesh(model_id + '__base', bverts, bfaces, base_color, parent=root, location=(0, 0, 0))
    for i, f in enumerate(flaps):
        if f.get('is_box', False):
            f_verts, f_faces = box_xz(f['w'], f['h'], f.get('d', f['w']))
        else:
            f_verts, f_faces = flap_card(f['w'], f['h'])
        flap = add_mesh(
            model_id + '__' + f['name'],
            f_verts, f_faces, f['color'],
            parent=root,
            location=f.get('location', (0, 0, 0)),
            rotation=f.get('rotation', (0, 0, 0)),
        )
        set_hinge(flap, f['fold_angle'], f.get('delay', i / max(1, len(flaps))), f.get('layer', i))
    return root

def main():
    scene_reset()
    random.seed(42)

    # ========================================================================
    # HOMEGLADE (heartland) - teal moss meadows, glow spores
    # ========================================================================

    # alien_meadow: teal flat base, spiky tufts around edge
    meadow_flaps = []
    for i in range(12):
        a = random.uniform(0, 6.283185)
        rad = random.uniform(0.25, 0.9)
        x = math.cos(a) * rad
        z = math.sin(a) * rad
        meadow_flaps.append({
            'name': f'tuft_{i}',
            'w': 0.12,
            'h': random.uniform(0.3, 0.85),
            'color': EMERALD if i % 2 == 0 else LIME,
            'fold_angle': math.pi / 2,
            'delay': i / 11,
            'layer': i,
            'location': (x, 0, z),
            'rotation': (0, 0, random.uniform(0, 360)),
        })
    build_model('alien_meadow', TEAL, meadow_flaps)

    # alien_meadow_flowers: teal base with biolum flower tufts
    flower_flaps = []
    for i in range(10):
        a = random.uniform(0, 6.283185)
        rad = random.uniform(0.3, 0.85)
        x = math.cos(a) * rad
        z = math.sin(a) * rad
        flower_flaps.append({
            'name': f'flower_{i}',
            'w': 0.1,
            'h': random.uniform(0.25, 0.6),
            'color': PINK_GLOW if i % 3 == 0 else (CYAN if i % 3 == 1 else YELLOW_GLOW),
            'fold_angle': math.pi / 2,
            'delay': i / 9,
            'layer': i,
            'location': (x, 0, z),
            'rotation': (0, 0, random.uniform(0, 360)),
        })
        # Flower center glow
        flower_flaps.append({
            'name': f'flower_glow_{i}',
            'w': 0.06,
            'h': 0.05,
            'color': YELLOW_GLOW,
            'fold_angle': 0.0,
            'delay': i / 9 + 0.05,
            'layer': 10 + i,
            'location': (x, 0.55, z),
            'rotation': (90, 0, 0),
        })
    build_model('alien_meadow_flowers', TEAL, flower_flaps)

    # alien_grove: clusters of balloon-tree trunks + canopy cards
    grove_flaps = []
    for cluster in range(5):
        cx = random.uniform(-0.6, 0.6)
        cz = random.uniform(-0.6, 0.6)
        trunk_h = random.uniform(1.0, 1.4)
        grove_flaps.append({
            'name': f'trunk_{cluster}',
            'w': 0.18,
            'h': trunk_h,
            'color': INK,
            'fold_angle': math.pi / 2,
            'delay': 0.0,
            'layer': cluster * 4,
            'location': (cx, 0, cz),
            'rotation': (0, 0, 0),
        })
        for c in (0, 1):
            grove_flaps.append({
                'name': f'canopy_{cluster}_{c}',
                'w': 1.1,
                'h': 0.45,
                'color': LIME if c == 0 else EMERALD,
                'fold_angle': math.pi / 2,
                'delay': 0.3 + cluster * 0.05,
                'layer': cluster * 4 + 1 + c,
                'location': (cx, trunk_h, cz),
                'rotation': (0, 0, 35 if c == 0 else -35),
            })
    build_model('alien_grove', TEAL, grove_flaps)

    # alien_stones: crystalline boulders
    stones_flaps = []
    for i in range(8):
        stones_flaps.append({
            'name': f'stone_{i}',
            'w': random.uniform(0.5, 1.1),
            'h': random.uniform(0.3, 0.8),
            'd': random.uniform(0.5, 1.1),
            'color': TEAL_GLOW if i % 2 == 0 else DARK_TEAL,
            'fold_angle': math.pi / 2,
            'delay': i / 7,
            'layer': i,
            'location': (random.uniform(-0.7, 0.7), 0, random.uniform(-0.7, 0.7)),
            'rotation': (0, 0, random.uniform(0, 360)),
            'is_box': True,
        })
    build_model('alien_stones', TEAL, stones_flaps)

    # pod_dwelling: dome pod + door path card
    dwelling_flaps = [
        {'name': 'pod', 'w': 1.1, 'h': 0.9, 'd': 1.1, 'color': TEAL_GLOW,
         'fold_angle': math.pi / 2, 'delay': 0.0, 'layer': 0,
         'location': (0, 0, 0), 'rotation': (0, 0, 0), 'is_box': True},
        {'name': 'door', 'w': 0.6, 'h': 0.7, 'color': INK,
         'fold_angle': math.pi / 2, 'delay': 0.2, 'layer': 1,
         'location': (0, 0, -0.55), 'rotation': (0, 0, 0)},
        {'name': 'glow_rim', 'w': 1.2, 'h': 0.15, 'color': PINK_GLOW,
         'fold_angle': math.pi / 2, 'delay': 0.4, 'layer': 2,
         'location': (0, 0.9, 0), 'rotation': (90, 0, 0)},
    ]
    build_model('pod_dwelling', TEAL, dwelling_flaps)

    # glowpool: bioluminescent water pool
    pool_root = add_empty('glowpool', None, (0, 0, 0))
    bverts, bfaces = flat_base(TILE, TILE)
    add_mesh('glowpool__base', bverts, bfaces, TEAL, parent=pool_root, location=(0, 0, 0))
    pool_flaps = [
        {'name': 'water', 'w': 1.5, 'h': 1.5, 'color': CYAN,
         'fold_angle': 0.0, 'delay': 0.0, 'layer': 0,
         'location': (0, 0.01, 0), 'rotation': (90, 0, 0), 'is_box': True},
        {'name': 'glow_rim', 'w': 1.6, 'h': 0.12, 'color': PINK_GLOW,
         'fold_angle': math.pi / 2, 'delay': 0.1, 'layer': 1,
         'location': (0, 0.02, 0), 'rotation': (90, 0, 0), 'is_box': True},
    ]
    for i, f in enumerate(pool_flaps):
        if f.get('is_box', False):
            f_verts, f_faces = box_xz(f['w'], f['h'], f.get('d', f['w']))
        else:
            f_verts, f_faces = flap_card(f['w'], f['h'])
        flap = add_mesh('glowpool__' + f['name'], f_verts, f_faces, f['color'],
                        parent=pool_root,
                        location=f.get('location', (0, 0, 0)),
                        rotation=f.get('rotation', (0, 0, 0)))
        set_hinge(flap, f['fold_angle'], f.get('delay', i / max(1, len(pool_flaps))), f.get('layer', i))

    # ========================================================================
    # CRYSTAL WASTES (desert) - lavender sand, cyan crystal light
    # ========================================================================

    # crystal_field_a: low crystal carpet
    field_a_flaps = []
    for i in range(15):
        field_a_flaps.append({
            'name': f'crystal_{i}',
            'w': random.uniform(0.15, 0.35),
            'h': random.uniform(0.2, 0.6),
            'color': CYAN if i % 3 == 0 else VIOLET,
            'fold_angle': math.pi / 2,
            'delay': i / 14,
            'layer': i,
            'location': (random.uniform(-0.85, 0.85), 0, random.uniform(-0.85, 0.85)),
            'rotation': (0, 0, random.uniform(0, 360)),
        })
    build_model('crystal_field_a', LAVENDER, field_a_flaps)

    # crystal_field_b: denser variant
    field_b_flaps = []
    for i in range(20):
        field_b_flaps.append({
            'name': f'crystal_{i}',
            'w': random.uniform(0.1, 0.25),
            'h': random.uniform(0.15, 0.4),
            'color': CYAN if i % 2 == 0 else VIOLET,
            'fold_angle': math.pi / 2,
            'delay': i / 19,
            'layer': i,
            'location': (random.uniform(-0.9, 0.9), 0, random.uniform(-0.9, 0.9)),
            'rotation': (0, 0, random.uniform(0, 360)),
        })
    build_model('crystal_field_b', LAVENDER, field_b_flaps)

    # crystal_spire: tall landmark
    spire_flaps = []
    spire_h = 1.6
    for c in range(4):
        spire_flaps.append({
            'name': f'spire_{c}',
            'w': 0.7,
            'h': spire_h,
            'color': CYAN if c % 2 == 0 else VIOLET,
            'fold_angle': math.pi / 2,
            'delay': c * 0.05,
            'layer': c,
            'location': (0, 0, 0),
            'rotation': (0, 0, c * 45),
        })
    for i in range(6):
        spire_flaps.append({
            'name': f'base_crystal_{i}',
            'w': random.uniform(0.25, 0.5),
            'h': random.uniform(0.3, 0.8),
            'color': VIOLET,
            'fold_angle': math.pi / 2,
            'delay': 0.2 + i / 10,
            'layer': 4 + i,
            'location': (random.uniform(-0.5, 0.5), 0, random.uniform(-0.5, 0.5)),
            'rotation': (0, 0, random.uniform(0, 360)),
        })
    build_model('crystal_spire', LAVENDER, spire_flaps)

    # ruin_arch: ancient archway
    arch_flaps = [
        {'name': 'arch_left', 'w': 0.4, 'h': 1.5, 'color': VIOLET,
         'fold_angle': math.pi / 2, 'delay': 0.0, 'layer': 0,
         'location': (-0.7, 0, 0), 'rotation': (0, 0, 0)},
        {'name': 'arch_right', 'w': 0.4, 'h': 1.5, 'color': VIOLET,
         'fold_angle': math.pi / 2, 'delay': 0.05, 'layer': 1,
         'location': (0.7, 0, 0), 'rotation': (0, 0, 0)},
        {'name': 'arch_top', 'w': 1.4, 'h': 0.25, 'color': CYAN,
         'fold_angle': math.pi / 2, 'delay': 0.1, 'layer': 2,
         'location': (0, 1.5, 0), 'rotation': (90, 0, 0)},
        {'name': 'rubble_0', 'w': 0.5, 'h': 0.3, 'd': 0.5, 'color': VIOLET,
         'fold_angle': math.pi / 2, 'delay': 0.2, 'layer': 3,
         'location': (-0.9, 0, -0.2), 'rotation': (0, 0, 0), 'is_box': True},
        {'name': 'rubble_1', 'w': 0.4, 'h': 0.25, 'd': 0.4, 'color': VIOLET,
         'fold_angle': math.pi / 2, 'delay': 0.25, 'layer': 4,
         'location': (0.8, 0, 0.3), 'rotation': (0, 0, 0), 'is_box': True},
    ]
    build_model('ruin_arch', LAVENDER, arch_flaps)

    # ruin_wall: crumbling wall
    wall_flaps = []
    for i in range(6):
        x = -1.0 + i * 0.4
        wall_flaps.append({
            'name': f'wall_{i}',
            'w': 0.38,
            'h': random.uniform(0.6, 1.1),
            'color': VIOLET if i % 2 == 0 else CYAN,
            'fold_angle': math.pi / 2,
            'delay': i / 5,
            'layer': i,
            'location': (x, 0, 0),
            'rotation': (0, 0, 0),
        })
    wall_flaps.append({
        'name': 'capstone',
        'w': 2.0,
        'h': 0.18,
        'd': 0.45,
        'color': VIOLET,
        'fold_angle': math.pi / 2,
        'delay': 0.6,
        'layer': 6,
        'location': (0, 1.0, 0),
        'rotation': (90, 0, 0),
        'is_box': True,
    })
    build_model('ruin_wall', LAVENDER, wall_flaps)

    # glass_dunes: glass-like dunes
    dune_flaps = []
    for i in range(10):
        dune_flaps.append({
            'name': f'dune_{i}',
            'w': random.uniform(0.7, 1.4),
            'h': random.uniform(0.3, 0.8),
            'd': random.uniform(0.7, 1.4),
            'color': GLASS_CLEAR if i % 3 == 0 else GLASS_TINT,
            'fold_angle': math.pi / 2,
            'delay': i / 9,
            'layer': i,
            'location': (random.uniform(-0.8, 0.8), 0, random.uniform(-0.8, 0.8)),
            'rotation': (0, 0, random.uniform(0, 360)),
            'is_box': True,
        })
    build_model('glass_dunes', LAVENDER, dune_flaps)

    # ========================================================================
    # SPIREWOOD (pinewood) - deep indigo-teal, dark spires, glow accents
    # ========================================================================

    # spire_forest_a
    forest_a_flaps = []
    for cluster in range(6):
        cx = random.uniform(-0.7, 0.7)
        cz = random.uniform(-0.7, 0.7)
        trunk_h = random.uniform(1.2, 1.7)
        forest_a_flaps.append({
            'name': f'trunk_{cluster}',
            'w': 0.22,
            'h': trunk_h,
            'color': DARK_TEAL,
            'fold_angle': math.pi / 2,
            'delay': 0.0,
            'layer': cluster * 4,
            'location': (cx, 0, cz),
            'rotation': (0, 0, 0),
        })
        for c in range(3):
            forest_a_flaps.append({
                'name': f'canopy_{cluster}_{c}',
                'w': 0.95,
                'h': 0.4,
                'color': TEAL_GLOW if c % 2 == 0 else DARK_TEAL,
                'fold_angle': math.pi / 2,
                'delay': 0.25 + cluster * 0.04,
                'layer': cluster * 4 + 1 + c,
                'location': (cx, trunk_h, cz),
                'rotation': (0, 0, c * 45),
            })
    build_model('spire_forest_a', INDIGO, forest_a_flaps)

    # spire_forest_b: taller, fewer trunks
    forest_b_flaps = []
    for cluster in range(4):
        cx = random.uniform(-0.5, 0.5)
        cz = random.uniform(-0.5, 0.5)
        trunk_h = random.uniform(1.5, 1.9)
        forest_b_flaps.append({
            'name': f'trunk_{cluster}',
            'w': 0.28,
            'h': trunk_h,
            'color': DARK_TEAL,
            'fold_angle': math.pi / 2,
            'delay': 0.0,
            'layer': cluster * 5,
            'location': (cx, 0, cz),
            'rotation': (0, 0, 0),
        })
        for c in range(4):
            forest_b_flaps.append({
                'name': f'canopy_{cluster}_{c}',
                'w': 1.25,
                'h': 0.35,
                'color': TEAL_GLOW if c % 2 == 0 else DARK_TEAL,
                'fold_angle': math.pi / 2,
                'delay': 0.3 + cluster * 0.05,
                'layer': cluster * 5 + 1 + c,
                'location': (cx, trunk_h, cz),
                'rotation': (0, 0, c * 30),
            })
    build_model('spire_forest_b', INDIGO, forest_b_flaps)

    # giant_mushroom
    mush_flaps = [
        {'name': 'stem', 'w': 0.5, 'h': 1.8, 'color': DARK_TEAL,
         'fold_angle': math.pi / 2, 'delay': 0.0, 'layer': 0,
         'location': (0, 0, 0), 'rotation': (0, 0, 0)},
        {'name': 'cap', 'w': 1.9, 'h': 0.55, 'color': TEAL_GLOW,
         'fold_angle': math.pi / 2, 'delay': 0.1, 'layer': 1,
         'location': (0, 1.8, 0), 'rotation': (90, 0, 0), 'is_box': True},
        {'name': 'gills_0', 'w': 1.7, 'h': 0.12, 'color': PINK_GLOW,
         'fold_angle': math.pi / 2, 'delay': 0.2, 'layer': 2,
         'location': (0, 1.75, 0), 'rotation': (90, 0, 0), 'is_box': True},
        {'name': 'gills_1', 'w': 1.55, 'h': 0.1, 'color': PINK_GLOW,
         'fold_angle': math.pi / 2, 'delay': 0.25, 'layer': 3,
         'location': (0, 1.65, 0), 'rotation': (90, 0, 0), 'is_box': True},
        {'name': 'gills_2', 'w': 1.4, 'h': 0.1, 'color': PINK_GLOW,
         'fold_angle': math.pi / 2, 'delay': 0.3, 'layer': 4,
         'location': (0, 1.55, 0), 'rotation': (90, 0, 0), 'is_box': True},
        {'name': 'spores_0', 'w': 0.3, 'h': 0.4, 'color': PINK_GLOW,
         'fold_angle': math.pi / 2, 'delay': 0.4, 'layer': 5,
         'location': (random.uniform(-0.6, 0.6), 1.9, random.uniform(-0.6, 0.6)),
         'rotation': (0, 0, random.uniform(0, 360))},
        {'name': 'spores_1', 'w': 0.25, 'h': 0.35, 'color': PINK_GLOW,
         'fold_angle': math.pi / 2, 'delay': 0.45, 'layer': 6,
         'location': (random.uniform(-0.6, 0.6), 1.9, random.uniform(-0.6, 0.6)),
         'rotation': (0, 0, random.uniform(0, 360))},
    ]
    build_model('giant_mushroom', INDIGO, mush_flaps)

    # fallen_spire
    fallen_flaps = [
        {'name': 'trunk', 'w': 0.35, 'h': 2.2, 'color': DARK_TEAL,
         'fold_angle': math.pi / 2, 'delay': 0.0, 'layer': 0,
         'location': (0, 0, 0), 'rotation': (-90, 0, 0)},
        {'name': 'debris_0', 'w': 0.45, 'h': 0.35, 'd': 0.45, 'color': DARK_TEAL,
         'fold_angle': math.pi / 2, 'delay': 0.1, 'layer': 1,
         'location': (-0.6, 0, 0.3), 'rotation': (0, 0, 0), 'is_box': True},
        {'name': 'debris_1', 'w': 0.4, 'h': 0.3, 'd': 0.4, 'color': DARK_TEAL,
         'fold_angle': math.pi / 2, 'delay': 0.15, 'layer': 2,
         'location': (0.5, 0, -0.4), 'rotation': (0, 0, 0), 'is_box': True},
        {'name': 'crystal_shard_0', 'w': 0.22, 'h': 0.7, 'color': CYAN,
         'fold_angle': math.pi / 2, 'delay': 0.3, 'layer': 3,
         'location': (-0.7, 0, 0), 'rotation': (0, 0, 45)},
        {'name': 'crystal_shard_1', 'w': 0.2, 'h': 0.6, 'color': CYAN,
         'fold_angle': math.pi / 2, 'delay': 0.35, 'layer': 4,
         'location': (0.6, 0, 0), 'rotation': (0, 0, -30)},
    ]
    build_model('fallen_spire', INDIGO, fallen_flaps)

    # ========================================================================
    # BLOOMVELD (blossom) - bioluminescent bulb meadows
    # ========================================================================

    # bulb_patch
    bulb_flaps = []
    for i in range(18):
        bulb_flaps.append({
            'name': f'bulb_{i}',
            'w': random.uniform(0.1, 0.22),
            'h': random.uniform(0.2, 0.55),
            'color': MAGENTA if i % 2 == 0 else PLUM,
            'fold_angle': math.pi / 2,
            'delay': i / 17,
            'layer': i,
            'location': (random.uniform(-0.9, 0.9), 0, random.uniform(-0.9, 0.9)),
            'rotation': (0, 0, random.uniform(0, 360)),
        })
    for i in range(5):
        bulb_flaps.append({
            'name': f'bloom_{i}',
            'w': random.uniform(0.18, 0.3),
            'h': random.uniform(0.7, 1.0),
            'color': PINK_GLOW,
            'fold_angle': math.pi / 2,
            'delay': 0.6 + i / 10,
            'layer': 18 + i,
            'location': (random.uniform(-0.7, 0.7), 0, random.uniform(-0.7, 0.7)),
            'rotation': (0, 0, random.uniform(0, 360)),
        })
    build_model('bulb_patch', MAGENTA, bulb_flaps)

    # lantern_flower
    lantern_flaps = []
    for i in range(5):
        x = random.uniform(-0.6, 0.6)
        z = random.uniform(-0.6, 0.6)
        h = random.uniform(1.0, 1.4)
        lantern_flaps.append({
            'name': f'stem_{i}',
            'w': 0.1,
            'h': h,
            'color': INK,
            'fold_angle': math.pi / 2,
            'delay': i / 4,
            'layer': i * 3,
            'location': (x, 0, z),
            'rotation': (0, 0, 0),
        })
        lantern_flaps.append({
            'name': f'lantern_{i}',
            'w': 0.55,
            'h': 0.45,
            'd': 0.55,
            'color': PINK_GLOW,
            'fold_angle': math.pi / 2,
            'delay': 0.2 + i / 5,
            'layer': i * 3 + 1,
            'location': (x, h, z),
            'rotation': (0, 0, 0),
            'is_box': True,
        })
        lantern_flaps.append({
            'name': f'glow_{i}',
            'w': 0.65,
            'h': 0.08,
            'color': MAGENTA,
            'fold_angle': math.pi / 2,
            'delay': 0.25 + i / 5,
            'layer': i * 3 + 2,
            'location': (x, h + 0.4, z),
            'rotation': (90, 0, 0),
            'is_box': True,
        })
    build_model('lantern_flower', MAGENTA, lantern_flaps)

    # ========================================================================
    # ASHVEIL (snow) - pale ash fall, bone spires
    # ========================================================================

    # bone_spire
    bone_flaps = [
        {'name': 'spire_0', 'w': 0.5, 'h': 1.9, 'color': BONE,
         'fold_angle': math.pi / 2, 'delay': 0.0, 'layer': 0,
         'location': (0, 0, 0), 'rotation': (0, 0, 0)},
        {'name': 'spire_1', 'w': 0.5, 'h': 1.9, 'color': BLUE_GREY,
         'fold_angle': math.pi / 2, 'delay': 0.05, 'layer': 1,
         'location': (0, 0, 0), 'rotation': (0, 0, 60)},
        {'name': 'spire_2', 'w': 0.5, 'h': 1.9, 'color': BONE,
         'fold_angle': math.pi / 2, 'delay': 0.1, 'layer': 2,
         'location': (0, 0, 0), 'rotation': (0, 0, 120)},
        {'name': 'rib_0', 'w': 1.0, 'h': 0.15, 'color': ASH_WHITE,
         'fold_angle': math.pi / 2, 'delay': 0.2, 'layer': 3,
         'location': (0, 0.45, 0), 'rotation': (90, 0, 0)},
        {'name': 'rib_1', 'w': 0.95, 'h': 0.12, 'color': ASH_WHITE,
         'fold_angle': math.pi / 2, 'delay': 0.25, 'layer': 4,
         'location': (0, 0.9, 0), 'rotation': (90, 0, 0)},
        {'name': 'rib_2', 'w': 0.9, 'h': 0.12, 'color': ASH_WHITE,
         'fold_angle': math.pi / 2, 'delay': 0.3, 'layer': 5,
         'location': (0, 1.35, 0), 'rotation': (90, 0, 0)},
        {'name': 'crown', 'w': 0.8, 'h': 0.25, 'color': BLUE_GREY,
         'fold_angle': math.pi / 2, 'delay': 0.4, 'layer': 6,
         'location': (0, 1.9, 0), 'rotation': (90, 0, 0), 'is_box': True},
    ]
    build_model('bone_spire', ASH_WHITE, bone_flaps)

    # ash_cones
    cone_flaps = []
    for i in range(8):
        cone_flaps.append({
            'name': f'cone_{i}',
            'w': random.uniform(0.5, 1.0),
            'h': random.uniform(0.4, 0.9),
            'd': random.uniform(0.5, 1.0),
            'color': ASH_WHITE if i % 2 == 0 else BLUE_GREY,
            'fold_angle': math.pi / 2,
            'delay': i / 7,
            'layer': i,
            'location': (random.uniform(-0.8, 0.8), 0, random.uniform(-0.8, 0.8)),
            'rotation': (0, 0, random.uniform(0, 360)),
            'is_box': True,
        })
    build_model('ash_cones', ASH_WHITE, cone_flaps)

    # frost_moss
    moss_flaps = []
    for i in range(15):
        moss_flaps.append({
            'name': f'patch_{i}',
            'w': random.uniform(0.15, 0.4),
            'h': random.uniform(0.06, 0.18),
            'color': ASH_WHITE if i % 3 == 0 else BLUE_GREY,
            'fold_angle': math.pi / 2,
            'delay': i / 14,
            'layer': i,
            'location': (random.uniform(-0.9, 0.9), 0, random.uniform(-0.9, 0.9)),
            'rotation': (0, 0, random.uniform(0, 360)),
        })
    build_model('frost_moss', ASH_WHITE, moss_flaps)

    # ========================================================================
    # ALIEN RIVER (universal path socket)
    # ========================================================================
    river_flaps = [
        {'name': 'water', 'w': 1.8, 'h': 0.02, 'color': CYAN,
         'fold_angle': 0.0, 'delay': 0.0, 'layer': 0,
         'location': (0, 0.01, 0), 'rotation': (90, 0, 0), 'is_box': True},
        {'name': 'bank_l', 'w': 0.3, 'h': 0.25, 'd': 1.9, 'color': VIOLET,
         'fold_angle': math.pi / 2, 'delay': 0.1, 'layer': 1,
         'location': (-0.9, 0.12, 0), 'rotation': (0, 0, 0), 'is_box': True},
        {'name': 'bank_r', 'w': 0.3, 'h': 0.25, 'd': 1.9, 'color': VIOLET,
         'fold_angle': math.pi / 2, 'delay': 0.1, 'layer': 2,
         'location': (0.9, 0.12, 0), 'rotation': (0, 0, 0), 'is_box': True},
        {'name': 'glow_l', 'w': 1.9, 'h': 0.05, 'color': PINK_GLOW,
         'fold_angle': math.pi / 2, 'delay': 0.2, 'layer': 3,
         'location': (-0.9, 0.02, 0), 'rotation': (90, 0, 0), 'is_box': True},
        {'name': 'glow_r', 'w': 1.9, 'h': 0.05, 'color': PINK_GLOW,
         'fold_angle': math.pi / 2, 'delay': 0.2, 'layer': 4,
         'location': (0.9, 0.02, 0), 'rotation': (90, 0, 0), 'is_box': True},
    ]
    build_model('alien_river', LAVENDER, river_flaps)

    # ---- export ----
    out = '/home/clawman/papertrails-laramie-original/public/models/alien_tiles.glb'
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', export_yup=False)
    print('EXPORTED', out)

if __name__ == '__main__':
    main()