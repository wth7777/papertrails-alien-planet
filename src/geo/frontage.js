// Laramie building frontage.
//
// The building registry stores each footprint's centroid cell, but a real downtown
// building rarely has its centroid on a street: it sits behind its frontage, and the
// frontage is the part of the footprint that actually touches the street corridor.
//
// This module computes, for every registry building:
//   - the set of cells its footprint covers (point-in-polygon at cell centres)
//   - the cell on that footprint which fronts the street ("frontage cell")
//   - the direction from the frontage cell toward the road it faces
//   - the road cell it faces, and that road's centreline + width
//
// Nothing here modifies a footprint, a street, or any source geometry: it only reads
// them. Buildings that genuinely have no street frontage are reported, not invented.
//
// The placement is also checked for WFC socket feasibility, because a building can
// only be rendered where its tile can legally connect to the street network:
//   - the building cell must not be a road, rail or crossing cell
//   - the road it faces must be able to present a PATH socket toward the building
//   - no other neighbour may demand a PATH/RIVER/CROSSING socket toward the building
// Buildings that fail this check are reported too, rather than force-placed into a
// hard-constraint contradiction.

import { GEO } from './constraints.js';
import { CONFIG } from '../core/config.js';

const OX = CONFIG.wfc.originLocal[0];
const OZ = CONFIG.wfc.originLocal[1];

// Direction tables matching the solver (wfc.js): 0=N, 1=E, 2=S, 3=W.
const DIR_DX = [0, 1, 0, -1];
const DIR_DZ = [-1, 0, 1, 0];
const DIR_BIT = [1, 2, 4, 8];
const DIR_NAME = ['N', 'E', 'S', 'W'];

const key = (x, z) => `${x},${z}`;
const chunkOf = (x, z) => [(x + OX) >> 3, (z + OZ) >> 3];

/** Point-in-polygon (ray casting) for a closed ring. */
function pointInRing(ring, x, y) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** Every cell whose centre falls inside the footprint polygon. */
export function footprintCells(ring) {
  let minE = Infinity, maxE = -Infinity, minN = Infinity, maxN = -Infinity;
  for (const [e, n] of ring) {
    if (e < minE) minE = e;
    if (e > maxE) maxE = e;
    if (n < minN) minN = n;
    if (n > maxN) maxN = n;
  }
  const c0 = GEO.utmToCell(minE, minN), c1 = GEO.utmToCell(maxE, maxN);
  const out = [];
  for (let cz = c0.cz - 1; cz <= c1.cz + 1; cz++) {
    for (let cx = c0.cx - 1; cx <= c1.cx + 1; cx++) {
      const e = GEO.REF_UTM_E + cx * GEO.METERS_PER_TILE;
      const n = GEO.REF_UTM_N + cz * GEO.METERS_PER_TILE;
      if (pointInRing(ring, e, n)) out.push({ cx, cz });
    }
  }
  return out;
}

/** Closest point on a segment, plus the distance to it. */
function closestOnSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return { x: ax, y: ay, d: Math.hypot(px - ax, py - ay) };
  let t = ((px - ax) * dx + (py - ay) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  const x = ax + t * dx, y = ay + t * dy;
  return { x, y, d: Math.hypot(px - x, py - y) };
}

/**
 * Road corridor geometry derived from the GIS street centreline layer.
 * `segments` are the raw centreline segments in UTM; `halfWidthOf` gives the
 * corridor half-width for a segment (the GIS width_m, or the highway default).
 */
export function buildRoadNetwork(streetsGeoJSON, highwayHalfWidth) {
  const segments = [];
  for (const feature of streetsGeoJSON?.features ?? []) {
    const geom = feature.geometry;
    if (!geom || geom.type !== 'LineString') continue;
    const coords = geom.coordinates;
    const halfWidth = highwayHalfWidth(feature.properties ?? {});
    for (let i = 0; i < coords.length - 1; i++) {
      const a = coords[i], b = coords[i + 1];
      if (a[0] === b[0] && a[1] === b[1]) continue;
      segments.push({ ax: a[0], ay: a[1], bx: b[0], by: b[1], halfWidth, props: feature.properties ?? {} });
    }
  }
  return segments;
}

