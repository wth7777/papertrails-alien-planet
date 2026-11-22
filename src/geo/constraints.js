// Geographic Constraints for Paper Trails — Laramie Adaptation
// Loads GIS exports and pre-sets WFC requirements before generation.
// Contract: Must not rearrange real geography; only decorate within fixed features.

import { CONFIG, TILE_SIZE } from '../core/config.js';
import { hash2 } from '../core/rng.js';
import { SOCKET_CODE, socketsOf, OPTIONS, getTile } from '../world/tiles.js';

// ============================================================
// COORDINATE CONVERSION: UTM Zone 13N → Paper Trails World Units
// ============================================================

/**
 * Reference pin (authoritative): 41.3101286°N, -105.5959928°W
 * UTM Zone 13N: 450112 E, 4573356 N
 * Paper Trails Origin: (0, 0)
 * 
 * Scale: 1 geographic meter = 0.5 PT world units = 0.25 tiles
 *        2 geographic meters = 1 PT world unit = 0.5 tiles
 *        4 geographic meters = 1 PT tile = 1 cell
 */
export const GEO = {
  // Reference point in UTM Zone 13N (EPSG:32613)
  REF_UTM_E: 450112,
  REF_UTM_N: 4573356,
  
  // Scale factors
  METERS_PER_TILE: 4,           // 4 geographic meters = 1 tile
  WORLD_UNITS_PER_TILE: TILE_SIZE, // 2 world units per tile
  WORLD_UNITS_PER_METER: TILE_SIZE / 4, // 0.5 world units per meter
  
  // Test area bounds (UTM)
  TEST_UTM_XMIN: 449900,
  TEST_UTM_XMAX: 450700,
  TEST_UTM_YMIN: 4573000,
  TEST_UTM_YMAX: 4574200,
  
  // Convert UTM easting/northing to Paper Trails cell coordinates
  utmToCell(utmE, utmN) {
    const cx = Math.round((utmE - this.REF_UTM_E) / this.METERS_PER_TILE);
    const cz = Math.round((utmN - this.REF_UTM_N) / this.METERS_PER_TILE);
    return { cx, cz };
  },
  
  // Convert UTM to Paper Trails world units
  utmToWorld(utmE, utmN) {
    const x = (utmE - this.REF_UTM_E) * this.WORLD_UNITS_PER_METER;
    const z = (utmN - this.REF_UTM_N) * this.WORLD_UNITS_PER_METER;
    return { x, z };
  },
  
  // Convert Paper Trails cell to UTM
  cellToUtm(cx, cz) {
    const utmE = this.REF_UTM_E + cx * this.METERS_PER_TILE;
    const utmN = this.REF_UTM_N + cz * this.METERS_PER_TILE;
    return { utmE, utmN };
  },
  
  // Check if UTM coordinate is in test area
  inTestArea(utmE, utmN) {
    return utmE >= this.TEST_UTM_XMIN && utmE <= this.TEST_UTM_XMAX &&
           utmN >= this.TEST_UTM_YMIN && utmN <= this.TEST_UTM_YMAX;
  }
};

// ============================================================
// GIS DATA STRUCTURES
// ============================================================

export const GIS_LAYERS = {
  streets: '/gis/pt_street_centerlines.geojson',
  intersections: '/gis/pt_street_intersections.geojson',
  crossings: '/gis/pt_crossings.geojson',
  sidewalks: '/gis/pt_sidewalks.geojson',
  buildings: '/gis/pt_buildings.geojson',
  landmarks: '/gis/pt_historic_landmarks.geojson',
  railways: '/gis/pt_railways.geojson',
  parks: '/gis/pt_parks.geojson',
  demSamples: '/gis/pt_dem_sample_points.geojson'
};

// ============================================================
// SOCKET TYPE EXTENSIONS FOR LARAMIE
// ============================================================

export const LARAMIE_SOCKETS = {
  rail: 'rail',
  crossing: 'crossing'
};

// ============================================================
// TILE TYPE MAPPING: GIS → Paper Trails
// ============================================================

export const BUILDING_TILE_MAP = {
  house: 'house',
  village: 'village',
  manor: 'manor',
  park: 'meadow_flowers'
};

/** Option indices for each building tile type (all rotations) */
export const BUILDING_OPTION_INDICES = {
  house: [25, 26, 27, 28],
  village: [29, 30],
  village_b: [31, 32],
  village_green: [33, 34],
  church: [85, 86, 87, 88],
  market_square: [90],
  manor: [91, 92, 93, 94]
};

/** Classify building by area (m²) → tile type */
export function classifyBuildingByArea(areaM2) {
  if (areaM2 < 100) return 'house';
  if (areaM2 < 400) return 'village';
  if (areaM2 < 1000) return 'manor';
  return 'manor';
}

/** Calculate polygon centroid */
function calcCentroid(coords) {
  let sumX = 0, sumY = 0;
  for (const [e, n] of coords) { sumX += e; sumY += n; }
  return [sumX / coords.length, sumY / coords.length];
}

/** Calculate polygon area (shoelace formula) */
function calcArea(coords) {
  let area = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    area += coords[i][0] * coords[i + 1][1] - coords[i + 1][0] * coords[i][1];
  }
  return Math.abs(area) / 2;
}

/** Calculate building orientation (degrees, 0 = north, 90 = east) */
function calcOrientation(coords) {
  // Simple approximation: use the longest edge angle
  let maxLen = 0;
  let bestAngle = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    const dx = coords[i + 1][0] - coords[i][0];
    const dy = coords[i + 1][1] - coords[i][1];
    const len = dx * dx + dy * dy;
    if (len > maxLen) {
      maxLen = len;
      bestAngle = Math.atan2(dx, dy) * 180 / Math.PI; // atan2(easting diff, northing diff)
    }
  }
  // Normalize to 0-360, then snap to nearest 90°
  const normalized = (bestAngle + 360) % 360;
  return Math.round(normalized / 90) * 90;
}

