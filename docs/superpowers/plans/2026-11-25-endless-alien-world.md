# Endless Alien World — Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Turn the original Paper Trails endless pop-up-book engine into a complete alien planet: alien tile families in every biome slot, alien palettes/weather/creatures, the lime-green hairy alien traveller, mobile-friendly, deployed to its own GitHub Pages repo. The WFC/chunk-streaming/book engine is reused 1:1 — no structural engine changes.

**Spec:** User message 2026-11-25 "Project: Paper Trails — Endless Alien World" (9 phases). Research report delivered in chat before implementation (Phase 8 requirement).

**Key research facts (verified this session):**
- Engine already endless: 8x8 chunk WFC from (seed, chunk coords), LRU 2048 chunks, tiles rise/fold/pool around traveller (REVEAL 3 / FOLD 4.25 / DESPAWN 6 tiles), spawn budget 4/update, origin rebase at 512u.
- Biome ids are internal: 'heartland','desert','snow','blossom','pinewood' (+broken 6th 'alien' from prior session). Strategy: keep the 5 slots, replace CONTENT (tiles/weights/tints/weather/animals). No renames.
- Alien models from prior session have WRONG biome tables (B(10,5,5,5,5) -> banned in 'alien', boosted in heartland). Must fix.
- Loader merges ./models/alien_tiles.glb by node name automatically (loader.js loadAssets). New models need no loader change.
- WFC imports BUILDING_OPTION_INDICES from geo/constraints.js (optional per-tile; undefined -> skipped). Decouple to a core table.
- wfc weights: CONFIG.wfc.weights[id] ?? 1 (config/wfc.js). Set 0 for classic content tiles; keep connectors (path_*, river_straight/corner/source, bridge) and FALLBACK 'meadow' alive.
- MODELS max 256 solver options (currently ~50 models -> fine).
- Blender pipeline: tools/blender/alien_tiles.py pattern; node `modelid__base` flat XZ at y=0, flaps `modelid__part`, extras {hinge:true,foldAngle:+-PI/2,delay,layer} via inject_hinges.js, export_yup=False, vertex colors, one material.
- Build: `npm run build` (Vite, entries main=index.html ORIGINAL + laramie=index-laramie.html). Verify with node logic tests + GLB inspection; visual QA = user on Android (browser tool wedges under WebGL loop).

## Global Constraints

