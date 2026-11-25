# Alien World — Biome + Assets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a 6th 'alien' biome to the Paper Trails engine and populate it with polished alien asset families (dwellings, landmarks, crystals, river/path tiles) plus alien-specific weather and creatures, so the alien world feels complete, surprising, and alive.

**Architecture:** Extend biomes.js with a 6th biome (site-based Voronoi like the others), author 5 new alien tile models in Blender with the exact flap/hinge contract the loader requires, register them in models.js (MODELS table + biomes weights) and wfc.js (base weights), add alien entries to life.js (weather densities) and animals.js (spawns), merge alien_tiles.glb into the loader's prototype registry, then build and verify.

**Tech Stack:** Blender 4.3 (headless GLB export), Node.js (GLB post-processing for hinge extras), three.js/Vite game engine, JS config files.

**Spec:** User request — build alien biome and assets, polished quality. No design doc exists; this plan is the spec.

## Global Constraints

- TILE_SIZE = 2 world units; a tile prototype occupies roughly [-1,-1]..[1,1] on XZ at y=0.
- TRAVELLER_HEIGHT = 0.6 world units; feet at y=0.
- Vertex colours drive the shared paper material — author meshes white, paint COLORS.
- One material per glb; the loader swaps in materials.paper() and colours by vertex colour.
- Top-level node per model, named exactly by model id; child named `modelid__base` (flat face in XZ plane at y=0); hinged flaps as children named `modelid__<part>` (vertical cards, bottom edge = hinge).
- Export with `export_format='GLB', export_yup=False` so Blender's Y maps to three.js Y (upright).
- Post-process GLB with inject_hinges.js to add `extras: {hinge:true, foldAngle, delay, layer}` to every flap node — Blender does NOT export custom properties to glTF `extras`.
- Hinge data must live in glTF `extras` per flap node (`{hinge:true, foldAngle:<rad>, delay:0..1, layer:int}`).
- Every flap must have foldAngle = sign * PI/2; delay spaces the ripple; layer sets the flap stack order.
- BIOMES array order matters: BIOME_INDEX maps index->name; siteBiome uses fixed neighbours at origin (heartland=0, desert=1 east, snow=2 west, blossom=3 south, pinewood=4 north). 'alien' must be index 5.
- The WFC uses CONFIG.wfc.weights[id] x MODELS[id].biomes[cell biome] x field factors; no `biomes` key = allowed everywhere with multiplier 1.
- `npm run build` must succeed after every asset or engine change.
- Visual QA needs a real browser; the browser tool wedges under the active WebGL loop. Verify deterministically (GLB structure, node names, hinge extras, build success) and report visual QA honestly.

## Review Focus

- Biome 'alien' not found by BIOME_INDEX / findBiome → life.js and animals.js would break at runtime. Test: `biomeIndexAt(seed, cx, cz)` returns 5 for alien sites.
- Alien model in MODELS but missing node in alien_tiles.glb → loader falls back to placeholder silently. Test: `stats.source` reflects 'gltf' and prototype lookup succeeds for each alien model id.
- Hinge foldAngle not PI/2 or missing 'base' child → tile won't rise/fold correctly. Test: every alien model node has a `__base` child and every non-base child has hinge extras.
- Alien life density missing from life.js biomes table → `L.biomes['alien']` undefined, treated as 0 (no weather). Test: life.js biomes table has 'alien' key.
- Alien animals missing from animals.js spawns → no creatures in alien biome. Test: spawns['alien'] exists for alien_dwelling etc.

## Task Structure

### Task 1: Add 'alien' biome to biomes.js

**Files:**
- Modify: `src/core/biomes.js:14-33` (BIOMES, BIOME_INDEX, siteBiome)

**Interfaces:**
- Consumes: nothing (pure config)
- Produces: BIOMES=['heartland','desert','snow','blossom','pinewood','alien'], BIOME_INDEX with alien:5, siteBiome returns 5 for alien Voronoi sites

- [ ] **Step 1: Write the failing test**

```js
import { BIOMES, BIOME_INDEX, biomeAt } from './src/core/biomes.js';
assert(BIOMES.includes('alien'), 'alien in BIOMES');
assert(BIOME_INDEX.alien === 5, 'alien index is 5');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --input-type=module <test-file>`
Expected: FAIL — 'alien' not in BIOMES / BIOME_INDEX.alien undefined

- [ ] **Step 3: Implement the alien biome in biomes.js**

Add 'alien' to BIOMES, BIOME_INDEX.alien = 5, and siteBiome returns 5 for a set of alien Voronoi sites (jittered like other biomes, not at origin neighbors).

- [ ] **Step 4: Run test to verify it passes**