export const HIGHWAY_TO_ROAD = {
  primary: { width: 12, importance: 'trunk' },
  secondary: { width: 10, importance: 'trunk' },
  tertiary: { width: 8, importance: 'normal' },
  residential: { width: 7, importance: 'normal' },
  service: { width: 5, importance: 'lane' },
  footway: { width: 2, importance: 'path' },
  path: { width: 2, importance: 'path' },
  steps: { width: 1.5, importance: 'path' },
  pedestrian: { width: 3, importance: 'path' },
  unclassified: { width: 6, importance: 'normal' }
};

export const LANDMARK_TILE_MAP = {
  // Verified landmarks (OSM tags match)
  'U.P. Railroad Footbridge & Depot': { tile: 'depot', custom: true, weight: 1000 },
  'City Hall & Fire Station': { tile: 'manor', custom: true, weight: 1000 },
  'Masonic Temple': { tile: 'church', custom: true, weight: 1000 },
  "St. Matthew's Episcopal Cathedral": { tile: 'church', custom: true, weight: 1000 },
  'First Interstate Bank': { tile: 'manor', custom: true, weight: 1000 },
  'Albany County Courthouse': { tile: 'manor', custom: true, weight: 1000 },
  'Wyo Theatre': { tile: 'market_square', custom: true, weight: 1000 },
  'Laramie Fire Station': { tile: 'watchtower', custom: true, weight: 1000 },
  'Durlacher House': { tile: 'house', custom: true, weight: 1000 },
  'Blair House': { tile: 'house', custom: true, weight: 1000 },
  'Lincoln Community Center': { tile: 'market_square', custom: true, weight: 1000 },
  
  // Candidate landmarks (proximity only)
  'Wagner Building': { tile: 'village', candidate: true },
  'Connor Hotel': { tile: 'village', candidate: true },
  'Midwest Block Building': { tile: 'village', candidate: true },
  'Johnson Hotel': { tile: 'village', candidate: true },
  
  // Unverified (no footprint)
  'Carnegie Library': { tile: 'manor', unverified: true },
  'Buckhorn Bar': { tile: 'village', unverified: true },
  'Kuster Hotel': { tile: 'village', unverified: true },
  'Hesse Hall': { tile: 'village', unverified: true },
  'First State Bank Building': { tile: 'manor', unverified: true }
};

// ============================================================
// CONSTRAINT LOADER
// ============================================================

// ============================================================
// STREET WIDTH MAPPING: highway type -> tile width (in tiles)
// ============================================================
// Based on OSM highway classification and lanes data
// 1 tile = 4 geographic meters
export const HIGHWAY_WIDTH_TILES = {
  primary: 3,      // 4 lanes = ~12m = 3 tiles
  secondary: 2,    // ~10m = 2-3 tiles  
  tertiary: 2,     // ~8m = 2 tiles
  residential: 2,  // ~7m = 2 tiles
  service: 1,      // ~5m = 1-2 tiles
  footway: 1,      // ~2m = 1 tile
  path: 1,         // ~2m = 1 tile
  steps: 1,        // ~1.5m = 1 tile
  pedestrian: 1,   // ~3m = 1 tile
  unclassified: 2  // ~6m = 2 tiles
};

/**
 * Rasterize a LineString with a given width (in tiles) to grid cells.
 * Returns a Map of cellKey -> { cx, cz, directions: Set of 'N'|'E'|'S'|'W' }
 */
function rasterizeLineString(coords, widthTiles) {
  const cells = new Map();
  
  if (coords.length < 2) return cells;
  
  // For each segment
  for (let i = 0; i < coords.length - 1; i++) {
    const [e1, n1] = coords[i];
    const [e2, n2] = coords[i + 1];
    
    const c1 = GEO.utmToCell(e1, n1);
    const c2 = GEO.utmToCell(e2, n2);
    
    const dx = c2.cx - c1.cx;
    const dz = c2.cz - c1.cz;
    const steps = Math.max(Math.abs(dx), Math.abs(dz), 1);
    
    // Determine segment direction
    let dirX = 0, dirZ = 0;
    if (dx > 0) dirX = 1;
    else if (dx < 0) dirX = -1;
    if (dz > 0) dirZ = 1;
    else if (dz < 0) dirZ = -1;
    
    // Rasterize centerline with width
    // Track the previous cell to ensure bidirectional connectivity along the segment
    let prevCellKey = null;
    let prevDirections = null;
    
    for (let s = 0; s <= steps; s++) {
      const cx = c1.cx + Math.round(dx * s / steps);
      const cz = c1.cz + Math.round(dz * s / steps);
      
      // For width > 1, add parallel cells
      const halfWidth = Math.floor(widthTiles / 2);
      for (let wx = -halfWidth; wx <= halfWidth; wx++) {
        for (let wz = -halfWidth; wz <= halfWidth; wz++) {
          // Only include cells within the width radius (Manhattan distance for simplicity)
          if (Math.abs(wx) + Math.abs(wz) <= halfWidth) {
            const cellX = cx + wx;
            const cellZ = cz + wz;
            const key = `${cellX},${cellZ}`;
            
            if (!cells.has(key)) {
              cells.set(key, { cx: cellX, cz: cellZ, directions: new Set() });
            }
            
            // Add direction bits for this segment step
            if (dirX > 0) cells.get(key).directions.add('E');
            if (dirX < 0) cells.get(key).directions.add('W');
            if (dirZ > 0) cells.get(key).directions.add('N');
            if (dirZ < 0) cells.get(key).directions.add('S');
            
            // Ensure bidirectional connectivity along the segment centerline
            // Only for the centerline (wx=0, wz=0) to avoid connecting parallel lanes
            if (wx === 0 && wz === 0 && prevCellKey !== null) {
              // Add reverse direction to previous centerline cell
              const opposite = { N: 'S', S: 'N', E: 'W', W: 'E' };
              for (const dir of prevDirections) {
                cells.get(prevCellKey).directions.add(opposite[dir]);
              }
            }
            
            // Track for next iteration (only centerline)
            if (wx === 0 && wz === 0) {
              prevCellKey = key;
              // Copy current directions for reverse connection
              prevDirections = new Set(cells.get(key).directions);
            }
          }
        }
      }
    }
  }
  
  return cells;
}

