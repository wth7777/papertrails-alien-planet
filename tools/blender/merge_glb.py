#!/usr/bin/env python3
"""
Merge generated building GLBs into tiles.glb using pygltflib
"""

import json
import sys
import os
from pygltflib import GLTF2

def merge_glb():
    tiles_glb = "/home/clawman/papertrails-laramie-original/public/models/tiles.glb"
    building_types = ["house_1", "house_2", "house_3", "manor_2", "manor_3"]
    building_dir = "/home/clawman/papertrails-laramie-original/public/models"
    
    # Load main tiles.glb
    print("Loading tiles.glb...")
    tiles = GLTF2().load(tiles_glb)
    
    # Track existing node names to avoid duplicates
    existing_node_names = set()
    if tiles.nodes:
        for node in tiles.nodes:
            if node.name:
                existing_node_names.add(node.name)
    
    # Track mesh offset
    mesh_offset = len(tiles.meshes) if tiles.meshes else 0
    node_offset = len(tiles.nodes) if tiles.nodes else 0
    
    # Load existing meta
    meta_path = "/home/clawman/papertrails-laramie-original/public/models/assets_meta.json"
    with open(meta_path) as f:
        meta = json.load(f)
    
    if "tiles" not in meta:
        meta["tiles"] = {}
    
    for btype in building_types:
        glb_path = os.path.join(building_dir, f"{btype}.glb")
        if not os.path.exists(glb_path):
            print(f"WARNING: {glb_path} not found, skipping")
            continue
        
        print(f"Merging {btype}...")
        building = GLTF2().load(glb_path)
        
        # Merge meshes
        if building.meshes:
            for mesh in building.meshes:
                tiles.meshes.append(mesh)
        
        # Merge nodes
        if building.nodes:
            for node in building.nodes:
                if node.name in existing_node_names:
                    print(f"  Skipping duplicate node: {node.name}")
                    continue
                existing_node_names.add(node.name)
                
                # Fix mesh index
                if node.mesh is not None:
                    node.mesh += mesh_offset
                
                tiles.nodes.append(node)
        
        # Merge animations - append channels to existing fold_ref
        if building.animations:
            if not tiles.animations:
                tiles.animations = []
            
            # Find or create fold_ref animation
            fold_ref = None
            for anim in tiles.animations:
                if anim.name == "fold_ref":
                    fold_ref = anim
                    break
            
            if not fold_ref:
                fold_ref = building.animations[0]  # Use first as template
                # Fix node indices in channels
                for ch in fold_ref.channels:
                    ch.target.node += node_offset
                tiles.animations.append(fold_ref)
            else:
                # Merge channels from building's fold_ref
                for anim in building.animations:
                    if anim.name == "fold_ref":
                        for ch in anim.channels:
                            ch.target.node += node_offset
                            fold_ref.channels.append(ch)
        
        # Update offsets
        mesh_offset += len(building.meshes) if building.meshes else 0
        node_offset += len(building.nodes) if building.nodes else 0
        
        # Update meta - building meta already in meta.json from previous step
        print(f"  Merged {btype}: {len(building.meshes)} meshes, {len(building.nodes)} nodes")
    
    # Save merged GLB
    output_path = "/home/clawman/papertrails-laramie-original/public/models/tiles_merged.glb"
    print(f"Saving merged GLB to {output_path}...")
    tiles.save_binary(output_path)
    print("Done!")
    
    # Also save as main tiles.glb (backup original first)
    import shutil
    shutil.copy2(tiles_glb, tiles_glb + ".backup")
    tiles.save_binary(tiles_glb)
    print("Updated tiles.glb (original backed up)")

if __name__ == "__main__":
    merge_glb()