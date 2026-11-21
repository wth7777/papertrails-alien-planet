// Test the building registry logic against actual GIS data
import { buildBuildingRegistry, classifyBuildingByArea, BUILDING_OPTION_INDICES } from '../src/geo/constraints.js';

// Load the actual GIS building data
import fs from 'fs';
const buildingsGeoJSON = JSON.parse(fs.readFileSync('/home/clawman/gis-project/laramie/output/pt_buildings.geojson', 'utf-8'));

// Test the registry building
const { registry, collisions, excludedCount } = buildBuildingRegistry(buildingsGeoJSON);

console.log('=== Building Registry Test ===\n');
console.log('Total buildings in GeoJSON: ' + buildingsGeoJSON.features.length);
console.log('Registry entries: ' + registry.length);
console.log('Excluded (non-Polygon): ' + excludedCount);
console.log('Collisions: ' + collisions.length + '\n');

// Report collisions
if (collisions.length > 0) {
  console.log('COLLISIONS:');
  for (const c of collisions) {
    console.log('  Cell (' + c.tile[0] + ', ' + c.tile[1] + '):');
    for (const b of c.buildings) {
      console.log('    OSM ' + b.osmId + ': ' + (b.name || 'unnamed') + ' (' + b.area.toFixed(1) + 'm²)');
    }
  }
  console.log();
}

// Test classifications
console.log('BUILDING CLASSIFICATIONS:');
const classCounts = { house: 0, village: 0, manor: 0 };
for (const entry of registry) {
  classCounts[entry.tileType]++;
}
console.log('  house (<100m²): ' + classCounts.house);
console.log('  village (100-400m²): ' + classCounts.village);
console.log('  manor (400-1000m²): ' + classCounts.manor);
console.log('  manor (>1000m²): ' + classCounts.manor + '\n');

// Find First Interstate Bank
console.log('FIRST INTERSTATE BANK:');
const fib = registry.find(e => e.osmId === 238625174);
if (fib) {
  console.log('  OSM ID: ' + fib.osmId);
  console.log('  Name: ' + fib.name);
  console.log('  Area: ' + fib.area.toFixed(1) + 'm²');
  console.log('  Centroid UTM: (' + fib.centroid.e.toFixed(2) + ', ' + fib.centroid.n.toFixed(2) + ')');
  console.log('  Tile: (' + fib.centroidTile.cx + ', ' + fib.centroidTile.cz + ')');
  console.log('  Tile Type: ' + fib.tileType);
  console.log('  Option Indices: [' + fib.optionIndices.join(', ') + ']');
  console.log('  Orientation: ' + fib.orientation + '°');
  console.log('  Vertices: ' + fib.originalPolygon.length);
} else {
  console.log('  NOT FOUND!');
}

// Test a few other buildings
console.log('\nSAMPLE BUILDINGS (by area):');
const sorted = [...registry].sort((a, b) => b.area - a.area);
for (const entry of sorted.slice(0, 10)) {
  const name = entry.name || 'unnamed';
  console.log('  ' + name.padEnd(30) + ' OSM ' + entry.osmId + ' area=' + entry.area.toFixed(1) + 'm² tile=(' + entry.centroidTile.cx + ',' + entry.centroidTile.cz + ') type=' + entry.tileType);
}

// Verify all have exactly one registry entry
console.log('\nVERIFICATION:');
const polygonCount = buildingsGeoJSON.features.filter(f => f.geometry?.type === 'Polygon').length;
console.log('  All ' + registry.length + ' buildings have exactly one registry entry: ' + (registry.length === polygonCount ? 'YES' : 'NO'));
console.log('  Each entry has optionIndices: ' + (registry.every(e => e.optionIndices && e.optionIndices.length > 0) ? 'YES' : 'NO'));
console.log('  Each entry has originalPolygon: ' + (registry.every(e => e.originalPolygon && e.originalPolygon.length > 0) ? 'YES' : 'NO'));
console.log('  Each entry preserves OSM ID: ' + (registry.every(e => e.osmId) ? 'YES' : 'NO'));
console.log('  Each entry has tileType: ' + (registry.every(e => e.tileType && BUILDING_OPTION_INDICES[e.tileType]) ? 'YES' : 'NO'));