/**
 * Determine intersection tile type from directions
 */
function getIntersectionTileType(directions) {
  const hasN = directions.has('N');
  const hasE = directions.has('E');
  const hasS = directions.has('S');
  const hasW = directions.has('W');
  const count = [hasN, hasE, hasS, hasW].filter(Boolean).length;
  
  if (count >= 4) return 'path_cross';
  if (count === 3) return 'path_t';
  if (count === 2) {
    // Check if opposite (straight) or adjacent (corner)
    if ((hasN && hasS) || (hasE && hasW)) return 'path_straight';
    return 'path_corner';
  }
  if (count === 1) return 'path_end';
  return 'path_straight';
}

/**
 * Determine rotation for intersection tile based on directions
 */
function getIntersectionRotation(directions, tileType) {
  const hasN = directions.has('N');
  const hasE = directions.has('E');
  const hasS = directions.has('S');
  const hasW = directions.has('W');
  
  if (tileType === 'path_cross') return 0; // rotation doesn't matter for cross
  if (tileType === 'path_end') {
    if (hasN) return 2; // path comes from S, ends at center (rot 2 = N)
    if (hasE) return 3; // path comes from W
    if (hasS) return 0; // path comes from N
    if (hasW) return 1; // path comes from E
  }
  if (tileType === 'path_straight') {
    if (hasN && hasS) return 0; // N-S
    if (hasE && hasW) return 1; // E-W
  }
  if (tileType === 'path_corner') {
    if (hasN && hasE) return 0; // N-E
    if (hasE && hasS) return 1; // E-S
    if (hasS && hasW) return 2; // S-W
    if (hasW && hasN) return 3; // W-N
  }
  if (tileType === 'path_t') {
    // T missing one direction
    if (!hasN) return 0; // missing N = E-S-W (rot 0)
    if (!hasE) return 1; // missing E = N-S-W (rot 1)
    if (!hasS) return 2; // missing S = N-E-W (rot 2)
    if (!hasW) return 3; // missing W = N-E-S (rot 3)
  }
  return 0;
}

/**
 * Convert direction set to trunkMask bits (1=N, 2=E, 4=S, 8=W)
 */
function directionsToTrunkMask(directions) {
  let mask = 0;
  if (directions.has('N')) mask |= 1;
  if (directions.has('E')) mask |= 2;
  if (directions.has('S')) mask |= 4;
  if (directions.has('W')) mask |= 8;
  return mask;
}

/**
 * Converts GIS street segments to WFC road constraints with proper widths and intersections.
 * Now uses actual GIS intersection data for accurate intersection geometry.
 */
/**
 * Converts GIS street segments to WFC road constraints with proper widths and intersections.
 * Only genuine road-road and road-service junctions force intersection tiles.
 * Footway/path crossings are excluded from road intersection constraints.
 */
import { OSM_HIGHWAY_LOOKUP } from '../../public/gis/osm_highway_lookup.mjs';