/** Distance from a UTM point to the nearest road corridor (centreline <= halfWidth counts as 0). */
export function distanceToCorridor(segments, e, n) {
  let best = Infinity, hit = null;
  for (const seg of segments) {
    const c = closestOnSegment(e, n, seg.ax, seg.ay, seg.bx, seg.by);
    const d = Math.max(0, c.d - seg.halfWidth);
    if (d < best) { best = d; hit = { seg, point: c }; }
  }
  return { distance: best, hit };
}

/**
 * Build the placement context from the solver's own GIS layers, so the frontage
 * check sees exactly the cells the solver sees.
 *
 *   roadMask       "x,z" -> 4-bit street direction mask
 *   railMask       "x,z" -> 4-bit rail direction mask
 *   crossing       Set of "x,z" cells carrying a pedestrian crossing
 *   intersection   "x,z" -> Set of direction indices (0..3) the forced intersection
 *                  tile presents a PATH socket on
 */
export function buildPlacementContext(streetConstraints, railConstraints, crossingConstraints) {
  const roadMask = new Map();
  const intersection = new Map();

  for (const [chunkKey, streetC] of streetConstraints.entries()) {
    const [ckx, ckz] = chunkKey.split(',').map(Number);
    for (let lz = 0; lz < 8; lz++) {
      for (let lx = 0; lx < 8; lx++) {
        const idx = lz * 8 + lx;
        const m = streetC.trunkMask[idx];
        if (!m) continue;
        const gx = ckx * 8 + lx - OX;
        const gz = ckz * 8 + lz - OZ;
        roadMask.set(key(gx, gz), (roadMask.get(key(gx, gz)) || 0) | m);
      }
    }
    if (streetC.intersectionTiles) {
      for (const [idx, ix] of streetC.intersectionTiles.entries()) {
        const lx = idx % 8, lz = (idx / 8) | 0;
        const gx = ckx * 8 + lx - OX;
        const gz = ckz * 8 + lz - OZ;
        const dirs = new Set();
        for (const dn of ix.directions ?? []) {
          const di = DIR_NAME.indexOf(dn);
          if (di >= 0) dirs.add(di);
        }
        intersection.set(key(gx, gz), dirs);
      }
    }
  }

  const railMask = new Map();
  for (const [chunkKey, railC] of (railConstraints ?? new Map()).entries()) {
    const [ckx, ckz] = chunkKey.split(',').map(Number);
    for (let lz = 0; lz < 8; lz++) {
      for (let lx = 0; lx < 8; lx++) {
        const m = railC.railMask[lz * 8 + lx];
        if (!m) continue;
        const gx = ckx * 8 + lx - OX;
        const gz = ckz * 8 + lz - OZ;
        railMask.set(key(gx, gz), (railMask.get(key(gx, gz)) || 0) | m);
      }
    }
  }

  const crossing = new Set();
  for (const [chunkKey, crossC] of (crossingConstraints ?? new Map()).entries()) {
    const [ckx, ckz] = chunkKey.split(',').map(Number);
    for (let lz = 0; lz < 8; lz++) {
      for (let lx = 0; lx < 8; lx++) {
        if (!crossC.crossingMask[lz * 8 + lx]) continue;
        crossing.add(key(ckx * 8 + lx - OX, ckz * 8 + lz - OZ));
      }
    }
  }

  // The req code each cell must present on each side, mirroring the solver's own
  // construction (wfc.js: `rivMask & BIT[d] ? R : trunkMask & BIT[d] ? P : border ? G : -1`,
  // with crossing cells overriding free/grass sides to the crossing socket).
  //
  // Computed in WORLD space so it is exact for every cell, including cells in chunks
  // that carry no GIS layer at all: a side is a chunk border exactly when the
  // neighbour cell falls in a different chunk.
  const ctx_road = roadMask;
  const ctx_rail = railMask;

  const reqAt = (x, z, d) => {
    const nx = x + DIR_DX[d], nz = z + DIR_DZ[d];
    const [cx, cz] = chunkOf(x, z);
    const [ncx, ncz] = chunkOf(nx, nz);
    const border = ncx !== cx || ncz !== cz;
    const rail = ctx_rail.get(key(x, z)) || 0;
    const road = ctx_road.get(key(x, z)) || 0;
    let v;
    if (rail & DIR_BIT[d]) v = 2;        // river / rail socket
    else if (road & DIR_BIT[d]) v = 1;   // path socket (genuine GIS road)
    else if (border) v = 0;             // chunk border: grass
    else v = -1;                        // free: grass or path
    if (crossing.has(key(x, z)) && (v === -1 || v === 0)) v = 4; // crossing socket
    return v;
  };

  return { roadMask, railMask, crossing, intersection, reqAt };
}

