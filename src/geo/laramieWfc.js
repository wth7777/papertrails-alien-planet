// Laramie Geographic WFC Wrapper
// Extends the base WFC with hard geographic constraints from GIS data.
// Does not modify the original WFC logic; wraps it with pre-generation constraints.

import { createWFC as createBaseWFC } from '../world/wfc.js';
import { CONFIG } from '../core/config.js';
import { GEO, buildLaramieConstraints, applyConstraintsToChunk } from './constraints.js';

const N = 8; // chunk edge
const NN = N * N;

export function createLaramieWFC({ seed = 1, constraints = null } = {}) {
  // Create base WFC with same seed
  const baseWFC = createBaseWFC({ seed });
  
  // Store constraints on the base WFC's _geoState
  const geoConstraints = constraints;
  
  // Override get() to apply constraints before generation
  const originalGet = baseWFC.get.bind(baseWFC);
  function constrainedGet(x, z) {
    const gx = x + CONFIG.wfc.originLocal[0];
    const gz = z + CONFIG.wfc.originLocal[1];
    const cx = gx >> 3;
    const cz = gz >> 3;
    // Apply constraints to this chunk before getting it
    if (geoConstraints) {
      applyConstraintsToChunk(baseWFC, cx, cz, geoConstraints);
    }
    return baseWFC.get(x, z);
  }
  
  // Override peek() to use constrained get
  const originalPeek = baseWFC.peek.bind(baseWFC);
  function constrainedPeek(x, z) {
    const gx = x + CONFIG.wfc.originLocal[0];
    const gz = z + CONFIG.wfc.originLocal[1];
    const cx = gx >> 3;
    const cz = gz >> 3;
    if (geoConstraints) applyConstraintsToChunk(baseWFC, cx, cz, geoConstraints);
    return baseWFC.peek(x, z);
  }
  
  // Override ensureRegion
  const originalEnsureRegion = baseWFC.ensureRegion.bind(baseWFC);
  function constrainedEnsureRegion(cx, cz, r) {
    // Pre-generate all chunks in region with constraints
    const c0x = (cx - r + CONFIG.wfc.originLocal[0]) >> 3;
    const c1x = (cx + r + CONFIG.wfc.originLocal[0]) >> 3;
    const c0z = (cz - r + CONFIG.wfc.originLocal[1]) >> 3;
    const c1z = (cz + r + CONFIG.wfc.originLocal[1]) >> 3;
    for (let z = c0z; z <= c1z; z++) {
      for (let x = c0x; x <= c1x; x++) {
        if (geoConstraints) applyConstraintsToChunk(baseWFC, x, z, geoConstraints);
      }
    }
    return baseWFC.ensureRegion(cx, cz, r);
  }
  
  return {
    ...baseWFC,
    get: constrainedGet,
    peek: constrainedPeek,
    ensureRegion: constrainedEnsureRegion,
    _geoConstraints: geoConstraints,
    _baseWFC: baseWFC
  };
}
