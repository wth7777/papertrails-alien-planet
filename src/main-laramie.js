// Laramie Adaptation — Paper Trails with Geographic Constraints
// Pop-up Atlas composition root with real-world geography from GIS data.
// URL params: ?seed=N  ?quality=low|med|high  ?mute=1  ?hint=0  ?night=1  ?life=0  ?animals=0
//            ?laramie=1  (enable Laramie geographic constraints)

import * as THREE from 'three';
import { CONFIG, QUALITY, TILE_SIZE } from './core/config.js';
import { bus } from './core/events.js';
import { state } from './core/state.js';
import { createLoop } from './core/loop.js';
import { loadAssets } from './assets/loader.js';
import { createWFC } from './world/wfc.js';
import { createWorld } from './world/world.js';
import { createTraveller } from './player/traveller.js';
import { createControls } from './player/controls.js';
import { createFollowCamera } from './camera/follow.js';
import { createRenderer } from './render/renderer.js';
import { createLights } from './render/lights.js';
import { createPost } from './render/post.js';
import { createMaterials } from './render/materials.js';
import { createPaperAudio } from './audio/paper.js';
import { createMusic } from './audio/music.js';
import { createDayNight } from './render/daynight.js';
import { createLife } from './life/life.js';
import { createAnimals } from './life/animals.js';
import { createGame } from './game/index.js';
import { createViews } from './camera/views.js';
import { createLaramieWFC } from './geo/laramieWfc.js';
import { buildLaramieConstraints } from './geo/constraints.js';

const hypot2 = (a, b) => Math.sqrt(a * a + b * b);

const params = new URLSearchParams(location.search);
const seedParam = parseInt(params.get('seed') ?? '', 10);
const seed = Number.isFinite(seedParam) ? seedParam : CONFIG.DEFAULT_SEED;
const quality = QUALITY[params.get('quality')] ? params.get('quality') : CONFIG.DEFAULT_QUALITY;
const muted = params.get('mute') === '1';
const showHint = params.get('hint') !== '0';
const isLaramie = params.get('laramie') === '1';

state.seed = seed;
state.quality = quality;