/**
 * Can a building tile stand at (bx,bz) with its path socket facing direction `d`?
 *
 * Mirrors the solver's own rules:
 *   - the cell itself must be free of road / rail / crossing sockets
 *   - the road cell it faces must be able to answer with a PATH socket
 *   - every other neighbour must be able to answer with GRASS
 *     (a neighbour that demands PATH/RIVER/CROSSING toward the building cannot)
 */
export function placementFeasible(bx, bz, d, ctx) {
  // The building's own cell.
  if (ctx.roadMask.has(key(bx, bz))) return false;
  if (ctx.railMask.has(key(bx, bz))) return false;
  if (ctx.crossing.has(key(bx, bz))) return false;

  const [bcx, bcz] = chunkOf(bx, bz);

  // The road cell the building faces.
  const rx = bx + DIR_DX[d], rz = bz + DIR_DZ[d];
  if (!ctx.roadMask.has(key(rx, rz))) return false;
  const [rcx, rcz] = chunkOf(rx, rz);
  if (rcx !== bcx || rcz !== bcz) return false; // across a chunk border: no socket link
  if (ctx.railMask.has(key(rx, rz))) return false;
  const rDirs = ctx.intersection.get(key(rx, rz));
  if (rDirs && !rDirs.has((d + 2) & 3)) return false; // forced intersection with no arm toward us

  // Every other side: the neighbour must be able to answer GRASS.
  for (let e = 0; e < 4; e++) {
    if (e === d) continue;
    const nx = bx + DIR_DX[e], nz = bz + DIR_DZ[e];
    const [ncx, ncz] = chunkOf(nx, nz);
    if (ncx !== bcx || ncz !== bcz) continue; // chunk border: the solver forces GRASS there
    if (ctx.railMask.has(key(nx, nz))) return false;
    if (ctx.crossing.has(key(nx, nz))) return false;
    const nMask = ctx.roadMask.get(key(nx, nz));
    if (nMask && (nMask & DIR_BIT[(e + 2) & 3])) return false; // that road runs into the building
    const nDirs = ctx.intersection.get(key(nx, nz));
    if (nDirs && nDirs.has((e + 2) & 3)) return false;
  }

  return true;
}

/**
 * Pick the frontage cell for one building.
 *
 * Rules, in order:
 *  1. The frontage cell must be a cell the footprint actually covers.
 *  2. It must be orthogonally adjacent to a road cell.
 *  3. The placement must be socket-feasible (see placementFeasible).
 *  4. Among candidates, prefer the one whose road corridor is closest to the
 *     footprint, then the one closest to the footprint centroid.
 *
 * Returns a status of 'ok', 'no-frontage', 'no-compatible-frontage' or
 * 'no-footprint-cells'.
 */