export function streetsToConstraints(streetsGeoJSON, intersectionsGeoJSON, seed) {
  const constraints = new Map();
  
  if (!streetsGeoJSON?.features) return constraints;
  
  // Build highway type lookup from OSM data (loaded from module)
  const highwayByOsm = new Map();
  for (const [osmId, highway] of Object.entries(OSM_HIGHWAY_LOOKUP)) {
    highwayByOsm.set(osmId, highway);
  }
  
  // Classify GIS intersections by highway type
  // Only road-road and road-service junctions will force intersection tiles
  const roadJunctionCells = new Set();
  if (intersectionsGeoJSON?.features) {
    for (const feature of intersectionsGeoJSON.features) {
      if (feature.geometry?.type !== 'Point') continue;
      const [e, n] = feature.geometry.coordinates;
      const cell = GEO.utmToCell(e, n);
      const key = `${cell.cx},${cell.cz}`;
      
      const props = feature.properties || {};
      const s1 = props.street1_osm;
      const s2 = props.street2_osm;
      const hw1 = highwayByOsm.get(String(s1)) || 'unknown';
      const hw2 = highwayByOsm.get(String(s2)) || 'unknown';
      
      const isRoad = (hw) => ['primary', 'secondary', 'tertiary', 'residential', 'unclassified', 'living_street'].includes(hw);
      const isService = (hw) => ['service', 'pedestrian', 'driveway', 'parking_aisle'].includes(hw);
      const isFootway = (hw) => ['footway', 'path', 'steps', 'crossing'].includes(hw);
      
      const c1 = isRoad(hw1) || isService(hw1);
      const c2 = isRoad(hw2) || isService(hw2);
      
      // Only mark as road junction if both streets are roads or services (not footways/paths)
      const isRoadJunction = c1 && c2;
      
      if (isRoadJunction) {
        const [e, n] = feature.geometry.coordinates;
        const cell = GEO.utmToCell(e, n);
        const key = `${cell.cx},${cell.cz}`;
        roadJunctionCells.add(key);
      }
    }
  }
  
  // First pass: collect all street cells with their directions
  // Use width=1 for centerline (intersection detection) and full width for trunkMask
  const allStreetCells = new Map(); // cellKey -> { cx, cz, directions: Set, width: number }
  
  for (const feature of streetsGeoJSON.features) {
    if (feature.geometry?.type !== 'LineString') continue;
    const coords = feature.geometry.coordinates;
    const props = feature.properties || {};
    const highway = props.highway || 'unclassified';
    const lanes = parseInt(props.lanes) || 2;
    const widthTiles = HIGHWAY_WIDTH_TILES[highway] || 2;
    
    // Rasterize centerline (width=1) for intersection detection
    const centerlineCells = rasterizeLineString(coords, 1);
    
    // Rasterize full width for trunkMask
    const wideCells = rasterizeLineString(coords, widthTiles);
    
    for (const [key, data] of centerlineCells.entries()) {
      if (!allStreetCells.has(key)) {
        allStreetCells.set(key, { 
          cx: data.cx, 
          cz: data.cz, 
          directions: new Set(),
          width: widthTiles,
          highway: highway
        });
      }
      // Merge directions from centerline
      for (const d of data.directions) {
        allStreetCells.get(key).directions.add(d);
      }
    }
    
    // Also add wide cells for trunkMask (but don't merge their directions)
    for (const [key, data] of wideCells.entries()) {
      if (!allStreetCells.has(key)) {
        allStreetCells.set(key, { 
          cx: data.cx, 
          cz: data.cz, 
          directions: new Set(),
          width: widthTiles,
          highway: highway
        });
      }
      // Merge directions from wide cells too (they may extend beyond centerline)
      for (const d of data.directions) {
        allStreetCells.get(key).directions.add(d);
      }
    }
  }
  
  // Second pass: identify intersections from centerline direction data
  // Only at genuine road junctions (GIS road-road/road-service) with 2+ directions
  const intersectionTypes = new Map(); // cellKey -> { tileType, rotation, directions }
  
  for (const [key, data] of allStreetCells.entries()) {
    const directions = data.directions;
    const dirCount = directions.size;
    
    // Check if this is a known road junction from GIS
    const isRoadJunction = roadJunctionCells.has(key);
    
    // Only treat as intersection if it's a genuine road junction AND has road directions
    if (isRoadJunction && dirCount >= 2) {
      const tileType = getIntersectionTileType(directions);
      const rotation = getIntersectionRotation(directions, tileType);
      intersectionTypes.set(key, { tileType, rotation, directions });
    }
  }
  
  // Third pass: build constraints per chunk
  for (const [key, data] of allStreetCells.entries()) {
    const cx = data.cx;
    const cz = data.cz;
    const chunkKey = `${cx >> 3},${cz >> 3}`;
    const localX = cx & 7;
    const localZ = cz & 7;
    const cellIdx = localZ * 8 + localX;
    
    if (!constraints.has(chunkKey)) {
      constraints.set(chunkKey, { 
        trunkMask: new Uint8Array(64), 
        req: new Int8Array(256), 
        crossings: [],
        forcedTiles: new Map(),
        intersectionTiles: new Map()
      });
    }
    const c = constraints.get(chunkKey);
    
    // Set trunkMask bits for road planning
    const trunkMaskBits = directionsToTrunkMask(data.directions);
    c.trunkMask[cellIdx] = trunkMaskBits;
    
    // If this cell is an intersection, force the correct tile
    if (intersectionTypes.has(key)) {
      const ix = intersectionTypes.get(key);
      c.intersectionTiles.set(cellIdx, ix);
      c.forcedTiles.set(cellIdx, {
        tileId: ix.tileType,
        weight: 1000,
        rotation: ix.rotation,
        isIntersection: true
      });
    }
  }
  
  return constraints;
}


export function buildBuildingRegistry(buildingsGeoJSON) {
  const registry = [];
  const collisions = new Map(); // cellKey -> array of building indices
  let excludedCount = 0;

  if (!buildingsGeoJSON?.features) return { registry, collisions: [], excludedCount };

  for (const feature of buildingsGeoJSON.features) {
    const props = feature.properties || {};
    const geom = feature.geometry;

    // Only process Polygon geometries
    if (!geom || geom.type !== 'Polygon') {
      excludedCount++;
      continue;
    }

    const coords = geom.coordinates[0];
    if (!coords || coords.length < 4) {
      excludedCount++;
      continue;
    }

    // Exclude non-building features that were incorrectly exported to buildings layer
    // Depot Park (OSM 390253411) has classification="PARK" and building=null
    // Plazas without building/amenity/shop/tourism tags should also be excluded
    const classification = props.classification || '';
    const buildingTag = props.building;
    const leisureTag = props.leisure;
    const amenityTag = props.amenity;
    const shopTag = props.shop;
    const tourismTag = props.tourism;
    const historicTag = props.historic;
    
    const isPark = classification === 'PARK' || leisureTag === 'park';
    const hasBuildingTag = buildingTag !== null && buildingTag !== undefined;
    const hasStructureTag = amenityTag || shopTag || tourismTag || historicTag;
    
    // Exclude if it's a park, or has no building tag AND no structure-indicating tags
    if (isPark || (!hasBuildingTag && !hasStructureTag)) {
      excludedCount++;
      continue;
    }

    // Calculate centroid, area, orientation
    const [centroidE, centroidN] = calcCentroid(coords);
    const area = calcArea(coords);
    const orientation = calcOrientation(coords);

    // Convert to tile coordinates
    const cell = GEO.utmToCell(centroidE, centroidN);
    const cellKey = `${cell.cx},${cell.cz}`;

    // Classify by area
    const tileType = classifyBuildingByArea(area);

    // Get option indices for this tile type (all rotations allowed)
    const optionIndices = BUILDING_OPTION_INDICES[tileType] || BUILDING_OPTION_INDICES.house;

    // Create registry entry
    const entry = {
      osmId: props.osm_id,
      name: props.name || '',
      building: props.building || '',
      amenity: props.amenity || '',
      area: area,
      centroid: { e: centroidE, n: centroidN },
      centroidTile: { cx: cell.cx, cz: cell.cz },
      tileType: tileType,
      optionIndices: optionIndices,
      orientation: orientation,
      originalPolygon: coords,
      classification: props.classification || 'BUILDING',
      verificationStatus: props.verification_status || 'UNVERIFIED'
    };

    const entryIndex = registry.length;
    registry.push(entry);

    // Track collisions
    if (!collisions.has(cellKey)) collisions.set(cellKey, []);
    collisions.get(cellKey).push(entryIndex);
  }

  // Report collisions
  const collisionReports = [];
  for (const [cellKey, indices] of collisions.entries()) {
    if (indices.length > 1) {
      collisionReports.push({
        cellKey,
        tile: cellKey.split(',').map(Number),
        buildings: indices.map(i => ({
          index: i,
          osmId: registry[i].osmId,
          name: registry[i].name,
          area: registry[i].area
        }))
      });
    }
  }

  return { registry, collisions: collisionReports, excludedCount };
}

