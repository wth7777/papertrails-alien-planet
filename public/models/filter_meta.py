import json
import os

# Get the path of the current script's directory
script_dir = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(script_dir, 'assets_meta.json'), 'r') as f:
    data = json.load(f)

# Filter out OSM IDs (numeric keys) from tiles
if 'tiles' in data:
    original_count = len(data['tiles'])
    filtered_tiles = {k: v for k, v in data['tiles'].items() if not (k.isdigit() or k.startswith('10') or k.startswith('11') or k.startswith('12'))}
    data['tiles'] = filtered_tiles
    
# Save alien version
with open(os.path.join(script_dir, 'assets_meta_alien.json'), 'w') as f:
    json.dump(data, f, indent=2)

print(f"Filtered tiles from {original_count} to {len(filtered_tiles)}")