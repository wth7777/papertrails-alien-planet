// Railway geometry layer — canonical storage of original GIS LineString features.
// Additive module: no imports from WFC, constraints, tiles, or rendering.
// Preserves original feature IDs, segment indices, and UTM coordinates.

import { clipSegmentToCell, POSITIVE_LENGTH_THRESHOLD } from './railwayClipper.js';

// Reference point (UTM Zone 13N, EPSG:32613) — matches src/geo/constraints.js GEO
const REF_UTM_E = 450112;
const REF_UTM_N = 4573356;
const METERS_PER_TILE = 4; // 4 geographic meters = 1 cell
const WFC_ORIGIN_LOCAL = [3, 4]; // matches src/geo/constraints.js

// ---------------------------------------------------------------------------
// Data structures
// ---------------------------------------------------------------------------

/**
 * A clipped segment within a single cell. Contains only the portion of the
 * original segment that lies inside this cell's 4m bounds.
 */
export class ClippedSegment {
  constructor({
    featureId,
    segmentIdx,
    entryE,
    entryN,
    exitE,
    exitN,
    lengthInsideCell,
    entrySides,
    exitSides,
  }) {
    this.featureId = featureId;
    this.segmentIdx = segmentIdx;
    this.entryE = entryE;
    this.entryN = entryN;
    this.exitE = exitE;
    this.exitN = exitN;
    this.lengthInsideCell = lengthInsideCell;
    this.entrySides = entrySides; // string[] e.g. ['S']
    this.exitSides = exitSides;   // string[] e.g. ['N']
  }
}

/**
 * One feature's contribution to a single cell. A cell may contain multiple
 * FeatureSegment entries (one per feature), and tracks are never joined.
 */
export class FeatureSegment {
  constructor({ featureId, segmentIdx, type, corner, dirs, clipped }) {
    this.featureId = featureId;
    this.segmentIdx = segmentIdx;
    this.type = type; // 'straight_NS' | 'straight_EW' | 'corner'
    this.corner = corner; // 'NE' | 'NW' | 'SE' | 'SW' | null
    this.dirs = dirs; // string[] e.g. ['E', 'S']
    this.clipped = clipped; // ClippedSegment
  }
}

/**
 * All railway features present in one 4m cell.
 */
export class CellRailwayEntry {
  constructor({ cellKey, cx, cz, features }) {
    this.cellKey = cellKey; // e.g. "-33,-69"
    this.cx = cx;
    this.cz = cz;
    this.features = features; // FeatureSegment[]
  }
}

/**
 * One original GIS LineString feature, stored with complete geometry.
 * Coordinates are original UTM values — never grid-snapped or simplified.
 */
export class RailwayFeature {
  constructor({ featureId, service, geometry, segmentCount, boundingBox }) {
    this.featureId = featureId; // original OSM ID (number or string)
    this.service = service; // original service classification
    this.geometry = geometry; // [[e, n], [e, n], ...] original UTM coordinates
    this.segmentCount = segmentCount; // number of segments (coords.length - 1)
    this.boundingBox = boundingBox; // { minE, minN, maxE, maxN }
  }
}

/**
 * Top-level railway layer state. Canonical storage + derived indexes.
 */
export class RailwayLayer {
  constructor() {
    this.features = new Map(); // featureId -> RailwayFeature
    this.cellIndex = new Map(); // cellKey -> CellRailwayEntry
    this.chunkIndex = new Map(); // "cx,cz" -> { cellKeys: string[], entries: Map<string, CellRailwayEntry> }
    this.buildErrors = []; // { featureId, segmentIdx, message }
    this.isBuilt = false;
  }
}

// ---------------------------------------------------------------------------
// Coordinate helpers (pure, match src/geo/constraints.js GEO)
// ---------------------------------------------------------------------------

export function utmToCell(utmE, utmN) {
  const cx = Math.round((utmE - REF_UTM_E) / METERS_PER_TILE);
  const cz = Math.round((utmN - REF_UTM_N) / METERS_PER_TILE);
  return { cx, cz };
}

export function cellKey(cx, cz) {
  return `${cx},${cz}`;
}

export function cellRect(cx, cz) {
  const minE = REF_UTM_E + cx * METERS_PER_TILE - METERS_PER_TILE / 2;
  const maxE = REF_UTM_E + cx * METERS_PER_TILE + METERS_PER_TILE / 2;
  const minN = REF_UTM_N + cz * METERS_PER_TILE - METERS_PER_TILE / 2;
  const maxN = REF_UTM_N + cz * METERS_PER_TILE + METERS_PER_TILE / 2;
  return { minE, maxE, minN, maxN };
}

export function cellToChunk(cx, cz) {
  const chunkX = (cx + WFC_ORIGIN_LOCAL[0]) >> 3;
  const chunkZ = (cz + WFC_ORIGIN_LOCAL[1]) >> 3;
  return { chunkX, chunkZ };
}

