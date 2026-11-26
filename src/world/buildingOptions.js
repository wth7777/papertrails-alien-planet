// Option indices for building tile types (all rotations), used only by the optional geo-constraint
// pass inside wfc.js (hasGeoConstraints; never active in the original endless entry point).
// Moved here from src/geo/constraints.js so the core WFC does not depend on the Laramie geo layer.
// NOTE: indices refer to positions in world/tiles.js OPTIONS; recompute if the model table changes.
export const BUILDING_OPTION_INDICES = {
  house: [25, 26, 27, 28],
  house_1: [25, 26, 27, 28],     // 1-story: same as house
  house_2: [25, 26, 27, 28],     // 2-story: same as house (until GLTF model exists)
  house_3: [25, 26, 27, 28],     // 3-story: same as house (until GLTF model exists)
  village: [29, 30],
  village_b: [31, 32],
  village_green: [33, 34],
  church: [85, 86, 87, 88],
  market_square: [90],
  manor: [91, 92, 93, 94],
  manor_2: [91, 92, 93, 94],     // 2-story: same as manor (until GLTF model exists)
  manor_3: [91, 92, 93, 94]      // 3-story: same as manor (until GLTF model exists)
};
