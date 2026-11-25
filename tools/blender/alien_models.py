#!/usr/bin/env blender --background --python
"""
Generate all alien tile models for the Paper Trails engine in one Blender pass.

Contract (src/assets/loader.js + src/core/models.js + papertrails-blender-asset-pipeline skill):
  - alien_tiles.glb top-level scene nodes named by model id.
  - Each model: child named 'modelid__base' (flat face in XZ plane at y=0) +
    hinged flaps as children named 'modelid__<part>' (vertical cards, bottom edge = hinge).
  - Flap hinge data injected post-export by inject_hinges.js:
    { hinge: true, foldAngle: PI/2, delay, layer }.
  - TILE_SIZE = 2; tile occupies roughly [-1,-1]..[1,1] on XZ at y=0.
  - Vertex colours drive the shared paper material (author white, paint colors).
  - Export: export_format='GLB', export_yup=False (Blender Y -> three.js Y, upright).

Models:
  alien_dwelling   - alien house (path socket S, tags: path, house, blocker)
  alien_landmark   - strange alien monolith (tags: landmark, blocker)
  alien_crystal    - low crystal formation (tags: blocker)
  alien_river      - alien water strip (path sockets E-W, tags: water)

Output: public/models/alien_tiles.glb
"""

import bpy
import math
from mathutils import Color

TILE = 2.0
HALF = TILE / 2

PURPLE = Color((0.55, 0.30, 0.85))   # alien base
TEAL = Color((0.20, 0.75, 0.85))     # alien accent
LIME = Color((0.62, 0.95, 0.25))     # alien lime
PINK = Color((0.95, 0.40, 0.70))     # alien pink
INK = Color((0.15, 0.10, 0.12))      # dark outlines


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
            j = 0.05
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


# ---- geometry helpers -------------------------------------------------------
# Flat printed base: lies in XZ plane at y=0 (ground).
def flat_base(w, d):
    return [(-w/2, 0, -d/2), (w/2, 0, -d/2), (w/2, 0, d/2), (-w/2, 0, d/2)], [(0, 1, 2), (0, 2, 3)]


# Vertical flap card: x in [-w/2,w/2], y in [0,h] (bottom edge y=0 = hinge), z=0.
def flap_card(w, h):
    return [(-w/2, 0, 0), (w/2, 0, 0), (w/2, h, 0), (-w/2, h, 0)], [(0, 1, 2), (0, 2, 3)]


# Low box: x in [-w/2,w/2], y in [0,h], z in [-d/2,d/2].
def box_xz(w, h, d):
    hw, hh, hd = w/2, h/2, d/2
    verts = [(-hw, 0, -hd), (hw, 0, -hd), (hw, 0, hd), (-hw, 0, hd),
             (-hw, h, -hd), (hw, h, -hd), (hw, h, hd), (-hw, h, hd)]
    faces = [(0, 1, 2), (0, 2, 3), (4, 5, 6), (4, 6, 7),
             (0, 1, 5), (0, 5, 4), (1, 2, 6), (1, 6, 5),
             (2, 3, 7), (2, 7, 6), (3, 0, 4), (3, 4, 7)]
    return verts, faces


def build_model(model_id, base_color, flaps):
    root = add_empty(model_id, None, (0, 0, 0))
    bverts, bfaces = flat_base(TILE, TILE)
    base = add_mesh(model_id + '__base', bverts, bfaces, base_color,
                    parent=root, location=(0, 0, 0))
    for i, f in enumerate(flaps):
        f_verts, f_faces = flap_card(f['w'], f['h'])
        flap = add_mesh(model_id + '__' + f['name'], f_verts, f_faces, f['color'],
                        parent=root, location=f.get('location', (0, 0, 0)),
                        rotation=f.get('rotation', (0, 0, 0)))
        set_hinge(flap, f['fold_angle'], f.get('delay', i / max(1, len(flaps) - 1)), f.get('layer', i))
    return root