- Do NOT touch: main branch history, phase0-baseline tag, gh-pages-deploy branch, src/main-laramie.js, src/geo/* (except removing the wfc import), the live wth7777/papertrails-laramie-3d deployment.
- Branch: `alien-planet` off main. All work there.
- TILE_SIZE=2; tile prototype in [-1,-1]..[1,1] XZ at y=0; TRAVELLER_HEIGHT=0.6.
- MODELS biomes schema: key present + entry missing = banned; no biomes key = everywhere x1.
- wfc.js must never lose: connectors unbanned, FALLBACK solvable, <=256 options.
- `npm run build` must pass after every task.
- No Math.random/Date in world-gen code paths (hash2 only).

## Alien world design (biome slots -> alien identities)

| internal id | alien identity | ground tint | prop tint | signature tiles (new) |
|---|---|---|---|---|
| heartland | Homeglade (start) | teal-green moss | warm glow | alien_meadow, alien_grove, alien_stones, pod_dwelling, glowpool |
| desert | Crystal Wastes | lavender sand | cyan/violet | crystal_field_a/b, crystal_spire, ruin_arch, glass_dunes |
| snow | Ashveil | bone white | blue-grey | ash_cones, frost_moss, bone_spire |
| blossom | Bloomveld | plum-magenta | biolum pink/cyan | bloom_orchard, bulb_patch, lantern_flower |
| pinewood | Spirewood | deep indigo | dark teal + glow | spire_forest_a/b, giant_mushroom, fallen_spire |

## Task Structure

### Task 0: Isolation + baseline (Stage 0)
- [ ] `git checkout -b alien-planet` off main; confirm `npm run build` passes on the branch (baseline).
- [ ] Record baseline: dist size, option count (node script printing OPTIONS.length), build time.

### Task 1: Decouple geo import (Stage 1a)
- [ ] Move BUILDING_OPTION_INDICES (only what wfc.js reads) into src/world/buildingOptions.js (or inline into wfc.js); update import in wfc.js. `src/geo/` untouched otherwise.
- [ ] Build passes; option count unchanged.

### Task 2: Remove the broken 6th biome (Stage 1b)
- [ ] Revert biomes.js to 5 slots (remove 'alien' index 5 + its fixed sites). Keep models alien_* registered but re-key their biome tables (Task 3).
- [ ] Remove 'alien' entries from config/life.js weather + config/animals.js spawns; fold those densities into the five slots.
- [ ] Node test: BIOMES.length===5, biomeIndexAt deterministic, biomeWeights sums to 1.

### Task 3: Content re-target (Stage 1c)
- [ ] config/wfc.js weights: 0 for classic content tiles (forest, grove, hills, rocks, pond, windmill, house, village*, house_N, manor*, desert_*, snow_*, blossom_*, deep_pines, mushroom_glade, fallen_log, watchtower, church, barn_farm, market_square, alien_* old four). Keep >0: meadow (fallback), meadow_flowers?, path_*, river_straight/corner/source, bridge, lantern_post.
- [ ] models.js: fix alien_* biome tables; add new alien model ids (Task 5 GLBs land later; register now with weights so staging is testable with placeholders? NO -> register in same task as GLB to avoid placeholder-only tiles in build).
- [ ] config/world.js: rewrite biomeTint per the alien palette table (+water palette keys). ponds: keep desert_oasis/frozen_pond ids valid.
- [ ] config/life.js: alien weather per slot (dust/gusts/mist/fireflies/spore-fall reusing existing particle kinds: leaves->spores via tint, butterflies 0, birds 0).
- [ ] config/animals.js: alien creature set (cat/lizard/owl/duck variants + tint) mapped to new tiles once registered (Task 5/6).
- [ ] Node tests: for each of 5 biomes, sum of allowed option weights > 0; connectors allowed in every biome; OPTIONS.length <= 256.
- [ ] `npm run build` + vite preview smoke (curl index + bundle 200).

### Task 4: Alien GLB wave 1 (Stage 2)
- [ ] Extend tools/blender/alien_tiles.py (new file alien_tiles_w1.py preferred): 8-10 models: alien_meadow, alien_grove, alien_stones, pod_dwelling, glowpool, crystal_field_a, crystal_field_b, crystal_spire, spire_forest_a, spire_forest_b.
- [ ] Hinge contract per flap (extras via inject_hinges.js), vertex colours per palette, poly budget: tile <= ~3.5k tris, whole GLB <= ~1.5MB.
- [ ] Register ids in models.js (sockets/tags/biomes) + config/wfc.js weights/rotations + life/animals entries.
- [ ] Merge into public/models/alien_tiles.glb; node test: every new id present as top node with __base child + hinge extras on flaps.
- [ ] Build + preview + curl alien_tiles.glb 200.

### Task 5: Alien GLB wave 2 (Stage 3)
- [ ] Models: ruin_arch, ruin_wall, giant_mushroom, fallen_spire, bulb_patch, lantern_flower, bone_spire, ash_cones, frost_moss, glass_dunes (+ tune wave-1 weights from QA).
- [ ] Same registration + tests + build.

### Task 6: Polish + mobile (Stage 4)
- [ ] index.html title/meta/social wording -> alien theme (keep Papertrails lineage in description).
- [ ] Default quality for mobile: keep ?quality= param; consider DEFAULT_QUALITY 'high' but verify low-tier bake sizes; DOF/post unchanged.
- [ ] Pick showcase seed (default seed 7 keep; verify start area reads Homeglade + visible variety within 20 tiles walk via node biome dump).
- [ ] Full node test suite re-run; build.

### Task 7: Deploy (Stage 5)
- [ ] Create repo wth7777/papertrails-alien-planet (gh repo create); push dist/ to gh-pages via git push with credential from existing helper (token never in URL/logs).
- [ ] Enable Pages (source gh-pages /); verify: index 200, bundle 200, tiles.glb 200, alien_tiles.glb 200, traveller.glb 200.
- [ ] Report live URL for user Android QA (Stage 6 = user).

## Review Focus
- OPTIONS.length must stay <= 256 after every registration.
- Every biome slot must keep >=1 allowed content tile + connectors + fallback meadow.
- biomeTint heartland MUST stay identity ({} ground/prop) — book.js relies on identity start look; alien look comes from content+tints of OTHER slots only... UNLESS we decide start slot tint; keep identity to honor the frozen comment.
- No classic content tile may remain reachable (weights 0) — else human cottages appear on the alien planet.
- inject_hinges.js must run after every Blender export (Blender does not export extras).