export function computeFrontage(entry, ctx, roadSegments, centroidCell, optionsFor, spurArms) {
  const cells = footprintCells(entry.originalPolygon);
  if (cells.length === 0) {
    return { status: 'no-footprint-cells', cells: [], cell: null, dir: -1, roadCell: null, clearance: null, optionIndex: null, placementTile: null, placementTileIsFallback: false, connection: null };
  }

  // Which footprint cell fronts the street, and how does it connect?
  //
  // A street frontage is the building's access meeting the street. The road cell
  // next to the building does NOT need a direction bit pointing back at the building
  // — on a straight north-south street the road cell carries only N|S and the
  // building stands beside it. Requiring a back-bit would reject exactly the
  // ordinary frontage case.
  //
  // The building's own cell must NOT itself be a road cell. A road cell carries a
  // socket demand on each of its street directions (a 4-way junction demands path on
  // all four sides), and no building tile can satisfy that — forcing a building onto
  // a road cell is an immediate hard-constraint contradiction.
  const connections = classifyConnections(entry, ctx, optionsFor);
  const candidates = [];
  // Priority order: direct > spur > adjacent > nearby
  const connectionTypes = ['direct', 'spur', 'adjacent', 'nearby'];
  
  for (const type of connectionTypes) {
    const conns = connections[type] || [];
    for (const c of conns) {
      const nx = c.cell.cx + DIR_DX[c.dir], nz = c.cell.cz + DIR_DZ[c.dir];
      candidates.push({ 
        cx: c.cell.cx, 
        cz: c.cell.cz, 
        d: c.dir, 
        nx, 
        nz, 
        kind: type,
        mask: ctx.roadMask.get(key(nx, nz)) 
      });
    }
  }

  if (candidates.length === 0) {
    // No adjacent road cell at all. Measure how far the footprint is from the
    // nearest corridor so the report can distinguish "just off the street" from
    // "genuinely detached".
    let bestDist = Infinity;
    for (const { cx, cz } of cells) {
      const e = GEO.REF_UTM_E + cx * GEO.METERS_PER_TILE;
      const n = GEO.REF_UTM_N + cz * GEO.METERS_PER_TILE;
      const { distance } = distanceToCorridor(roadSegments, e, n);
      if (distance < bestDist) bestDist = distance;
    }
    return {
      status: 'no-frontage',
      cells: cells.map(c => ({ cx: c.cx, cz: c.cz })),
      cell: null,
      dir: -1,
      roadCell: null,
      clearance: Number.isFinite(bestDist) ? bestDist : null,
      optionIndex: null,
      placementTile: null,
      placementTileIsFallback: false,
      connection: null,
    };
  }

  // Keep only the socket-feasible candidates, and work out which tile ARTS can render
  // the building at each one.
  const usable = [];
  for (const cand of candidates) {
    if (!placementFeasible(cand.cx, cand.cz, cand.d, ctx)) continue;
    const chosen = choosePlacementTile(entry, cand.cx, cand.cz, cand.d, ctx, ctx.reqAt, optionsFor);
    if (!chosen) continue;
    usable.push({ ...cand, chosen });
  }
  if (usable.length === 0) {
    return {
      status: 'no-compatible-frontage',
      cells: cells.map(c => ({ cx: c.cx, cz: c.cz })),
      cell: null,
      dir: -1,
      roadCell: null,
      clearance: null,
      optionIndex: null,
      placementTile: null,
      placementTileIsFallback: false,
      connection: null,
    };
  }

  // Score: a direct connection is preferred over a spur arm; then the road corridor
  // distance at the candidate cell; then the distance to the footprint centroid; then
  // whether the registry's own tile type can be used.
  let best = null;
  for (const cand of usable) {
    const e = GEO.REF_UTM_E + cand.cx * GEO.METERS_PER_TILE;
    const n = GEO.REF_UTM_N + cand.cz * GEO.METERS_PER_TILE;
    const { distance } = distanceToCorridor(roadSegments, e, n);
    const cd = Math.max(Math.abs(cand.cx - centroidCell.cx), Math.abs(cand.cz - centroidCell.cz));
    const kindPriority = { direct: 0, spur: 1, adjacent: 2, nearby: 3 };
    const score = (kindPriority[cand.kind] || 99) * 1000000
      + (cand.chosen.fallback ? 100000 : 0)
      + distance * 1000 + cd;
    if (!best || score < best.score) best = { ...cand, score, clearance: distance };
  }
  // Record the spur arm on the chosen street cell, so the solver may give that street
  // cell a PATH arm toward the building.
  if ((best.kind === 'spur' || best.kind === 'adjacent' || best.kind === 'nearby') && spurArms) {
    const key = `${best.nx},${best.nz}`;
    if (!spurArms.has(key)) spurArms.set(key, { dir: (best.d + 2) & 3 });
  }

  return {
    status: 'ok',
    cells: cells.map(c => ({ cx: c.cx, cz: c.cz })),
    cell: { cx: best.cx, cz: best.cz },
    dir: best.d,
    roadCell: { cx: best.nx, cz: best.nz, mask: best.mask },
    clearance: best.clearance,
    optionIndex: best.chosen.option.index,
    placementTile: best.chosen.option.tileId,
    placementTileIsFallback: best.chosen.fallback,
    connection: best.kind,
  };
}