/**
 * Legacy function for backward compatibility - converts registry to cell-based constraints.
 * @deprecated Use buildBuildingRegistry() and applyBuildingConstraints() in WFC instead.
 */
export function buildingsToConstraints(buildingsGeoJSON) {
  const { registry, collisions } = buildBuildingRegistry(buildingsGeoJSON);
  const constraints = new Map();

  if (collisions.length > 0) {
    console.warn('[Laramie] Building tile collisions detected:', collisions.length);
    for (const c of collisions) {
      console.warn(`  Cell (${c.tile[0]}, ${c.tile[1]}):`, c.buildings.map(b => `${b.name || 'unnamed'} (OSM ${b.osmId}, ${b.area}m²)`).join(', '));
    }
  }

  for (const entry of registry) {
    const cellKey = `${entry.centroidTile.cx},${entry.centroidTile.cz}`;
    if (!constraints.has(cellKey)) constraints.set(cellKey, []);
    constraints.get(cellKey).push({ tileId: entry.tileType, weight: 1000, osmId: entry.osmId, name: entry.name });
  }

  return constraints;
}

/**
 * Converts GIS landmarks to deterministic WFC tile placements.
 */
export function landmarksToConstraints(landmarksGeoJSON) {
  const constraints = new Map();
  
  if (!landmarksGeoJSON?.features) return constraints;
  
  for (const feature of landmarksGeoJSON.features) {
    const props = feature.properties || {};
    const name = props.official_name || props.name || 'Unknown';
    const mapping = LANDMARK_TILE_MAP[name] || { tile: 'house', weight: 1 };
    
    let centroidE, centroidN;
    if (feature.geometry?.type === 'Polygon') {
      const coords = feature.geometry.coordinates[0];
      let sumX = 0, sumY = 0;
      for (const [e, n] of coords) { sumX += e; sumY += n; }
      centroidE = sumX / coords.length;
      centroidN = sumY / coords.length;
    } else if (feature.geometry?.type === 'Point') {
      [centroidE, centroidN] = feature.geometry.coordinates;
    } else continue;
    
    const cell = GEO.utmToCell(centroidE, centroidN);
    const key = `${cell.cx},${cell.cz}`;
    
    constraints.set(key, {
      tileId: mapping.tile,
      weight: mapping.weight || 1000,
      landmark: true,
      name,
      verified: mapping.custom === true,
      candidate: mapping.candidate === true,
      unverified: mapping.unverified === true
    });
  }
  
  return constraints;
}

/**
 * Converts GIS crossings to WFC crossing constraints.
 */