def main():
    scene_reset()
    import random as rnd
    rnd.seed(11)

    # =========================================================================
    # alien_dwelling: alien house with path socket to the south
    # Central pod + two side pods + crest, all hinged cards rising from the base.
    # =========================================================================
    dwelling = []
    # Central tower pod
    dwelling.append({
        'name': 'pod_c', 'w': 0.9, 'h': 1.1, 'color': PURPLE,
        'fold_angle': math.pi / 2, 'delay': 0.0, 'layer': 0, 'location': (0, 0, 0),
    })
    # Left side pod
    dwelling.append({
        'name': 'pod_l', 'w': 0.6, 'h': 0.8, 'color': TEAL,
        'fold_angle': math.pi / 2, 'delay': 0.25, 'layer': 1,
        'location': (-0.65, 0, 0), 'rotation': (0, 0, 15),
    })
    # Right side pod
    dwelling.append({
        'name': 'pod_r', 'w': 0.6, 'h': 0.8, 'color': TEAL,
        'fold_angle': math.pi / 2, 'delay': 0.25, 'layer': 1,
        'location': (0.65, 0, 0), 'rotation': (0, 0, -15),
    })
    # Crest on top of central pod
    dwelling.append({
        'name': 'crest', 'w': 0.7, 'h': 0.5, 'color': LIME,
        'fold_angle': math.pi / 2, 'delay': 0.5, 'layer': 2,
        'location': (0, 1.1, 0), 'rotation': (0, 0, 0),
    })
    # Door/glow flap on front (south side)
    dwelling.append({
        'name': 'door', 'w': 0.4, 'h': 0.6, 'color': PINK,
        'fold_angle': math.pi / 2, 'delay': 0.75, 'layer': 3,
        'location': (0, 0, 0.5), 'rotation': (0, 0, 0),
    })
    build_model('alien_dwelling', PURPLE, dwelling)

    # =========================================================================
    # alien_landmark: strange alien monolith / obelisk
    # Tall central spire with crossed rings at top.
    # =========================================================================
    landmark = []
    # Central spire
    landmark.append({
        'name': 'spire', 'w': 0.25, 'h': 1.5, 'color': INK,
        'fold_angle': math.pi / 2, 'delay': 0.0, 'layer': 0, 'location': (0, 0, 0),
    })
    # Upper ring (crossed)
    landmark.append({
        'name': 'ring_a', 'w': 0.9, 'h': 0.25, 'color': LIME,
        'fold_angle': math.pi / 2, 'delay': 0.3, 'layer': 1,
        'location': (0, 1.3, 0), 'rotation': (0, 0, 0),
    })
    landmark.append({
        'name': 'ring_b', 'w': 0.9, 'h': 0.25, 'color': LIME,
        'fold_angle': math.pi / 2, 'delay': 0.3, 'layer': 1,
        'location': (0, 1.3, 0), 'rotation': (0, 0, 90),
    })
    # Base platform
    landmark.append({
        'name': 'platform', 'w': 1.1, 'h': 0.3, 'color': TEAL,
        'fold_angle': math.pi / 2, 'delay': 0.6, 'layer': 2,
        'location': (0, 0, 0),
    })
    build_model('alien_landmark', TEAL, landmark)

    # =========================================================================
    # alien_crystal: low crystal formation (blocker)
    # Box base + several crystal spikes rising at angles.
    # =========================================================================
    crystal = []
    # Base block
    crystal.append({
        'name': 'base_block', 'w': 0.9, 'h': 0.25, 'color': PURPLE,
        'fold_angle': math.pi / 2, 'delay': 0.0, 'layer': 0, 'location': (0, 0, 0),
    })
    # Crystal spikes at angles around the base
    for i in range(6):
        a = i * math.pi / 3
        x = math.cos(a) * 0.35
        z = math.sin(a) * 0.35
        crystal.append({
            'name': f'spike_{i}', 'w': 0.18, 'h': rnd.uniform(0.4, 0.8), 'color': TEAL,
            'fold_angle': math.pi / 2, 'delay': 0.2 + i * 0.05, 'layer': i + 1,
            'location': (x, 0, z), 'rotation': (0, 0, a * 180 / math.pi),
        })
    build_model('alien_crystal', PURPLE, crystal)

    # =========================================================================
    # alien_river: alien water strip (path sockets E-W)
    # Flat base (ink) + thin teal water strip lying flat.
    # =========================================================================
    river_root = add_empty('alien_river', None, (0, 0, 0))
    add_mesh('alien_river__base', *flat_base(TILE, TILE), INK,
             parent=river_root, location=(0, 0, 0))
    # Water strip: thin flat rect in XZ plane (foldAngle 0 -> stays flat)
    strip = add_mesh('alien_river__strip', *flat_base(0.5, 1.9), TEAL,
                     parent=river_root, location=(0, 0, 0))
    set_hinge(strip, 0.0, 0, 0)

    out = '/home/clawman/papertrails-laramie-original/public/models/alien_tiles.glb'
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', export_yup=False)
    print('EXPORTED', out)


main()
