# Paper Trails Laramie — Desktop Review Build Instructions

## Overview
This repository contains the original Paper Trails engine with Laramie geographic constraints integrated. The Laramie mode uses real GIS data from historic downtown Laramie, Wyoming to drive world generation while preserving all original Paper Trails rendering, paper folding, and gameplay mechanics.

**Repository**: `/home/clawman/papertrails-laramie-original/`  
**Upstream Source**: https://github.com/xikhar/papertrails (cloned, not forked)

---

## Requirements

| Requirement | Version |
|-------------|---------|
| Node.js | 18+ (tested on 22.23.2) |
| npm | 9+ |
| OS | Linux, macOS, or Windows with WebGL2 support |
| GPU | Discrete or integrated GPU with WebGL2 drivers |

**Note**: Raspberry Pi 5 ARM64 has a WebGL driver limitation causing context loss. Use a desktop/laptop for review.

---

## Installation

```bash
# Clone the repository (if not already present)
git clone https://github.com/xikhar/papertrails papertrails-laramie-original
cd papertrails-laramie-original

# Install dependencies
npm install

# Build for production
npm run build
```

---

## Launch Commands

### Original Paper Trails Baseline
```bash
npm run dev
# Opens at http://localhost:5173 (or next available port)
# Or use production build:
npm run preview
# Opens at http://localhost:4173
```

### Laramie Geographic Mode
```bash
npm run dev
# Then navigate to:
http://localhost:5173/index-laramie.html?laramie=1&seed=7

# Or production build:
npm run preview
# Then navigate to:
http://localhost:4173/index-laramie.html?laramie=1&seed=7
```

**URL Parameters:**
- `laramie=1` — Enables geographic constraints
- `seed=7` — Fixed seed for reproducible downtown layout
- `quality=high|med|low` — Render quality (default: high)
- `mute=1` — Disable procedural audio

---

## Key Files Changed (Core Engine)

| File | Purpose |
|------|---------|
| `src/world/wfc.js` | 128-bit domain bitmask (4th word `domEx2`); geographic constraint integration in `plan()` and `computeWeights()` |
| `src/core/models.js` | Added sockets `rail=3`, `crossing=4`; added tiles `rail_straight`, `rail_corner`, `crossing`, `depot` |
| `src/world/tiles.js` | Updated `SOCKET_CODE`, `UNIVERSAL_TILES`, `biomeMultiplier` for new tiles |
| `src/core/config/wfc.js` | Added weights for 4 new tiles (all = 1.0) |
| `src/main.js` | Added `window.__debug` global (temporary, for diagnosis only) |

---

## New Files (Laramie Geographic Constraints)

| File | Purpose |
|------|---------|
| `src/geo/constraints.js` | GIS loading, coordinate conversion, constraint conversion (streets, railways, buildings, landmarks, parks, crossings, sidewalks) |
| `src/geo/laramieWfc.js` | WFC wrapper for geographic constraints |
| `src/main-laramie.js` | Laramie entry point |
| `index-laramie.html` | Laramie HTML page |
| `public/gis/*.geojson` | 10 exported GIS layers (streets, intersections, crossings, buildings, landmarks, railways, parks, sidewalks, DEM samples) |

---

## Camera Fix in main.js

**Change**: `window.__debug = { ..., camera: follow.camera, ... }` (line 163)

**Why**: The original code used `camera` which was not in scope. The camera is accessed via `follow.camera` (the follow camera's Three.js PerspectiveCamera).

**Impact on Baseline**: **None** — This only adds a debug global for inspection. The original baseline at `index.html` is unchanged and uses the same camera access pattern throughout. The `follow.camera` reference is already used everywhere else in `main.js` (lines 142, 150, 153, 156, etc.).

---

## Verification Checklist

### Original Baseline Preserved
- [ ] `index.html` loads original Paper Trails
- [ ] All original tiles, biomes, WFC behavior intact
- [ ] Paper folding, traveller, camera, audio all work
- [ ] No modifications to `index.html` or baseline logic

### Laramie Mode Working
- [ ] `index-laramie.html?laramie=1&seed=7` loads constraints
- [ ] Console shows: `[Laramie] Constraints built: {streetChunks: 708, buildingCells: 399, landmarks: 13, railwayChunks: 371, parkCells: 2906}`
- [ ] Streets follow GIS centerlines
- [ ] Railway corridor uses `rail_straight`/`rail_corner` tiles (not river)
- [ ] Buildings placed at actual footprint centroids
- [ ] Verified landmarks get special tiles (depot, manor, church)
- [ ] Candidate landmarks flagged (not confirmed)
- [ ] Parks show biome boosts
- [ ] Crossings use new `crossing` socket

### Project Cleanliness
- [ ] Upstream source preserved in git history
- [ ] Phaser project at `/home/clawman/papertrails-laramie/` untouched
- [ ] GIS master data at `/home/clawman/gis-project/laramie/` untouched
- [ ] No development servers running
- [ ] No external uploads or deployments

---

## Expected Visual Result (Desktop)

On a desktop with WebGL2:
1. **Baseline** — Endless paper world with procedural villages, rivers, roads
2. **Laramie seed 7** — Historic downtown Laramie with:
   - Real street grid (2nd–5th St × Garfield–Custer)
   - UP railway corridor on 1st St (N-S)
   - 399 buildings at actual locations
   - 13 landmarks (6 verified, 4 candidate, 3 unverified excluded)
   - Depot at 600 S 1st St with custom `depot` tile
   - Paper folding, warm cardstock palette, procedural audio intact

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Black screen | Ensure WebGL2 support; try `quality=low`; check browser console for context loss |
| Constraints not loading | Verify `public/gis/*.geojson` files exist; check network tab |
| "camera not defined" | Ensure using latest `main.js` with `follow.camera` fix |
| Assets missing | Run `npm run build` first; check `dist/` output |

---

## Review Decision Points

After desktop review, approve or request changes for:
- [ ] Geographic accuracy of street/railway/building placement
- [ ] Landmark tile assignments (verified vs candidate)
- [ ] Visual fidelity of paper style with geographic constraints
- [ ] Performance at `quality=high`
- [ ] Expansion to full downtown area

---

**Ready for desktop review.** No deployment, no external services, no modifications to other projects.
