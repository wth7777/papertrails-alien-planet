// Railway module public API.
// Additive: exports only new railway geometry storage and indexing.
// No WFC, constraints, tiles, or rendering imports.

export {
  // Classes
  RailwayFeature,
  ClippedSegment,
  FeatureSegment,
  CellRailwayEntry,
  RailwayLayer,

  // Build
  buildFromGeoJSON,

  // Queries
  getCellRailway,
  hasCellRailway,
  getChunkCellKeys,
  getChunkRailway,
  getFeature,
  getAllFeatureIds,

  // Coordinate helpers
  utmToCell,
  cellKey,
  cellRect,
  cellToChunk,
  chunkKey,

  // Constants
  METERS_PER_TILE,
  REF_UTM_E,
  REF_UTM_N,
  WFC_ORIGIN_LOCAL,

} from './railwayLayer.js';

export {
  TOL,
  POSITIVE_LENGTH_THRESHOLD,
  liangBarskyClip,
  pointSides,
  clipSegmentToCell,
} from './railwayClipper.js';
