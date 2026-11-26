import os
import struct
import json

# Check current state
files = os.listdir('.')
print("GLB files:", files)

# Check tiles.glb
with open('tiles.glb', 'rb') as f:
    data = f.read()

magic = data[:4].decode('ascii')
offset = 12
chunk_len = struct.unpack('<I', data[offset:offset+4])[0]
json_data = json.loads(data[offset+8:offset+8+chunk_len])

nodes = json_data.get('nodes', [])
names = [n.get('name', '') for n in nodes]

# Check for building IDs (numeric node names)
building_nodes = [n for n in names if n and n[0].isdigit()]
alien_nodes = [n for n in names if 'alien_' in n]

print(f'\ntiles.glb total nodes: {len(names)}')
print(f'Building nodes (numeric): {len(building_nodes)}')
print(f'Alien nodes: {len(alien_nodes)}')
if building_nodes:
    print(f'Sample building nodes: {building_nodes[:5]}')
if alien_nodes:
    print(f'Sample alien nodes: {alien_nodes[:5]}')