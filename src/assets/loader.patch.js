// Patches for alien world support
// This file patches the loader.js to handle alien tiles properly

// The issue: tiles.glb now contains alien tiles (with alien_meadow, alien_grove, etc.)
// But MODEL_IDS still expects meadow, alien_meadow, etc.
// And FALLBACK_MODEL is 'meadow' which doesn't exist in alien tiles

// Solution: After loading tiles.glb, check if meadow is missing but alien_meadow exists
// If so, use alien_meadow as the fallback

// The patch below should be inserted after the loop that processes tilesGltf/alienGltf
// and before the fallback model check:

const patch = `
  // --- After processing tiles.glb ---
  // For alien world: use alien_meadow as fallback if meadow is missing
  if (!protos.has(FALLBACK_MODEL) && protos.has('alien_meadow')) {
    protos.set(FALLBACK_MODEL, protos.get('alien_meadow').clone(true));
  }
`;

// Also, we need to remove the alien_tiles.glb load since it's now in tiles.glb
// The config has:
//   alienTilesUrl: './models/alien_tiles.glb'
// We should either:
// 1. Remove this from config (but don't want to modify for both worlds)
// 2. Handle 404 gracefully (already done with .catch(() => null))

module.exports = { patch };