#!/usr/bin/env blender --background --python
"""
Generate Wave 2 alien tile models for the Paper Trails engine (ALIEN PLANET).

Wave 2 models (10):
  Crystal Wastes (desert):
    ruin_arch       - ancient ruined archway landmark
    ruin_wall       - crumbling wall segments
    glass_dunes     - glass-like dune formations

  Spirewood (pinewood):
    giant_mushroom  - massive bioluminescent mushroom
    fallen_spire    - toppled spire trunk + debris

  Bloomveld (blossom):
    bulb_patch      - glowing bulb plant carpet
    lantern_flower  - tall lantern-like flowers

  Ashveil (snow):
    bone_spire      - bone-white spire landmark
    ash_cones       - volcanic ash cone clusters
    frost_moss      - pale frost-covered ground cover

Output: public/models/alien_tiles.glb (appended to existing)
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

def vcol(ob, color):
    me = ob.data
    if len(me.vertex_colors) > 0:
        vc = me.vertex_colors[0]
    else:
        vc = me.vertex_colors.new()
    random.seed(hash(ob.name) & 0xffff)
    for poly in me.polygons:
        for li in poly.loop_indices:
            c = vc.data[li].color
            j = 0.04
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
    random.seed(11)

    # ========================================================================
    # CRYSTAL WASTES (desert) - ruins, glass dunes
    # ========================================================================

    # ruin_arch: lavender base, ancient archway (landmark)
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

    # ruin_wall: lavender base, crumbling wall segments
    wall_flaps = []
    for i in range(5):
        x = -1.0 + i * 0.5
        wall_flaps.append({
            'name': f'wall_{i}',
            'w': 0.45,
            'h': random.uniform(0.6, 1.1),
            'color': VIOLET if i % 2 == 0 else CYAN,
            'fold_angle': math.pi / 2,
            'delay': i / 4,
            'layer': i,
            'location': (x, 0, 0),
            'rotation': (0, 0, 0),
        })
    # fallen capstone
    wall_flaps.append({
        'name': 'capstone',
        'w': 1.8,
        'h': 0.2,
        'd': 0.5,
        'color': VIOLET,
        'fold_angle': math.pi / 2,
        'delay': 0.6,
        'layer': 5,
        'location': (0, 1.0, 0),
        'rotation': (90, 0, 0),
        'is_box': True,
    })
    build_model('ruin_wall', LAVENDER, wall_flaps)

    # glass_dunes: lavender base, glass-like dune formations (boxes)
    dune_flaps = []
    for i in range(8):
        dune_flaps.append({
            'name': f'dune_{i}',
            'w': random.uniform(0.7, 1.3),
            'h': random.uniform(0.3, 0.7),
            'd': random.uniform(0.7, 1.3),
            'color': GLASS_CLEAR if i % 3 == 0 else GLASS_TINT,
            'fold_angle': math.pi / 2,
            'delay': i / 7,
            'layer': i,
            'location': (random.uniform(-0.8, 0.8), 0, random.uniform(-0.8, 0.8)),
            'rotation': (0, 0, random.uniform(0, 360)),
            'is_box': True,
        })
    build_model('glass_dunes', LAVENDER, dune_flaps)

    # ========================================================================
    # SPIREWOOD (pinewood) - giant mushroom, fallen spire
    # ========================================================================

    # giant_mushroom: indigo base, massive bioluminescent mushroom
    mush_flaps = [
        {'name': 'stem', 'w': 0.5, 'h': 1.6, 'color': DARK_TEAL,
         'fold_angle': math.pi / 2, 'delay': 0.0, 'layer': 0,
         'location': (0, 0, 0), 'rotation': (0, 0, 0)},
        {'name': 'cap', 'w': 1.7, 'h': 0.5, 'color': TEAL_GLOW,
         'fold_angle': math.pi / 2, 'delay': 0.1, 'layer': 1,
         'location': (0, 1.6, 0), 'rotation': (90, 0, 0), 'is_box': True},
        {'name': 'gills_0', 'w': 1.6, 'h': 0.12, 'color': PINK_GLOW,
         'fold_angle': math.pi / 2, 'delay': 0.2, 'layer': 2,
         'location': (0, 1.55, 0), 'rotation': (90, 0, 0), 'is_box': True},
        {'name': 'gills_1', 'w': 1.5, 'h': 0.1, 'color': PINK_GLOW,
         'fold_angle': math.pi / 2, 'delay': 0.25, 'layer': 3,
         'location': (0, 1.45, 0), 'rotation': (90, 0, 0), 'is_box': True},
        {'name': 'gills_2', 'w': 1.4, 'h': 0.1, 'color': PINK_GLOW,
         'fold_angle': math.pi / 2, 'delay': 0.3, 'layer': 4,
         'location': (0, 1.35, 0), 'rotation': (90, 0, 0), 'is_box': True},
        {'name': 'spores_0', 'w': 0.3, 'h': 0.4, 'color': PINK_GLOW,
         'fold_angle': math.pi / 2, 'delay': 0.4, 'layer': 5,
         'location': (random.uniform(-0.6, 0.6), 1.7, random.uniform(-0.6, 0.6)),
         'rotation': (0, 0, random.uniform(0, 360))},
        {'name': 'spores_1', 'w': 0.25, 'h': 0.35, 'color': PINK_GLOW,
         'fold_angle': math.pi / 2, 'delay': 0.45, 'layer': 6,
         'location': (random.uniform(-0.6, 0.6), 1.7, random.uniform(-0.6, 0.6)),
         'rotation': (0, 0, random.uniform(0, 360))},
        {'name': 'spores_2', 'w': 0.25, 'h': 0.35, 'color': PINK_GLOW,
         'fold_angle': math.pi / 2, 'delay': 0.5, 'layer': 7,
         'location': (random.uniform(-0.6, 0.6), 1.7, random.uniform(-0.6, 0.6)),
         'rotation': (0, 0, random.uniform(0, 360))},
    ]
    build_model('giant_mushroom', INDIGO, mush_flaps)

    # fallen_spire: indigo base, toppled spire trunk + debris
    fallen_flaps = [
        {'name': 'trunk', 'w': 0.35, 'h': 2.0, 'color': DARK_TEAL,
         'fold_angle': math.pi / 2, 'delay': 0.0, 'layer': 0,
         'location': (0, 0, 0), 'rotation': (-90, 0, 0)},  # lying on side
        {'name': 'debris_0', 'w': 0.4, 'h': 0.3, 'd': 0.4, 'color': DARK_TEAL,
         'fold_angle': math.pi / 2, 'delay': 0.1, 'layer': 1,
         'location': (-0.5, 0, 0.2), 'rotation': (0, 0, 0), 'is_box': True},
        {'name': 'debris_1', 'w': 0.35, 'h': 0.25, 'd': 0.35, 'color': DARK_TEAL,
         'fold_angle': math.pi / 2, 'delay': 0.15, 'layer': 2,
         'location': (0.4, 0, -0.3), 'rotation': (0, 0, 0), 'is_box': True},
        {'name': 'debris_2', 'w': 0.3, 'h': 0.2, 'd': 0.3, 'color': DARK_TEAL,
         'fold_angle': math.pi / 2, 'delay': 0.2, 'layer': 3,
         'location': (-0.3, 0, -0.5), 'rotation': (0, 0, 0), 'is_box': True},
        {'name': 'crystal_shard_0', 'w': 0.2, 'h': 0.6, 'color': CYAN,
         'fold_angle': math.pi / 2, 'delay': 0.3, 'layer': 4,
         'location': (-0.6, 0, 0), 'rotation': (0, 0, 45)},
        {'name': 'crystal_shard_1', 'w': 0.18, 'h': 0.5, 'color': CYAN,
         'fold_angle': math.pi / 2, 'delay': 0.35, 'layer': 5,
         'location': (0.5, 0, 0), 'rotation': (0, 0, -30)},
    ]
    build_model('fallen_spire', INDIGO, fallen_flaps)

    # ========================================================================
    # BLOOMVELD (blossom) - bulb patch, lantern flowers
    # ========================================================================

    # bulb_patch: magenta base, glowing bulb plant carpet
    bulb_flaps = []
    for i in range(15):
        bulb_flaps.append({
            'name': f'bulb_{i}',
            'w': random.uniform(0.12, 0.22),
            'h': random.uniform(0.2, 0.5),
            'color': MAGENTA if i % 2 == 0 else PLUM,
            'fold_angle': math.pi / 2,
            'delay': i / 14,
            'layer': i,
            'location': (random.uniform(-0.9, 0.9), 0, random.uniform(-0.9, 0.9)),
            'rotation': (0, 0, random.uniform(0, 360)),
        })
    # few taller blooms
    for i in range(4):
        bulb_flaps.append({
            'name': f'bloom_{i}',
            'w': random.uniform(0.18, 0.3),
            'h': random.uniform(0.6, 0.9),
            'color': PINK_GLOW,
            'fold_angle': math.pi / 2,
            'delay': 0.6 + i / 10,
            'layer': 15 + i,
            'location': (random.uniform(-0.7, 0.7), 0, random.uniform(-0.7, 0.7)),
            'rotation': (0, 0, random.uniform(0, 360)),
        })
    build_model('bulb_patch', MAGENTA, bulb_flaps)

    # lantern_flower: magenta base, tall lantern-like flowers
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
        # lantern head (box)
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
        # glow ring
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
    # ASHVEIL (snow) - bone spire, ash cones, frost moss
    # ========================================================================

    # bone_spire: ash white base, bone-white spire landmark
    bone_flaps = [
        {'name': 'spire_0', 'w': 0.5, 'h': 1.8, 'color': BONE,
         'fold_angle': math.pi / 2, 'delay': 0.0, 'layer': 0,
         'location': (0, 0, 0), 'rotation': (0, 0, 0)},
        {'name': 'spire_1', 'w': 0.5, 'h': 1.8, 'color': BLUE_GREY,
         'fold_angle': math.pi / 2, 'delay': 0.05, 'layer': 1,
         'location': (0, 0, 0), 'rotation': (0, 0, 60)},
        {'name': 'spire_2', 'w': 0.5, 'h': 1.8, 'color': BONE,
         'fold_angle': math.pi / 2, 'delay': 0.1, 'layer': 2,
         'location': (0, 0, 0), 'rotation': (0, 0, 120)},
        {'name': 'rib_0', 'w': 0.9, 'h': 0.15, 'color': ASH_WHITE,
         'fold_angle': math.pi / 2, 'delay': 0.2, 'layer': 3,
         'location': (0, 0.4, 0), 'rotation': (90, 0, 0)},
        {'name': 'rib_1', 'w': 0.85, 'h': 0.12, 'color': ASH_WHITE,
         'fold_angle': math.pi / 2, 'delay': 0.25, 'layer': 4,
         'location': (0, 0.85, 0), 'rotation': (90, 0, 0)},
        {'name': 'rib_2', 'w': 0.8, 'h': 0.12, 'color': ASH_WHITE,
         'fold_angle': math.pi / 2, 'delay': 0.3, 'layer': 5,
         'location': (0, 1.3, 0), 'rotation': (90, 0, 0)},
        {'name': 'crown', 'w': 0.7, 'h': 0.25, 'color': BLUE_GREY,
         'fold_angle': math.pi / 2, 'delay': 0.4, 'layer': 6,
         'location': (0, 1.8, 0), 'rotation': (90, 0, 0), 'is_box': True},
    ]
    build_model('bone_spire', ASH_WHITE, bone_flaps)

    # ash_cones: ash white base, volcanic ash cone clusters
    cone_flaps = []
    for i in range(7):
        cone_flaps.append({
            'name': f'cone_{i}',
            'w': random.uniform(0.5, 0.9),
            'h': random.uniform(0.4, 0.8),
            'd': random.uniform(0.5, 0.9),
            'color': ASH_WHITE if i % 2 == 0 else BLUE_GREY,
            'fold_angle': math.pi / 2,
            'delay': i / 6,
            'layer': i,
            'location': (random.uniform(-0.8, 0.8), 0, random.uniform(-0.8, 0.8)),
            'rotation': (0, 0, random.uniform(0, 360)),
            'is_box': True,
        })
    build_model('ash_cones', ASH_WHITE, cone_flaps)

    # frost_moss: ash white base, pale frost-covered ground cover
    moss_flaps = []
    for i in range(12):
        moss_flaps.append({
            'name': f'patch_{i}',
            'w': random.uniform(0.15, 0.35),
            'h': random.uniform(0.08, 0.2),
            'color': ASH_WHITE if i % 3 == 0 else BLUE_GREY,
            'fold_angle': math.pi / 2,
            'delay': i / 11,
            'layer': i,
            'location': (random.uniform(-0.9, 0.9), 0, random.uniform(-0.9, 0.9)),
            'rotation': (0, 0, random.uniform(0, 360)),
        })
    build_model('frost_moss', ASH_WHITE, moss_flaps)

    # ---- export ----
    out = '/home/clawman/papertrails-laramie-original/public/models/alien_tiles.glb'
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', export_yup=False)
    print('EXPORTED', out)

main()