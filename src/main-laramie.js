// Laramie Adaptation — Paper Trails with Geographic Constraints
// Pop-up Atlas composition root with real-world geography from GIS data.
// URL params: ?seed=N  ?quality=low|med|high  ?mute=1  ?hint=0  ?night=1  ?life=0  ?animals=0
//            ?laramie=1  (enable Laramie geographic constraints)
//            ?diag=1    (enable diagnostic overlay)

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
const isLaramie = params.get('laramie') !== '0';
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
  // Also update status overlay for critical errors
  if (typeof laramieStatusEl !== 'undefined' && laramieStatusEl) {
    laramieStatusEl.textContent = '[ERROR] ' + msg;
    laramieStatusEl.style.borderColor = '#f44';
    laramieStatusEl.style.color = '#f44';
    laramieStatusEl.style.boxShadow = '0 0 20px #f44';
  }
}

function createDiagOverlay() {
  if (!enableDiag) return;
  const el = document.createElement('div');
  el.id = 'diag-overlay';
  el.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#0a0a0a;color:#0f0;font:11px/1.4 monospace;padding:8px;z-index:9999;max-height:50vh;overflow:auto;border-bottom:2px solid #0f0;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;';
  el.innerHTML = '<b>DIAGNOSTIC MODE</b> — initializing...';
  document.body.appendChild(el);
  diagOverlay = el;
  // Global error handlers
  window.addEventListener('error', (e) => {
    diagError('[UNCAUGHT]', e.message, e.filename, e.lineno, e.colno);
  });
  window.addEventListener('unhandledrejection', (e) => {
    diagError('[UNHANDLED REJECTION]', e.reason);
  });
  setInterval(() => {
    if (!diagOverlay) return;
    const lines = diagLogs.slice(-80).map(e => {
      const prefix = e.error ? '✗ ' : '✓ ';
      return prefix + e.msg;
    });
    diagOverlay.innerHTML = '<b>DIAGNOSTIC MODE</b> — frame: ' + (window.loop?.frame ?? '—') + '<br>' + lines.join('<br>');
  }, 200);
}

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