export function crossingsToConstraints(crossingsGeoJSON) {
  const constraints = new Map();

  if (!crossingsGeoJSON?.features) return constraints;

  for (const feature of crossingsGeoJSON.features) {
    if (feature.geometry?.type !== 'Point') continue;
    const [e, n] = feature.geometry.coordinates;

    const cell = GEO.utmToCell(e, n);
    const chunkKey = `${cell.cx >> 3},${cell.cz >> 3}`;

    if (!constraints.has(chunkKey)) {
      constraints.set(chunkKey, { crossingMask: new Uint8Array(64) });
    }
    const c = constraints.get(chunkKey);
    const localX = cell.cx & 7;
    const localZ = cell.cz & 7;
    const cellIdx = localZ * 8 + localX;

    // Mark this cell as having a crossing (all four sides)
    c.crossingMask[cellIdx] = 1;
  }

  return constraints;
}
export function railwaysToConstraints(railwaysGeoJSON) {
  const constraints = new Map();

  if (!railwaysGeoJSON?.features) return constraints;

  for (const feature of railwaysGeoJSON.features) {
    if (feature.geometry?.type !== 'LineString') continue;
    const coords = feature.geometry.coordinates;
    const props = feature.properties || {};
    const railway = props.railway;
    const usage = props.usage;
    const service = props.service;

    // Classify railway type
    // Only UP Laramie Subdivision main line tracks (usage=main) are main line
    // Snow Train (usage=null, service=null, but only 2 points) is NOT main line
    const isMainLine = usage === 'main';
    const isSiding = service === 'siding';
    const isSpur = service === 'spur';
    const isYard = service === 'yard';

    // Only main line tracks force rail tiles
    const forceRailTiles = isMainLine;

    for (let i = 0; i < coords.length - 1; i++) {
      const [e1, n1] = coords[i];
      const [e2, n2] = coords[i + 1];

      const c1 = GEO.utmToCell(e1, n1);
      const c2 = GEO.utmToCell(e2, n2);

      const steps = Math.max(Math.abs(c2.cx - c1.cx), Math.abs(c2.cz - c1.cz));
      for (let s = 0; s <= steps; s++) {
        const cx = c1.cx + Math.round((c2.cx - c1.cx) * s / (steps || 1));
        const cz = c1.cz + Math.round((c2.cz - c1.cz) * s / (steps || 1));
        const chunkKey = `${cx >> 3},${cz >> 3}`;

        if (!constraints.has(chunkKey)) {
          constraints.set(chunkKey, { railMask: new Uint8Array(64), railTypeMask: new Uint8Array(64), railDirMask: new Uint8Array(64) });
        }
        const c = constraints.get(chunkKey);
        const localX = cx & 7;
        const localZ = cz & 7;
        const cellIdx = localZ * 8 + localX;

        // railMask: all railway cells (for reference)
        c.railMask[cellIdx] |= 1 | 4; // N+S bidirectional

        // railTypeMask: 1=main line, 2=siding, 3=spur, 4=yard
        if (isMainLine) c.railTypeMask[cellIdx] = 1;
        else if (isSiding) c.railTypeMask[cellIdx] = 2;
        else if (isSpur) c.railTypeMask[cellIdx] = 3;
        else if (isYard) c.railTypeMask[cellIdx] = 4;

        // railDirMask: encode dominant direction for tile rotation
        // 1=N-S (vertical), 2=E-W (horizontal), 3=diagonal/other
        const dx = c2.cx - c1.cx;
        const dz = c2.cz - c1.cz;
        const adx = Math.abs(dx);
        const adz = Math.abs(dz);
        let dirCode = 3; // diagonal/other
        if (adx === 0 && adz > 0) dirCode = 1; // N-S
        else if (adz === 0 && adx > 0) dirCode = 2; // E-W
        else if (adx === adz) dirCode = 3; // 45-degree diagonal
        else if (adz > adx) dirCode = 1; // more N-S
        else dirCode = 2; // more E-W
        c.railDirMask[cellIdx] = dirCode;

        // Store forceRailTiles flag
        if (forceRailTiles) {
          if (!c.forceRailCells) c.forceRailCells = new Set();
          c.forceRailCells.add(cellIdx);
        }
      }
    }
  }

  return constraints;
}

    /**
     * Point-in-polygon test for park constraints.
     */
    function pointInPolygon(point, polygon) {
      const [x, y] = point;
      let inside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i];
        const [xj, yj] = polygon[j];
        const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
      }
      return inside;
    }

    /**
     * Converts GIS parks to biome/tile weight overrides.
     * Uses actual polygon geometry (point-in-polygon) rather than bounding box.
     * Park cells get biome boosts for meadow/grass/pond tiles, not forced tiles.
     */
    export function parksToConstraints(parksGeoJSON) {
      const constraints = new Map();

      if (!parksGeoJSON?.features) return constraints;

      for (const feature of parksGeoJSON.features) {
        if (feature.geometry?.type !== 'Polygon') continue;
        const coords = feature.geometry.coordinates[0];
        const props = feature.properties || {};
        const name = props.name || 'Unnamed Park';

        // Calculate bounding box for iteration
        let minE = Infinity, maxE = -Infinity, minN = Infinity, maxN = -Infinity;
        for (const [e, n] of coords) {
          minE = Math.min(minE, e); maxE = Math.max(maxE, e);
          minN = Math.min(minN, n); maxN = Math.max(maxN, n);
        }

        const minCell = GEO.utmToCell(minE, minN);
        const maxCell = GEO.utmToCell(maxE, maxN);

        for (let cx = minCell.cx; cx <= maxCell.cx; cx++) {
          for (let cz = minCell.cz; cz <= maxCell.cz; cz++) {
            const key = `${cx},${cz}`;

            // Test if cell center is inside polygon
            const utm = GEO.cellToUtm(cx, cz);
            if (!pointInPolygon([utm.utmE, utm.utmN], coords)) continue;

            if (!constraints.has(key)) constraints.set(key, { biomeBoost: {}, tileBoosts: [], parkName: name });
            const c = constraints.get(key);
            c.tileBoosts.push({ tileId: 'meadow_flowers', weight: 5.0 });
            c.tileBoosts.push({ tileId: 'grove', weight: 3.0 });
            c.tileBoosts.push({ tileId: 'pond', weight: 2.0 });
            c.parkName = name;
          }
        }
      }

      return constraints;
    }

    /**
     * Converts GIS sidewalks to pedestrian path constraints.
     * Sidewalks are kept separate from vehicle road constraints.
     * They provide tile weight boosts for path tiles, not forced tiles.
     */
    export function sidewalksToConstraints(sidewalksGeoJSON) {
      const constraints = new Map();

      if (!sidewalksGeoJSON?.features) return constraints;

      for (const feature of sidewalksGeoJSON.features) {
        if (feature.geometry?.type !== 'LineString') continue;
        const coords = feature.geometry.coordinates;
        const props = feature.properties || {};
        const highway = props.highway || 'footway';
        const footway = props.footway;

        // Rasterize sidewalk centerline (width=1)
        for (let i = 0; i < coords.length - 1; i++) {
          const [e1, n1] = coords[i];
          const [e2, n2] = coords[i + 1];

          const c1 = GEO.utmToCell(e1, n1);
          const c2 = GEO.utmToCell(e2, n2);

          const dx = c2.cx - c1.cx;
          const dz = c2.cz - c1.cz;
          const steps = Math.max(Math.abs(dx), Math.abs(dz), 1);

          let dirX = 0, dirZ = 0;
          if (dx > 0) dirX = 1;
          else if (dx < 0) dirX = -1;
          if (dz > 0) dirZ = 1;
          else if (dz < 0) dirZ = -1;

          for (let s = 0; s <= steps; s++) {
            const cx = c1.cx + Math.round(dx * s / steps);
            const cz = c1.cz + Math.round(dz * s / steps);
            const chunkKey = `${cx >> 3},${cz >> 3}`;

            if (!constraints.has(chunkKey)) {
              constraints.set(chunkKey, { sidewalkMask: new Uint8Array(64) });
            }
            const c = constraints.get(chunkKey);
            const localX = cx & 7;
            const localZ = cz & 7;
            const cellIdx = localZ * 8 + localX;

            // Mark sidewalk cell (bidirectional along path)
            c.sidewalkMask[cellIdx] |= 1 | 4; // N+S for now
            if (dirX !== 0) c.sidewalkMask[cellIdx] |= dirX > 0 ? 2 : 8; // E or W
            if (dirZ !== 0) c.sidewalkMask[cellIdx] |= dirZ > 0 ? 1 : 4; // N or S
          }
        }
      }

      return constraints;
    }

/**
 * Converts DEM sample points to biome height modulation.
 */