/**
 * Compute frontage for every registry entry.
 */
export function computeAllFrontages(registry, ctx, roadSegments, optionsFor, spurArms) {
  const out = [];
  for (const entry of registry) {
    const frontage = computeFrontage(entry, ctx, roadSegments, entry.centroidTile, optionsFor, spurArms);
    out.push({ entry, frontage });
  }
  return out;
}

/**
 * Can option `o` legally sit at (bx,bz) with the frontage direction `d`?
 *
 * The solver builds a cell's initial domain from two independent filters:
 *   - the cell's own req[] (what the cell must present on each side)
 *   - the neighbour's socket on the shared edge (sockets must MATCH across an edge)
 *
 * req codes: -1 = free (grass or path), 0 = grass, 1 = path, 2 = river, 4 = crossing.
 * A free side still has to end up matching the neighbour's socket, so a building's
 * GRASS side needs a neighbour that can present GRASS, and a building's PATH side
 * needs a neighbour that can present PATH.
 *
 * `reqAt(x,z,d)` returns the req code of world cell (x,z) on side d, or null when the
 * cell is outside the chunk (the solver forces GRASS on a chunk border).
 */
export function optionFitsAt(option, bx, bz, d, ctx, reqAt) {
  const sig = option.sig;
  // The building's own cell.
  const ownReq = [];
  for (let e = 0; e < 4; e++) ownReq.push(reqAt(bx, bz, e));
  for (let e = 0; e < 4; e++) {
    const r = ownReq[e];
    if (r === null) { if (sig[e] !== 0) return false; continue; } // chunk border: GRASS only
    if (r === 2 || r === 4) return false;                        // river / crossing cell
    if (r === 0 && sig[e] !== 0) return false;                   // must present GRASS
    if (r === 1 && sig[e] !== 1) return false;                   // must present PATH
  }
  // The neighbour on each side must be able to answer with the SAME socket.
  for (let e = 0; e < 4; e++) {
    const nx = bx + DIR_DX[e], nz = bz + DIR_DZ[e];
    const nReq = reqAt(nx, nz, (e + 2) & 3);
    if (nReq === null) { if (sig[e] !== 0) return false; continue; }
    if (nReq === 2 || nReq === 4) return false;
    if (nReq === 0 && sig[e] !== 0) return false;
    if (nReq === 1 && sig[e] !== 1) return false;
    if (nReq === -1 && sig[e] !== 0 && sig[e] !== 1) return false;
  }
  // The building must genuinely join the street it fronts.
  if (sig[d] !== 1) return false;
  return true;
}

/**
 * Choose which building tile ARTS render a registry building at its frontage.
 *
 * The registry's `tileType` is a size classification and is preserved untouched. But
 * `village` is a STREET tile (an N-S lane with houses on both sides): it needs a path
 * neighbour on two OPPOSITE sides, so it can only be used where the street really does
 * continue through the cell. A building that fronts a single street has to be drawn
 * with a single-path-socket tile instead.
 *
 * The registry's own type is preferred whenever it fits; otherwise the size class
 * decides between the single-path-socket building tiles.
 */
export function choosePlacementTile(entry, bx, bz, d, ctx, reqAt, optionsFor) {
  const registryType = entry.tileType;
  const candidates = [];
  const prefer = [];
  const byType = optionsFor(registryType);
  if (byType && byType.length) {
    for (const o of byType) {
      if (optionFitsAt(o, bx, bz, d, ctx, reqAt)) candidates.push({ option: o, fallback: false });
    }
  }
  if (candidates.length) return candidates[0];

  // Fall back: a single-path-socket building tile whose size class matches the
  // registry classification (small -> house, large -> manor).
  const sizeClass = entry.area < 100 ? 'house' : entry.area < 400 ? 'house' : 'manor';
  const order = sizeClass === 'house' ? ['house', 'manor'] : ['manor', 'house'];
  for (const type of order) {
    const opts = optionsFor(type);
    if (!opts) continue;
    for (const o of opts) {
      if (optionFitsAt(o, bx, bz, d, ctx, reqAt)) return { option: o, fallback: type !== registryType };
    }
  }
  return null;
}