Run: same test command
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/core/biomes.js
git commit -m "feat(alien): add alien biome to biomes.js"
```

### Task 2: Create alien_dwelling tile model (Blender)

**Files:**
- Create: `tools/blender/alien_dwelling.py`
- Modify: `public/models/alien_tiles.glb` (add alien_dwelling model)

**Interfaces:**
- Consumes: nothing
- Produces: alien_tiles.glb containing alien_dwelling (base + hinged flaps: walls, roof, door flap)

- [ ] **Step 1: Write Blender script**

Create `tools/blender/alien_dwelling.py` following the papertrails-blender-asset-pipeline contract (base in XZ plane, hinged flaps, vertex colors, export_yup=False).

- [ ] **Step 2: Run Blender export**

Run: `blender --background --python tools/blender/alien_dwelling.py`
Expected: EXPORTED message, alien_tiles.glb updated (or created if first)

- [ ] **Step 3: Inject hinge extras**

Run: `node tools/blender/inject_hinges.js`
Expected: flaps of alien_dwelling get `{hinge:true, foldAngle:PI/2, delay, layer}` extras

- [ ] **Step 4: Verify GLB structure**

Run: node script to parse alien_tiles.glb, check alien_dwelling has `__base` child and flaps have hinge extras
Expected: PASS — base present, hinges present on all flaps

### Task 3: Create alien_landmark tile model (Blender)

**Files:**
- Create: `tools/blender/alien_landmark.py`
- Modify: `public/models/alien_tiles.glb`

**Interfaces:**
- Consumes: nothing
- Produces: alien_landmark model added to alien_tiles.glb

- [ ] **Step 1: Write Blender script** — alien_landmark.py
- [ ] **Step 2: Run Blender export**
- [ ] **Step 3: Inject hinge extras**
- [ ] **Step 4: Verify GLB structure**

### Task 4: Create alien_crystal tile model (Blender)

**Files:**
- Create: `tools/blender/alien_crystal.py`
- Modify: `public/models/alien_tiles.glb`

**Interfaces:**
- Consumes: nothing
- Produces: alien_crystal model (low blocker, crystalline spikes)

- [ ] **Step 1: Write Blender script** — alien_crystal.py
- [ ] **Step 2: Run Blender export**
- [ ] **Step 3: Inject hinge extras**
- [ ] **Step 4: Verify GLB structure**

### Task 5: Create alien_river tile model (Blender)

**Files:**
- Create: `tools/blender/alien_river.py`
- Modify: `public/models/alien_tiles.glb`

**Interfaces:**
- Consumes: nothing
- Produces: alien_river model (water sockets N-S/E-W)

- [ ] **Step 1: Write Blender script** — alien_river.py
- [ ] **Step 2: Run Blender export**
- [ ] **Step 3: Inject hinge extras**
- [ ] **Step 4: Verify GLB structure**

### Task 6: Register alien models in models.js + wfc.js + loader

**Files:**
- Modify: `src/core/models.js` (add 4 MODELS entries with biomes weights)
- Modify: `src/core/config/wfc.js` (add 4 base weights)
- Modify: `src/assets/loader.js` (already merges alien_tiles.glb — verify)

**Interfaces:**
- Consumes: alien_tiles.glb node names (alien_dwelling, alien_landmark, alien_crystal, alien_river)
- Produces: MODELS entries with sockets/tags/biomes; wfc.js weights; loader already merges alienGltf

- [ ] **Step 1: Add MODELS entries** — sockets all-grass or path/river as appropriate, biomes table with alien dominance
- [ ] **Step 2: Add wfc.js weights** — alien_dwelling: 3.0, alien_landmark: 2.0, alien_crystal: 2.0, alien_river: 1.5
- [ ] **Step 3: Verify loader merge** — confirm loader.js already merges alienGltf.scene children into byName (done in prior turn)
- [ ] **Step 4: Build and verify** — `npm run build` exits 0

### Task 7: Add alien biome to life.js weather table

**Files:**
- Modify: `src/core/config/life.js` (add 'alien' entry to biomes table)

**Interfaces:**
- Consumes: nothing
- Produces: life.biomes.alien with alien-appropriate weather densities

- [ ] **Step 1: Add alien life table** — leaves, dust, gusts, fireflies, butterflies, clouds, birds appropriate for alien world
- [ ] **Step 2: Build and verify** — `npm run build` exits 0

### Task 8: Add alien biome to animals.js spawns table

**Files:**
- Modify: `src/core/config/animals.js` (add 'alien' key to spawns with alien_dwelling/alien_landmark/alien_crystal rows)

**Interfaces:**
- Consumes: alien model ids from models.js
- Produces: animals.spawns.alien with creature spawns per alien tile model

- [ ] **Step 1: Add alien spawns** — cats, lizards, strange creatures on alien tiles
- [ ] **Step 2: Build and verify** — `npm run build` exits 0

### Task 9: Final build + verification

**Files:**
- None (verification only)

**Interfaces:**
- Consumes: all prior task outputs
- Produces: build output, verification evidence

- [ ] **Step 1: Run full build** — `npm run build`
Expected: exit 0, 67 modules transformed
- [ ] **Step 2: Run all JS syntax checks** — `node --check` on all modified src files
Expected: all pass
- [ ] **Step 3: Verify GLB structure** — all 4 alien models have base + hinge extras
Expected: PASS
- [ ] **Step 4: Commit** — all changes in one commit

## Self-Review

1. **Spec coverage:** Alien biome (Task 1), alien dwelling/landmark/crystal/river assets (Tasks 2-5), registration (Task 6), alien weather (Task 7), alien creatures (Task 8). All covered.
2. **Step scan:** Each task has a test step with expected output; no step carries more than one action.
3. **Type consistency:** Model ids match between Blender scripts, models.js, wfc.js, and life.js/animals.js spawns.
4. **Review Focus:** All five failure modes have tasks with tests.
5. **Proportion:** Plan is proportional to the spec — 9 tasks for biome + 4 asset families + life + animals + build.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-11-25-alien-biome-assets.md`. The user has already explicitly supplied inline execution ("I authorize both so no need to check back until both have been done"), so I will use superpowers:executing-plans (Native) and implement every task myself in this session, then one final whole-branch review at the end.
