// Pop-up Atlas composition root.
// URL params: ?seed=N  ?quality=low|med|high  ?mute=1  ?hint=0  ?night=1  ?life=0  ?diag=1
import * as THREE from 'three';
import { CONFIG, QUALITY, TILE_SIZE } from './core/config.js';
import { bus } from './core/events.js';
import { state } from './core/state.js';
import { createLoop } from './core/loop.js';
import { loadAssets } from './assets/loader.js';
import { createWFC } from './world/wfc.js';
import { createWorld } from './world/world.js';
import { createAlienPlayer } from './player/alienPlayer.js';
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
// Allocation-free two-dimensional length.
const hypot2 = (a, b) => Math.sqrt(a * a + b * b);

const params = new URLSearchParams(location.search);
const seedParam = parseInt(params.get('seed') ?? '', 10);
const seed = Number.isFinite(seedParam) ? seedParam : CONFIG.DEFAULT_SEED;
const quality = QUALITY[params.get('quality')] ? params.get('quality') : CONFIG.DEFAULT_QUALITY;
const muted = params.get('mute') === '1';
const showHint = params.get('hint') !== '0';
const enableDiag = params.get('diag') === '1';

// ---- Diagnostic Overlay (mobile-readable, enabled by ?diag=1) -------------------------------
let diagOverlay = null;
let diagLogs = [];
const MAX_DIAG_LOGS = 200;
let diagStep = 0;

function diagLog(...args) {
  const msg = args.map(a => (a && a.stack ? a.stack : String(a))).join(' ');
  const entry = { t: Date.now(), step: ++diagStep, msg };
  diagLogs.push(entry);
  if (diagLogs.length > MAX_DIAG_LOGS) diagLogs.shift();
  if (enableDiag) console.log('[DIAG]', ...args);
}

function diagError(...args) {
  const msg = args.map(a => (a && a.stack ? a.stack : String(a))).join(' ');
  const entry = { t: Date.now(), step: ++diagStep, msg, error: true };
  diagLogs.push(entry);
  if (diagLogs.length > MAX_DIAG_LOGS) diagLogs.shift();
  if (enableDiag) console.error('[DIAG]', ...args);
}

function createDiagOverlay() {
  if (!enableDiag) return;
  const el = document.createElement('div');
  el.id = 'diag-overlay';
  el.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#0a0a0a;color:#0f0;font:11px/1.4 monospace;padding:8px;z-index:9999;max-height:50vh;overflow:auto;border-bottom:2px solid #0f0;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;';
  el.innerHTML = '<b>DIAGNOSTIC MODE</b> — initializing...';
  document.body.appendChild(el);
  diagOverlay = el;
  // Update overlay every 200ms
  setInterval(() => {
    if (!diagOverlay) return;
    const lines = diagLogs.slice(-80).map(e => {
      const prefix = e.error ? '✗ ' : '✓ ';
      return prefix + e.msg;
    });
    diagOverlay.innerHTML = '<b>DIAGNOSTIC MODE</b> — frame: ' + (window.loop?.frame ?? '—') + '<br>' + lines.join('<br>');
  }, 200);
}

// Global error handlers
window.addEventListener('error', (e) => {
  const msg = e.error?.stack || e.message || 'Script error.';
  const loc = e.filename ? `${e.filename}:${e.lineno}:${e.colno}` : ':0';
  diagError('Uncaught error:', msg, 'at', loc);
});
window.addEventListener('unhandledrejection', (e) => {
  const reason = e.reason;
  const msg = reason?.stack || reason?.message || String(reason);
  diagError('Unhandled rejection:', msg);
});

state.seed = seed;
state.quality = quality;

