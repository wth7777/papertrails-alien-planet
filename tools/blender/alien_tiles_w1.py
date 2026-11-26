#!/usr/bin/env blender --background --python
"""
Generate Wave 1 alien tile models for the Paper Trails engine (ALIEN PLANET).

Contract (src/assets/loader.js + src/core/models.js):
  - alien_tiles.glb top-level scene nodes named by model id.
  - Each model: child named 'modelid__base' (flat printed ground face, XZ plane at y=0)
    + hinged flaps (vertical cards, bottom edge at local y=0 = hinge).
  - Flap hinge extras (injected post-export by inject_hinges.js):
    { hinge: true, foldAngle: +-PI/2, delay, layer }.
  - TILE_SIZE = 2. A tile occupies roughly [-1,-1]..[1,1].
  - Vertex colours drive the single shared paper material.

Wave 1 models (10):
  Homeglade (heartland):
    alien_meadow   - teal moss ground, lime/emerald spiky tufts around edge
    alien_grove    - teal base, clusters of balloon-tree trunks + canopy cards
    alien_stones   - teal base, crystalline boulders (box_xz blocks)
    pod_dwelling   - teal base, dome pod + door path card (path socket S)
    glowpool       - teal base, bioluminescent water pool (flat strip, foldAngle 0)

  Crystal Wastes (desert):
    crystal_field_a - lavender base, low crystal carpet cards
    crystal_field_b - lavender base, crystal carpet variant
    crystal_spire   - lavender base, tall crystal landmark (spire cards)

  Spirewood (pinewood):
    spire_forest_a  - indigo base, dark spire trunk + canopy cards
    spire_forest_b  - indigo base, spire forest variant

Output: public/models/alien_tiles.glb
"""

import bpy
import math
import random
from mathutils import Color

TILE = 2.0

# --- Alien Planet Palette ---
TEAL      = Color((0.15, 0.65, 0.72))   # Homeglade ground
LIME      = Color((0.55, 0.95, 0.35))   # Homeglade glow
EMERALD   = Color((0.25, 0.85, 0.55))   # Homeglade tufts
PINK_GLOW = Color((0.95, 0.45, 0.75))   # Bloomveld accent
INK       = Color((0.10, 0.08, 0.10))   # dark ink (trunks, paths)

LAVENDER  = Color((0.55, 0.45, 0.75))   # Crystal Wastes ground
CYAN      = Color((0.20, 0.85, 0.90))   # crystal glow
VIOLET    = Color((0.45, 0.25, 0.70))   # crystal dark

INDIGO    = Color((0.15, 0.20, 0.35))   # Spirewood ground
TEAL_GLOW = Color((0.20, 0.70, 0.65))   # spire glow
DARK_TEAL = Color((0.08, 0.40, 0.38))   # spire dark

ASH_WHITE = Color((0.85, 0.88, 0.92))   # Ashveil ground
BONE      = Color((0.75, 0.72, 0.68))   # bone spires
BLUE_GREY = Color((0.45, 0.52, 0.60))   # ash props

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
# Flat printed base: lies in XZ plane at y=0 (ground).
def flat_base(w, d):
    return [(-w/2, 0, -d/2), (w/2, 0, -d/2), (w/2, 0, d/2), (-w/2, 0, d/2)], [(0, 1, 2), (0, 2, 3)]

# Vertical flap card: x in [-w/2,w/2], y in [0,h] (bottom edge y=0 = hinge), z=0.
def flap_card(w, h):
    return [(-w/2, 0, 0), (w/2, 0, 0), (w/2, h, 0), (-w/2, h, 0)], [(0, 1, 2), (0, 2, 3)]

# Low box: x in [-w/2,w/2], y in [0,h], z in [-d/2,d/2].
def box_xz(w, h, d):
    hw, hh, hd = w/2, h/2, d/2
    verts = [(-hw,0,-hd),(hw,0,-hd),(hw,0,hd),(-hw,0,hd),
             (-hw,h,-hd),(hw,h,-hd),(hw,h,hd),(-hw,h,hd)]
    faces = [(0,1,2),(0,2,3),(4,5,6),(4,6,7),
             (0,1,5),(0,5,4),(1,2,6),(1,6,5),
             (2,3,7),(2,7,6),(3,0,4),(3,4,7)]
    return verts, faces