export function demToHeightField(demSamplesGeoJSON) {
  const heightMap = new Map();
  
  if (!demSamplesGeoJSON?.features) {
    return (cx, cz) => 2180;
  }
  
  for (const feature of demSamplesGeoJSON.features) {
    const props = feature.properties || {};
    const elev = props.elevation_m;
    if (elev === undefined) continue;
    
    const coords = feature.geometry?.coordinates;
    if (!coords) continue;
    
    const [e, n] = coords;
    const cell = GEO.utmToCell(e, n);
    const key = `${cell.cx},${cell.cz}`;
    heightMap.set(key, elev);
  }
  
  return (cx, cz) => heightMap.get(`${cx},${cz}`) ?? 2180;
}

// ============================================================
// MASTER CONSTRAINT BUILDER
// ============================================================

/**
 * Loads all GIS layers and builds a complete constraint set for the WFC.
 * Uses fetch() to load from the public/gis folder served by Vite.
 */
export async function buildLaramieConstraints() {
  const basePath = './gis';
  const enableDiag = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('diag') === '1';
  
  function diagLog(...args) {
    if (enableDiag) console.log('[DIAG]', ...args);
  }
  
  function diagError(...args) {
    if (enableDiag) console.error('[DIAG]', ...args);
  }
  
  const load = async (filename) => {
    diagLog('GIS fetch start:', filename);
    const controller = new AbortController();
    const timeout = enableDiag ? setTimeout(() => controller.abort(), 15000) : null;
    try {
      const baseUrl = new URL(basePath + '/', typeof window !== 'undefined' ? window.location.href : 'http://localhost').href;
      const response = await fetch(`${baseUrl}${filename}`, enableDiag ? { signal: controller.signal } : {});
      if (timeout) clearTimeout(timeout);
      diagLog('GIS fetch response:', filename, response.status, response.headers.get('content-type'));
      if (!response.ok) throw new Error(`Failed to load ${filename}: ${response.status}`);
      const json = await response.json();
      diagLog('GIS fetch parsed:', filename, json.type, json.features?.length || 0, 'features');
      return json;
    } catch (err) {
      if (timeout) clearTimeout(timeout);
      if (enableDiag && err.name === 'AbortError') throw new Error(`GIS fetch timeout (15s): ${filename}`);
      diagError('GIS fetch failed:', filename, err);
      throw err;
    }
  };
  
  diagLog('[Laramie] Building constraint maps — starting 9 fetches...');

      const [
        streets,
        intersections,
        crossings,
        sidewalks,
        buildings,
        landmarks,
        railways,
        parks,
        demSamples
      ] = await Promise.all([
        load('pt_street_centerlines.geojson'),
        load('pt_street_intersections.geojson'),
        load('pt_crossings.geojson'),
        load('pt_sidewalks.geojson'),
        load('pt_buildings.geojson'),
        load('pt_historic_landmarks.geojson'),
        load('pt_railways.geojson'),
        load('pt_parks.geojson'),
        load('pt_dem_sample_points.geojson')
      ]);
      
      diagLog('[Laramie] Promise.all resolved — all 9 GIS files loaded');

      diagLog('[Laramie] Building constraint maps...');

      // Build building registry (new system)
      const { registry: buildingRegistry, collisions: buildingCollisions, excludedCount: buildingExcluded } =
        buildBuildingRegistry(buildings);
      diagLog('[Laramie] Building registry done:', { total: buildingRegistry.length, excluded: buildingExcluded, collisions: buildingCollisions.length });

      if (buildingCollisions.length > 0) {
        console.warn('[Laramie] Building tile collisions:', buildingCollisions.length);
        for (const c of buildingCollisions) {
          console.warn(`  Cell (${c.tile[0]}, ${c.tile[1]}):`, c.buildings.map(b => `${b.name || 'unnamed'} (OSM ${b.osmId}, ${b.area.toFixed(1)}m²)`).join(', '));
        }
      }

      diagLog('[Laramie] streetsToConstraints...');
      const streetsConstraints = streetsToConstraints(streets, intersections);
      diagLog('[Laramie] streetsToConstraints done:', { chunks: streetsConstraints.size });
      
      diagLog('[Laramie] crossingsToConstraints...');
      const crossingsConstraints = crossingsToConstraints(crossings);
      diagLog('[Laramie] crossingsToConstraints done:', { chunks: crossingsConstraints.size });
      
      diagLog('[Laramie] sidewalksToConstraints...');
      const sidewalksConstraints = sidewalksToConstraints(sidewalks);
      diagLog('[Laramie] sidewalksToConstraints done:', { chunks: sidewalksConstraints.size });
      
      diagLog('[Laramie] buildingsToConstraints (legacy)...');
      const buildingsConstraints = buildingsToConstraints(buildings);
      diagLog('[Laramie] buildingsToConstraints done:', { cells: buildingsConstraints.size });
      
      diagLog('[Laramie] landmarksToConstraints...');
      const landmarksConstraints = landmarksToConstraints(landmarks);
      diagLog('[Laramie] landmarksToConstraints done:', { cells: landmarksConstraints.size });
      
      diagLog('[Laramie] railwaysToConstraints...');
      const railwaysConstraints = railwaysToConstraints(railways);
      diagLog('[Laramie] railwaysToConstraints done:', { chunks: railwaysConstraints.size });
      
      diagLog('[Laramie] parksToConstraints...');
      const parksConstraints = parksToConstraints(parks);
      diagLog('[Laramie] parksToConstraints done:', { cells: parksConstraints.size });
      
      diagLog('[Laramie] demToHeightField...');
      const heightField = demToHeightField(demSamples);
      diagLog('[Laramie] demToHeightField done');

      const constraints = {
                streets: streetsConstraints,
                crossings: crossingsConstraints,
                sidewalks: sidewalksConstraints,
                buildings: buildingsConstraints, // legacy Map for backward compat
                buildingRegistry: buildingRegistry, // NEW: authoritative registry
                buildingCollisions: buildingCollisions,
                landmarks: landmarksConstraints,
                railways: railwaysConstraints,
                parks: parksConstraints,
                heightField: heightField,

                raw: { streets, intersections, crossings, sidewalks, buildings, landmarks, railways, parks }
              };
  
      diagLog('[Laramie] Constraints built:', {
        streetChunks: constraints.streets.size,
        buildingCells: constraints.buildings.size,
        buildingRegistry: buildingRegistry.length,
        landmarks: constraints.landmarks.size,
        railwayChunks: constraints.railways.size,
        parkCells: constraints.parks.size
      });
  return constraints;
}