async function boot() {
  const canvas = document.getElementById('atlas');
  const hint = document.getElementById('hint');

  const scene = new THREE.Scene();
  const { renderer, setSize: setRendererSize } = createRenderer({ canvas, quality });
  const materials = createMaterials({ quality });
  const assets = await loadAssets({ materials, renderer, quality });
  materials.setTextures(assets.textures);
  const lights = createLights({ scene, quality });

  // Load geographic constraints for Laramie
  let wfc;
  let laramieConstraints = null;
  
  if (isLaramie) {
    console.log('[Laramie] Loading geographic constraints...');
    try {
      laramieConstraints = await buildLaramieConstraints();
      console.log('[Laramie] Constraints loaded, creating geographic WFC...');
      wfc = createLaramieWFC({ seed, constraints: laramieConstraints });
    } catch (err) {
      console.warn('[Laramie] Failed to load constraints, falling back to base WFC:', err);
      wfc = createWFC({ seed });
    }
  } else {
    wfc = createWFC({ seed });
  }

  const world = createWorld({ scene, assets, wfc, materials, quality });
  const traveller = createTraveller({ scene, assets, world, materials });
  const follow = createFollowCamera({ aspect: window.innerWidth / Math.max(1, window.innerHeight) });
  const controls = createControls({ domElement: canvas, camera: follow.camera, traveller });
  const views = createViews({ follow });
  const post = createPost({ renderer, scene, camera: follow.camera, quality });
  const audio = createPaperAudio({ muted });
  const music = createMusic({ audio });
  const daynight = createDayNight({ scene, night: params.get('night') === '1' });
  const life = params.get('life') === '0' || CONFIG.life.enabled === false ? null : createLife({ scene, assets, wfc, world, daynight, camera: follow.camera, quality, seed });
  const animals = params.get('animals') === '0' || CONFIG.animals.enabled === false ? null : createAnimals({ scene, renderer, world, wfc, traveller, daynight, assets, seed, quality });
  const game = createGame({ scene, renderer, world, wfc, traveller, follow, controls, lights, post, daynight, music, audio, life, assets, materials, seed, quality });
  follow.setAssistGate(game.modal);

  window.addEventListener('keydown', (e) => {
    if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.code === 'KeyN') daynight.toggle();
    else if (e.code === 'KeyV' && !game.modal()) views.next();
    else if (e.code === 'KeyM') music.toggle();
    else if (e.code === 'KeyL' && isLaramie) {
      // L: Toggle Laramie debug overlay
      console.log('[Laramie] Active tiles:', world.activeTiles().length);
      console.log('[Laramie] Traveller pos:', traveller.position.x.toFixed(1), traveller.position.z.toFixed(1));
      console.log('[Laramie] Biome:', world.biomeAt(traveller.position.x, traveller.position.z));
      console.log('[Laramie] Surface:', world.surfaceAt(traveller.position.x, traveller.position.z));
    }
  });

  const plainDepth = new THREE.MeshDepthMaterial();
  scene.traverse((o) => { if (o.isMesh && !o.isBatchedMesh && !o.isInstancedMesh && o.castShadow && !o.customDepthMaterial) o.customDepthMaterial = plainDepth; });

  const idle = { x: 0, z: 0 };
  const _right = new THREE.Vector3();

  function update(dt) {
    state.time = loop.time;
    state.frame = loop.frame;
    const input = controls.getInput(dt) || idle;
    traveller.update(dt, game.modal() ? idle : input);
    const p = traveller.position;
    const t = state.traveller;
    t.x = p.x; t.y = p.y; t.z = p.z;
    t.dirX = traveller.moveDir.x; t.dirZ = traveller.moveDir.z; t.speed = traveller.speed;
    _right.setFromMatrixColumn(follow.camera.matrixWorld, 0);
    const rl = hypot2(_right.x, _right.z) || 1;
    state.listener.x = p.x; state.listener.z = p.z;
    state.listener.rightX = _right.x / rl; state.listener.rightZ = _right.z / rl;
    world.update(dt, p, traveller.moveDir);
    views.update(dt);
    follow.update(dt, traveller);
    daynight.update(dt);
    if (life) life.update(dt, p, follow.camera);
    if (animals) animals.update(dt);
    game.update(dt);
    lights.update(dt, traveller, follow.camera);
    materials.update(dt);
  }

  function render(dt) {
    post.setFocus(follow.focusPoint);
    post.render(dt);
    game.atlasmap.render();
  }

  const loop = createLoop({ update, render });

  function resize() {
    const w = Math.max(1, window.innerWidth);
    const h = Math.max(1, window.innerHeight);
    setRendererSize(w, h);
    follow.setAspect(w / h);
    post.setSize(w, h);
    bus.emit('resize', { width: w, height: h, dpr: renderer.getPixelRatio() });
  }
  window.addEventListener('resize', resize);

  if (showHint) {
    hint.classList.add('on');
    bus.once('input:first', () => hint.classList.remove('on'));
  } else hint.remove();

  function initialPosition() {
    const x = 0; const z = 0;
    if (world.isWalkable(x, z)) return [x, z];
    for (let r = 0.25; r <= TILE_SIZE * 3; r += 0.25) {
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        const nx = x + Math.cos(a) * r;
        const nz = z + Math.sin(a) * r;
        if (world.isWalkable(nx, nz)) return [nx, nz];
      }
    }
    return [x, z];
  }

  if (animals) await animals.ready;
  resize();
  
  // Laramie: spawn at reference pin (First Interstate Bank area)
  let spawnX = 0, spawnZ = 0;
  if (isLaramie) {
    // Reference pin is at (0,0) in PT coords = First Interstate Bank
    // Spawn slightly south on the street
    spawnX = 0;
    spawnZ = 20; // ~10 tiles south
    if (!world.isWalkable(spawnX, spawnZ)) {
      const [x, z] = initialPosition();
      spawnX = x; spawnZ = z;
    }
  } else {
    [spawnX, spawnZ] = initialPosition();
  }
  
  traveller.teleport(spawnX, spawnZ);
  controls.clearTarget();
  update(0);
  follow.snap(traveller);
  _right.setFromMatrixColumn(follow.camera.matrixWorld, 0);
  const rl = hypot2(_right.x, _right.z) || 1;
  state.listener.rightX = _right.x / rl; state.listener.rightZ = _right.z / rl;
  if (world.faceCamera) world.faceCamera();
  if (life) life.update(0, traveller.position, follow.camera);
  lights.update(0, traveller, follow.camera);
  render(0);
  loop.start();
}

boot().catch((err) => {
  console.error('[atlas] boot failed', err);
  throw err;
});
