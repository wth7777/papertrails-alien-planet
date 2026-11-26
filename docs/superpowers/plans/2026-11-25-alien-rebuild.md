# Alien World Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace everything except the procedural generation engine with alien content: round green cute alien player, zero earth animals, alien world.

**Architecture:** Keep the WFC/chunk streaming/pop-up book engine 100%. Replace: traveller model + animation system, animal system, player controller, camera. The world generation (20 alien models across 5 biomes) stays.

**Tech Stack:** Three.js, Vite, Blender for new models, existing engine modules.

**Spec:** User request - "round green cute alien as player", "no earth animals", "alien world to explore", keep generation engine.

## Global Constraints
- Do NOT modify: WFC (world/wfc.js), chunk streaming (world/world.js), pop-up book (world/book.js), fold maths (world/fold.js), BatchedMesh pipeline
- Do NOT modify: biome Voronoi (core/biomes.js), tile catalogue structure (world/tiles.js)
- Alien world generation (20 models, 5 biomes) already done - keep it
- Branch: alien-planet, original repo untouched

## Review Focus
1. Player is round green alien (not paper cutout with hair strands)
2. Zero earth animals spawn (cats/lizards/owls removed entirely)
3. Player walks/runs/jumps in 3D with proper third-person camera
4. Alien world generates and streams correctly
5. Mobile touch controls work

---

### Task 1: Create Round Green Alien Player Model (Blender)

**Files:**
- Create: `tools/blender/alien_player.py`
- Output: `public/models/alien_player.glb`

**Interfaces:**
- Produces: GLB with single root node `alien_player`, parts: `body`, `head`, `eye_l`, `eye_r`, `antenna_l`, `antenna_r`, `leg_l`, `leg_r`, `arm_l`, `arm_r`
- All parts parented to root, origin at feet (y=0), height ~0.6 world units

- [ ] **Step 1: Write Blender script for round green alien**
  - Body: sphere ~0.5 diameter, lime green vertex color
  - Head: smaller sphere on top, same color
  - Eyes: two white/black small spheres on head front
  - Antennae: two thin curved tubes on top of head
  - Legs: two short cylinders, feet slightly flattened
  - Arms: two short cylinders at sides
  - Export: GLB, `export_yup=False`, vertex colors, one material

- [ ] **Step 2: Run Blender script**
  ```bash
  blender --background --python tools/blender/alien_player.py
  ```

- [ ] **Step 3: Verify GLB structure**
  ```bash
  python3 -c "import struct,json; f=open('public/models/alien_player.glb','rb'); ..."  # check node names
  ```

- [ ] **Step 4: Commit**

---

### Task 2: New Player Controller (3D Movement)

**Files:**
- Create: `src/player/alienPlayer.js`
- Modify: `src/main.js` (swap createTraveller → createAlienPlayer)
- Delete: `src/player/traveller.js` (or keep unused)

**Interfaces:**
- Consumes: `{ scene, assets, world }` from main.js
- Produces: `{ position, update(dt, input), teleport(x,z), getHeight() }`
- Input: `{ x, z }` normalized direction vector (from controls)

- [ ] **Step 1: Write alienPlayer.js**
  - Load `alien_player.glb` model
  - Simple 3D movement: velocity, acceleration, max speed, friction
  - Jump: upward impulse, gravity, ground check via world.heightAt()
  - Rotation: smooth turn toward move direction
  - No paper cutout animation - just model rotation/translation
  - Bob animation while walking (subtle up/down)

- [ ] **Step 2: Update main.js to use alienPlayer**
  - Import createAlienPlayer
  - Replace createTraveller call
  - Pass same parameters

- [ ] **Step 3: Test build**
  ```bash
  npm run build
  ```

- [ ] **Step 4: Commit**

---

### Task 3: Remove Earth Animals Completely

**Files:**
- Modify: `src/core/config/animals.js` (empty spawns, disable)
- Modify: `src/life/animals.js` (early return if disabled)
- Modify: `src/main.js` (don't create animals)

**Interfaces:**
- animals config: `{ enabled: false, spawns: {} }`
- animals module: returns null immediately if disabled

- [ ] **Step 1: Disable animals in config**
  - Set `enabled: false`
  - Clear all spawns tables

- [ ] **Step 2: Make animals.js early-return null**
  - Check `config.animals.enabled` at start

- [ ] **Step 3: Remove animals creation from main.js**
  - Comment out createAnimals call
  - Remove animals from update loop

- [ ] **Step 4: Verify no animal code runs**
  - Build + check bundle size reduced

- [ ] **Step 5: Commit**

---

### Task 4: Update Camera for 3D Third-Person

**Files:**
- Modify: `src/camera/follow.js` (adjust for 3D player height, smoother follow)

**Interfaces:**
- Consumes: player position + velocity
- Produces: camera position/rotation

- [ ] **Step 1: Adjust follow camera**
  - Target point: player position + small offset up (0.3)
  - Distance: ~4-5 units back, 2-3 units up
  - Smooth interpolation (lerp)
  - Look-at target

- [ ] **Step 2: Test camera feels good**

- [ ] **Step 3: Commit**

---

### Task 5: Build, Deploy, Verify

**Files:**
- Build output: `dist/`

- [ ] **Step 1: Full build**
  ```bash
  npm run build
  ```

- [ ] **Step 2: Deploy to GitHub Pages**
  - Push dist to wth7777/papertrails-alien-planet gh-pages

- [ ] **Step 3: Verify live**
  - index.html 200
  - Bundle 200
  - alien_tiles.glb 200
  - alien_player.glb 200
  - tiles.glb 200

- [ ] **Step 4: Visual QA checklist**
  - [ ] Round green alien visible
  - [ ] Alien walks/runs/jumps
  - [ ] Camera follows smoothly
  - [ ] Alien world generates (Homeglade, Crystal Wastes, etc.)
  - [ ] No earth animals anywhere
  - [ ] Touch controls work on mobile

- [ ] **Step 5: Commit deployment**