export function chunkKey(cx, cz) {
  const { chunkX, chunkZ } = cellToChunk(cx, cz);
  return `${chunkX},${chunkZ}`;
}

// ---------------------------------------------------------------------------
// Direction classification (matches Stage A audit)
// ---------------------------------------------------------------------------

function dirType(dirs) {
  const d = new Set(dirs);
  if (d.has('N') && d.has('S') && d.size === 2) return 'straight_NS';
  if (d.has('E') && d.has('W') && d.size === 2) return 'straight_EW';
  if (d.size === 1) return `straight_${[...d][0]}`;
  return 'corner';
}

function cornerType(dirs) {
  const d = new Set(dirs);
  if (d.has('N') && d.has('E') && d.size === 2) return 'NE';
  if (d.has('N') && d.has('W') && d.size === 2) return 'NW';
  if (d.has('S') && d.has('E') && d.size === 2) return 'SE';
  if (d.has('S') && d.has('W') && d.size === 2) return 'SW';
  return null;
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

/**
 * Build the railway layer from a GeoJSON FeatureCollection of LineString features.
 * Validates input, reports errors, never silently discards geometry.
 *
 * @param {Object} geojson - GeoJSON FeatureCollection
 * @returns {RailwayLayer}
 */
export function buildFromGeoJSON(geojson) {
  const layer = new RailwayLayer();

  if (!geojson || geojson.type !== 'FeatureCollection') {
    layer.buildErrors.push({
      featureId: null,
      segmentIdx: null,
      message: 'Input is not a GeoJSON FeatureCollection',
    });
    return layer;
  }

  const features = geojson.features || [];
  if (!Array.isArray(features)) {
    layer.buildErrors.push({
      featureId: null,
      segmentIdx: null,
      message: 'features is not an array',
    });
    return layer;
  }

  // First pass: create RailwayFeature objects from all valid LineString features
  for (const feat of features) {
    try {
      if (!feat || feat.type !== 'Feature') {
        layer.buildErrors.push({
          featureId: null,
          segmentIdx: null,
          message: 'Feature is not a valid GeoJSON Feature',
        });
        continue;
      }

      const geom = feat.geometry;
      if (!geom || geom.type !== 'LineString') {
        layer.buildErrors.push({
          featureId: feat.properties?.osm_id ?? null,
          segmentIdx: null,
          message: `Geometry is not LineString (got ${geom?.type ?? 'none'})`,
        });
        continue;
      }

      const coords = geom.coordinates;
      if (!Array.isArray(coords) || coords.length < 2) {
        layer.buildErrors.push({
          featureId: feat.properties?.osm_id ?? null,
          segmentIdx: null,
          message: `LineString has ${coords ? coords.length : 0} coordinates (need >= 2)`,
        });
        continue;
      }

      // Validate all coordinates are finite numbers
      let validCoords = true;
      for (const c of coords) {
        if (!Array.isArray(c) || c.length < 2 || !Number.isFinite(c[0]) || !Number.isFinite(c[1])) {
          validCoords = false;
          break;
        }
      }
      if (!validCoords) {
        layer.buildErrors.push({
          featureId: feat.properties?.osm_id ?? null,
          segmentIdx: null,
          message: 'LineString contains invalid coordinates',
        });
        continue;
      }

      const featureId = feat.properties?.osm_id ?? null;
      const service = feat.properties?.service ?? null;

      // Compute bounding box
      let minE = Infinity, minN = Infinity, maxE = -Infinity, maxN = -Infinity;
      for (const [e, n] of coords) {
        if (e < minE) minE = e;
        if (n < minN) minN = n;
        if (e > maxE) maxE = e;
        if (n > maxN) maxN = n;
      }

      const railwayFeature = new RailwayFeature({
        featureId,
        service,
        geometry: coords.map(([e, n]) => [e, n]), // deep copy
        segmentCount: coords.length - 1,
        boundingBox: { minE, minN, maxE, maxN },
      });

      layer.features.set(featureId, railwayFeature);
    } catch (err) {
      layer.buildErrors.push({
        featureId: feat.properties?.osm_id ?? null,
        segmentIdx: null,
        message: `Unexpected error: ${err.message}`,
      });
    }
  }

  // Second pass: build cell index from all valid features
  buildCellIndex(layer);

  layer.isBuilt = true;
  return layer;
}

/**
 * Build cell-to-feature index from all features in the layer.
 * For each feature segment, clip to every cell it traverses and record
 * a FeatureSegment entry per cell per feature.
 */
function buildCellIndex(layer) {
  const cellEntries = new Map(); // cellKey -> FeatureSegment[]
  const chunkMap = new Map(); // chunkKey -> { cellKeys: Set, entries: Map<cellKey, CellRailwayEntry> }

  for (const [featureId, feature] of layer.features) {
    const coords = feature.geometry;

    for (let segIdx = 0; segIdx < coords.length - 1; segIdx++) {
      const [x1, y1] = coords[segIdx];
      const [x2, y2] = coords[segIdx + 1];

      // Determine candidate cells by bounding box of the segment
      const minE = Math.min(x1, x2);
      const maxE = Math.max(x1, x2);
      const minN = Math.min(y1, y2);
      const maxN = Math.max(y1, y2);

      const minCellE = Math.floor((minE - REF_UTM_E - METERS_PER_TILE / 2) / METERS_PER_TILE);
      const maxCellE = Math.ceil((maxE - REF_UTM_E + METERS_PER_TILE / 2) / METERS_PER_TILE);
      const minCellN = Math.floor((minN - REF_UTM_N - METERS_PER_TILE / 2) / METERS_PER_TILE);
      const maxCellN = Math.ceil((maxN - REF_UTM_N + METERS_PER_TILE / 2) / METERS_PER_TILE);

      for (let cx = minCellE; cx <= maxCellE; cx++) {
        for (let cz = minCellN; cz <= maxCellN; cz++) {
          const rect = cellRect(cx, cz);
          const clipped = clipSegmentToCell(x1, y1, x2, y2, rect);
          if (!clipped) continue;

          const key = cellKey(cx, cz);

          // Determine direction mask from entry/exit sides
          const dirs = new Set();
          for (const s of clipped.entrySides) dirs.add(s);
          for (const s of clipped.exitSides) dirs.add(s);

          const type = dirType([...dirs]);
          const corner = cornerType([...dirs]);

          const fs = new FeatureSegment({
            featureId,
            segmentIdx: segIdx,
            type,
            corner,
            dirs: [...dirs].sort(),
            clipped,
          });

          if (!cellEntries.has(key)) {
            cellEntries.set(key, []);
          }
          cellEntries.get(key).push(fs);

          // Track chunk membership
          const ck = chunkKey(cx, cz);
          if (!chunkMap.has(ck)) {
            chunkMap.set(ck, { cellKeys: new Set(), entries: new Map() });
          }
          const chunk = chunkMap.get(ck);
          chunk.cellKeys.add(key);
          chunk.entries.set(key, null); // placeholder, filled below
        }
      }
    }
  }

  // Finalize cell entries (sort features deterministically by featureId)
  for (const [key, fsegs] of cellEntries.entries()) {
    fsegs.sort((a, b) => {
      const af = String(a.featureId);
      const bf = String(b.featureId);
      if (af < bf) return -1;
      if (af > bf) return 1;
      return a.segmentIdx - b.segmentIdx;
    });

    const [cx, cz] = key.split(',').map(Number);
    const entry = new CellRailwayEntry({ cellKey: key, cx, cz, features: fsegs });
    layer.cellIndex.set(key, entry);

    // Update chunk entries with the real CellRailwayEntry
    const ck = chunkKey(cx, cz);
    const chunk = chunkMap.get(ck);
    chunk.entries.set(key, entry);
  }

  // Convert chunk cellKeys sets to sorted arrays
  for (const [ck, chunk] of chunkMap.entries()) {
    chunk.cellKeys = [...chunk.cellKeys].sort();
    layer.chunkIndex.set(ck, chunk);
  }
}

// Export constants for consumers
export {
  METERS_PER_TILE,
  REF_UTM_E,
  REF_UTM_N,
  WFC_ORIGIN_LOCAL,
};

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/**
 * Get all railway features in a cell. Returns empty array for cells with no railway.
 */
export function getCellRailway(layer, cx, cz) {
  const entry = layer.cellIndex.get(cellKey(cx, cz));
  return entry ? entry.features : [];
}

/**
 * Check if a cell has any railway.
 */
export function hasCellRailway(layer, cx, cz) {
  return layer.cellIndex.has(cellKey(cx, cz));
}

/**
 * Get all cell keys in a chunk.
 */
export function getChunkCellKeys(layer, chunkX, chunkZ) {
  const chunk = layer.chunkIndex.get(`${chunkX},${chunkZ}`);
  return chunk ? chunk.cellKeys : [];
}

/**
 * Get all cell entries in a chunk.
 */
export function getChunkRailway(layer, chunkX, chunkZ) {
  const chunk = layer.chunkIndex.get(`${chunkX},${chunkZ}`);
  return chunk ? [...chunk.entries.values()] : [];
}

/**
 * Get a feature by ID.
 */
export function getFeature(layer, featureId) {
  return layer.features.get(featureId);
}

/**
 * Get all feature IDs.
 */
export function getAllFeatureIds(layer) {
  return [...layer.features.keys()].sort();
}