/**
 * Can the road cell R present a PATH socket on side `od` (the side facing the
 * building) while still satisfying its own socket demands?
 *
 * Returns the list of option ids that can do it, or an empty array when none can.
 * A road cell's own req on a side is:
 *   1 = a genuine GIS road PATH socket (the street runs that way) -> always usable
 *  -1 = free (the solver may put grass or path there) -> usable as a spur arm
 *   0 = grass-locked (chunk border) -> unusable
 *   2 / 4 = river / crossing -> unusable
 */
export function roadArmOptions(R, od, ctx, options) {
  const rreq = [0, 1, 2, 3].map((s) => ctx.reqAt(R.x, R.z, s));
  if (rreq[od] !== -1 && rreq[od] !== 1) return [];
  const out = [];
  for (const o of options) {
    const sg = o.sig;
    if (sg[od] !== 1) continue;
    let ok = true;
    for (let s = 0; s < 4; s++) {
      const r = rreq[s];
      if (r === null) { if (sg[s] !== 0) { ok = false; break; } continue; }
      if (r === 2 || r === 4) { ok = false; break; }
      if (r === 0 && sg[s] !== 0) { ok = false; break; }
      if (r === 1 && sg[s] !== 1) { ok = false; break; }
    }
    if (ok) out.push(o);
  }
  return out;
}

/**
 * Classify a building's connection to the street.
 *
 *   'direct' — the road cell next to the building already presents a genuine GIS
 *               PATH socket toward it (a junction, or a street that runs that way).
 *               The building connects straight into the street network.
 *   'spur'   — the road cell next to the building is a plain street segment whose
 *               side toward the building is free. The building's access meets the
 *               street through a PATH arm on that road cell (a driveway off the
 *               street), which is what a real street frontage looks like.
 *   'adjacent' — fallback: the building is orthogonally or diagonally adjacent to
 *                 a road cell, even if socket feasibility isn't perfect.
 *   'nearby' — last resort: the building is within 2 cells of a road cell.
 *   'none'   — neither is possible: the road cell cannot present a PATH socket
 *               toward the building at all.
 *
 * `spurArms` collects the road cells that need an arm, so the solver can allow the
 * arm on exactly those cells.
 */
