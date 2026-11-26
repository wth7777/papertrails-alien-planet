import os
import struct
import json

# Check if 'meadow' exists (for fallback)
with open('tiles.glb', 'rb') as f:
    data = f.read()

magic = data[:4].decode('ascii')
offset = 12
chunk_len = struct.unpack('<I', data[offset:offset+4])[0]
json_data = json.loads(data[offset+8:offset+8+chunk_len])

nodes = json_data.get('nodes', [])
names = [n.get('name', '') for n in nodes]

# Check for meadow (without alien_ prefix)
meadow_nodes = [n for n in names if n.startswith('meadow')]
alien_meadow_nodes = [n for n in names if 'alien_meadow' in n]

print(f"Nodes starting with 'meadow': {len(meadow_nodes)}")
print(f"Alien meadow nodes: {len(alien_meadow_nodes)}")
print(f"\nAll meadow-like nodes: {[n for n in names if 'meadow' in n]}")