async function boot() {
  createDiagOverlay();
  diagLog('boot() started');
  
  const canvas = document.getElementById('atlas');
  const hint = document.getElementById('hint');
  diagLog('canvas & hint elements:', !!canvas, !!hint);

  const scene = new THREE.Scene();
  diagLog('THREE.Scene created');
  
  const { renderer, setSize: setRendererSize } = createRenderer({ canvas, quality });
  diagLog('renderer created');
  
  const materials = createMaterials({ quality });
  diagLog('materials created');
  
  const assets = await loadAssets({ materials, renderer, quality });
  diagLog('assets loaded');
  
  materials.setTextures(assets.textures);
  diagLog('materials textures set');
  
  const lights = createLights({ scene, quality });
  diagLog('lights created');
  
  const wfc = createWFC({ seed });
  diagLog('WFC created');
  
  const world = createWorld({ scene, assets, wfc, materials, quality });
    diagLog('world created');

    const alienPlayer = createAlienPlayer({ scene, assets, world, materials });
    diagLog('alienPlayer created');

    const follow = createFollowCamera({ aspect: window.innerWidth / Math.max(1, window.innerHeight) });
    diagLog('follow camera created');

    const controls = createControls({ domElement: canvas, camera: follow.camera, traveller: alienPlayer });
    diagLog('controls created');
  
  const views = createViews({ follow }); // V cycles camera views
  diagLog('views created');
  
  const post = createPost({ renderer, scene, camera: follow.camera, quality });
  diagLog('post-processing created');
  
  const audio = createPaperAudio({ muted });
  diagLog('audio created');
  
  const music = createMusic({ audio });
  diagLog('music created');
  
  const daynight = createDayNight({ scene, night: params.get('night') === '1' });
    diagLog('daynight created');

    // ambient life + weather (leaves, snow, rain, birds, chimney smoke, fireflies ...): 2 draw calls; ?life=0 disables it
        const life = params.get('life') === '0' || CONFIG.life.enabled === false ? null : createLife({ scene, assets, wfc, world, daynight, camera: follow.camera, quality, seed });
        diagLog('life created:', !!life);

        // living animals - alien creatures on alien tiles (cats, lizards, owls, ducks)
        const animals = createAnimals({ scene, assets, wfc, world, daynight, camera: follow.camera, quality, seed });
        diagLog('animals created:', !!animals);

    // Gameplay progress is saved independently for each world seed.
    const game = createGame({ scene, renderer, world, wfc, traveller: alienPlayer, follow, controls, lights, post, daynight, music, audio, life, animals, assets, materials, seed, quality });
    diagLog('game created');

    follow.setAssistGate(game.modal);
    diagLog('assist gate set');
  // N: day / night, M: music on / off (keys only - no on-screen UI)
  window.addEventListener('keydown', (e) => {
    if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.code === 'KeyN') daynight.toggle();
    else if (e.code === 'KeyV' && !game.modal()) views.next();
    else if (e.code === 'KeyM') music.toggle();
  });

  // The tiles cast shadows through BatchedMeshes, everything else through plain meshes.
  // three uses ONE internal depth material for all shadow casters and re-derives its whole program-parameter
  // set whenever the object class flips (batched <-> plain) - twice per frame, ~6 kB of garbage each frame.
  // A second, identical depth material for the plain meshes removes the flip.
  const plainDepth = new THREE.MeshDepthMaterial();
  scene.traverse((o) => { if (o.isMesh && !o.isBatchedMesh && !o.isInstancedMesh && o.castShadow && !o.customDepthMaterial) o.customDepthMaterial = plainDepth; });

  // ---- one simulation tick (order is part of the contract) ------------------------------------
    const idle = { x: 0, z: 0 };
    const _right = new THREE.Vector3();

    function update(dt) {
          try {
            state.time = loop.time;
            state.frame = loop.frame;
            const input = controls.getInput(dt) || idle;
            alienPlayer.update(dt, game.modal() ? idle : input); // No walking while the atlas page is open.
            const p = alienPlayer.position;
            const t = state.traveller;
            t.x = p.x; t.y = p.y; t.z = p.z;
            t.dirX = alienPlayer.moveDir.x; t.dirZ = alienPlayer.moveDir.z; t.speed = alienPlayer.speed;
            _right.setFromMatrixColumn(follow.camera.matrixWorld, 0);
            const rl = hypot2(_right.x, _right.z) || 1;
            state.listener.x = p.x; state.listener.z = p.z;
            state.listener.rightX = _right.x / rl; state.listener.rightZ = _right.z / rl;
            world.update(dt, p, alienPlayer.moveDir);
                        views.update(dt);
                        follow.update(dt, alienPlayer);
                        daynight.update(dt);
                        if (life) life.update(dt, p, follow.camera);
                        if (animals) animals.update(dt);
                        game.update(dt);
            lights.update(dt, alienPlayer, follow.camera);
            materials.update(dt);
            if (enableDiag && loop.frame < 5) diagLog('update frame', loop.frame, 'OK');
          } catch (e) {
            diagError('update threw:', e);
            throw e;
          }
        }

    function render(dt) {
      try {
        post.setFocus(follow.focusPoint);
        post.render(dt);
        game.atlasmap.render(); // Drawn over the finished frame; no-op while closed.
        if (enableDiag && loop.frame < 5) diagLog('render frame', loop.frame, 'OK');
      } catch (e) {
        diagError('render threw:', e);
        throw e;
      }
    }

    const loop = createLoop({ update, render });
    diagLog('loop created');

    // ---- resize -----------------------------------------------------------------------------------
    function resize() {
      const w = Math.max(1, window.innerWidth);
      const h = Math.max(1, window.innerHeight);
      setRendererSize(w, h);
      follow.setAspect(w / h);
      post.setSize(w, h);
      bus.emit('resize', { width: w, height: h, dpr: renderer.getPixelRatio() });
    }
    window.addEventListener('resize', resize);

    // ---- hint (the only on-screen text) -----------------------------------------------------------
    if (showHint) {
      hint.classList.add('on');
      bus.once('input:first', () => hint.classList.remove('on'));
    } else hint.remove();

    // Find a safe initial position without skipping the opening fold animation.
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

    // ---- start ------------------------------------------------------------------------------------------
    if (animals) await animals.ready;
    diagLog('animals ready');
  
    resize();
    diagLog('resize done');
  
    const [x, z] = initialPosition();
        diagLog('initial position:', x, z);

        alienPlayer.teleport(x, z);
        diagLog('alienPlayer teleported');

        controls.clearTarget();
        diagLog('controls cleared');

        update(0);
        diagLog('update(0) done');

        follow.snap(alienPlayer);
        diagLog('follow snapped');

        _right.setFromMatrixColumn(follow.camera.matrixWorld, 0);
        const rl = hypot2(_right.x, _right.z) || 1;
        state.listener.rightX = _right.x / rl; state.listener.rightZ = _right.z / rl;
        diagLog('listener init done');

        if (world.faceCamera) world.faceCamera();
        diagLog('faceCamera done');

        if (life) life.update(0, alienPlayer.position, follow.camera);
        diagLog('life update(0) done');

        lights.update(0, alienPlayer, follow.camera);
        diagLog('lights update(0) done');
  
    render(0);
    diagLog('render(0) done — FIRST FRAME');
  
    window.__debug = { loop, game, traveller: alienPlayer, world, wfc, renderer, scene, camera: follow.camera, assets, materials, post, follow, controls, views, lights, audio, music, daynight, life, animals, state };
        diagLog('__debug exposed');
  
    loop.start();
    diagLog('loop.start() called — ANIMATION LOOP STARTED');
  }

boot().catch((err) => {
  diagError('[atlas] boot failed', err);
  console.error('[atlas] boot failed', err);
  throw err;
});