export function classifyConnections(entry, ctx, optionsFor) {
  const cells = footprintCells(entry.originalPolygon);
  const direct = [];
  const spur = [];
  const adjacent = [];
  const nearby = [];
  
  // Track which road cells we've already considered to avoid duplicates
  const seenRoadCells = new Set();
  
  for (const { cx, cz } of cells) {
    if (ctx.roadMask.has(`${cx},${cz}`)) continue; // the footprint overlaps the road here
    
    // Check orthogonal neighbors first (direct frontage)
    for (let d = 0; d < 4; d++) {
      const R = { x: cx + DIR_DX[d], z: cz + DIR_DZ[d] };
      const roadKey = `${R.x},${R.z}`;
      if (!ctx.roadMask.has(roadKey)) continue;
      if (seenRoadCells.has(roadKey)) continue;
      seenRoadCells.add(roadKey);
      
      const od = (d + 2) & 3;
      // A road cell in another chunk cannot share a socket with this one.
      const [rcx, rcz] = chunkOf(R.x, R.z);
      const [bcx, bcz] = chunkOf(cx, cz);
      if (rcx !== bcx || rcz !== bcz) continue;
      if (ctx.railMask.has(roadKey)) continue;
      
      const cand = { cell: { cx, cz }, dir: d, roadCell: { x: R.x, z: R.z } };
      
      if (ctx.reqAt(R.x, R.z, od) === 1) {
        // The street genuinely runs toward the building: a direct connection.
        direct.push({ ...cand, kind: 'direct' });
      } else {
        // The street's side toward the building is free: it needs a spur arm.
        const armOpts = roadArmOptions(R, od, ctx, optionsFor('__pathTiles') || []);
        if (armOpts.length) spur.push({ ...cand, kind: 'spur' });
      }
    }
    
    // Check diagonal neighbors (adjacent frontage fallback)
    for (let d = 0; d < 4; d++) {
      // Diagonal directions: NE=0, SE=1, SW=2, NW=3
      const diagDx = [1, 1, -1, -1][d];
      const diagDz = [-1, 1, 1, -1][d];
      const diagX = cx + diagDx;
      const diagZ = cz + diagDz;
      const diagKey = `${diagX},${diagZ}`;
      if (ctx.roadMask.has(diagKey) && !seenRoadCells.has(diagKey)) {
        seenRoadCells.add(diagKey);
        // For diagonal, we need to pick an orthogonal direction toward the road
        // Pick the direction that gets us closer to the diagonal road cell
        const orthoDirs = [];
        if (diagDx !== 0) orthoDirs.push(diagDx > 0 ? 1 : 3); // E or W
        if (diagDz !== 0) orthoDirs.push(diagDz > 0 ? 2 : 0); // S or N
        for (const od of orthoDirs) {
          const cand = { cell: { cx, cz }, dir: od, roadCell: { x: diagX, z: diagZ } };
          adjacent.push({ ...cand, kind: 'adjacent' });
          break; // Only need one orthogonal direction per diagonal
        }
      }
    }
    
    // Nearby: within 2 cells (last resort)
    if (direct.length === 0 && spur.length === 0 && adjacent.length === 0) {
      for (const { cx, cz } of cells) {
        for (let radius = 1; radius <= 2; radius++) {
          for (let dx = -radius; dx <= radius; dx++) {
            for (let dz = -radius; dz <= radius; dz++) {
              if (Math.abs(dx) !== radius && Math.abs(dz) !== radius) continue; // Only perimeter
              const nx = cx + dx;
              const nz = cz + dz;
              const nearbyKey = `${nx},${nz}`;
              if (ctx.roadMask.has(nearbyKey) && !seenRoadCells.has(nearbyKey)) {
                seenRoadCells.add(nearbyKey);
                // Pick direction toward the road cell
                let bestDir = 0;
                let bestDist = Infinity;
                for (let d = 0; d < 4; d++) {
                  const dist = Math.abs(dx - DIR_DX[d]) + Math.abs(dz - DIR_DZ[d]);
                  if (dist < bestDist) {
                    bestDist = dist;
                    bestDir = d;
                  }
                }
                nearby.push({ 
                  cell: { cx, cz }, 
                  dir: bestDir, 
                  roadCell: { x: nx, z: nz },
                  kind: 'nearby' 
                });
              }
            }
          }
        }
      }
    }
  }
  
  return { direct, spur, adjacent, nearby };
}

/**
 * Pick the connection for a building from all viable candidates.
 *
 * A direct connection (the street genuinely runs toward the building) is always
 * preferred over a spur arm. Within a class, the candidate whose road corridor is
 * closest to the footprint wins, then the one closest to the footprint centroid.
 *
 * The chosen spur's road cell is recorded in `spurArms` so the solver knows that
 * street cell may present a PATH arm toward the building.
 */
export function chooseConnection(entry, connections, roadSegments, centroidCell, spurArms) {
  const score = (c) => {
    const e = GEO.REF_UTM_E + c.cell.cx * GEO.METERS_PER_TILE;
    const n = GEO.REF_UTM_N + c.cell.cz * GEO.METERS_PER_TILE;
    const { distance } = distanceToCorridor(roadSegments, e, n);
    const cd = Math.max(Math.abs(c.cell.cx - centroidCell.cx), Math.abs(c.cell.cz - centroidCell.cz));
    return { distance, cd, total: distance * 1000 + cd };
  };
  const bestOf = (list) => {
    let best = null;
    for (const c of list) {
      const s = score(c);
      if (!best || s.total < best.s.total) best = { c, s };
    }
    return best;
  };
  const d = bestOf(connections.direct);
  if (d) return { ...d.c, kind: 'direct', clearance: d.s.distance };
  const sp = bestOf(connections.spur);
  if (sp) {
    const chosen = { ...sp.c, kind: 'spur', clearance: sp.s.distance };
    if (spurArms) {
      const key = `${chosen.roadCell.x},${chosen.roadCell.z}`;
      if (!spurArms.has(key)) spurArms.set(key, { dir: (chosen.dir + 2) & 3 });
    }
    return chosen;
  }
  return null;
}