export function applyConstraintsToChunk(wfc, cx, cz, constraints) {
  const chunkKey = `${cx},${cz}`;
  const OX = CONFIG.wfc.originLocal[0];
  const OZ = CONFIG.wfc.originLocal[1];
  const N = 8, NN = 64;

  if (!wfc._geoState) wfc._geoState = new Map();
  if (wfc._geoState.has(chunkKey)) return;

  const state = {
    trunkMask: new Uint8Array(NN),
    railMask: new Uint8Array(NN),
    railTypeMask: new Uint8Array(NN),
    railDirMask: new Uint8Array(NN),
    crossingMask: new Uint8Array(NN),
    sidewalkMask: new Uint8Array(NN),
    forcedTiles: new Map(),
    landmarkTiles: new Map(),
    parkBoosts: new Map(),
    applied: true
  };

  // 1. Street constraints
  const streetC = constraints.streets?.get(chunkKey);
  if (streetC) state.trunkMask.set(streetC.trunkMask);

  // 1b. Intersection forced tiles from streets
  if (streetC?.forcedTiles) {
    for (const [cellIdx, tileInfo] of streetC.forcedTiles.entries()) {
      state.forcedTiles.set(cellIdx, {
        tileId: tileInfo.tileId,
        weight: tileInfo.weight,
        rotation: tileInfo.rotation,
        isIntersection: tileInfo.isIntersection
      });
    }
  }

  // 2. Crossing constraints
  const crossingC = constraints.crossings?.get(chunkKey);
  if (crossingC) state.crossingMask.set(crossingC.crossingMask);

  // 3. Railway constraints
  const railC = constraints.railways?.get(chunkKey);
  if (railC) {
    state.railMask.set(railC.railMask);
    state.railTypeMask.set(railC.railTypeMask || new Uint8Array(NN));
    state.railDirMask.set(railC.railDirMask || new Uint8Array(NN));
    // NOTE: Railway forced tiles DISABLED — diagonal geometry cannot be represented
    // with current tile set (rail_straight/rail_corner only support N-S/E-W/90°).
    // Railway GIS geometry and metadata preserved in masks for future direct rendering.
    // if (railC.forceRailCells) { ... }
  }

  // 4. Sidewalk constraints
  const sidewalkC = constraints.sidewalks?.get(chunkKey);
  if (sidewalkC) {
    state.sidewalkMask.set(sidewalkC.sidewalkMask);
    // Sidewalks don't force tiles, they provide weight boosts for path tiles
  }

  // 5. Building constraints (by cell) — from building registry (one entry per building)
  const registry = constraints.buildingRegistry || [];
  for (const entry of registry) {
    const gx = entry.centroidTile.cx;
    const gz = entry.centroidTile.cz;

    // Check if this building falls in the current chunk
    const localX = gx - (cx * N - OX);
    const localZ = gz - (cz * N - OZ);

    if (localX >= 0 && localX < N && localZ >= 0 && localZ < N) {
      const cellIdx = localZ * N + localX;

      // Check for landmark conflict at this cell
      const cellKey = `${gx},${gz}`;
      const landmarkC = constraints.landmarks?.get(cellKey);

      if (landmarkC && landmarkC.verified && landmarkC.tileId !== entry.tileType) {
        // Verified landmark at this cell with different tile type: landmark wins
        // Skip building constraint to avoid hard constraint contradiction
        console.warn(`[Laramie] Building '${entry.name || entry.osmId}' at (${gx},${gz}) conflicts with verified landmark '${landmarkC.name}' (${landmarkC.tileId} vs ${entry.tileType}). Landmark constraint takes precedence.`);
      } else {
        // No conflict, or landmark is candidate/unverified, or same tile type: add building constraint
        state.forcedTiles.set(cellIdx, {
          tileId: entry.tileType,
          weight: 1000,
          osmId: entry.osmId,
          name: entry.name,
          optionIndices: entry.optionIndices,
          area: entry.area
        });
      }
    }
  }

  // 6. Landmark constraints
  // Only VERIFIED landmarks impose hard WFC constraints
  // CANDIDATE and UNVERIFIED landmarks are stored for metadata only
  for (let localX = 0; localX < N; localX++) {
    for (let localZ = 0; localZ < N; localZ++) {
      const gx = cx * N + localX - OX;
      const gz = cz * N + localZ - OZ;
      const cellKey = `${gx},${gz}`;
      const lmC = constraints.landmarks?.get(cellKey);
      if (lmC) {
        const cellIdx = localZ * N + localX;
        if (lmC.verified) {
          state.landmarkTiles.set(cellIdx, lmC);
        } else {
          // Store candidate/unverified landmarks for metadata only (no hard constraint)
          if (!state.candidateLandmarks) state.candidateLandmarks = new Map();
          state.candidateLandmarks.set(cellIdx, lmC);
        }
      }
    }
  }

  // 7. Park constraints
  for (let localX = 0; localX < N; localX++) {
    for (let localZ = 0; localZ < N; localZ++) {
      const gx = cx * N + localX - OX;
      const gz = cz * N + localZ - OZ;
      const cellKey = `${gx},${gz}`;
      const pC = constraints.parks?.get(cellKey);
      if (pC) {
        const cellIdx = localZ * N + localX;
        state.parkBoosts.set(cellIdx, pC.tileBoosts || []);
      }
    }
  }

  wfc._geoState.set(chunkKey, state);
}

export default { GEO, GIS_LAYERS, LARAMIE_SOCKETS, BUILDING_TILE_MAP, HIGHWAY_TO_ROAD, LANDMARK_TILE_MAP, buildLaramieConstraints, applyConstraintsToChunk, crossingsToConstraints, sidewalksToConstraints };