let laramieStatusEl = null;
function setLaramieStatus(msg, isError = false) {
  if (!laramieStatusEl) {
    laramieStatusEl = document.createElement('div');
    laramieStatusEl.style.cssText = 'position:fixed;top:10px;left:10px;z-index:10000;background:rgba(0,0,0,0.95);color:#0f0;padding:10px 14px;font:13px monospace;max-width:95vw;border-radius:6px;border:3px solid #0f0;box-shadow:0 0 20px #0f0;';
    document.body.appendChild(laramieStatusEl);
  }
  laramieStatusEl.textContent = msg;
  laramieStatusEl.style.borderColor = isError ? '#f44' : '#0f0';
  laramieStatusEl.style.color = isError ? '#f44' : '#0f0';
  laramieStatusEl.style.boxShadow = isError ? '0 0 20px #f44' : '0 0 20px #0f0';
}

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
  
  // Version indicator
  setLaramieStatus('Paper Trails Laramie v2026.11.25 — Loading assets...');
  diagLog('About to loadAssets...');
  let assets;
  try {
    assets = await loadAssets({ materials, renderer, quality });
    diagLog('loadAssets succeeded');
  } catch (e) {
    diagError('loadAssets FAILED:', e);
    throw e;
  }
  diagLog('assets loaded');
  setLaramieStatus('Paper Trails Laramie v2026.11.25 — Loading GIS data...');
  
  materials.setTextures(assets.textures);
  diagLog('materials textures set');
  
  const lights = createLights({ scene, quality });
  diagLog('lights created');

  // Load geographic constraints for Laramie
  let wfc;
  let laramieConstraints = null;
  
  if (isLaramie) {
    setLaramieStatus('[LARAMIE] Loading geographic constraints...');
    console.log('[LARAMIE DEBUG] Loading geographic constraints...');
    diagLog('[Laramie] Loading geographic constraints...');
    try {
      laramieConstraints = await buildLaramieConstraints();
      diagLog('[Laramie] buildLaramieConstraints succeeded');
      setLaramieStatus('[LARAMIE] Constraints loaded ✓');
      console.log('[LARAMIE DEBUG] Constraints loaded, creating geographic WFC...');
      diagLog('[Laramie] Constraints loaded, creating geographic WFC...');
      wfc = createLaramieWFC({ seed, constraints: laramieConstraints });
      diagLog('[Laramie] createLaramieWFC succeeded');
      setLaramieStatus('[LARAMIE] Geographic WFC created ✓');
      console.log('[LARAMIE DEBUG] Geographic WFC created');
      diagLog('[Laramie] Geographic WFC created');
    } catch (err) {
      diagError('[Laramie] buildLaramieConstraints FAILED:', err);
      setLaramieStatus('[LARAMIE] FAILED: ' + (err?.message || err), true);
      console.error('[LARAMIE DEBUG] Failed to load constraints:', err);
      diagError('[Laramie] Failed to load constraints:', err);
      diagLog('[Laramie] Falling back to base WFC');
      wfc = createWFC({ seed });
    }
  } else {
    wfc = createWFC({ seed });
    diagLog('Base WFC created');
  }
  diagLog('WFC ready');

  let world;
  try { diagLog('START createWorld'); world = createWorld({ scene, assets, wfc, materials, quality }); diagLog('SUCCESS createWorld'); }
  catch (e) { diagError('createWorld threw:', e); throw e; }
  diagLog('world created');

  let traveller;
  try { diagLog('START createTraveller'); traveller = createTraveller({ scene, assets, world, materials }); diagLog('SUCCESS createTraveller'); }
  catch (e) { diagError('createTraveller threw:', e); throw e; }
  diagLog('traveller created');

  let follow;
  try { diagLog('START createFollowCamera'); follow = createFollowCamera({ aspect: window.innerWidth / Math.max(1, window.innerHeight) }); diagLog('SUCCESS createFollowCamera'); }
  catch (e) { diagError('createFollowCamera threw:', e); throw e; }
  diagLog('follow camera created');

  let controls;
  try { diagLog('START createControls'); controls = createControls({ domElement: canvas, camera: follow.camera, traveller }); diagLog('SUCCESS createControls'); }
  catch (e) { diagError('createControls threw:', e); throw e; }
  diagLog('controls created');

  let views;
  try { diagLog('START createViews'); views = createViews({ follow }); diagLog('SUCCESS createViews'); }
  catch (e) { diagError('createViews threw:', e); throw e; }
  diagLog('views created');

  let post;
  try { diagLog('START createPost'); post = createPost({ renderer, scene, camera: follow.camera, quality }); diagLog('SUCCESS createPost'); }
  catch (e) { diagError('createPost threw:', e); throw e; }
  diagLog('post-processing created');

  let audio;
  try { diagLog('START createPaperAudio'); audio = createPaperAudio({ muted }); diagLog('SUCCESS createPaperAudio'); }
  catch (e) { diagError('createPaperAudio threw:', e); throw e; }
  diagLog('audio created');

  let music;
  try { diagLog('START createMusic'); music = createMusic({ audio }); diagLog('SUCCESS createMusic'); }
  catch (e) { diagError('createMusic threw:', e); throw e; }
  diagLog('music created');

  let daynight;
  try { diagLog('START createDayNight'); daynight = createDayNight({ scene, night: params.get('night') === '1' }); diagLog('SUCCESS createDayNight'); }
  catch (e) { diagError('createDayNight threw:', e); throw e; }
  diagLog('daynight created');

  let life;
  try { diagLog('START createLife'); life = params.get('life') === '0' || CONFIG.life.enabled === false ? null : createLife({ scene, assets, wfc, world, daynight, camera: follow.camera, quality, seed }); diagLog('SUCCESS createLife'); }
  catch (e) { diagError('createLife threw:', e); throw e; }
  diagLog('life created:', !!life);

  let animals;
  try { diagLog('START createAnimals'); animals = params.get('animals') === '0' || CONFIG.animals.enabled === false ? null : createAnimals({ scene, renderer, world, wfc, traveller, daynight, assets, seed, quality }); diagLog('SUCCESS createAnimals'); }
  catch (e) { diagError('createAnimals threw:', e); throw e; }
  diagLog('animals created:', !!animals);

  let game;
  try { diagLog('START createGame'); game = createGame({ scene, renderer, world, wfc, traveller, follow, controls, lights, post, daynight, music, audio, life, assets, materials, seed, quality }); diagLog('SUCCESS createGame'); }
  catch (e) { diagError('createGame threw:', e); throw e; }
  diagLog('game created');
  
  follow.setAssistGate(game.modal);
  diagLog('assist gate set');

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
  diagLog('plainDepth material set');

  const idle = { x: 0, z: 0 };
  const _right = new THREE.Vector3();

  function update(dt) {
    try {
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
      game.atlasmap.render();
      if (enableDiag && loop.frame < 5) diagLog('render frame', loop.frame, 'OK');
    } catch (e) {
      diagError('render threw:', e);
      throw e;
    }
  }

  const loop = createLoop({ update, render });
  diagLog('loop created');

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
  diagLog('animals ready');
  
  resize();
  diagLog('resize done');
  
  // Laramie: spawn at reference pin (First Interstate Bank area)
  // First Interstate Bank is at PT tile (44, 59) in world coords
  // Spawn on the street south of the bank
  let spawnX = 0, spawnZ = 0;
  if (isLaramie) {
    // Reference point: First Interstate Bank at PT (44, 59) = world (88, 118)
    // Spawn slightly south on the street (3rd St)
    spawnX = 88;
    spawnZ = 138; // ~10 tiles south of bank
    if (!world.isWalkable(spawnX, spawnZ)) {
      const [x, z] = initialPosition();
      spawnX = x; spawnZ = z;
    }
  } else {
    [spawnX, spawnZ] = initialPosition();
  }
  diagLog('spawn position:', spawnX, spawnZ);
  
  traveller.teleport(spawnX, spawnZ);
  diagLog('traveller teleported');
  setLaramieStatus('[LARAMIE] Ready — Downtown Laramie loaded');
  
  controls.clearTarget();
  diagLog('controls cleared');
  
  update(0);
  diagLog('update(0) done');
  
  follow.snap(traveller);
  diagLog('follow snapped');
  
  _right.setFromMatrixColumn(follow.camera.matrixWorld, 0);
  const rl = hypot2(_right.x, _right.z) || 1;
  state.listener.rightX = _right.x / rl; state.listener.rightZ = _right.z / rl;
  diagLog('listener init done');
  
  if (world.faceCamera) world.faceCamera();
  diagLog('faceCamera done');
  
  if (life) life.update(0, traveller.position, follow.camera);
  diagLog('life update(0) done');
  
  lights.update(0, traveller, follow.camera);
  diagLog('lights update(0) done');
  
  render(0);
  diagLog('render(0) done — FIRST FRAME');
  
  loop.start();
  diagLog('loop.start() called — ANIMATION LOOP STARTED');
}

boot().catch((err) => {
  diagError('[atlas] boot failed', err);
  console.error('[atlas] boot failed', err);
  throw err;
});