def build_model(model_id, base_color, flaps, base_size=TILE):
    """Build a model with flat base + vertical flaps (cards) or boxes.
    flaps: list of dicts with keys:
      name, w, h, color, fold_angle, delay, layer, location, rotation
      optional: d (for box_xz), is_box (use box_xz instead of flap_card)
    """
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
    # HOMEGLADE (heartland) - teal moss meadows, glow spores
    # ========================================================================

    # alien_meadow: teal flat base, spiky tufts around edge
    meadow_flaps = []
    for i in range(10):
        a = random.uniform(0, 6.283185)
        rad = random.uniform(0.25, 0.9)
        x = math.cos(a) * rad
        z = math.sin(a) * rad
        meadow_flaps.append({
            'name': f'tuft_{i}',
            'w': 0.14,
            'h': random.uniform(0.3, 0.8),
            'color': EMERALD if i % 2 == 0 else LIME,
            'fold_angle': math.pi / 2,
            'delay': i / 9,
            'layer': i,
            'location': (x, 0, z),
            'rotation': (0, 0, random.uniform(0, 360)),
        })
    build_model('alien_meadow', TEAL, meadow_flaps)

    # alien_grove: teal base, clusters of balloon-tree trunks + canopy cards
    grove_flaps = []
    # 3-4 tree clusters
    for cluster in range(4):
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
            'layer': cluster * 3,
            'location': (cx, 0, cz),
            'rotation': (0, 0, 0),
        })
        # two crossed canopy cards per trunk
        for c in (0, 1):
            grove_flaps.append({
                'name': f'canopy_{cluster}_{c}',
                'w': 1.1,
                'h': 0.45,
                'color': LIME if c == 0 else EMERALD,
                'fold_angle': math.pi / 2,
                'delay': 0.3 + cluster * 0.05,
                'layer': cluster * 3 + 1 + c,
                'location': (cx, trunk_h, cz),
                'rotation': (0, 0, 35 if c == 0 else -35),
            })
    build_model('alien_grove', TEAL, grove_flaps)

    # alien_stones: teal base, crystalline boulders (boxes, not cards)
    stones_flaps = []
    for i in range(6):
        stones_flaps.append({
            'name': f'stone_{i}',
            'w': random.uniform(0.5, 1.0),
            'h': random.uniform(0.3, 0.7),
            'd': random.uniform(0.5, 1.0),
            'color': TEAL_GLOW if i % 2 == 0 else DARK_TEAL,
            'fold_angle': math.pi / 2,
            'delay': i / 5,
            'layer': i,
            'location': (random.uniform(-0.7, 0.7), 0, random.uniform(-0.7, 0.7)),
            'rotation': (0, 0, random.uniform(0, 360)),
            'is_box': True,
        })
    build_model('alien_stones', TEAL, stones_flaps)

    # pod_dwelling: teal base, dome pod + door path card (path socket S)
    # dome is a box (upright), door is a vertical card on south side
    dwelling_flaps = [
        {'name': 'pod', 'w': 1.1, 'h': 0.9, 'd': 1.1, 'color': TEAL_GLOW,
         'fold_angle': math.pi / 2, 'delay': 0.0, 'layer': 0,
         'location': (0, 0, 0), 'rotation': (0, 0, 0), 'is_box': True},
        {'name': 'door', 'w': 0.6, 'h': 0.7, 'color': INK,
         'fold_angle': math.pi / 2, 'delay': 0.2, 'layer': 1,
         'location': (0, 0, -0.55), 'rotation': (0, 0, 0)},  # south side
        {'name': 'glow_rim', 'w': 1.2, 'h': 0.15, 'color': PINK_GLOW,
         'fold_angle': math.pi / 2, 'delay': 0.4, 'layer': 2,
         'location': (0, 0.9, 0), 'rotation': (90, 0, 0)},  # horizontal ring
    ]
    build_model('pod_dwelling', TEAL, dwelling_flaps)

    # glowpool: teal base, bioluminescent water pool (flat strip, foldAngle 0)
    pool_root = add_empty('glowpool', None, (0, 0, 0))
    bverts, bfaces = flat_base(TILE, TILE)
    add_mesh('glowpool__base', bverts, bfaces, TEAL, parent=pool_root, location=(0, 0, 0))
    # water surface - flat on ground
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

    # crystal_field_a: lavender base, low crystal carpet cards
    field_a_flaps = []
    for i in range(12):
        field_a_flaps.append({
            'name': f'crystal_{i}',
            'w': random.uniform(0.18, 0.35),
            'h': random.uniform(0.25, 0.6),
            'color': CYAN if i % 3 == 0 else VIOLET,
            'fold_angle': math.pi / 2,
            'delay': i / 11,
            'layer': i,
            'location': (random.uniform(-0.85, 0.85), 0, random.uniform(-0.85, 0.85)),
            'rotation': (0, 0, random.uniform(0, 360)),
        })
    build_model('crystal_field_a', LAVENDER, field_a_flaps)

    # crystal_field_b: lavender base, crystal carpet variant (denser, smaller)
    field_b_flaps = []
    for i in range(18):
        field_b_flaps.append({
            'name': f'crystal_{i}',
            'w': random.uniform(0.1, 0.25),
            'h': random.uniform(0.15, 0.4),
            'color': CYAN if i % 2 == 0 else VIOLET,
            'fold_angle': math.pi / 2,
            'delay': i / 17,
            'layer': i,
            'location': (random.uniform(-0.9, 0.9), 0, random.uniform(-0.9, 0.9)),
            'rotation': (0, 0, random.uniform(0, 360)),
        })
    build_model('crystal_field_b', LAVENDER, field_b_flaps)

    # crystal_spire: lavender base, tall crystal landmark (spire cards)
    spire_flaps = []
    # central spire (3 crossed cards)
    spire_h = 1.6
    for c in range(3):
        spire_flaps.append({
            'name': f'spire_{c}',
            'w': 0.8,
            'h': spire_h,
            'color': CYAN if c % 2 == 0 else VIOLET,
            'fold_angle': math.pi / 2,
            'delay': 0.0 + c * 0.05,
            'layer': c,
            'location': (0, 0, 0),
            'rotation': (0, 0, c * 60),
        })
    # smaller crystals around base
    for i in range(5):
        spire_flaps.append({
            'name': f'base_crystal_{i}',
            'w': random.uniform(0.25, 0.45),
            'h': random.uniform(0.3, 0.7),
            'color': VIOLET,
            'fold_angle': math.pi / 2,
            'delay': 0.2 + i / 10,
            'layer': 3 + i,
            'location': (random.uniform(-0.5, 0.5), 0, random.uniform(-0.5, 0.5)),
            'rotation': (0, 0, random.uniform(0, 360)),
        })
    build_model('crystal_spire', LAVENDER, spire_flaps)

    # ========================================================================
    # SPIREWOOD (pinewood) - deep indigo-teal, dark spires, glow accents
    # ========================================================================

    # spire_forest_a: indigo base, dark spire trunks + canopy cards
    forest_a_flaps = []
    for cluster in range(5):
        cx = random.uniform(-0.7, 0.7)
        cz = random.uniform(-0.7, 0.7)
        trunk_h = random.uniform(1.2, 1.6)
        forest_a_flaps.append({
            'name': f'trunk_{cluster}',
            'w': 0.22,
            'h': trunk_h,
            'color': DARK_TEAL,
            'fold_angle': math.pi / 2,
            'delay': 0.0,
            'layer': cluster * 3,
            'location': (cx, 0, cz),
            'rotation': (0, 0, 0),
        })
        # canopy cards (3 per trunk, slightly different angles)
        for c in range(3):
            forest_a_flaps.append({
                'name': f'canopy_{cluster}_{c}',
                'w': 0.95,
                'h': 0.4,
                'color': TEAL_GLOW if c % 2 == 0 else DARK_TEAL,
                'fold_angle': math.pi / 2,
                'delay': 0.25 + cluster * 0.04,
                'layer': cluster * 3 + 1 + c,
                'location': (cx, trunk_h, cz),
                'rotation': (0, 0, c * 45),
            })
    build_model('spire_forest_a', INDIGO, forest_a_flaps)

    # spire_forest_b: indigo base, spire forest variant (taller, fewer trunks, wider canopy)
    forest_b_flaps = []
    for cluster in range(3):
        cx = random.uniform(-0.5, 0.5)
        cz = random.uniform(-0.5, 0.5)
        trunk_h = random.uniform(1.5, 1.8)
        forest_b_flaps.append({
            'name': f'trunk_{cluster}',
            'w': 0.28,
            'h': trunk_h,
            'color': DARK_TEAL,
            'fold_angle': math.pi / 2,
            'delay': 0.0,
            'layer': cluster * 4,
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
                'layer': cluster * 4 + 1 + c,
                'location': (cx, trunk_h, cz),
                'rotation': (0, 0, c * 30),
            })
    build_model('spire_forest_b', INDIGO, forest_b_flaps)

    # ---- export ----
    out = '/home/clawman/papertrails-laramie-original/public/models/alien_tiles.glb'
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', export_yup=False)
    print('EXPORTED', out)

main()