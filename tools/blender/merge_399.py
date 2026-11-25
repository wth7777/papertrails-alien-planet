#!/usr/bin/env python3
"""
Merge 399 building GLBs + 10 landmark GLBs into tiles.glb using pygltflib
"""

import json
import os
import shutil
from pygltflib import GLTF2, Node


def merge_all_buildings():
    tiles_glb = '/home/clawman/papertrails-laramie-original/public/models/tiles.glb'
    building_dir = '/home/clawman/papertrails-laramie-original/public/models/buildings'
    landmark_dir = '/home/clawman/papertrails-laramie-original/public/models/landmarks'
    meta_json = '/home/clawman/papertrails-laramie-original/public/models/assets_meta.json'

    print("Loading tiles.glb...")
    tiles = GLTF2().load(tiles_glb)

    existing_node_names = set()
    if tiles.nodes:
        for node in tiles.nodes:
            if node.name:
                existing_node_names.add(node.name)

    mesh_offset = len(tiles.meshes) if tiles.meshes else 0
    node_offset = len(tiles.nodes) if tiles.nodes else 0

    with open(meta_json) as f:
        meta = json.load(f)

    if "tiles" not in meta:
        meta["tiles"] = {}

    # Clear existing animations - we will rebuild fold_ref from scratch
    # This prevents duplication if merge is run multiple times
    tiles.animations = []
    fold_ref = None

    # Merge buildings
    building_files = sorted([f for f in os.listdir(building_dir) if f.endswith('.glb')])
    print(f"Merging {len(building_files)} buildings...")

    for i, bfile in enumerate(building_files):
        if i % 50 == 0:
            print(f"  {i}/{len(building_files)}")

        glb_path = os.path.join(building_dir, bfile)
        building = GLTF2().load(glb_path)

        osm_id = bfile.replace('.glb', '')

        # Collect building nodes that don't conflict with existing names
        building_nodes = []
        if building.nodes:
            for node in building.nodes:
                if node.name in existing_node_names:
                    continue
                existing_node_names.add(node.name)
                building_nodes.append(node)

        if not building_nodes:
            continue

        # Create parent node for this building
        parent_node = Node()
        parent_node.name = osm_id
        parent_node.children = []
        parent_node.mesh = None
        parent_node.matrix = None
        parent_node.translation = None
        parent_node.rotation = None
        parent_node.scale = None

        # Calculate node indices: parent at node_offset, children at node_offset+1 onwards
        parent_index = node_offset
        child_indices = list(range(node_offset + 1, node_offset + 1 + len(building_nodes)))

        # Add parent node to tiles
        tiles.nodes.append(parent_node)

        # Add building nodes with updated mesh indices
        for j, node in enumerate(building_nodes):
            if node.mesh is not None:
                node.mesh += mesh_offset
            tiles.nodes.append(node)
            parent_node.children.append(child_indices[j])

        # Handle animations - merge fold_ref
        # Building node indices are shifted by +1 due to parent node
        anim_node_offset = node_offset + 1

        # Process ALL animations from this building
        # Each building's GLB has its own animation with local node indices (0, 1, 2...)
        # that need to be shifted to global indices
        if building.animations:
            for anim in building.animations:
                if fold_ref is None:
                    # First animation becomes the fold_ref
                    fold_ref = anim
                    fold_ref.name = "fold_ref"
                    for ch in fold_ref.channels:
                        ch.target.node += anim_node_offset
                    tiles.animations.append(fold_ref)
                else:
                    # Merge channels from this animation into fold_ref
                    for ch in anim.channels:
                        ch.target.node += anim_node_offset
                        fold_ref.channels.append(ch)

        # Update offsets
        mesh_offset += len(building.meshes) if building.meshes else 0
        node_offset += 1 + len(building_nodes)

        # Update meta
        if osm_id not in meta.get("tiles", {}):
            mesh_count = len(building.meshes) if building.meshes else 0
            hinge_count = sum(1 for n in building_nodes if n.name and '_xb' in n.name)

            meta.setdefault("tiles", {})[osm_id] = {
                "name": osm_id,
                "flaps": hinge_count * 2,
                "top": hinge_count,
                "flatTop": 0.0,
                "oob": 0.0,
                "tris": mesh_count * 50,
                "maxLayer": 20,
                "height": 1.5,
                "hinges": []
            }

    # Merge landmarks
    landmark_files = sorted([f for f in os.listdir(landmark_dir) if f.endswith('.glb')])
    print(f"Merging {len(landmark_files)} landmarks...")

    for i, bfile in enumerate(landmark_files):
        print(f"  {i+1}/{len(landmark_files)}: {bfile}")

        glb_path = os.path.join(landmark_dir, bfile)
        landmark = GLTF2().load(glb_path)

        tile_id = bfile.replace('.glb', '')

        # Collect landmark nodes that don't conflict with existing names
        landmark_nodes = []
        if landmark.nodes:
            for node in landmark.nodes:
                if node.name in existing_node_names:
                    continue
                existing_node_names.add(node.name)
                landmark_nodes.append(node)

        if not landmark_nodes:
            continue

        # Create parent node for this landmark
        parent_node = Node()
        parent_node.name = tile_id
        parent_node.children = []
        parent_node.mesh = None
        parent_node.matrix = None
        parent_node.translation = None
        parent_node.rotation = None
        parent_node.scale = None

        # Calculate node indices: parent at node_offset, children at node_offset+1 onwards
        child_indices = list(range(node_offset + 1, node_offset + 1 + len(landmark_nodes)))

        # Add parent node to tiles
        tiles.nodes.append(parent_node)

        # Add landmark nodes with updated mesh indices
        for j, node in enumerate(landmark_nodes):
            if node.mesh is not None:
                node.mesh += mesh_offset
            tiles.nodes.append(node)
            parent_node.children.append(child_indices[j])

        # Handle animations - merge fold_ref
        # Landmark node indices are shifted by +1 due to parent node
        anim_node_offset = node_offset + 1

        if landmark.animations:
            for anim in landmark.animations:
                if fold_ref is None:
                    fold_ref = anim
                    fold_ref.name = "fold_ref"
                    for ch in fold_ref.channels:
                        ch.target.node += anim_node_offset
                    tiles.animations.append(fold_ref)
                else:
                    for ch in anim.channels:
                        ch.target.node += anim_node_offset
                        fold_ref.channels.append(ch)

        # Update offsets
        mesh_offset += len(landmark.meshes) if landmark.meshes else 0
        node_offset += 1 + len(landmark_nodes)

        # Update meta for landmark
        if tile_id not in meta.get("tiles", {}):
            mesh_count = len(landmark.meshes) if landmark.meshes else 0
            hinge_count = sum(1 for n in landmark_nodes if n.name and '_xb' in n.name)

            meta.setdefault("tiles", {})[tile_id] = {
                "name": tile_id,
                "flaps": hinge_count * 2,
                "top": hinge_count,
                "flatTop": 0.0,
                "oob": 0.0,
                "tris": mesh_count * 50,
                "maxLayer": 20,
                "height": 1.5,
                "hinges": []
            }

    # Backup and save
    shutil.copy2(tiles_glb, tiles_glb + ".backup3")
    tiles.save_binary(tiles_glb)
    print("Updated tiles.glb (original backed up)")

    with open(meta_json, 'w') as f:
        json.dump(meta, f, indent=4)
    print(f"Updated {meta_json}")


if __name__ == "__main__":
    merge_all_buildings()
