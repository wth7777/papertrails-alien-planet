#!/usr/bin/env node
/**
 * Post-process alien_tiles.glb: inject glTF 'extras' hinge data into every
 * non-base flap node so the engine's loader treats them as hinged paper flaps.
 *
 * Contract (src/assets/loader.js adopt()):
 *   node.userData must carry { hinge: true, foldAngle, delay, layer } for each
 *   flap; three.js populates userData from glTF 'extras'. The model also needs
 *   a child named 'base'.
 *
 * We group each top-level model's children, treat any child whose name contains
 * '__' and isn't 'base' as a flap, and assign:
 *   { hinge: true, foldAngle: PI/2, delay: idx/(n-1), layer: idx }
 * matching the placeholder convention (src/assets/loader.js buildPlaceholderTile).
 * Then the GLB is rewritten (JSON chunk resized, lengths recomputed).
 */

import fs from 'fs';

const GLB_MAGIC = 0x46546C67; // 'glTF'
const JSON_CHUNK = 0x4E4F534A; // 'JSON'
const BIN_CHUNK = 0x004E4942; // 'BiN\0'

const FILE = '/home/clawman/papertrails-laramie-original/public/models/alien_tiles.glb';
const PI_HALF = Math.PI / 2;

function readChunks(buf) {
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const magic = dv.getUint32(0, true);
  const version = dv.getUint32(4, true);
  const len = dv.getUint32(8, true);
  if (magic !== GLB_MAGIC) throw new Error('not a glb: magic ' + magic.toString(16));
  let off = 12;
  const chunks = [];
  while (off < len) {
    const cl = dv.getUint32(off, true);
    const ct = dv.getUint32(off + 4, true);
    const data = buf.slice(off + 8, off + 8 + cl);
    chunks.push({ type: ct, data: Buffer.from(data) });
    off += 8 + cl;
  }
  return { version, len, chunks };
}

function writeGlb(version, chunks) {
  const parts = [];
  let total = 12;
  for (const c of chunks) {
    const cl = c.data.length;
    const h = Buffer.alloc(8);
    h.writeUInt32LE(cl, 0);
    h.writeUInt32LE(c.type, 4);
    parts.push(h, c.data);
    total += 8 + cl;
  }
  const head = Buffer.alloc(12);
  head.writeUInt32LE(GLB_MAGIC, 0);
  head.writeUInt32LE(version, 4);
  head.writeUInt32LE(total, 8);
  return Buffer.concat([head, ...parts]);
}

const { version, len, chunks } = readChunks(fs.readFileSync(FILE));
const jsonChunk = chunks.find(c => c.type === JSON_CHUNK);
const binChunk = chunks.find(c => c.type === BIN_CHUNK);
if (!jsonChunk) throw new Error('no JSON chunk');

const gltf = JSON.parse(jsonChunk.data.toString('utf8'));
const nodes = gltf.nodes || [];
const scene = gltf.scenes && gltf.scenes[gltf.scene || 0];
const topNodes = (scene && scene.nodes) || [];

let flapsTouched = 0;
for (const ti of topNodes) {
  const root = nodes[ti];
  if (!root) continue;
  const kids = (root.children || []).map(ci => nodes[ci]);
  const base = kids.find(k => k.name === root.name + '__base');
  const flaps = kids.filter(k => k.name && k.name.includes('__') && k.name !== root.name + '__base');
  flaps.sort((a, b) => a.name.localeCompare(b.name));
  for (let i = 0; i < flaps.length; i++) {
    const f = flaps[i];
    f.extras = {
      hinge: true,
      foldAngle: PI_HALF,
      delay: flaps.length > 1 ? i / (flaps.length - 1) : 0,
      layer: i,
    };
    flapsTouched++;
    console.log('hinge ->', f.name, 'delay=', f.extras.delay, 'layer=', i);
  }
  if (!base) console.log('WARNING: model', root.name, 'has no base child');
}

const newJson = Buffer.from(JSON.stringify(gltf), 'utf8');
const newChunks = [{ type: JSON_CHUNK, data: newJson }];
if (binChunk) newChunks.push(binChunk);

const out = writeGlb(version, newChunks);
fs.writeFileSync(FILE, out);
console.log('WROTE', FILE, '| flaps with hinge extras:', flapsTouched, '| new size:', out.length, '| old:', len);
