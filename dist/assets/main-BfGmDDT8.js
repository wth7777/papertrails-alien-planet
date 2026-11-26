import { $ as ShapeGeometry, A as LinearSRGBColorSpace, B as PerspectiveCamera, C as Group, D as InstancedMesh, E as InstancedBufferAttribute, F as MeshDepthMaterial, G as RGBAFormat, H as PlaneGeometry, I as MeshLambertMaterial, J as RepeatWrapping, K as RawShaderMaterial, L as MeshStandardMaterial, M as Matrix4, N as Mesh, O as LinearFilter, P as MeshBasicMaterial, Q as Shape, R as NearestFilter, S as GLSL3, T as HemisphereLight, U as PointLight, V as Plane, W as Quaternion, X as Scene, Y as SRGBColorSpace, Z as ShaderMaterial, _ as DepthTexture, a as BatchedMesh, at as Vector2, b as Float32BufferAttribute, c as BufferAttribute, ct as WebGLArrayRenderTarget, d as CanvasTexture, et as Sphere, f as CircleGeometry, g as DepthFormat, h as DataTexture, i as AmbientLight, it as UnsignedIntType, j as MathUtils, k as LinearMipmapLinearFilter, l as BufferGeometry, lt as WebGLRenderTarget, m as Color, n as ShaderChunk, nt as TextureLoader, o as Box3, ot as Vector3, p as ClampToEdgeWrapping, q as Raycaster, r as WebGLRenderer, rt as UnsignedByteType, s as BoxGeometry, st as Vector4, t as GLTFLoader, tt as SphereGeometry, u as Camera, v as DirectionalLight, w as HalfFloatType, x as Frustum, y as DynamicDrawUsage, z as OrthographicCamera } from "./vendor-CzDHDeUL.js";
// \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
// \0vite/modulepreload-polyfill.js
(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
})();
// src/core/config/shared.js
var shared_exports = /* @__PURE__ */ __exportAll({
	DEFAULT_QUALITY: () => DEFAULT_QUALITY,
	DEFAULT_SEED: () => 7,
	DESPAWN_RADIUS: () => 6,
	FLAP_LAYER_GAP: () => FLAP_LAYER_GAP$1,
	FOLD_BACK_RADIUS: () => FOLD_BACK_RADIUS$1,
	PATH_WIDTH: () => PATH_WIDTH$1,
	REVEAL_RADIUS: () => 3,
	RIVER_WIDTH: () => RIVER_WIDTH$1,
	TILE_SIZE: () => 2,
	TRAVELLER_HEIGHT: () => TRAVELLER_HEIGHT
});
/** Tiles beyond this distance (behind the traveller) fold back flat. Between the two radii: keep state (hysteresis). */
var FOLD_BACK_RADIUS$1 = 4.25;
/** Width (world units) of a path / river where it crosses a tile edge, centred on the edge midpoint. */
var PATH_WIDTH$1 = .5;
var RIVER_WIDTH$1 = .7;
/** Y gap between stacked folded-flat paper layers: a flap of layer L has its hinge at y = FLAP_LAYER_GAP * (L + 1). */
var FLAP_LAYER_GAP$1 = .004;
/** Traveller height in world units (feet at y = 0). */
var TRAVELLER_HEIGHT = .6;
var DEFAULT_QUALITY = "high";
// src/core/config/wfc.js
var wfc = {
	window: 3,
	pathDensity: .28,
	riverRowPeriod: 7,
	bridgeDensity: .3,
	/** Chunk edge in cells. FIXED at 8 in wfc.js (the hand-laid start around cell (0,0) assumes it). */
	chunk: 8,
	/** Local coordinates of world cell (0,0) inside its chunk, so the start is in a chunk interior. */
	originLocal: [3, 4],
	/** Chunks kept in memory before the oldest are evicted (regenerated identically on demand). 2048 chunks = 131k cells. */
	maxChunks: 2048,
	/** Full attempts (new plan + new collapse) per chunk before the stub fallback. The last `strictAttempts` forbid side lanes. */
	maxAttempts: 10,
	strictAttempts: 3,
	/** Backtracks allowed inside one attempt before it is abandoned and restarted. */
	maxBacktracks: 48,
	/** Mean distance between neighbouring rivers, in chunks, measured across the flow. */
	riverSpacing: 2.7,
	/** Max tilt (radians) of the general flow direction away from west-east; seeded. */
	riverTilt: .75,
	/** Low-frequency warp of the river lines: amplitude (chunks) and period (chunks). */
	riverWarp: 1.4,
	riverWarpPeriod: 4.5,
	/** In-chunk course: longest straight run (cells), cost noise (meander strength), cost of a bend. */
	riverMaxRun: 4,
	riverNoise: 3,
	riverTurnCost: .9,
	/** Brooks (spring -> short stream) in river-less chunks: chance per chunk, min end-to-end span, min length. */
	brookChance: .3,
	brookMinSpan: 5,
	brookMinLen: 6,
	roadExtra: .18,
	/** Chance that a road through a chunk (two crossings) detours via a waypoint (longer, windier roads). */
	roadDetour: .25,
	/** Chance that a chunk with four road crossings joins them in one crossroads (else T-junctions). */
	crossroads: .85,
	roadMaxRun: 4,
	roadNoise: 1.6,
	roadTurnCost: 1.8,
	/** Extra routing cost for a road stepping onto a river cell (a bridge). Low = roads like to cross. */
	bridgeCost: .6,
	/** Straight runs allowed by the validator: touching a chunk border / anywhere (cells). 4 + 4 <= 8 across a seam. */
	maxBorderRun: 4,
	maxInnerRun: 6,
	forestPeriod: 10,
	hillPeriod: 12,
	/** Hill field threshold (smoothstep lo / hi on the value noise). Composition pass: 0.42 / 0.6 -> 0.47 / 0.64 = clusters of 2-4 hill tiles instead of 6 x 7 blocks. */
	hillLo: .47,
	hillHi: .64,
	/** A landmark tile within this many cells (Chebyshev) of another landmark in the chunk is strongly discouraged (x0.12). */
	landmarkSpacing: 3,
	/** integrator (round 3): within startNear cells (Chebyshev) of the start cell, hamlet tiles (village family) weigh x startHamlet
	*  and ponds x startPond, so the first minutes show a hamlet and water. 0 / 1 switch it off. */
	startNear: 4,
	startHamlet: 3,
	startPond: 2,
	flowerPeriod: 5,
	settlePeriod: 9,
	spurBase: .05,
	spurSettle: .5,
	/** Chance factor for a lane to run on one more cell instead of ending at a house (lanes are at most 3 cells). */
	laneOn: .45,
	/**
	* ALIEN PLANET base weights per tile id (multiplied by biome / structure / adjacency factors in wfc.js).
	* weight 0 = banned everywhere (BW[t] x BMUL). The UNIVERSAL set (meadow + path/river/bridge connectors,
	* see world/tiles.js) must NEVER be zero: chunk solvability depends on them.
	* Earth content (cottages, churches, windmills, pines, cacti, camels' tiles ...) is retired at 0.
	*/
	weights: {
		meadow: 1.5,
		path_straight: 3,
		path_corner: 4,
		path_t: 1,
		path_cross: 1.4,
		path_end: 1.8,
		river_straight: 1,
		river_corner: 1,
		river_source: 1,
		bridge: 1,
		lantern_post: 1,
		meadow_flowers: .5,
		hills: .9,
		rocks: .8,
		desert_dunes: .8,
		desert_dunes_b: .8,
		desert_dunes_c: .8,
		desert_ruin: 1.4,
		snow_drifts: 1,
		mushroom_glade: 1.5,
		fallen_log: 1,
		watchtower: 1.6,
		alien_dwelling: 3,
		alien_landmark: 2,
		alien_crystal: 2,
		alien_meadow: 1.5,
		alien_grove: 1.2,
		alien_stones: 1,
		pod_dwelling: 2,
		glowpool: .8,
		crystal_field_a: 1.4,
		crystal_field_b: 1.2,
		crystal_spire: 1.8,
		spire_forest_a: 2,
		spire_forest_b: 1.8,
		ruin_arch: 1.5,
		ruin_wall: 1.2,
		glass_dunes: 1.1,
		giant_mushroom: 1.8,
		fallen_spire: 1.4,
		bulb_patch: 1.5,
		lantern_flower: 1.6,
		bone_spire: 1.7,
		ash_cones: 1.2,
		frost_moss: 1,
		alien_river: 1.5,
		forest: 0,
		grove: 0,
		pond: 0,
		windmill: 0,
		house: 0,
		village: 0,
		village_b: 0,
		village_green: 0,
		river_reeds: 0,
		rail_straight: 0,
		rail_corner: 0,
		crossing: 0,
		depot: 0,
		desert_cacti: 0,
		desert_camp: 0,
		desert_oasis: 0,
		desert_market: 0,
		snow_pines: 0,
		snow_cabin: 0,
		snow_hamlet: 0,
		frozen_pond: 0,
		blossom_orchard: 0,
		blossom_garden: 0,
		blossom_gazebo: 0,
		blossom_lane: 0,
		deep_pines: 0,
		church: 0,
		barn_farm: 0,
		market_square: 0,
		manor: 0,
		house_1: 0,
		house_2: 0,
		house_3: 0,
		manor_2: 0,
		manor_3: 0,
		city_hall: 0,
		masonic_temple: 0,
		st_matthews_cathedral: 0,
		first_interstate_bank: 0,
		albany_courthouse: 0,
		wyo_theatre: 0,
		laramie_fire_station: 0,
		durlacher_house: 0,
		blair_house: 0
	},
	/**
	* Allowed rotations for all-grass tiles (socketed tiles always use the rotation their sockets need).
	* The assets agent built trees / windmill as slot-together crosses and put small stand-ups on the diagonals
	* (LOG, ASSETS-BLENDER AB5; A9 min silhouette ratio 0.77 for these tiles), so nothing is limited.
	* To pin a tile to the default camera again, list fewer rotations here, e.g. hills: [0].
	*/
	rotations: {
		meadow: [
			0,
			1,
			2,
			3
		],
		meadow_flowers: [
			0,
			1,
			2,
			3
		],
		rocks: [
			0,
			1,
			2,
			3
		],
		pond: [
			0,
			1,
			3
		],
		hills: [0],
		forest: [
			0,
			1,
			2,
			3
		],
		grove: [
			0,
			1,
			2,
			3
		],
		windmill: [
			0,
			1,
			2,
			3
		],
		desert_dunes: [0, 2],
		desert_dunes_b: [0, 2],
		desert_dunes_c: [0, 2],
		desert_cacti: [
			0,
			1,
			2,
			3
		],
		desert_oasis: [
			0,
			1,
			2,
			3
		],
		desert_ruin: [0, 2],
		snow_pines: [
			0,
			1,
			2,
			3
		],
		snow_drifts: [0, 2],
		frozen_pond: [0],
		blossom_orchard: [
			0,
			1,
			2,
			3
		],
		blossom_garden: [
			0,
			1,
			2,
			3
		],
		deep_pines: [
			0,
			1,
			2,
			3
		],
		mushroom_glade: [
			0,
			1,
			2,
			3
		],
		fallen_log: [
			0,
			1,
			2,
			3
		],
		barn_farm: [
			0,
			1,
			2,
			3
		],
		alien_meadow: [
			0,
			1,
			2,
			3
		],
		alien_grove: [
			0,
			1,
			2,
			3
		],
		alien_stones: [
			0,
			1,
			2,
			3
		],
		crystal_field_a: [
			0,
			1,
			2,
			3
		],
		crystal_field_b: [
			0,
			1,
			2,
			3
		],
		spire_forest_a: [
			0,
			1,
			2,
			3
		],
		spire_forest_b: [
			0,
			1,
			2,
			3
		],
		ruin_arch: [
			0,
			1,
			2,
			3
		],
		ruin_wall: [
			0,
			1,
			2,
			3
		],
		glass_dunes: [
			0,
			1,
			2,
			3
		],
		giant_mushroom: [
			0,
			1,
			2,
			3
		],
		fallen_spire: [
			0,
			1,
			2,
			3
		],
		bulb_patch: [
			0,
			1,
			2,
			3
		],
		lantern_flower: [
			0,
			1,
			2,
			3
		],
		bone_spire: [
			0,
			1,
			2,
			3
		],
		ash_cones: [
			0,
			1,
			2,
			3
		],
		frost_moss: [
			0,
			1,
			2,
			3
		]
	}
};
// src/core/config/fold.js
var spring = {
	/** RISE: p'' = k (1 - p) - c p' at frequency scale 1. Light damping: the flap arrives at upright with speed. */
	stiffness: 62,
	damping: 5,
	/** Rise damping multiplier for the largest flaps (size >= sizeLarge; 1 at sizeSmall): big cards arrive faster -> more overshoot. */
	dampingLarge: .5,
	/** FALL: p'' = -k p - c p' - downPull (softer than the rise). */
	downStiffness: 10,
	downDamping: 4.5,
	downPull: 5,
	/** Fold-down anticipation: initial outward speed (1/s) of a flap that was resting upright (peaks ~2 deg past upright). */
	downAnticipation: 1.2,
	/** Total time span (s) over which flaps of one tile start, ordered by userData.delay (0..1). */
	staggerSpan: .34,
	/** A nested flap (V-fold strut, glue tab) starts at least this long after its parent flap (rise). */
	nestedLag: .02,
	/** Settled when |p - target| < eps (and velocities < eps * 10 /s) for every flap. 0.002 = 0.18 deg. */
	settleEps: .002,
	/** Fixed simulation step (s). update(dt) consumes dt in steps of exactly this size (accumulator + lerp). */
	maxStep: 1 / 240,
	/** Global multiplier on the secondary flutter amplitude (0 = rigid card). 0.06 is the calibrated default. */
	wobble: .06,
	/** Flutter multiplier for the largest flaps (1 at sizeSmall): trees / houses / the windmill quiver visibly at hero distance. */
	wobbleLarge: 2,
	/** Nested flap linkage: p'' = k (p_parent - p) + 2 z sqrt(k) (p_parent' - p'). Higher k = tighter (smaller lag). */
	nestedStiffness: 1500,
	nestedDamping: .8,
	nestedMaxAccel: 125,
	flutterHz: 4.5,
	flutterSizePower: 0,
	flutterDamping: .04,
	flutterDrag: 3.5,
	flutterFrictionLarge: 1.8,
	flutterFriction: 2.2,
	/** Small twist about the flap's long axis proportional to the flutter (rad per unit p); sign/size vary per flap. */
	twist: 1.1,
	sizeSmall: .12,
	sizeLarge: .7,
	freqSmall: 1.14,
	freqLarge: .88,
	/** Deterministic per-flap variation of the frequency scale (+-), so neighbours do not move in lockstep. */
	jitter: .03,
	restitution: .25,
	minBounceSpeed: .5,
	/** Safety cap on fixed steps consumed by one update call (dt is capped at 1/20 s by the loop anyway). */
	maxSubSteps: 30,
	wind: {
		enabled: true,
		/** Sway amplitude (deg, at wind strength 1) for the shortest / squattest and the tallest / thinnest flaps. */
		minDeg: .6,
		maxDeg: 2.2,
		/** Hard cap (deg) after the biome strength is applied. */
		limitDeg: 2.5,
		/** Below this amplitude (deg) a flap is left alone entirely (no matrix updates). */
		cutoffDeg: .08,
		/** Height (world units) and height / width ratio ranges that map to "short..tall" and "squat..thin". */
		tallLo: .25,
		tallHi: 1.25,
		thinLo: .7,
		thinHi: 1.9,
		/** Flutter rate (Hz) of small and of tall flaps (tall cards rock slower). */
		hzSmall: .8,
		hzLarge: .42,
		/** Twist about the card's long axis per rad of sway (so a swaying card is not a rigid board). */
		twist: .5,
		/** Name classes (regex on the flap name after the model prefix), tested in this order; unlisted names = x1.
		*  A flap can also carry userData.sway (multiplier) in the glb. */
		loose: "flag|banner|bunting|reed|cattail|grass|tuft|wheat|flower|palm|poplar|kite|laundry|willow|fern",
		looseMul: 1.3,
		rigid: "wall|roof|house|cottage|cabin|barn|church|manor|tower|mill|bridge|deck|arch|rail|well|rock|boulder|stone|dune|drift|hill|mound|cart|boat|bench|stall|crate|barrel|statue|snowman|igloo|gate|pier|dock|ruin|pillar|obelisk|pyramid|mesa|cliff|stump|log|chimney|door|step|stair|gable|front|side|back|ridge|hive|scarecrow|ziggurat|zig|gazebo|granary|greenhouse|fountain|column|pile|ice|nave|steeple|sled|pots|bale|block|picnic",
		rigidMul: .04,
		stiff: "fence|hedge|cactus|lantern|lamp|post|sign|mushroom|tent|hay|stack|sheep|cow|hen|camel|deer|fox|goat|horse|dog|cat|rabbit",
		stiffMul: .35,
		/** Wind strength per biome (blended with biomeWeights at the tile): desert gusty, pinewood still, snow gentle. */
		strength: {
			heartland: 1,
			desert: 1.35,
			snow: .6,
			blossom: .85,
			pinewood: .32
		},
		/** Gust field: two travelling sine fronts. Direction (deg from +X toward +Z), wavelength (world units), period (s). */
		directionDeg: 30,
		gustLength: 14,
		gustPeriod: 9,
		gust2Length: 8,
		gust2Period: 5.3,
		gustWarp: 1.7,
		/** Wavelength (world units) of the flutter phase along the wind: neighbours rock one after the other. */
		flutterLength: 5,
		/** Seconds for the sway to fade in after a tile settles upright / to relax away when it starts to fold. */
		fadeIn: 1.2,
		release: .22,
		/** Sway only tiles within this many tiles of the traveller (every risen tile is normally inside it). */
		radius: 5.5,
		/** Windmill sails: the triangles of a mesh whose name matches `spinMatch` and that lie at local z >= spinZMin
		*  (the sail layer stands proud of the tower card) are split off at load and turn about their own centre. */
		spinMatch: "(^|__)mill$",
		spinZMin: .012,
		spinSpeed: .5,
		spinGust: .35
	}
};
// src/core/config/world.js
var world = {
	/** The reveal circle is centred FORWARD_BIAS tiles ahead of the traveller along the movement direction. */
	forwardBias: 1.35,
	/** Grace area (world units): the traveller can move this far around the streaming anchor without anything rising or folding. */
	graceRadius: 1,
	/** integrator (round 3): share (%) of meadow / meadow_flowers cells whose hay rick / beehive stays down (hash per cell, same in
	*  world.js and the book.js print). Was 60 (default); at 60 two or three identical beehives stood side by side near the start. */
	hayDrop: 72,
	cards: {
		enabled: true,
		jitterDeg: 14,
		bush: 1.22,
		small: 1.3,
		prop: 1.15,
		tree: .86,
		reeds: .8,
		house: 1.3,
		houseRow: 1.34,
		crossDeg: 24,
		thin: 0,
		thinHouse: 0,
		collide: true
	},
	makeRoom: {
		enabled: false,
		leanDeg: 44,
		pitchDeg: 42,
		reach: 1.6,
		minAhead: .05,
		side: .08,
		width: .75,
		cover: .3,
		ease: .25
	},
	/** Max tile instances created per update (streaming budget). settle() ignores the budget. */
	spawnBudget: 4,
	/** Extra per-tile rise delay (s) per tile of distance from the traveller, so a ring ripples outward. */
	rippleDelay: .055,
	/** Radius (world units) of soft blockers (trees, houses) used by isWalkable. */
	blockerPadding: .06,
	/** Padding around LOW solid pieces (logs, boulders, fences, crates ...: tops between lowBlockMinHeight and blockMinHeight). */
	lowBlockerPadding: .04,
	lowBlockMinHeight: .2,
	/** Padding kept on a path strip (lamps / lane trees brush the strip; walls and doors still stop the traveller). */
	pathPadding: .03,
	/** Hollow shapes (cabins, prop rings) are filled solid: cells not reachable from the tile border at this padding. */
	fillEnclosed: true,
	fillPadding: .12,
	/** Nooks narrower than 2 x closeRadius between blocker cards (tree crosses, V pockets) are filled so nobody gets wedged; 0 = off. */
	closeRadius: .2,
	closePadding: .02,
	/** Props made of crossed cards (trees, cacti, tents) block over the convex hull of their cards, up to this footprint size. */
	hullFill: true,
	hullMaxSize: 1.1,
	/** Bridge: half width of the deck corridor whose ramp / deck geometry never counts as a blocker. */
	deckClearHalf: .24,
	/** true: world.debugPieces(model) lists every mesh with its blocking class (checks only). */
	debugPieces: true,
	/** Tiles within REVEAL_RADIUS * nearRadiusMul of the TRAVELLER rise too (so nothing next to you stays flat). */
	nearRadiusMul: 1.07,
	/** Extra distance (tiles) beyond REVEAL_RADIUS before a risen tile may fold back (hysteresis with FOLD_BACK_RADIUS). */
	foldHysteresis: .35,
	/** A risen tile may hang this far (world units) into the page margin before it is folded flat. */
	pageHysteresis: .5,
	/** Tiles more than this many rows BEHIND the (smoothed) heading fold flat, inside the frame's readable band. */
	foldBehind: 2.6,
	/** ... and only rise again when closer than foldBehind - this (rows), so a row does not flicker. */
	foldBehindHysteresis: .5,
	/** Extra fold-back delay (s) per tile of sideways distance from the traveller's track (the row closes outward). */
	foldBehindStagger: .07,
	/** A tile this close (tiles) to the traveller may rise again at once, ignoring minFlipInterval. */
	reflipRadius: 1.75,
	/** Time constant (s) of the heading low-pass used for the forward bias. */
	dirSmooth: .3,
	/** A tile's target may flip at most once per this many seconds (except next to the traveller / at the page edge). */
	minFlipInterval: 2,
	/** Tiles are pre-spawned (hidden, flat) and their print "inks in" this many tiles before they are told to rise. */
	inkLead: 1,
	/** +- random extra rise delay (s) per tile so a ring does not rise in perfect lockstep. */
	rippleJitter: .035,
	/** A still-flat tile the traveller is walking across waits up to this long (s) before it rises (flaps would swing through him). */
	riseHoldMax: .8,
	/** Hard cap of tiles that may START rising in one update (the rest wait a frame). */
	maxRisePerFrame: 6,
	/** Draw the per-tile `base` meshes (false: the book page shows the same baked print => fewer triangles, no pop). */
	renderBases: false,
	/** Blockers = geometry of upright flaps between these heights (world units); shorter pieces never block. */
	blockBandLo: .07,
	blockBandHi: .3,
	blockMinHeight: .45,
	/** Extra half-width (world units) added to river strips / pond radius for walkability. */
	waterPadding: .03,
	pondRadius: .62,
	/** Biome tiles with an off-centre pond: model id -> [u (east), v (south), radius] in the tile's rot-0 frame. */
	ponds: {
		desert_oasis: [
			.12,
			.16,
			.48
		],
		frozen_pond: [
			.08,
			.2,
			.56
		]
	},
	/** Bridge deck: walkable half-width and height profile fallback when the model has no deck surface. */
	deckHalfWidth: .31,
	deckFallbackHeight: 0,
	deckMaxSlope: .36,
	/** BatchedMesh origin is re-based when the traveller is further than this from it (float precision far from 0). */
	rebaseDistance: 512,
	biomeTintEnabled: true,
	/** Biomes whose prop tint skips reeds, rocks, haystacks, fences, roofs, logs (they keep their heartland colours). */
	biomeTintKeep: {},
	biomeTint: {
		heartland: {
			ground: {
				tint: "#8fc4a8",
				amount: .82,
				gain: .5,
				lift: .78,
				keepWater: .7
			},
			prop: {
				hue: 90,
				sat: .72,
				tint: "#8fd8b4",
				amount: .38,
				gain: 1.1,
				lift: .32,
				keepWater: .6
			},
			path: {
				color: "#b2dcc2",
				edge: "#5e8f78",
				amount: .9,
				edgeAmount: .3
			}
		},
		desert: {
			ground: {
				tint: "#c9aee8",
				amount: .85,
				gain: .5,
				lift: .85,
				keepWater: .7
			},
			prop: {
				hue: -30,
				sat: .7,
				tint: "#a8dce8",
				amount: .4,
				gain: 1.15,
				lift: .35,
				keepWater: .6
			},
			path: {
				color: "#d8c2ee",
				edge: "#8f78b8",
				amount: .9,
				edgeAmount: .3
			}
		},
		snow: {
			ground: {
				sat: .45,
				tint: "#dfe4ea",
				amount: .9,
				gain: .18,
				lift: .87,
				keepWater: .4
			},
			prop: {
				hue: 190,
				sat: .5,
				tint: "#c2ccd8",
				amount: .34,
				gain: .75,
				lift: .65,
				keepWater: .4
			},
			path: {
				color: "#b0bac6",
				edge: "#8a94a2",
				amount: 1.9,
				edgeAmount: .3
			}
		},
		blossom: {
			ground: {
				hue: 45,
				sat: 1.15,
				tint: "#b07cc8",
				amount: .62,
				gain: 1.5,
				lift: .55,
				keepWater: .85
			},
			prop: {
				hue: -20,
				sat: 1.05,
				tint: "#ff9ad8",
				amount: .3,
				gain: 1.1,
				lift: .4,
				keepWater: .85
			},
			path: {
				color: "#d8b0e2",
				edge: "#9a68b2",
				amount: .7,
				edgeAmount: .3
			}
		},
		pinewood: {
			ground: {
				hue: 195,
				sat: .85,
				tint: "#3f5e66",
				amount: .68,
				gain: 1.55,
				lift: .5,
				keepWater: .65
			},
			prop: {
				hue: 150,
				sat: .9,
				tint: "#3f7266",
				amount: .4,
				gain: 1.45,
				lift: .38,
				mul: .94,
				keepWater: .65
			},
			path: {
				color: "#8fa89e",
				edge: "#3e5a50",
				amount: .8,
				edgeAmount: .3
			}
		}
	}
};
var book = {
	/** Page thickness look: number of visible stacked page signatures and their outward step (world units). */
	pageStackLayers: 8,
	pageStackStep: .06,
	/** Half extent (world units) of the page surface that follows the traveller (X = gutterPeriod tiles / 2). */
	pageHalfExtent: 26,
	/** Distance (tiles) between gutters/spines of the endless book along X (= width of the book window). */
	gutterPeriod: 7,
	/** Half depth (Z, world units) of the page. */
	halfDepth: 26,
	/** Cream unprinted margin (world units) along the page edges; tiles never rise on it. */
	margin: .7,
	/** Dead zone (world units): the book only slides once the traveller is this far from its centre. */
	slackX: .2,
	slackZ: .5,
	/** World X of gutter number 0 (must be on a tile seam: odd number). */
	gutterX0: -1,
	/** Gutter valley: half width, depth on the printed area, extra depth toward head/tail edge (world units). */
	gutterHalfWidth: .7,
	gutterDepth: .045,
	gutterEdgeDepth: .16,
	/** Shading strength of the valley (normal exaggeration) and of the broad page curvature toward the spine. */
	gutterShade: 3.2,
	/** shortfall fixer: strength of the dark fold line + valley shadow of the gutter (1 = as before the shortfall pass). */
	gutterDark: .32,
	pageCurve: .2,
	pageCurveWidth: 2,
	/** Thickness (world units) of the page block and the cover board; cover overhang beyond the block foot. */
	blockThickness: .25,
	coverThickness: .07,
	coverOverhang: .5,
	coverColor: "#6e3a26",
	/** Build page / block / cover from materials.paper() (same lighting as the tiles); false = private materials. */
	usePaperMaterial: true,
	/** Baked print atlas: pixels per tile for quality low / med / high. */
	bakeSize: {
		low: 256,
		med: 384,
		high: 512
	},
	/** How un-risen terrain looks: 0 = blank page, 1 = full ink. */
	fadedInk: .8,
	/** round 3 (page): full colour within fadeNear world units of the traveller, pencil-sketch look beyond fadeFar (soft, noise-warped). */
	fadeNear: 8,
	fadeFar: 13.5,
	/** ... and the flat print of pieces that have not risen: full colour inside printNear, a pencil plan (1 - printFade of the colour) beyond printFar. */
	printNear: 6.8,
	printFar: 9.6,
	printFade: .75,
	/** Seconds for a cell to ink in / fade out. */
	inkInTime: .45,
	inkOutTime: 1.3,
	/** Opacity of the printed twin of the folded-flat pieces that stays under a risen tile (0 = plain ground print). */
	twinGhost: 0,
	/** Tile seam crease: half width (world units) and darkness / emboss strength. */
	creaseWidth: .012,
	creaseDark: .04,
	creaseEmboss: .5,
	/** Fibre: world units per repeat of the page fibre maps, normal + albedo strength. */
	fibreScale: 2.5,
	fibreNormal: .55,
	fibreAlbedo: .8,
	/** Table: world units per repeat of the wood map; y is derived from the thicknesses. */
	tableScale: 6,
	tableGain: 1,
	/** Printed, animated water of rivers / ponds / oasis / ice. shoreBlur = bake-time blur of the shore mask (tile uv). */
	water: {
		enabled: true,
		shoreBlur: .1,
		ripple: .95,
		reflection: .9,
		caustic: .07,
		floaters: 1,
		flow: .17,
		streak: .85,
		mirror: {
			enabled: true,
			strength: .7
		}
	},
	/** Ground print: soft read of the baked print, hand-cut wobble, paper mottling, printed tufts, fainter seams. */
	groundPrint: {
		enabled: true,
		soften: 2.3,
		wobble: .011,
		mottle: .15,
		clumps: .7,
		seam: .06,
		path: 1,
		wobbleSlow: .016,
		flatten: .94,
		groundColor: "#a8a374",
		pathColor: "#ffd5b4",
		contact: .13,
		pathWorn: .17
	}
};
// src/core/config/player.js
var player = {
	speed: 1.15,
	runMul: 1.8,
	slowMul: .6,
	accel: 17,
	radius: .12,
	slideMin: .6,
	round: true,
	roundAfter: .3,
	roundMax: 4,
	roundSpeed: .8,
	stallFlipSteps: 24,
	turnRate: 13,
	stepLength: .35,
	hopHeight: .02,
	arriveRadius: .12,
	legSwingDeg: 34,
	armSwingDeg: 22,
	holdArmFactor: .22,
	staffArmFactor: .4,
	leanDeg: 3.5,
	leanHz: 3.4,
	leanDamping: .75,
	turnLeanDeg: 4,
	turnLeanGain: .035,
	waddleDeg: 1.6,
	twistDeg: 2.2,
	headNodDeg: 1.8,
	torsoLagDeg: 1.8,
	secondaryLag: 1.2,
	hatLag: .7,
	gaitRate: 16,
	idleSwayDeg: .9,
	idleHz: .32,
	lanternHz: 1.5,
	lanternDamping: .22,
	lanternDrive: .03,
	lanternGaitDeg: 5,
	lanternMaxDeg: 28,
	heightRate: 45,
	targetStuckTime: 1.2,
	targetNoProgressTime: 1,
	routeCell: .15,
	routeSpan: 12,
	targetProbe: .45,
	markerSize: .13,
	markerFade: .9,
	markerOpacity: .5
};
var camera = {
	fov: 27,
	pitchDeg: 42,
	yawDeg: 0,
	distance: 10.8,
	lookAhead: 1,
	lookAheadSouth: 2.4,
	smoothTime: .4,
	near: .5,
	far: 120,
	screenUp: .6,
	screenRight: 0,
	targetHeight: 0,
	focusHeight: .6,
	driftAmp: .035,
	driftHz: .07,
	zone: {
		enabled: true,
		stillR: 1,
		stillUp: .4,
		stillDown: .6,
		hardR: 2.2,
		hardUp: 1.1,
		hardDown: 1.4,
		leadAfter: [.35, 1.1],
		leadTau: .7,
		leadRate: 1.2,
		smoothTime: .28
	},
	assist: {
		enabled: true,
		delay: .4,
		release: .6,
		pitchMax: 10,
		yawMax: 14,
		ease: .8,
		interval: .1,
		rethink: 1.2,
		far: 1.3
	}
};
// src/core/config/render.js
/**
* Limited warm cardstock palette (sRGB hex, ALBEDO values = what assets/textures are authored in).
* Every entry is within dE00 <= 5 of a role in ref/TARGET.md sec. 1 (tools/checks/render-look/palette.py).
* Old key names are kept (other modules read them); new role names were added next to them.
*/
var palette = {
	paper: "#efe0c2",
	paperShade: "#e8d3ac",
	kraft: "#e8d3ac",
	cutEdge: "#fbf6ea",
	ochre: "#d9a441",
	mustard: "#dca848",
	terracotta: "#b9603f",
	rust: "#b25a3b",
	rose: "#c98374",
	sage: "#8e9a5b",
	olive: "#879356",
	pine: "#4f6b4a",
	moss: "#4f6b4a",
	teal: "#5e9c9a",
	tealDeep: "#3f7f84",
	brown: "#5a3a28",
	ink: "#5a3a28",
	umber: "#2a1a12",
	lantern: "#ffc45a",
	coolFill: "#9db7d6",
	list: [
		"#efe0c2",
		"#e8d3ac",
		"#d9a441",
		"#b9603f",
		"#c98374",
		"#8e9a5b",
		"#4f6b4a",
		"#5e9c9a",
		"#5a3a28",
		"#fbf6ea"
	]
};
var lights = {
	/** true: azimuths are relative to the camera yaw, so the key always comes from screen-left (gameplay yaw is fixed at 0). */
	cameraRelative: true,
	key: {
		color: "#ffd29c",
		intensity: 2.9,
		azimuthDeg: -58,
		elevationDeg: 60
	},
	fill: {
		color: "#f3cfa6",
		intensity: .95,
		azimuthDeg: 108,
		elevationDeg: 24
	},
	hemi: {
		sky: "#ffe9cc",
		ground: "#b98858",
		intensity: .42
	},
	/** Left-to-right falloff of the key (lantern-like source at screen-left) and rise of the fill, around the focus point. */
	gobo: {
		radius: 9,
		key: .12,
		fill: .6,
		tint: .07,
		closeRelief: .7
	},
	/** Traveller lantern: warm point light. `lift` raises the light above the lantern prop so the pool on the page is wide. */
	lantern: {
		color: "#ffc45a",
		intensity: 1.1,
		distance: 6.5,
		decay: .62,
		height: .5,
		lift: .55,
		wrap: .55
	},
	shadow: {
		extent: 16,
		minExtent: 3.5,
		maxExtent: 20,
		fit: 1.12,
		pad: 1.5,
		near: 1,
		far: 70,
		distance: 35,
		bias: .0045,
		normalBias: .0015,
		radius: 4,
		lightSize: .26,
		maxPenumbra: .55,
		minPenumbraTexels: 2.4,
		searchRadius: .3,
		intensity: 1,
		leak: "#7c5634",
		stockLeak: .05,
		sheetThickness: .07
	},
	/** Paper response. */
	paper: {
		wrap: .3,
		translucency: .3,
		translucencyTint: "#ffb070",
		toneVary: .065,
		crumple: .9,
		crumpleScale: .27,
		fibreScale: 2.6,
		fibreTooth: .09,
		fibreCloud: .085,
		fibreBroad: 1.2,
		/** Gold pass: pale die-cut rim on every printed card (materials.js): world width, px clamps, albedo, width wobble. */
		rim: {
			width: .0075,
			minPx: 1,
			maxPx: 1.7,
			strength: 0,
			color: "#f1e2c0",
			wobble: .28
		},
		alphaToCoverage: true,
		fibreNormal: .32,
		fibreFine: .4,
		useAssetTextures: true,
		assetFibreScale: 2,
		assetFibreTooth: .36,
		assetFibreNormal: 1.25,
		assetFibreFine: .45
	},
	/**
	* Hero cut-out (look pass): stand-up paper that would hide the traveller is screen-door dithered inside a cylinder of
	* `radius` (world units) around the camera -> traveller line. keep = share of the card's pixels left in the core,
	* margin = clear distance in front of him before the cut starts, chest = height of the aim point above his feet.
	*/
	cutout: {
		enabled: false,
		radius: .36,
		keep: 0,
		margin: .05,
		chest: .3,
		strength: 1
	},
	/**
	* Lamp-post ground pools at night (look pass; fed by life.js from the lamp nodes of risen tiles, max 6 nearest):
	* radius of the pool (world units, measured from the lamp itself), strength at full night, colour.
	*/
	pools: {
		enabled: true,
		radius: 1.5,
		strength: 1,
		color: "#ffc878",
		offsets: { desert_camp: [[
			0,
			.22,
			-.06
		]] }
	},
	/** World-space fade of everything to the dark surround beyond the lit area (acts as fog-to-dark at the far page). */
	fade: {
		start: 6.5,
		end: 13.5,
		amount: .72,
		color: "#a8804f",
		colorRight: "#9c7a54"
	},
	background: "#96744a"
};
var dof = {
	/** Tilt-shift: sharp band centred on the traveller; blur grows toward top/bottom of frame and with depth. */
	focusBand: .36,
	ramp: .42,
	maxBlurPx: 12.5,
	depthWeight: .8,
	closeBandScale: 1.8,
	nearGain: 1.6,
	farGain: 1,
	highlightBoost: .35
};
var post = {
	exposure: .79,
	closeExposure: .82,
	tint: [
		1.05,
		.96,
		1
	],
	contrast: 1.1,
	saturation: .92,
	greenDesat: .7,
	shadowTint: "#3a200c",
	shadowLift: .03,
	vignette: .1,
	grain: .008,
	grainSize: 1.35,
	chroma: .55,
	bloom: .5,
	bloomThreshold: 1.7,
	spill: 0,
	ao: 1.25,
	aoRadius: .26,
	aoTint: "#5a3214",
	edgeRim: .8,
	edgeRimColor: "#ffe6b8",
	edgeRimPx: .9,
	edgeRimDark: true,
	edgeRimDarkColor: "#c2aa94",
	sharpen: .35,
	split: .025
};
/**
* Quality levels. dofTaps = bokeh gather taps at half res; shadowTaps = [blocker search, PCF];
* msaa = samples of the HDR scene target; aoTaps 0 = no contact-darkening pass.
*/
var QUALITY = {
	low: {
		maxDpr: 1,
		shadowMapSize: 1024,
		shadows: true,
		dof: "cheap",
		dofTaps: 14,
		postScale: .5,
		grain: true,
		anisotropy: 2,
		msaa: 0,
		aoTaps: 0,
		bloom: false,
		shadowTaps: [6, 8],
		chroma: false,
		fill: false
	},
	med: {
		maxDpr: 1.25,
		shadowMapSize: 2048,
		shadows: true,
		dof: "full",
		dofTaps: 22,
		postScale: .5,
		grain: true,
		anisotropy: 4,
		msaa: 2,
		aoTaps: 6,
		bloom: true,
		shadowTaps: [8, 12],
		chroma: true,
		fill: true,
		sharpen: true
	},
	high: {
		maxDpr: 2,
		shadowMapSize: 4096,
		shadows: true,
		dof: "full",
		dofTaps: 36,
		postScale: .5,
		grain: true,
		anisotropy: 8,
		msaa: 4,
		aoTaps: 10,
		bloom: true,
		shadowTaps: [12, 20],
		chroma: true,
		fill: true,
		sharpen: true
	}
};
// src/core/config/audio.js
var audio = {
	/** Final output gain after the soft limiter (limiter ceiling = limiter.ceiling * masterGain). */
	masterGain: .95,
	/** Sounding voices at once. On overflow the quietest voice is faded out (stealFade) and replaced. */
	maxVoices: 10,
	/** Extra voice slots that only carry the short fade-out of stolen voices. */
	spareVoices: 4,
	stealFade: .008,
	/** Volume falloff: gain *= 1 / (1 + (distance / falloff)^2), i.e. half at `falloff` world units ... */
	falloff: 9,
	/** Exponent of that law: 4 keeps the half-gain point at `falloff` but leaves the nearest tiles in front (5 units: -0.4 dB, 7: -2.7 dB, 11: -10 dB). */
	falloffPow: 4,
	/** ... then faded to nothing between earshotFade and earshot (no sound, no nodes beyond earshot). */
	earshotFade: 13,
	earshot: 19,
	/** Voices quieter than this (linear, after size + distance) are not played at all. */
	minGain: .004,
	sampleRate: 48e3,
	seed: 24301,
	/** Fraction of the full equal-power pan used at |e.pan| = 1 (0.5 => ~7.7 dB left/right difference). */
	panWidth: .5,
	/** New-voice rate limit (token bucket): a wave of flaps becomes a ripple, and node creation stays bounded. */
	rate: {
		perSecond: 30,
		burst: 9,
		reserve: 3
	},
	/** Flap onsets get a seeded delay of 0..onsetJitter (one 60 Hz frame: events arrive on the frame grid) ... */
	onsetJitter: .016,
	/** ... plus up to this much more when the page is full of voices (breaks machine-gun regularity). */
	rippleJitter: .012,
	/** Each already-sounding voice turns a new flap down by this fraction of full density (0..1 scale). */
	densityDuck: .22,
	/** Tiny detail flaps (size < detailBelow + detailRange) are ducked harder and cost more rate budget when the page is busy. */
	detailBelow: .12,
	detailRange: .3,
	detailDuck: 1.6,
	detailCost: 1.2,
	/** Fold events of the same tile + direction within groupWindow seconds are ONE flap gesture (see `tile`). */
	groupWindow: .5,
	/** One flap per tile, with air between the flaps (the world fires 6-8 fold events per tile, ~16 tiles per second). */
	tile: {
		voicesPerTile: 1,
		accentBigger: .15,
		accentGain: .9,
		accentScore: .8,
		spacing: .55,
		spacingJitter: .2,
		queue: 1,
		maxDefer: .08,
		deferDb: 3.5,
		downScore: .7,
		lookahead: .03
	},
	/** Each already-sounding voice turns a new sound down: level /= sqrt(1 + overlapDuck * voices). */
	overlapDuck: .5,
	densityTickDuck: .55,
	flap: {
		gain: .13,
		downGainDb: -9,
		downBright: .9,
		sizeGainMin: .85,
		durMin: .096,
		durMax: .23,
		durCurve: 1.4,
		durPitch: .3,
		durJitter: .035,
		pitchMin: .5,
		pitchMax: .82,
		pitchRandSt: 4.3,
		pitchSizeSt: .4,
		pitchMinStepSt: .7,
		brightSmall: .95,
		brightLarge: .72,
		brightFrom: .25,
		brightTo: .75,
		bedHz: 2500,
		bedQ: .4,
		bedGain: .45,
		bedGainDown: .4,
		resHz: [
			1350,
			2750,
			4900
		],
		resQ: [
			1.5,
			1.8,
			2
		],
		resGain: [
			.3,
			.15,
			.05
		],
		grainDirect: .7,
		tiltSmall: 4200,
		tiltLarge: 1700,
		tiltSmallDown: 3400,
		tiltLargeDown: 1700,
		tiltTrack: .5,
		airTilt: .45,
		airLp: .35,
		lpHz: 2600,
		stopShare: .3,
		patGain: 2.4,
		resJitter: .06,
		resGainJitter: .18,
		decayFast: 8,
		decayFastMix: .42,
		decayNepers: 2.2,
		downHp: .78,
		bedDecayDown: 1.1,
		lumpMin: .2,
		lumpEvery: .022,
		gateEvery: 35e-5,
		bedSmooth: .35,
		refCrest: 8,
		downTick: 1.15,
		downGrains: .5,
		grainThin: 3.2,
		grainAmp: .1,
		microAmp: .025,
		tailFrom: .82,
		hpHz: 520,
		grainsMin: 16,
		grainsMax: 38,
		microMin: 50,
		microMax: 130,
		tick: .04,
		onsetGrains: 5,
		stopTick: .15,
		thump: .5,
		thumpHz: 430,
		thumpQ: 1.6,
		thumpGain: 1,
		thumpDown: .4,
		airHz: 1100,
		airQ: .75,
		airLpHz: 2400,
		airGain: .55,
		airGainDown: .3,
		airSmall: .7,
		airRise: .016,
		airRiseDown: .03,
		lowHz: 190,
		lowQ: 1.1,
		lowGain: 2.2,
		lowFrom: .4,
		lowTau: .014,
		lowDown: .1,
		downSwell: .022,
		downSwellFrom: .3,
		downStop: .5,
		peakKnee: .42,
		loudNorm: .85,
		normLo: .8,
		normHi: 1.25,
		attackUp: .0022,
		attackDown: .0048
	},
	step: {
		gain: .02,
		refCrest: 7,
		dur: .07,
		pitchRandSt: 1.6,
		footSt: .5,
		footPan: .07,
		surfaces: {
			grass: {
				bedHz: 1100,
				bedQ: .6,
				bedGain: .8,
				resHz: [700, 1300],
				resQ: [1, 1.1],
				grain: .15,
				grains: 3,
				lpHz: 1700,
				knock: 0,
				gain: .9
			},
			path: {
				bedHz: 1400,
				bedQ: .6,
				bedGain: .6,
				resHz: [900, 1700],
				resQ: [1.1, 1.2],
				grain: .22,
				grains: 2,
				lpHz: 2100,
				knock: 0,
				gain: 1
			},
			bridge: {
				bedHz: 800,
				bedQ: .7,
				bedGain: .55,
				resHz: [420, 950],
				resQ: [1.8, 1.5],
				grain: .2,
				grains: 2,
				lpHz: 1600,
				knock: .5,
				gain: 1
			},
			water: {
				bedHz: 900,
				bedQ: .6,
				bedGain: 1,
				resHz: [650, 1300],
				resQ: [1, 1.1],
				grain: .1,
				grains: 3,
				lpHz: 1700,
				knock: 0,
				gain: .6
			}
		}
	},
	/** Early reflections ("the book lies on a table in a small warm room"): one short stereo impulse response. */
	room: {
		length: .05,
		taps: [
			[
				.0013,
				.26,
				0
			],
			[
				.0049,
				.13,
				-.6
			],
			[
				.0071,
				.12,
				.6
			],
			[
				.0117,
				.08,
				-.8
			],
			[
				.0143,
				.075,
				.8
			],
			[
				.0196,
				.05,
				-.4
			],
			[
				.0233,
				.045,
				.5
			]
		],
		tail: .03,
		tailDecay: .009,
		tailLpHz: 3200
	},
	/**
	* Optional bus compressor (DynamicsCompressorNode). OFF: measured in Chrome it flattens the 2-4 ms onset snap of single
	* flaps even at a -8 dB threshold (attack <= 8 ms held for only 59 % of flaps, peaks -10 dB). Density ducking in the
	* voice allocator + the soft-knee limiter below do the same job without touching single flaps.
	*/
	comp: {
		enabled: false,
		threshold: -8,
		knee: 6,
		ratio: 3,
		attack: .006,
		release: .12,
		makeupComp: .78
	},
	/** Soft-knee waveshaper limiter: linear below `knee`, tanh above, output never exceeds `ceiling`. */
	limiter: {
		knee: .6,
		range: 2,
		ceiling: .9
	},
	/** Very quiet warm room tone so the silence between flaps is not digital black. 0 gain disables it. */
	/** Generative soft felt-piano background (src/audio/music.js). gain 0 disables. */
	music: {
		gain: 1.25,
		bpm: 63,
		reverb: .4,
		fadeIn: 4
	},
	ambience: {
		gain: 8e-4,
		length: 3,
		lpHz: 240,
		fadeIn: 1.5
	}
};
// src/core/config/assets.js
var assets = {
	tilesUrl: "./models/tiles.glb",
	travellerUrl: "./models/traveller.glb",
	/** Alien player model (round green cute alien). */
	alienPlayerUrl: "./models/alien_player.glb",
	/** Alien asset family tiles (Phase 6). Loaded alongside tiles.glb so alien models
	*  register in the MODELS prototype registry. */
	alienTilesUrl: "./models/alien_tiles.glb",
	/** Per-tile numbers written by the Blender build (flaps, triangles, layers, bridge deck profile). Optional. */
	metaUrl: "./models/assets_meta.json",
	/** Texture manifest (key -> { file, colorSpace, repeat, wrap }). Tolerated if absent. */
	manifestUrl: "./textures/manifest.json",
	texturesBase: "./textures/",
	/** Window panes / lantern glass: the one emissive material. */
	glowColor: "#ffc45a",
	glowIntensity: 3,
	/** The traveller stands on a small paper base tab (node 'base_tab'); false hides it. */
	travellerBaseTab: true,
	/** Card thickness of the Blender flaps (world units) and of glued-on layers. */
	cardThickness: .016,
	/**
	* Bridge deck (tile-local, rot 0): the path runs along local Z over an E-W river. Height above the page as a
	* piecewise-linear function of |z|: [[|z|, y], ...]. Walkable strip |x| <= halfWidth. Use for world.heightAt.
	*/
	bridge: {
		axis: "z",
		halfWidth: .25,
		halfSpan: .63,
		deckProfile: [
			[.63, 0],
			[.3064, .1578],
			[0, .2009]
		],
		railX: .295
	},
	/** Lantern post tile (rot 0): post at (x, z), lantern glass centre at (lanternX, lanternY, z). */
	lanternPost: {
		x: .5,
		z: 0,
		lanternX: .34,
		lanternY: .37
	}
};
// src/core/config/life.js
var life = {
	enabled: true,
	/** Wrap box (world units) around the traveller in which weather lives, and the spawn height of fallers. */
	box: {
		w: 19,
		d: 17,
		h: 4.6
	},
	/** Prevailing wind direction on the page (x east, z south); kinds scale it with their own `wind` speed. */
	wind: [.94, .34],
	biomes: {
		heartland: {
			leaves: 0,
			dust: 0,
			gusts: 0,
			snow: 0,
			petals: 0,
			rain: 0,
			mist: 0,
			fireflies: .3,
			butterflies: 0,
			clouds: .8,
			birds: 0
		},
		desert: {
			leaves: 0,
			dust: .5,
			gusts: .3,
			snow: 0,
			petals: 0,
			rain: 0,
			mist: .6,
			fireflies: .7,
			butterflies: 0,
			clouds: .5,
			birds: 0
		},
		snow: {
			leaves: 0,
			dust: 0,
			gusts: 0,
			snow: 0,
			petals: 0,
			rain: 0,
			mist: .25,
			fireflies: 0,
			butterflies: 0,
			clouds: .6,
			birds: 0
		},
		blossom: {
			leaves: 0,
			dust: 0,
			gusts: 0,
			snow: 0,
			petals: 1,
			rain: 0,
			mist: 0,
			fireflies: .75,
			butterflies: 0,
			clouds: .7,
			birds: 0
		},
		pinewood: {
			leaves: .12,
			dust: 0,
			gusts: 0,
			snow: 0,
			petals: 0,
			rain: 1,
			mist: 1,
			fireflies: 1,
			butterflies: 0,
			clouds: .6,
			birds: 0
		}
	},
	/** Pool sizes (instances). Everything lives in two draw calls, so these only cost a few triangles each. */
	counts: {
		leaves: 40,
		dust: 60,
		gusts: 14,
		snow: 460,
		petals: 110,
		rain: 700,
		butterflies: 18,
		flocks: 5,
		flockSize: 5,
		smokeEmitters: 10,
		smokePuffs: 4,
		mist: 9,
		clouds: 5,
		fireflies: 64
	},
	leaves: {
		size: [.13, .2],
		fall: [.42, .7],
		sway: .35,
		tumble: 1.5,
		land: 9,
		wind: .55,
		colors: [
			"#d9822b",
			"#c8552a",
			"#e0a83a",
			"#a8452a",
			"#b98a2e"
		]
	},
	snow: {
		size: [.04, .07],
		fall: [.5, .85],
		sway: .16,
		tumble: .9,
		land: 2.6,
		wind: .22,
		colors: [
			"#ffffff",
			"#fffaf2",
			"#fbf6ee"
		]
	},
	petals: {
		size: [.085, .135],
		fall: [.34, .6],
		sway: .4,
		tumble: 1.8,
		land: 4.5,
		wind: .45,
		colors: [
			"#f7b9c8",
			"#f29db4",
			"#fbd3dc",
			"#fff4f2"
		]
	},
	rain: {
		size: [.11, .19],
		width: .008,
		fall: [6.5, 8],
		land: .2,
		wind: 1.7,
		splash: .07,
		colors: ["#a9bcbb", "#98adae"]
	},
	dust: {
		size: [.022, .038],
		speed: [.12, .3],
		height: [.15, 1.5],
		colors: [
			"#f1dfb6",
			"#f6e9c9",
			"#e6cf9f"
		]
	},
	gusts: {
		length: [.5, .95],
		width: .03,
		speed: 3.6,
		period: 9.5,
		height: [.05, .3],
		colors: ["#f3e3ba", "#ead7a8"]
	},
	butterflies: {
		size: .13,
		roam: 1.1,
		height: [.3, .75],
		flap: 11,
		flowers: .9,
		colors: [
			"#fff6e0",
			"#f6c64a",
			"#ef8a3c",
			"#9cc3e8",
			"#f3a6c0"
		]
	},
	birds: {
		period: 30,
		cross: 15,
		span: 34,
		height: 2.1,
		wing: .2,
		flap: 6.5,
		shadow: .2,
		colors: ["#f6f1e6", "#e9e2d4"],
		spriteNames: []
	},
	smoke: {
		life: 5.4,
		rise: .78,
		size: [.085, .235],
		drift: .2,
		wobble: .045,
		spin: .5,
		night: 0,
		color: ["#fff3dc", "#f8e8cb"],
		/** Chimney positions per tile model, tile-local at rot 0: [east, up, south]. `default` = any other tile tagged 'house'. */
		offsets: {
			house: [[
				.14,
				.89,
				-.01
			]],
			village: [[
				-.32,
				.79,
				-.23
			]],
			village_b: [[
				.2,
				.82,
				-.04
			]],
			desert_camp: [[
				0,
				.5,
				-.06
			]],
			snow_cabin: [[
				.15,
				.8,
				.11
			]],
			snow_hamlet: [[
				-.39,
				.64,
				-.39
			], [
				.44,
				.59,
				.48
			]],
			manor: [[
				.14,
				.92,
				-.03
			]],
			default: [[
				.15,
				.8,
				-.1
			]]
		}
	},
	mist: {
		size: [3.2, 4.6],
		height: .75,
		y: .46,
		alpha: .1,
		drift: .14
	},
	clouds: {
		size: [8, 13],
		alpha: .15,
		speed: .34,
		span: 30,
		color: "#0b0a1c"
	},
	fireflies: {
		size: .12,
		roam: .55,
		water: .9,
		height: [.22, 1],
		glow: 3.6,
		color: "#ffd45a",
		rainCut: .4
	},
	/** Multipliers at full night (day = 1). */
	night: {
		butterflies: 0,
		clouds: 0,
		birds: .35,
		fireflies: 1,
		mist: 1.25
	}
};
// src/core/config/game.js
var game = {
	scraps: {
		/** Share of cells that MAY hold a biome scrap / a night-only star. With openOnly about 40 % of them find a spot:
		*  roughly one scrap per 7 cells and one star per 30 (tools/checks/game/scraps-count.mjs). */
		density: .42,
		starDensity: .08,
		/** World size of a piece (edge of its square card) and how far it leans back toward the camera (radians). */
		size: .21,
		starSize: .22,
		tilt: .62,
		/** Idle motion: rocking (radians), turning (radians) and their speeds; a tiny bob. */
		rock: .13,
		rockSpeed: 1.7,
		turn: .42,
		turnSpeed: .8,
		bob: .012,
		/** Walk this close (world units) to pick a piece up. */
		pickRadius: .3,
		/** Room (world.clearance) a spot needs (open ground is tried first), and how far from the cell centre it may lie. */
		minClearance: .2,
		openClearance: .3,
		/** Open ground = this far outside the footprint of every standing prop of the tile (plus a share of its height). */
		propMargin: .1,
		/** true: a cell whose open ground is all taken or hidden behind tall props holds no piece (never one inside a prop). */
		openOnly: true,
		spread: .72,
		/** Pieces are live on risen tiles within `range` units, and on flat tiles within `nearRadius` of the traveller. */
		range: 6.5,
		nearRadius: 2.3,
		/** Seconds after a tile starts to rise before its piece pops up; pop / hide rates (1 / s). */
		riseDelay: .38,
		popRate: 7,
		hideRate: 9,
		/** Pick-up flight: seconds, hop height, height above his feet where it ends (over the hat), turns. */
		pickTime: .7,
		pickHop: .5,
		pickLift: .62,
		pickSpin: 2.5,
		/** Every `flourishEvery`-th piece of a kind: a ring of `flourishCount` pieces bursts outward. */
		flourishEvery: 10,
		flourishCount: 8,
		flourishRadius: .62,
		flourishTime: .95,
		/** Sheen: a faint band of light that crosses the card every `glintPeriod` seconds (emissive share of its colour). */
		glint: .4,
		glintPeriod: 3.4,
		/** Self-light by day / at night so the pieces stay readable (paper, not lamps); stars glow a little more. */
		dayLift: .06,
		nightLift: .3,
		starGlow: .85,
		/** Extra self-light of a piece in flight (it turns its unlit back to the camera; thin paper lets light through). */
		flyLift: .4,
		/** Instances in the pool (visible pieces + pick-up / flourish pieces). 10 triangles each. */
		pool: 56
	},
	lanterns: {
		/** Walk this close (world units, on the page) to a lamp and it catches; seconds a tile must have been rising first. */
		catchRadius: .9,
		riseDelay: .45,
		/** Catching: seconds of the ramp, overshoot above the settled glow, size of the flicker that follows. */
		ramp: .6,
		overshoot: .35,
		flicker: .16,
		/** Unlit pane: paper tone, and the cold glint it shows at night (colour, linear strength). */
		dark: "#8a6f4a",
		glint: "#6f9cff",
		glintStrength: .42,
		/** Paper sparks per catch: count, seconds alive, rise speed, size (world units), colour and brightness. */
		sparks: 7,
		sparkLife: 1.05,
		sparkRise: .55,
		sparkSize: .045,
		sparkColor: "#ffc45a",
		sparkGain: 2.2
	},
	atlasmap: {
		/** Seconds of the eased slide in / out; how far the follow camera pulls back (share of its distance) and tips (degrees). */
		duration: .7,
		lift: .75,
		liftPitch: 74,
		/** Zoom limits (cells across the map frame height), widest opening view, blank cells kept round the land when fitting. */
		minSpan: 5,
		maxSpan: 90,
		fitMax: 24,
		fitPad: 1.5,
		/** Longest side (px) of the page / map canvases; px per tile print read back from the book bake. */
		texture: 2048,
		thumb: 128,
		/** 'twin' = folded-flat print (houses and trees printed on the land), 'base' = bare ground print; dashed ink lanes on top. */
		print: "twin",
		inkPaths: true,
		/** Key panning speed (view heights per second). */
		panSpeed: .9
	}
};
var animals = {
	enabled: true,
	/** Instances alive at once (pool size), scan range around the traveller (world units), global spawn multiplier. */
	max: 56,
	range: 5.2,
	density: 1.5,
	/** Global size multiplier on the heights of animals.json (cat 0.16 x 1.25 = 0.2: a third of the traveller, as measured on the gold image). */
	scale: 1.5,
	/** Card pop when its tile has risen this far (fold progress), pop / hide rates (1 / s). */
	riseAt: .86,
	popRate: 4.5,
	hideRate: 10,
	/** Room (world.clearance) an animal keeps from blockers; water is never entered (except floaters). */
	minClear: .07,
	/** Lighting: normal of the card as [up, toward camera] (flat cards facing the camera would lose the key light). */
	normal: [.72, .7],
	/** Albedo multiplier: the sheet is painted brighter than the tile sprites. */
	tint: .9,
	alphaTest: .42,
	shadows: true,
	/** Paper flip when an animal turns round (1 / s), lift of a card above the page. */
	flipRate: 11,
	/** Fastest walk-frame swap (frames / s), however fast the animal runs. */
	stepRate: 9,
	lift: .004,
	/** Following: at most this many at once; give up this far from home / from him; pause before the next try (s). */
	maxFollowers: 2,
	followFar: 9,
	followLost: 4.2,
	followCool: 25,
	followSide: .27,
	/** Reaction radii (world units). */
	headsUp: 1.35,
	scatter: .75,
	wag: 1.3,
	/** round 3: a bank duck slides into the water / a grazer takes a few steps aside when he comes this close. */
	slide: .85,
	shuffle: .62,
	/**
	* round 3 - the companion: ONE cat adopts the traveller. A cat of the place within `notice` trots over; when none has
	* after `spawnAfter` seconds of looking, his own cat (`coat`) pops up a little way off and comes. It walks beside
	* him, sits when he stops, naps after `nap` seconds of standing, stretches and hops along again. It leaves when it
	* loses him (`lost`) or after `wild` seconds outside `biomes` (it sits and watches him go), and is back `away` +
	* `back` seconds after he is on settled land again. `stills`: it sits beside him in settled stills.
	*/
	companion: {
		enabled: false,
		species: "cat",
		coat: "cat_ginger",
		after: 4,
		notice: 2.4,
		spawnAfter: 12,
		nap: 9,
		behind: 1.1,
		lost: 4.6,
		away: 5,
		back: 4,
		wild: 4,
		biomes: [
			"heartland",
			"blossom",
			"pinewood"
		],
		stills: true
	},
	/**
	* round 3 - vignettes (6th item of a spawn entry, see `spawns`): `sink` = how far a sitter sinks below the top of the
	* piece it sits on, `topK` = share of a tall piece's height an owl perches at, `doorSleep` = share of door cats that
	* sleep, `stay` = how often a vignette keeps its place when it thinks of wandering.
	*/
	vignettes: {
		enabled: true,
		sink: .03,
		topK: .95,
		doorSleep: .65,
		stay: .75,
		perchEvery: 0
	},
	species: {
		cat: {
			size: 1.4,
			b: "pet",
			coats: [
				"cat_ginger",
				"cat_black",
				"cat_white_grey",
				"cat_calico",
				"cat_grey_stripe"
			],
			walk: ["walk_a", "walk_b"],
			idle: [
				"sit",
				"sit",
				"tail_up",
				"stretch",
				"sleep"
			],
			sit: "sit",
			sleep: "sleep",
			speed: .42,
			run: 2.75,
			step: .085,
			hop: .012,
			rock: .05,
			roam: .7,
			follow: 0,
			followTime: [22, 40],
			notice: 1.05
		},
		dog: {
			size: 1.35,
			b: "pet",
			walk: ["walk_a", "walk_b"],
			idle: [
				"stand",
				"sit",
				"sit"
			],
			sit: "sit",
			speed: .5,
			run: 2.75,
			step: .1,
			hop: .014,
			rock: .05,
			roam: .6,
			follow: 0,
			followTime: [8, 14],
			notice: 1.2,
			wag: 1
		},
		sheep: {
			size: 1.12,
			b: "graze",
			walk: ["stand", "walk_a"],
			idle: [
				"graze",
				"graze",
				"graze",
				"stand"
			],
			speed: .13,
			step: .09,
			hop: .006,
			rock: .03,
			roam: .45,
			shuffle: .5
		},
		cow: {
			size: .95,
			b: "graze",
			walk: ["stand", "stand"],
			idle: [
				"graze",
				"graze",
				"stand"
			],
			speed: .09,
			step: .11,
			hop: .006,
			rock: .025,
			roam: .35,
			shuffle: .35
		},
		lamb: {
			b: "graze",
			walk: ["stand", "stand"],
			idle: ["stand"],
			air: "hop",
			frisky: .5,
			speed: .22,
			run: .8,
			step: .07,
			hop: .05,
			rock: .05,
			roam: .5
		},
		camel: {
			size: .78,
			b: "graze",
			walk: ["stand", "walk"],
			idle: ["stand"],
			speed: .1,
			step: .16,
			hop: .006,
			rock: .02,
			roam: .4
		},
		reindeer: {
			size: .9,
			b: "graze",
			walk: ["stand", "walk"],
			idle: ["stand"],
			speed: .14,
			step: .14,
			hop: .006,
			rock: .02,
			roam: .5,
			shuffle: .5
		},
		hen: {
			size: 1.55,
			b: "peck",
			walk: ["stand", "stand"],
			idle: ["peck", "stand"],
			speed: .2,
			run: 1.5,
			step: .05,
			hop: .02,
			rock: .07,
			roam: .35,
			flee: .55
		},
		chick: {
			size: 1.6,
			b: "peck",
			walk: ["stand", "stand"],
			idle: ["stand"],
			speed: .22,
			run: 1.3,
			step: .03,
			hop: .012,
			rock: .09,
			roam: .3,
			flee: .45
		},
		songbird: {
			size: 1.35,
			b: "peck",
			fly: 1,
			walk: ["perched", "peck"],
			idle: ["peck", "perched"],
			speed: .2,
			run: 1.6,
			step: .04,
			hop: .02,
			rock: .06,
			roam: .3,
			flee: 1.7
		},
		duck: {
			size: 1.65,
			b: "graze",
			walk: ["stand", "walk"],
			idle: ["stand"],
			float: "float",
			speed: .16,
			step: .05,
			hop: .005,
			rock: .08,
			roam: .22,
			arc: [.1, .26],
			drift: .07
		},
		frog: {
			size: 1.3,
			b: "shy",
			walk: ["sit", "sit"],
			idle: ["sit"],
			speed: .3,
			run: .9,
			step: .22,
			hop: .07,
			rock: 0,
			roam: .15,
			alert: .5,
			flee: .35,
			leap: 1
		},
		rabbit: {
			size: 1.15,
			b: "shy",
			walk: ["sit", "sit"],
			idle: ["sit"],
			air: "hop",
			speed: .5,
			run: 2.2,
			step: .26,
			hop: .06,
			rock: .02,
			roam: .4,
			alert: 1.25,
			flee: 1.6,
			zig: .55
		},
		snow_hare: {
			b: "shy",
			walk: ["sit", "sit"],
			idle: ["sit"],
			air: "hop",
			speed: .5,
			run: 2.3,
			step: .28,
			hop: .07,
			rock: .02,
			roam: .4,
			alert: 1.3,
			flee: 1.7,
			zig: .55
		},
		squirrel: {
			size: 1.15,
			b: "shy",
			walk: ["sit", "sit"],
			idle: ["sit"],
			air: "run",
			speed: .6,
			run: 2.4,
			step: .24,
			hop: .035,
			rock: .02,
			roam: .45,
			alert: 1.1,
			flee: 1.4
		},
		fox: {
			size: 1.35,
			b: "shy",
			walk: ["stand", "walk"],
			idle: ["sit", "stand"],
			sit: "sit",
			speed: .3,
			run: 2.3,
			step: .13,
			hop: .012,
			rock: .04,
			roam: .6,
			alert: 1.5,
			flee: 1.9
		},
		desert_fox: {
			b: "shy",
			walk: ["stand", "stand"],
			idle: ["sit", "stand"],
			sit: "sit",
			speed: .3,
			run: 2.3,
			step: .1,
			hop: .016,
			rock: .05,
			roam: .6,
			alert: 1.5,
			flee: 1.9
		},
		arctic_fox: {
			b: "shy",
			walk: ["stand", "stand"],
			idle: ["sit", "stand"],
			sit: "sit",
			speed: .3,
			run: 2.3,
			step: .1,
			hop: .016,
			rock: .05,
			roam: .6,
			alert: 1.5,
			flee: 1.9
		},
		deer: {
			size: .9,
			b: "shy",
			walk: ["stand", "walk"],
			idle: [
				"graze",
				"graze",
				"stand"
			],
			speed: .2,
			run: 2.5,
			step: .17,
			hop: .02,
			rock: .03,
			roam: .5,
			alert: 1.6,
			flee: 2
		},
		hedgehog: {
			size: 1.25,
			b: "shy",
			walk: ["stand", "stand"],
			idle: ["stand"],
			speed: .08,
			run: .08,
			step: .025,
			hop: .003,
			rock: .05,
			roam: .3,
			alert: .8,
			flee: 0
		},
		lizard: {
			size: 1.4,
			b: "shy",
			walk: ["stand", "stand"],
			idle: ["stand"],
			speed: .9,
			run: 2.6,
			step: .04,
			hop: 0,
			rock: .09,
			roam: .5,
			alert: .9,
			flee: 1,
			dart: 1,
			zig: .35
		},
		owl: {
			size: 1.15,
			b: "perch",
			walk: ["perched", "perched"],
			idle: ["perched"],
			speed: 0,
			step: 1,
			hop: 0,
			rock: .03,
			roam: 0
		},
		penguin: {
			b: "graze",
			walk: ["stand", "waddle"],
			idle: ["stand"],
			speed: .2,
			step: .06,
			hop: .006,
			rock: .1,
			roam: .7,
			gap: .2,
			restless: 1
		}
	},
	spawns: {
		all: {
			house: [
				[
					"cat",
					1,
					1,
					1,
					"o",
					"door"
				],
				[
					"cat",
					.55,
					1,
					1,
					"",
					"on:fence|barrels|well"
				],
				[
					"hen",
					.55,
					2,
					3,
					"dh"
				],
				[
					"chick",
					.2,
					1,
					2,
					"dh"
				]
			],
			village: [
				[
					"cat",
					1,
					1,
					1,
					"",
					"on:fence|woodpile|crates|barrels|hay"
				],
				[
					"cat",
					.7,
					1,
					1,
					"",
					"door"
				],
				[
					"hen",
					.7,
					3,
					3,
					"dh",
					"in:fence_yard|cart"
				],
				[
					"dog",
					.7,
					1,
					1,
					"",
					"at:cart"
				]
			],
			manor: [
				[
					"cat",
					.75,
					1,
					1,
					"",
					"on:bench|barrel|fence"
				],
				[
					"cat",
					.5,
					1,
					1,
					"",
					"door"
				],
				[
					"dog",
					.4,
					1,
					1,
					"",
					"at:bench|barrel"
				]
			],
			church: [[
				"cat",
				.55,
				1,
				1,
				"",
				"on:bench|fence"
			], [
				"songbird",
				.4,
				2,
				3,
				"dh"
			]],
			market_square: [
				[
					"dog",
					.75,
					1,
					1,
					"",
					"at:cart"
				],
				[
					"cat",
					.7,
					1,
					1,
					"",
					"on:crates|barrels"
				],
				[
					"cat",
					.3,
					1,
					1,
					""
				],
				[
					"hen",
					.3,
					2,
					2,
					"dh"
				]
			],
			barn_farm: [
				[
					"sheep",
					.95,
					2,
					2,
					"h",
					"in:fence_pad",
					[
						-.5,
						.46,
						.27
					]
				],
				[
					"cow",
					.7,
					1,
					1,
					""
				],
				[
					"hen",
					.8,
					2,
					3,
					"dh"
				],
				[
					"chick",
					.5,
					2,
					2,
					"dh"
				],
				[
					"cat",
					.6,
					1,
					1,
					"",
					"on:fence_pad|hay|barrel_trough"
				],
				[
					"dog",
					.45,
					1,
					1,
					"",
					"at:cart"
				]
			],
			windmill: [
				[
					"cat",
					.5,
					1,
					1,
					"",
					"on:hay|fence"
				],
				[
					"sheep",
					.4,
					2,
					2,
					"h"
				],
				[
					"hen",
					.3,
					2,
					2,
					"dh"
				],
				[
					"dog",
					.3,
					1,
					1,
					"",
					"at:cart"
				]
			],
			pond: [
				[
					"duck",
					1,
					1,
					1,
					"w"
				],
				[
					"duck",
					1,
					2,
					3,
					"bh"
				],
				[
					"frog",
					.5,
					1,
					1,
					"b"
				],
				[
					"cat",
					.4,
					1,
					1,
					"",
					"door"
				]
			],
			village_b: [
				[
					"cat",
					1,
					1,
					1,
					"",
					"on:woodpile|barrels|fence_gd"
				],
				[
					"cat",
					.6,
					1,
					1,
					"",
					"door"
				],
				[
					"hen",
					.6,
					2,
					3,
					"dh",
					"in:fence_gd"
				],
				[
					"songbird",
					.35,
					2,
					2,
					"dh"
				]
			],
			village_green: [
				[
					"cat",
					.9,
					1,
					1,
					"",
					"on:bench"
				],
				[
					"dog",
					.65,
					1,
					1,
					"",
					"at:guidepost|well|bench"
				],
				[
					"songbird",
					.5,
					2,
					3,
					"dh"
				],
				[
					"hen",
					.35,
					2,
					3,
					"dh"
				],
				[
					"squirrel",
					.3,
					1,
					1,
					"d",
					"at:tree"
				]
			],
			river_reeds: [
				[
					"duck",
					.8,
					1,
					2,
					"w"
				],
				[
					"duck",
					.7,
					2,
					2,
					"bh"
				],
				[
					"frog",
					.4,
					1,
					1,
					"b"
				],
				[
					"cat",
					.4,
					1,
					1,
					"",
					"on:barrel"
				]
			],
			river_straight: [[
				"duck",
				.4,
				1,
				2,
				"w"
			], [
				"duck",
				.22,
				1,
				1,
				"b"
			]],
			river_corner: [[
				"duck",
				.4,
				1,
				2,
				"w"
			], [
				"frog",
				.25,
				1,
				1,
				"b"
			]],
			river_source: [[
				"frog",
				.45,
				1,
				1,
				"b"
			], [
				"duck",
				.3,
				1,
				1,
				"w"
			]],
			bridge: [[
				"duck",
				.35,
				1,
				2,
				"w"
			]],
			lantern_post: [[
				"cat",
				.5,
				1,
				1,
				"",
				"on:crates"
			]],
			path_straight: [[
				"hen",
				.25,
				3,
				3,
				"dh"
			], [
				"dog",
				.15,
				1,
				1,
				""
			]],
			path_corner: [[
				"dog",
				.55,
				1,
				1,
				"",
				"at:cart",
				[
					.1,
					.4,
					.2
				]
			], [
				"hen",
				.4,
				3,
				3,
				"dh",
				[
					.3,
					.62,
					.2
				]
			]],
			path_end: [[
				"dog",
				.15,
				1,
				1,
				""
			]],
			desert_camp: [
				[
					"camel",
					.85,
					1,
					2,
					"h",
					"at:palm|tent_c"
				],
				[
					"cat",
					.3,
					1,
					1,
					"",
					"on:crates"
				],
				[
					"desert_fox",
					.3,
					1,
					1,
					"n"
				]
			],
			desert_market: [
				[
					"camel",
					.6,
					1,
					1,
					""
				],
				[
					"dog",
					.45,
					1,
					1,
					""
				],
				[
					"cat",
					.45,
					1,
					1,
					""
				],
				[
					"hen",
					.3,
					2,
					2,
					"dh"
				]
			],
			desert_oasis: [
				[
					"camel",
					.6,
					1,
					2,
					"h"
				],
				[
					"lizard",
					.4,
					1,
					1,
					"d"
				],
				[
					"duck",
					.3,
					1,
					1,
					"w"
				]
			],
			desert_dunes: [
				[
					"lizard",
					.4,
					1,
					2,
					"d"
				],
				[
					"desert_fox",
					.32,
					1,
					1,
					"n"
				],
				[
					"camel",
					.07,
					1,
					1,
					""
				]
			],
			desert_dunes_b: [
				[
					"lizard",
					.4,
					1,
					2,
					"d"
				],
				[
					"desert_fox",
					.32,
					1,
					1,
					"n"
				],
				[
					"camel",
					.07,
					1,
					1,
					""
				]
			],
			desert_dunes_c: [[
				"lizard",
				.4,
				1,
				2,
				"d"
			], [
				"desert_fox",
				.32,
				1,
				1,
				"n"
			]],
			desert_cacti: [[
				"lizard",
				.45,
				1,
				2,
				"d"
			], [
				"desert_fox",
				.3,
				1,
				1,
				"n"
			]],
			desert_ruin: [
				[
					"lizard",
					.6,
					1,
					2,
					"d"
				],
				[
					"desert_fox",
					.5,
					1,
					1,
					"n"
				],
				[
					"owl",
					.3,
					1,
					1,
					"np"
				]
			],
			snow_pines: [
				[
					"snow_hare",
					.35,
					1,
					2,
					""
				],
				[
					"reindeer",
					.25,
					2,
					3,
					"h"
				],
				[
					"arctic_fox",
					.2,
					1,
					1,
					""
				],
				[
					"owl",
					.25,
					1,
					1,
					"np"
				]
			],
			snow_drifts: [
				[
					"reindeer",
					.32,
					2,
					3,
					"h"
				],
				[
					"snow_hare",
					.3,
					1,
					2,
					""
				],
				[
					"arctic_fox",
					.18,
					1,
					1,
					""
				]
			],
			snow_cabin: [
				[
					"cat",
					.5,
					1,
					1,
					"o",
					"on:woodpile|fence"
				],
				[
					"reindeer",
					.25,
					1,
					2,
					"h"
				],
				[
					"dog",
					.2,
					1,
					1,
					"",
					"at:sled"
				]
			],
			snow_hamlet: [
				[
					"cat",
					.7,
					1,
					1,
					"",
					"on:woodpile|fence"
				],
				[
					"cat",
					.4,
					1,
					1,
					"",
					"door"
				],
				[
					"dog",
					.3,
					1,
					1,
					"",
					"at:sled|snowman"
				]
			],
			frozen_pond: [[
				"penguin",
				.95,
				3,
				4,
				"ch"
			], [
				"penguin",
				.5,
				1,
				1,
				"",
				"at:sled|sign|igloo"
			]],
			blossom_orchard: [
				[
					"songbird",
					.5,
					2,
					3,
					"dh"
				],
				[
					"lamb",
					.3,
					1,
					2,
					"h"
				],
				[
					"rabbit",
					.2,
					1,
					1,
					""
				]
			],
			blossom_garden: [
				[
					"songbird",
					.5,
					2,
					3,
					"dh"
				],
				[
					"lamb",
					.35,
					2,
					2,
					"h"
				],
				[
					"cat",
					.2,
					1,
					1,
					""
				],
				[
					"rabbit",
					.25,
					1,
					1,
					""
				]
			],
			blossom_gazebo: [[
				"cat",
				.45,
				1,
				1,
				""
			], [
				"songbird",
				.5,
				2,
				3,
				"dh"
			]],
			blossom_lane: [[
				"songbird",
				.4,
				2,
				3,
				"dh"
			], [
				"cat",
				.15,
				1,
				1,
				""
			]],
			deep_pines: [
				[
					"deer",
					.3,
					1,
					1,
					"",
					"behind:pine"
				],
				[
					"squirrel",
					.4,
					1,
					1,
					"d",
					"at:pine|stump"
				],
				[
					"fox",
					.2,
					1,
					1,
					"d",
					"behind:pine|mossy_boulder"
				],
				[
					"fox",
					.35,
					1,
					1,
					"n"
				],
				[
					"hedgehog",
					.35,
					1,
					1,
					"n"
				],
				[
					"owl",
					.45,
					1,
					1,
					"np"
				],
				[
					"rabbit",
					.2,
					1,
					1,
					""
				]
			],
			mushroom_glade: [
				[
					"hedgehog",
					.6,
					1,
					1,
					"n"
				],
				[
					"rabbit",
					.4,
					1,
					2,
					""
				],
				[
					"squirrel",
					.4,
					1,
					1,
					"d"
				],
				[
					"deer",
					.25,
					1,
					1,
					""
				]
			],
			fallen_log: [
				[
					"squirrel",
					.5,
					1,
					1,
					"d",
					"on:log"
				],
				[
					"owl",
					.6,
					1,
					1,
					"np"
				],
				[
					"fox",
					.35,
					1,
					1,
					"",
					"behind:pine|boulder"
				],
				[
					"hedgehog",
					.4,
					1,
					1,
					"n"
				]
			],
			watchtower: [
				[
					"cat",
					.35,
					1,
					1,
					""
				],
				[
					"owl",
					.85,
					1,
					1,
					"np",
					"top:tower$"
				],
				[
					"dog",
					.2,
					1,
					1,
					""
				],
				[
					"squirrel",
					.35,
					1,
					1,
					"d",
					"at:pine|stump"
				]
			],
			grove: [
				[
					"rabbit",
					.3,
					1,
					2,
					""
				],
				[
					"squirrel",
					.4,
					1,
					1,
					"d",
					"at:tree"
				],
				[
					"fox",
					.3,
					1,
					1,
					"d",
					"behind:tree|bush"
				],
				[
					"fox",
					.4,
					1,
					1,
					"n"
				],
				[
					"deer",
					.2,
					1,
					1,
					"",
					"behind:tree"
				],
				[
					"hedgehog",
					.35,
					1,
					1,
					"n"
				],
				[
					"cat",
					.25,
					1,
					1,
					"",
					"on:bench"
				]
			],
			forest: [
				[
					"squirrel",
					.45,
					1,
					1,
					"d",
					"at:tree|pine|stump"
				],
				[
					"deer",
					.25,
					1,
					1,
					"",
					"behind:tree|pine"
				],
				[
					"fox",
					.3,
					1,
					1,
					"d",
					"behind:tree|pine|bush"
				],
				[
					"fox",
					.4,
					1,
					1,
					"n"
				],
				[
					"rabbit",
					.25,
					1,
					1,
					""
				],
				[
					"hedgehog",
					.3,
					1,
					1,
					"n"
				],
				[
					"owl",
					.3,
					1,
					1,
					"np"
				]
			],
			alien_dwelling: [[
				"cat",
				.4,
				1,
				1,
				"",
				"door"
			], [
				"lizard",
				.3,
				1,
				2,
				"d",
				"on:pod_c|pod_l|pod_r"
			]],
			alien_landmark: [[
				"owl",
				.5,
				1,
				1,
				"np",
				"top:spire|ring_a|ring_b"
			], [
				"cat",
				.2,
				1,
				1,
				"",
				"on:platform"
			]],
			alien_crystal: [[
				"lizard",
				.5,
				1,
				2,
				"d",
				"on:spike_0|spike_1|spike_2"
			], [
				"cat",
				.15,
				1,
				1,
				"",
				"on:base_block"
			]],
			alien_meadow: [[
				"cat",
				.25,
				1,
				1,
				"",
				"on:tuft_"
			], [
				"lizard",
				.2,
				1,
				2,
				"d"
			]],
			alien_grove: [
				[
					"cat",
					.3,
					1,
					1,
					"",
					"on:canopy_"
				],
				[
					"lizard",
					.25,
					1,
					2,
					"d",
					"on:trunk_"
				],
				[
					"owl",
					.3,
					1,
					1,
					"np",
					"top:canopy_"
				]
			],
			alien_stones: [[
				"lizard",
				.4,
				1,
				2,
				"d",
				"on:stone_"
			]],
			pod_dwelling: [[
				"cat",
				.4,
				1,
				1,
				"",
				"door"
			], [
				"lizard",
				.2,
				1,
				2,
				"d",
				"on:pod|glow_rim"
			]],
			glowpool: [[
				"cat",
				.2,
				1,
				1,
				"",
				"on:glow_rim"
			]],
			crystal_field_a: [[
				"lizard",
				.35,
				1,
				2,
				"d",
				"on:crystal_"
			]],
			crystal_field_b: [[
				"lizard",
				.35,
				1,
				2,
				"d",
				"on:crystal_"
			]],
			crystal_spire: [[
				"lizard",
				.4,
				1,
				2,
				"d",
				"on:base_crystal_|spire_"
			], [
				"owl",
				.4,
				1,
				1,
				"np",
				"top:spire_"
			]],
			spire_forest_a: [
				[
					"cat",
					.25,
					1,
					1,
					"",
					"on:canopy_"
				],
				[
					"lizard",
					.2,
					1,
					2,
					"d",
					"on:trunk_"
				],
				[
					"owl",
					.35,
					1,
					1,
					"np",
					"top:canopy_"
				]
			],
			spire_forest_b: [
				[
					"cat",
					.2,
					1,
					1,
					"",
					"on:canopy_"
				],
				[
					"lizard",
					.15,
					1,
					2,
					"d",
					"on:trunk_"
				],
				[
					"owl",
					.4,
					1,
					1,
					"np",
					"top:canopy_"
				]
			],
			ruin_arch: [[
				"lizard",
				.4,
				1,
				2,
				"d",
				"on:rubble_|arch_"
			], [
				"owl",
				.4,
				1,
				1,
				"np",
				"top:arch_top"
			]],
			ruin_wall: [[
				"lizard",
				.45,
				1,
				2,
				"d",
				"on:wall_"
			], [
				"cat",
				.2,
				1,
				1,
				"",
				"on:capstone"
			]],
			glass_dunes: [[
				"lizard",
				.35,
				1,
				2,
				"d",
				"on:dune_"
			]],
			giant_mushroom: [
				[
					"cat",
					.3,
					1,
					1,
					"",
					"on:cap|gills_"
				],
				[
					"lizard",
					.25,
					1,
					2,
					"d",
					"on:stem|spores_"
				],
				[
					"owl",
					.35,
					1,
					1,
					"np",
					"top:cap"
				]
			],
			fallen_spire: [[
				"lizard",
				.4,
				1,
				2,
				"d",
				"on:debris_|crystal_shard_"
			], [
				"cat",
				.2,
				1,
				1,
				"",
				"on:trunk"
			]],
			bulb_patch: [[
				"cat",
				.3,
				1,
				1,
				"",
				"on:bulb_|bloom_"
			], [
				"lizard",
				.2,
				1,
				2,
				"d"
			]],
			lantern_flower: [[
				"cat",
				.3,
				1,
				1,
				"",
				"on:lantern_|glow_"
			], [
				"lizard",
				.2,
				1,
				2,
				"d",
				"on:stem_"
			]],
			bone_spire: [[
				"lizard",
				.5,
				1,
				2,
				"d",
				"on:rib_"
			], [
				"owl",
				.45,
				1,
				1,
				"np",
				"top:crown|spire_"
			]],
			ash_cones: [[
				"lizard",
				.45,
				1,
				2,
				"d",
				"on:cone_"
			]],
			frost_moss: [[
				"cat",
				.25,
				1,
				1,
				"",
				"on:patch_"
			], [
				"lizard",
				.2,
				1,
				2,
				"d"
			]],
			alien_river: [[
				"duck",
				.6,
				1,
				2,
				"w"
			], [
				"duck",
				.4,
				1,
				1,
				"b"
			]]
		},
		heartland: {
			meadow: [[
				"cat",
				.3,
				1,
				1,
				"",
				"on:fence_pad"
			], [
				"lizard",
				.2,
				1,
				2,
				"d"
			]],
			meadow_flowers: [[
				"lizard",
				.2,
				1,
				2,
				"d"
			]],
			hills: [[
				"lizard",
				.15,
				1,
				2,
				"d"
			]],
			rocks: [[
				"lizard",
				.25,
				1,
				2,
				"d"
			]],
			alien_dwelling: [[
				"cat",
				.4,
				1,
				1,
				"",
				"door"
			], [
				"lizard",
				.3,
				1,
				2,
				"d",
				"on:pod_c|pod_l|pod_r"
			]],
			alien_landmark: [[
				"owl",
				.5,
				1,
				1,
				"np",
				"top:spire|ring_a|ring_b"
			], [
				"cat",
				.2,
				1,
				1,
				"",
				"on:platform"
			]],
			alien_meadow: [[
				"cat",
				.35,
				1,
				1,
				"",
				"on:tuft_"
			], [
				"lizard",
				.3,
				1,
				2,
				"d"
			]],
			alien_grove: [
				[
					"cat",
					.4,
					1,
					1,
					"",
					"on:canopy_"
				],
				[
					"lizard",
					.3,
					1,
					2,
					"d",
					"on:trunk_"
				],
				[
					"owl",
					.35,
					1,
					1,
					"np",
					"top:canopy_"
				]
			],
			alien_stones: [[
				"lizard",
				.5,
				1,
				2,
				"d",
				"on:stone_"
			]],
			pod_dwelling: [[
				"cat",
				.5,
				1,
				1,
				"",
				"door"
			], [
				"lizard",
				.3,
				1,
				2,
				"d",
				"on:pod|glow_rim"
			]],
			glowpool: [[
				"cat",
				.3,
				1,
				1,
				"",
				"on:glow_rim"
			]]
		},
		desert: {
			meadow: [[
				"lizard",
				.35,
				1,
				2,
				"d"
			], [
				"cat",
				.1,
				1,
				1,
				"",
				"on:crystals"
			]],
			rocks: [[
				"lizard",
				.5,
				1,
				2,
				"d"
			]],
			desert_ruin: [
				[
					"lizard",
					.6,
					1,
					2,
					"d"
				],
				[
					"cat",
					.2,
					1,
					1,
					"",
					"on:platform"
				],
				[
					"owl",
					.3,
					1,
					1,
					"np"
				]
			],
			alien_crystal: [[
				"lizard",
				.5,
				1,
				2,
				"d",
				"on:spike_0|spike_1|spike_2"
			], [
				"cat",
				.15,
				1,
				1,
				"",
				"on:base_block"
			]],
			crystal_field_a: [[
				"lizard",
				.5,
				1,
				2,
				"d",
				"on:crystal_"
			]],
			crystal_field_b: [[
				"lizard",
				.5,
				1,
				2,
				"d",
				"on:crystal_"
			]],
			crystal_spire: [[
				"lizard",
				.6,
				1,
				2,
				"d",
				"on:base_crystal_|spire_"
			], [
				"owl",
				.5,
				1,
				1,
				"np",
				"top:spire_"
			]],
			ruin_arch: [[
				"lizard",
				.5,
				1,
				2,
				"d",
				"on:rubble_|arch_"
			], [
				"owl",
				.5,
				1,
				1,
				"np",
				"top:arch_top"
			]],
			ruin_wall: [[
				"lizard",
				.55,
				1,
				2,
				"d",
				"on:wall_"
			], [
				"cat",
				.25,
				1,
				1,
				"",
				"on:capstone"
			]],
			glass_dunes: [[
				"lizard",
				.45,
				1,
				2,
				"d",
				"on:dune_"
			]]
		},
		snow: {
			meadow: [[
				"cat",
				.2,
				1,
				1,
				"",
				"on:ash_drifts"
			], [
				"lizard",
				.15,
				1,
				2,
				"d"
			]],
			rocks: [[
				"lizard",
				.3,
				1,
				1,
				"d"
			]],
			hills: [[
				"cat",
				.15,
				1,
				1,
				"",
				"on:bone_spires"
			]],
			bone_spire: [[
				"lizard",
				.6,
				1,
				2,
				"d",
				"on:rib_"
			], [
				"owl",
				.55,
				1,
				1,
				"np",
				"top:crown|spire_"
			]],
			ash_cones: [[
				"lizard",
				.55,
				1,
				2,
				"d",
				"on:cone_"
			]],
			frost_moss: [[
				"cat",
				.35,
				1,
				1,
				"",
				"on:patch_"
			], [
				"lizard",
				.3,
				1,
				2,
				"d"
			]]
		},
		blossom: {
			meadow: [
				[
					"cat",
					.25,
					1,
					1,
					"",
					"on:bulb_patch"
				],
				[
					"lizard",
					.2,
					1,
					2,
					"d"
				],
				[
					"songbird",
					.3,
					2,
					3,
					"dh"
				]
			],
			meadow_flowers: [[
				"songbird",
				.4,
				2,
				3,
				"dh"
			], [
				"cat",
				.2,
				1,
				1,
				""
			]],
			grove: [[
				"songbird",
				.45,
				2,
				3,
				"dh"
			], [
				"rabbit",
				.25,
				1,
				1,
				""
			]],
			forest: [[
				"songbird",
				.35,
				2,
				3,
				"dh"
			], [
				"cat",
				.2,
				1,
				1,
				""
			]],
			hills: [[
				"cat",
				.2,
				1,
				1,
				"",
				"on:lantern_flower"
			]],
			bulb_patch: [
				[
					"cat",
					.4,
					1,
					1,
					"",
					"on:bulb_|bloom_"
				],
				[
					"lizard",
					.3,
					1,
					2,
					"d"
				],
				[
					"songbird",
					.35,
					2,
					3,
					"dh"
				]
			],
			lantern_flower: [
				[
					"cat",
					.4,
					1,
					1,
					"",
					"on:lantern_|glow_"
				],
				[
					"lizard",
					.25,
					1,
					2,
					"d",
					"on:stem_"
				],
				[
					"songbird",
					.3,
					2,
					3,
					"dh"
				]
			]
		},
		pinewood: {
			meadow: [
				[
					"cat",
					.2,
					1,
					1,
					"",
					"on:mushroom_glade"
				],
				[
					"lizard",
					.15,
					1,
					2,
					"d"
				],
				[
					"hedgehog",
					.25,
					1,
					1,
					"n"
				]
			],
			meadow_flowers: [[
				"cat",
				.2,
				1,
				1,
				""
			], [
				"hedgehog",
				.3,
				1,
				1,
				"n"
			]],
			rocks: [[
				"lizard",
				.3,
				1,
				1,
				"d"
			], [
				"owl",
				.4,
				1,
				1,
				"np"
			]],
			hills: [[
				"cat",
				.15,
				1,
				1,
				"",
				"on:giant_mushroom"
			]],
			mushroom_glade: [
				[
					"hedgehog",
					.6,
					1,
					1,
					"n"
				],
				[
					"cat",
					.3,
					1,
					1,
					"",
					"on:spore_cap"
				],
				[
					"fox",
					.2,
					1,
					1,
					"n"
				]
			],
			alien_landmark: [[
				"owl",
				.5,
				1,
				1,
				"np",
				"top:spire|ring_a|ring_b"
			], [
				"cat",
				.2,
				1,
				1,
				"",
				"on:platform"
			]],
			spire_forest_a: [
				[
					"cat",
					.35,
					1,
					1,
					"",
					"on:canopy_"
				],
				[
					"lizard",
					.25,
					1,
					2,
					"d",
					"on:trunk_"
				],
				[
					"owl",
					.45,
					1,
					1,
					"np",
					"top:canopy_"
				]
			],
			spire_forest_b: [
				[
					"cat",
					.3,
					1,
					1,
					"",
					"on:canopy_"
				],
				[
					"lizard",
					.2,
					1,
					2,
					"d",
					"on:trunk_"
				],
				[
					"owl",
					.5,
					1,
					1,
					"np",
					"top:canopy_"
				]
			],
			giant_mushroom: [
				[
					"cat",
					.4,
					1,
					1,
					"",
					"on:cap|gills_"
				],
				[
					"lizard",
					.3,
					1,
					2,
					"d",
					"on:stem|spores_"
				],
				[
					"owl",
					.4,
					1,
					1,
					"np",
					"top:cap"
				]
			],
			fallen_spire: [
				[
					"lizard",
					.5,
					1,
					2,
					"d",
					"on:debris_|crystal_shard_"
				],
				[
					"cat",
					.25,
					1,
					1,
					"",
					"on:trunk"
				],
				[
					"owl",
					.4,
					1,
					1,
					"np",
					"top:trunk"
				]
			]
		}
	},
	/** Mesh names of a tile model an owl may perch on (first match by hash), and the height window of their tops. */
	perch: {
		names: "stump|log|rock|stone|boulder|post|fence|crate|barrel|sign|well",
		top: [.06, .62]
	}
};
// src/core/config.js
var TILE_SIZE = 2;
var REVEAL_RADIUS = 3;
var FOLD_BACK_RADIUS = FOLD_BACK_RADIUS$1;
var DESPAWN_RADIUS = 6;
var PATH_WIDTH = PATH_WIDTH$1;
var RIVER_WIDTH = RIVER_WIDTH$1;
var FLAP_LAYER_GAP = FLAP_LAYER_GAP$1;
var CONFIG = {
	...shared_exports,
	wfc,
	spring,
	world,
	book,
	player,
	camera,
	palette,
	lights,
	dof,
	post,
	audio,
	assets,
	life,
	game,
	animals,
	QUALITY,
	railway: { useExperimentalRenderer: false }
};
/** Resolve a quality level name ('low'|'med'|'high') to its settings object (falls back to default). */
function qualitySettings(level) {
	return QUALITY[level] || QUALITY["high"];
}
// src/core/events.js
function createBus() {
	const map = /* @__PURE__ */ new Map();
	const api = {
		on(name, fn) {
			let set = map.get(name);
			if (!set) map.set(name, set = /* @__PURE__ */ new Set());
			set.add(fn);
			return () => api.off(name, fn);
		},
		once(name, fn) {
			const off = api.on(name, (p) => {
				off();
				fn(p);
			});
			return off;
		},
		off(name, fn) {
			const set = map.get(name);
			if (set) set.delete(fn);
		},
		emit(name, payload) {
			const set = map.get(name);
			if (!set || set.size === 0) return;
			for (const fn of [...set]) try {
				fn(payload);
			} catch (err) {
				console.error("[bus] handler threw for event", name, err);
			}
		},
		clear() {
			map.clear();
		}
	};
	return api;
}
/** The single app-wide bus. Import this everywhere: import { bus } from '../core/events.js'. */
var bus = createBus();
// src/core/state.js
var hypot2$4 = (a, b) => Math.sqrt(a * a + b * b);
var state = {
	time: 0,
	frame: 0,
	seed: 1,
	quality: "high",
	traveller: {
		x: 0,
		y: 0,
		z: 0,
		dirX: 0,
		dirZ: -1,
		speed: 0
	},
	listener: {
		x: 0,
		z: 0,
		rightX: 1,
		rightZ: 0
	}
};
/** Stereo pan (-1 left .. +1 right) for a world position, relative to the listener. */
function panFor(x, z) {
	const l = state.listener;
	const d = (x - l.x) * l.rightX + (z - l.z) * l.rightZ;
	const range = CONFIG.REVEAL_RADIUS * CONFIG.TILE_SIZE;
	return Math.max(-1, Math.min(1, d / range));
}
/** Distance (world units) from the listener, for volume falloff. */
function distanceFor(x, z) {
	const l = state.listener;
	return hypot2$4(x - l.x, z - l.z);
}
// src/core/loop.js
function createLoop({ update, render, maxDt = 1 / 20 }) {
	let raf = 0;
	let running = false;
	let last = 0;
	let time = 0;
	let frame = 0;
	function tick(now) {
		raf = requestAnimationFrame(tick);
		const raw = last ? now - last : 1e3 / 60;
		last = now;
		const dt = Math.min(raw / 1e3, maxDt);
		time += dt;
		frame++;
		update(dt);
		render(dt);
	}
	return {
		start() {
			if (running) return;
			running = true;
			last = 0;
			raf = requestAnimationFrame(tick);
		},
		stop() {
			running = false;
			cancelAnimationFrame(raf);
		},
		get time() {
			return time;
		},
		get frame() {
			return frame;
		}
	};
}
// src/core/models.js
var DIRS = [
	"n",
	"e",
	"s",
	"w"
];
var g = "grass";
var p = "path";
var r = "river";
var S = (n, e, s, w) => ({
	n,
	e,
	s,
	w
});
/** Shorthand for a full biome table (multipliers in the order of BIOMES in core/biomes.js). */
var B = (heartland, desert, snow, blossom, pinewood) => ({
	heartland,
	desert,
	snow,
	blossom,
	pinewood
});
/**
* model id -> { sockets (rot 0), tags, biomes? }   (biomes: see BIOME SCHEMA above; paths / rivers / bridge have none = everywhere)
* tags (standard vocabulary, used by shots/world/audio): 'open' (walk anywhere), 'path', 'water',
* 'bridge', 'house', 'village', 'forest', 'hills', 'landmark', 'lantern', 'blocker' (has soft obstacles).
*/
var MODELS = {
	meadow: {
		sockets: S(g, g, g, g),
		tags: ["open"],
		biomes: B(0, .75, .7, .8, .45)
	},
	meadow_flowers: {
		sockets: S(g, g, g, g),
		tags: ["open"],
		biomes: B(0, 0, .1, 2.4, .5)
	},
	hills: {
		sockets: S(g, g, g, g),
		tags: ["hills", "blocker"],
		biomes: B(0, 0, .12, .6, .3)
	},
	forest: {
		sockets: S(g, g, g, g),
		tags: ["forest", "blocker"],
		biomes: B(0, 0, 0, .6, .7)
	},
	grove: {
		sockets: S(g, g, g, g),
		tags: ["forest", "blocker"],
		biomes: B(0, 0, 0, 1.7, .3)
	},
	rocks: {
		sockets: S(g, g, g, g),
		tags: ["blocker"],
		biomes: B(0, 1.5, 1.1, .4, .9)
	},
	pond: {
		sockets: S(g, g, g, g),
		tags: ["water", "blocker"],
		biomes: B(0, 0, 0, 1.4, 1.3)
	},
	windmill: {
		sockets: S(g, g, g, g),
		tags: ["landmark", "blocker"],
		biomes: B(0, 0, 0, 1, .1)
	},
	path_straight: {
		sockets: S(p, g, p, g),
		tags: ["path"]
	},
	path_corner: {
		sockets: S(p, p, g, g),
		tags: ["path"]
	},
	path_t: {
		sockets: S(g, p, p, p),
		tags: ["path"]
	},
	path_cross: {
		sockets: S(p, p, p, p),
		tags: ["path"]
	},
	path_end: {
		sockets: S(g, g, p, g),
		tags: ["path"]
	},
	lantern_post: {
		sockets: S(p, g, p, g),
		tags: ["path", "lantern"],
		biomes: B(1, 1.6, 2.6, 1.8, 2.2)
	},
	house: {
		sockets: S(g, g, p, g),
		tags: [
			"path",
			"house",
			"blocker"
		],
		biomes: B(1, 0, 0, 1.1, .45)
	},
	village: {
		sockets: S(p, g, p, g),
		tags: [
			"path",
			"house",
			"village",
			"blocker"
		],
		biomes: B(1, 0, 0, 1, .08)
	},
	village_b: {
		sockets: S(p, g, p, g),
		tags: [
			"path",
			"house",
			"village",
			"blocker"
		],
		biomes: {
			heartland: 1,
			blossom: 1
		}
	},
	village_green: {
		sockets: S(p, g, p, g),
		tags: ["path", "village"],
		biomes: {
			heartland: 1,
			blossom: 1
		}
	},
	river_reeds: {
		sockets: S(r, g, r, g),
		tags: ["water"],
		biomes: {
			heartland: 1,
			blossom: 1,
			pinewood: .8
		}
	},
	river_straight: {
		sockets: S(r, g, r, g),
		tags: ["water"]
	},
	river_corner: {
		sockets: S(r, r, g, g),
		tags: ["water"]
	},
	river_source: {
		sockets: S(g, g, r, g),
		tags: ["water", "blocker"]
	},
	bridge: {
		sockets: S(p, r, p, r),
		tags: [
			"path",
			"water",
			"bridge"
		]
	},
	desert_dunes: {
		sockets: S(g, g, g, g),
		tags: ["hills", "blocker"],
		biomes: { desert: .8 }
	},
	desert_dunes_b: {
		sockets: S(g, g, g, g),
		tags: ["hills", "blocker"],
		biomes: { desert: .7 }
	},
	desert_dunes_c: {
		sockets: S(g, g, g, g),
		tags: ["hills", "blocker"],
		biomes: { desert: .7 }
	},
	desert_cacti: {
		sockets: S(g, g, g, g),
		tags: ["forest", "blocker"],
		biomes: { desert: 1.8 }
	},
	desert_camp: {
		sockets: S(g, g, p, g),
		tags: [
			"path",
			"house",
			"blocker"
		],
		biomes: { desert: 2.2 }
	},
	desert_oasis: {
		sockets: S(g, g, g, g),
		tags: ["water", "blocker"],
		biomes: { desert: .3 }
	},
	desert_market: {
		sockets: S(p, g, p, g),
		tags: ["path", "blocker"],
		biomes: { desert: 1.6 }
	},
	desert_ruin: {
		sockets: S(g, g, g, g),
		tags: ["landmark", "blocker"],
		biomes: { desert: .5 }
	},
	snow_pines: {
		sockets: S(g, g, g, g),
		tags: ["forest", "blocker"],
		biomes: { snow: 2.2 }
	},
	snow_drifts: {
		sockets: S(g, g, g, g),
		tags: ["open"],
		biomes: { snow: 2 }
	},
	snow_cabin: {
		sockets: S(g, g, p, g),
		tags: [
			"path",
			"house",
			"blocker"
		],
		biomes: { snow: 3 }
	},
	snow_hamlet: {
		sockets: S(p, g, p, g),
		tags: [
			"path",
			"house",
			"blocker"
		],
		biomes: { snow: 1.5 }
	},
	frozen_pond: {
		sockets: S(g, g, g, g),
		tags: ["water", "blocker"],
		biomes: { snow: .3 }
	},
	blossom_orchard: {
		sockets: S(g, g, g, g),
		tags: ["forest", "blocker"],
		biomes: { blossom: 3 }
	},
	blossom_garden: {
		sockets: S(g, g, g, g),
		tags: ["open"],
		biomes: { blossom: 2 }
	},
	blossom_gazebo: {
		sockets: S(g, g, p, g),
		tags: [
			"path",
			"landmark",
			"blocker"
		],
		biomes: { blossom: 3 }
	},
	blossom_lane: {
		sockets: S(p, g, p, g),
		tags: ["path", "forest"],
		biomes: { blossom: 1.6 }
	},
	deep_pines: {
		sockets: S(g, g, g, g),
		tags: ["forest", "blocker"],
		biomes: { pinewood: 6 }
	},
	mushroom_glade: {
		sockets: S(g, g, g, g),
		tags: ["open", "landmark"],
		biomes: { pinewood: 1.5 }
	},
	fallen_log: {
		sockets: S(g, g, g, g),
		tags: ["blocker"],
		biomes: { pinewood: 1.8 }
	},
	watchtower: {
		sockets: S(g, g, p, g),
		tags: [
			"path",
			"landmark",
			"blocker"
		],
		biomes: { pinewood: 2.5 }
	},
	church: {
		sockets: S(g, g, p, g),
		tags: [
			"path",
			"landmark",
			"blocker"
		],
		biomes: {
			heartland: .6,
			blossom: .5
		}
	},
	barn_farm: {
		sockets: S(g, g, g, g),
		tags: ["landmark", "blocker"],
		biomes: {
			heartland: .16,
			blossom: .12
		}
	},
	market_square: {
		sockets: S(p, p, p, p),
		tags: ["path", "landmark"],
		biomes: {
			heartland: 1,
			blossom: .6
		}
	},
	manor: {
		sockets: S(g, g, p, g),
		tags: [
			"path",
			"house",
			"landmark",
			"blocker"
		],
		biomes: {
			heartland: .7,
			blossom: .5
		}
	},
	house_1: {
		sockets: S(g, g, p, g),
		tags: [
			"path",
			"house",
			"blocker"
		],
		biomes: B(1, 0, 0, 1.1, .45)
	},
	house_2: {
		sockets: S(g, g, p, g),
		tags: [
			"path",
			"house",
			"blocker"
		],
		biomes: B(1, 0, 0, 1.1, .45)
	},
	house_3: {
		sockets: S(g, g, p, g),
		tags: [
			"path",
			"house",
			"blocker"
		],
		biomes: B(1, 0, 0, 1.1, .45)
	},
	manor_2: {
		sockets: S(g, g, p, g),
		tags: [
			"path",
			"house",
			"landmark",
			"blocker"
		],
		biomes: {
			heartland: .7,
			blossom: .5
		}
	},
	manor_3: {
		sockets: S(g, g, p, g),
		tags: [
			"path",
			"house",
			"landmark",
			"blocker"
		],
		biomes: {
			heartland: .7,
			blossom: .5
		}
	},
	rail_straight: {
		sockets: S("rail", g, "rail", g),
		tags: ["rail"]
	},
	rail_corner: {
		sockets: S("rail", "rail", g, g),
		tags: ["rail"]
	},
	crossing: {
		sockets: S("crossing", "crossing", "crossing", "crossing"),
		tags: ["crossing"]
	},
	depot: {
		sockets: S("rail", "path", "rail", "path"),
		tags: [
			"rail",
			"path",
			"landmark"
		]
	},
	depot_custom: {
		sockets: S("rail", "path", "rail", "path"),
		tags: [
			"rail",
			"path",
			"landmark"
		],
		custom: true
	},
	city_hall: {
		sockets: S("path", "grass", "path", "grass"),
		tags: [
			"path",
			"landmark",
			"blocker"
		],
		biomes: { heartland: 1 }
	},
	masonic_temple: {
		sockets: S("path", "grass", "path", "grass"),
		tags: [
			"path",
			"landmark",
			"blocker"
		],
		biomes: { heartland: 1 }
	},
	st_matthews_cathedral: {
		sockets: S("path", "grass", "path", "grass"),
		tags: [
			"path",
			"landmark",
			"blocker"
		],
		biomes: { heartland: 1 }
	},
	first_interstate_bank: {
		sockets: S("path", "grass", "path", "grass"),
		tags: [
			"path",
			"landmark",
			"blocker"
		],
		biomes: { heartland: 1 }
	},
	albany_courthouse: {
		sockets: S("path", "grass", "path", "grass"),
		tags: [
			"path",
			"landmark",
			"blocker"
		],
		biomes: { heartland: 1 }
	},
	wyo_theatre: {
		sockets: S("path", "path", "path", "path"),
		tags: ["path", "landmark"],
		biomes: { heartland: 1 }
	},
	laramie_fire_station: {
		sockets: S("path", "grass", "path", "grass"),
		tags: [
			"path",
			"landmark",
			"blocker"
		],
		biomes: { heartland: 1 }
	},
	durlacher_house: {
		sockets: S("grass", "grass", "path", "grass"),
		tags: [
			"path",
			"house",
			"landmark",
			"blocker"
		],
		biomes: { heartland: 1 }
	},
	blair_house: {
		sockets: S("grass", "grass", "path", "grass"),
		tags: [
			"path",
			"house",
			"landmark",
			"blocker"
		],
		biomes: { heartland: 1 }
	},
	alien_dwelling: {
		sockets: S(g, g, p, g),
		tags: [
			"path",
			"house",
			"blocker"
		],
		biomes: { heartland: 3 }
	},
	alien_landmark: {
		sockets: S(g, g, g, g),
		tags: ["landmark", "blocker"],
		biomes: {
			heartland: 2,
			pinewood: 1.5
		}
	},
	alien_crystal: {
		sockets: S(g, g, g, g),
		tags: ["blocker"],
		biomes: { desert: 4 }
	},
	alien_meadow: {
		sockets: S(g, g, g, g),
		tags: ["open"],
		biomes: { heartland: 2 }
	},
	alien_grove: {
		sockets: S(g, g, g, g),
		tags: ["forest", "blocker"],
		biomes: { heartland: 1.5 }
	},
	alien_stones: {
		sockets: S(g, g, g, g),
		tags: ["hills", "blocker"],
		biomes: { heartland: 1.2 }
	},
	pod_dwelling: {
		sockets: S(g, g, p, g),
		tags: [
			"path",
			"house",
			"blocker"
		],
		biomes: { heartland: 2.5 }
	},
	glowpool: {
		sockets: S(g, g, g, g),
		tags: ["water", "blocker"],
		biomes: { heartland: .8 }
	},
	crystal_field_a: {
		sockets: S(g, g, g, g),
		tags: ["open"],
		biomes: { desert: 1.5 }
	},
	crystal_field_b: {
		sockets: S(g, g, g, g),
		tags: ["open"],
		biomes: { desert: 1.2 }
	},
	crystal_spire: {
		sockets: S(g, g, g, g),
		tags: ["landmark", "blocker"],
		biomes: { desert: 2.5 }
	},
	spire_forest_a: {
		sockets: S(g, g, g, g),
		tags: ["forest", "blocker"],
		biomes: { pinewood: 3 }
	},
	spire_forest_b: {
		sockets: S(g, g, g, g),
		tags: ["forest", "blocker"],
		biomes: { pinewood: 2.5 }
	},
	ruin_arch: {
		sockets: S(g, g, g, g),
		tags: ["landmark", "blocker"],
		biomes: { desert: 2 }
	},
	ruin_wall: {
		sockets: S(g, g, g, g),
		tags: ["hills", "blocker"],
		biomes: { desert: 1.5 }
	},
	glass_dunes: {
		sockets: S(g, g, g, g),
		tags: ["open"],
		biomes: { desert: 1.3 }
	},
	giant_mushroom: {
		sockets: S(g, g, g, g),
		tags: ["landmark", "blocker"],
		biomes: { pinewood: 2.5 }
	},
	fallen_spire: {
		sockets: S(g, g, g, g),
		tags: ["hills", "blocker"],
		biomes: { pinewood: 2 }
	},
	bulb_patch: {
		sockets: S(g, g, g, g),
		tags: ["open"],
		biomes: { blossom: 2 }
	},
	lantern_flower: {
		sockets: S(g, g, g, g),
		tags: ["landmark", "blocker"],
		biomes: { blossom: 2.5 }
	},
	bone_spire: {
		sockets: S(g, g, g, g),
		tags: ["landmark", "blocker"],
		biomes: { snow: 2.5 }
	},
	ash_cones: {
		sockets: S(g, g, g, g),
		tags: ["hills", "blocker"],
		biomes: { snow: 1.5 }
	},
	frost_moss: {
		sockets: S(g, g, g, g),
		tags: ["open"],
		biomes: { snow: 1.2 }
	},
	alien_river: {
		sockets: S(p, g, p, g),
		tags: ["path", "water"],
		biomes: {}
	}
};
var MODEL_IDS = Object.keys(MODELS);
var FALLBACK_MODEL = "meadow";
/** Sockets of a model after `rot` clockwise quarter turns. */
function rotateSockets(s, rot = 0) {
	let out = s;
	for (let i = 0; i < (rot % 4 + 4) % 4; i++) out = {
		n: out.w,
		e: out.n,
		s: out.e,
		w: out.s
	};
	return out;
}
/** three.js Y rotation for a tile with `rot` clockwise quarter turns. */
function rotToY(rot) {
	return -rot * Math.PI * .5;
}
// src/assets/loader.js
var P$1 = CONFIG.palette;
function baseTexture(id) {
	const N = 128;
	const c = document.createElement("canvas");
	c.width = c.height = N;
	const g = c.getContext("2d");
	g.fillStyle = P$1.sage;
	g.fillRect(0, 0, N, N);
	const s = MODELS[id].sockets;
	const u = N / TILE_SIZE;
	const strip = (dir, width, color) => {
		const w = width * u;
		g.fillStyle = color;
		const m = N / 2;
		if (dir === "n") g.fillRect(m - w / 2, 0, w, m + w / 2);
		if (dir === "s") g.fillRect(m - w / 2, m - w / 2, w, m + w / 2);
		if (dir === "e") g.fillRect(m - w / 2, m - w / 2, m + w / 2, w);
		if (dir === "w") g.fillRect(0, m - w / 2, m + w / 2, w);
	};
	for (const d of [
		"n",
		"e",
		"s",
		"w"
	]) if (s[d] === "river") strip(d, RIVER_WIDTH, P$1.teal);
	for (const d of [
		"n",
		"e",
		"s",
		"w"
	]) if (s[d] === "path") strip(d, PATH_WIDTH, P$1.kraft);
	if (id === "pond") {
		g.fillStyle = P$1.teal;
		g.beginPath();
		g.arc(N / 2, N / 2, .6 * u, 0, Math.PI * 2);
		g.fill();
	}
	g.strokeStyle = "rgba(74,52,38,0.18)";
	g.lineWidth = 1;
	g.strokeRect(.5, .5, 127, 127);
	const t = new CanvasTexture(c);
	t.colorSpace = SRGBColorSpace;
	t.anisotropy = 4;
	return t;
}
function shapeFor(kind, w, h) {
	const s = new Shape();
	const a = w / 2;
	if (kind === "tri") {
		s.moveTo(-a, 0);
		s.lineTo(a, 0);
		s.lineTo(0, h);
		s.closePath();
	} else if (kind === "tree") {
		const t = w * .12;
		const th = h * .22;
		s.moveTo(-t, 0);
		s.lineTo(t, 0);
		s.lineTo(t, th);
		s.lineTo(a, th);
		s.lineTo(0, h);
		s.lineTo(-a, th);
		s.lineTo(-t, th);
		s.closePath();
	} else if (kind === "arch") {
		s.moveTo(-a, 0);
		s.lineTo(a, 0);
		s.absellipse(0, 0, a, h, 0, Math.PI, false);
		s.closePath();
	} else if (kind === "house") {
		s.moveTo(-a, 0);
		s.lineTo(a, 0);
		s.lineTo(a, h * .6);
		s.lineTo(0, h);
		s.lineTo(-a, h * .6);
		s.closePath();
	} else {
		s.moveTo(-a, 0);
		s.lineTo(a, 0);
		s.lineTo(a, h);
		s.lineTo(-a, h);
		s.closePath();
	}
	return s;
}
var geoCache = /* @__PURE__ */ new Map();
function flapGeometry(kind, w, h) {
	const key = kind + "|" + w + "|" + h;
	let geo = geoCache.get(key);
	if (!geo) {
		geo = new ShapeGeometry(shapeFor(kind, w, h), 10);
		geoCache.set(key, geo);
	}
	return geo;
}
var tuft = (x, z) => [
	"tri",
	.28,
	.2,
	x,
	z,
	0,
	P$1.olive,
	1
];
var tree = (x, z, h = 1, c = P$1.moss) => [
	"tree",
	h * .62,
	h,
	x,
	z,
	0,
	c,
	1
];
var RECIPES = {
	meadow: [tuft(-.5, -.3), tuft(.45, .4)],
	meadow_flowers: [
		tuft(-.55, .2),
		[
			"tri",
			.16,
			.26,
			.1,
			-.4,
			0,
			P$1.mustard,
			1
		],
		[
			"tri",
			.16,
			.22,
			.5,
			.35,
			0,
			P$1.terracotta,
			1
		]
	],
	hills: [
		[
			"arch",
			1.7,
			.75,
			0,
			-.45,
			0,
			P$1.olive,
			1
		],
		[
			"arch",
			1.25,
			.5,
			-.2,
			0,
			0,
			P$1.sage,
			1
		],
		[
			"arch",
			.8,
			.32,
			.35,
			.45,
			0,
			P$1.moss,
			1
		]
	],
	forest: [
		tree(-.55, -.6, 1.15),
		tree(.45, -.5, 1, P$1.olive),
		tree(-.1, -.1, .95),
		tree(-.6, .35, .8, P$1.olive),
		tree(.55, .3, .9)
	],
	grove: [tree(-.4, -.3, 1), tree(.45, .2, .8, P$1.olive)],
	rocks: [[
		"arch",
		.7,
		.4,
		-.2,
		-.1,
		0,
		P$1.paperShade,
		1
	], [
		"arch",
		.45,
		.26,
		.35,
		.3,
		0,
		P$1.kraft,
		1
	]],
	pond: [
		tuft(-.75, -.6),
		[
			"rect",
			.06,
			.4,
			.7,
			-.5,
			0,
			P$1.olive,
			1
		],
		[
			"rect",
			.06,
			.32,
			.8,
			-.42,
			0,
			P$1.moss,
			1
		]
	],
	windmill: [
		[
			"rect",
			.42,
			1.2,
			0,
			-.2,
			0,
			P$1.paper,
			1
		],
		[
			"tri",
			1,
			.5,
			0,
			-.18,
			0,
			P$1.terracotta,
			1
		],
		tuft(.6, .5)
	],
	path_straight: [tuft(.65, -.5), tuft(-.6, .45)],
	path_corner: [tuft(-.6, .55), tree(-.6, -.55, .7, P$1.olive)],
	path_t: [tuft(-.6, -.6), tuft(.6, -.6)],
	path_cross: [tuft(-.7, -.7), tuft(.7, .7)],
	path_end: [
		[
			"rect",
			.07,
			.55,
			0,
			-.1,
			0,
			P$1.ink,
			1
		],
		[
			"rect",
			.42,
			.16,
			0,
			-.08,
			0,
			P$1.kraft,
			1
		],
		tuft(.6, -.5)
	],
	lantern_post: [
		[
			"rect",
			.06,
			.95,
			.5,
			0,
			0,
			P$1.ink,
			1
		],
		[
			"rect",
			.2,
			.24,
			.5,
			.02,
			0,
			P$1.lantern,
			1
		],
		tuft(-.65, .4)
	],
	house: [
		[
			"house",
			.9,
			.95,
			0,
			-.45,
			0,
			P$1.paper,
			1
		],
		[
			"tri",
			1.1,
			.5,
			0,
			-.42,
			0,
			P$1.terracotta,
			1
		],
		tree(.7, -.1, .7, P$1.olive)
	],
	village: [
		[
			"house",
			.6,
			.8,
			-.62,
			-.3,
			0,
			P$1.paper,
			1
		],
		[
			"house",
			.6,
			.9,
			.62,
			.1,
			0,
			P$1.paperShade,
			1
		],
		[
			"tri",
			.72,
			.4,
			-.62,
			-.28,
			0,
			P$1.terracotta,
			1
		],
		[
			"tri",
			.72,
			.42,
			.62,
			.12,
			0,
			P$1.rust,
			1
		]
	],
	river_straight: [[
		"rect",
		.06,
		.36,
		.6,
		-.4,
		0,
		P$1.olive,
		1
	], tuft(-.65, .5)],
	river_corner: [tuft(-.6, .6), [
		"rect",
		.06,
		.36,
		-.55,
		-.2,
		0,
		P$1.olive,
		1
	]],
	river_source: [[
		"arch",
		.9,
		.5,
		0,
		-.25,
		0,
		P$1.paperShade,
		1
	], [
		"arch",
		.5,
		.3,
		.3,
		-.1,
		0,
		P$1.kraft,
		1
	]],
	bridge: [[
		"arch",
		1.3,
		.34,
		-.3,
		0,
		90,
		P$1.kraft,
		1
	], [
		"arch",
		1.3,
		.34,
		.3,
		0,
		90,
		P$1.kraft,
		-1
	]]
};
function buildPlaceholderTile(id, materials) {
	const group = new Group();
	group.name = id;
	group.userData.model = id;
	const base = new Mesh(new PlaneGeometry(TILE_SIZE, TILE_SIZE).rotateX(-Math.PI / 2), materials.paper({
		color: "#ffffff",
		map: baseTexture(id),
		side: 0
	}));
	base.name = "base";
	base.receiveShadow = true;
	group.add(base);
	const recipe = RECIPES[id] || RECIPES["meadow"];
	recipe.forEach(([kind, w, h, x, z, ry, color, sign], i) => {
		const flap = new Group();
		flap.name = "flap_" + i;
		flap.position.set(x, FLAP_LAYER_GAP * (i + 1), z);
		flap.rotation.y = MathUtils.degToRad(ry);
		flap.userData = {
			hinge: true,
			foldAngle: sign * Math.PI / 2,
			delay: recipe.length > 1 ? i / (recipe.length - 1) : 0,
			layer: i,
			size: Math.min(1, h / TILE_SIZE)
		};
		const mesh = new Mesh(flapGeometry(kind, w, h), materials.paper({
			color,
			side: 2
		}));
		mesh.name = "flap_" + i + "_mesh";
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		flap.add(mesh);
		group.add(flap);
	});
	return group;
}
function buildPlaceholderTraveller(materials) {
	const H = CONFIG.TRAVELLER_HEIGHT;
	const root = new Group();
	root.name = "traveller";
	const cloak = new Shape();
	cloak.moveTo(-.15, 0);
	cloak.lineTo(.15, 0);
	cloak.lineTo(.08, H * .68);
	cloak.lineTo(-.08, H * .68);
	cloak.closePath();
	const bodyMat = materials.paper({
		color: P$1.terracotta,
		side: 2
	});
	const body = new Mesh(new ShapeGeometry(cloak), bodyMat);
	body.name = "body";
	const side = body.clone();
	side.name = "body_side";
	side.rotation.y = Math.PI / 2;
	side.scale.x = .7;
	const head = new Mesh(new CircleGeometry(H * .17, 20), materials.paper({
		color: P$1.paper,
		side: 2
	}));
	head.name = "head";
	head.position.y = H * .8;
	const hat = new Mesh(flapGeometry("tri", .3, .16), materials.paper({
		color: P$1.ink,
		side: 2
	}));
	hat.name = "hat";
	hat.position.set(0, H * .9, .002);
	const lantern = new Mesh(new BoxGeometry(.07, .09, .07), new MeshStandardMaterial({
		color: P$1.lantern,
		emissive: P$1.lantern,
		emissiveIntensity: 2,
		roughness: 1
	}));
	lantern.name = "lantern";
	lantern.position.set(.2, H * .42, .06);
	for (const m of [
		body,
		side,
		head,
		hat,
		lantern
	]) {
		m.castShadow = true;
		root.add(m);
	}
	lantern.castShadow = false;
	root.animations = [];
	return root;
}
var warnings = [];
function warn(...a) {
	warnings.push(a.join(" "));
	console.warn("[assets]", ...a);
}
async function loadGLTF(url) {
	try {
		return await new GLTFLoader().loadAsync(url);
	} catch (err) {
		warn("could not load", url, "-", err && err.message ? err.message : String(err));
		return null;
	}
}
/** Blender object names are globally unique, so they carry a '<model>__' prefix: strip it. */
function stripName(name, prefix) {
	let n = String(name || "");
	if (n.startsWith(prefix)) n = n.slice(prefix.length);
	return n;
}
function renameClips(clips, prefix) {
	return (clips || []).map((c) => {
		const clip = c.clone();
		for (const t of clip.tracks) {
			const i = t.name.indexOf(prefix);
			if (i >= 0) t.name = t.name.slice(0, i) + t.name.slice(i + prefix.length);
		}
		return clip;
	});
}
/**
* Turn one exported top-level node into a prototype: strip name prefixes, swap in the shared materials,
* normalise the hinge userData, set shadow flags. Returns { hinges, triangles, meshes }.
*/
function adopt(root, prefix, mats, opts = {}) {
	const modelId = prefix.replace("__", "");
	const isBuilding = /^\d+$/.test(modelId);
	const stats = {
		hinges: 0,
		triangles: 0,
		meshes: 0,
		bad: 0
	};
	root.traverse((o) => {
		o.name = stripName(o.name, prefix);
		const ud = o.userData || (o.userData = {});
		if (ud.hinge) {
			ud.hinge = true;
			ud.foldAngle = Number(ud.foldAngle);
			ud.delay = Math.min(1, Math.max(0, Number(ud.delay) || 0));
			ud.layer = Math.max(0, Math.round(Number(ud.layer) || 0));
			if (!Number.isFinite(ud.foldAngle)) {
				ud.foldAngle = Math.PI / 2;
				stats.bad++;
			}
			stats.hinges++;
		}
		if (o.isMesh) {
			const glow = o.material && /glow/i.test(o.material.name || "");
			if (o.material && o.material.dispose) o.material.dispose();
			if (isBuilding && mats.building) o.material = glow ? mats.glow : mats.building;
			else o.material = glow ? mats.glow : mats.paper;
			const isBase = !glow && (o.name === "base" || o.parent && o.parent.name === "base");
			o.castShadow = !glow && !isBase && opts.castShadow !== false;
			o.receiveShadow = !glow;
			if (glow) o.userData.glow = true;
			const g = o.geometry;
			if (g) {
				if (!g.boundingSphere) g.computeBoundingSphere();
				if (!g.boundingBox) g.computeBoundingBox();
				stats.triangles += (g.index ? g.index.count : g.attributes.position.count) / 3;
			}
			stats.meshes++;
		}
	});
	return stats;
}
async function loadTexture(url, { srgb = false, repeat = true, flipY = true, anisotropy = 4 } = {}) {
	try {
		const t = await new TextureLoader().loadAsync(url);
		t.colorSpace = srgb ? SRGBColorSpace : "";
		t.wrapS = t.wrapT = repeat ? RepeatWrapping : ClampToEdgeWrapping;
		t.flipY = flipY;
		t.anisotropy = anisotropy;
		return t;
	} catch (err) {
		return null;
	}
}
async function fetchJSON(url) {
	try {
		if (typeof fetch !== "function") return null;
		const res = await fetch(url);
		if (!res.ok) return null;
		return await res.json();
	} catch (err) {
		return null;
	}
}
/** Paper, page and print maps from the runtime texture manifest (tolerates absence). */
async function loadTextures(A, anisotropy) {
	const out = {
		paper: null,
		paperNormal: null,
		paperRough: null,
		manifest: null,
		facadeAtlas: null
	};
	const jobs = [];
	const manifest = await fetchJSON(A.manifestUrl);
	if (manifest && typeof manifest === "object") {
		out.manifest = manifest;
		for (const key of Object.keys(manifest)) {
			const e = manifest[key];
			if (!e || typeof e !== "object" || !e.file) continue;
			const wrap = String(e.wrap || "repeat");
			jobs.push(loadTexture(A.texturesBase + e.file, {
				srgb: e.colorSpace === "srgb",
				repeat: wrap.indexOf("repeat") >= 0,
				flipY: e.flipY !== false,
				anisotropy
			}).then((t) => {
				if (!t) {
					warn("texture missing:", e.file);
					return;
				}
				if (wrap === "repeat,clamp") {
					t.wrapS = RepeatWrapping;
					t.wrapT = ClampToEdgeWrapping;
				}
				t.userData = {
					key,
					repeat: e.repeat || 1,
					type: e.type || "",
					manifest: e
				};
				if (e.type === "art-atlas") {
					t.flipY = false;
					t.wrapS = t.wrapT = ClampToEdgeWrapping;
					t.needsUpdate = true;
				}
				out[key] = t;
			}));
		}
	}
	const atlasUrl = `${A.texturesBase}facade_atlas.png`;
	out.facadeAtlas = await loadTexture(atlasUrl, {
		srgb: true,
		repeat: true,
		flipY: false,
		anisotropy
	});
	if (out.facadeAtlas) {
		out.facadeAtlas.wrapS = RepeatWrapping;
		out.facadeAtlas.wrapT = RepeatWrapping;
		out.facadeAtlas.magFilter = NearestFilter;
		out.facadeAtlas.minFilter = LinearMipmapLinearFilter;
	} else warn("facade atlas not found at", atlasUrl);
	await Promise.all(jobs);
	if (out.paper && !out.card) out.card = out.paper;
	if (out.paperNormal && !out.cardNormal) out.cardNormal = out.paperNormal;
	return out;
}
/**
* @returns {Promise<{getTilePrototype:(modelId:string)=>THREE.Group, traveller:THREE.Group,
*   textures:Record<string,any>, modelIds:string[], source:'placeholder'|'gltf'|'mixed',
*   meta:object|null, warnings:string[], stats:object}>}
*/
async function loadAssets({ materials, renderer, quality } = {}) {
	const A = CONFIG.assets;
	const caps = renderer && renderer.capabilities;
	const anisotropy = Math.min(8, caps && caps.getMaxAnisotropy && caps.getMaxAnisotropy() || 4);
	const noTex = () => ({
		paper: null,
		paperNormal: null,
		paperRough: null,
		manifest: null,
		facadeAtlas: null
	});
	const [textures, tilesGltf, alienGltf, travGltf, alienPlayerGltf, meta] = await Promise.all([
		loadTextures(A, anisotropy).catch(noTex),
		loadGLTF(A.tilesUrl),
		loadGLTF(A.alienTilesUrl).catch(() => null),
		loadGLTF(A.travellerUrl),
		loadGLTF(A.alienPlayerUrl).catch(() => null),
		fetchJSON(A.metaUrl)
	]);
	const mats = {
		paper: materials.paper({
			color: "#ffffff",
			side: 2
		}),
		glow: materials.paper({
			color: "#ffffff",
			side: 2,
			emissive: A.glowColor,
			emissiveIntensity: A.glowIntensity,
			fibre: "none",
			vary: false
		}),
		building: textures.facadeAtlas ? new MeshStandardMaterial({
			map: textures.facadeAtlas,
			alphaTest: .1,
			side: 2,
			roughness: .8,
			metalness: .1
		}) : materials.paper({
			color: "#ffffff",
			side: 2
		})
	};
	const travMats = {
		paper: materials.paper({
			color: "#ffffff",
			side: 2,
			variant: "traveller"
		}),
		glow: materials.paper({
			color: "#ffffff",
			side: 2,
			emissive: A.glowColor,
			emissiveIntensity: A.glowIntensity,
			fibre: "none",
			vary: false,
			variant: "traveller"
		}),
		building: textures.facadeAtlas ? new MeshStandardMaterial({
			map: textures.facadeAtlas,
			alphaTest: .1,
			side: 2,
			roughness: .8,
			metalness: .1
		}) : materials.paper({
			color: "#ffffff",
			side: 2,
			variant: "traveller"
		})
	};
	const protos = /* @__PURE__ */ new Map();
	const stats = {
		tiles: {},
		traveller: null
	};
	let fromGltf = 0;
	if (tilesGltf && tilesGltf.scene) {
		const byName = /* @__PURE__ */ new Map();
		for (const c of [...tilesGltf.scene.children]) byName.set(c.name, c);
		if (alienGltf && alienGltf.scene) for (const c of [...alienGltf.scene.children]) byName.set(c.name, c);
		const buildingIds = meta?.tiles ? Object.keys(meta.tiles).filter((k) => /^\d+$/.test(k)) : [];
		const allModelIds = [...MODEL_IDS, ...buildingIds];
		console.log("[assets] Loading models from tiles.glb:", MODEL_IDS.length, "generic +", buildingIds.length, "building OSM IDs =", allModelIds.length, "total");
		for (const id of allModelIds) {
			const node = byName.get(id);
			if (!node) continue;
			try {
				node.removeFromParent();
				node.position.set(0, 0, 0);
				node.quaternion.identity();
				node.scale.set(1, 1, 1);
				const st = adopt(node, id + "__", mats);
				if (!node.getObjectByName("base") || st.hinges === 0) {
					warn("tile", id, "has no base / flaps in tiles.glb - using placeholder");
					continue;
				}
				node.name = id;
				node.userData.model = id;
				node.updateMatrixWorld(true);
				protos.set(id, node);
				stats.tiles[id] = st;
				fromGltf++;
			} catch (err) {
				warn("tile", id, "failed:", err && err.message);
			}
		}
	}
	for (const id of MODEL_IDS) if (!protos.has(id)) {
		if (tilesGltf) warn("tile", id, "missing in tiles.glb - placeholder");
		protos.set(id, buildPlaceholderTile(id, materials));
	}
	if (!protos.has("meadow") && protos.has("alien_meadow")) protos.set(FALLBACK_MODEL, protos.get("alien_meadow").clone(true));
	let alienPlayer = null;
	if (alienPlayerGltf && alienPlayerGltf.scene) try {
		const node = alienPlayerGltf.scene.getObjectByName("alien_player") || alienPlayerGltf.scene.children[0];
		node.removeFromParent();
		node.position.set(0, 0, 0);
		node.quaternion.identity();
		node.scale.set(1, 1, 1);
		node.name = "alien_player";
		alienPlayer = node;
	} catch (err) {
		warn("alienPlayer failed:", err && err.message);
		alienPlayer = null;
	}
	let traveller = null;
	if (travGltf && travGltf.scene) try {
		const node = travGltf.scene.getObjectByName("traveller") || travGltf.scene.children[0];
		node.removeFromParent();
		node.position.set(0, 0, 0);
		node.quaternion.identity();
		node.scale.set(1, 1, 1);
		stats.traveller = adopt(node, "traveller__", travMats);
		node.name = "traveller";
		node.animations = renameClips(travGltf.animations, "traveller__");
		const s = CONFIG.TRAVELLER_HEIGHT / (node.userData.height || CONFIG.TRAVELLER_HEIGHT);
		if (Math.abs(s - 1) > .001) node.scale.setScalar(s);
		const tab = node.getObjectByName("base_tab");
		if (tab && A.travellerBaseTab === false) tab.visible = false;
		traveller = node;
	} catch (err) {
		warn("traveller failed:", err && err.message);
		traveller = null;
	}
	const travFromGltf = !!traveller;
	if (!traveller) traveller = buildPlaceholderTraveller(materials);
	const n = MODEL_IDS.length;
	const source = fromGltf === n && travFromGltf ? "gltf" : fromGltf === 0 && !travFromGltf ? "placeholder" : "mixed";
	const warned = /* @__PURE__ */ new Set();
	return {
		/** Shared prototype (do NOT mutate or add to the scene): use getTilePrototype(id).clone(true). */
		getTilePrototype(modelId) {
			const p = protos.get(modelId);
			if (p) return p;
			if (!warned.has(modelId)) {
				warned.add(modelId);
				console.warn("[assets] unknown tile model", modelId);
			}
			return protos.get(FALLBACK_MODEL);
		},
		traveller,
		alienPlayer,
		textures,
		modelIds: Array.from(protos.keys()),
		source,
		/** public/models/assets_meta.json (per-tile numbers, bridge deck profile, lantern post position) or null. */
		meta,
		materials: mats,
		warnings,
		stats
	};
}
// src/core/rng.js
/** mulberry32 PRNG. Returns a function () => float in [0,1). */
function mulberry32(seed) {
	let a = seed >>> 0;
	return function next() {
		a = a + 1831565813 >>> 0;
		let t = a;
		t = Math.imul(t ^ t >>> 15, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 61);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
/** Integer hash of a 2D integer coordinate + seed -> uint32. Order independent, stateless. */
function hash2(x, y, seed = 0) {
	let h = (seed | 0) ^ 2654435769;
	h = Math.imul(h ^ (x | 0), 2246822507);
	h = h << 13 | h >>> 19;
	h = Math.imul(h ^ (y | 0), 3266489909);
	h ^= h >>> 16;
	h = Math.imul(h, 2146121005);
	h ^= h >>> 15;
	h = Math.imul(h, 2221713035);
	h ^= h >>> 16;
	return h >>> 0;
}
/** hash2 mapped to a float in [0,1). */
function hash2f(x, y, seed = 0) {
	return hash2(x, y, seed) / 4294967296;
}
// src/world/tiles.js
var ALL = [
	0,
	1,
	2,
	3
];
var isAllGrass = (s) => s.n === "grass" && s.e === "grass" && s.s === "grass" && s.w === "grass";
/** @type {Array<{id:string, model:string, sockets:{n:string,e:string,s:string,w:string}, weight:number, rotations:number[], tags:string[], biomes:Object<string,number>|null}>} */
var TILES = Object.entries(MODELS).map(([id, m]) => Object.freeze({
	id,
	model: id,
	sockets: Object.freeze({ ...m.sockets }),
	weight: wfc.weights[id] ?? 1,
	rotations: Object.freeze((isAllGrass(m.sockets) ? wfc.rotations[id] || ALL : ALL).slice()),
	tags: Object.freeze(m.tags.slice()),
	biomes: m.biomes ? Object.freeze({ ...m.biomes }) : null
}));
var BY_ID = new Map(TILES.map((t) => [t.id, t]));
var FALLBACK_TILE = FALLBACK_MODEL;
function getTile(id) {
	return BY_ID.get(id) || BY_ID.get(FALLBACK_TILE);
}
var SOCKET_CACHE = /* @__PURE__ */ new Map();
/** Sockets of tile `id` after `rot` clockwise quarter turns (shared frozen object). */
function socketsOf(id, rot = 0) {
	const t = getTile(id);
	const r = (rot % 4 + 4) % 4;
	const key = t.id + ":" + r;
	let s = SOCKET_CACHE.get(key);
	if (!s) {
		s = Object.freeze(rotateSockets(t.sockets, r));
		SOCKET_CACHE.set(key, s);
	}
	return s;
}
var SOCKET_CODE = Object.freeze({
	grass: 0,
	path: 1,
	river: 2,
	rail: 3,
	crossing: 4
});
/**
* Solver options: one per (tile, distinct rotated socket signature). Rotations that give the same
* signature (path_straight rot 0/2, every rotation of an all-grass tile) are ONE option; the visible
* rotation is picked afterwards by a per-cell hash from `rots`.
* sig = socket codes [n, e, s, w].
*/
var OPTIONS = (() => {
	const out = [];
	TILES.forEach((tile, t) => {
		const groups = /* @__PURE__ */ new Map();
		for (const rot of tile.rotations) {
			const s = socketsOf(tile.id, rot);
			const sig = DIRS.map((d) => SOCKET_CODE[s[d]]);
			const key = sig.join("");
			if (!groups.has(key)) groups.set(key, {
				sig,
				rots: []
			});
			groups.get(key).rots.push(rot);
		}
		for (const g of groups.values()) out.push(Object.freeze({
			index: out.length,
			t,
			tileId: tile.id,
			tile,
			sig: Object.freeze(g.sig),
			rots: Object.freeze(g.rots)
		}));
	});
	return Object.freeze(out);
})();
/** Tiles the solver needs in every biome (sockets must always connect across biome borders): never banned. */
var UNIVERSAL_TILES = Object.freeze([
	"meadow",
	"path_straight",
	"path_corner",
	"path_t",
	"path_cross",
	"path_end",
	"river_straight",
	"river_corner",
	"river_source",
	"bridge",
	"rail_straight",
	"rail_corner",
	"crossing",
	"depot"
]);
/** WFC weight multiplier of a tile in a biome (schema: top of core/models.js). 0 = not allowed there. */
function biomeMultiplier(tileOrId, biomeId) {
	const t = typeof tileOrId === "string" ? getTile(tileOrId) : tileOrId;
	if (!t || !t.biomes) return 1;
	const v = +t.biomes[biomeId];
	if (v > 0) return v;
	return UNIVERSAL_TILES.includes(t.id) ? 1 : 0;
}
// src/core/biomes.js
var BIOMES = [
	"heartland",
	"desert",
	"snow",
	"blossom",
	"pinewood"
];
var BIOME_INDEX = {
	heartland: 0,
	desert: 1,
	snow: 2,
	blossom: 3,
	pinewood: 4
};
function h2(seed, x, y, k) {
	let h = (Math.imul(x | 0, 2654435761) ^ Math.imul(y | 0, 2246822507) ^ Math.imul((seed | 0) + k * 1663821227, 3266489909)) >>> 0;
	h ^= h >>> 15;
	h = Math.imul(h, 739982445) >>> 0;
	h ^= h >>> 12;
	h = Math.imul(h, 695872825) >>> 0;
	h ^= h >>> 15;
	return (h >>> 0) / 4294967296;
}
function siteBiome(seed, gx, gy) {
	if (gx === 0 && gy === 0) return 0;
	if (gy === 0 && gx === 1) return 1;
	if (gy === 0 && gx === -1) return 2;
	if (gx === 0 && gy === 1) return 3;
	if (gx === 0 && gy === -1) return 4;
	const r = h2(seed, gx, gy, 3);
	return r < .3 ? 0 : 1 + Math.min(3, Math.floor((r - .3) / .7 * 4));
}
function vnoise(seed, x, y, k) {
	const xi = Math.floor(x);
	const yi = Math.floor(y);
	const fx = x - xi;
	const fy = y - yi;
	const ux = fx * fx * (3 - 2 * fx);
	const uy = fy * fy * (3 - 2 * fy);
	const a = h2(seed, xi, yi, k);
	const b = h2(seed, xi + 1, yi, k);
	const c = h2(seed, xi, yi + 1, k);
	const d = h2(seed, xi + 1, yi + 1, k);
	return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}
var _d = new Float64Array(BIOMES.length);
/** Fills _d with the distance (tiles) from (x, z) to the nearest site of each biome. x, z in TILE units (floats ok). */
function distances(seed, x, z) {
	const wx = x + (vnoise(seed, x / 5.5, z / 5.5, 11) - .5) * 3.2;
	const wz = z + (vnoise(seed, x / 5.5, z / 5.5, 12) - .5) * 3.2;
	const gx0 = Math.round(wx / 11);
	const gy0 = Math.round(wz / 11);
	for (let i = 0; i < _d.length; i++) _d[i] = 1e9;
	for (let gy = gy0 - 2; gy <= gy0 + 2; gy++) for (let gx = gx0 - 2; gx <= gx0 + 2; gx++) {
		const origin = gx === 0 && gy === 0;
		const sx = (gx + (origin ? 0 : (h2(seed, gx, gy, 1) - .5) * .7)) * 11;
		const sz = (gy + (origin ? 0 : (h2(seed, gx, gy, 2) - .5) * .7)) * 11;
		const d = Math.sqrt((wx - sx) * (wx - sx) + (wz - sz) * (wz - sz));
		const b = siteBiome(seed, gx, gy);
		if (d < _d[b]) _d[b] = d;
	}
}
/** Biome index (into BIOMES) of the cell / tile-space point. */
function biomeIndexAt(seed, cx, cz) {
	distances(seed, cx, cz);
	let best = 0;
	for (let i = 1; i < _d.length; i++) if (_d[i] < _d[best]) best = i;
	return best;
}
/** Biome id ('heartland' | 'desert' | ...) of cell (cx, cz). */
function biomeAt(seed, cx, cz) {
	return BIOMES[biomeIndexAt(seed, cx, cz)];
}
/**
* Smooth blend weights (sum = 1) of every biome around a point, for weather / light / sound cross-fades.
* @param {number} x tile-space X (world x / TILE_SIZE)  @param {number} z tile-space Z
* @param {Float32Array|number[]} out length BIOMES.length  @param {number} [soft=1.6] blend half-width in tiles
*/
function biomeWeights(seed, x, z, out, soft = 1.6) {
	distances(seed, x, z);
	let min = 1e9;
	for (let i = 0; i < _d.length; i++) if (_d[i] < min) min = _d[i];
	let sum = 0;
	for (let i = 0; i < _d.length; i++) {
		const w = Math.exp(-(_d[i] - min) / soft);
		out[i] = w;
		sum += w;
	}
	for (let i = 0; i < _d.length; i++) out[i] /= sum;
	return out;
}
// src/world/buildingOptions.js
var BUILDING_OPTION_INDICES = {
	house: [
		25,
		26,
		27,
		28
	],
	house_1: [
		25,
		26,
		27,
		28
	],
	house_2: [
		25,
		26,
		27,
		28
	],
	house_3: [
		25,
		26,
		27,
		28
	],
	village: [29, 30],
	village_b: [31, 32],
	village_green: [33, 34],
	church: [
		85,
		86,
		87,
		88
	],
	market_square: [90],
	manor: [
		91,
		92,
		93,
		94
	],
	manor_2: [
		91,
		92,
		93,
		94
	],
	manor_3: [
		91,
		92,
		93,
		94
	]
};
// src/world/wfc.js
var N = 8;
var NN = 64;
var G = 0;
var P = 1;
var R = 2;
var DX = [
	0,
	1,
	0,
	-1
];
var DZ = [
	-1,
	0,
	1,
	0
];
var BIT = [
	1,
	2,
	4,
	8
];
var COORD_LIMIT = 1 << 24;
var NO = OPTIONS.length;
var SIG = new Uint8Array(NO * 4);
var OPT_T = new Uint8Array(NO);
var MASK_LO = /* @__PURE__ */ new Int32Array(20);
var MASK_HI = /* @__PURE__ */ new Int32Array(20);
var MASK_EX = /* @__PURE__ */ new Int32Array(20);
var MASK_EX2 = /* @__PURE__ */ new Int32Array(20);
var MASK_EX3 = /* @__PURE__ */ new Int32Array(20);
if (NO > 256) throw new Error("wfc: more than 256 solver options (" + NO + "); widen the domain bitmask");
var PATH_BITS = new Uint8Array(NO);
for (let o = 0; o < NO; o++) {
	OPT_T[o] = OPTIONS[o].t;
	for (let d = 0; d < 4; d++) {
		const s = OPTIONS[o].sig[d];
		SIG[o * 4 + d] = s;
		if (o < 32) MASK_LO[d * 5 + s] |= 1 << o;
		else if (o < 64) MASK_HI[d * 5 + s] |= 1 << o - 32;
		else if (o < 96) MASK_EX[d * 5 + s] |= 1 << o - 64;
		else if (o < 128) MASK_EX2[d * 5 + s] |= 1 << o - 96;
		else MASK_EX3[d * 5 + s] |= 1 << o - 128;
		if (s === P) PATH_BITS[o] |= BIT[d];
	}
}
var T = {};
TILES.forEach((t, i) => {
	T[t.id] = i;
});
var NT = TILES.length;
var IS_FILLER = new Uint8Array(NT);
for (const o of OPTIONS) if (o.sig.every((s) => s === G)) IS_FILLER[o.t] = 1;
var NEW_KIND = new Uint8Array(NT);
for (const [id, k] of [
	["desert_cacti", 1],
	["snow_pines", 1],
	["blossom_orchard", 1],
	["deep_pines", 1],
	["snow_drifts", 2],
	["blossom_garden", 2],
	["mushroom_glade", 2],
	["fallen_log", 2],
	["desert_dunes", 3],
	["desert_dunes_b", 3],
	["desert_dunes_c", 3]
]) if (T[id] !== void 0) NEW_KIND[T[id]] = k;
var IS_LM = new Uint8Array(NT);
var IS_CLEAR = new Uint8Array(NT);
var IS_TREES = new Uint8Array(NT);
var IS_OPEN = new Uint8Array(NT);
var IS_MASS = new Uint8Array(NT);
for (let t = 0; t < NT; t++) if ((TILES[t].tags || []).includes("landmark")) IS_LM[t] = 1;
for (const id of [
	"church",
	"manor",
	"market_square",
	"barn_farm",
	"windmill",
	"blossom_gazebo",
	"watchtower",
	"desert_ruin"
]) if (T[id] !== void 0) IS_CLEAR[T[id]] = 1;
for (const id of [
	"forest",
	"grove",
	"blossom_orchard",
	"deep_pines",
	"snow_pines",
	"hills"
]) if (T[id] !== void 0) IS_TREES[T[id]] = 1;
for (const id of [
	"meadow",
	"meadow_flowers",
	"blossom_garden",
	"snow_drifts"
]) if (T[id] !== void 0) IS_OPEN[T[id]] = 1;
for (const id of [
	"hills",
	"rocks",
	"deep_pines",
	"desert_dunes",
	"desert_dunes_b",
	"desert_dunes_c"
]) if (T[id] !== void 0) IS_MASS[T[id]] = 1;
var IS_HAMLET = new Uint8Array(NT);
for (const id of [
	"village",
	"village_b",
	"village_green"
]) if (T[id] !== void 0) IS_HAMLET[T[id]] = 1;
var PINEWOOD = BIOMES.indexOf("pinewood");
var nbT = new Uint8Array(NT);
var lmSeen = new Uint8Array(NT);
var OPT_BY = new Map(OPTIONS.map((o) => [o.tileId + ":" + o.sig.join(""), o.index]));
var FALLBACK_OPT = OPT_BY.get(FALLBACK_TILE + ":0000");
var HI_ALL = NO >= 64 ? -1 : NO > 32 ? (1 << NO - 32) - 1 : 0;
var EX_ALL = NO >= 96 ? -1 : NO > 64 ? (1 << NO - 64) - 1 : 0;
var EX2_ALL = NO >= 128 ? -1 : NO > 96 ? (1 << NO - 96) - 1 : 0;
/** Is option o in the 128-bit domain (lo, hi, ex, ex2)? */
var hasBit = (lo, hi, ex, ex2, o) => o < 32 ? lo >>> o & 1 : o < 64 ? hi >>> o - 32 & 1 : o < 96 ? ex >>> o - 64 & 1 : ex2 >>> o - 96 & 1;
var popcnt = (v) => {
	v -= v >>> 1 & 1431655765;
	v = (v & 858993459) + (v >>> 2 & 858993459);
	return (v + (v >>> 4) & 252645135) * 16843009 >>> 24;
};
var smooth$3 = (a, b, x) => {
	const t = x <= a ? 0 : x >= b ? 1 : (x - a) / (b - a);
	return t * t * (3 - 2 * t);
};
var req = /* @__PURE__ */ new Int8Array(256);
var rivMask = new Uint8Array(NN);
var trunkMask = new Uint8Array(NN);
var isSource = new Uint8Array(NN);
var distTrunk = new Uint8Array(NN);
var nearRiver = new Uint8Array(NN);
var runLen = /* @__PURE__ */ new Uint8Array(256);
var runEdge = /* @__PURE__ */ new Uint8Array(256);
var rCost = new Float32Array(NN);
var rBlocked = new Uint8Array(NN);
var edgeF = /* @__PURE__ */ new Float32Array(256);
var W = new Float64Array(NN * NO);
var WL = new Float64Array(NN * NO);
var domLo = new Int32Array(NN);
var domHi = new Int32Array(NN);
var domEx = new Int32Array(NN);
var domEx2 = new Int32Array(NN);
var domEx3 = new Int32Array(NN);
var res = new Int8Array(NN);
var ent = new Float64Array(NN);
var entOk = new Uint8Array(NN);
var queue = /* @__PURE__ */ new Int16Array(1024);
var inQueue = new Uint8Array(NN);
var MAX_DEPTH = 66;
var stLo = /* @__PURE__ */ new Int32Array(4224);
var stHi = /* @__PURE__ */ new Int32Array(4224);
var stEx = /* @__PURE__ */ new Int32Array(4224);
var stEx2 = /* @__PURE__ */ new Int32Array(4224);
var stEx3 = /* @__PURE__ */ new Int32Array(4224);
var stRes = /* @__PURE__ */ new Int8Array(4224);
var stCell = new Int16Array(MAX_DEPTH);
var stOpt = new Int16Array(MAX_DEPTH);
var pickW = new Float64Array(NO);
var fForest = new Float32Array(NN);
var fHill = new Float32Array(NN);
var fFlower = new Float32Array(NN);
var fSettle = new Float32Array(NN);
var cBiome = new Uint8Array(NN);
var BMUL = new Float32Array(BIOMES.length * NT);
for (let b = 0; b < BIOMES.length; b++) for (let t = 0; t < NT; t++) BMUL[b * NT + t] = biomeMultiplier(TILES[t], BIOMES[b]);
var bfs = new Int16Array(NN);
var seen = new Uint8Array(NN);
var MAXR = 6;
var NSTATE = 256 * MAXR * 3;
var rDist = new Float32Array(NSTATE);
var rPrev = new Int32Array(NSTATE);
var rStamp = new Int32Array(NSTATE);
var rStampId = 0;
var heapS = new Int32Array(NSTATE * 4);
var heapD = new Float32Array(NSTATE * 4);
var heapN = 0;
var outPath = /* @__PURE__ */ new Int16Array(128);
var outLen = 0;
function heapPush(s, d) {
	let i = heapN++;
	while (i > 0) {
		const p = i - 1 >> 1;
		if (heapD[p] <= d) break;
		heapS[i] = heapS[p];
		heapD[i] = heapD[p];
		i = p;
	}
	heapS[i] = s;
	heapD[i] = d;
}
function heapPop() {
	const top = heapS[0];
	const s = heapS[--heapN];
	const d = heapD[heapN];
	let i = 0;
	for (;;) {
		let c = i * 2 + 1;
		if (c >= heapN) break;
		if (c + 1 < heapN && heapD[c + 1] < heapD[c]) c++;
		if (heapD[c] >= d) break;
		heapS[i] = heapS[c];
		heapD[i] = heapD[c];
		i = c;
	}
	heapS[i] = s;
	heapD[i] = d;
	return top;
}
function routeBegin() {
	heapN = 0;
	rStampId++;
}
function routeStart(cell, dir) {
	if (rBlocked[cell]) return;
	const s = (cell * 4 + dir) * MAXR * 3 + 2;
	const d = rCost[cell];
	if (rStamp[s] === rStampId && rDist[s] <= d) return;
	rStamp[s] = rStampId;
	rDist[s] = d;
	rPrev[s] = -1;
	heapPush(s, d);
}
var stateCell = (q) => ((q / 3 | 0) / MAXR | 0) >> 2;
/**
* Shortest path over (cell, heading, straight run, last turn sense). Limits straight runs to `maxRun`
* moves and forbids hairpins (two successive turns of the same sense). `road` routes may cross a straight
* river cell at right angles only (that cell becomes a bridge). Target: `targetCell`, or any trunk cell
* when targetCell < 0. With `exitDir` >= 0 the path leaves the chunk through that side of the target.
* Result in outPath[0..outLen).
*/
function routeRun(road, maxRun, turnCost, bridgeCost, targetCell, exitDir) {
	while (heapN > 0) {
		const d0 = heapD[0];
		const s = heapPop();
		if (d0 > rDist[s]) continue;
		const sense = s % 3;
		let t = s / 3 | 0;
		const run = t % MAXR + 1;
		t = t / MAXR | 0;
		const d = t & 3;
		const c = t >> 2;
		if (targetCell >= 0 ? c === targetCell : trunkMask[c] !== 0) {
			if (targetCell >= 0 && exitDir >= 0 && (d === (exitDir + 2 & 3) || d === exitDir && run >= maxRun)) continue;
			let n = 0;
			for (let q = s; q >= 0; q = rPrev[q]) n++;
			if (n > NN) return false;
			outLen = n;
			for (let q = s; q >= 0; q = rPrev[q]) outPath[--n] = stateCell(q);
			seen.fill(0);
			for (let i = 0; i < outLen; i++) {
				if (seen[outPath[i]]) return false;
				seen[outPath[i]] = 1;
			}
			return true;
		}
		const onRiver = road && rivMask[c] !== 0;
		const cx = c % N;
		const cz = c / N | 0;
		for (let k = 0; k < 3; k++) {
			let nd;
			let nrun;
			let nsense;
			if (k === 0) {
				nd = d;
				nrun = run + 1;
				nsense = sense;
				if (nrun > maxRun) continue;
			} else {
				if (onRiver) continue;
				nsense = k - 1;
				if (run === 1 && sense === nsense) continue;
				nd = k === 1 ? d + 3 & 3 : d + 1 & 3;
				nrun = 1;
			}
			const x = cx + DX[nd];
			const z = cz + DZ[nd];
			if (x < 0 || z < 0 || x >= N || z >= N) continue;
			const c2 = z * N + x;
			if (rBlocked[c2]) continue;
			let w = 1 + rCost[c2] + (k ? turnCost : 0);
			if (road) {
				const rm = rivMask[c2];
				if (rm) {
					if (trunkMask[c2] || isSource[c2]) continue;
					if (!(rm === 5 && nd & 1 || rm === 10 && !(nd & 1))) continue;
					const step = rm === 5 ? N : 1;
					if (c2 - step >= 0 && rivMask[c2 - step] && trunkMask[c2 - step] || c2 + step < NN && rivMask[c2 + step] && trunkMask[c2 + step]) continue;
					w += bridgeCost;
				}
			}
			const s2 = ((c2 * 4 + nd) * MAXR + nrun - 1) * 3 + nsense;
			const nd2 = d0 + w;
			if (rStamp[s2] !== rStampId || nd2 < rDist[s2]) {
				rStamp[s2] = rStampId;
				rDist[s2] = nd2;
				rPrev[s2] = s;
				if (heapN < heapS.length) heapPush(s2, nd2);
			}
		}
	}
	return false;
}
/** Mark outPath as river (mask = rivMask) or trunk road (mask = trunkMask). */
function applyPath(mask) {
	for (let i = 0; i + 1 < outLen; i++) {
		const a = outPath[i];
		const b = outPath[i + 1];
		const d = b === a - N ? 0 : b === a + 1 ? 1 : b === a + N ? 2 : 3;
		mask[a] |= BIT[d];
		mask[b] |= BIT[d + 2 & 3];
	}
}
var ORIGIN_ROAD = [
	[1, 3],
	[1, 2],
	[1, 1],
	[0, 1],
	[0, 0],
	[0, -1],
	[0, -2],
	[0, -3],
	[1, -3],
	[1, -4]
];
var ORIGIN_RIVER = [
	[-3, -3],
	[-2, -3],
	[-2, -2],
	[-1, -2],
	[0, -2],
	[1, -2],
	[2, -2],
	[2, -3],
	[3, -3],
	[4, -3]
];
var ORIGIN_FIXED = [
	[
		0,
		0,
		"lantern_post:1010"
	],
	[
		-1,
		-1,
		"house:0100"
	],
	[
		0,
		-1,
		"path_t:1011"
	]
];
function mulberry(a) {
	a >>>= 0;
	return () => {
		a = a + 1831565813 >>> 0;
		let t = a;
		t = Math.imul(t ^ t >>> 15, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 61);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function createWFC({ seed = 1, _weights = null, _fault = 0 } = {}) {
	seed = (Number(seed) || 0) | 0;
	const cfg = CONFIG.wfc;
	const OX = cfg.originLocal[0];
	const OZ = cfg.originLocal[1];
	const BW = _weights || TILES.map((t) => t.weight);
	const chunks = /* @__PURE__ */ new Map();
	let lastKey = NaN;
	let lastChunk = null;
	const stats = {
		chunks: 0,
		attempts: 0,
		backtracks: 0,
		restarts: 0,
		strictChunks: 0,
		fallbackChunks: 0,
		planFails: 0,
		validateFails: 0,
		vOrphan: 0,
		vEnds: 0,
		vRun: 0,
		evicted: 0
	};
	const u01 = (x, z, s) => hash2(x, z, seed + s) / 4294967296;
	function vnoise(x, z, period, s) {
		const gx = x / period;
		const gz = z / period;
		const x0 = Math.floor(gx);
		const z0 = Math.floor(gz);
		let fx = gx - x0;
		let fz = gz - z0;
		fx = fx * fx * (3 - 2 * fx);
		fz = fz * fz * (3 - 2 * fz);
		const a = u01(x0, z0, s);
		const b = u01(x0 + 1, z0, s);
		const c = u01(x0, z0 + 1, s);
		const d = u01(x0 + 1, z0 + 1, s);
		const top = a + (b - a) * fx;
		return top + (c + (d - c) * fx - top) * fz;
	}
	const field = (x, z, period, s) => .68 * vnoise(x, z, period, s) + .32 * vnoise(x + 31, z - 17, period * .47, s + 1);
	const phi = (u01(11, 23, 901) - .5) * 2 * cfg.riverTilt;
	const na = Math.sin(phi);
	const nb = Math.cos(phi);
	const warp = (kx, kz) => (vnoise(kx, kz, cfg.riverWarpPeriod, 911) - .5) * 2 + (vnoise(kx, kz, cfg.riverWarpPeriod * .5, 913) - .5) * .8;
	const warp0 = (warp(0, 0) + warp(1, 0) + warp(0, 1) + warp(1, 1)) / 4;
	function label(kx, kz) {
		if ((kx === 0 || kx === 1) && (kz === 0 || kz === 1)) return kz === 0 ? 1 : 0;
		const f = ((kx - .5) * na + (kz - .5) * nb + cfg.riverWarp * (warp(kx, kz) - warp0)) / cfg.riverSpacing;
		return Math.floor(f) & 1;
	}
	const riverH = (kx, kz) => label(kx, kz) !== label(kx + 1, kz);
	const riverV = (kx, kz) => label(kx, kz) !== label(kx, kz + 1);
	const riverPosH = (kx, kz) => 1 + hash2(kx, kz, seed + 921) % 6;
	const riverPosV = (kx, kz) => (kx === 0 || kx === 1) && kz === 0 ? -3 + OZ : 1 + hash2(kx, kz, seed + 923) % 6;
	const isStartCol = (cx, cz) => cx === 0 && (cz === 0 || cz === 1) || cx === -1 && cz === 0;
	const roadChoice = (cx, cz) => isStartCol(cx, cz) ? 0 : hash2(cx, cz, seed + 931) & 1;
	const roadExtra = (cx, cz) => !isStartCol(cx, cz) && u01(cx, cz, 933) < cfg.roadExtra;
	const roadH = (kx, kz) => roadChoice(kx, kz) === 0 || roadExtra(kx, kz);
	const roadV = (kx, kz) => !((kx === 0 || kx === 1) && kz === 0) && (roadChoice(kx - 1, kz) === 1 || roadExtra(kx - 1, kz));
	function roadPos(p, hasRiver, q) {
		if (hasRiver && Math.abs(p - q) < 2) p = q + 2 <= 6 ? q + 2 : q - 2;
		return p;
	}
	const roadPosH = (kx, kz) => kx === 0 && (kz === 0 || kz === 1) ? 1 + OX : roadPos(1 + hash2(kx, kz, seed + 941) % 6, riverH(kx, kz), riverPosH(kx, kz));
	const roadPosV = (kx, kz) => roadPos(1 + hash2(kx, kz, seed + 943) % 6, riverV(kx, kz), riverPosV(kx, kz));
	/** Border crossings of a chunk: [{ cell, out }] for rivers and roads (order n, e, s, w). */
	function crossings(cx, cz) {
		const rivers = [];
		const roads = [];
		if (riverH(cx, cz)) rivers.push({
			cell: riverPosH(cx, cz),
			out: 0
		});
		if (riverV(cx + 1, cz)) rivers.push({
			cell: riverPosV(cx + 1, cz) * N + N - 1,
			out: 1
		});
		if (riverH(cx, cz + 1)) rivers.push({
			cell: 56 + riverPosH(cx, cz + 1),
			out: 2
		});
		if (riverV(cx, cz)) rivers.push({
			cell: riverPosV(cx, cz) * N,
			out: 3
		});
		if (roadH(cx, cz)) roads.push({
			cell: roadPosH(cx, cz),
			out: 0
		});
		if (roadV(cx + 1, cz)) roads.push({
			cell: roadPosV(cx + 1, cz) * N + N - 1,
			out: 1
		});
		if (roadH(cx, cz + 1)) roads.push({
			cell: 56 + roadPosH(cx, cz + 1),
			out: 2
		});
		if (roadV(cx, cz)) roads.push({
			cell: roadPosV(cx, cz) * N,
			out: 3
		});
		return {
			rivers,
			roads
		};
	}
	let hub = -1;
	let originChunk = false;
	const _geoStateRef = { value: null };
	let geoState = null;
	let hasGeoConstraints = false;
	let geoTrunkMask = null;
	let geoRailMask = null;
	let geoForcedTiles = null;
	let geoLandmarks = null;
	let geoParkBoosts = null;
	let geoSidewalkMask = null;
	let geoSpurArmMask = null;
	function fillCost(rng, amp, ringPenalty) {
		for (let i = 0; i < NN; i++) {
			const x = i % N;
			const z = i / N | 0;
			const r = rng();
			rCost[i] = amp * r * r + (x === 0 || z === 0 || x === 7 || z === 7 ? ringPenalty : 0);
		}
	}
	/** Roads should not run side by side: make cells next to the existing trunk expensive. */
	function avoidTrunk(amount) {
		for (let i = 0; i < NN; i++) {
			if (trunkMask[i]) continue;
			const x = i % N;
			const z = i / N | 0;
			if (x > 0 && trunkMask[i - 1] || x < 7 && trunkMask[i + 1] || z > 0 && trunkMask[i - N] || z < 7 && trunkMask[i + N]) rCost[i] += amount;
		}
	}
	function markNearRiver() {
		nearRiver.fill(0);
		for (let i = 0; i < NN; i++) {
			if (!rivMask[i]) continue;
			const x = i % N;
			const z = i / N | 0;
			for (let d = 0; d < 4; d++) {
				const x2 = x + DX[d];
				const z2 = z + DZ[d];
				if (x2 >= 0 && z2 >= 0 && x2 < N && z2 < N) nearRiver[z2 * N + x2] = 1;
			}
		}
	}
	function plan(cx, cz, X, rng, isOrigin, attempt) {
		req.fill(-1);
		rivMask.fill(0);
		trunkMask.fill(0);
		isSource.fill(0);
		hub = -1;
		const { rivers, roads } = X;
		geoState = (() => {
			if (!_geoStateRef.value) _geoStateRef.value = /* @__PURE__ */ new Map();
			const key = `${cx},${cz}`;
			return _geoStateRef.value.get(key) || null;
		})();
		hasGeoConstraints = geoState !== null;
		if (hasGeoConstraints) console.log("[Laramie WFC] Chunk", cx, cz, "has geo constraints:", {
			hasTrunkMask: !!geoTrunkMask,
			hasForcedTiles: !!geoForcedTiles && geoForcedTiles.size,
			hasLandmarks: !!geoLandmarks && geoLandmarks.size,
			hasParks: !!geoParkBoosts && geoParkBoosts.size
		});
		geoTrunkMask = null;
		geoRailMask = null;
		geoForcedTiles = null;
		geoLandmarks = null;
		geoParkBoosts = null;
		geoSpurArmMask = null;
		if (hasGeoConstraints) {
			geoTrunkMask = geoState.trunkMask;
			geoRailMask = geoState.railMask;
			geoState.railTypeMask;
			geoState.railDirMask;
			geoForcedTiles = geoState.forcedTiles;
			geoLandmarks = geoState.landmarkTiles;
			geoParkBoosts = geoState.parkBoosts;
			geoSidewalkMask = geoState.sidewalkMask;
			geoSpurArmMask = geoState.spurArmMask;
			if (geoTrunkMask) for (let i = 0; i < NN; i++) trunkMask[i] = geoTrunkMask[i];
			if (geoRailMask) {
				for (let i = 0; i < NN; i++) if (geoRailMask[i]) rivMask[i] = geoRailMask[i];
			}
		}
		const roadRun = attempt >= 4 ? cfg.roadMaxRun - 1 : cfg.roadMaxRun;
		if (isOrigin) {
			const set = (list, mask) => {
				outLen = 0;
				for (const [x, z] of list) outPath[outLen++] = (z + OZ) * N + x + OX;
				applyPath(mask);
			};
			set(ORIGIN_RIVER, rivMask);
			if (!hasGeoConstraints) {
				set(ORIGIN_ROAD, trunkMask);
				for (const r of rivers) rivMask[r.cell] |= BIT[r.out];
				for (const r of roads) trunkMask[r.cell] |= BIT[r.out];
			}
		} else {
			if (!hasGeoConstraints) {
				const nr = rivers.length;
				const order = [];
				if (nr === 2) order.push(0, 1);
				else if (nr === 4) {
					if (rng() < .5) order.push(0, 1, 2, 3);
					else order.push(0, 3, 1, 2);
				} else if (nr === 3) order.push(0, 1);
				for (let k = 0; k + 1 < order.length; k += 2) {
					const a = rivers[order[k]];
					const b = rivers[order[k + 1]];
					fillCost(rng, cfg.riverNoise, 2.5);
					markNearRiver();
					for (let i = 0; i < NN; i++) {
						rBlocked[i] = rivMask[i] ? 1 : 0;
						if (nearRiver[i]) rCost[i] += 6;
					}
					for (const r of roads) rBlocked[r.cell] = 1;
					for (const r of rivers) if (r !== a && r !== b) rBlocked[r.cell] = 1;
					rCost[a.cell] = 0;
					rCost[b.cell] = 0;
					routeBegin();
					routeStart(a.cell, a.out + 2 & 3);
					if (!routeRun(false, cfg.riverMaxRun, cfg.riverTurnCost, 0, b.cell, b.out)) return false;
					applyPath(rivMask);
					rivMask[a.cell] |= BIT[a.out];
					rivMask[b.cell] |= BIT[b.out];
				}
				if (nr === 1 || nr === 3) {
					const a = rivers[nr - 1];
					if (rivMask[a.cell]) return false;
					rivMask[a.cell] |= BIT[a.out];
					isSource[a.cell] = 1;
				}
				if (nr === 0 && u01(cx, cz, 951) < cfg.brookChance) for (let tries = 0; tries < 9; tries++) {
					const ax = 1 + (rng() * 6 | 0);
					const az = 1 + (rng() * 6 | 0);
					const bx = 1 + (rng() * 6 | 0);
					const bz = 1 + (rng() * 6 | 0);
					if (Math.abs(ax - bx) + Math.abs(az - bz) < cfg.brookMinSpan) continue;
					const a = az * N + ax;
					const b = bz * N + bx;
					fillCost(rng, cfg.riverNoise, 0);
					for (let i = 0; i < NN; i++) {
						const x = i % N;
						const z = i / N | 0;
						rBlocked[i] = x === 0 || z === 0 || x === 7 || z === 7 ? 1 : 0;
					}
					rBlocked[a] = 1;
					routeBegin();
					for (let d = 0; d < 4; d++) routeStart((az + DZ[d]) * N + ax + DX[d], d);
					if (!routeRun(false, cfg.riverMaxRun, cfg.riverTurnCost, 0, b, -1)) continue;
					if (outLen + 1 < cfg.brookMinLen) continue;
					for (let i = outLen; i > 0; i--) outPath[i] = outPath[i - 1];
					outPath[0] = a;
					outLen++;
					applyPath(rivMask);
					isSource[a] = 1;
					isSource[b] = 1;
					break;
				}
			}
			if (!hasGeoConstraints) {
				const nq = roads.length;
				const ro = roads.slice();
				for (let i = nq - 1; i > 0; i--) {
					const j = rng() * (i + 1) | 0;
					const t = ro[i];
					ro[i] = ro[j];
					ro[j] = t;
				}
				markNearRiver();
				if (nq === 1) {
					const a = ro[0];
					const ax = a.cell % N;
					const az = a.cell / N | 0;
					for (let tries = 0; tries < 12 && hub < 0; tries++) {
						const hx = 1 + (rng() * 6 | 0);
						const hz = 1 + (rng() * 6 | 0);
						const h = hz * N + hx;
						if (rivMask[h] || nearRiver[h] || Math.abs(hx - ax) + Math.abs(hz - az) < 3) continue;
						hub = h;
					}
					if (hub < 0) return false;
					fillCost(rng, cfg.roadNoise, 1.5);
					rBlocked.fill(0);
					rCost[a.cell] = 0;
					routeBegin();
					routeStart(a.cell, a.out + 2 & 3);
					if (!routeRun(true, roadRun, cfg.roadTurnCost, cfg.bridgeCost, hub, -1)) return false;
					applyPath(trunkMask);
					trunkMask[a.cell] |= BIT[a.out];
				} else if (nq >= 2) {
					const crossroads = () => {
						for (let tries = 0; tries < 12 && hub < 0; tries++) {
							const hx = 2 + (rng() * 4 | 0);
							const h = (2 + (rng() * 4 | 0)) * N + hx;
							if (!rivMask[h] && !nearRiver[h]) hub = h;
						}
						if (hub < 0) return false;
						for (let k = 0; k < 4; k++) {
							const a = ro[k];
							fillCost(rng, cfg.roadNoise, 1.5);
							for (let i = 0; i < NN; i++) rBlocked[i] = trunkMask[i] && i !== hub ? 1 : 0;
							for (const r of roads) if (r !== a) rBlocked[r.cell] = 1;
							avoidTrunk(2.5);
							rCost[hub] = 0;
							rCost[a.cell] = 0;
							routeBegin();
							routeStart(a.cell, a.out + 2 & 3);
							if (!routeRun(true, roadRun, cfg.roadTurnCost, cfg.bridgeCost, hub, -1)) return false;
							applyPath(trunkMask);
							trunkMask[a.cell] |= BIT[a.out];
						}
						if (trunkMask[hub] !== 15) return false;
						return true;
					};
					const detour = () => {
						const a = ro[0];
						const b = ro[1];
						let way = -1;
						for (let tries = 0; tries < 12 && way < 0; tries++) {
							const hx = 1 + (rng() * 6 | 0);
							const hz = 1 + (rng() * 6 | 0);
							const h = hz * N + hx;
							if (rivMask[h] || nearRiver[h]) continue;
							if (Math.abs(hx - a.cell % N) + Math.abs(hz - (a.cell / N | 0)) < 3 || Math.abs(hx - b.cell % N) + Math.abs(hz - (b.cell / N | 0)) < 3) continue;
							way = h;
						}
						if (way < 0) return false;
						for (let k = 0; k < 2; k++) {
							const c = k ? b : a;
							fillCost(rng, cfg.roadNoise, 1.5);
							for (let i = 0; i < NN; i++) rBlocked[i] = trunkMask[i] && i !== way ? 1 : 0;
							rBlocked[(k ? a : b).cell] = 1;
							avoidTrunk(2.5);
							rCost[way] = 0;
							rCost[c.cell] = 0;
							routeBegin();
							routeStart(c.cell, c.out + 2 & 3);
							if (!routeRun(true, roadRun, cfg.roadTurnCost, cfg.bridgeCost, way, -1)) return false;
							applyPath(trunkMask);
							trunkMask[c.cell] |= BIT[c.out];
						}
						return true;
					};
					let special = false;
					if (attempt < 3) {
						if (nq === 4 && rng() < cfg.crossroads) special = crossroads();
						else if (nq === 2 && rng() < cfg.roadDetour) special = detour();
						if (!special) {
							trunkMask.fill(0);
							hub = -1;
						}
					}
					for (let k = 1; k < nq && !special; k++) {
						const a = k === 1 ? ro[0] : ro[k];
						fillCost(rng, cfg.roadNoise, 1.5);
						rBlocked.fill(0);
						for (const r of roads) rCost[r.cell] = 0;
						if (k === 1) {
							const b = ro[1];
							routeBegin();
							routeStart(a.cell, a.out + 2 & 3);
							if (!routeRun(true, roadRun, cfg.roadTurnCost, cfg.bridgeCost, b.cell, b.out)) return false;
							applyPath(trunkMask);
							trunkMask[a.cell] |= BIT[a.out];
							trunkMask[b.cell] |= BIT[b.out];
						} else {
							if (!trunkMask[a.cell]) {
								avoidTrunk(1.5);
								routeBegin();
								routeStart(a.cell, a.out + 2 & 3);
								if (!routeRun(true, roadRun, cfg.roadTurnCost, cfg.bridgeCost, -1, -1)) return false;
								applyPath(trunkMask);
							}
							trunkMask[a.cell] |= BIT[a.out];
						}
					}
				}
			}
		}
		if (!hasGeoConstraints && !isOrigin && rivers.length >= 2 && roads.length) {
			let bridged = false;
			for (let i = 0; i < NN; i++) if (rivMask[i] && trunkMask[i]) bridged = true;
			for (let tries = 0; tries < 10 && !bridged; tries++) {
				const c = rng() * NN | 0;
				const rm = rivMask[c];
				if (rm !== 5 && rm !== 10 || isSource[c]) continue;
				const d = (rm === 5 ? 1 : 0) + (rng() < .5 ? 2 : 0);
				const fx = c % N - DX[d];
				const fz = (c / N | 0) - DZ[d];
				const nx = c % N + DX[d];
				const nz = (c / N | 0) + DZ[d];
				if (fx < 1 || fz < 1 || fx >= 7 || fz >= 7 || nx < 0 || nz < 0 || nx >= N || nz >= N) continue;
				const far = fz * N + fx;
				if (rivMask[far] || trunkMask[far]) continue;
				fillCost(rng, cfg.roadNoise, 1.5);
				rBlocked.fill(0);
				rBlocked[far] = 1;
				for (const r of roads) if (!trunkMask[r.cell]) rBlocked[r.cell] = 1;
				routeBegin();
				routeStart(c, d);
				if (!routeRun(true, roadRun, cfg.roadTurnCost, cfg.bridgeCost, -1, -1) || outLen > 6) continue;
				for (let i = outLen; i > 0; i--) outPath[i] = outPath[i - 1];
				outPath[0] = far;
				outLen++;
				applyPath(trunkMask);
				bridged = true;
			}
		}
		if (!isOrigin && attempt < 4 && !hasGeoConstraints) for (let z = 0; z < 7; z++) for (let x = 0; x < 7; x++) {
			const i = z * N + x;
			if (trunkMask[i] && trunkMask[i + 1] && trunkMask[i + N] && trunkMask[i + N + 1]) return false;
		}
		for (let i = 0; i < NN; i++) {
			const rm = rivMask[i];
			const tm = trunkMask[i];
			if (!hasGeoConstraints && rm && tm && !(rm === 5 && tm === 10 || rm === 10 && tm === 5)) return false;
		}
		for (let i = 0; i < NN; i++) {
			const x = i % N;
			const z = i / N | 0;
			for (let d = 0; d < 4; d++) {
				const x2 = x + DX[d];
				const z2 = z + DZ[d];
				const border = x2 < 0 || z2 < 0 || x2 >= N || z2 >= N;
				req[i * 4 + d] = rivMask[i] & BIT[d] ? R : trunkMask[i] & BIT[d] ? P : border ? G : -1;
			}
		}
		if (hasGeoConstraints) {
			if (geoState.crossingMask) {
				for (let i = 0; i < NN; i++) if (geoState.crossingMask[i]) for (let d = 0; d < 4; d++) {
					const existing = req[i * 4 + d];
					if (existing === -1 || existing === G) req[i * 4 + d] = 4;
				}
			}
			if (geoForcedTiles) for (const [cellIdx, tileInfo] of geoForcedTiles);
			if (geoLandmarks) {
				for (const [cellIdx, landmarkInfo] of geoLandmarks) if (landmarkInfo.tileId === "depot") {
					for (let d = 0; d < 4; d++) if (req[cellIdx * 4 + d] === -1) req[cellIdx * 4 + d] = d % 2 === 0 ? 3 : 1;
				}
			}
		}
		distTrunk.fill(99);
		let qh = 0;
		let qt = 0;
		for (let i = 0; i < NN; i++) if (trunkMask[i]) {
			distTrunk[i] = 0;
			bfs[qt++] = i;
		}
		while (qh < qt) {
			const i = bfs[qh++];
			const x = i % N;
			const z = i / N | 0;
			for (let d = 0; d < 4; d++) {
				const x2 = x + DX[d];
				const z2 = z + DZ[d];
				if (x2 < 0 || z2 < 0 || x2 >= N || z2 >= N) continue;
				const j = z2 * N + x2;
				if (distTrunk[j] > distTrunk[i] + 1) {
					distTrunk[j] = distTrunk[i] + 1;
					bfs[qt++] = j;
				}
			}
		}
		markNearRiver();
		for (let d = 0; d < 4; d++) {
			const od = d + 2 & 3;
			const through = BIT[d] | BIT[od];
			for (let a = 0; a < N; a++) for (let k = 0; k < N; k++) {
				const b = d === 0 || d === 3 ? k : 7 - k;
				const i = d & 1 ? a * N + b : b * N + a;
				const x2 = i % N + DX[d];
				const z2 = (i / N | 0) + DZ[d];
				let len = 0;
				let edge = 0;
				if (x2 < 0 || z2 < 0 || x2 >= N || z2 >= N) edge = trunkMask[i] & BIT[d] ? 1 : 0;
				else {
					const j = z2 * N + x2;
					if ((trunkMask[j] & through) === through) {
						len = 1 + runLen[j * 4 + d];
						edge = runEdge[j * 4 + d];
					}
				}
				runLen[i * 4 + d] = len;
				runEdge[i * 4 + d] = edge;
				if ((trunkMask[i] & through) === through && d < 2) {}
			}
		}
		if (!hasGeoConstraints) for (let i = 0; i < NN; i++) for (let d = 0; d < 2; d++) {
			const through = BIT[d] | BIT[d + 2];
			if ((trunkMask[i] & through) !== through) continue;
			if (1 + runLen[i * 4 + d] + runLen[i * 4 + d + 2] > (runEdge[i * 4 + d] || runEdge[i * 4 + d + 2] ? cfg.maxBorderRun : cfg.maxInnerRun)) return false;
		}
		return true;
	}
	function computeFields(cx, cz) {
		for (let i = 0; i < NN; i++) {
			const x = cx * N + i % N - OX;
			const z = cz * N + (i / N | 0) - OZ;
			fForest[i] = smooth$3(.41, .6, field(x, z, cfg.forestPeriod, 961));
			fHill[i] = smooth$3(cfg.hillLo ?? .42, cfg.hillHi ?? .6, field(x, z, cfg.hillPeriod, 965));
			fFlower[i] = smooth$3(.45, .7, field(x, z, cfg.flowerPeriod, 969));
			fSettle[i] = smooth$3(.42, .62, field(x, z, cfg.settlePeriod, 973));
			cBiome[i] = biomeIndexAt(seed, x, z);
		}
	}
	function computeWeights(strict) {
		for (let i = 0; i < NN; i++) {
			const x = i % N;
			const z = i / N | 0;
			const F = fForest[i];
			const H = fHill[i];
			const Fl = fFlower[i];
			let S = fSettle[i];
			const nearStart = originChunk && Math.max(Math.abs(x - OX), Math.abs(z - OZ)) <= (cfg.startNear ?? 0);
			if (hub >= 0) S = Math.max(S, 1 - (Math.abs(x - hub % N) + Math.abs(z - (hub / N | 0))) / 3.5);
			const f1 = cfg.spurBase + cfg.spurSettle * S;
			for (let d = 0; d < 4; d++) {
				let f = 0;
				if (!strict && req[i * 4 + d] === -1) {
					const j = (z + DZ[d]) * N + x + DX[d];
					const a = Math.min(distTrunk[i], distTrunk[j]);
					const b = Math.max(distTrunk[i], distTrunk[j]);
					if (a === 0 && b === 1) f = f1;
					else if (a >= 1 && a <= 2 && b === a + 1) f = cfg.laneOn;
					else if (geoSpurArmMask && geoSpurArmMask[i] & BIT[d] && trunkMask[i]) f = f1 > 0 ? f1 : cfg.laneOn;
				}
				edgeF[i * 4 + d] = f;
			}
			const dT = distTrunk[i];
			const nearRoad = dT === 1;
			const southOfRoad = z > 0 && trunkMask[i - N] !== 0;
			const bank = nearRiver[i] && !rivMask[i];
			const base = i * NO;
			const bm = cBiome[i] * NT;
			for (let o = 0; o < NO; o++) {
				const t = OPT_T[o];
				let w = BW[t] * BMUL[bm + t];
				const forcedAtCell = hasGeoConstraints && geoForcedTiles && geoForcedTiles.get(i);
				const isForcedGISBuilding = forcedAtCell && forcedAtCell.isRegistryBuilding === true;
				if (isForcedGISBuilding) w = BW[t];
				if (IS_FILLER[t]) {
					const open = 1 - Math.max(F, H);
					if (t === T.meadow) w *= .3 + .95 * open * open;
					else if (t === T.meadow_flowers) w *= (.5 + 2.6 * Fl) * (.5 + .5 * open) * (bank ? 1.5 : 1) * (nearRoad ? 1.25 : 1);
					else if (t === T.forest) w *= (.06 + 5.2 * F * F) * (nearRoad ? .9 : 1) * (southOfRoad ? .4 : 1) * (1 - .6 * S);
					else if (t === T.grove) w *= (.4 + 3.4 * smooth$3(.05, .5, F) * (1 - .55 * F)) * (bank ? 1.35 : 1) * (southOfRoad ? .7 : 1);
					else if (t === T.hills) w *= (.08 + 5 * H * H) * (1 - .45 * F) * (nearRoad ? .9 : 1) * (southOfRoad ? .45 : 1) * (bank ? .5 : 1) * (cBiome[i] === PINEWOOD ? 0 : 1);
					else if (t === T.rocks) w *= (.13 + 1.6 * H) * (bank ? .7 : 1) * (1 - .5 * S);
					else if (t === T.pond) w *= .3 * (1 - .7 * H) * (nearRiver[i] ? .15 : 1) * (.6 + .8 * Fl) * (nearStart ? cfg.startPond ?? 1 : 1);
					else if (NEW_KIND[t] === 1) w *= (.07 + 3.6 * F * F) * (southOfRoad ? .6 : 1) * (1 - .5 * S);
					else if (NEW_KIND[t] === 2) w *= .25 + 1.9 * open * open;
					else if (NEW_KIND[t] === 3) w *= (.5 + 2.2 * H) * (1 - .5 * F);
					else if (t === T.windmill) w *= (x >= 2 && x <= 5 && z >= 2 && z <= 5 ? 1 : 0) * open * (dT >= 1 && dT <= 2 ? 3 : 1) * (southOfRoad ? .3 : 1) * (bank ? .5 : 1) * (.7 + S);
				} else {
					if (IS_HAMLET[t]) w *= (.05 + 3.2 * S * S) * (nearStart ? cfg.startHamlet ?? 1 : 1);
					else if (t === T.lantern_post) w *= (.75 + 1.3 * S) * (OPTIONS[o].rots[0] & 1 ? .7 : 1.3);
					else if (t === T.house) w *= .8 + .6 * S;
					const pb = PATH_BITS[o];
					if (pb && !isForcedGISBuilding) {
						let home = dT === 0;
						for (let d = 0; d < 4; d++) {
							if (!(pb & BIT[d]) || req[i * 4 + d] !== -1) continue;
							w *= edgeF[i * 4 + d];
							if (distTrunk[(z + DZ[d]) * N + x + DX[d]] < dT) home = true;
						}
						if (!home) w = 0;
						for (let d = 0; d < 2 && w > 0; d++) {
							const through = BIT[d] | BIT[d + 2];
							if ((pb & through) !== through || (trunkMask[i] & through) === through) continue;
							if (1 + runLen[i * 4 + d] + runLen[i * 4 + d + 2] > (runEdge[i * 4 + d] || runEdge[i * 4 + d + 2] ? cfg.maxBorderRun : cfg.maxInnerRun)) w = 0;
						}
					}
				}
				if (hasGeoConstraints) {
					if (geoForcedTiles && geoForcedTiles.has(i)) {
						const forced = geoForcedTiles.get(i);
						const forcedTileIndex = T[forced.tileId];
						if (forcedTileIndex !== void 0 && t === forcedTileIndex) w *= forced.weight;
						else w *= .001;
					}
					if (geoLandmarks && geoLandmarks.has(i)) {
						const landmark = geoLandmarks.get(i);
						const landmarkTileIndex = T[landmark.tileId];
						if (landmarkTileIndex !== void 0 && t === landmarkTileIndex) w *= landmark.weight || 1e3;
						else w *= .001;
					}
					if (geoParkBoosts && geoParkBoosts.has(i)) {
						const boosts = geoParkBoosts.get(i);
						for (const boost of boosts) {
							const boostTileIndex = T[boost.tileId];
							if (boostTileIndex !== void 0 && t === boostTileIndex) w *= boost.weight;
						}
					}
					if (geoSidewalkMask && geoSidewalkMask[i]) {
						const pb = PATH_BITS[o];
						if (pb) {
							if ((pb & ~geoSidewalkMask[i]) === 0) {
								if (t === T.path_straight || t === T.path_corner || t === T.path_t || t === T.path_cross || t === T.path_end) w *= 5;
							}
						}
					}
					if (geoParkBoosts && geoParkBoosts.has(i)) {
						const isForcedBuilding = geoForcedTiles && geoForcedTiles.has(i);
						const isForcedLandmark = geoLandmarks && geoLandmarks.has(i);
						if (!isForcedBuilding && !isForcedLandmark) {
							if (t === T.house || t === T.village || t === T.village_b || t === T.village_green || t === T.manor || t === T.barn_farm || t === T.church || t === T.market_square || t === T.windmill || t === T.watchtower || t === T.desert_ruin || t === T.blossom_gazebo) w *= .001;
						}
					}
				}
				W[base + o] = w;
				WL[base + o] = w > 0 ? w * Math.log(w) : 0;
			}
		}
	}
	let qHead = 0;
	let qTail = 0;
	function enqueue(i) {
		if (!inQueue[i]) {
			inQueue[i] = 1;
			queue[qTail++ & 1023] = i;
		}
	}
	/** Propagate socket constraints from the queued cells to a fixpoint. false = contradiction. */
	function propagate() {
		while (qHead < qTail) {
			const i = queue[qHead++ & 1023];
			inQueue[i] = 0;
			const lo = domLo[i];
			const hi = domHi[i];
			const ex = domEx[i];
			const ex2 = domEx2[i];
			const ex3 = domEx3[i];
			const x = i % N;
			const z = i / N | 0;
			for (let d = 0; d < 4; d++) {
				const x2 = x + DX[d];
				const z2 = z + DZ[d];
				if (x2 < 0 || z2 < 0 || x2 >= N || z2 >= N) continue;
				const j = z2 * N + x2;
				const od = d + 2 & 3;
				let aLo = 0;
				let aHi = 0;
				let aEx = 0;
				let aEx2 = 0;
				let aEx3 = 0;
				for (let s = 0; s < 5; s++) if (lo & MASK_LO[d * 5 + s] | hi & MASK_HI[d * 5 + s] | ex & MASK_EX[d * 5 + s] | ex2 & MASK_EX2[d * 5 + s] | ex3 & MASK_EX3[d * 5 + s]) {
					aLo |= MASK_LO[od * 5 + s];
					aHi |= MASK_HI[od * 5 + s];
					aEx |= MASK_EX[od * 5 + s];
					aEx2 |= MASK_EX2[od * 5 + s];
					aEx3 |= MASK_EX3[od * 5 + s];
				}
				const nLo = domLo[j] & aLo;
				const nHi = domHi[j] & aHi;
				const nEx = domEx[j] & aEx;
				const nEx2 = domEx2[j] & aEx2;
				const nEx3 = domEx3[j] & aEx3;
				if (nLo !== domLo[j] || nHi !== domHi[j] || nEx !== domEx[j] || nEx2 !== domEx2[j] || nEx3 !== domEx3[j]) {
					domLo[j] = nLo;
					domHi[j] = nHi;
					domEx[j] = nEx;
					domEx2[j] = nEx2;
					domEx3[j] = nEx3;
					entOk[j] = 0;
					if ((nLo | nHi | nEx | nEx2 | nEx3) === 0) {
						qHead = qTail = 0;
						inQueue.fill(0);
						return false;
					}
					enqueue(j);
				}
			}
		}
		qHead = qTail = 0;
		return true;
	}
	function entropy(i, rng) {
		const lo = domLo[i];
		const hi = domHi[i];
		const ex = domEx[i];
		const ex2 = domEx2[i];
		const base = i * NO;
		let sum = 0;
		let sl = 0;
		for (let o = 0; o < NO; o++) if (hasBit(lo, hi, ex, ex2, o)) {
			sum += W[base + o];
			sl += WL[base + o];
		}
		return Math.log(sum) - sl / sum + rng() * 1e-4;
	}
	const sameOpt = (x, z, o) => x >= 0 && z >= 0 && x < N && z < N && res[z * N + x] === o;
	/** Weighted pick among the domain of cell i; weights get the adjacency (soft) factors of collapsed neighbours. */
	function pick(i, rng) {
		const lo = domLo[i];
		const hi = domHi[i];
		const ex = domEx[i];
		const ex2 = domEx2[i];
		const base = i * NO;
		const x = i % N;
		const z = i / N | 0;
		let nJunction = 0;
		let nForest = 0;
		let nGrove = 0;
		let nHills = 0;
		let nRocks = 0;
		let nFlow = 0;
		let nHome = 0;
		let nHouse = 0;
		let nVillage = 0;
		let nLantern = 0;
		let nPond = 0;
		for (let d = 0; d < 4; d++) {
			const x2 = x + DX[d];
			const z2 = z + DZ[d];
			if (x2 < 0 || z2 < 0 || x2 >= N || z2 >= N) continue;
			const r = res[z2 * N + x2];
			if (r < 0) continue;
			const t = OPT_T[r];
			if (t === T.forest) nForest++;
			else if (t === T.grove) nGrove++;
			else if (t === T.hills) nHills++;
			else if (t === T.rocks) nRocks++;
			else if (t === T.meadow_flowers) nFlow++;
			else if (t === T.house) {
				nHome++;
				nHouse++;
			} else if (IS_HAMLET[t]) {
				nVillage++;
				if (t !== T.village_green) nHome++;
			} else if (t === T.lantern_post) nLantern++;
			else if (t === T.pond) nPond++;
			else if (t === T.path_t || t === T.path_cross) nJunction++;
		}
		nbT.fill(0);
		lmSeen.fill(0);
		let nTrees = 0;
		let nClear = 0;
		let nClearDiag = 0;
		let lmTouch = 0;
		let lmNear = 0;
		for (let d = 0; d < 4; d++) {
			const x2 = x + DX[d];
			const z2 = z + DZ[d];
			if (x2 < 0 || z2 < 0 || x2 >= N || z2 >= N) continue;
			const r = res[z2 * N + x2];
			if (r < 0) continue;
			const t = OPT_T[r];
			nbT[t]++;
			if (IS_TREES[t]) nTrees++;
			if (IS_CLEAR[t]) nClear++;
		}
		let mills = 0;
		let ponds = 0;
		let ends = 0;
		let lanterns = 0;
		for (let k = 0; k < NN; k++) {
			if (res[k] < 0) continue;
			if (IS_LM[OPT_T[res[k]]]) {
				lmSeen[OPT_T[res[k]]] = 1;
				const cd = Math.max(Math.abs(k % N - x), Math.abs((k / N | 0) - z));
				if (cd === 1) {
					lmTouch++;
					if (k % N !== x && (k / N | 0) !== z && IS_CLEAR[OPT_T[res[k]]]) nClearDiag++;
				}
				if (cd <= (cfg.landmarkSpacing ?? 3)) lmNear++;
			}
			const t = OPT_T[res[k]];
			if (t === T.windmill) mills++;
			else if (t === T.pond) ponds++;
			else if (t === T.path_end) ends++;
			else if (t === T.lantern_post) lanterns++;
		}
		let sum = 0;
		for (let o = 0; o < NO; o++) {
			let w = 0;
			if (hasBit(lo, hi, ex, ex2, o)) {
				w = W[base + o];
				const t = OPT_T[o];
				if (IS_LM[t]) w *= (lmSeen[t] ? 0 : 1) * (lmTouch ? 0 : 1) * (lmNear ? .12 : 1) * (IS_CLEAR[t] && nTrees ? nTrees > 1 ? .05 : .3 : 1);
				if (nClear + nClearDiag > 0) {
					if (IS_TREES[t]) w *= nClear ? .03 : .35;
					else if (IS_OPEN[t]) w *= 1 + 1.6 * nClear + .5 * nClearDiag;
				}
				if (IS_MASS[t] && nbT[t] >= 1) w *= t === T.deep_pines ? nbT[t] >= 3 ? .25 : nbT[t] === 2 ? .5 : 1 : NEW_KIND[t] === 3 ? nbT[t] >= 2 ? .2 : .55 : nbT[t] >= 2 ? .25 : 1;
				if (IS_OPEN[t] || t === T.grove || t === T.rocks) {
					const hb = T.hills !== void 0 ? nbT[T.hills] : 0;
					if (hb >= 2 && t !== T.rocks) w *= 1 + .9 * hb;
				}
				if (t === T.snow_hamlet || t === T.desert_camp || t === T.desert_market) {
					if (nbT[t] || t === T.desert_camp && nbT[T.desert_market] || t === T.desert_market && nbT[T.desert_camp]) w *= .06;
				}
				if (IS_HAMLET[t] && w > 0) {
					const ax = (PATH_BITS[o] & 5) === 5 ? 0 : 1;
					let run = 0;
					let same = 0;
					for (let sgn = -1; sgn <= 1; sgn += 2) {
						let sameOn = true;
						for (let k = 1; k <= 3; k++) {
							const x2 = ax ? x + sgn * k : x;
							const z2 = ax ? z : z + sgn * k;
							if (x2 < 0 || z2 < 0 || x2 >= N || z2 >= N || res[z2 * N + x2] < 0 || !IS_HAMLET[OPT_T[res[z2 * N + x2]]]) break;
							run++;
							if (sameOn && OPT_T[res[z2 * N + x2]] === t) same++;
							else sameOn = false;
						}
					}
					if (run >= 3 || t === T.village && same >= 2) w = 0;
					else if (t !== T.village && nbT[t]) w *= .1;
				}
				if (IS_FILLER[t]) {
					if (t === T.forest) w *= (1 + .8 * nForest + .3 * nGrove) * (nForest >= 4 ? .35 : 1);
					else if (t === T.grove) w *= (1 + .45 * nForest) * (nGrove ? .6 : 1) * (1 + .3 * nHome);
					else if (t === T.hills) w *= (1 + (nHills >= 2 ? 0 : .8 * nHills) + .3 * nRocks) * (nHills >= 4 ? .35 : 1);
					else if (t === T.rocks) w *= (1 + .9 * nHills) * (nRocks ? .25 : 1);
					else if (t === T.meadow_flowers) w *= 1 + .45 * nFlow + .6 * nHome;
					else if (t === T.pond) w *= (ponds ? .05 : 1) * (nPond ? 0 : 1);
					else if (t === T.windmill) w *= (mills ? 0 : 1) * (nForest + nHills ? .3 : 1);
					if (t !== T.meadow && w > 0) for (let k = 0; k < 4; k++) {
						const sx = k & 1 ? 1 : -1;
						const sz = k & 2 ? 1 : -1;
						if (sameOpt(x + sx, z, o) && sameOpt(x, z + sz, o) && sameOpt(x + sx, z + sz, o)) {
							w *= t === T.meadow_flowers ? .25 : t === T.forest || t === T.hills ? .03 : .01;
							break;
						}
					}
				} else if (nJunction && PATH_BITS[o] & ~trunkMask[i] && trunkMask[i]) w *= .3;
				else if (t === T.lantern_post) w *= (nLantern ? .08 : 1) * (lanterns >= 2 ? .35 : 1) * (1 + .5 * nVillage);
				else if (IS_HAMLET[t]) w *= (1 + 1.6 * nVillage + .6 * nHouse) * (t === T.village ? 1 : nVillage + nHouse ? 2.2 : .3);
				else if (t === T.house) w *= 1 + .5 * nHome;
				else if (t === T.path_end) w *= ends ? .1 : 1;
			}
			pickW[o] = w;
			sum += w;
		}
		if (!(sum > 0)) {
			sum = 0;
			for (let o = 0; o < NO; o++) {
				pickW[o] = hasBit(lo, hi, ex, ex2, o) ? 1 : 0;
				sum += pickW[o];
			}
		}
		let r = rng() * sum;
		let last = -1;
		for (let o = 0; o < NO; o++) {
			if (pickW[o] <= 0) continue;
			last = o;
			r -= pickW[o];
			if (r < 0) return o;
		}
		return last;
	}
	function setSingle(i, o) {
		domLo[i] = o < 32 ? 1 << o : 0;
		domHi[i] = o >= 32 && o < 64 ? 1 << o - 32 : 0;
		domEx[i] = o >= 64 && o < 96 ? 1 << o - 64 : 0;
		domEx2[i] = o >= 96 ? 1 << o - 96 : 0;
		entOk[i] = 0;
	}
	const singleOf = (i) => domLo[i] ? 31 - Math.clz32(domLo[i]) : domHi[i] ? 63 - Math.clz32(domHi[i]) : domEx[i] ? 95 - Math.clz32(domEx[i]) : 127 - Math.clz32(domEx2[i]);
	const inDom = (i, o) => hasBit(domLo[i], domHi[i], domEx[i], domEx2[i], o);
	/** One WFC run over the planned chunk. Returns false when the backtrack budget is exhausted. */
	function solve(rng, isOrigin) {
		qHead = qTail = 0;
		inQueue.fill(0);
		for (let i = 0; i < NN; i++) {
			let lo = -1;
			let hi = HI_ALL;
			let ex = EX_ALL;
			let ex2 = EX2_ALL;
			let ex3 = EX2_ALL;
			for (let d = 0; d < 4; d++) {
				const q = req[i * 4 + d];
				if (q < 0) {
					lo &= MASK_LO[d * 5 + G] | MASK_LO[d * 5 + P];
					hi &= MASK_HI[d * 5 + G] | MASK_HI[d * 5 + P];
					ex &= MASK_EX[d * 5 + G] | MASK_EX[d * 5 + P];
					ex2 &= MASK_EX2[d * 5 + G] | MASK_EX2[d * 5 + P];
					ex3 &= MASK_EX3[d * 5 + G] | MASK_EX3[d * 5 + P];
				} else {
					lo &= MASK_LO[d * 5 + q];
					hi &= MASK_HI[d * 5 + q];
					ex &= MASK_EX[d * 5 + q];
					ex2 &= MASK_EX2[d * 5 + q];
					ex3 &= MASK_EX3[d * 5 + q];
				}
			}
			for (let o = 0; o < NO; o++) if (!(W[i * NO + o] > 0)) {
				if (o < 32) lo &= ~(1 << o);
				else if (o < 64) hi &= ~(1 << o - 32);
				else if (o < 96) ex &= ~(1 << o - 64);
				else if (o < 128) ex2 &= ~(1 << o - 96);
				else ex3 &= ~(1 << o - 128);
			}
			if ((lo | hi | ex | ex2 | ex3) === 0) return false;
			domLo[i] = lo;
			domHi[i] = hi;
			domEx[i] = ex;
			domEx2[i] = ex2;
			domEx3[i] = ex3;
			res[i] = -1;
			entOk[i] = 0;
			enqueue(i);
		}
		if (hasGeoConstraints) {
			if (geoForcedTiles) for (const [cellIdx, tileInfo] of geoForcedTiles) {
				if (cellIdx < 0 || cellIdx >= NN) continue;
				const allowedIndices = tileInfo.optionIndices;
				if (allowedIndices && allowedIndices.length > 0) {
					let allowLo = 0, allowHi = 0, allowEx = 0, allowEx2 = 0;
					for (const o of allowedIndices) if (o < 32) allowLo |= 1 << o;
					else if (o < 64) allowHi |= 1 << o - 32;
					else if (o < 96) allowEx |= 1 << o - 64;
					else allowEx2 |= 1 << o - 96;
					domLo[cellIdx] &= allowLo;
					domHi[cellIdx] &= allowHi;
					domEx[cellIdx] &= allowEx;
					domEx2[cellIdx] &= allowEx2;
					if ((domLo[cellIdx] | domHi[cellIdx] | domEx[cellIdx] | domEx2[cellIdx]) === 0) {
						console.warn(`[Laramie] Hard constraint contradiction at cell ${cellIdx} (${tileInfo.tileId}): no allowed options remain`);
						return false;
					}
					enqueue(cellIdx);
				}
			}
			if (geoLandmarks) for (const [cellIdx, landmarkInfo] of geoLandmarks) {
				if (cellIdx < 0 || cellIdx >= NN) continue;
				const tileId = landmarkInfo.tileId;
				const optionIndices = BUILDING_OPTION_INDICES[tileId];
				if (optionIndices && optionIndices.length > 0) {
					let allowLo = 0, allowHi = 0, allowEx = 0, allowEx2 = 0;
					for (const o of optionIndices) if (o < 32) allowLo |= 1 << o;
					else if (o < 64) allowHi |= 1 << o - 32;
					else if (o < 96) allowEx |= 1 << o - 64;
					else allowEx2 |= 1 << o - 96;
					domLo[cellIdx] &= allowLo;
					domHi[cellIdx] &= allowHi;
					domEx[cellIdx] &= allowEx;
					domEx2[cellIdx] &= allowEx2;
					if ((domLo[cellIdx] | domHi[cellIdx] | domEx[cellIdx] | domEx2[cellIdx]) === 0) {
						console.warn(`[Laramie] Landmark hard constraint contradiction at cell ${cellIdx} (${tileId})`);
						return false;
					}
					enqueue(cellIdx);
				}
			}
			if (hasGeoConstraints && geoParkBoosts) for (let i = 0; i < NN; i++) {
				if (!geoParkBoosts.has(i)) continue;
				const hasForcedBuilding = geoForcedTiles && geoForcedTiles.has(i);
				const hasForcedLandmark = geoLandmarks && geoLandmarks.has(i);
				if (hasForcedBuilding || hasForcedLandmark) continue;
				const buildingTileIds = [
					"house",
					"village",
					"village_b",
					"village_green",
					"manor",
					"barn_farm",
					"church",
					"market_square",
					"windmill",
					"watchtower",
					"desert_ruin",
					"blossom_gazebo"
				];
				let removedAny = false;
				for (const tileId of buildingTileIds) {
					const optionIndices = BUILDING_OPTION_INDICES[tileId];
					if (!optionIndices) continue;
					for (const o of optionIndices) {
						let removed = false;
						if (o < 32) {
							if (domLo[i] & 1 << o) {
								domLo[i] &= ~(1 << o);
								removed = true;
							}
						} else if (o < 64) {
							if (domHi[i] & 1 << o - 32) {
								domHi[i] &= ~(1 << o - 32);
								removed = true;
							}
						} else if (o < 96) {
							if (domEx[i] & 1 << o - 64) {
								domEx[i] &= ~(1 << o - 64);
								removed = true;
							}
						} else if (domEx2[i] & 1 << o - 96) {
							domEx2[i] &= ~(1 << o - 96);
							removed = true;
						}
						if (removed) removedAny = true;
					}
				}
				if (removedAny) {
					if ((domLo[i] | domHi[i] | domEx[i] | domEx2[i]) === 0) {
						console.warn(`[Laramie] Park building protection caused empty domain at cell ${i}`);
						return false;
					}
					enqueue(i);
				}
			}
			if (geoForcedTiles) for (const [cellIdx, tileInfo] of geoForcedTiles) {
				if (cellIdx < 0 || cellIdx >= NN) continue;
				if (tileInfo.isIntersection && tileInfo.rotation !== void 0) {
					const tileId = tileInfo.tileId;
					const rotation = tileInfo.rotation;
					const optionKey = tileId + ":" + rotation;
					const option = OPT_BY.get(optionKey);
					if (option !== void 0) {
						const o = option.index;
						let allowLo = 0, allowHi = 0, allowEx = 0, allowEx2 = 0;
						if (o < 32) allowLo = 1 << o;
						else if (o < 64) allowHi = 1 << o - 32;
						else if (o < 96) allowEx = 1 << o - 64;
						else allowEx2 = 1 << o - 96;
						domLo[cellIdx] &= allowLo;
						domHi[cellIdx] &= allowHi;
						domEx[cellIdx] &= allowEx;
						domEx2[cellIdx] &= allowEx2;
						if ((domLo[cellIdx] | domHi[cellIdx] | domEx[cellIdx] | domEx2[cellIdx]) === 0) {
							console.warn(`[Laramie] Intersection hard constraint contradiction at cell ${cellIdx} (${tileId} rot ${rotation})`);
							return false;
						}
						enqueue(cellIdx);
					}
				}
			}
		}
		if (isOrigin) for (const [x, z, key] of ORIGIN_FIXED) {
			const i = (z + OZ) * N + x + OX;
			const o = OPT_BY.get(key);
			if (o === void 0 || !inDom(i, o)) return false;
			setSingle(i, o);
		}
		if (!propagate()) return false;
		let depth = 0;
		let backtracks = 0;
		for (;;) {
			let best = -1;
			let bestE = Infinity;
			for (let i = 0; i < NN; i++) {
				if (res[i] >= 0) continue;
				if (popcnt(domLo[i]) + popcnt(domHi[i]) + popcnt(domEx[i]) + popcnt(domEx2[i]) === 1) {
					res[i] = singleOf(i);
					continue;
				}
				if (!entOk[i]) {
					ent[i] = entropy(i, rng);
					entOk[i] = 1;
				}
				if (ent[i] < bestE) {
					bestE = ent[i];
					best = i;
				}
			}
			if (best < 0) return true;
			stLo.set(domLo, depth * NN);
			stHi.set(domHi, depth * NN);
			stEx.set(domEx, depth * NN);
			stEx2.set(domEx2, depth * NN);
			stEx3.set(domEx3, depth * NN);
			stRes.set(res, depth * NN);
			const o = pick(best, rng);
			stCell[depth] = best;
			stOpt[depth] = o;
			depth++;
			setSingle(best, o);
			res[best] = o;
			enqueue(best);
			let ok = propagate();
			if (_fault && ok && rng() < _fault) ok = false;
			while (!ok) {
				stats.backtracks++;
				if (++backtracks > cfg.maxBacktracks || depth === 0) return false;
				depth--;
				domLo.set(stLo.subarray(depth * NN, depth * NN + NN));
				domHi.set(stHi.subarray(depth * NN, depth * NN + NN));
				domEx.set(stEx.subarray(depth * NN, depth * NN + NN));
				domEx2.set(stEx2.subarray(depth * NN, depth * NN + NN));
				domEx3.set(stEx3.subarray(depth * NN, depth * NN + NN));
				res.set(stRes.subarray(depth * NN, depth * NN + NN));
				entOk.fill(0);
				const c = stCell[depth];
				const b = stOpt[depth];
				if (b < 32) domLo[c] &= ~(1 << b);
				else if (b < 64) domHi[c] &= ~(1 << b - 32);
				else if (b < 96) domEx[c] &= ~(1 << b - 64);
				else if (b < 128) domEx2[c] &= ~(1 << b - 96);
				else domEx3[c] &= ~(1 << b - 128);
				if ((domLo[c] | domHi[c] | domEx[c] | domEx2[c] | domEx3[c]) === 0) {
					ok = false;
					continue;
				}
				enqueue(c);
				ok = propagate();
			}
		}
	}
	function validate() {
		seen.fill(0);
		let qh = 0;
		let qt = 0;
		let any = false;
		for (let i = 0; i < NN; i++) if (trunkMask[i]) {
			seen[i] = 1;
			bfs[qt++] = i;
			any = true;
		}
		while (qh < qt) {
			const i = bfs[qh++];
			const pb = PATH_BITS[res[i]];
			for (let d = 0; d < 4; d++) {
				if (!(pb & BIT[d])) continue;
				const x2 = i % N + DX[d];
				const z2 = (i / N | 0) + DZ[d];
				if (x2 < 0 || z2 < 0 || x2 >= N || z2 >= N) continue;
				const j = z2 * N + x2;
				if (!seen[j]) {
					seen[j] = 1;
					bfs[qt++] = j;
				}
			}
		}
		let ends = 0;
		for (let i = 0; i < NN; i++) {
			if (PATH_BITS[res[i]] && !seen[i]) {
				stats.vOrphan++;
				return false;
			}
			if (OPT_T[res[i]] === T.path_end) ends++;
		}
		if (ends > 1 || !any && ends > 0) {
			stats.vEnds++;
			return false;
		}
		for (let axis = 0; axis < 2; axis++) {
			const dA = axis === 0 ? 0 : 3;
			const dB = axis === 0 ? 2 : 1;
			for (let s = 1; s <= 2; s++) for (let a = 0; a < N; a++) {
				let run = 0;
				let fromBorder = false;
				for (let b = 0; b < N; b++) {
					const o = res[axis === 0 ? b * N + a : a * N + b];
					if (SIG[o * 4 + dA] === s && SIG[o * 4 + dB] === s) {
						if (run === 0) fromBorder = b === 0;
						run++;
						const lim = fromBorder || b === 7 ? cfg.maxBorderRun : cfg.maxInnerRun;
						if (run > lim) {
							stats.vRun++;
							return false;
						}
					} else run = 0;
				}
			}
		}
		return true;
	}
	function stubFill(X) {
		res.fill(FALLBACK_OPT);
		const key = (id, out, code) => {
			const s = [
				0,
				0,
				0,
				0
			];
			s[out] = code;
			return id + ":" + s.join("");
		};
		for (const r of X.rivers) res[r.cell] = OPT_BY.get(key("river_source", r.out, R));
		for (const r of X.roads) res[r.cell] = OPT_BY.get(key("path_end", r.out, P));
	}
	function generate(cx, cz) {
		const isOrigin = cx === 0 && cz === 0;
		originChunk = isOrigin;
		const X = crossings(cx, cz);
		computeFields(cx, cz);
		let done = false;
		let attempt = 0;
		for (; attempt < cfg.maxAttempts && !done; attempt++) {
			stats.attempts++;
			const rng = mulberry(hash2(cx, cz, seed * 31 + attempt * 7919 + 17 | 0));
			const strict = attempt >= cfg.maxAttempts - cfg.strictAttempts;
			if (!plan(cx, cz, X, rng, isOrigin, attempt)) {
				stats.planFails++;
				continue;
			}
			computeWeights(strict);
			if (!solve(rng, isOrigin)) {
				stats.restarts++;
				continue;
			}
			if (!validate()) {
				stats.validateFails++;
				continue;
			}
			done = true;
			if (strict) stats.strictChunks++;
		}
		if (!done) {
			stubFill(X);
			stats.fallbackChunks++;
		}
		const cells = new Array(NN);
		for (let i = 0; i < NN; i++) {
			const opt = OPTIONS[res[i]];
			const x = cx * N + i % N - OX;
			const z = cz * N + (i / N | 0) - OZ;
			const rot = opt.rots.length === 1 ? opt.rots[0] : opt.rots[hash2(x, z, seed + 77) % opt.rots.length];
			cells[i] = Object.freeze({
				x,
				z,
				tileId: opt.tileId,
				model: opt.tile.model,
				rot,
				sockets: socketsOf(opt.tileId, rot),
				tags: opt.tile.tags,
				biome: BIOMES[cBiome[i]]
			});
		}
		let chunk = {
			cells,
			attempts: attempt,
			fallback: !done
		};
		chunk = postProcessBuildings(chunk, cx, cz);
		stats.chunks++;
		return chunk;
	}
	function postProcessBuildings(chunk, cx, cz) {
		const chunkKey = `${cx},${cz}`;
		const geoState = _geoStateRef.value?.get(chunkKey);
		if (!geoState || !geoState.forcedTiles) return chunk;
		const cells = chunk.cells.slice();
		for (let i = 0; i < NN; i++) {
			const forced = geoState.forcedTiles.get(i);
			if (forced && forced.isRegistryBuilding && forced.osmId) {
				const opt = OPTIONS[res[i]];
				const rot = opt.rots.length === 1 ? opt.rots[0] : opt.rots[hash2(chunk.cells[i].x, chunk.cells[i].z, seed + 77) % opt.rots.length];
				const socketTileId = forced.registryTileType || forced.tileId;
				cells[i] = Object.freeze({
					...chunk.cells[i],
					tileId: forced.osmId,
					model: forced.osmId,
					rot,
					sockets: socketsOf(socketTileId, rot)
				});
			}
		}
		return {
			...chunk,
			cells
		};
	}
	const keyOf = (cx, cz) => (cx + 4194304) * 8388608 + (cz + 4194304);
	function chunkAt(cx, cz) {
		const key = keyOf(cx, cz);
		if (key === lastKey) return lastChunk;
		let ch = chunks.get(key);
		if (!ch) {
			ch = generate(cx, cz);
			chunks.set(key, ch);
			if (chunks.size > cfg.maxChunks) {
				chunks.delete(chunks.keys().next().value);
				stats.evicted++;
			}
		}
		lastKey = key;
		lastChunk = ch;
		return ch;
	}
	const sane = (v) => {
		if (!(v >= -16777216 && v <= COORD_LIMIT)) v = v > COORD_LIMIT ? COORD_LIMIT : v < -16777216 ? -16777216 : 0;
		return Math.round(v);
	};
	let fallbackProto = null;
	const fallbackCell = (x, z) => {
		const t = fallbackProto || (fallbackProto = getTile(FALLBACK_TILE));
		return Object.freeze({
			x,
			z,
			tileId: t.id,
			model: t.model,
			rot: 0,
			sockets: socketsOf(t.id, 0),
			tags: t.tags,
			biome: biomeAt(seed, x, z)
		});
	};
	return {
		seed,
		/** Collapsed cell (collapsing its chunk on demand). Always returns a valid cell; never throws. O(1) once collapsed. */
		get(x, z) {
			if ((x | 0) !== x || (z | 0) !== z || x > COORD_LIMIT || x < -16777216 || z > COORD_LIMIT || z < -16777216) {
				x = sane(+x);
				z = sane(+z);
			}
			const gx = x + OX;
			const gz = z + OZ;
			const cx = gx >> 3;
			const cz = gz >> 3;
			return (keyOf(cx, cz) === lastKey ? lastChunk : chunkAt(cx, cz)).cells[(gz & 7) * N + (gx & 7)] || fallbackCell(x, z);
		},
		/** Like get() but returns null if the cell has not been collapsed yet (no side effects). */
		peek(x, z) {
			x = sane(+x);
			z = sane(+z);
			const gx = x + OX;
			const gz = z + OZ;
			const ch = chunks.get(keyOf(gx >> 3, gz >> 3));
			return ch ? ch.cells[(gz & 7) * N + (gx & 7)] : null;
		},
		/** Make sure every cell within r cells (Chebyshev) of (cx,cz) is collapsed. */
		ensureRegion(cx, cz, r) {
			cx = sane(+cx);
			cz = sane(+cz);
			const Rr = Math.min(4096, Math.max(0, Math.ceil(+r || 0)));
			const c0x = cx - Rr + OX >> 3;
			const c1x = cx + Rr + OX >> 3;
			const c0z = cz - Rr + OZ >> 3;
			const c1z = cz + Rr + OZ >> 3;
			for (let z = c0z; z <= c1z; z++) for (let x = c0x; x <= c1x; x++) chunkAt(x, z);
		},
		get size() {
			return chunks.size * NN;
		},
		/** Solver counters (checks / debugging): chunks, attempts, backtracks, restarts, fallbackChunks, ... */
		stats,
		chunkSize: N,
		/** Geographic constraints state for Laramie mode. */
		get _geoState() {
			return _geoStateRef.value;
		},
		set _geoState(v) {
			_geoStateRef.value = v;
		},
		/** Debug: how the chunk holding cell (x,z) was solved ({ attempts, fallback }). */
		chunkInfo(x, z) {
			const ch = chunkAt(sane(+x) + OX >> 3, sane(+z) + OZ >> 3);
			const cx = sane(+x) + OX >> 3;
			const cz = sane(+z) + OZ >> 3;
			return {
				cx,
				cz,
				attempts: ch.attempts,
				fallback: ch.fallback,
				crossings: crossings(cx, cz)
			};
		}
	};
}
// src/world/fold.js
var _q = new Quaternion();
var _box$2 = new Box3();
var WIND = CONFIG.spring.wind || { enabled: false };
var DEG$1 = Math.PI / 180;
var W_DIR = (WIND.directionDeg ?? 30) * DEG$1;
var D1X = Math.cos(W_DIR);
var D1Z = Math.sin(W_DIR);
var D2X = Math.cos(W_DIR + .9);
var D2Z = Math.sin(W_DIR + .9);
var K1 = 2 * Math.PI / (WIND.gustLength ?? 14);
var W1 = 2 * Math.PI / (WIND.gustPeriod ?? 9);
var K2 = 2 * Math.PI / (WIND.gust2Length ?? 8);
var W2 = 2 * Math.PI / (WIND.gust2Period ?? 5.3);
var G1 = .32;
var G2 = .18;
var WARP = WIND.gustWarp ?? 1.7;
var KF = 2 * Math.PI / (WIND.flutterLength ?? 5);
var rx = (src) => src ? new RegExp(src, "i") : null;
var RX_LOOSE = rx(WIND.loose);
var RX_RIGID = rx(WIND.rigid);
var RX_STIFF = rx(WIND.stiff);
function hash01(i, salt) {
	let h = (Math.imul(i + 1, 2654435761) ^ Math.imul(salt | 0, 2246822507)) >>> 0;
	h ^= h >>> 15;
	h = Math.imul(h, 739982445) >>> 0;
	h ^= h >>> 12;
	h = Math.imul(h, 695872825) >>> 0;
	h ^= h >>> 15;
	return (h >>> 0) / 4294967296;
}
function strHash$1(s) {
	let h = 2166136261;
	for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
	return h | 0;
}
/** userData is JSON-copied by Object3D.clone, so a cached rest quaternion may come back as an array / plain object. */
function restOf(node) {
	const ud = node.userData;
	const r = ud.restQuaternion;
	if (r && r.isQuaternion) return r;
	const q = new Quaternion();
	if (Array.isArray(r) && r.length === 4) q.fromArray(r);
	else if (r && typeof r === "object" && r._x !== void 0) q.set(r._x, r._y, r._z, r._w);
	else if (r && typeof r === "object" && r.x !== void 0) q.set(r.x, r.y, r.z, r.w);
	else q.copy(node.quaternion);
	ud.restQuaternion = q;
	return q;
}
/**
* @param {THREE.Group} tileGroup a CLONE of a tile prototype (flaps in their upright rest pose, or
*        previously processed by createFoldInstance - the rest pose is cached in userData.restQuaternion)
* @param {{tileId?:string}} info
*/
function createFoldInstance(tileGroup, info = {}) {
	const S = CONFIG.spring;
	const h = S.maxStep;
	const salt = strHash$1(String(info.tileId ?? tileGroup.userData.tileId ?? ""));
	const flaps = [];
	const byNode = /* @__PURE__ */ new Map();
	tileGroup.traverse((node) => {
		const ud = node.userData;
		if (!ud || !ud.hinge) return;
		const rest = restOf(node);
		let size = ud.size;
		if (size === void 0) {
			const keep = _q.copy(node.quaternion);
			node.quaternion.copy(rest);
			_box$2.setFromObject(node);
			node.quaternion.copy(keep);
			size = Math.min(1, Math.max(.05, (_box$2.max.y - _box$2.min.y) / TILE_SIZE));
			if (!Number.isFinite(size)) size = .3;
			ud.size = size;
		}
		let parent = null;
		for (let a = node.parent; a; a = a.parent) {
			if (byNode.has(a)) {
				parent = byNode.get(a);
				break;
			}
			if (a === tileGroup) break;
		}
		const i = flaps.length;
		const sizeT = Math.min(1, Math.max(0, (size - S.sizeSmall) / (S.sizeLarge - S.sizeSmall)));
		const stiff = Math.max(.25, ud.stiffness ?? 1);
		const fs = (S.freqSmall + (S.freqLarge - S.freqSmall) * sizeT) * Math.sqrt(stiff) * (1 + (hash01(i, salt) * 2 - 1) * S.jitter);
		const wob = Math.min(2.5, Math.max(.2, (ud.wobble ?? 1) * (S.wobble / .06) * (1 + (S.wobbleLarge - 1) * sizeT)));
		const tw = hash01(i, salt + 13);
		const wL = 2 * Math.PI * S.flutterHz * Math.pow(fs, S.flutterSizePower) * (1 + (hash01(i, salt + 7) * 2 - 1) * S.jitter);
		const delay = Math.min(1, Math.max(0, ud.delay ?? 0));
		const f = {
			node,
			rest,
			foldAngle: ud.foldAngle ?? Math.PI / 2,
			delay,
			layer: ud.layer ?? 0,
			stiffness: stiff,
			wobble: ud.wobble ?? 1,
			size,
			parent,
			freqScale: fs,
			kUp: S.stiffness * fs * fs,
			cUp: S.damping * fs * (1 + (S.dampingLarge - 1) * sizeT),
			kDn: S.downStiffness * fs * fs,
			cDn: S.downDamping * fs,
			gDn: S.downPull * fs * fs,
			wLsq: wL * wL,
			cL: 2 * (S.flutterDamping / Math.sqrt(wob)) * wL,
			dragL: S.flutterDrag / Math.sqrt(wob),
			fricL: S.flutterFriction * fs * (1 + (S.flutterFrictionLarge - 1) * sizeT),
			twist: S.twist * (tw < .5 ? -1 : 1) * (.55 + .45 * Math.abs(tw * 2 - 1)) * (.6 + .4 * sizeT),
			kN: S.nestedStiffness,
			aN: S.nestedMaxAccel + .5 - .5,
			cN: 2 * S.nestedDamping * Math.sqrt(S.nestedStiffness),
			tUp: 0,
			tDown: 0,
			p: 0,
			v: 0,
			m: 0,
			mPrev: 0,
			locked: false,
			sw: 0,
			swAmp: 0,
			swHz: 0,
			swPh: 0,
			swTwist: 0,
			lx: 0,
			lz: 0,
			nx: 0,
			nz: 1,
			spin: null,
			spinPh: 0,
			tgt: 0,
			started: true,
			atRest: true
		};
		byNode.set(node, f);
		flaps.push(f);
	});
	let span = 0;
	for (const f of flaps) {
		f.tUp = f.delay * S.staggerSpan;
		if (f.parent && f.tUp < f.parent.tUp + S.nestedLag) f.tUp = f.parent.tUp + S.nestedLag;
		if (f.tUp > span) span = f.tUp;
	}
	for (const f of flaps) f.tDown = span - f.tUp;
	const sway = [];
	if (WIND.enabled) {
		const minA = (WIND.minDeg ?? .5) * DEG$1;
		const maxA = (WIND.maxDeg ?? 1.9) * DEG$1;
		for (let i = 0; i < flaps.length; i++) {
			const f = flaps[i];
			if (f.parent !== null) continue;
			const node = f.node;
			for (let c = 0; c < node.children.length; c++) if (node.children[c].userData && node.children[c].userData.spin) f.spin = node.children[c];
			const keep = _q.copy(node.quaternion);
			node.quaternion.copy(f.rest);
			_box$2.setFromObject(node);
			node.quaternion.copy(keep);
			const H = _box$2.max.y - _box$2.min.y;
			const Wd = Math.max(_box$2.max.x - _box$2.min.x, _box$2.max.z - _box$2.min.z, .001);
			const tall = Math.min(1, Math.max(0, (H - WIND.tallLo) / (WIND.tallHi - WIND.tallLo)));
			const thin = Math.min(1, Math.max(0, (H / Wd - WIND.thinLo) / (WIND.thinHi - WIND.thinLo)));
			const nm = String(node.name || "").replace(/^.*__/, "");
			const cls = RX_LOOSE && RX_LOOSE.test(nm) ? WIND.looseMul : RX_RIGID && RX_RIGID.test(nm) ? WIND.rigidMul : RX_STIFF && RX_STIFF.test(nm) ? WIND.stiffMul : 1;
			let amp = Number.isFinite(H) ? (minA + (maxA - minA) * (tall * .55 + thin * .45)) * cls * (node.userData.sway ?? 1) : 0;
			if (amp < (WIND.cutoffDeg ?? .08) * DEG$1) amp = 0;
			f.swAmp = amp;
			f.swHz = 2 * Math.PI * (WIND.hzSmall + (WIND.hzLarge - WIND.hzSmall) * tall) * (.85 + .3 * hash01(i, salt + 31));
			f.swPh = hash01(i, salt + 37) * Math.PI * 2;
			f.swTwist = (hash01(i, salt + 41) < .5 ? -1 : 1) * (WIND.twist ?? .5) * (.6 + .4 * hash01(i, salt + 43));
			f.lx = node.position.x;
			f.lz = node.position.z;
			const r = f.rest;
			f.nx = 2 * (r._x * r._z + r._w * r._y);
			f.nz = 1 - 2 * (r._x * r._x + r._y * r._y);
			f.spinPh = hash01(i, salt + 47) * Math.PI * 2;
			if (amp > 0 || f.spin !== null) sway.push(f);
		}
	}
	const nSway = sway.length;
	const swFade = Math.max(.001, WIND.fadeIn ?? 1.2);
	const swMax = (WIND.limitDeg ?? 2.5) * DEG$1;
	let swOn = false;
	let target = 0;
	let steps = 0;
	const st = /* @__PURE__ */ new Float64Array(4);
	let extraDelay = 0;
	let settled = true;
	const n = flaps.length;
	const eps = S.settleEps;
	const veps = S.settleEps * 12;
	const tStart = new Float64Array(2 * n);
	for (let i = 0; i < n; i++) {
		tStart[i] = flaps[i].tUp - 1e-9;
		tStart[n + i] = flaps[i].tDown - 1e-9;
	}
	/**
	* quaternion = rest * RotX(foldAngle * (1 - p)) * RotY(twist), written straight into the quaternion's fields:
	* Quaternion.copy/multiply fire three's change callback (Euler sync), which allocates and costs more than the
	* spring itself. `sync` (used whenever a flap comes to rest) goes through set() so node.rotation is correct at rest.
	*/
	function pose(f, p, sync) {
		const r = f.rest;
		const half = (f.foldAngle * (1 - p) + f.sw) * .5;
		const s = Math.sin(half);
		const c = Math.cos(half);
		let x = r._x * c + r._w * s;
		let y = r._y * c + r._z * s;
		let z = r._z * c - r._y * s;
		let w = r._w * c - r._x * s;
		const tw = (f.locked && p !== 1 ? f.twist * (p - 1) : 0) + f.sw * f.swTwist;
		if (tw !== 0) {
			const ht = tw * .5;
			const s2 = Math.sin(ht);
			const c2 = Math.cos(ht);
			const x2 = x * c2 - z * s2;
			const y2 = y * c2 + w * s2;
			const z2 = z * c2 + x * s2;
			w = w * c2 - y * s2;
			x = x2;
			y = y2;
			z = z2;
		}
		const q = f.node.quaternion;
		if (sync) q.set(x, y, z, w);
		else {
			q._x = x;
			q._y = y;
			q._z = z;
			q._w = w;
		}
	}
	function snap(p) {
		for (let i = 0; i < n; i++) {
			const f = flaps[i];
			f.p = f.m = f.mPrev = p;
			f.v = 0;
			f.locked = p >= 1;
			f.started = true;
			f.atRest = true;
			f.tgt = p >= .5 ? 1 : 0;
			f.sw = 0;
			pose(f, p, true);
		}
		target = p >= .5 ? 1 : 0;
		st[1] = p;
		st[0] = 0;
		st[2] = 0;
		swOn = false;
		settled = true;
	}
	snap(0);
	function emit(f) {
		const x = tileGroup.position.x;
		const z = tileGroup.position.z;
		bus.emit("fold", {
			x,
			z,
			dir: f.tgt ? "up" : "down",
			tileId: info.tileId ?? tileGroup.userData.tileId ?? "unknown",
			size: f.size,
			pan: panFor(x, z),
			layer: f.layer
		});
	}
	/** One fixed step for one flap. */
	function stepFlap(f) {
		let a;
		const par = f.parent;
		if (f.tgt === 1) {
			if (!f.locked && f.m >= 1) f.locked = true;
			a = f.locked ? -f.wLsq * (f.m - 1) - (f.cL + f.dragL * Math.abs(f.v) + f.fricL / (Math.abs(f.v) + .05)) * f.v : par !== null && par.tgt === 1 && par.started && !par.atRest ? Math.max(-f.aN, Math.min(f.aN, f.kN * (par.m - f.m) + f.cN * (par.v - f.v))) : f.kUp * (1 - f.m) - f.cUp * f.v;
		} else if (par !== null && par.tgt === 0 && par.started && !par.atRest && f.m <= 1 && par.m <= 1) a = Math.max(-f.aN, Math.min(f.aN, f.kN * (par.m - f.m) + f.cN * (par.v - f.v)));
		else {
			a = -f.kDn * f.m - f.cDn * f.v - f.gDn;
			if (f.v > 0) a -= f.cUp * f.v * (f.m < 1 ? f.m : 1);
			if (f.m > 1) a -= f.wLsq * (f.m - 1) + f.cL * f.v;
		}
		f.mPrev = f.m;
		f.v += a * h;
		f.m += f.v * h;
		if (f.m <= 0 && f.tgt === 0) {
			f.m = 0;
			f.v = f.v < -S.minBounceSpeed * f.freqScale ? -f.v * S.restitution : 0;
			if (f.v === 0) f.atRest = true;
		} else if (f.m < 0) {
			f.m = 0;
			if (f.v < 0) f.v = 0;
		}
		if (f.tgt === 1 && Math.abs(f.m - 1) < eps && Math.abs(f.v) < veps) {
			f.m = 1;
			f.v = 0;
			f.atRest = true;
		}
	}
	return {
		flaps,
		info,
		get target() {
			return target;
		},
		get progress() {
			return st[1];
		},
		get settled() {
			return settled;
		},
		/** 1 = rise, 0 = fold flat. `delay` (s) postpones the whole tile (used for ripple). No-op if unchanged. */
		setTarget(t, delay = 0) {
			t = t ? 1 : 0;
			if (t === target) return;
			target = t;
			steps = 0;
			extraDelay = delay > 0 ? delay : 0;
			let any = false;
			for (let i = 0; i < n; i++) {
				const f = flaps[i];
				if (f.tgt === t) {
					f.started = true;
					if (!f.atRest) any = true;
				} else {
					f.started = false;
					any = true;
				}
			}
			settled = !any;
			if (n === 0) st[1] = t;
		},
		/** Instantly place every flap at progress p (0 or 1) with zero velocity. */
		snap,
		/** Flaps the wind moves (top-level flaps with swAmp > 0 or a spinner). World reads `.node` to refresh matrices. */
		sway,
		/**
		* Wind pose for time t (s). strength >= 0: sway every flap in `sway` (only while risen + settled; fades in
		* over wind.fadeIn after settling); strength < 0: leave the sway alone (tile is moving).
		* spinK scales the spinner speed (0 = leave spinners alone). cy, sy = cos / sin of the tile's Y rotation.
		* Pure function of t and place apart from the fade-in; allocation-free; emits nothing.
		*/
		applyWind(t, strength, spinK, cy, sy) {
			if (nSway === 0) return;
			const doSway = strength >= 0 && settled && target === 1;
			let lvl = 0;
			if (doSway) {
				if (!swOn || t < st[3]) {
					swOn = true;
					st[3] = t - st[2] * swFade;
				}
				lvl = (t - st[3]) / swFade;
				if (lvl > 1) lvl = 1;
				st[2] = lvl;
			}
			const X = tileGroup.position.x;
			const Z = tileGroup.position.z;
			for (let i = 0; i < nSway; i++) {
				const f = sway[i];
				const px = X + cy * f.lx + sy * f.lz;
				const pz = Z - sy * f.lx + cy * f.lz;
				const along = px * D1X + pz * D1Z;
				const a = along * K1 - t * W1 + WARP * Math.sin((pz * D1X - px * D1Z) * K1 * .6);
				const b = (px * D2X + pz * D2Z) * K2 - t * W2;
				if (f.spin !== null && spinK > 0) {
					const ha = (f.spinPh + spinK * WIND.spinSpeed * (t + WIND.spinGust * (2 * G1 / W1 * Math.cos(a) + 2 * G2 / W2 * Math.cos(b)))) * .5;
					const q = f.spin.quaternion;
					q._x = 0;
					q._y = 0;
					q._z = Math.sin(ha);
					q._w = Math.cos(ha);
				}
				if (doSway && f.swAmp > 0) {
					const g = .5 + G1 * Math.sin(a) + G2 * Math.sin(b);
					const e = .35 + .65 * g;
					const ph = f.swHz * t + f.swPh - along * KF;
					const dotN = (cy * f.nx + sy * f.nz) * D1X + (cy * f.nz - sy * f.nx) * D1Z;
					let A = f.swAmp * strength;
					if (A > swMax) A = swMax;
					f.sw = A * lvl * (.5 * (g - .3) * dotN + e * (.55 * Math.sin(ph) + .1 * Math.sin(2.31 * ph + 1.7)));
					pose(f, f.p, false);
				}
			}
		},
		update(dt) {
			if (settled || !(dt > 0)) return;
			swOn = false;
			const swDec = st[2] > 0 ? Math.exp(-dt / (WIND.release ?? .22)) : 1;
			if (st[2] > 0) {
				st[2] *= swDec;
				if (st[2] < 1e-4) st[2] = 0;
			}
			let acc = st[0] + dt;
			let k = Math.floor(acc / h + 1e-7) | 0;
			if (k > S.maxSubSteps) {
				k = S.maxSubSteps;
				acc = k * h;
			}
			acc -= k * h;
			if (acc < 0) acc = 0;
			st[0] = acc;
			const alpha = acc / h;
			const up = target === 1;
			const t0 = steps * h - extraDelay;
			let all = true;
			let sum = 0;
			for (let j = 1; j <= k; j++) {
				const tj = t0 + j * h;
				for (let i = 0; i < n; i++) {
					const f = flaps[i];
					if (f.atRest && f.started) continue;
					if (!f.started && tj >= tStart[up ? i : n + i]) {
						f.started = true;
						f.tgt = target;
						if (target === 0 && f.atRest && f.m >= 1) f.v = S.downAnticipation * f.freqScale;
						f.atRest = false;
						f.locked = false;
						emit(f);
					}
					if (!f.atRest) stepFlap(f);
				}
			}
			for (let i = 0; i < n; i++) {
				const f = flaps[i];
				const sw = f.sw !== 0;
				if (sw) f.sw = st[2] > 0 ? f.sw * swDec : 0;
				if (f.atRest) {
					if (!f.started) all = false;
					if (f.p !== f.m || f.mPrev !== f.m) {
						f.p = f.mPrev = f.m;
						pose(f, f.p, true);
					} else if (sw) pose(f, f.p, false);
				} else {
					all = false;
					f.p = f.mPrev + (f.m - f.mPrev) * alpha;
					pose(f, f.p, false);
				}
				sum += f.p;
			}
			steps = steps + k | 0;
			if (n > 0) st[1] = sum / n;
			if (all) {
				settled = true;
				st[1] = target;
				st[0] = 0;
			}
		}
	};
}
// src/world/cards.js
/** Soft fillers only: they never block. */
var THIN_RX = /^(bush|tuft|flowers|fern|desert_flowers|thorn|snowbush|mushrooms)/;
function hashStr(s) {
	let h = 2166136261;
	for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
	return h >>> 0;
}
/**
* true: the top-level flap `name` ('bush_g10', loader prefix already stripped) of tile model `model` stays down in every
* cell. Share = CONFIG.world.cards.thin (thinHouse on house tiles); thin: 0 or cards.enabled: false switches it off.
* Fixed per model + name (it was seeded per cell, which no baked print could follow).
*/
function isThinned(model, name) {
	const C = CONFIG.world.cards;
	if (!C || C.enabled === false || !(C.thin > 0) || !THIN_RX.test(name)) return false;
	const tags = MODELS[model] && MODELS[model].tags;
	const rate = ((tags && tags.includes("house") ? C.thinHouse : C.thin) || 0) * 100;
	return (Math.imul(hashStr(model + "/" + name) ^ 2654435769, 2654435761) >>> 0 >>> 8) % 100 < rate;
}
// src/render/water.js
var NB$2 = BIOMES.length;
/** Defaults; CONFIG.book.water / CONFIG.book.groundPrint override key by key. */
var WATER_DEFAULTS = {
	enabled: true,
	/** Blur radius of the baked shore mask in tile uv (1 = one tile). Rim, waterline and depth band scale with it. */
	shoreBlur: .1,
	ripple: .95,
	reflection: .9,
	caustic: .07,
	floaters: 1,
	flow: .17,
	streak: .55,
	/** shortfall pass: REAL mirrored reflections (planar pass, see renderReflection below). */
	mirror: {
		enabled: true,
		scale: .5,
		maxWidth: 1024,
		strength: .95,
		gain: .88,
		tint: .6,
		distort: .017,
		ice: .34,
		band: .22,
		clip: .03,
		night: .62,
		include: [
			"world",
			"traveller-root",
			"life",
			"life_animals"
		],
		exclude: ["life_soft"],
		traveller: "traveller-root",
		travellerReach: 1,
		travellerMeshes: 5,
		travellerInstead: ["life"],
		minQuality: "med"
	},
	palette: {
		heartland: [
			"#6fc4b0",
			"#1f8f8a",
			"#f6e6bc",
			"#dc9440"
		],
		desert: [
			"#74c4ac",
			"#1f8a80",
			"#f7e3b6",
			"#c9c06a"
		],
		snow: [
			"#b7c8de",
			"#8fa6c6",
			"#f8f9fc",
			"#f6f8fc"
		],
		blossom: [
			"#72c2ae",
			"#218a82",
			"#f6e4cc",
			"#f4a3b3"
		],
		pinewood: [
			"#58988a",
			"#1f5f5c",
			"#cfc49c",
			"#c7933d"
		]
	}
};
var GROUND_DEFAULTS = {
	enabled: true,
	soften: 2.3,
	wobble: .011,
	mottle: .085,
	clumps: .7,
	seam: .45,
	path: 1,
	wobbleSlow: .016,
	flatten: .94,
	groundColor: "#b4aa77",
	pathColor: "#eed3a8",
	contact: .13,
	pathWorn: .17
};
function waterConfig() {
	return {
		...WATER_DEFAULTS,
		...CONFIG.book && CONFIG.book.water || {}
	};
}
function groundConfig() {
	return {
		...GROUND_DEFAULTS,
		...CONFIG.book && CONFIG.book.groundPrint || {}
	};
}
/**
* Water kind of a tile model: 0 none, 1 pond, 2 river N-S, 3 river corner N-E, 4 river E-W (bridge), 5 source, 6 ice.
* disc = [u east, v south, radius] in world units (ponds only).
*/
function waterKind(id) {
	const m = MODELS[id];
	if (!m || !m.tags || !m.tags.includes("water")) return {
		kind: 0,
		disc: null
	};
	const W = CONFIG.world || {};
	const pd = W.ponds && W.ponds[id];
	if (id === "frozen_pond") return {
		kind: 6,
		disc: pd || [
			0,
			0,
			W.pondRadius || .62
		]
	};
	if (pd) return {
		kind: 1,
		disc: pd
	};
	if (id === "pond") return {
		kind: 1,
		disc: [
			0,
			0,
			W.pondRadius || .62
		]
	};
	const s = m.sockets || {};
	const r = (k) => s[k] === "river";
	if ([
		"n",
		"e",
		"s",
		"w"
	].filter(r).length === 1) return {
		kind: 5,
		disc: null
	};
	if (r("n") && r("s")) return {
		kind: 2,
		disc: null
	};
	if (r("e") && r("w")) return {
		kind: 4,
		disc: null
	};
	if (r("n") && r("e")) return {
		kind: 3,
		disc: null
	};
	return {
		kind: 2,
		disc: null
	};
}
/** Uniforms shared by the page shader. */
function waterUniforms() {
	const w = waterConfig();
	const g = groundConfig();
	const pal = [];
	const c = new Color();
	for (let b = 0; b < NB$2; b++) {
		const p = w.palette && w.palette[BIOMES[b]] || WATER_DEFAULTS.palette[BIOMES[b]] || WATER_DEFAULTS.palette.heartland;
		for (let i = 0; i < 4; i++) {
			c.set(p[i]);
			pal.push(new Vector3(c.r, c.g, c.b));
		}
	}
	const on = w.enabled !== false ? 1 : 0;
	const gon = g.enabled !== false ? 1 : 0;
	return {
		uWat: { value: new Vector4(0, w.ripple * on, w.reflection, w.floaters) },
		uWat2: { value: new Vector4(w.flow, w.caustic, w.streak, on) },
		uGnd: { value: new Vector4(g.mottle * gon, g.clumps * gon, gon ? g.seam : 1, g.path * gon) },
		uWatPal: { value: pal }
	};
}
/** Fragment shader of the bake copy pass: rgb = the print, a = blurred water mask (uWk.x = 1) or 0. */
var BAKE_COPY_FRAG = `
uniform sampler2D t;
uniform vec4 uWk;   // x: 1 = water tile base print (2 = ice: disc only), yz: pond disc centre (uv), w: pond disc radius (uv, 0 = none)
uniform float uR;   // blur radius (uv)
varying vec2 vUv;
float wmask(vec2 uv) {
  uv = clamp(uv, 0.0, 1.0);
  vec3 c = texture2D(t, uv).rgb;
  float m = smoothstep(0.035, 0.085, min(c.g, c.b) - c.r);
  if (uWk.x > 1.5) return 1.0 - smoothstep(uWk.w * 0.93, uWk.w, distance(uv, uWk.yz));   // ice: the pale print fails the teal test
  if (uWk.w > 0.0) m = max(m, 1.0 - smoothstep(uWk.w * 0.78, uWk.w * 0.9, distance(uv, uWk.yz)));
  return m;
}
void main() {
  vec4 c = texture2D(t, vUv);
  float a = 0.0;
  if (uWk.x > 0.5) {
    float s = 0.0; float ws = 0.0;
    for (int j = -6; j <= 6; j++) {
      for (int i = -6; i <= 6; i++) {
        vec2 o = vec2(float(i), float(j)) / 6.0;
        float w = max(0.0, 1.0 - dot(o, o));
        s += w * wmask(vUv + o * uR); ws += w;
      }
    }
    a = s / ws;
  }
  gl_FragColor = vec4(c.rgb, a);
}`;
/** Declarations + helpers (fragment, after <common>). */
function waterGLSL() {
	return `
uniform vec4 uWat;    // x: time (s), y: ripple opacity, z: reflection, w: floaters
uniform vec4 uWat2;   // x: flow speed, y: caustic, z: night streak, w: enabled
uniform vec4 uGnd;    // x: mottle, y: clumps, z: seam factor, w: path treatment
uniform vec3 uWatPal[${NB$2 * 4}];
float gWatGlow;
float gPathM;              // round 3: road mask of the ground print (book.js biome path tones use it)
uniform sampler2D uReflTex;   // planar mirror pass (rgb = lit colour, a = coverage)
uniform vec4 uRefl;           // x: strength (0 = pass off), y: distort (uv at w = 1), z: tint, w: gain
uniform vec4 uRefl2;          // x: ice strength, y: band factor, z: night gain, w: blur step (uv)
varying vec4 vReflP;
vec4 gWatRefl;                // xy: ripple displacement (unit waves), z: mirror weight, w: ice
vec3 gWatCol;
float gWatNight = 0.0;
#define WKF(n) (0.02454369 * float(n))   /* multiples of 2 pi / 256: the world position wraps every 256 units */
float wHash(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
// value noise, f = lattice cells per world unit (256 f must be an integer)
float wNoise(vec2 x, float f) {
  vec2 q = x * f; vec2 i = floor(q); vec2 u = q - i; u = u * u * (3.0 - 2.0 * u); float P = 256.0 * f;
  return mix(mix(wHash(mod(i, P)), wHash(mod(i + vec2(1.0, 0.0), P)), u.x), mix(wHash(mod(i + vec2(0.0, 1.0), P)), wHash(mod(i + vec2(1.0, 1.0), P)), u.x), u.y);
}
// lens-shaped cut dash: c = centred position, L = half length, th = half thickness at the middle
float wLens(vec2 c, float L, float th, float aa) {
  float d = c.x / L; float k = max(1.0 - d * d, 0.0);
  return (1.0 - smoothstep(th * k - aa, th * k + aa, abs(c.y))) * smoothstep(0.0, 0.3, k);
}
// river dashes in the flow frame (s along, c across): a brick pattern, periodic per tile, mirror-symmetric
float wRiverDash(vec2 sc, int ph, float aa, float sg) {
  const float PER = 0.5; const float RH = 0.105;
  float r; float cy;
  if (ph == 0) { r = floor(sc.y / RH + 0.5); cy = sc.y - r * RH; r = abs(r); }
  else { r = floor(abs(sc.y) / RH); cy = abs(sc.y) - (r + 0.5) * RH; }
  float sx = sc.x + 0.5 * PER * mod(r, 2.0);
  float cx = (fract(sx / PER) - 0.5) * PER;
  // round 3: some dashes drop out and their length varies (4 cells = one tile, so the pattern still tiles)
  float dh = wHash(vec2(mod(floor(sx / PER), 4.0) + 0.5, r + 7.0 * float(ph)));
  float L = 0.11 + 0.1 * fract(dh * 7.1);
  return step(0.4, dh) * wLens(vec2(cx, cy), L, 0.0115 * (1.0 + 0.62 * sg * cx / L), aa);   // round 3: thicker head downstream, thin tail
}
// lily pad: disc with a notch, pale cut rim and radial veins. returns (coverage, ink 0..1 for rim / veins)
vec2 wPad(vec2 c, float r, float turn, float aa) {
  float len = length(c);
  float ang = atan(c.y, c.x) + turn;
  float notch = smoothstep(0.26, 0.34, abs(mod(ang, 6.2832) - 3.1416));
  float cov = (1.0 - smoothstep(r - aa, r + aa, len)) * max(notch, 1.0 - smoothstep(r * 0.12, r * 0.3, len));
  float rim = smoothstep(r - 0.009 - aa, r - 0.009 + aa, len);
  float vein = (1.0 - smoothstep(0.1, 0.22, abs(sin(ang * 3.5)))) * smoothstep(r * 0.2, r * 0.45, len) * 0.45;
  return vec2(cov, max(rim, vein));
}
`;
}
/**
* GROUND PRINT body. Runs right after the base / twin fetches of pageColor().
* In: p, f, uv, dx, dy, layer, gb, base4 (crisp base print, rgba), flat_. Out: base (vec3), isProp, wq, wpx.
*/
function groundBodyGLSL(bakeSize) {
	const g = groundConfig();
	const on = g.enabled !== false;
	const gmin = (Math.pow(2, g.soften) / 512).toFixed(6);
	const lin = (hex) => {
		const c = new Color(hex);
		return [
			c.r,
			c.g,
			c.b
		];
	};
	const v3 = (a) => `vec3(${a.map((v) => v.toFixed(4)).join(", ")})`;
	const GC = lin(g.groundColor || GROUND_DEFAULTS.groundColor);
	const PC = lin(g.pathColor || GROUND_DEFAULTS.pathColor);
	const fl = (v, d = 4) => (+v).toFixed(d);
	return `
  vec2 wq = p + uWorld0;
  float wpx = max(fwidth(p.x), fwidth(p.y));
  float waW = fwidth(base4.a);
  float isProp = smoothstep(0.03, 0.12, distance(base4.rgb, flat_));
  vec3 base = base4.rgb;
  gPathM = pathMask(base4.rgb) * float((gb >> 5) & 1);
  ${on ? `{
    const vec3 GC = ${v3(GC)}; const vec3 PC = ${v3(PC)};
    const vec2 CG0 = vec2(1.02, 0.535); const vec2 CKD = vec2(0.212, 0.11); const float CKD2 = 0.05704;   // chroma (r/g, b/g) of the baked ground, and the step to the baked road
    // soft, wobbling read of the print: a fine hand-cut wobble + a slow one (gentle width variation of roads / beds)
    vec2 hd0 = 0.5 - abs(f - 0.5);
    float ew = smoothstep(0.0, 0.14, min(hd0.x, hd0.y));
    vec2 wv = ((vec2(wNoise(wq, 4.0), wNoise(wq + 31.7, 4.0)) - 0.5) * ${fl(g.wobble * 2)} + (vec2(wNoise(wq + 7.7, 1.0), wNoise(wq + 61.3, 1.0)) - 0.5) * ${fl(g.wobbleSlow * 2)}) * ew;
    float gfp = max(max(length(dx), length(dy)), 1e-6);
    vec3 gcol = textureGrad(uAtlas, vec3(uv + wv, layer), dx * max(1.0, ${gmin} / gfp), dy * max(1.0, ${gmin} / gfp)).rgb;
    vec2 dS = gcol.rb / max(gcol.g, 1e-3) - CG0;
    float tS = dot(dS, CKD) / CKD2;                              // 0 = ground, about 0.55 = printed margin, 1 = road
    float perpS = length(dS - CKD * clamp(tS, -0.15, 1.15));
    float lumOk = smoothstep(0.14, 0.22, gcol.g);
    float isG = (1.0 - smoothstep(0.12, 0.17, perpS)) * (1.0 - smoothstep(0.22, 0.4, tS)) * lumOk;   // open ground and its printed tone patches
    // ---- road: one continuous hand-cut ribbon ----
    float pbit = float((gb >> 5) & 1) * step(0.001, uGnd.w);
    // round 3 (resumed): tiles without a road print kraft "bare earth" patches in the road tone (yards, under benches,
    // round clearings): they read as pale stain blobs, so they join the ground field too (a faint lighter trace stays)
    float bare = (1.0 - smoothstep(0.07, 0.12, perpS)) * smoothstep(0.22, 0.4, tS) * lumOk * (1.0 - pbit) * step(0.001, uGnd.w);
    isG = max(isG, bare * 0.9);
    // desert / snow models are printed in their own ground tone (and carry the same per-tile value gradient): there the
    // reference chroma is the tile's own mean (top mip of its print). Shared models in those biomes keep the test above.
    int cBio = (gb >> 2) & 7;
    if (cBio == 1 || cBio == 2) {
      vec3 tm = textureGrad(uAtlas, vec3(0.5, 0.5, layer), vec2(1.0, 0.0), vec2(0.0, 1.0)).rgb;
      vec2 tc = tm.rb / max(tm.g, 1e-3);
      float own = smoothstep(0.06, 0.12, length(tc - CG0));
      float isO = (1.0 - smoothstep(0.035, 0.07, length(gcol.rb / max(gcol.g, 1e-3) - tc))) * lumOk * (cBio == 2 ? 0.75 : 1.0);
      isG = mix(isG, isO, own);
    }
    float pmS = 0.0; float fringe = 0.0; float worn = 0.0; float halo = 0.0; float onLine = 0.0;
    if (pbit > 0.5) {
      onLine = (1.0 - smoothstep(0.045, 0.085, perpS)) * lumOk * pbit;
      float kS = clamp(tS, 0.0, 1.0) * onLine;
      // a very soft read (1/16 tile): how deep inside the ribbon this point is
      float gw = max(1.0, 0.0625 / gfp);
      vec3 cW = textureGrad(uAtlas, vec3(uv + wv, layer), dx * gw, dy * gw).rgb;
      float kW = clamp(dot(cW.rb / max(cW.g, 1e-3) - CG0, CKD) / CKD2, 0.0, 1.0);
      float n1 = wNoise(wq + 3.3, 1.5); float n2 = wNoise(wq + 9.1, 6.0); float n3 = wNoise(wq + 2.2, 24.0);
      float ef = mix(kS, kW, 0.45) + (n1 - 0.5) * 0.2 + (n2 - 0.5) * 0.15;
      pmS = smoothstep(0.47, 0.69, ef + (n3 - 0.5) * 0.26) * onLine;   // grainy feathered cut
      halo = smoothstep(0.4, 0.62, ef) * (1.0 - pmS);
      fringe = smoothstep(0.24, 0.5, ef) * (1.0 - smoothstep(0.6, 0.82, ef));
      worn = smoothstep(0.6, 0.92, kW) * pmS;
      gPathM = pmS;
    }
    float open = 1.0 - pmS;
    // ---- one continuous field: tone patches, per-tile tone steps and the road print outside the cut go back to the ground colour ----
    // (the darkest cores of the baked value gradient sit under the props of a tile: a little of them stays as a contact patch)
    float contact = (1.0 - smoothstep(0.29, 0.42, gcol.g)) * isG;
    gcol = mix(gcol, GC, mix(isG * ${fl(g.flatten)}, 1.0, onLine) * open);
    gcol *= 1.0 - ${fl(g.contact)} * contact * open * vec3(0.9, 1.0, 1.15);
    // large-scale paper mottling (three sizes, 0.5 to 4 traveller heights), a little warmer / greener by patch
    float m1 = wNoise(wq, 1.0) - 0.5; float m2 = wNoise(wq + 17.3, 2.5) - 0.5; float m3 = wNoise(wq + 4.4, 0.5) - 0.5;
    float mot = (m3 * 0.5 + m1 * 0.5 + m2 * 0.3) * 2.0;
    gcol *= 1.0 + uGnd.x * mot * (0.45 + 0.55 * open);
    gcol *= vec3(1.0) + uGnd.x * 0.6 * (m2 + m3) * vec3(0.9, 0.05, -1.1) * open;
    if (pbit > 0.5) {
      // warm cream-beige, fine grit, soft tonal patches, a slightly darker worn centre line
      vec3 pcol = PC * (1.0 + 0.09 * (wHash(floor(mod(wq, 256.0) * 96.0)) - 0.5)) * (1.0 + 0.5 * uGnd.x * mot);
      pcol *= 1.0 - ${fl(g.pathWorn)} * worn * (0.5 + wNoise(wq + 12.0, 3.0)) * vec3(0.9, 1.0, 1.15);
      gcol = mix(gcol, mix(gcol, PC, 0.12), halo * uGnd.w);
      gcol = mix(gcol, pcol, pmS * uGnd.w);
      gcol *= 1.0 - 0.07 * fringe * open * uGnd.w * vec3(1.0, 0.8, 1.1);        // darker, greener fringe outside the cut
      // small pebbles biting into the margin
      vec2 pg = wq * 11.0; vec2 pid = mod(floor(pg), 2816.0); float phh = wHash(pid + 13.7);
      vec2 pc = (fract(pg) - 0.5) / 11.0 - (vec2(wHash(pid + 4.1), wHash(pid + 19.3)) - 0.5) * 0.045;
      float pr_ = 0.015 + 0.016 * fract(phh * 9.7);
      float pl = length(pc * vec2(1.0, 1.45));
      float peb = (1.0 - smoothstep(pr_ - wpx, pr_ + wpx, pl)) * step(phh, 0.5 * fringe + 0.02 * pmS) * uGnd.w;
      vec3 pebC = mix(vec3(0.5, 0.4, 0.29), vec3(0.93, 0.8, 0.62), smoothstep(pr_ * 0.5, -pr_ * 0.4, pc.y + pc.x * 0.4));
      gcol = mix(gcol, pebC * mix(1.0, 0.8, smoothstep(pr_ * 0.75, pr_, pl)), peb);
    }
    // printed grass ticks and flower dots, in drifts, on open ground and biting into the road margin
    float grassy = max(isG * open, fringe * 0.85) * (1.0 - smoothstep(0.02, 0.2, base4.a));
    if (grassy * uGnd.y > 0.01) {
      vec2 cg = wq * 5.0; vec2 cid = mod(floor(cg), 1280.0);
      float ch = wHash(cid + 3.1); float ch2 = wHash(cid + 57.7);
      float clus = smoothstep(0.52, 0.7, wNoise(wq + 5.1, 0.75));
      float fdr = smoothstep(0.56, 0.72, wNoise(wq + 88.8, 0.75));
      // fixer (round 3): ~70 % fewer ticks, free position / size / lean / ink per tick, so they stop reading as a grid
      float tks = 0.72 + 0.56 * fract(ch * 17.3);
      vec2 cc = ((fract(cg) - 0.5) * 0.2 - (vec2(ch2, fract(ch2 * 13.7)) - 0.5) * 0.11) / tks;
      cc.x += (fract(ch2 * 29.1) - 0.5) * 0.7 * (0.04 - cc.y);
      float hh = 0.04 - cc.y;                       // height above the tuft foot (north = up the page)
      float wd = 0.009 * (1.0 - hh / 0.095) + 0.0015;
      float inh = step(0.0, hh) * step(hh, 0.095);
      float bl = max(max(1.0 - smoothstep(wd, wd + wpx, abs(cc.x + 0.5 * hh)), 1.0 - smoothstep(wd, wd + wpx, abs(cc.x - 0.06 * hh))), 1.0 - smoothstep(wd, wd + wpx, abs(cc.x - 0.55 * hh))) * inh;
      float present = step(ch, 0.01 + 0.19 * clus + 0.24 * fringe) * grassy * uGnd.y;
      gcol = mix(gcol, gcol * vec3(0.5, 0.7, 0.4), bl * present * (0.45 + 0.55 * fract(ch * 41.3)));
      // one small five-petal flower in some cells of a flower drift (free position in the cell: no dot grid)
      vec2 fq = (fract(cg) - 0.5) * 0.2 - (vec2(fract(ch * 91.7), fract(ch2 * 47.3)) - 0.5) * 0.13;
      float fr0 = 0.014 + 0.006 * fract(ch * 53.0);
      float fl5 = length(fq) / (0.78 + 0.22 * cos(atan(fq.y, fq.x) * 5.0 + ch * 6.0));
      float dot_ = (1.0 - smoothstep(fr0, fr0 + wpx, fl5)) * step(fract(ch * 31.0), 0.012 + 0.36 * fdr) * isG * open * grassy * uGnd.y;
      float fkind = step(0.5, wNoise(wq + 55.5, 0.5) + 0.3 * (fract(ch * 77.0) - 0.5));   // one colour leads per drift
      vec3 fcol = mix(mix(vec3(0.95, 0.88, 0.7), vec3(0.9, 0.42, 0.16), fkind), mix(vec3(0.9, 0.5, 0.14), vec3(0.45, 0.2, 0.08), fkind), 1.0 - smoothstep(fr0 * 0.3, fr0 * 0.3 + wpx, length(fq)));
      gcol = mix(gcol, fcol, dot_ * 0.85);
    }
    base = gcol;
  }` : ""}
`;
}
/**
* WATER body. Runs after the biome tint block, before the twin mix.
* In: base, flat_, isProp, base4, waW, wq, wpx, l (model frame, -1..1), rot, uv, dx, dy, layer, w0..w3 / b0..b3.
* kinds = [{ index, kind, disc }] of the water models. hasPools = the paper material's lamp-pool uniforms exist.
*/
/** Night: warm streaks running toward the camera under every lit lamp pool (main(), after pageColor()). */
var WATER_GLOW_GLSL = `
if (gWatGlow > 0.0 && uPaperPoolCol.w > 0.0) {
  float nk = clamp(uPaperPoolCol.r * 1.2, 0.0, 1.0);   // lamp pools fade in with the night
  gWatNight = nk;
  diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(0.42, 0.52, 0.7), gWatGlow * nk);   // deep blue night water
  float wg = 0.0;
  for (int i = 0; i < 6; i++) {
    vec4 pp = uPaperPool[i];
    vec2 dl = vPaperW.xz - pp.xz;
    float sx = dl.x + 0.035 * sin(dl.y * 38.0 - uWat.x * 2.0);
    wg += pp.w * exp(-sx * sx / 0.007) * smoothstep(0.05, 0.3, dl.y) * (1.0 - smoothstep(0.6, 2.1, dl.y)) * (0.55 + 0.45 * sin(dl.y * 64.0 + uWat.x * 1.7));
  }
  totalEmissiveRadiance += gWatGlow * wg * uWat2.z * uPaperPoolCol.rgb;
}`;
/**
* shortfall pass: the REAL mirror image (main(), after pageColor() and WATER_GLOW_GLSL). The pass target holds LIT
* colour, so it replaces albedo and goes out as emissive (it must not be lit a second time).
*/
var WATER_MIRROR_GLSL = `
if (uRefl.x > 0.0 && gWatRefl.z > 0.003) {
  float rwi = 1.0 / max(vReflP.w, 1e-3);
  vec2 ruv = vReflP.xy * rwi + gWatRefl.xy * uRefl.y * rwi;
  vec4 rc = texture2D(uReflTex, ruv);
  if (gWatRefl.w > 0.5) {
    // ice: a faint, blurry image (9 taps)
    vec2 bs = vec2(uRefl2.w, uRefl2.w * 1.7);
    rc = rc * 0.2 + 0.1 * (texture2D(uReflTex, ruv + bs * vec2(1.0, 0.4)) + texture2D(uReflTex, ruv + bs * vec2(-1.0, -0.4)) + texture2D(uReflTex, ruv + bs * vec2(-0.4, 1.0)) + texture2D(uReflTex, ruv + bs * vec2(0.4, -1.0))
       + texture2D(uReflTex, ruv + bs * vec2(2.0, -0.6)) + texture2D(uReflTex, ruv + bs * vec2(-2.0, 0.6)) + texture2D(uReflTex, ruv + bs * vec2(0.6, 2.0)) + texture2D(uReflTex, ruv + bs * vec2(-0.6, -2.0)));
  }
  vec2 re = smoothstep(vec2(0.0), vec2(0.03), ruv) * (1.0 - smoothstep(vec2(0.97), vec2(1.0), ruv));
  float rcov = clamp(rc.a, 0.0, 1.0) * gWatRefl.z * re.x * re.y;
  float rk = rcov * mix(uRefl.x, uRefl2.x, gWatRefl.w);
  vec3 rcol = rc.rgb / max(rc.a, 0.05);
  float rmx = max(gWatCol.r, max(gWatCol.g, gWatCol.b));
  vec3 rtint = mix(vec3(1.0), gWatCol / max(rmx, 0.05), uRefl.z);
  // bright pixels (lit panes, lantern points) stay bright: they are light sources, not paper
  float rhot = smoothstep(0.9, 2.2, max(rcol.r, max(rcol.g, rcol.b)));
  rcol *= mix(rtint * uRefl.w * mix(vec3(1.0), vec3(0.55, 0.66, 0.82), gWatNight), vec3(uRefl2.z), rhot);   // night: paper sinks into the blue, lights do not
  rk = max(rk, rhot * rcov * mix(1.0, min(1.0, uRefl2.x * 1.5), gWatRefl.w));
  diffuseColor.rgb *= 1.0 - rk;
  totalEmissiveRadiance += rk * rcol;
  if (gWatNight > 0.05 && gWatRefl.w < 0.5) {
    // round 3 (page): at night lit panes and lamps in the mirror pull out into warm broken streaks toward the viewer
    // (4 taps up the mirror image, water pixels only, night only)
    float sk = 0.0;
    for (int i = 1; i <= 4; i++) {
      vec2 su = ruv + vec2(0.0025 * sin(gl_FragCoord.y * 0.21 + uWat.x * 2.0 + float(i)), 0.011 * float(i));
      vec4 s4 = texture2D(uReflTex, su);
      vec3 sc4 = s4.rgb / max(s4.a, 0.05);
      sk += smoothstep(0.95, 2.2, max(sc4.r, max(sc4.g, sc4.b))) * clamp(s4.a, 0.0, 1.0) * (1.0 - 0.2 * float(i));
    }
    float brk = 0.45 + 0.55 * smoothstep(-0.3, 0.6, sin(gl_FragCoord.y * 0.75 + uWat.x * 1.7 + 3.0 * sin(gl_FragCoord.x * 0.05)));
    totalEmissiveRadiance += gWatRefl.z * gWatNight * sk * brk * 0.42 * vec3(1.0, 0.72, 0.38);
  }
}`;
/** Uniforms + water-cell list shared by the page shader (book.js) and the mirror pass (post.js calls renderReflection). */
var _placeholder = new DataTexture(new Uint8Array([
	0,
	0,
	0,
	0
]), 1, 1);
_placeholder.needsUpdate = true;
var REFLECT = {
	uniforms: {
		uReflTex: { value: _placeholder },
		uReflMat: { value: new Matrix4() },
		uRefl: { value: new Vector4(0, 0, 0, 1) },
		uRefl2: { value: new Vector4(.3, 1, 1, .004) }
	},
	/** World x, z of the inked water cells on the page: written by book.js every update. */
	cells: /* @__PURE__ */ new Float32Array(512),
	count: 0,
	/** Debug / checks: was the pass drawn this frame, and its draw calls. */
	active: false,
	calls: 0,
	target: null
};
var _R = {
	cam: null,
	frustum: new Frustum(),
	pv: new Matrix4(),
	sphere: new Sphere(new Vector3(), 1.5),
	camPos: new Vector3(),
	rot: new Matrix4(),
	look: new Vector3(),
	up: new Vector3(),
	plane: new Plane(),
	clip: new Vector4(),
	q: new Vector4(),
	clear: new Color(),
	hidden: [],
	frames: 0,
	travList: [],
	travN: -1,
	bias: new Matrix4().set(.5, 0, 0, .5, 0, .5, 0, .5, 0, 0, .5, .5, 0, 0, 0, 1)
};
var QRANK = {
	low: 0,
	med: 1,
	high: 2
};
/**
* Planar mirror pass: the upright paper (tile batches, traveller, animals, leaves / birds) drawn once more with the
* camera mirrored about the page plane y = 0 into a small HDR target, ONLY while an inked water cell is inside the
* view frustum. No shadow-map re-render (the previous frame's maps are sampled), no MSAA, page / table / soft
* particles hidden. Call right before the main scene render. `quality` = 'low' | 'med' | 'high'.
*/
function renderReflection(renderer, scene, camera, width, height, quality = "high") {
	const w = waterConfig();
	const m = {
		...WATER_DEFAULTS.mirror,
		...w.mirror || {}
	};
	const U = REFLECT.uniforms;
	REFLECT.active = false;
	REFLECT.calls = 0;
	U.uRefl.value.x = 0;
	_R.frames++;
	if (w.enabled === false || m.enabled === false || REFLECT.count === 0 || _R.frames < 3) return;
	if ((QRANK[quality] ?? 2) < (QRANK[m.minQuality] ?? 1) || !camera.isPerspectiveCamera) return;
	camera.updateMatrixWorld();
	_R.camPos.setFromMatrixPosition(camera.matrixWorld);
	if (_R.camPos.y <= m.clip + .05) return;
	_R.pv.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
	_R.frustum.setFromProjectionMatrix(_R.pv);
	let seen = false;
	for (let i = 0; i < REFLECT.count && !seen; i++) {
		_R.sphere.center.set(REFLECT.cells[i * 2], 0, REFLECT.cells[i * 2 + 1]);
		seen = _R.frustum.intersectsSphere(_R.sphere);
	}
	if (!seen) return;
	const tw = Math.max(2, Math.min(m.maxWidth, Math.round(width * m.scale)));
	const th = Math.max(2, Math.round(tw * height / Math.max(1, width)));
	let rt = REFLECT.target;
	if (!rt) {
		const canFloat = renderer.extensions.has("EXT_color_buffer_float") || renderer.extensions.has("EXT_color_buffer_half_float");
		rt = REFLECT.target = new WebGLRenderTarget(tw, th, {
			type: canFloat ? HalfFloatType : UnsignedByteType,
			depthBuffer: true,
			samples: 0
		});
		rt.texture.minFilter = rt.texture.magFilter = LinearFilter;
		rt.texture.generateMipmaps = false;
		rt.texture.name = "water-mirror";
	} else if (rt.width !== tw || rt.height !== th) rt.setSize(tw, th);
	const vc = _R.cam || (_R.cam = new PerspectiveCamera());
	_R.rot.extractRotation(camera.matrixWorld);
	_R.look.set(0, 0, -1).applyMatrix4(_R.rot).add(_R.camPos);
	_R.look.y = -_R.look.y;
	vc.position.set(_R.camPos.x, -_R.camPos.y, _R.camPos.z);
	_R.up.set(0, 1, 0).applyMatrix4(_R.rot);
	_R.up.y = -_R.up.y;
	vc.up.copy(_R.up);
	vc.lookAt(_R.look);
	vc.near = camera.near;
	vc.far = camera.far;
	vc.updateMatrixWorld();
	vc.matrixWorldInverse.copy(vc.matrixWorld).invert();
	vc.projectionMatrix.copy(camera.projectionMatrix);
	vc.projectionMatrix.elements[8] *= -1;
	vc.projectionMatrix.elements[12] *= -1;
	U.uReflMat.value.copy(_R.bias).multiply(vc.projectionMatrix).multiply(vc.matrixWorldInverse);
	_R.plane.set(_R.up.set(0, 1, 0), -m.clip).applyMatrix4(vc.matrixWorldInverse);
	const cp = _R.clip.set(_R.plane.normal.x, _R.plane.normal.y, _R.plane.normal.z, _R.plane.constant);
	const pe = vc.projectionMatrix.elements;
	const q = _R.q;
	q.x = (Math.sign(cp.x) + pe[8]) / pe[0];
	q.y = (Math.sign(cp.y) + pe[9]) / pe[5];
	q.z = -1;
	q.w = (1 + pe[10]) / pe[14];
	cp.multiplyScalar(2 / cp.dot(q));
	pe[2] = cp.x;
	pe[6] = cp.y;
	pe[10] = cp.z + 1;
	pe[14] = cp.w;
	vc.projectionMatrixInverse.copy(vc.projectionMatrix).invert();
	const hidden = _R.hidden;
	hidden.length = 0;
	let travNear = false;
	let trav = null;
	for (const o of scene.children) if (o.name === m.traveller) trav = o;
	if (trav) {
		const reach = TILE_SIZE / 2 + m.travellerReach;
		for (let i = 0; i < REFLECT.count && !travNear; i++) travNear = Math.max(Math.abs(REFLECT.cells[i * 2] - trav.position.x), Math.abs(REFLECT.cells[i * 2 + 1] - trav.position.z)) < reach;
	}
	for (const o of scene.children) {
		if (o.isLight || !o.visible) continue;
		if (!m.include.includes(o.name) || o === trav && !travNear || travNear && m.travellerInstead.includes(o.name)) {
			if (o.isMesh || o.isGroup || o.isPoints || o.isLine || o.children.length) {
				o.visible = false;
				hidden.push(o);
			}
			continue;
		}
		for (const c of o.children) if (c.visible && m.exclude.includes(c.name)) {
			c.visible = false;
			hidden.push(c);
		}
	}
	if (trav && travNear) {
		const list = _R.travList;
		let n = 0;
		trav.traverse((c) => {
			if (c.isMesh) n++;
		});
		if (_R.travN !== n) {
			_R.travN = n;
			list.length = 0;
			trav.traverse((c) => {
				if (!c.isMesh || !c.geometry) return;
				if (!c.geometry.boundingSphere) c.geometry.computeBoundingSphere();
				list.push({
					mesh: c,
					r: c.geometry.boundingSphere.radius * c.getWorldScale(_R.look).length()
				});
			});
			list.sort((p, q) => q.r - p.r);
		}
		for (let i = m.travellerMeshes; i < list.length; i++) {
			const c = list[i].mesh;
			if (c.visible) {
				c.visible = false;
				hidden.push(c);
			}
		}
	}
	const prevRT = renderer.getRenderTarget();
	const prevBg = scene.background;
	const prevAuto = renderer.shadowMap.autoUpdate;
	const prevNeeds = renderer.shadowMap.needsUpdate;
	const prevAutoClear = renderer.autoClear;
	renderer.getClearColor(_R.clear);
	const prevAlpha = renderer.getClearAlpha();
	const calls0 = renderer.info.render.calls;
	scene.background = null;
	renderer.shadowMap.autoUpdate = false;
	renderer.shadowMap.needsUpdate = false;
	renderer.autoClear = true;
	renderer.setClearColor(0, 0);
	renderer.setRenderTarget(rt);
	try {
		renderer.render(scene, vc);
	} finally {
		renderer.setRenderTarget(prevRT);
		renderer.setClearColor(_R.clear, prevAlpha);
		renderer.autoClear = prevAutoClear;
		renderer.shadowMap.autoUpdate = prevAuto;
		renderer.shadowMap.needsUpdate = prevNeeds;
		scene.background = prevBg;
		for (const o of hidden) o.visible = true;
		hidden.length = 0;
	}
	REFLECT.active = true;
	REFLECT.calls = renderer.info.render.calls - calls0;
	U.uReflTex.value = rt.texture;
	U.uRefl.value.set(m.strength, m.distort * .5 * camera.projectionMatrix.elements[0], m.tint, m.gain);
	U.uRefl2.value.set(m.ice, m.band, m.night, 3 / tw);
}
function waterBodyGLSL(kinds) {
	const H = (TILE_SIZE / 2).toFixed(3);
	return `
  gWatGlow = 0.0; gWatRefl = vec4(0.0); gWatCol = vec3(0.0);
  {
    int mi = int(layer * 0.5 + 0.25);
    int wk = 0; vec3 wd = vec3(0.0, 0.0, 1.0);
    ${kinds.map((k) => `if (mi == ${k.index}) { wk = ${k.kind}; wd = vec3(${k.disc ? [
		k.disc[0] / (TILE_SIZE / 2),
		k.disc[1] / (TILE_SIZE / 2),
		k.disc[2] / (TILE_SIZE / 2)
	].map((v) => v.toFixed(4)).join(", ") : "0.0, 0.0, 1.0"}); }`).join(" else ")}
    if (wk > 0 && uWat2.w > 0.5) {
      float T = uWat.x;
      // round 3: the bank line wanders (noise-warped mask): uneven width, small inlets and spits
      float wa0 = base4.a;
      float wwin = smoothstep(0.03, 0.3, wa0) * (1.0 - smoothstep(0.75, 0.98, wa0)) * (wk == 6 ? 0.45 : 1.0);
      float wa = clamp(wa0 + wwin * ((wNoise(wq + 1.9, 2.0) - 0.5) * 0.22 + (wNoise(wq + 6.3, 7.0) - 0.5) * 0.09
        + 0.17 * smoothstep(0.68, 0.9, wNoise(wq + 40.0, 1.25)) - 0.12 * smoothstep(0.7, 0.9, wNoise(wq + 70.0, 1.25))), 0.0, 1.0);
      float aw = clamp(waW * 0.75, 0.008, 0.12);
      float wm = smoothstep(0.5 - aw, 0.5 + aw, wa);
      #define WPAL(o) (w0 * uWatPal[b0 * 4 + o] + w1 * uWatPal[b1 * 4 + o] + w2 * uWatPal[b2 * 4 + o] + w3 * uWatPal[b3 * 4 + o])
      vec3 cSh = WPAL(0); vec3 cDp = WPAL(1); vec3 cRim = WPAL(2); vec3 cFl = WPAL(3);
      float snowW = (b0 == 2 ? w0 : 0.0) + (b1 == 2 ? w1 : 0.0) + (b2 == 2 ? w2 : 0.0) + (b3 == 2 ? w3 : 0.0);
      float blosW = (b0 == 3 ? w0 : 0.0) + (b1 == 3 ? w1 : 0.0) + (b2 == 3 ? w2 : 0.0) + (b3 == 3 ? w3 : 0.0);
      bool pondK = wk == 1 || wk == 6;
      float ice = wk == 6 ? 1.0 : 0.0;
      // flow frame
      vec2 sc = wq; vec2 tl = vec2(0.0); float ctr; float sScale = 1.0;
      if (pondK) { ctr = 1.0 - smoothstep(0.1, 0.95, distance(l, wd.xy) / wd.z); }
      else {
        if (wk == 3) { vec2 r = l - vec2(1.0, -1.0); float rl = max(length(r), 1e-3); sc = vec2(atan(r.y, -r.x) * 1.2732395 - 1.0, rl - 1.0); tl = vec2(r.y, -r.x) / rl; sScale = 1.2732395; }
        else if (wk == 4) { sc = l; tl = vec2(1.0, 0.0); }
        else { sc = l.yx; tl = vec2(0.0, 1.0); }
        sc *= ${H};
        ctr = 1.0 - smoothstep(0.0, 0.3, abs(sc.y));
        for (int i = 0; i < 3; i++) { if (i < rot) tl = vec2(-tl.y, tl.x); }
      }
      float spd = dot(tl, vec2(0.8, 0.6)) * uWat2.x;
      // printed water: lighter at the bank, darker toward the middle, mottled like the rest of the paper
      // shortfall fixer: two STEPPED depth tones (printed bands, wobbling edge) over the soft gradient
      float dpt = clamp(smoothstep(0.55, 1.0, wa) * 0.45 + 0.7 * ctr * ctr, 0.0, 1.0);
      float dpn = dpt + 0.16 * (wNoise(wq, 3.0) - 0.5) + 0.12 * (wNoise(wq + 8.0, 1.0) - 0.5);
      float dst = 0.3 * smoothstep(0.13, 0.2, dpn) + 0.3 * smoothstep(0.38, 0.46, dpn) + 0.36 * smoothstep(0.66, 0.76, dpn);   // round 3: three soft steps
      // round 3: where the marks gather: along the bank and around whatever folds flat onto / stands in the water
      float bankB = smoothstep(0.52, 0.6, wa) * (1.0 - smoothstep(0.66, 0.88, wa));
      float gwd = max(1.0, 0.03125 / max(max(length(dx), length(dy)), 1e-6));
      float propN = smoothstep(0.02, 0.1, distance(textureGrad(uAtlas, vec3(uv, twinLayer), dx * gwd, dy * gwd).rgb, textureGrad(uAtlas, vec3(uv, layer), dx * gwd, dy * gwd).rgb));
      float clW = clamp(max(bankB * 0.75, propN), 0.0, 1.0);
      vec3 W = mix(cSh, cDp, mix(dpt, dst, 0.62 * (1.0 - ice)));
      W *= 0.94 + 0.12 * wNoise(wq, 2.5);
      // mirrored far bank: a darker, greyer band below whatever stands north of the water, its edge wobbling
      float rcol = wNoise(vec2(wq.x, 3.0), 11.0);   // column noise: the mirror reads as reed / trunk streaks of uneven length
      vec2 ro = vec2(0.03 * sin(wq.y * WKF(2200) + T * 1.3) * (1.0 - ice), -(0.11 + 0.2 * rcol)) / ${H};
      for (int i = 0; i < 3; i++) { if (i < rot) ro = vec2(ro.y, -ro.x); }
      float aN = textureGrad(uAtlas, vec3(uv + vec2(ro.x, -ro.y) * 0.5, layer), dx, dy).a;
      float refl = clamp((wa - aN) * 3.0, 0.0, 1.0) * (0.55 + 0.45 * smoothstep(0.25, 0.6, rcol)) * uWat.z * mix(1.0, 0.4, ice) * (uRefl.x > 0.0 ? uRefl2.y : 1.0);
      refl *= mix(0.7 + 0.3 * sin(wq.y * WKF(3400) + 1.5 * sin(wq.x * WKF(500) + T * 0.9)), 1.0, ice);
      W = mix(W, W * vec3(0.36, 0.5, 0.44) + vec3(0.03, 0.034, 0.004), refl);
      // mirrored props: whatever folds flat onto the water (reeds, bridge deck, rocks) stays on it as a dark broken mirror
      float prf = isProp * uWat.z * (0.72 + 0.28 * sin(wq.y * WKF(3000) + 1.5 * sin(wq.x * WKF(700) - T * 1.1))) * mix(1.0, 0.45, ice);
      W = mix(W, mix(W, flat_, 0.3) * vec3(0.62, 0.76, 0.72), prf * 0.5);   // shortfall fixer: was a dark smudge (0.5 / 0.8)
      float lilyF = 0.0; float lilyC = 0.0; float foam = 0.0;
      float rip = 0.0; float flo = 0.0; float floInk = 0.0; float floSh = 0.0; vec3 floCol = cFl;
      if (ice < 0.5) {
        // slow light net
        float ca = sin(wq.x * WKF(1250) + 1.4 * sin(wq.y * WKF(900) + T * 0.55)) * sin(wq.y * WKF(1500) + 1.2 * sin(wq.x * WKF(1050) - T * 0.4));
        W *= 1.0 + uWat2.y * (smoothstep(0.3, 0.95, ca) - 0.5 * smoothstep(0.3, 0.95, -ca));
        if (pondK) {
          // drifting, slowly twinkling cream dashes (screen-horizontal) + now and then a spreading ring
          vec2 q = vec2(wq.x - 0.03 * T, wq.y) / vec2(0.5, 0.125);
          vec2 id = mod(floor(q), vec2(512.0, 2048.0));
          float h = wHash(id + 1.7);
          vec2 c = (fract(q) - 0.5) * vec2(0.5, 0.125); c.x += (wHash(id + 9.2) - 0.5) * 0.1;
          rip = step(h, 0.06 + 0.5 * clW) * wLens(c + vec2(0.0, 0.012 * (1.0 - c.x * c.x / 0.0256)), 0.12 + 0.07 * fract(h * 7.3), 0.011, wpx) * (0.4 + 0.6 * (0.5 + 0.5 * sin(T * 0.8 + h * 40.0)));
          vec2 rg = wq / 0.64; vec2 rid = mod(floor(rg), 400.0); float rh = wHash(rid + 11.3);
          vec2 rc = (fract(rg) - 0.5) * 0.64 - (vec2(wHash(rid + 5.1), wHash(rid + 23.9)) - 0.5) * 0.3;
          float rt = fract(T * 0.17 + rh * 9.0);
          float rd = length(rc * vec2(1.0, 1.45));
          float ring = max(max(1.0 - smoothstep(0.004, 0.004 + wpx, abs(rd - (0.02 + 0.15 * rt))), (1.0 - smoothstep(0.004, 0.004 + wpx, abs(rd - (0.012 + 0.1 * rt)))) * 0.75), (1.0 - smoothstep(0.0035, 0.0035 + wpx, abs(rd - (0.006 + 0.05 * rt)))) * 0.55);
          rip = max(rip, step(rh, 0.16 + 0.5 * smoothstep(0.0, 0.6, clW)) * ring * (1.0 - rt) * smoothstep(0.0, 0.12, rt) * 0.85);
          // lily pads (none on snow): they turn and bob a little, each with its own shadow on the water
          vec2 pg = wq / 0.32; vec2 pid = mod(floor(pg), 800.0); float ph = wHash(pid + 41.3);
          vec2 pc = (fract(pg) - 0.5) * 0.32 - (vec2(wHash(pid + 2.9), wHash(pid + 77.1)) - 0.5) * 0.13 - 0.006 * vec2(sin(T * 0.5 + ph * 30.0), cos(T * 0.41 + ph * 17.0));
          vec2 pl = -pc / ${H};
          for (int i = 0; i < 3; i++) { if (i < rot) pl = vec2(pl.y, -pl.x); }
          float pdc = distance(l + pl, wd.xy) / wd.z;   // pad centre, 0 = middle of the pond, 1 = bank
          float pin = step(ph, 0.22 + 0.3 * smoothstep(0.3, 0.6, pdc) + 0.6 * smoothstep(0.36, 0.6, wNoise(wq + 33.0, 1.5))) * step(pdc, 0.74) * (1.0 - snowW) * uWat.w;
          float pr_ = 0.056 + 0.024 * fract(ph * 5.7);
          vec2 pd2 = wPad(pc, pr_, ph * 6.2832 + 0.25 * sin(T * 0.3 + ph * 9.0), wpx);
          flo = pd2.x * pin; floInk = pd2.y;
          floSh = (1.0 - smoothstep(pr_ - wpx, pr_ + wpx * 3.0, length(pc - vec2(0.014, 0.02)))) * pin;
          floCol = mix(vec3(0.5, 0.56, 0.17), vec3(0.42, 0.52, 0.16), fract(ph * 3.3));
          vec2 lfc = pc - vec2(0.014, -0.01); float lfa = atan(lfc.y, lfc.x); float lfr = length(lfc);
          lilyF = (1.0 - smoothstep(0.03 - wpx, 0.03 + wpx, lfr / (0.7 + 0.3 * cos(lfa * 5.0 + ph * 6.0)))) * pin * step(fract(ph * 11.3), 0.45);
          lilyC = 1.0 - smoothstep(0.009, 0.009 + wpx, lfr);
        } else {
          // rows of dashes carried by the flow: two phases cross-fade so the pattern never shears
          float present = smoothstep(0.64, 0.76, wNoise(wq + vec2(0.03, 0.0) * T, 2.0) + 0.24 * clW);   // round 3: glints gather at banks, stones, reeds   // shortfall fixer: a few long glints, not a brick pattern
          float sgn = spd < 0.0 ? -1.0 : 1.0; float fade = smoothstep(0.01, 0.04, abs(spd));
          float streak = 0.0;
          for (int i = 0; i < 2; i++) {
            float fph = fract(T / 7.0 + 0.5 * float(i)); float tau = (fph - 0.5) * 7.0; float wgt = 1.0 - abs(2.0 * fph - 1.0);
            rip += wgt * wRiverDash(vec2(sc.x - spd * sScale * tau, sc.y), i, wpx, sgn);
            // round 3 (resumed): faint long current lines sliding with the flow (periodic per tile along the stream)
            float sx2 = sc.x - spd * sScale * tau;
            float rowS = floor(sc.y * 8.0 + 0.5 + 0.5 * float(i));
            float lnS = abs(fract(sc.y * 8.0 + 0.5 * float(i) + 0.12 * sin(sx2 * 3.14159 + rowS)) - 0.5) / 8.0;
            streak += wgt * (1.0 - smoothstep(0.0025, 0.0025 + wpx, lnS)) * smoothstep(0.35, 0.95, sin(sx2 * 6.28318 + rowS * 2.3));
            // floaters ride the same flow in the canonical (downstream) frame: leaves, petals, ice plates
            float fx = (sgn * sc.x - abs(spd) * sScale * tau) * 2.0 + 0.5 * float(i);
            float cls = mod(floor(fx), 4.0);
            vec2 fc = vec2((fract(fx) - 0.5) * 0.5, sgn * sc.y - (mod(cls, 2.0) - 0.5) * 0.22 - (cls - 1.5) * 0.03);
            float fr_ = cls * 1.9 + 0.5 * sin(T * 0.5 + cls * 2.0) + float(i);
            vec2 fq = vec2(fc.x * cos(fr_) - fc.y * sin(fr_), fc.x * sin(fr_) + fc.y * cos(fr_));
            float keep = wgt * fade * step(0.5, wNoise(wq, 1.5) + 0.25 * blosW + 0.12 * snowW - 0.18 * mod(cls + float(i), 2.0)) * uWat.w;
            float shp = mix(wLens(fq, mix(0.05, 0.032, blosW), mix(0.021, 0.016, blosW), wpx), 1.0 - smoothstep(0.062 - wpx, 0.062 + wpx, length(fq) + 0.014 * sin(atan(fq.y, fq.x) * 3.0 + cls)), snowW);
            flo = max(flo, shp * keep);
            floSh = max(floSh, mix(wLens(fq - vec2(0.012, 0.016), 0.055, 0.024, wpx * 2.0), 1.0 - smoothstep(0.066, 0.075, length(fq - vec2(0.012, 0.016))), snowW) * keep);
            floInk = max(floInk, (1.0 - smoothstep(0.0, 0.004 + wpx, abs(fq.y))) * 0.5 * (1.0 - snowW));
          }
          rip *= present;
          W = mix(W, W * 1.1 + vec3(0.02, 0.03, 0.03), streak * fade * 0.5 * smoothstep(0.62, 0.85, wa) * smoothstep(0.35, 0.65, wNoise(wq + 50.0, 1.5)));
          // round 3: foam flecks on the outer bank of a bend and at the bridge piers, twinkling
          float fz = 0.0;
          if (wk == 3) fz = bankB * smoothstep(0.02, 0.14, sc.y);
          else if (wk == 4) fz = (1.0 - smoothstep(0.03, 0.17, abs(abs(sc.x) - 0.38))) * smoothstep(0.58, 0.72, wa);
          if (fz > 0.01) {
            float fn = wNoise(wq + vec2(0.012 * sin(T * 0.7 + wq.y * 9.0), 0.012 * cos(T * 0.6 + wq.x * 9.0)), 24.0);
            foam = smoothstep(0.6, 0.7, fn * (0.55 + 0.6 * wNoise(wq + 2.0, 6.0))) * fz * (0.6 + 0.4 * sin(T * 1.6 + wNoise(wq, 3.0) * 25.0));
          }
        }
      } else {
        // ice: static pale sheen bands and white looping skate lines
        float sh = smoothstep(0.55, 0.95, sin((wq.x * 0.8 + wq.y) * WKF(260) + 2.0 * wNoise(wq, 2.0)));
        W = mix(W, cRim, sh * 0.3);
        vec2 kg = wq / 0.5; vec2 kid = mod(floor(kg), 512.0); float kh = wHash(kid + 3.3);
        vec2 kc = (fract(kg) - 0.5) * 0.5 - (vec2(kh, wHash(kid + 8.8)) - 0.5) * 0.2;
        float kr = 0.11 + 0.1 * fract(kh * 9.1);
        rip = (1.0 - smoothstep(0.0035, 0.0035 + wpx, abs(length(kc * vec2(1.0, 1.25 + 0.5 * kh)) - kr))) * step(0.25, kh) * 0.75;
      }
      float inner = smoothstep(0.62, 0.9, wa);
      // real mirror (main(), WATER_MIRROR_GLSL): under the ripples / floaters / rim, not on flat-folded props; the
      // image shifts sideways row by row (two wave trains) and breaks into bands
      gWatCol = W;
      float rw1 = sin(wq.y * WKF(1700) + T * 1.5 + 1.8 * sin(wq.x * WKF(260) + T * 0.45));
      float rw2 = sin(wq.y * WKF(4100) - T * 2.2 + 1.2 * sin(wq.x * WKF(610) - T * 0.7));
      gWatRefl.xy = vec2(rw1 + 0.45 * rw2, 0.35 * rw2) * (1.0 - ice);
      gWatRefl.z = wm * smoothstep(0.5, 0.66, wa) * (1.0 - clamp(rip * inner * (ice > 0.5 ? 0.8 : uWat.y), 0.0, 1.0)) * (1.0 - flo * inner)
        * (1.0 - 0.75 * prf) * mix(0.82 + 0.18 * smoothstep(-0.75, -0.35, rw2), 1.0, ice) * mix(1.0, 0.8, ctr * ctr);
      gWatRefl.w = ice;
      W = mix(W, W * 0.72, floSh * inner * 0.55);
      rip = max(rip, foam);
      W = mix(W, mix(cRim, vec3(1.0), 0.6), rip * inner * (ice > 0.5 ? 0.8 : uWat.y));
      W = mix(W, mix(floCol, mix(floCol * 0.62, mix(cRim, vec3(1.0), 0.3), pondK ? step(0.5, floInk) : 0.0), floInk * (pondK ? 1.0 : 0.6)), flo * inner);
      W = mix(W, mix(vec3(0.99, 0.87, 0.85), vec3(0.95, 0.62, 0.14), lilyC), lilyF * inner);
      // darker waterline just inside the shore, then the pale hand-cut rim outside it
      W *= 1.0 - 0.42 * wm * (1.0 - smoothstep(0.52, 0.62, wa));
      // shortfall fixer: the shore is a thin crisp cream line at the water and, outside it, a sandy band of uneven
      // width that fades into the ground (was one hard band of constant width with a contact shadow)
      float shN = wNoise(wq, 1.5); float shF = 0.06 * (wNoise(wq, 5.0) - 0.5);
      float shLo = 0.03 + 0.2 * shN;
      float rimSoft = smoothstep(shLo, shLo + 0.26, wa + shF);
      // round 3 (resumed): the cream cut line swells, thins and now and then breaks where grass reaches the water
      float rwN = wNoise(wq + 23.0, 1.8);
      float rLo = 0.25 + 0.17 * wNoise(wq + 11.0, 1.1);
      float rimLine = smoothstep(rLo, rLo + 0.07, wa + shF * 0.5) * (1.0 - 0.75 * smoothstep(0.68, 0.8, rwN));
      float rimM = max(rimLine * 0.94, rimSoft * 0.58) * (1.0 - wm);
      vec3 sandC = mix(base * vec3(1.16, 1.08, 0.9) + vec3(0.03, 0.02, 0.0), cRim, 0.55);
      base = mix(base, mix(sandC, cRim, rimLine) * (0.95 + 0.1 * wNoise(wq, 10.0)), rimM);
      base = mix(base, W, wm);
      gWatGlow = wm;   // water coverage: night tint + lamp streaks are added in main() (WATER_GLOW_GLSL)
    }
    flat_ = mix(base, flat_, isProp);
  }
`;
}
// src/world/book.js
var GRID$1 = 32;
var SHIFT = 5;
var MASK = 31;
var NONE = 2147483647;
var NB$1 = BIOMES.length;
/** GLSL: affine colour transform (r0..r2 = matrix rows, offset in .w); k = how much of teal / blue water is kept. */
var BIOME_TINT_GLSL = `
vec3 biomeTint(vec3 c, vec4 r0, vec4 r1, vec4 r2, float k) {
  vec3 t = max(vec3(dot(r0.xyz, c) + r0.w, dot(r1.xyz, c) + r1.w, dot(r2.xyz, c) + r2.w), 0.0);
  // look pass: very dark printed / cut pieces (wood posts, trunks, ink lines) keep their own colour, so a pale
  // biome tint cannot wash them into ghosts (snow lantern post). Only active for non-identity transforms (k > 0).
  float dk = (1.0 - smoothstep(0.05, 0.2, dot(c, vec3(0.2126, 0.7152, 0.0722)))) * step(0.001, k);
  return mix(t, c, max(smoothstep(0.03, 0.14, min(c.g, c.b) - c.r) * k, dk * 0.85));
}
// the printed ground: no dark-keep (the inked grass ticks of the shared tiles must sink into snow / sand)
vec3 biomeTintGround(vec3 c, vec4 r0, vec4 r1, vec4 r2, float k) {
  vec3 t = max(vec3(dot(r0.xyz, c) + r0.w, dot(r1.xyz, c) + r1.w, dot(r2.xyz, c) + r2.w), 0.0);
  return mix(t, c, smoothstep(0.03, 0.14, min(c.g, c.b) - c.r) * k);
}
`;
var _tintCache = {};
/**
* Uniform values of one transform kind ('ground' | 'prop') for every biome, in BIOMES order:
* { rows: Vector4[NB * 3], keep: number[NB], count: NB }. Built once from CONFIG.world.biomeTint (see there for the
* meaning of hue / sat / tint / amount / gain / lift / mul / keepWater). heartland / missing = exact identity.
*/
function biomeTintUniforms(kind) {
	if (_tintCache[kind]) return _tintCache[kind];
	const table = CONFIG.world.biomeTintEnabled !== false && CONFIG.world.biomeTint || {};
	const rows = [];
	const keep = [];
	const L = [
		.2126,
		.7152,
		.0722
	];
	const col = new Color();
	for (let b = 0; b < NB$1; b++) {
		const t = BIOMES[b] !== "heartland" && table[BIOMES[b]] && table[BIOMES[b]][kind] || {};
		const amount = +t.amount || 0;
		const sat = t.sat === void 0 ? 1 : +t.sat;
		const mul = t.mul === void 0 ? 1 : +t.mul;
		const gain = t.gain === void 0 ? 1 : +t.gain;
		const lift = +t.lift || 0;
		const hue = (+t.hue || 0) * Math.PI / 180;
		col.set(t.tint || "#ffffff");
		const tint = [
			col.r,
			col.g,
			col.b
		];
		const c = Math.cos(hue);
		const sn = Math.sin(hue);
		const H = [
			[
				.213 + c * .787 - sn * .213,
				.715 - c * .715 - sn * .715,
				.072 - c * .072 + sn * .928
			],
			[
				.213 - c * .213 + sn * .143,
				.715 + c * .285 + sn * .14,
				.072 - c * .072 - sn * .283
			],
			[
				.213 - c * .213 - sn * .787,
				.715 - c * .715 + sn * .715,
				.072 + c * .928 + sn * .072
			]
		];
		const identity = !amount && sat === 1 && mul === 1 && !hue;
		for (let i = 0; i < 3; i++) {
			const row = new Vector4(i === 0 ? 1 : 0, i === 1 ? 1 : 0, i === 2 ? 1 : 0, 0);
			if (!identity) {
				for (let j = 0; j < 3; j++) {
					let sh = 0;
					for (let k = 0; k < 3; k++) sh += ((i === k ? sat : 0) + (1 - sat) * L[k]) * H[k][j];
					row.setComponent(j, mul * ((1 - amount) * sh + amount * tint[i] * gain * L[j]));
				}
				row.w = mul * amount * tint[i] * lift;
			}
			rows.push(row);
		}
		keep.push(identity ? 0 : Math.min(1, Math.max(0, +t.keepWater || 0)));
	}
	return _tintCache[kind] = {
		rows,
		keep,
		count: NB$1
	};
}
/** Per-biome path print override (CONFIG.world.biomeTint[b].path = { color, edge, amount, edgeAmount }): Vector4[NB] x 2. */
function biomePathUniforms() {
	if (_tintCache.__path) return _tintCache.__path;
	const table = CONFIG.world.biomeTintEnabled !== false && CONFIG.world.biomeTint || {};
	const tone = [];
	const edge = [];
	const col = new Color();
	for (let b = 0; b < NB$1; b++) {
		const t = BIOMES[b] !== "heartland" && table[BIOMES[b]] && table[BIOMES[b]].path || null;
		if (!t) {
			tone.push(new Vector4(1, 1, 1, 0));
			edge.push(new Vector4(0, 0, 0, 0));
			continue;
		}
		col.set(t.color || "#ffffff");
		tone.push(new Vector4(col.r, col.g, col.b, t.amount === void 0 ? 1 : +t.amount));
		col.set(t.edge || t.color || "#000000");
		edge.push(new Vector4(col.r, col.g, col.b, +t.edgeAmount || 0));
	}
	return _tintCache.__path = {
		tone,
		edge
	};
}
/** Biome index stored in the cell-data texture / the batch instance colour. */
var biomeIndexOf = (cell) => cell && BIOME_INDEX[cell.biome] || 0;
/** GLSL shared by page + page block: height of the gutter valley at local (x,z); y = local height (0 = page top). */
var GUTTER_GLSL = `
uniform vec4 uGut;  // x: gutter x (book-local), y: half width, z: depth on the print area, w: depth at head/tail
uniform vec4 uGut2; // x: fade (0 near a fore-edge), y: shade, z: page curve, w: page curve width
uniform vec4 uBk;   // x: half width, y: half depth, z: margin, w: faded ink
float gutterEdge(float z) { return smoothstep(uBk.y - uBk.z * 1.6, uBk.y - uBk.z * 0.2, abs(z)); }
float gutterDx(float x) { const float GP = ${(CONFIG.book.gutterPeriod * TILE_SIZE).toFixed(1)}; return mod(x - uGut.x + GP * 0.5, GP) - GP * 0.5; }
float gutterH(vec2 p, float y) {
  float e = gutterEdge(p.y);
  float hw = uGut.y * (1.0 + 0.7 * e);
  float a = clamp(1.0 - abs(gutterDx(p.x)) / hw, 0.0, 1.0);
  float k = clamp(1.0 + y / ${CONFIG.book.blockThickness.toFixed(4)}, 0.0, 1.0);
  return -mix(uGut.z, uGut.w, e) * a * a * uGut2.x * k;
}
`;
/** Small deterministic PRNG for procedural fallback textures / geometry jitter (no Math.random in the app). */
function lcg(seed) {
	let s = seed >>> 0;
	return () => (s = Math.imul(s, 1664525) + 1013904223 >>> 0) / 4294967296;
}
function makeCanvas(w, h) {
	const c = document.createElement("canvas");
	c.width = w;
	c.height = h;
	return c;
}
/** Procedural page fibre (tileable): grey tooth + clouding + short fibres. Used when no texture set is loaded. */
function fibreFallback() {
	const N = 512;
	const c = makeCanvas(N, N);
	const g = c.getContext("2d");
	const rnd = lcg(1234);
	const img = g.createImageData(N, N);
	const cells = [8, 37];
	const grids = cells.map((n) => {
		const a = new Float32Array(n * n);
		for (let i = 0; i < a.length; i++) a[i] = rnd();
		return a;
	});
	const sample = (gi, u, v) => {
		const n = cells[gi];
		const a = grids[gi];
		const x = u * n;
		const y = v * n;
		const x0 = Math.floor(x);
		const y0 = Math.floor(y);
		const fx = x - x0;
		const fy = y - y0;
		const sx = fx * fx * (3 - 2 * fx);
		const sy = fy * fy * (3 - 2 * fy);
		const i = (xx, yy) => a[(yy % n + n) % n * n + (xx % n + n) % n];
		return (i(x0, y0) * (1 - sx) + i(x0 + 1, y0) * sx) * (1 - sy) + (i(x0, y0 + 1) * (1 - sx) + i(x0 + 1, y0 + 1) * sx) * sy;
	};
	for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
		const u = x / N;
		const v = y / N;
		const val = .8 + (sample(0, u, v) - .5) * .07 + (sample(1, u, v) - .5) * .06 + (rnd() - .5) * .085;
		const b = Math.max(0, Math.min(255, Math.round(val * 255)));
		const o = (y * N + x) * 4;
		img.data[o] = img.data[o + 1] = img.data[o + 2] = b;
		img.data[o + 3] = 255;
	}
	g.putImageData(img, 0, 0);
	for (let i = 0; i < 1500; i++) {
		const x = rnd() * N;
		const y = rnd() * N;
		const a = rnd() * Math.PI * 2;
		const len = 5 + rnd() * 20;
		const bend = (rnd() - .5) * 9;
		g.strokeStyle = rnd() < .62 ? `rgba(255,252,240,${.07 + rnd() * .16})` : `rgba(96,70,44,${.05 + rnd() * .12})`;
		g.lineWidth = .6 + rnd() * .8;
		for (let ox = -512; ox <= N; ox += N) for (let oy = -512; oy <= N; oy += N) {
			if (x + ox < -30 || x + ox > 542 || y + oy < -30 || y + oy > 542) continue;
			g.beginPath();
			g.moveTo(x + ox, y + oy);
			g.quadraticCurveTo(x + ox + Math.cos(a) * len * .5 - Math.sin(a) * bend, y + oy + Math.sin(a) * len * .5 + Math.cos(a) * bend, x + ox + Math.cos(a) * len, y + oy + Math.sin(a) * len);
			g.stroke();
		}
	}
	return c;
}
/** Procedural stacked-sheet lines for the page-block edges (tileable along u). */
function sheetLinesFallback() {
	const W = 1024;
	const H = 256;
	const c = makeCanvas(W, H);
	const g = c.getContext("2d");
	const rnd = lcg(77);
	g.fillStyle = "#e9dcc0";
	g.fillRect(0, 0, W, H);
	let y = 0;
	while (y < H) {
		const h = 3 + rnd() * 7;
		const tone = 205 + Math.floor(rnd() * 40);
		const k1 = 1 + Math.floor(rnd() * 3);
		const k2 = 3 + Math.floor(rnd() * 5);
		const p1 = rnd() * 6.28;
		const p2 = rnd() * 6.28;
		const amp = .4 + rnd() * 1.6;
		const gap = rnd() < .3 ? 1.6 + rnd() * 1.4 : .8 + rnd() * .6;
		const dark = .25 + rnd() * .45;
		for (let x = 0; x < W; x += 4) {
			const wob = Math.sin(x / W * 6.2832 * k1 + p1) * amp + Math.sin(x / W * 6.2832 * k2 + p2) * amp * .4;
			g.fillStyle = `rgb(${tone + 8},${tone},${tone - 26})`;
			g.fillRect(x, y + wob, 4, h + 1);
			g.fillStyle = `rgba(92,62,40,${dark})`;
			g.fillRect(x, y + wob + h - gap, 4, gap);
			g.fillStyle = "rgba(255,250,236,0.35)";
			g.fillRect(x, y + wob, 4, .8);
		}
		y += h;
	}
	const img = g.getImageData(0, 0, W, H);
	for (let i = 0; i < img.data.length; i += 4) {
		const n = (rnd() - .5) * 16;
		img.data[i] += n;
		img.data[i + 1] += n;
		img.data[i + 2] += n;
	}
	g.putImageData(img, 0, 0);
	return c;
}
/** Procedural dark warm table (tileable): umber with soft long grain. */
function tableFallback() {
	const N = 512;
	const c = makeCanvas(N, N);
	const g = c.getContext("2d");
	const rnd = lcg(4242);
	g.fillStyle = "#6a4630";
	g.fillRect(0, 0, N, N);
	for (let i = 0; i < 900; i++) {
		const y = rnd() * N;
		const x = rnd() * N;
		const len = 60 + rnd() * 300;
		g.strokeStyle = rnd() < .5 ? `rgba(30,16,8,${.05 + rnd() * .12})` : `rgba(150,100,62,${.03 + rnd() * .07})`;
		g.lineWidth = .6 + rnd() * 2.2;
		for (let ox = -512; ox <= N; ox += N) {
			g.beginPath();
			g.moveTo(x + ox, y);
			g.bezierCurveTo(x + ox + len * .3, y + (rnd() - .5) * 5, x + ox + len * .7, y + (rnd() - .5) * 5, x + ox + len, y + (rnd() - .5) * 3);
			g.stroke();
		}
	}
	return c;
}
function canvasTexture(canvas, srgb, aniso = 8) {
	const t = new CanvasTexture(canvas);
	t.wrapS = t.wrapT = RepeatWrapping;
	t.colorSpace = srgb ? SRGBColorSpace : "";
	t.anisotropy = aniso;
	return t;
}
/** Mean luma (0..1, as stored) of a texture image; 0.8 if it cannot be read. */
function imageMean(tex) {
	try {
		const img = tex.image;
		if (!img || !(img.width > 0)) return .8;
		const g = makeCanvas(32, 32).getContext("2d", { willReadFrequently: true });
		g.drawImage(img, 0, 0, 32, 32);
		const d = g.getImageData(0, 0, 32, 32).data;
		let s = 0;
		for (let i = 0; i < d.length; i += 4) s += d[i] * .3 + d[i + 1] * .59 + d[i + 2] * .11;
		return Math.max(.05, s / (d.length / 4) / 255);
	} catch {
		return .8;
	}
}
function createBook({ scene, assets, wfc, materials, quality }) {
	const B = CONFIG.book;
	const palette = CONFIG.palette || {};
	const HW = B.pageHalfExtent;
	const HD = B.halfDepth;
	const T = B.blockThickness;
	const PERIOD = B.gutterPeriod * TILE_SIZE;
	const cream = new Color(palette.paper || "#efe0c2");
	const group = new Group();
	group.name = "book";
	scene.add(group);
	const modelIds = (assets && assets.modelIds && assets.modelIds.length ? assets.modelIds : MODEL_IDS).slice(0, 120);
	if (!modelIds.includes("meadow")) modelIds.push(FALLBACK_MODEL);
	const DRY_RX = /^(tree|flowers|haystack|scarecrow|hedge|beehive|bush)/;
	const hasDry = (id) => {
		const m = MODELS[id];
		const b = m && m.biomes;
		return !!m && (!b || b.desert > 0 || b.snow > 0) && !(b && Object.keys(b).length === 1 && !b.heartland);
	};
	const FENCE_RX = /^(tree|flowers|haystack|scarecrow|hedge|beehive|bush|fence)/;
	const hasFence = (id) => {
		const m = MODELS[id];
		const b = m && m.biomes;
		if (!hasDry(id) || b && !(b.desert > 0) || CONFIG.world.biomeCull === false) return false;
		try {
			const t = assets.getTilePrototype(id);
			let f = false;
			t.traverse((o) => {
				if (/^fence/.test(String(o.name || "").replace(/^.*__/, ""))) f = true;
			});
			return f;
		} catch (err) {
			return false;
		}
	};
	const fenceSet = new Set(modelIds.filter(hasFence));
	modelIds.sort((p, q) => (fenceSet.has(q) ? 2 : hasDry(q) ? 1 : 0) - (fenceSet.has(p) ? 2 : hasDry(p) ? 1 : 0));
	const FEN_N = fenceSet.size;
	const VAR_N = CONFIG.world.biomeCull === false ? 0 : modelIds.filter(hasDry).length;
	const hayHidden = (cx, cz) => (Math.imul(cx * 73856093 ^ cz * 19349663 ^ 1540483477, 2654435761) >>> 9) % 100 < (CONFIG.world.hayDrop ?? 60);
	const modelIndex = /* @__PURE__ */ new Map();
	modelIds.forEach((id, i) => modelIndex.set(id, i));
	const fallbackIndex = modelIndex.get("meadow") || 0;
	const kx = (/* @__PURE__ */ new Int32Array(1024)).fill(NONE);
	const kz = (/* @__PURE__ */ new Int32Array(1024)).fill(NONE);
	const ink = /* @__PURE__ */ new Float32Array(1024);
	const twin = /* @__PURE__ */ new Float32Array(1024);
	const mark = /* @__PURE__ */ new Uint8Array(1024);
	const hold = /* @__PURE__ */ new Uint8Array(1024);
	const data = /* @__PURE__ */ new Uint8Array(4096);
	const cellTex = new DataTexture(data, GRID$1, GRID$1, RGBAFormat, UnsignedByteType);
	cellTex.minFilter = cellTex.magFilter = NearestFilter;
	cellTex.wrapS = cellTex.wrapT = RepeatWrapping;
	cellTex.generateMipmaps = false;
	cellTex.needsUpdate = true;
	function slot(cx, cz) {
		const i = (cz & MASK) << SHIFT | cx & MASK;
		if (kx[i] !== cx || kz[i] !== cz) {
			kx[i] = cx;
			kz[i] = cz;
			const cell = wfc.get(cx, cz);
			const mi = modelIndex.get(cell.model);
			data[i * 4] = mi === void 0 ? fallbackIndex : mi;
			data[i * 4 + 1] = (cell.rot % 4 + 4) % 4 | biomeIndexOf(cell) << 2 | (cell.tags && cell.tags.includes("path") ? 32 : 0) | (mi !== void 0 && mi < FEN_N && cell.biome === "desert" ? 192 : mi !== void 0 && mi < VAR_N && (cell.biome === "desert" || cell.biome === "snow") ? 64 : VAR_N && (cell.model === "meadow" || cell.model === "meadow_flowers") && hayHidden(cx, cz) ? 128 : 0);
			ink[i] = 0;
			twin[i] = 1;
			mark[i] = 0;
			hold[i] = 0;
			data[i * 4 + 2] = 255;
			data[i * 4 + 3] = 0;
			cellTex.needsUpdate = true;
		}
		return i;
	}
	const tx = assets && assets.textures || {};
	const man = tx.manifest && typeof tx.manifest === "object" && !tx.manifest.isTexture ? tx.manifest : {};
	const pick = (name) => tx[name] && tx[name].isTexture ? tx[name] : null;
	let fibreTex = pick("pagePaper");
	let fibreNormalTex = fibreTex ? pick("pagePaperNormal") : null;
	let ownFibre = null;
	if (!fibreTex) {
		fibreTex = ownFibre = canvasTexture(fibreFallback(), false);
		fibreNormalTex = null;
	}
	const fibreMean = imageMean(fibreTex);
	const fibreScale = !ownFibre && man.pagePaper && man.pagePaper.repeat || B.fibreScale;
	const fibreScale2 = !ownFibre && man.pagePaper && man.pagePaper.repeat2 || fibreScale * 2.9;
	let sheetTex = pick("edgeStrip");
	let ownSheet = null;
	let sheetV = [.99, .325];
	let sheetU = man.edgeStrip && man.edgeStrip.repeat || 2;
	if (!sheetTex) {
		sheetTex = ownSheet = canvasTexture(sheetLinesFallback(), true);
		sheetV = [.98, .3];
		sheetU = 3.2;
	}
	let tableTex = pick("table");
	let ownTable = null;
	const tableScale = tableTex && man.table && man.table.repeat || B.tableScale;
	if (!tableTex) tableTex = ownTable = canvasTexture(tableFallback(), true);
	const bakeSize = B.bakeSize && B.bakeSize[quality] || 512;
	const layers = modelIds.length * 2 + (VAR_N ? VAR_N + 2 + FEN_N : 0);
	const atlas = new WebGLArrayRenderTarget(bakeSize, bakeSize, layers, { depthBuffer: false });
	atlas.texture.colorSpace = SRGBColorSpace;
	atlas.texture.generateMipmaps = true;
	atlas.texture.minFilter = LinearMipmapLinearFilter;
	atlas.texture.magFilter = LinearFilter;
	atlas.texture.wrapS = atlas.texture.wrapT = ClampToEdgeWrapping;
	atlas.texture.anisotropy = 8;
	let baked = false;
	function bake(renderer) {
		baked = true;
		const ms = new WebGLRenderTarget(bakeSize, bakeSize, {
			samples: 4,
			depthBuffer: true
		});
		ms.texture.colorSpace = SRGBColorSpace;
		ms.texture.minFilter = ms.texture.magFilter = LinearFilter;
		ms.texture.generateMipmaps = false;
		const bakeScene = new Scene();
		bakeScene.add(new AmbientLight(16777215, Math.PI));
		const cam = new OrthographicCamera(-TILE_SIZE / 2, TILE_SIZE / 2, TILE_SIZE / 2, -TILE_SIZE / 2, .1, 20);
		cam.position.set(0, 10, 0);
		cam.up.set(0, 0, -1);
		cam.lookAt(0, 0, 0);
		const copyScene = new Scene();
		const copyCam = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
		const copyMat = new ShaderMaterial({
			uniforms: {
				t: { value: ms.texture },
				uWk: { value: new Vector4(0, .5, .5, 0) },
				uR: { value: waterConfig().shoreBlur }
			},
			vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",
			fragmentShader: BAKE_COPY_FRAG,
			depthTest: false,
			depthWrite: false,
			toneMapped: false
		});
		const quad = new Mesh(new PlaneGeometry(2, 2), copyMat);
		quad.frustumCulled = false;
		copyScene.add(quad);
		const prevRT = renderer.getRenderTarget();
		const prevFace = renderer.getActiveCubeFace();
		const prevMip = renderer.getActiveMipmapLevel();
		const prevAutoClear = renderer.autoClear;
		const prevShadow = renderer.shadowMap.autoUpdate;
		const prevXr = renderer.xr.enabled;
		const prevTone = renderer.toneMapping;
		const prevColor = renderer.getClearColor(new Color());
		const prevAlpha = renderer.getClearAlpha();
		renderer.autoClear = true;
		renderer.shadowMap.autoUpdate = false;
		renderer.xr.enabled = false;
		renderer.toneMapping = 0;
		renderer.setClearColor(cream, 0);
		try {
			for (let i = 0; i < modelIds.length; i++) {
				let tile = null;
				const hinges = [];
				const thinOff = [];
				try {
					tile = assets.getTilePrototype(modelIds[i]).clone(true);
					tile.position.set(0, 0, 0);
					tile.rotation.set(0, 0, 0);
					createFoldInstance(tile, { tileId: modelIds[i] }).snap(0);
					tile.traverse((o) => {
						if (o.userData && o.userData.hinge) hinges.push(o);
					});
					for (const c of tile.children) if (isThinned(modelIds[i], String(c.name || "").replace(/^.*__/, ""))) thinOff.push(c);
				} catch (err) {
					console.warn("[book] could not bake tile", modelIds[i], err);
				}
				if (tile) bakeScene.add(tile);
				for (let pass = 0; pass < 2; pass++) {
					for (const h of hinges) h.visible = pass === 1;
					for (const c of thinOff) c.visible = false;
					const wkd = pass === 0 ? waterKind(modelIds[i]) : null;
					if (wkd && wkd.kind) copyMat.uniforms.uWk.value.set(wkd.kind === 6 ? 2 : 1, .5 + (wkd.disc ? wkd.disc[0] : 0) / TILE_SIZE, .5 - (wkd.disc ? wkd.disc[1] : 0) / TILE_SIZE, wkd.disc ? wkd.disc[2] / TILE_SIZE : 0);
					else copyMat.uniforms.uWk.value.set(0, .5, .5, 0);
					renderer.setRenderTarget(ms);
					renderer.render(bakeScene, cam);
					renderer.setRenderTarget(atlas, i * 2 + pass);
					renderer.render(copyScene, copyCam);
				}
				if (tile && i < VAR_N) {
					const base = (o) => String(o.name || "").replace(/^.*__/, "").replace(/_x[bf]$/, "");
					copyMat.uniforms.uWk.value.set(0, .5, .5, 0);
					for (let pass = 0; pass < 3; pass++) {
						if (pass === 1 && !(modelIds[i] === "meadow" || modelIds[i] === "meadow_flowers")) continue;
						if (pass === 2 && i >= FEN_N) continue;
						const rx = pass === 0 ? DRY_RX : pass === 1 ? /^(haystack|beehive)/ : FENCE_RX;
						const off = [];
						for (const h of hinges) h.visible = true;
						for (const c of thinOff) c.visible = false;
						tile.traverse((o) => {
							if (o.visible && rx.test(base(o))) {
								o.visible = false;
								off.push(o);
							}
						});
						renderer.setRenderTarget(ms);
						renderer.render(bakeScene, cam);
						renderer.setRenderTarget(atlas, modelIds.length * 2 + (pass === 0 ? i : pass === 2 ? VAR_N + 2 + i : VAR_N + (modelIds[i] === "meadow" ? 0 : 1)));
						renderer.render(copyScene, copyCam);
						for (const o of off) o.visible = true;
					}
				}
				if (tile) bakeScene.remove(tile);
			}
		} finally {
			renderer.setRenderTarget(prevRT, prevFace, prevMip);
			renderer.autoClear = prevAutoClear;
			renderer.shadowMap.autoUpdate = prevShadow;
			renderer.xr.enabled = prevXr;
			renderer.toneMapping = prevTone;
			renderer.setClearColor(prevColor, prevAlpha);
			ms.dispose();
			copyMat.dispose();
			quad.geometry.dispose();
		}
	}
	const U = {
		uAtlas: { value: atlas.texture },
		uCells: { value: cellTex },
		uFibre: { value: fibreTex },
		uFibreN: { value: fibreNormalTex || fibreTex },
		uOff: { value: new Vector4() },
		uAnchorMod: { value: new Vector2() },
		uBk: { value: new Vector4(HW, HD, B.margin, B.fadedInk) },
		uGut: { value: new Vector4(0, B.gutterHalfWidth, B.gutterDepth, B.gutterEdgeDepth) },
		uGut2: { value: new Vector4(1, B.gutterShade, B.pageCurve, B.pageCurveWidth) },
		uCrease: { value: new Vector4(B.creaseWidth, B.creaseDark, B.creaseEmboss, B.twinGhost) },
		uFib: { value: new Vector4(1 / fibreScale, B.fibreNormal, B.fibreAlbedo, fibreNormalTex ? 1 : 0) },
		uFib2: { value: 1 / fibreScale2 },
		uFibMean: { value: fibreMean },
		uCream: { value: cream.clone() },
		uBiomeG: { value: biomeTintUniforms("ground").rows },
		uBiomeGK: { value: biomeTintUniforms("ground").keep },
		uBiomeP: { value: biomeTintUniforms("prop").rows },
		uBiomePK: { value: biomeTintUniforms("prop").keep },
		uBiomePath: { value: biomePathUniforms().tone },
		uBiomePathE: { value: biomePathUniforms().edge },
		uWorld0: { value: new Vector2() },
		uTrav: { value: new Vector4(0, 0, B.fadeNear ?? 8, B.fadeFar ?? 13.5) },
		...waterUniforms(),
		...REFLECT.uniforms
	};
	const isWaterModel = /* @__PURE__ */ new Uint8Array(256);
	modelIds.forEach((id, index) => {
		if (waterKind(id).kind > 0) isWaterModel[index] = 1;
	});
	const waterKinds = modelIds.map((id, index) => ({
		index,
		...waterKind(id)
	})).filter((k) => k.kind > 0);
	const bind = (shader, names) => {
		for (const n of names) shader.uniforms[n] = U[n];
	};
	const usePaper = B.usePaperMaterial !== false && materials && typeof materials.paper === "function";
	const ownMaterials = [];
	const uniqueMap = () => {
		const t = new DataTexture(new Uint8Array([
			255,
			255,
			255,
			255
		]), 1, 1);
		t.needsUpdate = true;
		return t;
	};
	function paperLike(opts) {
		let m = null;
		if (usePaper) try {
			m = materials.paper(opts);
		} catch {
			m = null;
		}
		if (!m || !m.isMaterial) {
			m = new MeshStandardMaterial({
				color: opts.color,
				roughness: 1,
				metalness: 0,
				side: opts.side,
				map: opts.map || null,
				vertexColors: !!opts.vertexColors
			});
			ownMaterials.push(m);
		}
		return m;
	}
	function chain(m, fn, key) {
		const prev = m.onBeforeCompile;
		const prevKey = m.customProgramCacheKey;
		m.onBeforeCompile = (shader, renderer) => {
			if (prev) prev.call(m, shader, renderer);
			fn(shader);
		};
		m.customProgramCacheKey = () => (prevKey ? prevKey.call(m) : "") + "|" + key;
		m.needsUpdate = true;
	}
	const pageMat = paperLike({
		color: "#ffffff",
		side: 0,
		map: uniqueMap(),
		fibre: "none",
		vary: false
	});
	chain(pageMat, (shader) => {
		bind(shader, [
			"uAtlas",
			"uCells",
			"uFibre",
			"uFibreN",
			"uOff",
			"uAnchorMod",
			"uBk",
			"uGut",
			"uGut2",
			"uCrease",
			"uFib",
			"uFib2",
			"uFibMean",
			"uCream",
			"uBiomeG",
			"uBiomeGK",
			"uBiomeP",
			"uBiomePK",
			"uBiomePath",
			"uBiomePathE",
			"uWorld0",
			"uTrav",
			"uWat",
			"uWat2",
			"uGnd",
			"uWatPal",
			"uReflTex",
			"uReflMat",
			"uRefl",
			"uRefl2"
		]);
		const hasPools = shader.fragmentShader.includes("uPaperPoolCol") && shader.fragmentShader.includes("varying vec3 vPaperW");
		shader.vertexShader = shader.vertexShader.replace("#include <common>", "#include <common>\nvarying vec2 vPg;\nvarying vec4 vReflP;\nuniform mat4 uReflMat;\n" + GUTTER_GLSL).replace("#include <begin_vertex>", "#include <begin_vertex>\nvPg = position.xz;\nvReflP = uReflMat * (modelMatrix * vec4(position.x, 0.0, position.z, 1.0));\ntransformed.y += gutterH(position.xz, 0.0);");
		shader.fragmentShader = shader.fragmentShader.replace("#include <common>", `#include <common>
varying vec2 vPg;
uniform highp sampler2DArray uAtlas;
uniform sampler2D uCells;
uniform sampler2D uFibre;
uniform sampler2D uFibreN;
uniform vec4 uOff;
uniform vec2 uAnchorMod;
uniform vec4 uCrease;
uniform vec4 uFib;
uniform float uFib2;
uniform float uFibMean;
uniform vec3 uCream;
uniform vec4 uBiomeG[${NB$1 * 3}];
uniform float uBiomeGK[${NB$1}];
uniform vec4 uBiomeP[${NB$1 * 3}];
uniform float uBiomePK[${NB$1}];
uniform vec4 uBiomePath[${NB$1}];
uniform vec4 uBiomePathE[${NB$1}];
uniform vec2 uWorld0;
uniform vec4 uTrav;   // xy: traveller in the frame of p, z / w: radius where the colour starts to fade / is gone
// printed path (the warm pale kraft strip of the base print; sage / teal / ink fail the warmth test): 1 on the path
float pathMask(vec3 c) { return smoothstep(0.03, 0.085, c.r - c.g) * smoothstep(0.3, 0.44, dot(c, vec3(0.3, 0.59, 0.11))) * smoothstep(0.2, 0.3, c.b); }
${BIOME_TINT_GLSL}
${GUTTER_GLSL}
${waterGLSL()}
vec2 gPageTilt;
vec3 pageColor() {
  const float TILE = ${TILE_SIZE.toFixed(1)};
  vec2 p = vPg + uOff.xy;                 // world position relative to the anchor cell centre
  vec2 cf = p / TILE + 0.5;
  vec2 ci = floor(cf);
  vec2 f = cf - ci;                       // 0..1 inside the cell (x east, y south)
  vec4 d = texelFetch(uCells, ivec2(mod(ci + uAnchorMod, ${GRID$1}.0)), 0);
  float layer = floor(d.r * 255.0 + 0.5) * 2.0;
  int gb = int(d.g * 255.0 + 0.5);
  int rot = gb & 3;
  vec2 l = f * 2.0 - 1.0;
  vec2 gx = dFdx(p) / TILE;
  vec2 gy = dFdy(p) / TILE;
  for (int i = 0; i < 3; i++) {
    if (i < rot) { l = vec2(l.y, -l.x); gx = vec2(gx.y, -gx.x); gy = vec2(gy.y, -gy.x); }
  }
  vec2 uv = vec2(l.x * 0.5 + 0.5, 0.5 - l.y * 0.5);
  vec2 dx = vec2(gx.x, -gx.y);
  vec2 dy = vec2(gy.x, -gy.y);
  vec4 base4 = textureGrad(uAtlas, vec3(uv, layer), dx, dy);
  float twinLayer = (gb & 192) == 192 ? ${(modelIds.length * 2 + VAR_N + 2).toFixed(1)} + layer * 0.5 : (gb & 64) != 0 ? ${(modelIds.length * 2).toFixed(1)} + layer * 0.5 : (gb & 128) != 0 ? ${(modelIds.length * 2).toFixed(1)} + ${VAR_N.toFixed(1)} + (layer == ${((modelIndex.get("meadow") ?? 0) * 2).toFixed(1)} ? 0.0 : 1.0) : layer + 1.0;
  vec3 flat_ = textureGrad(uAtlas, vec3(uv, twinLayer), dx, dy).rgb;
  ${groundBodyGLSL(bakeSize)}
  // neighbour cells of this quadrant (ink halo + biome blend)
  vec2 hq = sign(f - 0.5);
  vec2 hd = 0.5 - abs(f - 0.5);
  vec4 n1 = texelFetch(uCells, ivec2(mod(ci + uAnchorMod + vec2(hq.x, 0.0), ${GRID$1}.0)), 0);
  vec4 n2 = texelFetch(uCells, ivec2(mod(ci + uAnchorMod + vec2(0.0, hq.y), ${GRID$1}.0)), 0);
  vec4 n3 = texelFetch(uCells, ivec2(mod(ci + uAnchorMod + hq, ${GRID$1}.0)), 0);
  // biome tint (look pass): the colour transforms of the 4 nearest cells around a NOISE-WARPED position, so a biome
  // border is a wobbly hand-torn edge with a soft band instead of a ruler line along the tile seams.
  // (all warp frequencies are multiples of 2 pi / 256, the wrap of uWorld0)
  vec2 wp = p + uWorld0;
  vec2 warp = 0.32 * vec2(sin(wp.y * 1.2517 + 1.7 * sin(wp.x * 0.7854)), sin(wp.x * 1.2517 + 1.7 * sin(wp.y * 0.7854) + 2.1))
            + 0.11 * vec2(sin(wp.y * 3.1907 + wp.x * 2.0371), sin(wp.x * 3.1907 - wp.y * 2.0371));
  vec2 cb = cf + warp - 0.5;
  vec2 ib = floor(cb);
  vec2 bt = smoothstep(0.12, 0.88, cb - ib);
  int b0 = min((int(texelFetch(uCells, ivec2(mod(ib + uAnchorMod, ${GRID$1}.0)), 0).g * 255.0 + 0.5) >> 2) & 7, ${NB$1 - 1});
  int b1 = min((int(texelFetch(uCells, ivec2(mod(ib + uAnchorMod + vec2(1.0, 0.0), ${GRID$1}.0)), 0).g * 255.0 + 0.5) >> 2) & 7, ${NB$1 - 1});
  int b2 = min((int(texelFetch(uCells, ivec2(mod(ib + uAnchorMod + vec2(0.0, 1.0), ${GRID$1}.0)), 0).g * 255.0 + 0.5) >> 2) & 7, ${NB$1 - 1});
  int b3 = min((int(texelFetch(uCells, ivec2(mod(ib + uAnchorMod + vec2(1.0, 1.0), ${GRID$1}.0)), 0).g * 255.0 + 0.5) >> 2) & 7, ${NB$1 - 1});
  float w1 = bt.x * (1.0 - bt.y); float w2 = (1.0 - bt.x) * bt.y; float w3 = bt.x * bt.y; float w0 = 1.0 - w1 - w2 - w3;
  if (b0 + b1 + b2 + b3 > 0) {
    #define BMIX(A, o) (w0 * A[b0 * 3 + o] + w1 * A[b1 * 3 + o] + w2 * A[b2 * 3 + o] + w3 * A[b3 * 3 + o])
    vec4 g0 = BMIX(uBiomeG, 0); vec4 g1 = BMIX(uBiomeG, 1); vec4 g2 = BMIX(uBiomeG, 2);
    vec4 p0 = BMIX(uBiomeP, 0); vec4 p1 = BMIX(uBiomeP, 1); vec4 p2 = BMIX(uBiomeP, 2);
    float gk = w0 * uBiomeGK[b0] + w1 * uBiomeGK[b1] + w2 * uBiomeGK[b2] + w3 * uBiomeGK[b3];
    float pk = w0 * uBiomePK[b0] + w1 * uBiomePK[b1] + w2 * uBiomePK[b2] + w3 * uBiomePK[b3];
    // the folded-flat print differs from the bare ground where a paper piece lies on it: those pixels get the prop transform
    vec3 ground = biomeTintGround(base, g0, g1, g2, gk);
    // the road keeps its own tone per biome (trodden blue-grey track on snow, packed pale sand in the desert):
    // the ground tint alone would whiten / yellow it into the page and the main line of the composition is lost
    vec4 pt = w0 * uBiomePath[b0] + w1 * uBiomePath[b1] + w2 * uBiomePath[b2] + w3 * uBiomePath[b3];
    if (pt.w > 0.002 && ((gb >> 5) & 1) == 1) {
      vec4 pe = w0 * uBiomePathE[b0] + w1 * uBiomePathE[b1] + w2 * uBiomePathE[b2] + w3 * uBiomePathE[b3];
      float pm0 = gPathM;   // round 3: the ground print's own road mask (the road is repainted there, so a colour test no longer finds it)
      // fixer pass: the tinted track is narrower than the printed road and its edge wanders (trodden paper, not a
      // road): the mask is eroded by a radius that follows a slow world-space wobble
      float wob = 0.5 + 0.25 * sin(p.x * 2.3 + 1.7 * sin(p.y * 1.1)) + 0.25 * sin(p.y * 2.9 + 1.3 * sin(p.x * 1.7) + 2.0);
      float er = 0.02 + 0.034 * wob;       // uv units (1 = one tile)
      float m1 = pathMask(textureGrad(uAtlas, vec3(uv + er * vec2(0.92, 0.38), layer), dx, dy).rgb);
      float m2 = pathMask(textureGrad(uAtlas, vec3(uv + er * vec2(-0.38, 0.92), layer), dx, dy).rgb);
      float m3 = pathMask(textureGrad(uAtlas, vec3(uv + er * vec2(-0.92, -0.38), layer), dx, dy).rgb);
      float m4 = pathMask(textureGrad(uAtlas, vec3(uv + er * vec2(0.38, -0.92), layer), dx, dy).rgb);
      // (ratio of the neighbourhood mean to the centre, so a faint or hatched print is thinned, not erased)
      float pm = pm0 * smoothstep(0.45, 0.85, 0.25 * (m1 + m2 + m3 + m4) / max(pm0, 0.08));
      // amount > 0.9 = mask gain for a faint / stippled road print (snow): the neighbourhood mean is boosted instead
      // (before this the snow track was painted by the EDGE colour alone, as a hard dark slab)
      float pgain = 1.0 + 5.0 * clamp(pt.w - 0.9, 0.0, 1.0);
      pm = mix(pm, smoothstep(0.3, 0.8, 0.2 * (pm0 + m1 + m2 + m3 + m4) * pgain), clamp(pgain - 1.0, 0.0, 1.0));
      // soft shoulder between the track and the page (was a hard printed line)
      float ed = clamp(pm0 - pm, 0.0, 1.0) * 0.8;
      float lumB = dot(base, vec3(0.3, 0.59, 0.11));
      vec3 tone = pt.rgb * (0.93 + 0.1 * lumB / 0.66);      // keeps a little of the print's own tone variation
      ground = mix(ground, tone, pm * min(pt.w, 0.9));
      ground = mix(ground, pe.rgb, ed * pe.w);
    }
    flat_ = mix(ground, biomeTint(flat_, p0, p1, p2, pk), isProp);
    base = ground;
  }
  ${waterBodyGLSL(waterKinds)}
  float tw = max(d.b, uCrease.w);
  vec3 pr = mix(base, flat_, tw);
  float lum = dot(pr, vec3(0.3, 0.59, 0.11));
  // shortfall fixer: the printed twins of pieces that have not risen sit back (paler, greyer) behind the standing ones
  float fpk = tw * isProp;
  // round 3 (page): land far from the traveller is the unpainted part of the book: a pale wash with pencil outlines
  // and a little hatching in the dark areas. Outlines = luma gradient of the print itself (no extra fetch).
  float lgr = length(vec2(dFdx(lum), dFdy(lum))) / max(wpx, 1e-5);
  float skLine = smoothstep(0.5, 2.6, lgr);
  float skHatch = smoothstep(0.35, 0.9, sin((wq.x - wq.y) * WKF(5120) + 2.0 * wNoise(wq, 2.0))) * (1.0 - smoothstep(0.3, 0.52, lum)) * (1.0 - smoothstep(0.012, 0.03, wpx));
  vec3 skWash = mix(uCream, mix(pr, vec3(lum) * vec3(1.04, 1.0, 0.93), 0.5 + 0.25 * fpk), uBk.w * (0.72 - 0.2 * fpk));
  vec3 faded = mix(skWash, vec3(0.34, 0.29, 0.25), clamp(0.5 * skLine + 0.2 * skHatch, 0.0, 0.6) * uBk.w);
  // ink: full on cells about to rise / risen, with a soft halo into the neighbours (no hard tile steps)
  float i1 = n1.a; float i2 = n2.a; float i3 = n3.a;
  float inkv = max(max(d.a, i1 * (1.0 - smoothstep(0.0, 0.5, hd.x))), max(i2 * (1.0 - smoothstep(0.0, 0.5, hd.y)), i3 * (1.0 - smoothstep(0.0, 0.5, length(hd)))));
  // soft radial fade around the traveller (noise-warped rim, no tile-shaped steps); the per-cell ink stays as the
  // floor under tiles that stand outside it
  float rdT = distance(p, uTrav.xy) + 2.4 * (wNoise(wq + 14.2, 0.5) - 0.5) + 0.8 * (wNoise(wq + 3.7, 2.0) - 0.5);
  float inkC = inkv;
  inkv = max(inkv, 1.0 - smoothstep(uTrav.z, uTrav.w, rdT));
  // the land takes the radial colour; the flat print of a piece stays a pencil plan until its own cell inks in
  // (and even then it comes up with the distance: full colour where tiles rise, a pencil plan one tile further out)
  float inkM = mix(inkv, inkC * (1.0 - ${(B.printFade ?? .75).toFixed(2)} * smoothstep(${(B.printNear ?? 6.8).toFixed(2)}, ${(B.printFar ?? 9.6).toFixed(2)}, distance(p, uTrav.xy))), fpk);
  vec3 col = mix(faded, pr, inkM * inkM * (3.0 - 2.0 * inkM));
  gWatRefl.z *= inkv * (1.0 - tw * isProp);   // mirror image: only on inked water, never over a flat-folded piece
  // unprinted margin along the page edges
  float e = min(uBk.x - abs(vPg.x), uBk.y - abs(vPg.y));
  col = mix(uCream, col, smoothstep(uBk.z * 0.62, uBk.z, e));

  vec2 tilt = vec2(0.0);
  float aa = max(fwidth(p.x), fwidth(p.y));
  // tile seams: a scored crease (thin dark line + tiny V groove)
  vec2 sd = (f - floor(f + 0.5)) * TILE;  // signed distance to the nearest seam on each axis
  vec2 ad = abs(sd);
  float w = uCrease.x;
  vec2 line = 1.0 - smoothstep(vec2(w * 0.5), vec2(w * 0.5 + aa), ad);
  float inPrint = smoothstep(uBk.z * 0.5, uBk.z, e);
  col *= 1.0 - uCrease.y * uGnd.z * max(line.x, line.y) * inPrint;
  vec2 groove = (1.0 - smoothstep(vec2(0.0), vec2(w * 3.0 + aa), ad)) * sign(sd);
  tilt -= groove * uCrease.z * uGnd.z * inPrint;
  // gutter valley + broad page curvature toward the spine
  float ge = gutterEdge(vPg.y);
  float hw = uGut.y * (1.0 + 0.7 * ge);
  float gd = gutterDx(vPg.x);
  float ga = clamp(1.0 - abs(gd) / hw, 0.0, 1.0);
  float gs = sign(gd);
  // round 3 (page): both tilts ease to zero at the fold, so the normal is continuous there: a lamp beside the gutter
  // used to light one leaf and not the other with a ruler-straight step between them (night)
  tilt.x -= gs * (2.0 * mix(uGut.z, uGut.w, ge) * ga / hw * uGut2.y * smoothstep(0.0, 0.1, abs(gd)) + uGut2.z * exp(-abs(gd) / uGut2.w) * smoothstep(0.0, 1.1, abs(gd))) * uGut2.x;
  const float GK = ${(CONFIG.book.gutterDark ?? 1).toFixed(3)};   // shortfall fixer: strength of the gutter darkening
  col *= 1.0 - GK * (0.30 * ga * ga * ga + 0.38 * (1.0 - smoothstep(0.004, 0.022 + aa, abs(gd)))) * uGut2.x;
  // spine valley: the page rolling down into the gutter turns away from the (left) key on the west leaf
  // (broad soft shadow) and toward it on the east leaf (tight shadow in the fold, then a faint lit shoulder)
  float gw = abs(gd);
  col *= 1.0 - GK * uGut2.x * (gd < 0.0 ? 0.34 * exp(-gw / 1.0) : 0.26 * exp(-gw / 0.28) - 0.07 * exp(-gw / 1.5) * (1.0 - exp(-gw / 0.28)));
  // fibre: fine tooth + coarse clouding (albedo) and a tooth normal
  vec2 fuv = (p + uOff.zw) * uFib.x;
  float fa = texture2D(uFibre, fuv).g / uFibMean - 1.0;
  float fc = texture2D(uFibre, (p.yx + uOff.wz) * vec2(uFib2, -uFib2) + vec2(0.31, 0.67)).g / uFibMean - 1.0;
  col *= 1.0 + (fa * 0.75 + fc * 0.6) * uFib.z;
  if (uFib.w > 0.5) {
    vec3 n = texture2D(uFibreN, fuv).xyz * 2.0 - 1.0;
    tilt += n.xy * uFib.y;
  } else {
    float e1 = 1.0 / 512.0;
    float hx = texture2D(uFibre, fuv + vec2(e1, 0.0)).g - texture2D(uFibre, fuv - vec2(e1, 0.0)).g;
    float hy = texture2D(uFibre, fuv + vec2(0.0, e1)).g - texture2D(uFibre, fuv - vec2(0.0, e1)).g;
    tilt -= vec2(hx, hy) * 2.2 * uFib.y;
  }
  gPageTilt = tilt;
  return col;
}`).replace("#include <map_fragment>", "#include <map_fragment>\ndiffuseColor.rgb = pageColor();" + (hasPools ? WATER_GLOW_GLSL : "") + WATER_MIRROR_GLSL).replace("#include <normal_fragment_maps>", "#include <normal_fragment_maps>\nnormal = normalize(normal + mat3(viewMatrix) * vec3(gPageTilt.x, 0.0, gPageTilt.y));");
		if (!shader.fragmentShader.includes("diffuseColor.rgb = pageColor();")) console.warn("[book] page shader hook not applied (unexpected material)");
	}, "book-page-v12-page");
	const pageGeo = new PlaneGeometry(HW * 2, HD * 2, Math.round(HW * 2 / .1), 8).rotateX(-Math.PI / 2);
	const page = new Mesh(pageGeo, pageMat);
	page.name = "page";
	page.position.y = -.002;
	page.receiveShadow = true;
	page.frustumCulled = false;
	page.onBeforeRender = (renderer) => {
		if (!baked) bake(renderer);
		U.uWat.value.x = state.time || 0;
	};
	group.add(page);
	const rnd = lcg(9001);
	const N = Math.max(3, B.pageStackLayers | 0);
	const prof = [{
		ox: 0,
		oz: 0,
		y: 0,
		v: 0,
		tread: false
	}];
	{
		let ox = 0;
		let oz = 0;
		for (let i = 0; i < N; i++) {
			const y = -T * (i + 1) / N;
			ox += T / N * (.5 + rnd() * .2);
			oz += B.pageStackStep * .08;
			prof.push({
				ox,
				oz,
				y,
				v: (i + 1) / N,
				tread: false
			});
			if (i < N - 1) {
				ox += B.pageStackStep * (.12 + rnd() * .5);
				oz += B.pageStackStep * (.1 + rnd() * .3);
				prof.push({
					ox,
					oz,
					y,
					v: (i + 1) / N,
					tread: true
				});
			}
		}
	}
	const footX = prof[prof.length - 1].ox;
	const footZ = prof[prof.length - 1].oz;
	const ring = [];
	{
		const nxSeg = Math.round(HW * 2 / .125);
		const nzSeg = Math.round(HD * 2 / .5);
		for (let i = 0; i < nxSeg; i++) ring.push({
			x: -HW + i / nxSeg * HW * 2,
			z: -HD,
			sx: i === 0 ? -1 : 0,
			sz: -1
		});
		for (let i = 0; i < nzSeg; i++) ring.push({
			x: HW,
			z: -HD + i / nzSeg * HD * 2,
			sx: 1,
			sz: i === 0 ? -1 : 0
		});
		for (let i = 0; i < nxSeg; i++) ring.push({
			x: HW - i / nxSeg * HW * 2,
			z: HD,
			sx: i === 0 ? 1 : 0,
			sz: 1
		});
		for (let i = 0; i < nzSeg; i++) ring.push({
			x: -HW,
			z: HD - i / nzSeg * HD * 2,
			sx: -1,
			sz: i === 0 ? 1 : 0
		});
		let s = 0;
		for (let i = 0; i < ring.length; i++) {
			ring[i].s = s;
			const b = ring[(i + 1) % ring.length];
			s += Math.hypot(b.x - ring[i].x, b.z - ring[i].z);
		}
		ring.total = s;
	}
	const blockGeo = (() => {
		const pos = [];
		const col = [];
		const uv = [];
		const M = prof.length;
		const R = ring.length;
		const jit = new Float32Array(M * R);
		for (let m = 0; m < M; m++) {
			let j = 0;
			for (let r = 0; r < R; r++) {
				j = j * .9 + (rnd() - .5) * .004;
				jit[m * R + r] = m === 0 ? 0 : j;
			}
		}
		const tone = new Float32Array(M);
		for (let m = 0; m < M; m++) tone[m] = .86 + rnd() * .14;
		const P = (m, r) => {
			const a = ring[r % R];
			const p = prof[m];
			const j = jit[m * R + r % R];
			return [
				a.x + a.sx * (p.ox + j),
				p.y,
				a.z + a.sz * (p.oz + j)
			];
		};
		const uPer = 1 / sheetU;
		for (let m = 0; m < M - 1; m++) {
			const tread = prof[m + 1].tread;
			const t0 = tread ? 1 : tone[m];
			for (let r = 0; r < R; r++) {
				const a = P(m, r);
				const b = P(m, r + 1);
				const c = P(m + 1, r + 1);
				const d = P(m + 1, r);
				const u0 = ring[r].s * uPer;
				const u1 = (r + 1 < R ? ring[r + 1].s : ring.total) * uPer;
				const v0 = sheetV[0] + (sheetV[1] - sheetV[0]) * prof[m].v;
				const v1 = tread ? v0 : sheetV[0] + (sheetV[1] - sheetV[0]) * prof[m + 1].v;
				pos.push(...a, ...d, ...b, ...b, ...d, ...c);
				uv.push(u0, v0, u0, v1, u1, v0, u1, v0, u0, v1, u1, v1);
				for (let k = 0; k < 6; k++) col.push(t0, t0, t0);
			}
		}
		const g = new BufferGeometry();
		g.setAttribute("position", new Float32BufferAttribute(pos, 3));
		g.setAttribute("uv", new Float32BufferAttribute(uv, 2));
		g.setAttribute("color", new Float32BufferAttribute(col, 3));
		g.computeVertexNormals();
		return g;
	})();
	const blockMat = paperLike({
		color: palette.cutEdge || "#fbf6ea",
		side: 2,
		map: uniqueMap(),
		fibre: "local",
		vary: false,
		vertexColors: true
	});
	const uSheet = { value: sheetTex };
	chain(blockMat, (shader) => {
		bind(shader, [
			"uGut",
			"uGut2",
			"uBk"
		]);
		shader.uniforms.uSheet = uSheet;
		shader.vertexShader = shader.vertexShader.replace("#include <common>", "#include <common>\nvarying vec2 vSheetUv;\n" + GUTTER_GLSL).replace("#include <begin_vertex>", "#include <begin_vertex>\nvSheetUv = uv;\ntransformed.y += gutterH(position.xz, position.y);");
		shader.fragmentShader = shader.fragmentShader.replace("#include <common>", "#include <common>\nvarying vec2 vSheetUv;\nuniform sampler2D uSheet;").replace("#include <map_fragment>", `#include <map_fragment>
  { // stacked sheets: cream paper with thin warm-brown gaps (the strip is a luminance map)
    float sl = texture2D(uSheet, vSheetUv).g;
    diffuseColor.rgb *= mix(vec3(0.46, 0.33, 0.23), vec3(1.0), smoothstep(0.02, 0.42, sl));
  }`);
	}, "book-block-v2");
	const block = new Mesh(blockGeo, blockMat);
	block.name = "page-block";
	block.position.y = -.002;
	block.castShadow = true;
	block.receiveShadow = true;
	block.frustumCulled = false;
	group.add(block);
	const cw = HW + footX + B.coverOverhang;
	const cd = HD + footZ + B.coverOverhang;
	const coverMat = paperLike({
		color: B.coverColor,
		side: 0,
		fibre: "local",
		vary: false
	});
	const cover = new Mesh(new BoxGeometry(cw * 2, B.coverThickness, cd * 2), coverMat);
	cover.name = "cover";
	cover.position.y = -.002 - T - B.coverThickness / 2;
	cover.castShadow = true;
	cover.receiveShadow = true;
	cover.frustumCulled = false;
	group.add(cover);
	const TABLE = 260;
	const tableY = -.002 - T - B.coverThickness - .001;
	const uBookRect = { value: new Vector4(0, 0, cw, cd) };
	const tableMat = new MeshStandardMaterial({
		color: 16777215,
		roughness: .86,
		metalness: 0
	});
	tableMat.name = "book:table";
	const uTable = { value: new Vector4(1 / tableScale, 0, 0, B.tableGain ?? 1) };
	tableMat.onBeforeCompile = (shader) => {
		shader.uniforms.uBookRect = uBookRect;
		shader.uniforms.uTable = uTable;
		shader.uniforms.uTableTex = { value: tableTex };
		shader.vertexShader = shader.vertexShader.replace("#include <common>", "#include <common>\nvarying vec2 vTb;").replace("#include <begin_vertex>", "#include <begin_vertex>\nvTb = position.xz;");
		shader.fragmentShader = shader.fragmentShader.replace("#include <common>", "#include <common>\nvarying vec2 vTb;\nuniform vec4 uBookRect;\nuniform vec4 uTable;\nuniform sampler2D uTableTex;").replace("#include <map_fragment>", `#include <map_fragment>
  {
    vec2 q = (vTb + uTable.yz) * uTable.x;
    diffuseColor.rgb = texture2D(uTableTex, q).rgb * uTable.w;
    vec2 bd = abs(vTb - uBookRect.xy) - uBookRect.zw;
    float dist = length(max(bd, 0.0)) + min(max(bd.x, bd.y), 0.0);
    diffuseColor.rgb *= mix(0.3, 1.0, smoothstep(0.0, 1.5, dist));   // contact occlusion around the book
  }`);
	};
	tableMat.customProgramCacheKey = () => "book-table-v1";
	const table = new Mesh(new PlaneGeometry(TABLE, TABLE).rotateX(-Math.PI / 2), tableMat);
	table.name = "table";
	table.receiveShadow = true;
	table.frustumCulled = false;
	scene.add(table);
	const centre = {
		x: 0,
		z: 0
	};
	let first = true;
	let gutterLocal = 0;
	let gutterFade = 1;
	let gutterWorld = B.gutterX0;
	const fmod = (a, m) => a - Math.floor(a / m) * m;
	function place(px, pz) {
		if (first) {
			centre.x = px;
			centre.z = pz;
			first = false;
		}
		centre.x = Math.min(px + B.slackX, Math.max(px - B.slackX, centre.x));
		centre.z = Math.min(pz + B.slackZ, Math.max(pz - B.slackZ, centre.z));
		group.position.set(centre.x, 0, centre.z);
		const ax = Math.round(centre.x / TILE_SIZE);
		const az = Math.round(centre.z / TILE_SIZE);
		U.uOff.value.set(centre.x - ax * TILE_SIZE, centre.z - az * TILE_SIZE, fmod(ax * TILE_SIZE, fibreScale * fibreScale2 * 4), fmod(az * TILE_SIZE, fibreScale * fibreScale2 * 4));
		U.uAnchorMod.value.set(ax & MASK, az & MASK);
		U.uWorld0.value.set(fmod(ax * TILE_SIZE, 256), fmod(az * TILE_SIZE, 256));
		U.uTrav.value.x = px - ax * TILE_SIZE;
		U.uTrav.value.y = pz - az * TILE_SIZE;
		gutterWorld = B.gutterX0 + PERIOD * Math.round((centre.x - B.gutterX0) / PERIOD);
		gutterLocal = gutterWorld - centre.x;
		gutterFade = 1;
		U.uGut.value.x = gutterLocal;
		U.uGut2.value.x = gutterFade;
		const tpx = Math.round(centre.x);
		const tpz = Math.round(centre.z);
		table.position.set(tpx, tableY, tpz);
		uTable.value.y = fmod(tpx, tableScale);
		uTable.value.z = fmod(tpz, tableScale);
		uBookRect.value.x = centre.x - tpx;
		uBookRect.value.y = centre.z - tpz;
	}
	function cells(dt, snap) {
		const x0 = Math.floor((centre.x - HW) / TILE_SIZE + .5);
		const x1 = Math.floor((centre.x + HW) / TILE_SIZE + .5);
		const z0 = Math.floor((centre.z - HD) / TILE_SIZE + .5);
		const z1 = Math.floor((centre.z + HD) / TILE_SIZE + .5);
		const up = dt / B.inkInTime;
		const down = dt / B.inkOutTime;
		let dirty = false;
		let nw = 0;
		for (let cz = z0; cz <= z1; cz++) for (let cx = x0; cx <= x1; cx++) {
			const i = slot(cx, cz);
			const target = mark[i] | hold[i];
			mark[i] = 0;
			let v = ink[i];
			if (snap) v = target;
			else if (target) v = Math.min(1, v + up);
			else v = Math.max(0, v - down);
			ink[i] = v;
			const b = v >= 1 ? 255 : Math.min(254, Math.round(v * v * (3 - 2 * v) * 255));
			const t = Math.round(twin[i] * 255);
			const o = i * 4;
			if (data[o + 3] !== b || data[o + 2] !== t) {
				data[o + 3] = b;
				data[o + 2] = t;
				dirty = true;
			}
			if (b > 0 && isWaterModel[data[o]] && nw < 256) {
				REFLECT.cells[nw * 2] = cx * TILE_SIZE;
				REFLECT.cells[nw * 2 + 1] = cz * TILE_SIZE;
				nw++;
			}
		}
		REFLECT.count = nw;
		if (dirty) cellTex.needsUpdate = true;
	}
	place(0, 0);
	first = true;
	return {
		group,
		page,
		table,
		/** checks: bake layout (round 3): twin layers, the dry twins (VAR_N) and the desert twins without fences (FEN_N). */
		debugBake: {
			layers,
			VAR_N,
			FEN_N,
			fence: [...fenceSet]
		},
		centre,
		halfWidth: HW,
		halfDepth: HD,
		/** Keep the book around the traveller; advance the ink fades. Call AFTER the world marked its cells. */
		update(dt, travellerPos) {
			place(travellerPos.x, travellerPos.z);
			cells(dt, false);
		},
		/** Move the window only (so cellOnPage is valid for this frame's streaming decisions). */
		follow(travellerPos) {
			place(travellerPos.x, travellerPos.z);
		},
		/** Snap every ink fade to its target (teleports, settle()). */
		settle() {
			cells(0, true);
		},
		/** World -> book: this cell is about to rise / is risen: ink it in (call every frame while true). */
		markInk(cx, cz) {
			mark[slot(cx, cz)] = 1;
		},
		/** World -> book: a tile is shown on this cell (keeps the ink at full until released). */
		setHold(cx, cz, on) {
			const i = (cz & MASK) << SHIFT | cx & MASK;
			if (kx[i] === cx && kz[i] === cz) hold[i] = on ? 1 : 0;
		},
		/** World -> book: weight (0..1) of the folded-flat "printed twin" on this cell (1 = tile lies flat). */
		setTwin(cx, cz, w) {
			const i = (cz & MASK) << SHIFT | cx & MASK;
			if (kx[i] === cx && kz[i] === cz) twin[i] = w < 0 ? 0 : w > 1 ? 1 : w;
		},
		/** True once the cell's print is at full ink (a flat tile may then appear on it without a pop). */
		inkReady(cx, cz) {
			const i = (cz & MASK) << SHIFT | cx & MASK;
			return kx[i] === cx && kz[i] === cz && ink[i] >= 1;
		},
		/** Is the whole cell on the printed part of the page (not on the margin / off the book)? */
		cellOnPage(cx, cz, slop = 0) {
			const half = TILE_SIZE / 2;
			return Math.abs(cx * TILE_SIZE - centre.x) + half <= HW - B.margin + slop + 1e-6 && Math.abs(cz * TILE_SIZE - centre.z) + half <= HD - B.margin + slop + 1e-6;
		},
		/** Does the cell overlap the page at all (so it has a slot in the cell-data window)? */
		cellTouchesPage(cx, cz) {
			const half = TILE_SIZE / 2;
			return Math.abs(cx * TILE_SIZE - centre.x) - half < HW && Math.abs(cz * TILE_SIZE - centre.z) - half < HD;
		},
		/** Height (<= 0) of the page surface at world (x, z): the gutter valley. Allocation-free. */
		gutterDip(x, z) {
			const gx = x - B.gutterX0;
			const a = 1 - Math.abs(gx - PERIOD * Math.round(gx / PERIOD)) / B.gutterHalfWidth;
			if (a <= 0) return 0;
			return -B.gutterDepth * a * a * gutterFade;
		},
		get gutterX() {
			return gutterWorld;
		},
		get baked() {
			return baked;
		},
		atlas,
		modelIndex,
		dispose() {
			scene.remove(group);
			scene.remove(table);
			atlas.dispose();
			cellTex.dispose();
			pageGeo.dispose();
			blockGeo.dispose();
			cover.geometry.dispose();
			table.geometry.dispose();
			for (const m of ownMaterials) m.dispose();
			tableMat.dispose();
			if (ownFibre) ownFibre.dispose();
			if (ownSheet) ownSheet.dispose();
			if (ownTable) ownTable.dispose();
		}
	};
}
// src/world/railway/railwayLayer.js
/**
* Top-level railway layer state. Canonical storage + derived indexes.
*/
var RailwayLayer = class {
	constructor() {
		this.features = /* @__PURE__ */ new Map();
		this.cellIndex = /* @__PURE__ */ new Map();
		this.chunkIndex = /* @__PURE__ */ new Map();
		this.buildErrors = [];
		this.isBuilt = false;
	}
};
// src/world/world.js
var hypot2$3 = (a, b) => Math.sqrt(a * a + b * b);
var HALF = TILE_SIZE / 2;
var GMASK = 31;
var CMASK = 63;
var SDF_N = 41;
var SDF_STEP = TILE_SIZE / 40;
var _m$2 = new Matrix4();
var _v = new Vector3();
var _a = new Vector3();
var _b = new Vector3();
var _c$1 = new Vector3();
var _tintCol = new Color();
function isBaseMesh(mesh) {
	if (!/^base/i.test(mesh.name || "")) return false;
	for (let p = mesh.parent; p; p = p.parent) if (p.userData && p.userData.hinge) return false;
	return true;
}
/** Float32, de-normalised, indexed copy of a geometry restricted to `spec` attributes (BatchedMesh needs a uniform layout). */
function normaliseGeometry(src, spec) {
	const g = new BufferGeometry();
	const count = src.getAttribute("position").count;
	let work = src;
	if (spec.normal && !src.getAttribute("normal")) {
		work = src.clone();
		work.computeVertexNormals();
	}
	for (const name in spec) {
		const size = spec[name];
		const a = work.getAttribute(name);
		const arr = new Float32Array(count * size);
		if (a) {
			const n = Math.min(size, a.itemSize);
			for (let i = 0; i < count; i++) {
				for (let k = 0; k < n; k++) arr[i * size + k] = a.getComponent(i, k);
				for (let k = n; k < size; k++) arr[i * size + k] = name === "color" ? 1 : 0;
			}
		} else if (name === "color") arr.fill(1);
		else if (name === "uv1") arr.fill(-1);
		g.setAttribute(name, new BufferAttribute(arr, size));
	}
	const idx = src.getIndex();
	const ia = new Uint32Array(idx ? idx.count : count);
	if (idx) for (let i = 0; i < ia.length; i++) ia[i] = idx.getX(i);
	else for (let i = 0; i < ia.length; i++) ia[i] = i;
	g.setIndex(new BufferAttribute(ia, 1));
	if (src.boundingBox) g.boundingBox = src.boundingBox.clone();
	else g.computeBoundingBox();
	if (src.boundingSphere) g.boundingSphere = src.boundingSphere.clone();
	else g.computeBoundingSphere();
	return g;
}
/** The live world, for modules that are not handed it (camera/follow.js sight assist). */
var sight = { world: null };
function createWorld({ scene, assets, wfc, materials, quality }) {
	const W = CONFIG.world;
	const group = new Group();
	group.name = "world";
	scene.add(group);
	const book = createBook({
		scene,
		assets,
		wfc,
		materials,
		quality
	});
	const origin = new Vector3();
	const batchRoot = new Group();
	batchRoot.name = "tile-batches";
	group.add(batchRoot);
	/** material.uuid -> { mesh, geoIds: Map<geometry.uuid, id>, spec, verts, indices } */
	const batches = /* @__PURE__ */ new Map();
	const batchList = [];
	function renderable(o) {
		return o.isMesh && o.geometry && o.geometry.getAttribute("position") && o.material && !o.isSkinnedMesh && (W.renderBases || !isBaseMesh(o));
	}
	const matOf = (o) => Array.isArray(o.material) ? o.material[0] : o.material;
	const TINT = W.biomeTintEnabled !== false && !!W.biomeTint;
	const OWN_ART = new Set(Object.keys(MODELS).filter((id) => {
		const b = MODELS[id].biomes;
		return b && Object.keys(b).length === 1 && !b.heartland;
	}));
	const tintU = TINT ? biomeTintUniforms("prop") : null;
	const tintUniforms = TINT ? {
		uBiomeP: { value: tintU.rows },
		uBiomePK: { value: tintU.keep }
	} : null;
	const WIND = CONFIG.spring.wind || { enabled: false };
	const WIND_ON = !!WIND.enabled;
	const windStrength = new Float32Array(BIOMES.length);
	for (let i = 0; i < BIOMES.length; i++) windStrength[i] = (WIND.strength && WIND.strength[BIOMES[i]]) ?? 1;
	const _bw = new Float32Array(BIOMES.length);
	const SPIN_RX = WIND_ON && WIND.spinMatch ? new RegExp(WIND.spinMatch, "i") : null;
	/** geometry.uuid -> null | { body, part, hub }: the sail layer of a windmill card split off as its own geometry. */
	const spinCache = /* @__PURE__ */ new Map();
	function subGeometry(src, tris, pick, ox, oy) {
		const idx = src.getIndex();
		const pos = src.getAttribute("position");
		const remap = new Int32Array(pos.count).fill(-1);
		const order = [];
		const index = [];
		for (let t = 0; t < tris.length; t++) {
			if (tris[t] !== pick) continue;
			for (let k = 0; k < 3; k++) {
				const v = idx ? idx.getX(t * 3 + k) : t * 3 + k;
				if (remap[v] < 0) {
					remap[v] = order.length;
					order.push(v);
				}
				index.push(remap[v]);
			}
		}
		const g = new BufferGeometry();
		for (const name in src.attributes) {
			const a = src.attributes[name];
			const arr = new Float32Array(order.length * a.itemSize);
			for (let i = 0; i < order.length; i++) for (let k = 0; k < a.itemSize; k++) arr[i * a.itemSize + k] = a.getComponent(order[i], k);
			if (name === "position") for (let i = 0; i < order.length; i++) {
				arr[i * 3] -= ox;
				arr[i * 3 + 1] -= oy;
			}
			g.setAttribute(name, new BufferAttribute(arr, a.itemSize));
		}
		g.setIndex(index);
		g.computeBoundingBox();
		g.computeBoundingSphere();
		return g;
	}
	/** Sail split for a mesh (cached per source geometry); null when the mesh has no sail layer. */
	function spinSplit(mesh) {
		if (SPIN_RX === null || !SPIN_RX.test(mesh.name || "")) return null;
		const src = mesh.geometry;
		if (spinCache.has(src.uuid)) return spinCache.get(src.uuid);
		let out = null;
		const pos = src.getAttribute("position");
		const idx = src.getIndex();
		const nt = (idx ? idx.count : pos.count) / 3 | 0;
		const tris = new Uint8Array(nt);
		let n = 0;
		let x0 = 1e9;
		let x1 = -1e9;
		let y0 = 1e9;
		let y1 = -1e9;
		for (let t = 0; t < nt; t++) {
			let ok = true;
			for (let k = 0; k < 3; k++) if (pos.getZ(idx ? idx.getX(t * 3 + k) : t * 3 + k) < WIND.spinZMin) ok = false;
			if (!ok) continue;
			tris[t] = 1;
			n++;
			for (let k = 0; k < 3; k++) {
				const v = idx ? idx.getX(t * 3 + k) : t * 3 + k;
				const x = pos.getX(v);
				const y = pos.getY(v);
				if (x < x0) x0 = x;
				if (x > x1) x1 = x;
				if (y < y0) y0 = y;
				if (y > y1) y1 = y;
			}
		}
		if (n > 0 && n < nt) {
			const hub = new Vector3((x0 + x1) / 2, (y0 + y1) / 2, 0);
			out = {
				body: subGeometry(src, tris, 0, 0, 0),
				part: subGeometry(src, tris, 1, hub.x, hub.y),
				hub
			};
		}
		spinCache.set(src.uuid, out);
		return out;
	}
	{
		const plan = /* @__PURE__ */ new Map();
		const ids = assets.modelIds && assets.modelIds.length ? assets.modelIds : Object.keys(MODELS);
		for (const id of ids) {
			let proto = null;
			try {
				proto = assets.getTilePrototype(id);
			} catch {
				proto = null;
			}
			if (!proto) continue;
			proto.traverse((o) => {
				if (!renderable(o)) return;
				const mat = matOf(o);
				let p = plan.get(mat.uuid);
				if (!p) plan.set(mat.uuid, p = {
					material: mat,
					geos: /* @__PURE__ */ new Map(),
					spec: {}
				});
				const sp = spinSplit(o);
				if (sp) {
					p.geos.set(sp.body.uuid, sp.body);
					p.geos.set(sp.part.uuid, sp.part);
				} else p.geos.set(o.geometry.uuid, o.geometry);
			});
		}
		for (const p of plan.values()) createBatch(p.material, [...p.geos.values()]);
	}
	function isGlow(material) {
		const e = material.emissive;
		return !!(e && e.isColor && e.r + e.g + e.b > 0 && (material.emissiveIntensity === void 0 || material.emissiveIntensity > 0));
	}
	function tintMaterial(m) {
		if (m.userData.biomeTint) return;
		m.userData.biomeTint = true;
		const NB = tintU.count;
		const prev = m.onBeforeCompile;
		const prevKey = m.customProgramCacheKey;
		m.onBeforeCompile = (shader, renderer) => {
			if (prev) prev.call(m, shader, renderer);
			Object.assign(shader.uniforms, tintUniforms);
			const pars = "\nvarying vec4 vBt0;\nvarying vec4 vBt1;\nvarying vec4 vBt2;\nvarying float vBtK;\n";
			const stock = "vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );";
			const mine = `{ int bi = clamp( int( getBatchingColor( getIndirectIndex( gl_DrawID ) ).r - 0.5 ), 0, ${NB - 1} );
        vBt0 = uBiomeP[ bi * 3 ]; vBt1 = uBiomeP[ bi * 3 + 1 ]; vBt2 = uBiomeP[ bi * 3 + 2 ]; vBtK = uBiomePK[ bi ]; }`;
			let vs = shader.vertexShader;
			if (!vs.includes(stock)) vs = vs.replace("#include <color_vertex>", ShaderChunk.color_vertex);
			if (!vs.includes(stock)) {
				console.warn("[world] biome tint hook not applied (unexpected shader)");
				return;
			}
			shader.vertexShader = vs.replace(stock, mine).replace("void main() {", "void main() {\n	vBt0 = vec4( 1.0, 0.0, 0.0, 0.0 ); vBt1 = vec4( 0.0, 1.0, 0.0, 0.0 ); vBt2 = vec4( 0.0, 0.0, 1.0, 0.0 ); vBtK = 0.0;").replace("#include <common>", `#include <common>${pars}#ifdef USE_BATCHING_COLOR\nuniform vec4 uBiomeP[${NB * 3}];\nuniform float uBiomePK[${NB}];\n#endif\n`);
			const apply = "\ndiffuseColor.rgb = biomeTint( diffuseColor.rgb, vBt0, vBt1, vBt2, vBtK );\n";
			let fs = shader.fragmentShader.replace("#include <common>", "#include <common>" + pars + BIOME_TINT_GLSL);
			const anchor = "vec3 paperAN = abs( vPaperNrm );";
			fs = fs.includes(anchor) ? fs.replace(anchor, apply + anchor) : fs.replace("#include <color_fragment>", "#include <color_fragment>" + apply);
			shader.fragmentShader = fs;
		};
		m.customProgramCacheKey = () => (prevKey ? prevKey.call(m) : "") + "|biome-tint-v2";
		m.needsUpdate = true;
	}
	function specFor(material, geos) {
		const spec = {
			position: 3,
			normal: 3
		};
		for (const g of geos) for (const name in g.attributes) {
			if (name === "position" || name === "normal") continue;
			const a = g.attributes[name];
			spec[name] = Math.max(spec[name] || 0, a.itemSize);
		}
		if (material.vertexColors && !spec.color) spec.color = 3;
		return spec;
	}
	function createBatch(material, geos) {
		const spec = specFor(material, geos);
		let verts = 0;
		let indices = 0;
		for (const g of geos) {
			verts += g.getAttribute("position").count;
			indices += g.getIndex() ? g.getIndex().count : g.getAttribute("position").count;
		}
		const mesh = new BatchedMesh(1024, Math.max(verts, 64) + 256, Math.max(indices, 64) + 512, material);
		mesh.name = "tiles:" + (material.name || material.uuid.slice(0, 8));
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		mesh.sortObjects = false;
		mesh.perObjectFrustumCulled = true;
		mesh.frustumCulled = false;
		const b = {
			mesh,
			material,
			geoIds: /* @__PURE__ */ new Map(),
			spec,
			verts: Math.max(verts, 64) + 256,
			indices: Math.max(indices, 64) + 512,
			usedV: 0,
			usedI: 0,
			instances: 0,
			tinted: TINT && !isGlow(material)
		};
		if (b.tinted) tintMaterial(material);
		batches.set(material.uuid, b);
		batchList.push(b);
		batchRoot.add(mesh);
		for (const g of geos) addGeometry(b, g);
		return b;
	}
	function addGeometry(b, geometry) {
		let id = b.geoIds.get(geometry.uuid);
		if (id !== void 0) return id;
		const ng = normaliseGeometry(geometry, b.spec);
		const nv = ng.getAttribute("position").count;
		const ni = ng.getIndex().count;
		if (b.usedV + nv > b.verts || b.usedI + ni > b.indices) {
			b.verts = Math.max(b.verts * 2, b.usedV + nv);
			b.indices = Math.max(b.indices * 2, b.usedI + ni);
			b.mesh.setGeometrySize(b.verts, b.indices);
		}
		id = b.mesh.addGeometry(ng);
		b.usedV += nv;
		b.usedI += ni;
		b.geoIds.set(geometry.uuid, id);
		return id;
	}
	function addInstance(mesh) {
		const mat = matOf(mesh);
		let b = batches.get(mat.uuid);
		if (!b) b = createBatch(mat, [mesh.geometry]);
		for (const name in mesh.geometry.attributes) if (!(name in b.spec)) {
			if (!b.warned) {
				b.warned = true;
				console.warn("[world] geometry attribute not in batch layout, ignored:", name);
			}
		}
		const gid = addGeometry(b, mesh.geometry);
		if (b.instances + 1 > b.mesh.maxInstanceCount) b.mesh.setInstanceCount(b.mesh.maxInstanceCount * 2);
		const id = b.mesh.addInstance(gid);
		b.instances++;
		b.mesh.setVisibleAt(id, false);
		if (b.tinted || isGlow(b.material)) b.mesh.setColorAt(id, _tintCol.setRGB(1, 1, 1));
		return {
			b,
			id
		};
	}
	/** model id -> { sdf: Float32Array | null, deck: Float32Array | null, pond: boolean } */
	const modelData = /* @__PURE__ */ new Map();
	const PIECE_CLASS = (base) => /^(tree|flowers|haystack|scarecrow|hedge|beehive)/.test(base) ? 1 : /^fence/.test(base) ? 2 : /^(bush|tuft)/.test(base) ? 3 : 0;
	const LOW_RX = /(^|_)(log|boulder|rock|stone|crag|hedge|fence|hive|woodpile|crate|barrel|cart|well|fountain|bench|stall|sled|bed|stump|side_[ew]|ridge|dune|drift|ice|column|steps|pots|snowman|trough|bale|back_\d|front_\d|hay|tent|fire|pear|lamp|lantern|milestone|spring)/;
	const SOFT_RX = /^(bush|tuft|flowers?|reeds?|fern|mushroom|shroom|sheep|cow|chicken|hen|pig|dog|cat|pet|goat|horse|duck|bird|grass)/;
	const _dT = /* @__PURE__ */ new Float32Array(1681);
	const _dL = /* @__PURE__ */ new Float32Array(1681);
	const _dK = /* @__PURE__ */ new Float32Array(1681);
	const _K = /* @__PURE__ */ new Uint8Array(1681);
	const _open = /* @__PURE__ */ new Uint8Array(1681);
	const _stack = /* @__PURE__ */ new Int32Array(1681);
	/** Two-pass chamfer distance (world units) to the cells of `occ` carrying `bit`. */
	function chamfer(occ, bit, d, outside) {
		const BIG = 1e3;
		const s1 = SDF_STEP;
		const s2 = SDF_STEP * Math.SQRT2;
		const OUT = outside === true ? 0 : BIG;
		for (let i = 0; i < d.length; i++) d[i] = occ[i] & bit ? 0 : BIG;
		const at = (x, y) => x < 0 || y < 0 || x >= SDF_N || y >= SDF_N ? OUT : d[y * SDF_N + x];
		for (let y = 0; y < SDF_N; y++) for (let x = 0; x < SDF_N; x++) {
			const i = y * SDF_N + x;
			d[i] = Math.min(d[i], at(x - 1, y) + s1, at(x, y - 1) + s1, at(x - 1, y - 1) + s2, at(x + 1, y - 1) + s2);
		}
		for (let y = 40; y >= 0; y--) for (let x = 40; x >= 0; x--) {
			const i = y * SDF_N + x;
			d[i] = Math.min(d[i], at(x + 1, y) + s1, at(x, y + 1) + s1, at(x + 1, y + 1) + s2, at(x - 1, y + 1) + s2);
		}
	}
	/** Marks (as tall-occupied) every open cell that cannot be reached from the tile border: hollow buildings, prop rings. */
	function fillEnclosed(occ, bitT, padT, padL, kind) {
		let n = 0;
		let filled = 0;
		const onPath = W.blockerPadding - W.pathPadding;
		for (let i = 0; i < _open.length; i++) {
			const k = kind[i];
			_open[i] = k === 3 ? 0 : k === 2 ? 1 : k === 1 ? Math.min(_dT[i] - W.blockerPadding, _dL[i] - padL) + onPath > 0 ? 1 : 0 : _dT[i] > padT && _dL[i] > padL && _K[i] === 0 ? 1 : 0;
		}
		const push = (i) => {
			if (_open[i] === 1) {
				_open[i] = 2;
				_stack[n++] = i;
			}
		};
		for (let k = 0; k < SDF_N; k++) {
			push(k);
			push(1640 + k);
			push(k * SDF_N);
			push(k * SDF_N + SDF_N - 1);
		}
		while (n > 0) {
			const i = _stack[--n];
			const x = i % SDF_N;
			const y = i / SDF_N | 0;
			if (x > 0) push(i - 1);
			if (x < 40) push(i + 1);
			if (y > 0) push(i - SDF_N);
			if (y < 40) push(i + SDF_N);
		}
		for (let i = 0; i < _open.length; i++) if (_open[i] === 1) {
			occ[i] |= bitT;
			filled++;
		}
		return filled;
	}
	/**
	* Clearance field of one occupancy variant: min(distance to tall - blockerPadding, distance to low - lowBlockerPadding);
	* > 0 = the feet may stand there. Interiors (cells not reachable from the tile border) are solid.
	*/
	function buildField(occ, bitT, bitL, kind) {
		const padT = W.blockerPadding;
		const padL = W.lowBlockerPadding;
		_K.fill(0);
		const cr = W.closeRadius || 0;
		if (cr > 0) {
			chamfer(occ, bitT | bitL, _dK);
			for (let i = 0; i < _open.length; i++) _open[i] = _dK[i] <= cr ? 0 : 1;
			chamfer(_open, 1, _dT, true);
			for (let i = 0; i < _K.length; i++) _K[i] = _dT[i] > cr + 1e-4 && kind[i] === 0 && !(occ[i] & (bitT | bitL)) ? 1 : 0;
		}
		chamfer(_K, 1, _dK);
		chamfer(occ, bitT, _dT);
		chamfer(occ, bitL, _dL);
		if (W.fillEnclosed !== false) {
			if (fillEnclosed(occ, bitT, Math.max(padT, W.fillPadding), padL, kind) > 0) chamfer(occ, bitT, _dT);
			if (fillEnclosed(occ, bitT, padT, padL, kind) > 0) chamfer(occ, bitT, _dT);
		}
		const f = /* @__PURE__ */ new Float32Array(1681);
		for (let i = 0; i < f.length; i++) f[i] = Math.min(_dT[i] - padT, _dL[i] - padL, _dK[i] - W.closePadding);
		return f;
	}
	function analyse(model, parity = 0) {
		const md = {
			sdf: null,
			sdfDry: null,
			sdfDryNF: null,
			deck: null,
			pond: model === "pond",
			viewDep: false,
			odd: null,
			pivots: null,
			houseS: 1
		};
		if (parity === 0) modelData.set(model, md);
		let root = null;
		try {
			root = assets.getTilePrototype(model).clone(true);
		} catch {
			return md;
		}
		root.position.set(0, 0, 0);
		root.rotation.set(0, 0, 0);
		root.scale.set(1, 1, 1);
		root.updateMatrixWorld(true);
		const s = (MODELS[model] || MODELS["meadow"]).sockets;
		const isBridge = s.n === "path" && s.s === "path" && (s.e === "river" || s.w === "river");
		const occ = /* @__PURE__ */ new Uint8Array(1681);
		let any = false;
		const generic = !OWN_ART.has(model);
		/** slot-together props (tree + tree_xf + tree_xb ...): base name -> { cells, bits, cross } for the hull fill below */
		const hulls = /* @__PURE__ */ new Map();
		const deck = isBridge ? new Float32Array(SDF_N).fill(-1) : null;
		const lo = W.blockBandLo;
		const hi = W.blockBandHi;
		const box = new Box3();
		const list = [];
		root.traverse((o) => {
			if (o.isMesh && o.geometry && !isBaseMesh(o)) list.push(o);
		});
		const sp = W.cards && W.cards.enabled !== false && W.cards.collide !== false ? cardSpecs(model, root, list) : null;
		if (sp !== null) {
			md.houseS = sp.houseS || 1;
			md.pivots = [...sp.pivots.values()].filter(Boolean);
		}
		const fx = new Matrix4();
		root.traverse((o) => {
			if (!o.isMesh || !o.geometry || isBaseMesh(o)) return;
			const pos = o.geometry.getAttribute("position");
			if (!pos) return;
			const li = list.indexOf(o);
			fx.copy(o.matrixWorld);
			const turned = sp !== null && staticFix(sp, li, parity);
			if (turned) fx.premultiply(_cm);
			box.setFromBufferAttribute(pos).applyMatrix4(fx);
			let pc = 0;
			let lowName = false;
			let soft = false;
			let first = true;
			let hull = null;
			for (let a = o; a && a !== root; a = a.parent) {
				const raw = String(a.name || "").replace(/^.*__/, "");
				const base = raw.replace(/_x[bf]$/, "");
				if (!base) continue;
				if (!pc) pc = PIECE_CLASS(base);
				if (first) {
					soft = SOFT_RX.test(base);
					first = false;
					hull = hulls.get(base);
					if (!hull) hulls.set(base, hull = {
						cells: /* @__PURE__ */ new Set(),
						bits: 0,
						cross: false
					});
					if (raw !== base) hull.cross = true;
				}
				if (LOW_RX.test(base)) lowName = true;
			}
			const top = box.max.y;
			const isTall = top >= W.blockMinHeight && pc !== 3 && !(soft && top < W.blockMinHeight + .25);
			const isLow = !isTall && !soft && pc !== 3 && lowName && top >= W.lowBlockMinHeight;
			const tall = (isTall || isLow) && !(sp !== null && sp.thin[li] === 1);
			if (tall && turned && sp.cardJ[li] < 50) md.viewDep = true;
			let bits = 0;
			if (tall) {
				bits = 1;
				if (generic && pc !== 1) {
					bits |= 2;
					if (pc !== 2) bits |= 4;
				}
				if (!generic) bits = 7;
				if (isLow) bits <<= 3;
			}
			if (W.debugPieces !== false) (md.pieces || (md.pieces = [])).push([
				o.name,
				+top.toFixed(2),
				isTall ? "T" : isLow ? "L" : "-"
			]);
			if (!tall && !deck) return;
			const idx = o.geometry.getIndex();
			const tris = (idx ? idx.count : pos.count) / 3;
			for (let t = 0; t < tris; t++) {
				const i0 = idx ? idx.getX(t * 3) : t * 3;
				const i1 = idx ? idx.getX(t * 3 + 1) : t * 3 + 1;
				const i2 = idx ? idx.getX(t * 3 + 2) : t * 3 + 2;
				_a.fromBufferAttribute(pos, i0).applyMatrix4(fx);
				_b.fromBufferAttribute(pos, i1).applyMatrix4(fx);
				_c$1.fromBufferAttribute(pos, i2).applyMatrix4(fx);
				const ymin = Math.min(_a.y, _b.y, _c$1.y);
				const ymax = Math.max(_a.y, _b.y, _c$1.y);
				const inBand = tall && ymax >= lo && ymin <= hi;
				let deckTri = false;
				if (deck && ymax > .03) {
					_v.subVectors(_b, _a).cross(_c$1.clone().sub(_a));
					const len = _v.length();
					deckTri = len > 1e-9 && Math.abs(_v.y) / len > .6;
				}
				if (!inBand && !deckTri) continue;
				const e = Math.max(_a.distanceTo(_b), _b.distanceTo(_c$1), _c$1.distanceTo(_a));
				const n = Math.min(160, Math.max(1, Math.ceil(e / .02)));
				for (let i = 0; i <= n; i++) for (let j = 0; j <= n - i; j++) {
					const u = i / n;
					const w = j / n;
					const x = _a.x + (_b.x - _a.x) * u + (_c$1.x - _a.x) * w;
					const y = _a.y + (_b.y - _a.y) * u + (_c$1.y - _a.y) * w;
					const z = _a.z + (_b.z - _a.z) * u + (_c$1.z - _a.z) * w;
					if (inBand && y >= lo && y <= hi && Math.abs(x) <= HALF && Math.abs(z) <= HALF && !(deck && Math.abs(x) <= W.deckClearHalf)) {
						const ci = Math.round((z + HALF) / SDF_STEP) * SDF_N + Math.round((x + HALF) / SDF_STEP);
						occ[ci] |= bits;
						if (hull !== null) {
							hull.cells.add(ci);
							hull.bits |= bits;
						}
						any = true;
					}
					if (deckTri && Math.abs(x) <= .16 && Math.abs(z) <= HALF && y < .7) {
						const k = Math.round((z + HALF) / SDF_STEP);
						if (y > deck[k]) deck[k] = y;
					}
				}
			}
		});
		if (any) {
			const kind = /* @__PURE__ */ new Uint8Array(1681);
			const pd = W.ponds && W.ponds[model];
			for (let zi = 0; zi < SDF_N; zi++) for (let xi = 0; xi < SDF_N; xi++) {
				const x = xi * SDF_STEP - HALF;
				const z = zi * SDF_STEP - HALF;
				const onP = onKind(s, "path", x, z, PW);
				const onR = onKind(s, "river", x, z, RW);
				let k = onP && onR ? 2 : onR ? 3 : onP ? 1 : 0;
				if (k === 0 && model === "pond" && x * x + z * z < (W.pondRadius + W.waterPadding) * (W.pondRadius + W.waterPadding)) k = 3;
				if (k === 0 && pd) {
					const pu = x - pd[0];
					const pv = z - pd[1];
					const pr = pd[2] + W.waterPadding;
					if (pu * pu + pv * pv < pr * pr) k = 3;
				}
				kind[zi * SDF_N + xi] = k;
			}
			if (W.hullFill !== false) for (const h of hulls.values()) {
				if (!h.cross || h.cells.size < 3) continue;
				const pts = [...h.cells].map((c) => [c % SDF_N, c / SDF_N | 0]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
				const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
				const lower = [];
				const upper = [];
				for (const p of pts) {
					while (lower.length >= 2 && cr(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
					lower.push(p);
				}
				for (let i = pts.length - 1; i >= 0; i--) {
					const p = pts[i];
					while (upper.length >= 2 && cr(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
					upper.push(p);
				}
				const poly = lower.slice(0, -1).concat(upper.slice(0, -1));
				if (poly.length < 3) continue;
				let x0 = SDF_N;
				let x1 = 0;
				let z0 = SDF_N;
				let z1 = 0;
				for (const p of poly) {
					if (p[0] < x0) x0 = p[0];
					if (p[0] > x1) x1 = p[0];
					if (p[1] < z0) z0 = p[1];
					if (p[1] > z1) z1 = p[1];
				}
				if ((x1 - x0) * SDF_STEP > W.hullMaxSize || (z1 - z0) * SDF_STEP > W.hullMaxSize) continue;
				for (let zi = z0; zi <= z1; zi++) for (let xi = x0; xi <= x1; xi++) {
					if (kind[zi * SDF_N + xi] !== 0) continue;
					let inside = true;
					for (let k = 0; k < poly.length && inside; k++) if (cr(poly[k], poly[(k + 1) % poly.length], [xi, zi]) < 0) inside = false;
					if (inside) occ[zi * SDF_N + xi] |= h.bits;
				}
			}
			md.sdf = buildField(occ, 1, 8, kind);
			let dry = false;
			let nf = false;
			for (let i = 0; i < occ.length; i++) {
				const o = occ[i];
				if ((o & 1) !== 0 !== ((o & 2) !== 0) || (o & 8) !== 0 !== ((o & 16) !== 0)) dry = true;
				if ((o & 2) !== 0 !== ((o & 4) !== 0) || (o & 16) !== 0 !== ((o & 32) !== 0)) nf = true;
			}
			md.sdfDry = dry ? buildField(occ, 2, 16, kind) : md.sdf;
			md.sdfDryNF = nf ? buildField(occ, 4, 32, kind) : md.sdfDry;
		}
		if (deck) {
			let has = false;
			for (let k = 0; k < SDF_N; k++) if (deck[k] > .03) has = true;
			const p = new Float32Array(SDF_N);
			if (has) {
				let last = -1;
				let lastV = 0;
				for (let k = 0; k <= SDF_N; k++) {
					const v = k === SDF_N ? 0 : deck[k];
					if (k === SDF_N || v >= 0) {
						for (let q = last + 1; q < k; q++) p[q] = lastV + (v - lastV) * ((q - last) / (k - last));
						if (k < SDF_N) p[k] = v;
						last = k;
						lastV = v;
					}
				}
			} else if (W.deckFallbackHeight > 0) for (let k = 0; k < SDF_N; k++) {
				const v = k / 40 * 2 - 1;
				p[k] = W.deckFallbackHeight * Math.max(0, Math.cos(v * Math.PI * .62));
			}
			const tmp = new Float32Array(SDF_N);
			for (let k = 0; k < SDF_N; k++) {
				const v = Math.abs(k / 40 * 2 - 1);
				p[k] *= 1 - MathUtils.smoothstep(v, .72, .97);
			}
			for (let pass = 0; pass < 3; pass++) {
				for (let k = 0; k < SDF_N; k++) tmp[k] = (p[Math.max(0, k - 1)] + p[k] * 2 + p[Math.min(40, k + 1)]) / 4;
				p.set(tmp);
			}
			p[0] = p[40] = 0;
			const maxStep = W.deckMaxSlope * SDF_STEP;
			for (let k = 1; k < SDF_N; k++) if (p[k] > p[k - 1] + maxStep) p[k] = p[k - 1] + maxStep;
			for (let k = 39; k >= 0; k--) if (p[k] > p[k + 1] + maxStep) p[k] = p[k + 1] + maxStep;
			let peak = 0;
			for (let k = 0; k < SDF_N; k++) peak = Math.max(peak, p[k]);
			md.deck = peak > .01 ? p : null;
		}
		return md;
	}
	const dataFor = (model) => modelData.get(model) || analyse(model);
	const cellCache = new Array(4096).fill(null);
	function cellAt(cx, cz) {
		const i = (cz & CMASK) << 6 | cx & CMASK;
		const c = cellCache[i];
		if (c !== null && c.x === cx && c.z === cz) return c;
		const n = wfc.get(cx, cz);
		cellCache[i] = n;
		return n;
	}
	const grid = new Array(1024).fill(null);
	const activeList = [];
	const pool = /* @__PURE__ */ new Map();
	let pooledCount = 0;
	let created = 0;
	function lookup(cx, cz) {
		const r = grid[(cz & GMASK) << 5 | cx & GMASK];
		return r !== null && r.cx === cx && r.cz === cz ? r : null;
	}
	function createRecord(model) {
		const g = assets.getTilePrototype(model).clone(true);
		g.matrixAutoUpdate = true;
		const info = { tileId: model };
		if (SPIN_RX !== null) {
			const hits = [];
			g.traverse((o) => {
				if (renderable(o) && spinSplit(o)) hits.push(o);
			});
			for (const o of hits) {
				const sp = spinSplit(o);
				o.geometry = sp.body;
				const sail = new Mesh(sp.part, o.material);
				sail.name = o.name + "_spin";
				sail.userData.spin = true;
				sail.position.copy(sp.hub);
				sail.castShadow = o.castShadow;
				sail.receiveShadow = o.receiveShadow;
				o.add(sail);
				sail.updateMatrixWorld(true);
			}
		}
		let dims = null;
		if (MR !== null) {
			dims = /* @__PURE__ */ new Map();
			g.updateMatrixWorld(true);
			g.traverse((o) => {
				if (!renderable(o)) return;
				let top = o;
				while (top.parent && top.parent !== g) top = top.parent;
				if (top.parent !== g) return;
				if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
				const bb = o.geometry.boundingBox;
				const te = top.matrixWorld.elements;
				let d = dims.get(top);
				if (!d) dims.set(top, d = [0, 0]);
				for (let q = 0; q < 8; q++) {
					_v.set(q & 1 ? bb.max.x : bb.min.x, q & 2 ? bb.max.y : bb.min.y, q & 4 ? bb.max.z : bb.min.z).applyMatrix4(o.matrixWorld);
					if (_v.y - te[13] > d[0]) d[0] = _v.y - te[13];
					const w = hypot2$3(_v.x - te[12], _v.z - te[14]);
					if (w > d[1]) d[1] = w;
				}
			});
		}
		const fold = createFoldInstance(g, info);
		const meshes = [];
		const inst = [];
		g.traverse((o) => {
			if (renderable(o) && o.visible !== false) {
				meshes.push(o);
				inst.push(addInstance(o));
			}
		});
		const swayIdx = [];
		const sway = fold.sway || [];
		for (let i = 0; i < meshes.length; i++) for (let a = meshes[i]; a && a !== g; a = a.parent) {
			let hit = false;
			for (let k = 0; k < sway.length; k++) if (sway[k].node === a) hit = true;
			if (hit) {
				swayIdx.push(i);
				break;
			}
		}
		let spins = false;
		for (let k = 0; k < sway.length; k++) if (sway[k].spin !== null) spins = true;
		created++;
		let cls = null;
		let bushy = null;
		let keep = null;
		if (!OWN_ART.has(model)) {
			cls = new Uint8Array(meshes.length);
			bushy = new Uint8Array(meshes.length);
			keep = new Uint8Array(meshes.length);
			const groups = [];
			for (let i = 0; i < meshes.length; i++) {
				let c = 0;
				let base = "";
				for (let a = meshes[i]; a && a !== g && !c; a = a.parent) {
					base = String(a.name || "").replace(/^.*__/, "").replace(/_x[bf]$/, "");
					c = PIECE_CLASS(base);
				}
				if (KEEP_TINT_RX.test(base) || KEEP_TINT_RX.test(String(meshes[i].name || "").replace(/^.*__/, ""))) keep[i] = 1;
				if (!c) continue;
				if (c === 3 && /^bush/.test(base)) bushy[i] = 1;
				if (model === "meadow" && /^haystack/.test(base) || model === "meadow_flowers" && /^beehive/.test(base)) bushy[i] = 2;
				let gi = groups.indexOf(base);
				if (gi < 0) {
					gi = groups.length;
					groups.push(base);
				}
				cls[i] = c | (gi & 31) << 2;
			}
		}
		const sp = cardSpecs(model, g, meshes);
		let room = null;
		let roomH = null;
		let roomW = null;
		if (dims !== null && sp.card !== null) {
			room = new Float32Array(meshes.length);
			roomH = new Float32Array(meshes.length);
			roomW = new Float32Array(meshes.length);
			for (let i = 0; i < meshes.length; i++) {
				const d = sp.card[i] !== null ? dims.get(sp.card[i]) : void 0;
				if (d) {
					roomH[i] = d[0];
					roomW[i] = d[1];
				}
			}
		}
		return {
			card: sp.card,
			cardS: sp.cardS,
			cardJ: sp.cardJ,
			cardP: sp.cardP,
			thin: sp.thin,
			thinAny: sp.thinAny,
			room,
			roomH,
			roomW,
			roomOn: false,
			cls,
			bushy,
			keep,
			hide: null,
			key: "",
			cx: 0,
			cz: 0,
			cell: null,
			group: g,
			fold,
			info,
			model,
			meshes,
			inst,
			shown: false,
			pending: false,
			guard: false,
			held: 0,
			timer: 0,
			dirty: false,
			index: -1,
			flipAt: -1e9,
			biome: 0,
			swayIdx: Int16Array.from(swayIdx),
			spins,
			wind: 1,
			cy: 1,
			sy: 0
		};
	}
	/**
	* What the gold pass does to each mesh of a tile once it stands - shared by the drawn instances, the walk field and
	* the scraps' open-ground test, so they agree. card[i] = the top flap the mesh rides on (null = untouched), cardS =
	* scale, cardJ < 50: faces the camera (+ jitter) / >= 100: crossed cards / 99: scale only / 200: house (pivot cardP[i]);
	* thin[i] = 1: a soft filler card that never stands (fixed per model, so the page print leaves it out too).
	*/
	function cardSpecs(model, g, meshes) {
		const card = new Array(meshes.length).fill(null);
		const cardS = new Float32Array(meshes.length);
		const cardJ = new Float32Array(meshes.length);
		const thin = new Uint8Array(meshes.length);
		let thinAny = false;
		let anyCard = false;
		let cardP = null;
		const housePivots = /* @__PURE__ */ new Map();
		const houseS = W.cards ? (/^(village|village_b|snow_hamlet)$/.test(model) ? W.cards.houseRow : W.cards.house) || 0 : 0;
		if (W.cards && W.cards.enabled !== false) for (let i = 0; i < meshes.length; i++) {
			let top = meshes[i];
			while (top.parent && top.parent !== g) top = top.parent;
			if (top.parent !== g) continue;
			const nm = String(top.name || "").replace(/^.*__/, "");
			let sc = 0;
			let face = false;
			let cross = false;
			if (isThinned(model, nm)) {
				thin[i] = 1;
				thinAny = true;
			}
			if (CROSS_RX.test(nm) && top.children.some((c) => /_x[bf]$/.test(c.name || ""))) {
				cross = true;
				sc = TREE_RX.test(nm) ? W.cards.tree : 1;
			} else if (CARD_RX.test(nm)) {
				face = true;
				sc = /^reeds/.test(nm) ? W.cards.reeds : /^(bush|snowbush|thorn)/.test(nm) ? W.cards.bush : /^(flowers|desert_flowers|tuft|fern|mushrooms)/.test(nm) ? W.cards.small : W.cards.prop;
			} else if (TREE_RX.test(nm)) sc = W.cards.tree;
			if (!sc && houseS > 0 && houseS !== 1) {
				const hm = HOUSE_RX.exec(nm);
				if (hm) {
					let pv = housePivots.get(hm[1]);
					if (pv === void 0) {
						let fr = null;
						let bk = null;
						for (const c of g.children) {
							const cn = String(c.name || "").replace(/^.*__/, "");
							if (cn === hm[1] + "_front") fr = c;
							else if (cn === hm[1] + "_back") bk = c;
						}
						pv = fr && bk ? new Vector3().addVectors(fr.position, bk.position).multiplyScalar(.5).setY(0) : null;
						housePivots.set(hm[1], pv);
					}
					if (pv) {
						card[i] = top;
						cardS[i] = houseS;
						cardJ[i] = 200;
						(cardP || (cardP = new Array(meshes.length).fill(null)))[i] = pv;
						anyCard = true;
					}
				}
				continue;
			}
			if (!sc || !face && !cross && sc === 1) continue;
			card[i] = top;
			cardS[i] = sc;
			anyCard = true;
			const jit = (hashStr(nm) % 1e3 / 1e3 - .5) * 2 * (W.cards.jitterDeg || 0) * Math.PI / 180;
			cardJ[i] = face ? jit : cross ? 100 + jit * .6 : 99;
		}
		return {
			card: anyCard ? card : null,
			cardS,
			cardJ,
			cardP,
			thin,
			thinAny,
			pivots: housePivots,
			houseS
		};
	}
	const CARD_RX = /^(bush|flowers|tuft|rock|fern|mushrooms|desert_flowers|thorn|snowbush|reeds|stump|pebble|stone_[a-d](_|$)|ice_rock|mossy_boulder|barrel|pots|crates|hay|hives|beehive|woodpile|sled|snowman|cart|bench|sign(_|$)|guidepost|scarecrow|picnic|shroom_c|well|fence$|fence(?:_(?:l|r|ne|yard_[ab]))?_0$)/;
	const TREE_RX = /^(tree|birch|pear)/;
	const HOUSE_RX = /^((?:house|cottage|cabin|manor)(?:_[a-z])?)_(?:front|back|roof_[bf]|wall_[lr]|chim|chim_lid|chim_x)$/;
	const _pv = new Vector3();
	const CROSS_RX = /^(tree|birch|pear|pine|cactus|palm|dead_tree|shroom|column)/;
	const MR = W.makeRoom && W.makeRoom.enabled !== false && W.cards && W.cards.enabled !== false ? W.makeRoom : null;
	const MR_LEAN = MR !== null ? (MR.leanDeg ?? 50) * Math.PI / 180 : 0;
	const view = {
		rx: 1,
		rz: 0
	};
	const _cm = new Matrix4();
	/**
	* fixer (gold pass): `_m` (world matrix of instance i) gets a turn about the vertical through its flap's hinge origin so
	* the card faces the camera (hinge axis parallel to the camera's right vector, +- a seeded jitter), and a scale.
	* Both fade in with the uprightness of the flap, so a card still rises out of its own flat print.
	*/
	/** _cm = turn th about the vertical through the hinge origin of a flap (matrix elements ne) and scale s: T(p) RotY(th) S(s) T(-p). */
	function turnMat(ne, th, s) {
		const c = Math.cos(th) * s;
		const sn = Math.sin(th) * s;
		const px = ne[12];
		const py = ne[13];
		const pz = ne[14];
		_cm.set(c, 0, sn, px - c * px - sn * pz, 0, s, 0, py - s * py, -sn, 0, c, pz + sn * px - c * pz, 0, 0, 0, 1);
	}
	/** Full turn of a card (mode j, see cardSpecs) whose flap has matrix elements ne, for a view whose right vector stands at angle va. */
	function cardTurn(ne, j, va) {
		if (j < 50) {
			const th = Math.atan2(ne[2], ne[0]) - va + j;
			return th - Math.PI * Math.round(th / Math.PI);
		}
		if (j >= 99.5) {
			const th = Math.atan2(ne[2], ne[0]) - va + (W.cards.crossDeg ?? 45) * Math.PI / 180 + (j - 100);
			return th - Math.PI / 2 * Math.round(th / (Math.PI / 2));
		}
		return 0;
	}
	/**
	* shortfall pass: _cm = the same correction for a tile at rest in TILE space (rot 0), fully upright, for the gameplay
	* camera (yaw 0). A camera-facing card then lies along world X: along tile x for even cell.rot, tile z for odd (parity).
	*/
	const _tm = new Matrix4();
	function staticFix(sp, i, parity) {
		if (sp.card === null || sp.card[i] === null) return false;
		const top = sp.card[i];
		const j = sp.cardJ[i];
		const s = sp.cardS[i];
		if (j > 150) {
			const p = sp.cardP[i];
			_cm.set(s, 0, 0, p.x - s * p.x, 0, s, 0, 0, 0, 0, s, p.z - s * p.z, 0, 0, 0, 1);
			return true;
		}
		const ne = _tm.compose(top.position, top.quaternion, top.scale).elements;
		turnMat(ne, cardTurn(ne, j, rotToY(parity)), s);
		return true;
	}
	const _ax = new Vector3();
	const _sv = new Vector3();
	const _sd = new Vector3();
	const _si = new Matrix4();
	function cardFix(rec, i) {
		const top = rec.card[i];
		const j = rec.cardJ[i];
		if (j > 150) {
			let kh = (rec.fold.progress - .2) / .7;
			if (!(kh > 0)) return;
			if (kh > 1) kh = 1;
			kh = kh * kh * (3 - 2 * kh);
			_pv.copy(rec.cardP[i]).applyMatrix4(rec.group.matrixWorld);
			const sh = 1 + (rec.cardS[i] - 1) * kh;
			_cm.set(sh, 0, 0, _pv.x - sh * _pv.x, 0, sh, 0, _pv.y - sh * _pv.y, 0, 0, sh, _pv.z - sh * _pv.z, 0, 0, 0, 1);
			_m$2.premultiply(_cm);
			return;
		}
		const ne = top.matrixWorld.elements;
		let k = (ne[5] / (Math.hypot(ne[4], ne[5], ne[6]) || 1) - .3) / .65;
		if (k <= 0) return;
		if (k > 1) k = 1;
		k = k * k * (3 - 2 * k);
		turnMat(ne, cardTurn(ne, j, Math.atan2(view.rz, view.rx)) * k, 1 + (rec.cardS[i] - 1) * k);
		_m$2.premultiply(_cm);
		if (rec.room !== null && rec.room[i] !== 0) {
			const r = Math.abs(rec.room[i]);
			_cm.makeRotationAxis(_ax.set(-view.rz, 0, view.rx), (rec.room[i] > 0 ? -1 : 1) * MR_LEAN * k * r * r * (3 - 2 * r));
			const e = _cm.elements;
			const px = ne[12];
			const py = ne[13];
			const pz = ne[14];
			e[12] = px - (e[0] * px + e[4] * py + e[8] * pz);
			e[13] = py - (e[1] * px + e[5] * py + e[9] * pz);
			e[14] = pz - (e[2] * px + e[6] * py + e[10] * pz);
			_m$2.premultiply(_cm);
		}
	}
	/** New matrices for the instances on swaying flaps only (the rest of the tile is untouched). */
	function writeSway(rec) {
		const sway = rec.fold.sway;
		for (let k = 0; k < sway.length; k++) sway[k].node.updateMatrixWorld(true);
		const ms = rec.meshes;
		const ix = rec.swayIdx;
		for (let j = 0; j < ix.length; j++) {
			const i = ix[j];
			_m$2.copy(ms[i].matrixWorld);
			if (rec.card !== null && rec.card[i] !== null) cardFix(rec, i);
			const e = _m$2.elements;
			e[12] -= origin.x;
			e[13] -= origin.y;
			e[14] -= origin.z;
			rec.inst[i].b.mesh.setMatrixAt(rec.inst[i].id, _m$2);
		}
	}
	function writeMatrices(rec) {
		rec.group.updateMatrixWorld(true);
		const ms = rec.meshes;
		for (let i = 0; i < ms.length; i++) {
			_m$2.copy(ms[i].matrixWorld);
			if (rec.card !== null && rec.card[i] !== null) cardFix(rec, i);
			const e = _m$2.elements;
			e[12] -= origin.x;
			e[13] -= origin.y;
			e[14] -= origin.z;
			rec.inst[i].b.mesh.setMatrixAt(rec.inst[i].id, _m$2);
		}
		rec.dirty = false;
	}
	function setShown(rec, on) {
		if (rec.shown === on) return;
		rec.shown = on;
		if (on) writeMatrices(rec);
		const hide = rec.hide;
		for (let i = 0; i < rec.inst.length; i++) rec.inst[i].b.mesh.setVisibleAt(rec.inst[i].id, on && !(hide && hide[i]));
		book.setHold(rec.cx, rec.cz, on);
		if (!on) book.setTwin(rec.cx, rec.cz, 1);
	}
	/**
	* fixer (biome pass): per-biome prop allowlist for the generic tiles (paths, rivers, meadow, rocks ...), whose pieces are
	* heartland art. Desert / snow drop the leafy trees, flowers, haystacks, scarecrows and hedges (desert also the picket
	* fences); outside heartland half of the small bush / tuft cards are dropped per cell (seeded) so they stop reading as
	* an even scatter. Heartland is untouched. Only the stand-up is hidden: the print on the page and the walk field stay.
	*/
	const KEEP_TINT_RX = /^(reeds?|rock|boulder|stone|crag|haystack|fence|roof|log|well|bridge|ramp|side_|post|lantern|sign)/;
	/** integrator: the meadow model carries a hay rick and meadow_flowers a beehive; each stands on about 4 of its cells in 10 so meadows stop repeating like wallpaper. */
	const hayHidden = (cx, cz) => (Math.imul(cx * 73856093 ^ cz * 19349663 ^ 1540483477, 2654435761) >>> 9) % 100 < (W.hayDrop ?? 60);
	function cullFor(rec, cell, cx, cz) {
		cullBiome(rec, cell, cx, cz);
		if (!rec.thinAny) return;
		const th = rec.thin;
		let hide = rec.hide;
		if (hide === null) {
			hide = rec.hideBuf || (rec.hideBuf = new Uint8Array(th.length));
			hide.fill(0);
		}
		for (let i = 0; i < th.length; i++) if (th[i] === 1) hide[i] = 1;
		rec.hide = hide;
	}
	function cullBiome(rec, cell, cx, cz) {
		const cls = rec.cls;
		const bi = cls && W.biomeCull !== false ? biomeIndexOf(cell) : 0;
		const noHay = cls && (rec.model === "meadow" || rec.model === "meadow_flowers") && W.biomeCull !== false && hayHidden(cx, cz);
		if (!bi) {
			if (!noHay) {
				rec.hide = null;
				return;
			}
			const hd = rec.hideBuf || (rec.hideBuf = new Uint8Array(cls.length));
			for (let i = 0; i < cls.length; i++) hd[i] = rec.bushy[i] === 2 ? 1 : 0;
			rec.hide = hd;
			return;
		}
		const name = BIOMES[bi];
		const dry = name === "desert" || name === "snow";
		let any = false;
		const hide = rec.hideBuf || (rec.hideBuf = new Uint8Array(cls.length));
		for (let i = 0; i < cls.length; i++) {
			const c = cls[i] & 3;
			let h = 0;
			if (c === 1) h = dry ? 1 : 0;
			else if (c === 2) h = name === "desert" ? 1 : 0;
			else if (c === 3) h = dry && rec.bushy[i] === 1 ? 1 : 0;
			if (noHay && rec.bushy[i] === 2) h = 1;
			hide[i] = h;
			if (h) any = true;
		}
		rec.hide = any ? hide : null;
	}
	function spawn(cx, cz) {
		const gi = (cz & GMASK) << 5 | cx & GMASK;
		if (grid[gi] !== null) despawn(grid[gi], true);
		const cell = cellAt(cx, cz);
		const list = pool.get(cell.model);
		let rec;
		if (list && list.length) {
			rec = list.pop();
			pooledCount--;
		} else rec = createRecord(cell.model);
		rec.cx = cx;
		rec.cz = cz;
		rec.cell = cell;
		rec.key = cx + "," + cz;
		rec.info.tileId = cell.tileId;
		rec.group.userData.tileId = cell.tileId;
		rec.group.position.set(cx * TILE_SIZE, 0, cz * TILE_SIZE);
		rec.group.rotation.y = rotToY(cell.rot);
		rec.cy = Math.cos(rec.group.rotation.y);
		rec.sy = Math.sin(rec.group.rotation.y);
		if (WIND_ON) {
			biomeWeights(wfc.seed, cx, cz, _bw);
			let s = 0;
			for (let i = 0; i < _bw.length; i++) s += _bw[i] * windStrength[i];
			rec.wind = s;
		}
		const bi = OWN_ART.has(rec.model) && W.biomeTintOwnArt !== true ? 0 : biomeIndexOf(cell);
		if (bi !== rec.biome) {
			rec.biome = bi;
			_tintCol.setRGB(1 + bi, 1, 1);
			const sel = rec.keep !== null && W.biomeTintKeep && W.biomeTintKeep[BIOMES[bi]] === true;
			for (let i = 0; i < rec.inst.length; i++) {
				if (!rec.inst[i].b.tinted) continue;
				if (sel && rec.keep[i] === 1) {
					_tintCol.setRGB(1, 1, 1);
					rec.inst[i].b.mesh.setColorAt(rec.inst[i].id, _tintCol);
					_tintCol.setRGB(1 + bi, 1, 1);
				} else rec.inst[i].b.mesh.setColorAt(rec.inst[i].id, _tintCol);
			}
		}
		cullFor(rec, cell, cx, cz);
		if (rec.room !== null) {
			rec.room.fill(0);
			rec.roomOn = false;
		}
		rec.fold.snap(0);
		rec.shown = false;
		rec.pending = false;
		rec.timer = 0;
		rec.dirty = true;
		rec.flipAt = -1e9;
		rec.index = activeList.length;
		activeList.push(rec);
		grid[gi] = rec;
		bus.emit("tile:spawn", {
			x: cx,
			z: cz,
			tileId: cell.tileId,
			rot: cell.rot
		});
		return rec;
	}
	function despawn(rec, force) {
		if (force && !rec.fold.settled) rec.fold.snap(0);
		setShown(rec, false);
		rec.pending = false;
		const gi = (rec.cz & GMASK) << 5 | rec.cx & GMASK;
		if (grid[gi] === rec) grid[gi] = null;
		const last = activeList.pop();
		if (last !== rec) {
			activeList[rec.index] = last;
			last.index = rec.index;
		}
		rec.index = -1;
		let list = pool.get(rec.model);
		if (!list) pool.set(rec.model, list = []);
		list.push(rec);
		pooledCount++;
		bus.emit("tile:despawn", {
			x: rec.cx,
			z: rec.cz,
			tileId: rec.cell.tileId
		});
	}
	function rise(rec) {
		rec.pending = false;
		setShown(rec, true);
		rec.flipAt = clock;
		rec.fold.setTarget(1, 0);
		bus.emit("tile:rise", {
			x: rec.cx,
			z: rec.cz,
			tileId: rec.cell.tileId
		});
	}
	const last = {
		x: 0,
		z: 0,
		px: 0,
		pz: 0,
		dx: 0,
		dz: -1,
		sx: 0,
		sz: -1,
		valid: false,
		fresh: false
	};
	let regionX = NaN;
	let regionZ = NaN;
	const NEAR = REVEAL_RADIUS * W.nearRadiusMul;
	const BACK_FOLD = W.foldBehind;
	const BACK_RISE = W.foldBehind - W.foldBehindHysteresis;
	let movingCount = 0;
	let reach = 0;
	let clock = 0;
	function twinFor(p) {
		const t = Math.min(1, Math.max(0, (p - .04) / .5));
		return 1 - t * t * (3 - 2 * t);
	}
	/** Camera right vector on the page changed (pose / clear-sight swing): the camera-facing cards are re-posed. */
	function syncView() {
		const L = state.listener;
		if (!L || !(Math.abs(L.rightX) + Math.abs(L.rightZ) > .5)) return;
		if (Math.abs(L.rightX - view.rx) + Math.abs(L.rightZ - view.rz) < .015) return;
		view.rx = L.rightX;
		view.rz = L.rightZ;
		for (let i = 0; i < activeList.length; i++) if (activeList[i].card !== null) activeList[i].dirty = true;
	}
	/**
	* shortfall pass (make room; the dotted see-through circle is off): a card whose hinge stands in the sight line between
	* the camera and the traveller, and tall enough to cover him from the knees up, eases over to one side (cardFix).
	* Only the gold-pass cards (trees, bushes, single props) take part; houses and other boxes stay as they are.
	*/
	function makeRoom(dt, snap) {
		if (MR === null || !last.valid) return;
		const tx = -view.rz;
		const tz = view.rx;
		const pitchNow = Math.max(18, Math.min(60, state.camPitch || (MR.pitchDeg ?? 42)));
		const tanP = Math.tan(pitchNow * Math.PI / 180);
		const k = snap ? 1 : 1 - Math.exp(-dt / (MR.ease || .22));
		const reach = Math.min(3.4, Math.max(MR.reach ?? 1.6, 1.15 / tanP)) + HALF;
		for (let n = 0; n < activeList.length; n++) {
			const rec = activeList[n];
			if (rec.room === null || !rec.shown) continue;
			const near = MR.enabled !== false && rec.fold.target === 1 && Math.abs(rec.cx * TILE_SIZE - last.px) < reach && Math.abs(rec.cz * TILE_SIZE - last.pz) < reach;
			if (!near && !rec.roomOn) continue;
			let on = false;
			const room = rec.room;
			for (let i = 0; i < room.length; i++) {
				const top = rec.card[i];
				if (top === null || rec.cardJ[i] > 150) continue;
				let want = 0;
				const cur = room[i];
				if (near && !(rec.hide !== null && rec.hide[i])) {
					const e = top.matrixWorld.elements;
					const dx = e[12] - last.px;
					const dz = e[14] - last.pz;
					const along = dx * tx + dz * tz;
					const side = dx * view.rx + dz * view.rz;
					const s = rec.cardS[i];
					if (along > (MR.minAhead ?? .05) && Math.abs(side) < rec.roomW[i] * s * (MR.width ?? .75) + (MR.side ?? .1) && rec.roomH[i] * s - along * tanP > (MR.cover ?? .3)) want = cur !== 0 ? cur > 0 ? 1 : -1 : side >= 0 ? 1 : -1;
				}
				if (cur === want) {
					if (want !== 0) on = true;
					continue;
				}
				let v = cur + (want - cur) * k;
				if (Math.abs(want - v) < .004) v = want;
				room[i] = v;
				rec.dirty = true;
				if (v !== 0) on = true;
			}
			rec.roomOn = on;
		}
	}
	function stream(dt, budget, instant) {
		{
			const wantReach = Math.max(0, Math.min(W.viewReachMax ?? 1.5, state.viewReach || 0));
			if (instant || last.fresh) reach = wantReach;
			else if (reach !== wantReach) {
				const st = dt * (W.viewReachRate ?? .85);
				reach += Math.max(-st, Math.min(st, wantReach - reach));
			}
		}
		const RV = REVEAL_RADIUS + reach;
		const NEARV = NEAR + reach;
		syncView();
		makeRoom(dt, instant || last.fresh);
		const tx = last.x / TILE_SIZE;
		const tz = last.z / TILE_SIZE;
		const fx = tx + last.dx * W.forwardBias;
		const fz = tz + last.dz * W.forwardBias;
		const c0x = Math.round(tx);
		const c0z = Math.round(tz);
		const lead = W.inkLead;
		const R = Math.ceil(RV + W.forwardBias + lead) + 1;
		if (c0x !== regionX || c0z !== regionZ) {
			regionX = c0x;
			regionZ = c0z;
			if (wfc.ensureRegion) wfc.ensureRegion(c0x, c0z, R + 1);
		}
		clock += dt;
		for (let cz = c0z - R; cz <= c0z + R; cz++) for (let cx = c0x - R; cx <= c0x + R; cx++) {
			const dT = hypot2$3(cx - tx, cz - tz);
			const dF = hypot2$3(cx - fx, cz - fz);
			if (dF >= RV + lead && dT >= NEARV + lead) continue;
			if (!book.cellTouchesPage(cx, cz)) continue;
			book.markInk(cx, cz);
			const back = -((cx - tx) * last.dx + (cz - tz) * last.dz);
			if ((dF < RV || dT < NEARV) && (instant || back < BACK_RISE)) {
				let rec = lookup(cx, cz);
				if (rec === null) {
					if (budget <= 0) continue;
					budget--;
					rec = spawn(cx, cz);
				}
				if (rec.shown) {
					if (rec.fold.target !== 1 && book.cellOnPage(cx, cz, 0) && (dT < W.reflipRadius || clock - rec.flipAt >= W.minFlipInterval)) {
						rec.flipAt = clock;
						rec.fold.setTarget(1, 0);
						bus.emit("tile:rise", {
							x: cx,
							z: cz,
							tileId: rec.cell.tileId
						});
					}
				} else if (!rec.pending) {
					rec.pending = true;
					rec.guard = !last.fresh && !instant;
					rec.held = 0;
					rec.timer = instant || dT < RV - .75 && !last.fresh ? 0 : dT * W.rippleDelay + (hash2f(cx, cz, 911) - .5) * 2 * W.rippleJitter;
					if (rec.timer < 0) rec.timer = 0;
				}
			}
		}
		let rises = 0;
		movingCount = 0;
		for (let i = activeList.length - 1; i >= 0; i--) {
			const rec = activeList[i];
			const dT = hypot2$3(rec.cx - tx, rec.cz - tz);
			const dF = hypot2$3(rec.cx - fx, rec.cz - fz);
			const back = -((rec.cx - tx) * last.dx + (rec.cz - tz) * last.dz);
			const want = (dF < RV || dT < NEARV) && back < BACK_FOLD;
			if (rec.pending) {
				if (!want) rec.pending = false;
				else if (book.cellOnPage(rec.cx, rec.cz, 0)) {
					if (instant) rise(rec);
					else if (book.inkReady(rec.cx, rec.cz)) {
						rec.timer -= dt;
						if (rec.timer <= 0 && rises < W.maxRisePerFrame) {
							if (rec.guard && rec.held < (W.riseHoldMax ?? 0) && Math.abs(last.px - rec.cx * TILE_SIZE) < HALF + .15 && Math.abs(last.pz - rec.cz * TILE_SIZE) < HALF + .15) rec.held += dt;
							else {
								rises++;
								rise(rec);
							}
						}
					}
				} else if (!instant && book.inkReady(rec.cx, rec.cz)) rec.timer -= dt;
			}
			const onPage = book.cellOnPage(rec.cx, rec.cz, W.pageHysteresis);
			if (rec.shown) {
				const fold = rec.fold;
				const behind = back >= BACK_FOLD && !instant;
				if (fold.target === 1 && (!onPage || !want && (behind || dT > FOLD_BACK_RADIUS + reach && dF >= RV + W.foldHysteresis) && (instant || clock - rec.flipAt >= W.minFlipInterval))) {
					rec.flipAt = clock;
					let delay = 0;
					if (behind && onPage) delay = Math.abs((rec.cx - tx) * last.dz - (rec.cz - tz) * last.dx) * W.foldBehindStagger + hash2f(rec.cx, rec.cz, 517) * W.rippleJitter;
					fold.setTarget(0, delay);
					bus.emit("tile:flat", {
						x: rec.cx,
						z: rec.cz,
						tileId: rec.cell.tileId
					});
				}
				const moving = !fold.settled;
				if (moving) {
					fold.update(dt);
					movingCount++;
				}
				if (WIND_ON && rec.spins && (moving || rec.dirty)) fold.applyWind(state.time, -1, .6 + .4 * rec.wind, rec.cy, rec.sy);
				if (moving || rec.dirty) {
					writeMatrices(rec);
					book.setTwin(rec.cx, rec.cz, twinFor(fold.progress));
				} else if (WIND_ON && fold.target === 1 && rec.swayIdx.length > 0 && dT < WIND.radius) {
					fold.applyWind(state.time, rec.wind, .6 + .4 * rec.wind, rec.cy, rec.sy);
					writeSway(rec);
				}
				if (fold.settled && fold.target === 0) setShown(rec, false);
			}
			if (!rec.shown && !rec.pending) despawn(rec, false);
			else if (dT > DESPAWN_RADIUS + 4) despawn(rec, true);
		}
	}
	function rebase() {
		const D = W.rebaseDistance;
		if (Math.abs(last.x - origin.x) <= D && Math.abs(last.z - origin.z) <= D) return;
		origin.set(Math.round(last.x / 64) * 64, 0, Math.round(last.z / 64) * 64);
		batchRoot.position.copy(origin);
		batchRoot.updateMatrixWorld(true);
		for (let i = 0; i < activeList.length; i++) if (activeList[i].shown) writeMatrices(activeList[i]);
	}
	const RW = RIVER_WIDTH / 2 + W.waterPadding;
	const PW = PATH_WIDTH / 2 + .05;
	let qU = 0;
	let qV = 0;
	function inStrip(dx, dz, dir, w) {
		if (dir === 0) return dx >= -w && dx <= w && dz <= w && dz >= -HALF;
		if (dir === 1) return dz >= -w && dz <= w && dx >= -w && dx <= HALF;
		if (dir === 2) return dx >= -w && dx <= w && dz >= -w && dz <= HALF;
		return dz >= -w && dz <= w && dx <= w && dx >= -HALF;
	}
	/** Is tile-centred (dx,dz) on the path/river network of a cell? Two sockets on ADJACENT edges are joined by a
	*  quarter-circle around their shared tile corner (as the tile art draws them); everything else runs to the centre. */
	function onKind(s, kind, dx, dz, w) {
		const n = s.n === kind;
		const e = s.e === kind;
		const so = s.s === kind;
		const we = s.w === kind;
		const count = (n ? 1 : 0) + (e ? 1 : 0) + (so ? 1 : 0) + (we ? 1 : 0);
		if (count === 0) return false;
		if (count === 2 && !(n && so) && !(e && we)) {
			const kx = e ? HALF : -HALF;
			const kz = n ? -HALF : HALF;
			const r = hypot2$3(dx - kx, dz - kz) - HALF;
			return r >= -w && r <= w;
		}
		return n && inStrip(dx, dz, 0, w) || e && inStrip(dx, dz, 1, w) || so && inStrip(dx, dz, 2, w) || we && inStrip(dx, dz, 3, w);
	}
	/** 0 grass, 1 path, 2 bridge, 3 water. Also leaves the tile-local point in qU/qV and the cell in qCell. */
	let qCell = null;
	function classify(x, z) {
		const cx = Math.round(x / TILE_SIZE);
		const cz = Math.round(z / TILE_SIZE);
		const cell = cellAt(cx, cz);
		qCell = cell;
		const dx = x - cx * TILE_SIZE;
		const dz = z - cz * TILE_SIZE;
		let u = dx;
		let v = dz;
		const rot = (cell.rot % 4 + 4) % 4;
		for (let i = 0; i < rot; i++) {
			const t = u;
			u = v;
			v = -t;
		}
		qU = u;
		qV = v;
		const s = cell.sockets;
		const onPath = onKind(s, "path", dx, dz, PW);
		const onRiver = onKind(s, "river", dx, dz, RW);
		if (onPath && onRiver) return 2;
		if (onRiver) return 3;
		if (onPath) return 1;
		if (cell.model === "pond" && dx * dx + dz * dz < (W.pondRadius + W.waterPadding) * (W.pondRadius + W.waterPadding)) return 3;
		const pd = W.ponds && W.ponds[cell.model];
		if (pd) {
			const pu = u - pd[0];
			const pv = v - pd[1];
			const pr = pd[2] + W.waterPadding;
			if (pu * pu + pv * pv < pr * pr) return 3;
		}
		return 0;
	}
	function sampleField(d, u, v) {
		const fx = (u + HALF) / SDF_STEP;
		const fz = (v + HALF) / SDF_STEP;
		let x0 = Math.floor(fx);
		let z0 = Math.floor(fz);
		if (x0 < 0) x0 = 0;
		else if (x0 > 39) x0 = 39;
		if (z0 < 0) z0 = 0;
		else if (z0 > 39) z0 = 39;
		const ax = Math.min(1, Math.max(0, fx - x0));
		const az = Math.min(1, Math.max(0, fz - z0));
		const i = z0 * SDF_N + x0;
		return (d[i] * (1 - ax) + d[i + 1] * ax) * (1 - az) + (d[i + SDF_N] * (1 - ax) + d[i + SDF_N + 1] * ax) * az;
	}
	/** The clearance field that matches what is VISIBLE in the cell's biome (props hidden by cullFor do not block). */
	function fieldFor(cell) {
		let md = dataFor(cell.model);
		if (md.viewDep && cell.rot & 1) md = md.odd || (md.odd = analyse(cell.model, 1));
		if (md.sdf === null || W.biomeCull === false) return md.sdf;
		if (cell.biome === "snow") return md.sdfDry;
		if (cell.biome === "desert") return md.sdfDryNF;
		if ((cell.model === "meadow" || cell.model === "meadow_flowers") && hayHidden(cell.x, cell.z)) return md.sdfDry;
		return md.sdf;
	}
	const FREE = 4;
	const PATH_FREE = CONFIG.player.radius + .01;
	/**
	* Signed room (world units) around a point: <= 0 = the feet cannot stand there, >= the traveller's radius = free to move.
	* Water is a small negative constant (bridge decks are free). On a path the blocker padding shrinks to pathPadding
	* and anything standable counts as free, so lanes that brush a lamp or a trunk stay open - but a path never leads
	* through a wall any more.
	*/
	function clearanceAt(x, z) {
		const s = classify(x, z);
		if (s === 3) return -.05;
		if (s === 2) return FREE;
		const f = fieldFor(qCell);
		if (f === null) return FREE;
		const c = sampleField(f, qU, qV);
		if (s === 1) {
			const v = c + (W.blockerPadding - W.pathPadding);
			return v > 0 ? v + PATH_FREE : v;
		}
		return c;
	}
	const SURFACES = [
		"grass",
		"path",
		"bridge",
		"water"
	];
	const api = {
		group,
		book,
		wfc,
		/** game-hook(lanterns): the live tile record of a cell (meshes + batch instances), or null. Read only. */
		tileRecord: lookup,
		/** Stream tiles around the traveller and advance every fold spring. */
		update(dt, travellerPos, moveDir) {
			const jump = !last.valid || hypot2$3(travellerPos.x - last.px, travellerPos.z - last.pz) > 1.5;
			last.px = travellerPos.x;
			last.pz = travellerPos.z;
			last.valid = true;
			const G = W.graceRadius || 0;
			const gx = travellerPos.x - last.x;
			const gz = travellerPos.z - last.z;
			const gl = hypot2$3(gx, gz);
			if (jump) {
				last.x = travellerPos.x;
				last.z = travellerPos.z;
				if (moveDir && hypot2$3(moveDir.x, moveDir.z) > 1e-4) {
					last.sx = moveDir.x;
					last.sz = moveDir.z;
					last.dx = moveDir.x;
					last.dz = moveDir.z;
				}
			} else if (gl > G) {
				if (G > 0) {
					const k = W.dirSmooth <= 0 ? 1 : 1 - Math.exp(-dt / W.dirSmooth);
					last.sx += (gx / gl - last.sx) * k;
					last.sz += (gz / gl - last.sz) * k;
					const l = hypot2$3(last.sx, last.sz);
					if (l > 1e-4) {
						last.dx = last.sx / l;
						last.dz = last.sz / l;
					}
					last.x = travellerPos.x - gx / gl * G;
					last.z = travellerPos.z - gz / gl * G;
				} else {
					last.x = travellerPos.x;
					last.z = travellerPos.z;
					if (moveDir) {
						const k = W.dirSmooth <= 0 ? 1 : 1 - Math.exp(-dt / W.dirSmooth);
						last.sx += (moveDir.x - last.sx) * k;
						last.sz += (moveDir.z - last.sz) * k;
						const l = hypot2$3(last.sx, last.sz);
						if (l > 1e-4) {
							last.dx = last.sx / l;
							last.dz = last.sz / l;
						}
					}
				}
			}
			last.fresh = jump;
			rebase();
			book.follow(travellerPos);
			if (api.railwayLayer) api.railwayLayer.update();
			stream(dt, jump ? Infinity : W.spawnBudget, false);
			if (jump) book.settle();
			else book.update(dt, travellerPos);
		},
		/** fixer (gold pass): re-pose the camera-facing cards for the current camera (state.listener) right now. */
		debugView() {
			return {
				rx: view.rx,
				rz: view.rz,
				lx: state.listener.rightX,
				lz: state.listener.rightZ,
				cards: activeList.filter((r) => r.card !== null).length,
				n: activeList.length
			};
		},
		/** checks: forget the cached walk fields (after a CONFIG.world change). */
		debugResetFields() {
			modelData.clear();
		},
		/** checks: bake layout of the page print (book.js debugBake). */
		get debugBake() {
			return book.debugBake;
		},
		/** checks: the DRAWN world matrix of instance i of a live record (fold pose + the gold-pass card / house fix). */
		drawnMatrix(rec, i, out) {
			_m$2.copy(rec.meshes[i].matrixWorld);
			if (rec.card !== null && rec.card[i] !== null) cardFix(rec, i);
			return out.copy(_m$2);
		},
		/** A point [x, y, z] of a tile model in authored tile space (rot 0), moved to where it is DRAWN (houses grow about their pivot). In place. */
		standPoint(model, p) {
			const md = dataFor(model);
			if (md.pivots === null || md.pivots.length === 0 || md.houseS === 1) return p;
			let best = md.pivots[0];
			let bd = 1e9;
			for (let i = 0; i < md.pivots.length; i++) {
				const d = hypot2$3(md.pivots[i].x - p[0], md.pivots[i].z - p[2]);
				if (d < bd) {
					bd = d;
					best = md.pivots[i];
				}
			}
			p[0] = best.x + (p[0] - best.x) * md.houseS;
			p[1] *= md.houseS;
			p[2] = best.z + (p[2] - best.z) * md.houseS;
			return p;
		},
		/** scraps: the stand spec of a prototype's meshes (cardSpecs) and its tile-space correction premultiplied onto `out` (false = untouched). */
		standSpecs(model, root, meshes) {
			return W.cards && W.cards.enabled !== false ? cardSpecs(model, root, meshes) : null;
		},
		standFix(sp, i, parity, out) {
			if (!staticFix(sp, i, parity)) return false;
			out.premultiply(_cm);
			return true;
		},
		/**
		* round 3 (camera sight assist): does a LARGE drawn piece (house wall / roof, tower, stall, dune ... - everything that
		* make-room cannot tip aside) stand on the segment from (ox, oy, oz) along the unit direction (dx, dy, dz) up to `far`?
		* Tested against each piece's box in its own flap space (thin slabs), as drawn. Allocation-free; a few dozen boxes.
		*/
		sightBlocked(ox, oy, oz, dx, dy, dz, far) {
			const tTop = dy > 1e-4 ? Math.min(far, (3.2 - oy) / dy) : far;
			if (!(tTop > 0)) return false;
			const ex = ox + dx * tTop;
			const ez = oz + dz * tTop;
			const sl = hypot2$3(ex - ox, ez - oz) || 1e-6;
			for (let n = 0; n < activeList.length; n++) {
				const rec = activeList[n];
				if (!rec.shown || rec.fold.target !== 1 || rec.fold.progress < .55) continue;
				const cxw = rec.cx * TILE_SIZE - ox;
				const czw = rec.cz * TILE_SIZE - oz;
				let u = (cxw * (ex - ox) + czw * (ez - oz)) / (sl * sl);
				if (u < 0) u = 0;
				else if (u > 1) u = 1;
				if (hypot2$3(cxw - (ex - ox) * u, czw - (ez - oz) * u) > HALF * 1.5 + .35) continue;
				const ms = rec.meshes;
				const hide = rec.hide;
				for (let i = 0; i < ms.length; i++) {
					if (hide !== null && hide[i]) continue;
					if (rec.card !== null && rec.card[i] !== null && rec.cardJ[i] <= 150) continue;
					const g = ms[i].geometry;
					if (!g) continue;
					if (g.boundingBox === null) g.computeBoundingBox();
					const bb = g.boundingBox;
					_m$2.copy(ms[i].matrixWorld);
					if (rec.card !== null && rec.card[i] !== null) cardFix(rec, i);
					const me = _m$2.elements;
					_sv.set(ox, oy, oz).applyMatrix4(_si.copy(_m$2).invert());
					_sd.set(dx, dy, dz).transformDirection(_si);
					const sc = Math.hypot(me[0], me[1], me[2]) || 1;
					let t0 = .08 / sc;
					let t1 = tTop / sc;
					let ok = true;
					for (let a = 0; a < 3 && ok; a++) {
						const o = a === 0 ? _sv.x : a === 1 ? _sv.y : _sv.z;
						const d = a === 0 ? _sd.x : a === 1 ? _sd.y : _sd.z;
						const lo = (a === 0 ? bb.min.x : a === 1 ? bb.min.y : bb.min.z) - .004;
						const hi = (a === 0 ? bb.max.x : a === 1 ? bb.max.y : bb.max.z) + .004;
						if (Math.abs(d) < 1e-7) {
							if (o < lo || o > hi) ok = false;
							continue;
						}
						let ta = (lo - o) / d;
						let tb = (hi - o) / d;
						if (ta > tb) {
							const q = ta;
							ta = tb;
							tb = q;
						}
						if (ta > t0) t0 = ta;
						if (tb < t1) t1 = tb;
						if (t0 > t1) ok = false;
					}
					if (!ok) continue;
					if (oy + dy * t0 * sc < .12 && oy + dy * t1 * sc < .12) continue;
					sight.last = ms[i].name || ms[i].parent && ms[i].parent.name || rec.model;
					sight.lastModel = rec.model;
					return true;
				}
			}
			return false;
		},
		get viewReach() {
			return reach;
		},
		faceCamera() {
			syncView();
			makeRoom(0, true);
			for (let i = 0; i < activeList.length; i++) {
				const rec = activeList[i];
				if (rec.shown && rec.dirty) writeMatrices(rec);
			}
		},
		/** Force-spawn everything in range now and snap every fold to its target (deterministic stills). */
		settle() {
			if (!last.valid) return;
			last.fresh = true;
			book.follow(last);
			stream(0, Infinity, true);
			for (let i = activeList.length - 1; i >= 0; i--) {
				const rec = activeList[i];
				rec.fold.snap(rec.fold.target);
				if (rec.shown) {
					if (rec.fold.target === 0) setShown(rec, false);
					else {
						if (WIND_ON && rec.spins) rec.fold.applyWind(state.time, -1, .6 + .4 * rec.wind, rec.cy, rec.sy);
						writeMatrices(rec);
						book.setTwin(rec.cx, rec.cz, twinFor(1));
					}
				}
			}
			book.settle();
		},
		/** Can the traveller stand at world (x,z)? Rivers/ponds block unless on a bridge; trees/houses block softly. */
		isWalkable(x, z) {
			return clearanceAt(x, z) > 0;
		},
		/** Signed room around world (x,z): <= 0 blocked (water, wall, solid prop), >= CONFIG.player.radius fully free. */
		clearance: clearanceAt,
		/** Debug: [mesh name, top, 'T' tall | 'L' low | '-' walk-through] of a model (CONFIG.world.debugPieces !== false). */
		debugPieces(model) {
			return dataFor(model).pieces || [];
		},
		/** Ground height (world Y) under (x,z): 0 on the page, raised on a bridge deck, slightly below 0 in the gutter. */
		heightAt(x, z) {
			const cx = Math.round(x / TILE_SIZE);
			const cz = Math.round(z / TILE_SIZE);
			const cell = cellAt(cx, cz);
			let h = book.gutterDip(x, z);
			const md = dataFor(cell.model);
			if (md.deck !== null) {
				let u = x - cx * TILE_SIZE;
				let v = z - cz * TILE_SIZE;
				const rot = (cell.rot % 4 + 4) % 4;
				for (let i = 0; i < rot; i++) {
					const t = u;
					u = v;
					v = -t;
				}
				const au = Math.abs(u);
				if (au < W.deckHalfWidth + .12) {
					const f = (v + HALF) / SDF_STEP;
					let k = Math.floor(f);
					if (k < 0) k = 0;
					else if (k > 39) k = 39;
					const a = Math.min(1, Math.max(0, f - k));
					let side = 1 - (au - W.deckHalfWidth) / .12;
					if (side > 1) side = 1;
					h += (md.deck[k] * (1 - a) + md.deck[k + 1] * a) * side * side * (3 - 2 * side);
				}
			}
			return h;
		},
		/** 'grass' | 'path' | 'bridge' | 'water' at world (x,z). */
		surfaceAt(x, z) {
			return SURFACES[classify(x, z)];
		},
		/** WFC cell record for a cell coordinate. */
		tileAt(cx, cz) {
			return cellAt(cx, cz);
		},
		/** Biome id ('heartland' | 'desert' | 'snow' | 'blossom' | 'pinewood') at WORLD position (x, z). Pure, allocation-free. */
		biomeAt(x, z) {
			return biomeAt(wfc.seed, Math.round(x / TILE_SIZE), Math.round(z / TILE_SIZE));
		},
		/** Live tile instances: [{key,cx,cz,cell,group,fold,shown}] (a copy of the list). */
		activeTiles() {
			return activeList.slice();
		},
		stats() {
			let shown = 0;
			let instances = 0;
			for (let i = 0; i < activeList.length; i++) if (activeList[i].shown) shown++;
			for (let i = 0; i < batchList.length; i++) instances += batchList[i].instances;
			return {
				active: activeList.length,
				pooled: pooledCount,
				moving: movingCount,
				collapsed: wfc.size ?? 0,
				shown,
				created,
				batches: batchList.length,
				instances
			};
		},
		dispose() {
			scene.remove(group);
			for (const b of batchList) b.mesh.dispose();
			book.dispose();
		}
	};
	sight.world = api;
	if (CONFIG.railway.useExperimentalRenderer) {
		const railwayLayer = new RailwayLayer({
			assets,
			wfc,
			materials,
			bounds: {
				multiTrack: {
					xMin: -75,
					xMax: 4,
					zMin: -116,
					zMax: -37
				},
				bridge: {
					xMin: -27,
					xMax: 12,
					zMin: 4,
					zMax: 43
				}
			}
		});
		batchRoot.add(railwayLayer.railsMesh);
		batchRoot.add(railwayLayer.ballastMesh);
		batchRoot.add(railwayLayer.sleepersMesh);
		api.railwayLayer = railwayLayer;
	}
	return api;
}
// src/player/alienPlayer.js
var GRAVITY = -24;
var JUMP_SPEED = 10;
var WALK_SPEED = 3.5;
var RUN_SPEED = 7;
var ACCELERATION = 30;
var AIR_ACCELERATION = 15;
var TURN_SPEED = 8;
var BOB_AMOUNT = .02;
function createAlienPlayer({ scene, assets, world }) {
	const model = assets.alien_player;
	if (!model) {
		console.error("[alienPlayer] alien_player.glb not loaded!");
		return createFallbackPlayer(scene);
	}
	const group = new Group();
	group.name = "alien-player-root";
	scene.add(group);
	const playerModel = model.clone(true);
	group.add(playerModel);
	playerModel.getObjectByName("body");
	const head = playerModel.getObjectByName("head");
	const leg_l = playerModel.getObjectByName("leg_l");
	const leg_r = playerModel.getObjectByName("leg_r");
	const arm_l = playerModel.getObjectByName("arm_l");
	const arm_r = playerModel.getObjectByName("arm_r");
	playerModel.traverse((o) => {
		if (o.isMesh) {
			o.castShadow = true;
			o.receiveShadow = true;
		}
	});
	const velocity = new Vector3();
	const moveDir = new Vector3();
	let onGround = false;
	let speed = 0;
	let walkTime = 0;
	CONFIG.TRAVELLER_HEIGHT;
	function canStand(x, z) {
		if (!world) return true;
		return world.isWalkable(x, z);
	}
	function canPass(x, z) {
		if (!world) return true;
		return world.isWalkable(x, z);
	}
	function getGroundHeight(x, z) {
		return world ? world.heightAt(x, z) : 0;
	}
	function update(dt, input) {
		const pos = group.position;
		const isRunning = input && input.run;
		if (input && (Math.abs(input.x) > .01 || Math.abs(input.z) > .01)) {
			moveDir.set(input.x, 0, input.z).normalize();
			const targetAngle = Math.atan2(moveDir.x, moveDir.z);
			let currentAngle = group.rotation.y;
			let diff = targetAngle - currentAngle;
			diff = (diff + Math.PI) % (Math.PI * 2) - Math.PI;
			currentAngle += diff * Math.min(1, TURN_SPEED * dt);
			group.rotation.y = currentAngle;
			const targetSpeed = isRunning ? RUN_SPEED : WALK_SPEED;
			const accel = onGround ? ACCELERATION : AIR_ACCELERATION;
			speed = MathUtils.lerp(speed, targetSpeed, Math.min(1, accel * dt));
			velocity.x = moveDir.x * speed;
			velocity.z = moveDir.z * speed;
			walkTime += dt * speed * 1.5;
		} else {
			const decel = onGround ? 60 : AIR_ACCELERATION;
			speed = MathUtils.lerp(speed, 0, Math.min(1, decel * dt));
			velocity.x = MathUtils.lerp(velocity.x, 0, Math.min(1, decel * dt));
			velocity.z = MathUtils.lerp(velocity.z, 0, Math.min(1, decel * dt));
			walkTime = 0;
		}
		if (input && input.jump && onGround) {
			velocity.y = JUMP_SPEED;
			onGround = false;
		}
		velocity.y += GRAVITY * dt;
		pos.x += velocity.x * dt;
		pos.z += velocity.z * dt;
		pos.y += velocity.y * dt;
		const groundY = getGroundHeight(pos.x, pos.z);
		if (pos.y <= groundY) {
			pos.y = groundY;
			velocity.y = 0;
			onGround = true;
		} else onGround = false;
		if (speed > .5 && onGround) {
			const bob = Math.sin(walkTime) * BOB_AMOUNT * (speed / WALK_SPEED);
			playerModel.position.y = bob;
			const swing = Math.sin(walkTime) * .3 * (speed / WALK_SPEED);
			if (leg_l) leg_l.rotation.x = swing;
			if (leg_r) leg_r.rotation.x = -swing;
			if (arm_l) arm_l.rotation.x = -swing * .5;
			if (arm_r) arm_r.rotation.x = swing * .5;
			playerModel.rotation.x = Math.sin(walkTime * .5) * .02 * (speed / RUN_SPEED);
		} else {
			playerModel.position.y = 0;
			if (leg_l) leg_l.rotation.x = 0;
			if (leg_r) leg_r.rotation.x = 0;
			if (arm_l) arm_l.rotation.x = 0;
			if (arm_r) arm_r.rotation.x = 0;
			playerModel.rotation.x = 0;
		}
		if (head) head.rotation.y = MathUtils.lerp(head.rotation.y, moveDir.x * .2, .1);
		state.traveller.x = pos.x;
		state.traveller.y = pos.y;
		state.traveller.z = pos.z;
		state.traveller.dirX = moveDir.x;
		state.traveller.dirZ = moveDir.z;
		state.traveller.speed = speed;
	}
	function teleport(x, z) {
		group.position.set(x, getGroundHeight(x, z), z);
		velocity.set(0, 0, 0);
		speed = 0;
	}
	function getHeight() {
		return group.position.y;
	}
	return {
		group,
		model: playerModel,
		position: group.position,
		velocity,
		moveDir,
		update,
		teleport,
		getHeight,
		canStand,
		canPass,
		get onGround() {
			return onGround;
		},
		get speed() {
			return speed;
		}
	};
}
function createFallbackPlayer(scene) {
	const group = new Group();
	group.name = "alien-player-fallback";
	scene.add(group);
	const geom = new SphereGeometry(.3, 16, 16);
	const mat = new MeshStandardMaterial({
		color: 5963610,
		roughness: .5,
		metalness: .1
	});
	const mesh = new Mesh(geom, mat);
	mesh.position.y = .3;
	mesh.castShadow = true;
	group.add(mesh);
	new Vector3();
	let speed = 0;
	function canStand(x, z) {
		return true;
	}
	function canPass(x, z) {
		return true;
	}
	function update(dt, input) {
		group.position;
		if (input && (Math.abs(input.x) > .01 || Math.abs(input.z) > .01)) {
			const moveDir = new Vector3(input.x, 0, input.z).normalize();
			const targetAngle = Math.atan2(moveDir.x, moveDir.z);
			group.rotation.y = MathUtils.lerp(group.rotation.y, targetAngle, .15);
			speed = MathUtils.lerp(speed, 4, .2);
			group.position.x += moveDir.x * speed * .016;
			group.position.z += moveDir.z * speed * .016;
		} else speed = MathUtils.lerp(speed, 0, .1);
	}
	function teleport(x, z) {
		group.position.set(x, 0, z);
	}
	return {
		group,
		position: group.position,
		velocity: new Vector3(),
		moveDir: new Vector3(),
		update,
		teleport,
		getHeight: () => group.position.y,
		canStand,
		canPass,
		get onGround() {
			return true;
		},
		get speed() {
			return speed;
		}
	};
}
// src/player/controls.js
var hypot2$2 = (a, b) => Math.sqrt(a * a + b * b);
var KEYS$1 = {
	KeyW: [0, -1],
	ArrowUp: [0, -1],
	KeyS: [0, 1],
	ArrowDown: [0, 1],
	KeyA: [-1, 0],
	ArrowLeft: [-1, 0],
	KeyD: [1, 0],
	ArrowRight: [1, 0]
};
var STEER = [
	.6,
	1.2,
	1.75
];
/** A hand-inked dashed ring with a small cross: one flat mesh lying on the page. */
function buildMarkerGeometry(radius) {
	const rng = mulberry32(108517);
	const pos = [];
	const quad = (ax, az, bx, bz, w0, w1) => {
		const dx = bx - ax;
		const dz = bz - az;
		const l = hypot2$2(dx, dz) || 1;
		const nx = -dz / l;
		const nz = dx / l;
		pos.push(ax + nx * w0, 0, az + nz * w0, bx + nx * w1, 0, bz + nz * w1, bx - nx * w1, 0, bz - nz * w1, ax + nx * w0, 0, az + nz * w0, bx - nx * w1, 0, bz - nz * w1, ax - nx * w0, 0, az - nz * w0);
	};
	const dashes = 9;
	const stroke = radius * .085;
	for (let i = 0; i < dashes; i++) {
		const a0 = i / dashes * Math.PI * 2 + (rng() - .5) * .12;
		const span = Math.PI * 2 / dashes * (.5 + rng() * .16);
		const r0 = radius * (.96 + rng() * .08);
		const segs = 3;
		for (let s = 0; s < segs; s++) {
			const u0 = a0 + span * s / segs;
			const u1 = a0 + span * (s + 1) / segs;
			const ra = r0 * (1 + (rng() - .5) * .03);
			const rb = r0 * (1 + (rng() - .5) * .03);
			quad(Math.cos(u0) * ra, Math.sin(u0) * ra, Math.cos(u1) * rb, Math.sin(u1) * rb, stroke * (.75 + rng() * .5), stroke * (.75 + rng() * .5));
		}
	}
	const c = radius * .2;
	quad(-c, -c * .9, c, c * 1.05, stroke * .9, stroke * .7);
	quad(-c * .95, c, c * 1.05, -c * .9, stroke * .8, stroke * .95);
	const g = new BufferGeometry();
	g.setAttribute("position", new Float32BufferAttribute(pos, 3));
	const n = new Float32Array(pos.length);
	for (let i = 1; i < n.length; i += 3) n[i] = 1;
	g.setAttribute("normal", new BufferAttribute(n, 3));
	return g;
}
function createControls({ domElement, camera, traveller }) {
	const C = CONFIG.player;
	const down = /* @__PURE__ */ new Set();
	const out = {
		x: 0,
		z: 0
	};
	const ray = new Raycaster();
	const ndc = new Vector2();
	const plane = new Plane(new Vector3(0, 1, 0), 0);
	const hit = new Vector3();
	const canStand = typeof traveller.canStand === "function" ? traveller.canStand : () => true;
	const canPass = typeof traveller.canPass === "function" ? traveller.canPass : canStand;
	const RS = C.routeCell ?? .15;
	const RN = Math.max(16, Math.round((C.routeSpan ?? 12) / RS) | 1);
	const RNN = RN * RN;
	const rOpen = new Int8Array(RNN);
	const rG = new Float32Array(RNN);
	const rFrom = new Int32Array(RNN);
	const rState = new Uint8Array(RNN);
	const rHeap = new Int32Array(RNN * 4);
	const rHeapF = new Float32Array(RNN * 4);
	let rHeapN = 0;
	let rX0 = 0;
	let rZ0 = 0;
	const route = [];
	let routeI = 0;
	let routeFor = null;
	let routeFail = 0;
	const NBX = [
		1,
		-1,
		0,
		0,
		1,
		1,
		-1,
		-1
	];
	const NBZ = [
		0,
		0,
		1,
		-1,
		1,
		-1,
		1,
		-1
	];
	function rPush(i, f) {
		let k = rHeapN++;
		while (k > 0) {
			const pa = k - 1 >> 1;
			if (rHeapF[pa] <= f) break;
			rHeap[k] = rHeap[pa];
			rHeapF[k] = rHeapF[pa];
			k = pa;
		}
		rHeap[k] = i;
		rHeapF[k] = f;
	}
	function rPop() {
		const top = rHeap[0];
		const i = rHeap[--rHeapN];
		const f = rHeapF[rHeapN];
		let k = 0;
		for (;;) {
			let c = k * 2 + 1;
			if (c >= rHeapN) break;
			if (c + 1 < rHeapN && rHeapF[c + 1] < rHeapF[c]) c++;
			if (rHeapF[c] >= f) break;
			rHeap[k] = rHeap[c];
			rHeapF[k] = rHeapF[c];
			k = c;
		}
		rHeap[k] = i;
		rHeapF[k] = f;
		return top;
	}
	function rIsOpen(i) {
		let o = rOpen[i];
		if (o < 0) {
			o = canPass(rX0 + i % RN * RS, rZ0 + (i / RN | 0) * RS) ? 1 : 0;
			rOpen[i] = o;
		}
		return o === 1;
	}
	/** Straight segment passable for the body? (sampled every 0.06) */
	function segClear(ax, az, bx, bz) {
		const d = hypot2$2(bx - ax, bz - az);
		const n = Math.max(1, Math.ceil(d / .06));
		for (let i = 1; i <= n; i++) {
			const k = i / n;
			if (!canPass(ax + (bx - ax) * k, az + (bz - az) * k)) return false;
		}
		return true;
	}
	/** Plans a route from the traveller to (tx,tz). Fills `route`; false when there is none inside the window. */
	function planRoute(px, pz, tx, tz) {
		route.length = 0;
		routeI = 0;
		rX0 = (px + tx) / 2 - (RN - 1) / 2 * RS;
		rZ0 = (pz + tz) / 2 - (RN - 1) / 2 * RS;
		const sx = Math.round((px - rX0) / RS);
		const sz = Math.round((pz - rZ0) / RS);
		const gx = Math.round((tx - rX0) / RS);
		const gz = Math.round((tz - rZ0) / RS);
		if (sx < 0 || sz < 0 || sx >= RN || sz >= RN || gx < 0 || gz < 0 || gx >= RN || gz >= RN) return false;
		rOpen.fill(-1);
		rState.fill(0);
		rHeapN = 0;
		const start = sz * RN + sx;
		let goal = gz * RN + gx;
		rOpen[start] = 1;
		if (!rIsOpen(goal)) {
			let best = -1;
			let bd = 1e9;
			for (let dz = -3; dz <= 3; dz++) for (let dx = -3; dx <= 3; dx++) {
				const x = gx + dx;
				const z = gz + dz;
				if (x < 0 || z < 0 || x >= RN || z >= RN) continue;
				const d = dx * dx + dz * dz;
				if (d < bd && rIsOpen(z * RN + x)) {
					bd = d;
					best = z * RN + x;
				}
			}
			if (best < 0) return false;
			goal = best;
		}
		const ggx = goal % RN;
		const ggz = goal / RN | 0;
		rG[start] = 0;
		rFrom[start] = -1;
		rState[start] = 1;
		rPush(start, hypot2$2(sx - ggx, sz - ggz));
		let found = false;
		let near = start;
		let nearH = hypot2$2(sx - ggx, sz - ggz);
		const startH = nearH;
		while (rHeapN > 0) {
			const i = rPop();
			if (rState[i] === 2) continue;
			rState[i] = 2;
			if (i === goal) {
				found = true;
				break;
			}
			const x = i % RN;
			const z = i / RN | 0;
			const h = hypot2$2(x - ggx, z - ggz);
			if (h < nearH) {
				nearH = h;
				near = i;
			}
			for (let k = 0; k < 8; k++) {
				const nx = x + NBX[k];
				const nz = z + NBZ[k];
				if (nx < 0 || nz < 0 || nx >= RN || nz >= RN) continue;
				const j = nz * RN + nx;
				if (rState[j] === 2 || !rIsOpen(j)) continue;
				if (k >= 4 && (!rIsOpen(z * RN + nx) || !rIsOpen(nz * RN + x))) continue;
				const g = rG[i] + (k >= 4 ? 1.4142 : 1);
				if (rState[j] === 1 && g >= rG[j]) continue;
				rG[j] = g;
				rFrom[j] = i;
				rState[j] = 1;
				rPush(j, g + hypot2$2(nx - ggx, nz - ggz));
			}
		}
		if (!found) {
			if (startH - nearH < 3) return false;
			goal = near;
		}
		const cells = [];
		for (let i = goal; i >= 0; i = rFrom[i]) cells.push(i);
		cells.reverse();
		const wx = (i) => rX0 + i % RN * RS;
		const wz = (i) => rZ0 + (i / RN | 0) * RS;
		let ax = px;
		let az = pz;
		let a = 0;
		while (a < cells.length - 1) {
			let b = cells.length - 1;
			while (b > a + 1 && !segClear(ax, az, wx(cells[b]), wz(cells[b]))) b--;
			ax = wx(cells[b]);
			az = wz(cells[b]);
			route.push(ax, az);
			a = b;
		}
		if (goal === gz * RN + gx && canStand(tx, tz) && segClear(ax, az, tx, tz)) route.push(tx, tz);
		return route.length > 0;
	}
	let target = null;
	let activePointer = null;
	let first = false;
	let stuckT = 0;
	let noProgressT = 0;
	let bestDist = Infinity;
	let side = 0;
	let sideHold = 0;
	let lastEmitX = 0;
	let lastEmitZ = 0;
	let lastPollTime = -1;
	const pal = CONFIG.palette || {};
	const markMat = new MeshBasicMaterial({
		color: pal.ink || pal.brown || "#5A3A28",
		transparent: true,
		opacity: 0,
		depthWrite: false,
		polygonOffset: true,
		polygonOffsetFactor: -2,
		polygonOffsetUnits: -2,
		side: 2
	});
	const mark = new Mesh(buildMarkerGeometry(C.markerSize), markMat);
	mark.name = "target-mark";
	mark.visible = false;
	mark.renderOrder = 5;
	mark.matrixAutoUpdate = true;
	let markShown = -1;
	let markHidden = -1;
	mark.onBeforeRender = () => {
		const t = state.time;
		let o = Math.min(1, Math.max(0, (t - markShown) / .1));
		if (markHidden >= 0) o *= Math.max(0, 1 - (t - markHidden) / Math.max(.01, C.markerFade));
		if (lastPollTime >= 0 && t - lastPollTime > .5) o = 0;
		markMat.opacity = o * C.markerOpacity;
		if (o <= 0 && (markHidden >= 0 || t - lastPollTime > .5) && t > markShown + .1) mark.visible = false;
	};
	const sceneRoot = traveller.group && traveller.group.parent;
	if (sceneRoot) sceneRoot.add(mark);
	function stampMark(x, z) {
		const y = typeof traveller.groundAt === "function" ? traveller.groundAt(x, z) : 0;
		mark.position.set(x, y + .012, z);
		mark.rotation.y = (x * 12.9898 + z * 78.233) % 1 * Math.PI;
		if (!mark.visible || markHidden >= 0) markShown = state.time;
		markHidden = -1;
		markMat.opacity = 0;
		mark.visible = true;
	}
	function fadeMark() {
		if (mark.visible && markHidden < 0) markHidden = state.time;
	}
	function firstInput() {
		if (first) return;
		first = true;
		bus.emit("input:first", {});
	}
	function dropTarget() {
		target = null;
		side = 0;
		route.length = 0;
		routeFor = null;
		fadeMark();
	}
	function setTarget(x, z, isDrag) {
		if (!canStand(x, z)) {
			const px = traveller.position.x;
			const pz = traveller.position.z;
			const d = hypot2$2(px - x, pz - z);
			const n = Math.min(60, Math.floor(d / .08));
			for (let i = 1; i <= n; i++) {
				const k = i * .08 / d;
				const qx = x + (px - x) * k;
				const qz = z + (pz - z) * k;
				if (canStand(qx, qz)) {
					x = qx;
					z = qz;
					break;
				}
			}
		}
		if (!target) target = {
			x,
			z
		};
		else {
			target.x = x;
			target.z = z;
		}
		stuckT = 0;
		noProgressT = 0;
		bestDist = Infinity;
		if (!isDrag) {
			side = 0;
			sideHold = 0;
		}
		if (!isDrag || routeFor && hypot2$2(x - routeFor.x, z - routeFor.z) > .3) {
			route.length = 0;
			routeFor = null;
			routeFail = 0;
		}
		stampMark(x, z);
		if (!isDrag || hypot2$2(x - lastEmitX, z - lastEmitZ) > .25) {
			lastEmitX = x;
			lastEmitZ = z;
			bus.emit("input:target", {
				x,
				z
			});
		}
	}
	function pick(ev, isDrag) {
		const r = domElement.getBoundingClientRect();
		if (r.width <= 0 || r.height <= 0) return;
		ndc.set((ev.clientX - r.left) / r.width * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
		ray.setFromCamera(ndc, camera);
		if (ray.ray.intersectPlane(plane, hit)) setTarget(hit.x, hit.z, isDrag);
	}
	let running = false;
	let strolling = false;
	let ctrlAlone = false;
	const applySpeed = () => {
		state.speedMul = running ? CONFIG.player.runMul ?? 1.8 : strolling ? CONFIG.player.slowMul ?? .6 : 1;
	};
	const onModDown = (e) => {
		if (e.key === "Shift") {
			running = true;
			applySpeed();
		}
		if (e.key === "Control") {
			if (!e.repeat) ctrlAlone = true;
		} else ctrlAlone = false;
	};
	const onModUp = (e) => {
		if (e.key === "Shift") {
			running = false;
			applySpeed();
		}
		if (e.key === "Control" && ctrlAlone) {
			ctrlAlone = false;
			strolling = !strolling;
			applySpeed();
		}
	};
	window.addEventListener("keydown", onModDown);
	window.addEventListener("keyup", onModUp);
	const onKeyDown = (e) => {
		if (!KEYS$1[e.code] || e.metaKey || e.ctrlKey || e.altKey) return;
		e.preventDefault();
		firstInput();
		down.add(e.code);
		if (target) dropTarget();
	};
	const onKeyUp = (e) => {
		down.delete(e.code);
	};
	const onBlur = () => {
		down.clear();
		activePointer = null;
		running = false;
		ctrlAlone = false;
		applySpeed();
	};
	const onVisibility = () => {
		if (document.hidden) onBlur();
	};
	const onPointerDown = (e) => {
		if (e.pointerType === "mouse" && e.button !== 0) return;
		if (activePointer !== null && e.pointerId !== activePointer) return;
		firstInput();
		activePointer = e.pointerId;
		try {
			domElement.setPointerCapture(e.pointerId);
		} catch (err) {}
		pick(e, false);
	};
	const onPointerMove = (e) => {
		if (activePointer !== null && e.pointerId === activePointer) pick(e, true);
	};
	const onPointerUp = (e) => {
		if (activePointer === null || e.pointerId !== activePointer) return;
		activePointer = null;
		try {
			domElement.releasePointerCapture(e.pointerId);
		} catch (err) {}
	};
	const prevent = (e) => {
		e.preventDefault();
	};
	const st = domElement.style;
	st.touchAction = "none";
	st.userSelect = "none";
	st.webkitUserSelect = "none";
	st.webkitTouchCallout = "none";
	st.webkitTapHighlightColor = "transparent";
	st.outline = "none";
	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);
	window.addEventListener("blur", onBlur);
	document.addEventListener("visibilitychange", onVisibility);
	domElement.addEventListener("pointerdown", onPointerDown);
	window.addEventListener("pointermove", onPointerMove);
	window.addEventListener("pointerup", onPointerUp);
	window.addEventListener("pointercancel", onPointerUp);
	domElement.addEventListener("contextmenu", prevent);
	domElement.addEventListener("selectstart", prevent);
	domElement.addEventListener("dragstart", prevent);
	/** Is the short path from the traveller along (dx,dz) clear? */
	function clear(px, pz, dx, dz, dist) {
		return canStand(px + dx * dist, pz + dz * dist) && canStand(px + dx * dist * .5, pz + dz * dist * .5);
	}
	return {
		/** Current click-to-walk target {x,z} in world space, or null. */
		get target() {
			return target;
		},
		clearTarget() {
			if (target) dropTarget();
		},
		/** The inked target mark (THREE.Mesh on the page). */
		mark,
		/** @returns {{x:number,z:number}} desired WORLD-space move direction (length 0..1). W = -Z (north). */
		getInput(dt) {
			lastPollTime = state.time;
			let x = 0;
			let z = 0;
			for (const code of down) {
				x += KEYS$1[code][0];
				z += KEYS$1[code][1];
			}
			if (x || z) {
				const l = hypot2$2(x, z);
				const me = camera.matrixWorld.elements;
				let rx = me[0];
				let rz = me[2];
				const rl = hypot2$2(rx, rz);
				if (rl > .5) {
					rx /= rl;
					rz /= rl;
				} else {
					rx = 1;
					rz = 0;
				}
				out.x = (x * rx - z * rz) / l;
				out.z = (x * rz + z * rx) / l;
				return out;
			}
			out.x = 0;
			out.z = 0;
			if (!target) return out;
			const px = traveller.position.x;
			const pz = traveller.position.z;
			const tx = target.x - px;
			const tz = target.z - pz;
			const d = hypot2$2(tx, tz);
			if (d < C.arriveRadius) {
				dropTarget();
				return out;
			}
			if (dt > 0) {
				if (traveller.speed < C.speed * .15) stuckT += dt;
				else stuckT = 0;
				if (stuckT > .35 && route.length > 0) route.length = 0;
				if (d < bestDist - .02) {
					bestDist = d;
					noProgressT = 0;
				} else noProgressT += dt;
				if (stuckT >= C.targetStuckTime || noProgressT >= C.targetNoProgressTime) {
					dropTarget();
					return out;
				}
			}
			let dx = tx / d;
			let dz = tz / d;
			let routed = false;
			if (route.length > 0) {
				while (routeI < route.length - 2 && hypot2$2(route[routeI] - px, route[routeI + 1] - pz) < .12) routeI += 2;
				while (routeI < route.length - 2 && segClear(px, pz, route[routeI + 2], route[routeI + 3])) routeI += 2;
				const wx = route[routeI] - px;
				const wz = route[routeI + 1] - pz;
				const wl = hypot2$2(wx, wz);
				if (routeI >= route.length - 2 && wl < C.arriveRadius) {
					if (hypot2$2(route[routeI] - target.x, route[routeI + 1] - target.z) > .001) {
						dropTarget();
						return out;
					}
					route.length = 0;
				} else if (wl > 1e-4) {
					dx = wx / wl;
					dz = wz / wl;
					routed = true;
				}
			}
			const probe = Math.min(C.targetProbe, d);
			if (routed) {} else if (clear(px, pz, dx, dz, probe) && (d > 1.2 || segClear(px, pz, target.x, target.z))) {
				if (side !== 0 && dt > 0) {
					sideHold -= dt;
					if (sideHold <= 0) side = 0;
				}
			} else if (state.time >= routeFail && planRoute(px, pz, target.x, target.z)) {
				routeFor = {
					x: target.x,
					z: target.z
				};
				stuckT = 0;
				noProgressT = 0;
				bestDist = Infinity;
				const wx = route[0] - px;
				const wz = route[1] - pz;
				const wl = hypot2$2(wx, wz);
				if (wl > 1e-4) {
					dx = wx / wl;
					dz = wz / wl;
				}
				routed = true;
			} else {
				if (state.time >= routeFail) routeFail = state.time + .5;
				const base = Math.atan2(dx, dz);
				let found = false;
				for (let pass = 0; pass < 2 && !found; pass++) {
					const sgn = pass === 0 ? side || 1 : -(side || 1);
					for (let i = 0; i < STEER.length; i++) {
						const a = base + sgn * STEER[i];
						const sx = Math.sin(a);
						const sz = Math.cos(a);
						if (clear(px, pz, sx, sz, C.targetProbe)) {
							dx = sx;
							dz = sz;
							side = sgn;
							sideHold = .3;
							found = true;
							break;
						}
					}
				}
			}
			if (routed) noProgressT = 0;
			const s = Math.max(.14, Math.min(1, Math.sqrt(2 * C.accel * .5 * Math.max(0, d - C.arriveRadius * .5)) / C.speed));
			out.x = dx * s;
			out.z = dz * s;
			return out;
		},
		dispose() {
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("keyup", onKeyUp);
			window.removeEventListener("blur", onBlur);
			document.removeEventListener("visibilitychange", onVisibility);
			domElement.removeEventListener("pointerdown", onPointerDown);
			window.removeEventListener("pointermove", onPointerMove);
			window.removeEventListener("pointerup", onPointerUp);
			window.removeEventListener("pointercancel", onPointerUp);
			domElement.removeEventListener("contextmenu", prevent);
			domElement.removeEventListener("selectstart", prevent);
			domElement.removeEventListener("dragstart", prevent);
			if (mark.parent) mark.parent.remove(mark);
			mark.geometry.dispose();
			markMat.dispose();
		}
	};
}
// src/camera/follow.js
var DEG = Math.PI / 180;
var TWO_PI = Math.PI * 2;
function createFollowCamera({ aspect = 16 / 9 } = {}) {
	const C = CONFIG.camera;
	const camera = new PerspectiveCamera(C.fov, aspect, C.near, C.far);
	camera.name = "follow-camera";
	let pose = { ...C };
	const target = new Vector3();
	const targetVel = new Vector3();
	const focusPoint = new Vector3();
	const _want = new Vector3();
	const prevGoal = new Vector3();
	const _right = new Vector3();
	const _up = new Vector3();
	let clock = 0;
	const AS = C.assist || { enabled: false };
	const AS_HEIGHTS = [
		.35,
		.65,
		.95
	];
	let aYaw = 0;
	let aPitch = 0;
	let aYawV = 0;
	let aPitchV = 0;
	let gYaw = 0;
	let gPitch = 0;
	let occT = 0;
	let clearT = 0;
	let checkT = 0;
	let heldT = 0;
	let gate = null;
	const _cam = new Vector3();
	/** Rays (of 3) from the figure to where the lens would stand with these offsets that a large piece blocks. */
	function assistBlocked(traveller, yawOff, pitchOff) {
		const w = sight.world;
		if (!w || !w.sightBlocked) return 0;
		const yaw = (pose.yawDeg + yawOff) * DEG;
		const pitch = Math.min(80, pose.pitchDeg + pitchOff) * DEG;
		const h = Math.cos(pitch) * pose.distance;
		_cam.set(target.x + Math.sin(yaw) * h, target.y + Math.sin(pitch) * pose.distance, target.z + Math.cos(yaw) * h);
		let n = 0;
		for (let i = 0; i < AS_HEIGHTS.length; i++) {
			const ox = traveller.position.x;
			const oy = traveller.position.y + CONFIG.TRAVELLER_HEIGHT * AS_HEIGHTS[i];
			const oz = traveller.position.z;
			let dx = _cam.x - ox;
			let dy = _cam.y - oy;
			let dz = _cam.z - oz;
			const l = Math.hypot(dx, dy, dz) || 1;
			dx /= l;
			dy /= l;
			dz /= l;
			if (w.sightBlocked(ox, oy, oz, dx, dy, dz, l - camera.near)) n++;
		}
		return n;
	}
	function assistOn() {
		if (AS.enabled === false || pose.pitchDeg > 60) return false;
		return gate === null || !gate();
	}
	function assistPick(traveller, baseN) {
		const P = AS.pitchMax ?? 10;
		const Y = AS.yawMax ?? 14;
		const cand = [
			[0, P * .5],
			[Y * .5, 0],
			[-Y * .5, 0],
			[0, P],
			[Y, 0],
			[-Y, 0],
			[Y * .5, P * .5],
			[-Y * .5, P * .5],
			[Y, P],
			[-Y, P]
		];
		let best = -1;
		let bestN = baseN;
		for (let i = 0; i < cand.length; i++) {
			if (pose.pitchDeg + cand[i][1] > 62) continue;
			const n = assistBlocked(traveller, cand[i][0], cand[i][1]);
			if (n < bestN) {
				bestN = n;
				best = i;
				if (n === 0) break;
			}
		}
		if (bestN >= 1 && (AS.far ?? 1) > 1) {
			const f = AS.far;
			const c2 = [
				[0, P * f],
				[Y * f, P],
				[-Y * f, P],
				[Y * f, P * f],
				[-Y * f, P * f]
			];
			for (let i = 0; i < c2.length; i++) {
				if (pose.pitchDeg + c2[i][1] > 62) continue;
				const n = assistBlocked(traveller, c2[i][0], c2[i][1]);
				if (n < bestN) {
					bestN = n;
					best = cand.length;
					cand.push(c2[i]);
					if (n === 0) break;
				}
			}
		}
		if (best >= 0) {
			gYaw = cand[best][0];
			gPitch = cand[best][1];
			heldT = 0;
		}
	}
	/** One step of the assist: decide (10 times a second), then ease. `force` (snap) decides and arrives at once. */
	function updateAssist(dt, traveller, force) {
		if (!assistOn()) {
			gYaw = 0;
			gPitch = 0;
			occT = 0;
			clearT = 0;
		} else {
			checkT -= dt;
			heldT += dt;
			if (checkT <= 0 || force) {
				const step = force ? 0 : AS.interval ?? .1;
				checkT = AS.interval ?? .1;
				const baseN = assistBlocked(traveller, 0, 0);
				const hidden = baseN >= 2;
				if (hidden) {
					occT += step;
					clearT = 0;
				} else {
					clearT += step;
					occT = 0;
				}
				if (gYaw === 0 && gPitch === 0) {
					if (hidden && (force || occT >= (AS.delay ?? .4))) assistPick(traveller, baseN);
				} else if (!hidden) {
					if (clearT >= (AS.release ?? .6)) {
						gYaw = 0;
						gPitch = 0;
					}
				} else if (heldT > (AS.rethink ?? 1.2) && assistBlocked(traveller, gYaw, gPitch) >= 2) {
					const py = gYaw;
					const pp = gPitch;
					gYaw = 0;
					gPitch = 0;
					assistPick(traveller, baseN);
					if (gYaw === 0 && gPitch === 0) {
						gYaw = py;
						gPitch = pp;
						heldT = 0;
					}
				}
			}
		}
		if (force) {
			aYaw = gYaw;
			aPitch = gPitch;
			aYawV = 0;
			aPitchV = 0;
			return;
		}
		if (dt <= 0) return;
		const om = 2 / Math.max(.05, AS.ease ?? .7);
		const e = Math.exp(-om * dt);
		let d = aYaw - gYaw;
		let tmp = (aYawV + om * d) * dt;
		aYawV = (aYawV - om * tmp) * e;
		aYaw = gYaw + (d + tmp) * e;
		d = aPitch - gPitch;
		tmp = (aPitchV + om * d) * dt;
		aPitchV = (aPitchV - om * tmp) * e;
		aPitch = gPitch + (d + tmp) * e;
		if (gYaw === 0 && Math.abs(aYaw) < .001 && Math.abs(aYawV) < .001) {
			aYaw = 0;
			aYawV = 0;
		}
		if (gPitch === 0 && Math.abs(aPitch) < .001 && Math.abs(aPitchV) < .001) {
			aPitch = 0;
			aPitchV = 0;
		}
	}
	function wanted(traveller, steady) {
		const yaw = (pose.yawDeg + aYaw) * DEG;
		const ux = -Math.sin(yaw);
		const uz = -Math.cos(yaw);
		const rx = Math.cos(yaw);
		const rz = -Math.sin(yaw);
		const v = traveller.velocity;
		const lead = pose.lookAhead / CONFIG.player.speed + (steady ? 0 : pose.smoothTime);
		const down = Math.max(0, -(v.x * ux + v.z * uz));
		const extra = (Math.max(pose.lookAheadSouth ?? pose.lookAhead, pose.lookAhead) - pose.lookAhead) * down / CONFIG.player.speed;
		const su = pose.screenUp || 0;
		const sr = pose.screenRight || 0;
		_want.set(traveller.position.x + v.x * lead - ux * extra + ux * su + rx * sr, traveller.position.y + (pose.targetHeight || 0), traveller.position.z + v.z * lead - uz * extra + uz * su + rz * sr);
		return _want;
	}
	const ZN = C.zone || { enabled: false };
	const zc = new Vector3();
	const zPrev = new Vector3();
	const zDir = new Vector2();
	let walkT = 0;
	let zoneLive = false;
	function zoneOn() {
		return ZN.enabled !== false && pose.zone !== false && pose.pitchDeg + aPitch <= 60;
	}
	function zoneStep(traveller, dt) {
		const p = traveller.position;
		if (!zoneLive) {
			zc.copy(p);
			zPrev.copy(p);
			zDir.set(0, 0);
			walkT = 0;
			zoneLive = true;
		}
		const yaw = (pose.yawDeg + aYaw) * DEG;
		const ux = -Math.sin(yaw);
		const uz = -Math.cos(yaw);
		const rx = Math.cos(yaw);
		const rz = -Math.sin(yaw);
		const k = pose.distance / C.distance;
		const sm = (a, b, x) => {
			const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
			return t * t * (3 - 2 * t);
		};
		let oR = (p.x - zc.x) * rx + (p.z - zc.z) * rz;
		let oU = (p.x - zc.x) * ux + (p.z - zc.z) * uz;
		const dR = (p.x - zPrev.x) * rx + (p.z - zPrev.z) * rz;
		const dU = (p.x - zPrev.x) * ux + (p.z - zPrev.z) * uz;
		zPrev.copy(p);
		const sR = ZN.stillR * k;
		const hR = ZN.hardR * k;
		const sU = (oU >= 0 ? ZN.stillUp : ZN.stillDown) * k;
		const hU = (oU >= 0 ? ZN.hardUp : ZN.hardDown) * k;
		const vx = traveller.velocity.x;
		const vz = traveller.velocity.z;
		const v = Math.hypot(vx, vz);
		if (v > .25 && dt > 0) {
			const nx = vx / v;
			const nz = vz / v;
			const a = 1 - Math.exp(-dt / .35);
			if (zDir.lengthSq() < .01) zDir.set(nx, nz);
			else {
				zDir.x += (nx - zDir.x) * a;
				zDir.y += (nz - zDir.y) * a;
			}
			const dl = zDir.length() || 1;
			walkT = (nx * zDir.x + nz * zDir.y) / dl > .7 ? walkT + dt : Math.max(0, walkT - 3 * dt);
		} else walkT = 0;
		const w = sm(ZN.leadAfter[0], ZN.leadAfter[1], walkT - dt * .5);
		const fR = dR * oR > 0 ? sm(sR, hR, Math.abs(oR - dR * .5)) : 0;
		const fU = dU * oU > 0 ? sm(sU, hU, Math.abs(oU - dU * .5)) : 0;
		let mR = dR * Math.max(fR, w);
		let mU = dU * Math.max(fU, w);
		oR -= mR;
		oU -= mU;
		if (w > 0 && dt > 0) {
			const nx = vx / v;
			const nz = vz / v;
			const down = Math.max(0, -(nx * ux + nz * uz));
			const look = (pose.lookAhead + (Math.max(pose.lookAheadSouth ?? pose.lookAhead, pose.lookAhead) - pose.lookAhead) * down) * k + v * ZN.smoothTime;
			let lR = -(nx * rx + nz * rz) * look;
			let lU = -(nx * ux + nz * uz) * look;
			lR = Math.max(-(hR - .1 * k), Math.min(hR - .1 * k, lR));
			lU = Math.max(-(ZN.hardDown - .1) * k, Math.min((ZN.hardUp - .1) * k, lU));
			const gR = oR - lR;
			const gU = oU - lU;
			const g = Math.hypot(gR, gU);
			if (g > 1e-5) {
				const d = Math.min(g * (1 - Math.exp(-dt / ZN.leadTau)), (ZN.leadRate ?? 1.2) * v * dt) * w;
				mR += gR / g * d;
				mU += gU / g * d;
				oR -= gR / g * d;
				oU -= gU / g * d;
			}
		}
		const hU2 = (oU >= 0 ? ZN.hardUp : ZN.hardDown) * k;
		if (Math.abs(oR) > hR) {
			const c = oR - Math.sign(oR) * hR;
			mR += c;
		}
		if (Math.abs(oU) > hU2) {
			const c = oU - Math.sign(oU) * hU2;
			mU += c;
		}
		zc.x += mR * rx + mU * ux;
		zc.z += mR * rz + mU * uz;
		zc.y = p.y;
		const su = pose.screenUp || 0;
		const sr = pose.screenRight || 0;
		_want.set(zc.x + ux * su + rx * sr, p.y + (pose.targetHeight || 0), zc.z + uz * su + rz * sr);
		return _want;
	}
	function setFocus(traveller) {
		focusPoint.copy(traveller.position);
		focusPoint.y += CONFIG.TRAVELLER_HEIGHT * (pose.focusHeight ?? .6);
	}
	function place() {
		const pitch = (pose.pitchDeg + aPitch) * DEG;
		const yaw = (pose.yawDeg + aYaw) * DEG;
		const h = Math.cos(pitch) * pose.distance;
		camera.position.set(target.x + Math.sin(yaw) * h, target.y + Math.sin(pitch) * pose.distance, target.z + Math.cos(yaw) * h);
		camera.up.set(0, 1, 0);
		if (pose.pitchDeg + aPitch >= 88.5) camera.up.set(-Math.sin(yaw), 0, -Math.cos(yaw));
		const amp = pose.driftAmp || 0;
		if (amp > 0 && pose.pitchDeg < 88.5) {
			const w = TWO_PI * (pose.driftHz || .07);
			const a = amp * Math.sin(clock * w);
			const b = amp * .6 * Math.sin(clock * w * 1.37 + 1.7);
			_right.set(Math.cos(yaw), 0, -Math.sin(yaw));
			_up.set(-Math.sin(yaw) * Math.sin(pitch), Math.cos(pitch), -Math.cos(yaw) * Math.sin(pitch));
			camera.position.addScaledVector(_right, a).addScaledVector(_up, b);
		}
		const minY = target.y + camera.near + .35;
		if (camera.position.y < minY) camera.position.y = minY;
		state.camPitch = pose.pitchDeg + aPitch;
		camera.lookAt(target);
		if (camera.fov !== pose.fov) {
			camera.fov = pose.fov;
			camera.updateProjectionMatrix();
		}
		camera.updateMatrixWorld();
	}
	/** Exact critically damped spring step for one axis (stable and frame-rate independent). */
	function damp(axis, goal, omega, e, dt) {
		const d = target[axis] - goal;
		const tmp = (targetVel[axis] + omega * d) * dt;
		targetVel[axis] = (targetVel[axis] - omega * tmp) * e;
		target[axis] = goal + (d + tmp) * e;
	}
	return {
		/** The THREE.PerspectiveCamera used for rendering and raycasting. */
		camera,
		target,
		focusPoint,
		/** Distance from the camera to focusPoint (world units) - for depth-of-field. */
		get focusDistance() {
			return camera.position.distanceTo(focusPoint);
		},
		get pose() {
			return pose;
		},
		/** Pause sight assist when fn() returns true, such as while the atlas page is open. */
		setAssistGate(fn) {
			gate = fn || null;
		},
		update(dt, traveller) {
			if (dt > 0) {
				clock += dt;
				const zone = zoneOn();
				if (!zone) zoneLive = false;
				const goal = zone ? zoneStep(traveller, dt) : wanted(traveller);
				const omega = 2 / Math.max(.01, zone ? ZN.smoothTime : pose.smoothTime);
				const e = Math.exp(-omega * dt);
				damp("x", (goal.x + prevGoal.x) * .5, omega, e, dt);
				damp("y", (goal.y + prevGoal.y) * .5, omega, e, dt);
				damp("z", (goal.z + prevGoal.z) * .5, omega, e, dt);
				prevGoal.copy(goal);
				updateAssist(dt, traveller, false);
			}
			setFocus(traveller);
			place();
		},
		/** Place the camera at the traveller's initial position without smoothing. */
		snap(traveller) {
			aYaw = 0;
			aPitch = 0;
			gYaw = 0;
			gPitch = 0;
			aYawV = 0;
			aPitchV = 0;
			occT = 0;
			clearT = 0;
			checkT = 0;
			target.copy(wanted(traveller, true));
			updateAssist(0, traveller, true);
			if (aYaw !== 0) target.copy(wanted(traveller, true));
			prevGoal.copy(wanted(traveller));
			zoneLive = false;
			if (zoneOn()) {
				const p = traveller.position;
				zoneStep(traveller, 0);
				const v = Math.hypot(traveller.velocity.x, traveller.velocity.z);
				if (v > .25) {
					const su = pose.screenUp || 0;
					const yaw = (pose.yawDeg + aYaw) * DEG;
					zc.set(target.x + Math.sin(yaw) * su, p.y, target.z + Math.cos(yaw) * su);
					zDir.set(traveller.velocity.x / v, traveller.velocity.z / v);
					walkT = ZN.leadAfter[1];
				}
				target.copy(zoneStep(traveller, 0));
				prevGoal.copy(target);
			}
			targetVel.set(traveller.velocity.x, 0, traveller.velocity.z);
			clock = 0;
			setFocus(traveller);
			place();
		},
		/** Override any of {distance,pitchDeg,yawDeg,fov,lookAhead,smoothTime,screenUp,screenRight,targetHeight,driftAmp}; null restores the defaults. */
		setPose(overrides) {
			pose = {
				...C,
				...overrides || {}
			};
		},
		setAspect(a) {
			camera.aspect = a;
			camera.updateProjectionMatrix();
		}
	};
}
// src/render/renderer.js
function createRenderer({ canvas, quality = "high" }) {
	let q = qualitySettings(quality);
	const renderer = new WebGLRenderer({
		canvas,
		antialias: false,
		alpha: false,
		stencil: false,
		powerPreference: "high-performance"
	});
	renderer.outputColorSpace = SRGBColorSpace;
	renderer.toneMapping = 0;
	renderer.toneMappingExposure = 1;
	renderer.shadowMap.enabled = q.shadows;
	renderer.shadowMap.type = 0;
	return {
		renderer,
		/** CSS-pixel size of the canvas; pixel ratio is clamped by the quality level. */
		setSize(width, height) {
			renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, q.maxDpr));
			renderer.setSize(width, height, false);
		},
		setQuality(level) {
			q = qualitySettings(level);
			renderer.shadowMap.enabled = q.shadows;
			renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, q.maxDpr));
		},
		dispose() {
			renderer.dispose();
		}
	};
}
// src/render/colorcache.js
var last = /* @__PURE__ */ new WeakMap();
/** @returns {boolean} true when the colour was (re)parsed */
function setColorCached(color, style) {
	if (last.get(color) === style) return false;
	color.set(style);
	last.set(color, style);
	return true;
}
// src/render/materials.js
/** Uniforms shared by EVERY paper material. lights.js and post.js write into these each frame. */
var paperUniforms = {
	uPaperFibreTex: { value: null },
	uPaperFibre: { value: new Vector4(1 / 2.6, .2, .1, .6) },
	uPaperFibre2: { value: new Vector4(.55, 3.73, 0, 0) },
	uPaperLight: { value: new Vector4(.16, .3, .55, .05) },
	uPaperTransTint: { value: new Color("#ffb070") },
	uPaperShadowLeak: { value: new Color("#2a1206") },
	uPaperArtTex: { value: null },
	uPaperArt: { value: new Vector4(1, 0, 1, .4) },
	uPaperHero: { value: new Vector4(0, 0, 0, .45) },
	uPaperHero2: { value: new Vector4(0, 0, .25, .25) },
	uPaperPool: { value: [
		0,
		1,
		2,
		3,
		4,
		5
	].map(() => new Vector4(0, 0, 0, 0)) },
	uPaperPoolCol: { value: new Vector4(1, .78, .47, 0) },
	uPaperLightB: { value: new Vector4(1.2, 0, 0, 0) },
	uPaperRim: { value: new Vector4(.016, 1.5, 3.4, .9) },
	uPaperRimCol: { value: new Vector4(1, .93, .78, .3) },
	uPaperRim2: { value: new Vector4(.5, 0, 0, 0) }
};
function smooth$2(t) {
	return t * t * (3 - 2 * t);
}
function addValueNoise(out, N, cells, amp, rng) {
	const g = new Float32Array(cells * cells);
	for (let i = 0; i < g.length; i++) g[i] = rng() - .5;
	for (let y = 0; y < N; y++) {
		const fy = y / N * cells;
		const iy = Math.floor(fy);
		const ty = smooth$2(fy - iy);
		const y0 = iy % cells * cells;
		const y1 = (iy + 1) % cells * cells;
		for (let x = 0; x < N; x++) {
			const fx = x / N * cells;
			const ix = Math.floor(fx);
			const tx = smooth$2(fx - ix);
			const x0 = ix % cells;
			const x1 = (ix + 1) % cells;
			const a = g[y0 + x0] + (g[y0 + x1] - g[y0 + x0]) * tx;
			const b = g[y1 + x0] + (g[y1 + x1] - g[y1 + x0]) * tx;
			out[y * N + x] += amp * (a + (b - a) * ty);
		}
	}
}
/** Tileable Worley F1 "pebbles": the embossed tooth of heavy handmade paper. */
function addPebbles(out, N, cells, amp, rng) {
	const px = new Float32Array(cells * cells);
	const py = new Float32Array(cells * cells);
	const ph = new Float32Array(cells * cells);
	for (let i = 0; i < px.length; i++) {
		px[i] = rng();
		py[i] = rng();
		ph[i] = .6 + rng() * .4;
	}
	for (let y = 0; y < N; y++) {
		const fy = y / N * cells;
		const cy = Math.floor(fy);
		for (let x = 0; x < N; x++) {
			const fx = x / N * cells;
			const cx = Math.floor(fx);
			let best = 9;
			let bh = 1;
			for (let j = -1; j <= 1; j++) {
				const yy = (cy + j + cells) % cells;
				for (let i = -1; i <= 1; i++) {
					const xx = (cx + i + cells) % cells;
					const k = yy * cells + xx;
					const dx = cx + i + px[k] - fx;
					const dy = cy + j + py[k] - fy;
					const d = dx * dx + dy * dy;
					if (d < best) {
						best = d;
						bh = ph[k];
					}
				}
			}
			const d = Math.min(1, Math.sqrt(best) / .75);
			out[y * N + x] += amp * ((1 - d * d) * bh - .45);
		}
	}
}
function addFibres(out, N, count, amp, rng) {
	for (let f = 0; f < count; f++) {
		let x = rng() * N;
		let y = rng() * N;
		let a = rng() * Math.PI * 2;
		const len = 10 + rng() * 46;
		const curve = (rng() - .5) * .12;
		const s = (rng() < .72 ? 1 : -.8) * amp * (.5 + rng() * .7);
		for (let i = 0; i < len; i++) {
			const t = i / len;
			const w = s * Math.sin(Math.PI * t);
			const ix = Math.floor(x);
			const iy = Math.floor(y);
			const fx = x - ix;
			const fy = y - iy;
			const x0 = (ix % N + N) % N;
			const y0 = (iy % N + N) % N;
			const x1 = (x0 + 1) % N;
			const y1 = (y0 + 1) % N;
			out[y0 * N + x0] += w * (1 - fx) * (1 - fy);
			out[y0 * N + x1] += w * fx * (1 - fy);
			out[y1 * N + x0] += w * (1 - fx) * fy;
			out[y1 * N + x1] += w * fx * fy;
			x += Math.cos(a);
			y += Math.sin(a);
			a += curve;
		}
	}
}
function normalise(a) {
	let m = 0;
	for (let i = 0; i < a.length; i++) m += a[i];
	m /= a.length;
	let v = 0;
	for (let i = 0; i < a.length; i++) {
		a[i] -= m;
		v += a[i] * a[i];
	}
	const s = 1 / Math.sqrt(v / a.length + 1e-12);
	for (let i = 0; i < a.length; i++) a[i] *= s;
	return a;
}
function makeCloud(N, rng) {
	const c = new Float32Array(N * N);
	addValueNoise(c, N, 9, 1, rng);
	addValueNoise(c, N, 17, .7, rng);
	addValueNoise(c, N, 36, .35, rng);
	return normalise(c);
}
function packToTexture(N, height, tooth, cloud, normalStrength, anisotropy) {
	const data = new Uint8Array(N * N * 4);
	for (let y = 0; y < N; y++) {
		const yu = (y + N - 1) % N * N;
		const yd = (y + 1) % N * N;
		for (let x = 0; x < N; x++) {
			const i = y * N + x;
			const dx = (height[y * N + (x + 1) % N] - height[y * N + (x + N - 1) % N]) * normalStrength;
			const dy = (height[yd + x] - height[yu + x]) * normalStrength;
			const il = 1 / Math.sqrt(dx * dx + dy * dy + 1);
			data[i * 4] = Math.max(0, Math.min(255, Math.round((-dx * il * .5 + .5) * 255)));
			data[i * 4 + 1] = Math.max(0, Math.min(255, Math.round((-dy * il * .5 + .5) * 255)));
			data[i * 4 + 2] = Math.max(0, Math.min(255, Math.round((.5 + tooth[i] * .16) * 255)));
			data[i * 4 + 3] = Math.max(0, Math.min(255, Math.round((.5 + cloud[i] * .16) * 255)));
		}
	}
	return finishTexture(new DataTexture(data, N, N, RGBAFormat, UnsignedByteType), anisotropy);
}
function finishTexture(tex, anisotropy) {
	tex.wrapS = tex.wrapT = RepeatWrapping;
	tex.magFilter = LinearFilter;
	tex.minFilter = LinearMipmapLinearFilter;
	tex.generateMipmaps = true;
	tex.anisotropy = anisotropy;
	tex.colorSpace = "";
	tex.flipY = false;
	tex.name = "paper-fibre-packed";
	tex.needsUpdate = true;
	return tex;
}
function makeProceduralFibre(N, anisotropy) {
	const rng = mulberry32(85924654);
	const h = new Float32Array(N * N);
	addPebbles(h, N, 96, .8, rng);
	addPebbles(h, N, 190, .5, rng);
	addValueNoise(h, N, 170, .5, rng);
	addValueNoise(h, N, 256, .4, rng);
	addFibres(h, N, 2600, .7, rng);
	normalise(h);
	return packToTexture(N, h, h, makeCloud(N, rng), .24, anisotropy);
}
/** Repack the textures agent's grey albedo-detail + tangent normal map into the packed layout. Returns null on any failure. */
function packFromAssets(detailTex, normalTex, anisotropy) {
	try {
		const dImg = detailTex && detailTex.image;
		const nImg = normalTex && normalTex.image;
		if (!dImg || !nImg || !dImg.width || !nImg.width) return null;
		const N = Math.min(1024, dImg.width);
		const read = (img) => {
			const c = document.createElement("canvas");
			c.width = c.height = N;
			const ctx = c.getContext("2d", { willReadFrequently: true });
			ctx.drawImage(img, 0, 0, N, N);
			return ctx.getImageData(0, 0, N, N).data;
		};
		const d = read(dImg);
		const n = read(nImg);
		const cloud = makeCloud(N, mulberry32(7999939));
		const data = new Uint8Array(N * N * 4);
		let mean = 0;
		for (let i = 0; i < N * N; i++) mean += d[i * 4];
		mean /= N * N;
		const flipG = normalTex.flipY !== false;
		for (let i = 0; i < N * N; i++) {
			data[i * 4] = n[i * 4];
			data[i * 4 + 1] = flipG ? 255 - n[i * 4 + 1] : n[i * 4 + 1];
			data[i * 4 + 2] = Math.max(0, Math.min(255, Math.round(d[i * 4] - mean + 127.5)));
			data[i * 4 + 3] = Math.max(0, Math.min(255, Math.round((.5 + cloud[i] * .16) * 255)));
		}
		return finishTexture(new DataTexture(data, N, N, RGBAFormat, UnsignedByteType), anisotropy);
	} catch (err) {
		return null;
	}
}
var VERT_PARS = `
varying vec3 vPaperPos;
varying vec3 vPaperNrm;
varying float vPaperTone;
// art atlas UVs: three only declares uv1 when one of its own maps uses channel 1. A geometry WITHOUT the attribute
// reads the constant (0,0) and a non-art face carries (-1,-1): both fail the x > 0 gate in the fragment shader.
#ifndef USE_UV1
attribute vec2 uv1;
#endif
varying vec2 vPaperArtUv;
varying vec3 vPaperW;
float paperHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float paperVNoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(paperHash(i), paperHash(i + vec2(1.0, 0.0)), f.x), mix(paperHash(i + vec2(0.0, 1.0)), paperHash(i + vec2(1.0, 1.0)), f.x), f.y);
}
// A mesh without a colour attribute reads the constant (0,0,0): treat that as "no vertex colour" (white).
vec3 paperVC(vec3 c) { return dot(c, vec3(1.0)) <= 0.0 ? vec3(1.0) : c; }
vec4 paperVC(vec4 c) { return dot(c.rgb, vec3(1.0)) <= 0.0 ? vec4(1.0) : c; }
`;
var VERT_MAIN = `
{
  mat4 paperM = modelMatrix;
  float paperId = 0.0;
  #ifdef USE_BATCHING
    paperM = paperM * batchingMatrix;
    paperId = getIndirectIndex( gl_DrawID );
  #endif
  #ifdef USE_INSTANCING
    paperM = paperM * instanceMatrix;
    paperId = float( gl_InstanceID );
  #endif
  #ifdef PAPER_FIBRE_WORLD
    vPaperPos = ( paperM * vec4( transformed, 1.0 ) ).xyz;
    vPaperNrm = normalize( mat3( paperM ) * objectNormal );
  #else
    vPaperPos = transformed * length( paperM[0].xyz );
    vPaperNrm = objectNormal;
  #endif
  // per-sheet tone: smooth in the sheet's origin (so a moving sheet never flickers) + a hash of the instance id
  vec3 paperO = paperM[3].xyz;
  float paperTn = paperVNoise( paperO.xz * 1.13 + paperO.y * 2.71 );
  paperTn = fract( paperTn + paperHash( vec2( paperId, 3.7 ) ) * step( 0.5, paperId ) );
  vPaperTone = paperTn * 2.0 - 1.0;
  vPaperArtUv = uv1;
  vPaperW = ( paperM * vec4( transformed, 1.0 ) ).xyz;
}
`;
var FRAG_PARS = `
uniform sampler2D uPaperFibreTex;
uniform vec4 uPaperFibre;
uniform vec4 uPaperFibre2;
uniform vec4 uPaperLight;
uniform vec3 uPaperTransTint;
uniform vec3 uPaperShadowLeak;
varying vec3 vPaperPos;
varying vec3 vPaperNrm;
varying float vPaperTone;
varying vec2 vPaperArtUv;
uniform sampler2D uPaperArtTex;
uniform vec4 uPaperArt;
uniform vec4 uPaperHero;
uniform vec4 uPaperHero2;
uniform vec4 uPaperPool[6];
uniform vec4 uPaperPoolCol;
uniform vec4 uPaperRim;
uniform vec4 uPaperLightB;
uniform vec4 uPaperRimCol;
uniform vec4 uPaperRim2;
varying vec3 vPaperW;
float gPaperCov = 1.0;
float paperHashF( vec2 p ) { return fract( sin( dot( p, vec2( 127.1, 311.7 ) ) ) * 43758.5453 ); }
float paperVNoiseF( vec2 p ) {
  vec2 i = floor( p ), f = fract( p );
  f = f * f * ( 3.0 - 2.0 * f );
  return mix( mix( paperHashF( i ), paperHashF( i + vec2( 1.0, 0.0 ) ), f.x ), mix( paperHashF( i + vec2( 0.0, 1.0 ) ), paperHashF( i + vec2( 1.0, 1.0 ) ), f.x ), f.y );
}
float gPaperShadow = 1.0;
float gPaperTrans = 1.0;
float gPaperPoint = 0.0;
`;
var FRAG_LIGHTING = `
varying vec3 vViewPosition;

struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};

void RE_Direct_Paper( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float nl = dot( geometryNormal, directLight.direction );
	float wrap = mix( uPaperLight.x, uPaperLight.z, gPaperPoint );
	float front = saturate( ( nl + wrap ) / ( 1.0 + wrap ) );
	// key shadow with a warm leak (light bounced off the surrounding cream paper)
	vec3 irradiance = front * directLight.color * mix( uPaperShadowLeak, vec3( 1.0 ), gPaperShadow );
	// thin card lit from behind glows warm
	float back = saturate( ( - nl + 0.1 ) / 1.1 );
	irradiance += back * gPaperTrans * uPaperLight.y * uPaperTransTint * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	gPaperShadow = 1.0;
	gPaperTrans = 1.0;
}

void RE_IndirectDiffuse_Paper( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}

#define RE_Direct				RE_Direct_Paper
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Paper
`;
var FRAG_SHADOW = `
#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0 && defined( SHADOWMAP_TYPE_BASIC ) && defined( PAPER_PCSS )
// Paper keeps the lit fraction in globals (so the shadow can leak warm light and thin card can glow
// through) and returns 1 so the stock multiply is a no-op.
float paperShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
	vec2 r = paperPCSS( shadowMap, shadowMapSize, shadowRadius, shadowBias, shadowCoord );
	gPaperShadow = mix( 1.0, r.x, shadowIntensity );
	gPaperTrans = r.y;
	return 1.0;
}
#else
#define paperShadow getShadow
#endif
`;
/**
* GLOBAL patch of three's BasicShadowMap filter: every lit material in the app (paper or not, e.g. the
* book page) gets the same PCSS soft shadow. Only stock per-light uniforms are used, so it works on
* materials that know nothing about paper: shadowRadius carries the world size of the shadow map and
* shadowBias the light size (lights.js writes them); the remaining constants are baked from CONFIG.
*/
var originalShadowChunk = null;
/** pcss = false when the global shadow patch could not be applied (lights.js then feeds the stock filter). */
var paperState = { pcss: true };
function patchShadowChunk(q) {
	const S = CONFIG.lights.shadow;
	const taps = q.shadowTaps || [8, 12];
	const f = (v) => Number(v).toFixed(6);
	const range = S.far - S.near;
	const code = `	#else // SHADOWMAP_TYPE_BASIC (paper PCSS)

		#define PAPER_PCSS 1
		#ifndef PAPER_BLOCKER_TAPS
			#define PAPER_BLOCKER_TAPS ${taps[0]}
		#endif
		#ifndef PAPER_PCF_TAPS
			#define PAPER_PCF_TAPS ${taps[1]}
		#endif

		float paperIGN( vec2 p ) { return fract( 52.9829189 * fract( dot( p, vec2( 0.06711056, 0.00583715 ) ) ) ); }
		vec2 paperVogel( float i, float n, float phi ) {
			float r = sqrt( ( i + 0.5 ) / n );
			float t = i * 2.399963229728653 + phi;
			return vec2( cos( t ), sin( t ) ) * r;
		}

		// PCSS on the raw depth map: blocker search, receiver-plane depth bias, Vogel-disc PCF.
		// Returns ( lit fraction, lit fraction when blockers within one sheet thickness are ignored ).
		vec2 paperPCSS( sampler2D shadowMap, vec2 shadowMapSize, float worldPerUv, float lightSize, vec4 shadowCoord ) {
			vec3 sc = shadowCoord.xyz / shadowCoord.w;
			vec3 dx = dFdx( sc );
			vec3 dy = dFdy( sc );
			if ( sc.x <= 0.0 || sc.x >= 1.0 || sc.y <= 0.0 || sc.y >= 1.0 || sc.z >= 1.0 ) return vec2( 1.0 );
			const float range = ${f(range)};
			float det = dx.x * dy.y - dx.y * dy.x;
			vec2 grad = vec2( 0.0 );
			if ( abs( det ) > 1e-14 ) grad = vec2( dy.y * dx.z - dx.y * dy.z, dx.x * dy.z - dy.x * dx.z ) / det;
			float slope = length( grad ) * range / worldPerUv;
			grad *= min( 1.0, 4.0 / max( slope, 1e-4 ) );
			float bias = ${f(S.bias)} / range;
			float thick = ${f(S.sheetThickness)} / range;
			float phi = paperIGN( gl_FragCoord.xy ) * 6.2831853;
			float rs = ${f(S.searchRadius)} / worldPerUv;
			float sumD = 0.0;
			float nB = 0.0;
			for ( int i = 0; i < PAPER_BLOCKER_TAPS; i ++ ) {
				vec2 o = paperVogel( float( i ), float( PAPER_BLOCKER_TAPS ), phi ) * rs;
				float d = sc.z + dot( grad, o ) - textureLod( shadowMap, sc.xy + o, 0.0 ).r;
				if ( d > bias ) { sumD += d; nB += 1.0; }
			}
			float penMin = ${f(S.minPenumbraTexels)} * worldPerUv / shadowMapSize.x;
			if ( nB < 0.5 ) {
				// The sparse search can miss a thin contact sliver, which would turn it into dots:
				// catch it with 4 tight taps (the tight filter is what such a sliver would get anyway).
				float rq = 0.5 * penMin / worldPerUv;
				vec2 l4 = vec2( 0.0 );
				for ( int i = 0; i < 4; i ++ ) {
					vec2 o = paperVogel( float( i ), 4.0, phi + 0.9 ) * rq;
					float d = sc.z + dot( grad, o ) - textureLod( shadowMap, sc.xy + o, 0.0 ).r;
					l4 += vec2( step( d, bias ), step( d, thick ) );
				}
				return l4 * 0.25;
			}
			float dAvg = sumD / nB * range;
			float pen = clamp( lightSize * dAvg, penMin, ${f(S.maxPenumbra)} );
			float rp = 0.5 * pen / worldPerUv;
			float lit = 0.0;
			float litT = 0.0;
			for ( int i = 0; i < PAPER_PCF_TAPS; i ++ ) {
				vec2 o = paperVogel( float( i ), float( PAPER_PCF_TAPS ), phi + 1.7 ) * rp;
				float d = sc.z + dot( grad, o ) - textureLod( shadowMap, sc.xy + o, 0.0 ).r;
				lit += step( d, bias );
				litT += step( d, thick );
			}
			return vec2( lit, litT ) / float( PAPER_PCF_TAPS );
		}

		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float lit = paperPCSS( shadowMap, shadowMapSize, shadowRadius, shadowBias, shadowCoord ).x;
			return mix( 1.0, mix( ${f(S.stockLeak ?? .07)}, 1.0, lit ), shadowIntensity );
		}
`;
	if (!originalShadowChunk) originalShadowChunk = ShaderChunk.shadowmap_pars_fragment;
	const src = originalShadowChunk;
	const v = src.indexOf("#elif defined( SHADOWMAP_TYPE_VSM )");
	const a = v >= 0 ? src.indexOf("\n	#else", v) + 1 : -1;
	const b = a > 0 ? src.indexOf("\n	#endif", a) : -1;
	if (a <= 0 || b < 0) {
		console.warn("[materials] three.js shadow chunk layout changed; falling back to stock hard shadows");
		return false;
	}
	ShaderChunk.shadowmap_pars_fragment = src.slice(0, a) + code + src.slice(b);
	return true;
}
var FRAG_FIBRE = `
#ifndef PAPER_NO_CUTOUT
if ( uPaperHero2.y > 0.0 && vPaperW.y > uPaperHero2.x + 0.07 ) {
  // hero cut-out: screen-door (no blending, depth stays correct for DOF / AO; the shadow pass is untouched)
  vec3 hD = uPaperHero.xyz - cameraPosition;
  float hL = length( hD );
  hD /= hL;
  vec3 hR = vPaperW - cameraPosition;
  float hT = dot( hR, hD );
  float hK = ( 1.0 - smoothstep( uPaperHero.w * 0.8, uPaperHero.w, length( hR - hD * hT ) ) ) * smoothstep( uPaperHero2.w, uPaperHero2.w + 0.16, hL - hT ) * uPaperHero2.y;
  if ( hK > 0.0 ) {
    vec2 hP = floor( gl_FragCoord.xy );
    float hN = fract( 52.9829189 * fract( dot( hP, vec2( 0.06711056, 0.00583715 ) ) ) );
    if ( hN < hK * ( 1.0 - uPaperHero2.z ) ) discard;
  }
}
#endif
{
  // printed art BEFORE fibre and lighting: albedo = mix( vertexColour, vertexColour * art, coverage ). Art faces are
  // authored white (times baked contact AO), so the art shows unmodified but keeps the AO, fibre, shadows, glow.
  vec4 paperArt = texture2D( uPaperArtTex, vPaperArtUv );
  float paperArtK = step( 0.0001, vPaperArtUv.x ) * uPaperArt.y * uPaperArt.z * max( paperArt.a, uPaperArt.x );
  // O10 build: die-cut holes inside art outlines (fence gaps, bridge arch, sails): w = alpha threshold on art faces.
  // Gold pass: the cut is anti-aliased (coverage from the alpha gradient -> alpha-to-coverage on the MSAA target).
  float paperIsArt = step( 0.0001, vPaperArtUv.x ) * uPaperArt.y;
  float paperAw = max( fwidth( paperArt.a ), 1e-4 );
  vec2 paperADx = dFdx( vPaperArtUv ), paperADy = dFdy( vPaperArtUv );
  float paperWpp = max( length( fwidth( vPaperW ) ) * 0.7071, 1e-5 );
  float paperRimK = 0.0;
  if ( paperIsArt > 0.5 ) {
    gPaperCov = clamp( ( paperArt.a - uPaperArt.w ) / paperAw + 0.5, 0.0, 1.0 );
    if ( gPaperCov < uPaperRim2.x ) discard;
    if ( uPaperRim.w > 0.0 ) {
      // pale cut-edge rim: the blurred alpha is probed on a ring of screen radius = rim width (even on screen at any
      // tilt; constant world width between the px clamps); a slow wobble keeps it hand-cut
      float rpx = clamp( uPaperRim.x / paperWpp, uPaperRim.y, uPaperRim.z );
      rpx *= 1.0 + uPaperRimCol.w * ( paperVNoiseF( vPaperW.xy * 9.0 + vPaperW.z * 5.0 ) - 0.5 ) * 2.0;
      vec2 ts = vec2( textureSize( uPaperArtTex, 0 ) );
      float lod = max( 0.0, log2( min( max( length( paperADx * ts ), length( paperADy * ts ) ), min( length( paperADx * ts ), length( paperADy * ts ) ) * 2.2 ) * max( rpx * 0.45, 1.0 ) ) ); // integrator: lod from the capped footprint too (edge-on cards sampled a mip so blurred that the whole card counted as rim)
      float amin = 1.0;
      float paperRimCap = min( length( paperADx ), length( paperADy ) ) * rpx * 2.2;
      for ( int i = 0; i < 6; i ++ ) {
        float an = float( i ) * 1.0471976 + 0.3;
        vec2 o = ( paperADx * cos( an ) + paperADy * sin( an ) ) * rpx;
        // integrator (gold pass): on a card seen nearly edge-on one screen pixel spans a large part of the sprite, so
        // the ring swallowed the whole card and it rendered as a white sliver; cap the probe in texture space
        float oL = length( o ); o *= min( 1.0, paperRimCap / max( oL, 1e-7 ) );
        amin = min( amin, textureLod( uPaperArtTex, vPaperArtUv + o, lod ).a );
      }
      paperRimK = ( 1.0 - smoothstep( 0.3, 0.7, amin ) ) * uPaperRim.w;
    }
  }
  diffuseColor.rgb = mix( diffuseColor.rgb, diffuseColor.rgb * paperArt.rgb, paperArtK );
  // the rim keeps the baked contact AO of the vertex colour (vColor) but not the print
  diffuseColor.rgb = mix( diffuseColor.rgb, uPaperRimCol.rgb * min( vec3( 1.0 ), vColor.rgb * 1.15 ), paperRimK );
}
vec3 paperAN = abs( vPaperNrm );
vec2 paperUv = ( paperAN.y >= max( paperAN.x, paperAN.z ) ) ? vPaperPos.xz : ( ( paperAN.x > paperAN.z ) ? vPaperPos.zy : vPaperPos.xy );
paperUv *= uPaperFibre.x;
vec4 paperF1 = texture2D( uPaperFibreTex, paperUv, -0.6 );
vec4 paperF2 = texture2D( uPaperFibreTex, paperUv * uPaperFibre2.y + vec2( 0.37, 0.61 ), -0.4 );
float paperTooth = ( paperF1.b - 0.5 ) + ( paperF2.b - 0.5 ) * uPaperFibre2.x;
float paperCloud = paperF1.a - 0.5;
#ifndef PAPER_NO_FIBRE
// crumple: the same sheet sampled coarse and blurred = broad low-relief creases (lighting only, see FRAG_NORMAL)
vec4 paperF3 = texture2D( uPaperFibreTex, paperUv.yx * uPaperFibre2.w + vec2( 0.13, 0.71 ), 1.6 );
// gold pass: + a broad soft mottle (the coarse sample) so large sheets never read as a flat fill at gameplay distance
diffuseColor.rgb *= max( 0.0, 1.0 + paperTooth * uPaperFibre.y * 6.25 + ( paperCloud + ( paperF3.a - 0.5 ) * uPaperLightB.x ) * uPaperFibre.z * 6.25 );
#endif
#ifndef PAPER_NO_VARY
diffuseColor.rgb *= ( 1.0 + vPaperTone * uPaperLight.w ) * vec3( 1.0 + vPaperTone * uPaperLight.w * 0.35, 1.0, 1.0 - vPaperTone * uPaperLight.w * 0.5 );
#endif
`;
var FRAG_POOL = `
if ( uPaperPoolCol.w > 0.0 ) {
  // lamp-post pools: warm light on the page and the paper around each lamp (cheap: no real lights, max 6)
  float pL = 0.0;
  for ( int i = 0; i < 6; i ++ ) {
    vec4 pp = uPaperPool[ i ];
    float pf = max( 0.0, 1.0 - distance( vPaperW, pp.xyz ) / uPaperPoolCol.w );
    pL += pp.w * pf * pf;
  }
  totalEmissiveRadiance += diffuseColor.rgb * uPaperPoolCol.rgb * pL;
}
`;
var FRAG_NORMAL = `
#ifndef PAPER_NO_FIBRE
{
	vec2 pn = ( paperF1.rg - 0.5 ) * 2.0 + ( paperF2.rg - 0.5 ) * 2.0 * uPaperFibre2.x;
	pn += ( paperF3.gr - 0.5 ) * 2.0 * uPaperFibre2.z / max( uPaperFibre.w, 1e-3 );
	vec3 q0 = dFdx( vViewPosition );
	vec3 q1 = dFdy( vViewPosition );
	vec2 st0 = dFdx( paperUv );
	vec2 st1 = dFdy( paperUv );
	vec3 q1perp = cross( q1, normal );
	vec3 q0perp = cross( normal, q0 );
	vec3 pT = q1perp * st0.x + q0perp * st1.x;
	vec3 pB = q1perp * st0.y + q0perp * st1.y;
	float pdet = max( dot( pT, pT ), dot( pB, pB ) );
	float pscale = ( pdet == 0.0 ) ? 0.0 : inversesqrt( pdet );
	normal = normalize( normal + ( pT * pn.x + pB * pn.y ) * pscale * uPaperFibre.w );
}
#endif
`;
function patchLightsBegin() {
	let src = ShaderChunk.lights_fragment_begin;
	src = src.replace("getShadow( directionalShadowMap[ i ]", "paperShadow( directionalShadowMap[ i ]");
	src = src.replace("getPointLightInfo( pointLight, geometryPosition, directLight );", "getPointLightInfo( pointLight, geometryPosition, directLight );\n		gPaperPoint = 1.0;");
	src = src.replace("getSpotLightInfo( spotLight, geometryPosition, directLight );", "getSpotLightInfo( spotLight, geometryPosition, directLight );\n		gPaperPoint = 0.0;");
	src = src.replace("getDirectionalLightInfo( directionalLight, directLight );", "getDirectionalLightInfo( directionalLight, directLight );\n		gPaperPoint = 0.0;");
	return src;
}
function patchColorVertex() {
	return ShaderChunk.color_vertex.replace("vColor *= color;", "vColor *= paperVC( color );").replace("vColor.rgb *= color;", "vColor.rgb *= paperVC( color );");
}
function extend(material, flags) {
	material.onBeforeCompile = (shader) => {
		Object.assign(shader.uniforms, paperUniforms);
		shader.vertexShader = shader.vertexShader.replace("#include <common>", "#include <common>\n" + VERT_PARS).replace("#include <color_vertex>", patchColorVertex()).replace("#include <project_vertex>", "#include <project_vertex>\n" + VERT_MAIN);
		shader.fragmentShader = shader.fragmentShader.replace("#include <common>", "#include <common>\n" + FRAG_PARS).replace("#include <lights_lambert_pars_fragment>", FRAG_LIGHTING).replace("#include <shadowmap_pars_fragment>", "#include <shadowmap_pars_fragment>\n" + FRAG_SHADOW).replace("#include <color_fragment>", "#include <color_fragment>\n" + FRAG_FIBRE).replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n" + FRAG_POOL).replace("#include <normal_fragment_maps>", "#include <normal_fragment_maps>\n" + FRAG_NORMAL).replace("#include <lights_fragment_begin>", patchLightsBegin()).replace("#include <dithering_fragment>", "#include <dithering_fragment>\ngl_FragColor.a = gPaperCov;");
	};
	material.customProgramCacheKey = () => "paper3|" + JSON.stringify(flags);
}
function createMaterials({ quality = "high" } = {}) {
	const cache = /* @__PURE__ */ new Map();
	let q = qualitySettings(quality);
	let textures = {};
	let fibreTex = null;
	let fibreSource = "none";
	let assetRepeat = 0;
	const _rimCol = new Color();
	const a2c = () => (q.msaa || 0) > 0 && CONFIG.lights.paper.alphaToCoverage !== false;
	const pcss = patchShadowChunk(q);
	paperState.pcss = pcss;
	function applyConfig() {
		const P = CONFIG.lights.paper;
		const u = paperUniforms;
		const ext = fibreSource === "assets";
		const scale = ext && (assetRepeat || P.assetFibreScale) || P.fibreScale;
		u.uPaperFibre.value.set(1 / scale, ext ? P.assetFibreTooth ?? P.fibreTooth : P.fibreTooth, P.fibreCloud, ext ? P.assetFibreNormal ?? P.fibreNormal : P.fibreNormal);
		u.uPaperFibre2.value.set(ext ? P.assetFibreFine ?? P.fibreFine : P.fibreFine, 3.73, P.crumple ?? 0, P.crumpleScale ?? .27);
		u.uPaperLight.value.set(P.wrap, P.translucency, CONFIG.lights.lantern.wrap ?? .5, P.toneVary);
		setColorCached(u.uPaperTransTint.value, P.translucencyTint);
		setColorCached(u.uPaperShadowLeak.value, CONFIG.lights.shadow.leak);
		const H = CONFIG.lights.cutout || {};
		u.uPaperHero.value.w = H.radius ?? .45;
		u.uPaperHero2.value.z = H.keep ?? .25;
		u.uPaperHero2.value.w = H.margin ?? .25;
		const R = P.rim || {};
		u.uPaperRim.value.set(R.width ?? .016, R.minPx ?? 1.5, R.maxPx ?? 3.4, R.strength ?? .9);
		if (setColorCached(_rimCol, R.color || "#fff0cf")) {}
		u.uPaperRimCol.value.set(_rimCol.r, _rimCol.g, _rimCol.b, R.wobble ?? .3);
		u.uPaperRim2.value.x = a2c() ? .04 : .5;
		u.uPaperLightB.value.x = P.fibreBroad ?? 1.2;
	}
	function setFibre(tex, source) {
		if (fibreTex && fibreTex !== tex) fibreTex.dispose();
		fibreTex = tex;
		fibreSource = source;
		paperUniforms.uPaperFibreTex.value = tex;
		applyConfig();
	}
	setFibre(makeProceduralFibre(512, q.anisotropy || 4), "procedural");
	let fromLoader = false;
	function useMaps(detail, normal) {
		const packed = packFromAssets(detail, normal, q.anisotropy || 4);
		if (!packed) return false;
		const r = detail.userData && (detail.userData.repeat || detail.userData.worldSize);
		assetRepeat = typeof r === "number" && r > 0 ? r : 0;
		setFibre(packed, "assets");
		return true;
	}
	/**
	* Safety net: fetch the textures agent's card maps straight from public/textures/manifest.json, so the
	* fibre is right even when the assets loader hands over no textures. Loader-supplied maps win.
	*/
	async function selfLoad() {
		try {
			if (typeof fetch !== "function" || typeof Image === "undefined" || CONFIG.lights.paper.useAssetTextures === false) return;
			const res = await fetch("./textures/manifest.json");
			if (!res.ok) return;
			const man = await res.json();
			const d = man.paper;
			const n = man.paperNormal;
			if (!d || !n || !d.file || !n.file) return;
			const load = (file) => new Promise((resolve) => {
				const im = new Image();
				im.onload = () => resolve(im);
				im.onerror = () => resolve(null);
				im.src = "./textures/" + file;
			});
			const [di, ni] = await Promise.all([load(d.file), load(n.file)]);
			if (!di || !ni || fromLoader) return;
			useMaps({
				image: di,
				flipY: d.flipY !== false,
				userData: { repeat: d.repeat }
			}, {
				image: ni,
				flipY: n.flipY !== false
			});
		} catch (err) {}
	}
	function defines() {
		const taps = q.shadowTaps || [8, 12];
		return {
			PAPER_BLOCKER_TAPS: taps[0],
			PAPER_PCF_TAPS: taps[1]
		};
	}
	const api = {
		palette: CONFIG.palette,
		uniforms: paperUniforms,
		/** true when the global PCSS shadow patch is active (false = three.js changed, stock hard shadows). */
		pcss,
		/**
		* Matte cardstock material. CACHED: same options -> same material instance (so meshes batch).
		* opts: { color = '#ffffff', map = null, side = THREE.DoubleSide, layer = 0 (ignored: one material for
		*   all layers), edge = true (ignored: cut edges come from vertex colours), emissive = null,
		*   emissiveIntensity = 1, alphaTest = 0, transparent = false,
		*   fibre = 'local' | 'world' | 'none'  (object-space fibre sticks to moving flaps; 'world' for a
		*     page mesh that is re-centred on the traveller, so the fibre does not swim),
		*   vary = true (per-sheet tone variation) }
		* Vertex colours are always multiplied in when the geometry has a `color` attribute (linear RGB);
		* a mesh without one renders as if its vertex colour were white.
		*/
		paper(opts = {}) {
			const { color = "#ffffff", map = null, side = 2, emissive = null, emissiveIntensity = 1, alphaTest = 0, transparent = false, fibre = "local", vary = true, variant = "" } = opts;
			const colorKey = color && color.isColor ? "#" + color.getHexString() : String(color).toLowerCase();
			const emKey = emissive ? emissive.isColor ? "#" + emissive.getHexString() : String(emissive).toLowerCase() : "-";
			const key = [
				colorKey,
				map ? map.uuid : "-",
				side,
				emKey,
				emissive ? emissiveIntensity : 1,
				alphaTest,
				transparent ? 1 : 0,
				fibre,
				vary ? 1 : 0
			].join("|") + (variant ? "|" + variant : "");
			let m = cache.get(key);
			if (!m) {
				m = new MeshLambertMaterial({
					color,
					map,
					side,
					alphaTest,
					transparent,
					vertexColors: true
				});
				if (emissive) {
					m.emissive = new Color(emissive);
					m.emissiveIntensity = emissiveIntensity;
				}
				m.shadowSide = 2;
				m.alphaToCoverage = a2c() && !transparent;
				m.name = "paper:" + key;
				m.defines = { ...defines() };
				if (fibre === "world") m.defines.PAPER_FIBRE_WORLD = 1;
				if (fibre === "none") m.defines.PAPER_NO_FIBRE = 1;
				if (!vary) m.defines.PAPER_NO_VARY = 1;
				if (variant === "traveller") m.defines.PAPER_NO_CUTOUT = 1;
				extend(m, {
					fibre,
					vary: !!vary,
					cut: variant !== "traveller"
				});
				cache.set(key, m);
			}
			return m;
		},
		/**
		* Called by main.js after assets load. Uses the textures agent's maps when present
		* ({ card | paper: grey albedo detail, cardNormal | paperNormal: tangent normal }), else keeps the
		* procedural fibre. Never throws.
		*/
		setTextures(t) {
			textures = t || {};
			const art = textures.art || null;
			if (art && art.isTexture) {
				art.colorSpace = SRGBColorSpace;
				art.wrapS = art.wrapT = ClampToEdgeWrapping;
				art.generateMipmaps = true;
				art.minFilter = LinearMipmapLinearFilter;
				art.magFilter = LinearFilter;
				art.anisotropy = Math.max(q.anisotropy || 4, 8);
				art.needsUpdate = true;
			}
			paperUniforms.uPaperArtTex.value = art && art.isTexture ? art : null;
			paperUniforms.uPaperArt.value.y = art && art.isTexture ? 1 : 0;
			if (CONFIG.lights.paper.useAssetTextures === false) return;
			if (useMaps(textures.card || textures.cardAlbedo || textures.paper || null, textures.cardNormal || textures.paperNormal || null)) fromLoader = true;
		},
		/** Resolves when the self-loaded fibre maps (if any) are in place. Never rejects. */
		ready: null,
		get textures() {
			return textures;
		},
		get fibreSource() {
			return fibreSource;
		},
		/** Per-frame hook: re-reads the tunables so live config edits (and check scripts) take effect. */
		update(dt) {
			applyConfig();
		},
		setQuality(level) {
			q = qualitySettings(level);
			const d = defines();
			for (const m of cache.values()) {
				const want = a2c() && !m.transparent;
				if (m.alphaToCoverage !== want) {
					m.alphaToCoverage = want;
					m.needsUpdate = true;
				}
				if (m.defines.PAPER_BLOCKER_TAPS !== d.PAPER_BLOCKER_TAPS || m.defines.PAPER_PCF_TAPS !== d.PAPER_PCF_TAPS) {
					Object.assign(m.defines, d);
					m.needsUpdate = true;
				}
			}
			if (fibreTex) {
				fibreTex.anisotropy = q.anisotropy || 4;
				fibreTex.needsUpdate = true;
			}
		},
		dispose() {
			for (const m of cache.values()) m.dispose();
			cache.clear();
			if (fibreTex) fibreTex.dispose();
		}
	};
	api.ready = selfLoad();
	return api;
}
// src/render/lights.js
function createLights({ scene, quality = "high" }) {
	const L = CONFIG.lights;
	let q = qualitySettings(quality);
	scene.background = new Color(L.background);
	const hemi = new HemisphereLight(L.hemi.sky, L.hemi.ground, L.hemi.intensity);
	hemi.name = "hemi";
	const key = new DirectionalLight(L.key.color, L.key.intensity);
	key.name = "key";
	key.castShadow = q.shadows;
	key.shadow.mapSize.set(q.shadowMapSize, q.shadowMapSize);
	key.shadow.bias = L.shadow.lightSize;
	key.shadow.normalBias = L.shadow.normalBias;
	key.shadow.radius = 2 * L.shadow.extent;
	const fill = new DirectionalLight(L.fill.color, L.fill.intensity);
	fill.name = "fill";
	const lantern = new PointLight(L.lantern.color, L.lantern.intensity, L.lantern.distance, L.lantern.decay);
	lantern.name = "lantern-light";
	scene.add(hemi, key, key.target, fill, fill.target, lantern);
	const keyDir = new Vector3(-.6, .7, .3).normalize();
	const fillDir = new Vector3(.9, .3, -.2).normalize();
	const _fwd = new Vector3();
	const _up = new Vector3();
	const _right = new Vector3();
	const _back = new Vector3();
	const _c = new Vector3();
	const _lr = new Vector3();
	const _lu = new Vector3();
	const _v = new Vector3();
	const WORLD_UP = new Vector3(0, 1, 0);
	let extent = -1;
	function setDir(out, azDeg, elDeg) {
		const az = MathUtils.degToRad(azDeg);
		const el = MathUtils.degToRad(elDeg);
		out.copy(_back).multiplyScalar(Math.cos(az) * Math.cos(el)).addScaledVector(_right, Math.sin(az) * Math.cos(el));
		out.y = Math.sin(el);
		return out.normalize();
	}
	function applyTunables() {
		setColorCached(key.color, L.key.color);
		key.intensity = L.key.intensity;
		setColorCached(fill.color, L.fill.color);
		fill.intensity = L.fill.intensity;
		setColorCached(hemi.color, L.hemi.sky);
		setColorCached(hemi.groundColor, L.hemi.ground);
		hemi.intensity = L.hemi.intensity;
		setColorCached(lantern.color, L.lantern.color);
		lantern.intensity = L.lantern.intensity;
		lantern.distance = L.lantern.distance;
		lantern.decay = L.lantern.decay;
		key.shadow.normalBias = L.shadow.normalBias;
		key.shadow.intensity = L.shadow.intensity;
	}
	return {
		key,
		fill,
		hemi,
		lantern,
		/** Keep the rig, the shadow frustum and the lantern on the traveller / camera. */
		update(dt, traveller, camera) {
			applyTunables();
			const S = L.shadow;
			const p = traveller.position;
			let dist = 18;
			let sinPitch = .8;
			let fovTan = .27;
			let aspect = 16 / 9;
			_c.set(p.x, 0, p.z);
			_right.set(1, 0, 0);
			_back.set(0, 0, 1);
			if (camera) {
				camera.updateMatrixWorld();
				const e = camera.matrixWorld.elements;
				_right.set(e[0], 0, e[2]);
				_up.set(e[4], 0, e[6]);
				_fwd.set(-e[8], -e[9], -e[10]);
				sinPitch = Math.min(1, Math.max(.2, -_fwd.y));
				_back.set(-(_fwd.x + _up.x), 0, -(_fwd.z + _up.z));
				if (!L.cameraRelative) {
					_right.set(1, 0, 0);
					_back.set(0, 0, 1);
				}
				if (_back.lengthSq() < 1e-8) _back.set(0, 0, 1);
				_back.normalize();
				if (_right.lengthSq() < 1e-8) _right.set(1, 0, 0);
				_right.normalize();
				_v.setFromMatrixPosition(camera.matrixWorld);
				if (_fwd.y < -.05) {
					const t = Math.min(200, _v.y / -_fwd.y);
					_c.copy(_v).addScaledVector(_fwd, t);
					_c.y = 0;
					dist = t;
				} else dist = _v.distanceTo(_c);
				if (camera.isPerspectiveCamera) {
					fovTan = Math.tan(MathUtils.degToRad(camera.fov) / 2);
					aspect = camera.aspect;
				}
			}
			setDir(keyDir, L.key.azimuthDeg, L.key.elevationDeg);
			setDir(fillDir, L.fill.azimuthDeg, L.fill.elevationDeg);
			const halfW = dist * fovTan * aspect;
			const halfD = dist * fovTan / sinPitch;
			let want = Math.max(halfW, halfD) * S.fit + S.pad;
			want = Math.min(S.maxExtent, Math.max(S.minExtent, Math.ceil(want * 2) / 2));
			const size = q.shadowMapSize;
			const cam = key.shadow.camera;
			if (want !== extent || cam.far !== S.far || cam.near !== S.near) {
				extent = want;
				cam.left = -extent;
				cam.right = extent;
				cam.top = extent;
				cam.bottom = -extent;
				cam.near = S.near;
				cam.far = S.far;
				cam.updateProjectionMatrix();
			}
			const texel = 2 * extent / size;
			_lr.crossVectors(WORLD_UP, keyDir).normalize();
			_lu.crossVectors(keyDir, _lr).normalize();
			const a = Math.round(_c.dot(_lr) / texel) * texel;
			const b = Math.round(_c.dot(_lu) / texel) * texel;
			key.target.position.set(0, 0, 0).addScaledVector(_lr, a).addScaledVector(_lu, b).addScaledVector(keyDir, _c.dot(keyDir));
			key.position.copy(key.target.position).addScaledVector(keyDir, S.distance);
			key.target.updateMatrixWorld();
			key.updateMatrixWorld();
			fill.target.position.copy(_c);
			fill.position.copy(_c).addScaledVector(fillDir, 30);
			fill.target.updateMatrixWorld();
			key.shadow.radius = paperState.pcss ? 2 * extent : 1;
			key.shadow.bias = paperState.pcss ? S.lightSize : -4e-4;
			{
				const H = L.cutout || {};
				let k = H.enabled === false || !camera ? 0 : 1;
				if (k) {
					_v.setFromMatrixPosition(camera.matrixWorld);
					const d = _v.distanceTo(p);
					k = Math.min(1, Math.max(0, (d - 2.5) / 1.5)) * Math.min(1, Math.max(0, (.985 - sinPitch) / .03));
				}
				paperUniforms.uPaperHero.value.set(p.x, p.y + (H.chest ?? .3), p.z, H.radius ?? .45);
				paperUniforms.uPaperHero2.value.x = p.y;
				paperUniforms.uPaperHero2.value.y = k * (H.strength ?? 1);
			}
			const holder = traveller.group && traveller.group.getObjectByName("lantern");
			if (holder) {
				holder.getWorldPosition(_v);
				lantern.position.set(_v.x, _v.y + L.lantern.lift, _v.z);
			} else lantern.position.set(p.x, p.y + L.lantern.height + L.lantern.lift, p.z);
		},
		setQuality(level) {
			q = qualitySettings(level);
			key.castShadow = q.shadows;
			if (key.shadow.mapSize.x !== q.shadowMapSize) {
				key.shadow.mapSize.set(q.shadowMapSize, q.shadowMapSize);
				if (key.shadow.map) {
					key.shadow.map.dispose();
					key.shadow.map = null;
				}
			}
			extent = -1;
		},
		dispose() {
			scene.remove(hemi, key, key.target, fill, fill.target, lantern);
			if (key.shadow.map) key.shadow.map.dispose();
		}
	};
}
// src/render/post.js
var hypot2$1 = (a, b) => Math.sqrt(a * a + b * b);
var VERT = `
varying vec2 vUv;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4( position.xy, 0.0, 1.0 );
}
`;
var COMMON = `
precision highp float;
varying vec2 vUv;
uniform vec4 uProj;  // near, far, tan(fov/2), aspect
uniform vec4 uDofA;  // focus view depth, focus uv.y, depth scale kD, depth weight
uniform vec4 uDofB;  // half band, ramp, max blur (px, drawing buffer), near gain
uniform vec4 uDofC;  // far gain, enabled, sage grade amount (composite), -
float viewZ( float d ) { return ( uProj.x * uProj.y ) / ( uProj.y - d * ( uProj.y - uProj.x ) ); }
float cocAt( vec2 uv, float z ) {
  float sY = uv.y - uDofA.y;
  float sD = ( z - uDofA.x ) / uDofA.x * uDofA.z;
  float c = mix( sY, sD, uDofA.w );
  float a = min( max( abs( c ) - uDofB.x, 0.0 ) / uDofB.y, 1.0 );
  a = a * a * ( 3.0 - 2.0 * a ) * 0.35 + a * 0.65;
  float g = c < 0.0 ? uDofB.w : uDofC.x;
  return sign( c ) * min( a * g, 1.0 ) * uDofB.z * uDofC.y;
}
float ign( vec2 p ) { return fract( 52.9829189 * fract( dot( p, vec2( 0.06711056, 0.00583715 ) ) ) ); }
float luma( vec3 c ) { return dot( c, vec3( 0.2126, 0.7152, 0.0722 ) ); }
// World-space light falloff applied to the lit image (works for every material in the scene):
// the key side (screen-left) is brighter and warmer, the fill side dimmer and cooler, and everything
// fades to the dark surround with distance from the focus point (fog-to-dark at the far page).
uniform mat4 uCamWorld;
uniform vec4 uGobo;   // screen-right axis on the ground (x, z), 1 / radius, key falloff
uniform vec4 uGobo2;  // tint, fade start, fade end, fade amount
uniform vec3 uFocusW;
uniform vec3 uFadeA;
uniform vec3 uFadeB;
vec3 gradeWorld( vec3 col, vec2 uv, float z, float rawDepth ) {
  vec3 pv = vec3( ( uv * 2.0 - 1.0 ) * vec2( uProj.z * uProj.w, uProj.z ) * z, - z );
  vec2 rel = ( uCamWorld * vec4( pv, 1.0 ) ).xz - uFocusW.xz;
  float t = clamp( dot( rel, uGobo.xy ) * uGobo.z, -1.0, 1.0 );
  col *= ( 1.0 - uGobo.w * t ) * vec3( 1.0 - uGobo2.x * 0.5 * t, 1.0, 1.0 + uGobo2.x * t );
  float f = rawDepth >= 0.99999 ? 1.0 : smoothstep( uGobo2.y, uGobo2.z, length( rel ) );
  return mix( col, mix( uFadeA, uFadeB, smoothstep( -0.5, 0.9, t ) ), f * uGobo2.w );
}
`;
var AO_FRAG = COMMON + `
uniform sampler2D tDepth;
uniform vec2 uTexel;   // full-res texel
uniform vec4 uAo;      // radius (world), intensity, bias (world), -
vec3 vpos( vec2 uv ) {
  float z = viewZ( textureLod( tDepth, uv, 0.0 ).r );
  return vec3( ( uv * 2.0 - 1.0 ) * vec2( uProj.z * uProj.w, uProj.z ) * z, - z );
}
void main() {
  float d0 = textureLod( tDepth, vUv, 0.0 ).r;
  if ( d0 >= 0.99999 ) { gl_FragColor = vec4( 1.0 ); return; }
  vec3 P = vpos( vUv );
  vec2 t = uTexel * 2.0;
  vec3 pr = vpos( vUv + vec2( t.x, 0.0 ) ), pl = vpos( vUv - vec2( t.x, 0.0 ) );
  vec3 pu = vpos( vUv + vec2( 0.0, t.y ) ), pd = vpos( vUv - vec2( 0.0, t.y ) );
  vec3 dxv = abs( pr.z - P.z ) < abs( P.z - pl.z ) ? pr - P : P - pl;
  vec3 dyv = abs( pu.z - P.z ) < abs( P.z - pd.z ) ? pu - P : P - pd;
  vec3 N = normalize( cross( dxv, dyv ) );
  float z = - P.z;
  float rUv = uAo.x / ( 2.0 * z * uProj.z );
  float phi = ign( gl_FragCoord.xy ) * 6.2831853;
  float occ = 0.0;
  for ( int i = 0; i < AO_TAPS; i ++ ) {
    float fi = float( i );
    float r = sqrt( ( fi + 0.5 ) / float( AO_TAPS ) );
    float a = fi * 2.399963229728653 + phi;
    vec2 o = vec2( cos( a ), sin( a ) ) * r * rUv;
    vec3 v = vpos( vUv + vec2( o.x / uProj.w, o.y ) ) - P;
    float dv = dot( v, v );
    float fall = clamp( 1.0 - dv / ( uAo.x * uAo.x ), 0.0, 1.0 );
    occ += min( max( dot( v, N ) - uAo.z, 0.0 ) / ( dv + 1e-4 ) * uAo.x, 1.6 ) * fall;
  }
  float ao = clamp( 1.0 - uAo.y * occ / float( AO_TAPS ), 0.0, 1.0 );
  gl_FragColor = vec4( ao, ao, ao, 1.0 );
}
`;
var PRE_FRAG = COMMON + `
uniform sampler2D tScene;
uniform sampler2D tDepth;
uniform sampler2D tAo;
uniform vec2 uTexel;    // full-res texel
uniform vec3 uAoTint;
uniform float uAoOn;
void main() {
  vec3 acc = vec3( 0.0 );
  float wsum = 0.0;
  float coc = 0.0;
  for ( int i = 0; i < 4; i ++ ) {
    vec2 o = ( vec2( float( i & 1 ), float( i >> 1 ) ) - 0.5 ) * uTexel;
    vec2 uv = vUv + o;
    float dr = textureLod( tDepth, uv, 0.0 ).r;
    float zz = viewZ( dr );
    float c = cocAt( uv, zz );
    // favour the blurrier samples so a sharp foreground edge never leaks its colour into the blur buffer
    float w = 0.02 + abs( c );
    acc += gradeWorld( min( textureLod( tScene, uv, 0.0 ).rgb, vec3( 24.0 ) ), uv, zz, dr ) * w;
    wsum += w;
    if ( abs( c ) > abs( coc ) ) coc = c;
  }
  vec3 col = acc / wsum;
  if ( uAoOn > 0.5 ) {
    vec2 t = uTexel * 2.0;
    float ao = 0.25 * ( texture2D( tAo, vUv + t * vec2( 0.5, 0.5 ) ).r + texture2D( tAo, vUv + t * vec2( -0.5, 0.5 ) ).r
      + texture2D( tAo, vUv + t * vec2( 0.5, -0.5 ) ).r + texture2D( tAo, vUv + t * vec2( -0.5, -0.5 ) ).r );
    col *= mix( uAoTint, vec3( 1.0 ), ao );
  }
  gl_FragColor = vec4( col, coc );
}
`;
var TILE_FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D tPre;
uniform vec2 uHalfTexel;
void main() {
  float m = 0.0;
  for ( int y = 0; y < 4; y ++ ) {
    for ( int x = 0; x < 4; x ++ ) {
      vec2 o = ( vec2( float( x ), float( y ) ) - 1.5 ) * uHalfTexel;
      m = max( m, - textureLod( tPre, vUv + o, 0.0 ).a );
    }
  }
  gl_FragColor = vec4( m, 0.0, 0.0, 1.0 );
}
`;
var GATHER_FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D tPre;
uniform sampler2D tTile;
uniform vec2 uTexel;       // full-res texel
uniform vec2 uTileTexel;
uniform vec2 uTaps[ DOF_TAPS ];
uniform float uBoost;
float ign( vec2 p ) { return fract( 52.9829189 * fract( dot( p, vec2( 0.06711056, 0.00583715 ) ) ) ); }
float luma( vec3 c ) { return dot( c, vec3( 0.2126, 0.7152, 0.0722 ) ); }
void main() {
  vec4 c0 = textureLod( tPre, vUv, 0.0 );
  float cc = c0.a;
  float nearMax = texture2D( tTile, vUv ).r;
  nearMax = max( nearMax, texture2D( tTile, vUv + uTileTexel * vec2( 1.3, 1.3 ) ).r );
  nearMax = max( nearMax, texture2D( tTile, vUv + uTileTexel * vec2( -1.3, 1.3 ) ).r );
  nearMax = max( nearMax, texture2D( tTile, vUv + uTileTexel * vec2( 1.3, -1.3 ) ).r );
  nearMax = max( nearMax, texture2D( tTile, vUv + uTileTexel * vec2( -1.3, -1.3 ) ).r );
  // dilate only for a real foreground silhouette; inside a smooth ramp the pixel keeps its own radius
  // (otherwise most taps fall outside its own disc and the result turns blocky)
  float R = mix( abs( cc ), max( abs( cc ), nearMax ), smoothstep( 2.0, 6.0, nearMax - abs( cc ) ) );
  if ( R < 0.6 ) { gl_FragColor = vec4( c0.rgb, 0.0 ); return; }
  float phi = ign( gl_FragCoord.xy ) * 6.2831853;
  float cs = cos( phi ), sn = sin( phi );
  mat2 rot = mat2( cs, sn, - sn, cs );
  vec3 acc = c0.rgb * 0.15;
  float wsum = 0.15;
  float nearW = 0.0;
  float wnorm = 0.0;
  for ( int i = 0; i < DOF_TAPS; i ++ ) {
    vec2 o = rot * uTaps[ i ];
    float tr = length( uTaps[ i ] );
    float d = tr * R;
    vec4 s = textureLod( tPre, vUv + o * R * uTexel, 0.0 );
    float sAbs = abs( s.a );
    // a tap behind the centre may not spread further than the centre is blurred itself
    if ( s.a > cc ) sAbs = min( sAbs, abs( cc ) * 2.0 );
    // taps are denser toward the centre (r = u^0.75); tr^(2/3) restores the area weighting
    float w = smoothstep( d - 1.0, d + 1.0, sAbs ) * pow( tr, 0.6667 );
    // near weight ramps in like the far-side blend (a hard step at -0.5 px drew a visible line where the
    // full-res sharp layer switched to the half-res layer on a smooth near-field ramp)
    float isNear = w * smoothstep( 1.0, 3.4, - s.a );
    wnorm += pow( tr, 0.6667 );
    w *= 1.0 + uBoost * min( luma( s.rgb ), 6.0 );
    acc += s.rgb * w;
    wsum += w;
    nearW += isNear;
  }
  gl_FragColor = vec4( acc / wsum, clamp( 2.0 * nearW / max( wnorm, 1e-3 ), 0.0, 1.0 ) );
}
`;
var FILL_FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D tGather;
uniform sampler2D tPre;
uniform vec2 uTexel;     // full-res texel
uniform vec2 uFill;      // spacing factor, max blur px
void main() {
  vec4 c = texture2D( tGather, vUv );
  float R = max( abs( textureLod( tPre, vUv, 0.0 ).a ), c.a * uFill.y * 0.6 );
  float f = clamp( R * uFill.x, 0.0, 5.0 );
  vec2 o = uTexel * f;
  vec4 s = c * 0.3;
  s += texture2D( tGather, vUv + vec2( o.x, o.y * 0.4 ) ) * 0.175;
  s += texture2D( tGather, vUv + vec2( - o.x, - o.y * 0.4 ) ) * 0.175;
  s += texture2D( tGather, vUv + vec2( - o.x * 0.4, o.y ) ) * 0.175;
  s += texture2D( tGather, vUv + vec2( o.x * 0.4, - o.y ) ) * 0.175;
  gl_FragColor = s;
}
`;
var BLOOM_DOWN_FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D tPre;
uniform vec2 uHalfTexel;
uniform float uThreshold;
vec3 bright( vec2 uv ) {
  vec3 c = texture2D( tPre, uv ).rgb;
  float l = max( c.r, max( c.g, c.b ) );
  return c * clamp( ( l - uThreshold ) / max( l, 1e-4 ), 0.0, 1.0 );
}
void main() {
  vec3 c = bright( vUv + uHalfTexel * vec2( 1.0, 1.0 ) ) + bright( vUv + uHalfTexel * vec2( -1.0, 1.0 ) )
    + bright( vUv + uHalfTexel * vec2( 1.0, -1.0 ) ) + bright( vUv + uHalfTexel * vec2( -1.0, -1.0 ) );
  gl_FragColor = vec4( min( c * 0.25, vec3( 8.0 ) ), 1.0 );
}
`;
var BLOOM_BLUR_FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D tSrc;
uniform vec2 uDir;   // texel * direction
void main() {
  vec3 c = texture2D( tSrc, vUv ).rgb * 0.227027;
  c += ( texture2D( tSrc, vUv + uDir * 1.384615 ).rgb + texture2D( tSrc, vUv - uDir * 1.384615 ).rgb ) * 0.316216;
  c += ( texture2D( tSrc, vUv + uDir * 3.230769 ).rgb + texture2D( tSrc, vUv - uDir * 3.230769 ).rgb ) * 0.070270;
  gl_FragColor = vec4( c, 1.0 );
}
`;
var COMPOSITE_FRAG = COMMON + `
uniform sampler2D tScene;
uniform sampler2D tDepth;
uniform sampler2D tBlur;
uniform sampler2D tBloom;
uniform sampler2D tSpill;
uniform float uSpill;
uniform sampler2D tAo;
uniform vec2 uTexel;       // full-res texel
uniform vec4 uTone;        // exposure, contrast, saturation, shadow lift
uniform vec3 uShadowTint;
uniform vec4 uLens;        // vignette, grain, grain size, chroma (px)
uniform vec4 uFx;          // bloom, ao on, rim strength, split
uniform vec3 uAoTint;
uniform vec3 uRimColor;
uniform vec3 uSeed;        // frame seed, rim width px, view mode
uniform float uSharpen;
uniform vec3 uTint;
vec3 aces( vec3 x ) { return clamp( ( x * ( 2.51 * x + 0.03 ) ) / ( x * ( 2.43 * x + 0.59 ) + 0.14 ), 0.0, 1.0 ); }
vec3 toSRGB( vec3 c ) { return mix( c * 12.92, 1.055 * pow( max( c, vec3( 0.0 ) ), vec3( 1.0 / 2.4 ) ) - 0.055, step( 0.0031308, c ) ); }
float hash12( vec2 p ) {
  vec3 p3 = fract( vec3( p.xyx ) * 0.1031 );
  p3 += dot( p3, p3.yzx + 33.33 );
  return fract( ( p3.x + p3.y ) * p3.z );
}
void main() {
  float rawD = textureLod( tDepth, vUv, 0.0 ).r;
  float z = viewZ( rawD );
  float coc = cocAt( vUv, z );
  float rw = uSeed.y;
  vec2 ox = vec2( uTexel.x * rw, 0.0 ), oy = vec2( 0.0, uTexel.y * rw );
  float zl = viewZ( textureLod( tDepth, vUv - ox, 0.0 ).r ), zr = viewZ( textureLod( tDepth, vUv + ox, 0.0 ).r );
  float zd = viewZ( textureLod( tDepth, vUv - oy, 0.0 ).r ), zu = viewZ( textureLod( tDepth, vUv + oy, 0.0 ).r );

  // --- sharp layer (very slight chromatic softness toward the frame edge) -----------------------------
  vec3 sharp = textureLod( tScene, vUv, 0.0 ).rgb;
  #ifdef POST_CHROMA
    vec2 cd = ( vUv - 0.5 );
    vec2 co = cd * dot( cd, cd ) * 4.0 * uLens.w * uTexel;
    sharp.r = textureLod( tScene, vUv + co, 0.0 ).r;
    sharp.b = textureLod( tScene, vUv - co, 0.0 ).b;
  #endif
  #ifdef POST_SHARPEN
    // 4 taps around the pixel: an unsharp mask inside the focus band (bite of a real macro lens; the
    // MSAA resolve is soft), turning into a small full-res blur for CoC 0.5-3 px so detail fades out
    // gradually before the half-res bokeh layer takes over.
    float ac = abs( coc );
    vec2 mo = uTexel * max( 0.75, ac * 0.8 );
    vec3 sb = 0.25 * ( textureLod( tScene, vUv + mo * vec2( 1.0, 0.4 ), 0.0 ).rgb + textureLod( tScene, vUv + mo * vec2( -1.0, -0.4 ), 0.0 ).rgb
      + textureLod( tScene, vUv + mo * vec2( -0.4, 1.0 ), 0.0 ).rgb + textureLod( tScene, vUv + mo * vec2( 0.4, -1.0 ), 0.0 ).rgb );
    vec3 crisp = max( sharp + clamp( sharp - sb, vec3( -0.25 ), vec3( 0.25 ) ) * uSharpen, vec3( 0.0 ) );
    sharp = mix( crisp, mix( sharp, sb, 0.8 ), smoothstep( 0.4, 1.6, ac ) );
  #endif
  sharp = gradeWorld( sharp, vUv, z, rawD );
  #ifdef POST_AO
    if ( uFx.y > 0.5 ) {
      vec2 t = uTexel * 2.0;
      float ao = 0.25 * ( texture2D( tAo, vUv + t * vec2( 0.6, 0.6 ) ).r + texture2D( tAo, vUv + t * vec2( -0.6, 0.6 ) ).r
        + texture2D( tAo, vUv + t * vec2( 0.6, -0.6 ) ).r + texture2D( tAo, vUv + t * vec2( -0.6, -0.6 ) ).r );
      sharp *= mix( uAoTint, vec3( 1.0 ), ao );
    }
  #endif

  // --- pale paper-core line where this pixel is the front side of a depth silhouette ---------------
  // gold pass: two rings (inner axis taps + outer diagonal taps) give a smooth 2-3 px cream band instead of a 1 px
  // dotted line; the depth step is relative to the view distance so far cards keep their rim; no block jitter.
  float zfar = max( max( zl, zr ), max( zd, zu ) );
  vec2 od = uTexel * rw * 1.55;
  float zfar2 = max( max( viewZ( textureLod( tDepth, vUv + od, 0.0 ).r ), viewZ( textureLod( tDepth, vUv - od, 0.0 ).r ) ),
    max( viewZ( textureLod( tDepth, vUv + vec2( od.x, - od.y ), 0.0 ).r ), viewZ( textureLod( tDepth, vUv + vec2( - od.x, od.y ), 0.0 ).r ) ) );
  float zs = 0.0035 * z;
  // fixer (round 3): uFx.z < 0 = DARK card edge - the cream band read as a white sticker halo round every piece
  // (gold: a thin darker card edge); then uRimColor is a multiplier on the piece's own colour
  float rim = max( smoothstep( zs, zs * 2.6, zfar - z ), 0.55 * smoothstep( zs * 1.4, zs * 3.4, zfar2 - z ) ) * abs( uFx.z );
  if ( rim > 0.0 ) {
    rim *= 1.0 - smoothstep( 1.5, 4.0, abs( coc ) );
    float mc = max( sharp.r, max( sharp.g, sharp.b ) );
    vec3 target = uFx.z < 0.0 ? sharp * uRimColor : max( uRimColor * clamp( mc * 1.7 + 0.012, 0.0, 0.95 ), sharp );
    sharp = mix( sharp, target, clamp( rim, 0.0, 1.0 ) );
  }

  // --- blur layer; the lookup is pushed away from sharp silhouettes so they do not halo -------------
  vec2 g = vec2( abs( cocAt( vUv + ox, zr ) ) - abs( cocAt( vUv - ox, zl ) ), abs( cocAt( vUv + oy, zu ) ) - abs( cocAt( vUv - oy, zd ) ) );
  float gl = length( g );
  vec2 shift = gl > 1e-4 ? g / gl * min( gl * 0.35, 1.0 ) * 2.2 : vec2( 0.0 );
  vec4 blur = texture2D( tBlur, vUv + shift * uTexel );
  #ifdef POST_SHARPEN
    float blend = max( smoothstep( 1.2, 3.6, abs( coc ) ), blur.a );
  #else
    float blend = max( smoothstep( 0.5, 2.2, abs( coc ) ), blur.a );
  #endif
  vec3 col = mix( sharp, blur.rgb, blend * uDofC.y );

  #ifdef POST_BLOOM
    col += texture2D( tBloom, vUv ).rgb * uFx.x;
    // screen-space light spill: the very wide blur of the glowing panes / lantern lights the paper around them
    if ( uSpill > 0.0 ) {
      vec3 sp = texture2D( tSpill, vUv ).rgb;
      float cl = max( col.r, max( col.g, col.b ) );
      col += sp * uSpill * ( col * 5.0 + 0.035 ) * ( 1.0 - smoothstep( 0.5, 1.4, cl ) );
    }
  #endif

  // --- lens + film ------------------------------------------------------------------------------------
  vec2 vc = ( vUv - 0.5 ) * vec2( uProj.w / 1.7778, 1.0 ) * vec2( 1.0, 1.12 );
  float vr = dot( vc, vc ) * 2.4;
  col *= 1.0 - uLens.x * smoothstep( 0.12, 1.25, vr ) * 1.25;
  col = aces( col * uTone.x * uTint );
  float l = luma( col );
  col = mix( vec3( l ), col, uTone.z );
  col = toSRGB( max( col, 0.0 ) );
  col = ( col - 0.42 ) * uTone.y + 0.42;
  // yellow-green field under the warm key reads as video-game grass: pull only those hues toward sage
  // (cream, ochre, terracotta and the teal river are outside the mask)
  float gm = smoothstep( 0.1, 0.3, col.g - col.b ) * smoothstep( -0.2, -0.05, col.g - col.r ) * uDofC.z;
  col = mix( col, mix( vec3( luma( col ) ), col, 0.45 ) * vec3( 0.97, 1.0, 1.03 ), clamp( gm, 0.0, 1.0 ) );
  col += uShadowTint * uTone.w * ( 1.0 - smoothstep( 0.0, 0.45, l ) );
  float sx = vUv.x * 2.0 - 1.0;
  col *= vec3( 1.0 - uFx.w * sx, 1.0 - uFx.w * 0.25 * sx, 1.0 + uFx.w * 1.3 * sx );
  #ifdef POST_GRAIN
    vec2 gp = gl_FragCoord.xy / uLens.z;
    vec2 gi = floor( gp ), gf = fract( gp );
    vec2 so = vec2( uSeed.x * 0.618, uSeed.x * 0.377 );
    float n00 = hash12( gi + so ), n10 = hash12( gi + vec2( 1.0, 0.0 ) + so ), n01 = hash12( gi + vec2( 0.0, 1.0 ) + so ), n11 = hash12( gi + vec2( 1.0, 1.0 ) + so );
    float n = mix( mix( n00, n10, gf.x ), mix( n01, n11, gf.x ), gf.y ) + hash12( gl_FragCoord.xy + so * 1.7 ) * 0.5 - 0.75;
    float gl2 = luma( col );
    col += n * uLens.y * 2.2 * ( 0.35 + 1.3 * sqrt( clamp( gl2, 0.0, 1.0 ) ) * ( 1.0 - 0.6 * gl2 ) );
  #endif
  if ( uSeed.z > 0.5 ) {
    if ( uSeed.z < 1.5 ) col = vec3( max( coc, 0.0 ), max( - coc, 0.0 ), blur.a * uDofB.z ) / uDofB.z;
    else if ( uSeed.z < 2.5 ) col = vec3( texture2D( tAo, vUv ).r );
    else if ( uSeed.z < 3.5 ) col = toSRGB( aces( blur.rgb ) );
    else col = toSRGB( aces( textureLod( tScene, vUv, 0.0 ).rgb ) );
  }
  gl_FragColor = vec4( clamp( col, 0.0, 1.0 ), 1.0 );
}
`;
function acesJS(x) {
	return Math.min(1, Math.max(0, x * (2.51 * x + .03) / (x * (2.43 * x + .59) + .14)));
}
function toSRGBJS(c) {
	return c < .0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - .055;
}
function toneJS(rgb, P) {
	const tint = P.tint || [
		1,
		1,
		1
	];
	const t = rgb.map((v, i) => acesJS(v * P.exposure * tint[i]));
	const l = .2126 * t[0] + .7152 * t[1] + .0722 * t[2];
	return t.map((v) => {
		return (toSRGBJS(Math.max(0, l + (v - l) * P.saturation)) - .42) * P.contrast + .42 + 0;
	});
}
/** Linear scene colour whose tone-mapped result is the given sRGB hex (centre of frame, no vignette/grain). */
function inverseTone(hex, P, out) {
	const target = new Color(hex);
	const want = [
		0,
		0,
		0
	];
	target.getRGB(_rgb, SRGBColorSpace);
	want[0] = _rgb.r;
	want[1] = _rgb.g;
	want[2] = _rgb.b;
	const x = [
		.02,
		.02,
		.02
	];
	for (let it = 0; it < 60; it++) {
		const got = toneJS(x, P);
		for (let i = 0; i < 3; i++) {
			const ratio = (want[i] + .02) / (Math.max(got[i], -.015) + .02);
			x[i] = Math.min(8, Math.max(1e-5, x[i] * Math.pow(ratio, .8)));
		}
	}
	return out.setRGB(x[0], x[1], x[2], LinearSRGBColorSpace);
}
var _rgb = {
	r: 0,
	g: 0,
	b: 0
};
function vogelTaps(n) {
	const out = [];
	for (let i = 0; i < n; i++) {
		const r = Math.pow((i + .5) / n, .75);
		const a = i * 2.399963229728653;
		out.push(new Vector2(Math.cos(a) * r, Math.sin(a) * r));
	}
	return out;
}
function createPost({ renderer, scene, camera, quality = "high" }) {
	let q = qualitySettings(quality);
	let qLevel = quality;
	let focus = null;
	let width = 2;
	let height = 2;
	const canFloat = renderer.capabilities.isWebGL2 !== false && (renderer.extensions.has("EXT_color_buffer_float") || renderer.extensions.has("EXT_color_buffer_half_float"));
	const hdrType = canFloat ? HalfFloatType : UnsignedByteType;
	const quadScene = new Scene();
	const quadCam = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
	const tri = new BufferGeometry();
	tri.setAttribute("position", new BufferAttribute(new Float32Array([
		-1,
		-1,
		0,
		3,
		-1,
		0,
		-1,
		3,
		0
	]), 3));
	const quad = new Mesh(tri, null);
	quad.frustumCulled = false;
	quadScene.add(quad);
	const shared = {
		uProj: { value: new Vector4(1, 120, .27, 1.78) },
		uDofA: { value: new Vector4(17, .45, 2.7, .6) },
		uDofB: { value: new Vector4(.1, .3, 18, 1.3) },
		uDofC: { value: new Vector4(1, 1, 0, 0) },
		uTexel: { value: new Vector2(1, 1) },
		uAoTint: { value: new Color() }
	};
	const common = {
		uProj: { value: new Vector4(1, 120, .27, 1.78) },
		uDofA: { value: new Vector4(17, .45, 2.7, .6) },
		uDofB: { value: new Vector4(.1, .3, 18, 1.3) },
		uDofC: { value: new Vector4(1, 1, 0, 0) },
		uCamWorld: { value: new Matrix4() },
		uGobo: { value: new Vector4(1, 0, 1 / 9, .3) },
		uGobo2: { value: new Vector4(.1, 6, 12, .9) },
		uFocusW: { value: new Vector3() },
		uFadeA: { value: new Color() },
		uFadeB: { value: new Color() }
	};
	shared.uProj = common.uProj;
	shared.uDofA = common.uDofA;
	shared.uDofB = common.uDofB;
	shared.uDofC = common.uDofC;
	function mat(fragmentShader, uniforms, defines = {}) {
		return new ShaderMaterial({
			vertexShader: VERT,
			fragmentShader,
			uniforms,
			defines,
			depthTest: false,
			depthWrite: false,
			toneMapped: false
		});
	}
	const M = {};
	function buildMaterials() {
		for (const k in M) M[k].dispose();
		M.ao = mat(AO_FRAG, {
			...common,
			tDepth: { value: null },
			uTexel: shared.uTexel,
			uAo: { value: new Vector4(.22, .85, .012, 0) }
		}, { AO_TAPS: Math.max(1, q.aoTaps || 1) });
		M.pre = mat(PRE_FRAG, {
			...common,
			tScene: { value: null },
			tDepth: { value: null },
			tAo: { value: null },
			uTexel: shared.uTexel,
			uAoTint: shared.uAoTint,
			uAoOn: { value: 0 }
		});
		M.tile = mat(TILE_FRAG, {
			tPre: { value: null },
			uHalfTexel: { value: new Vector2() }
		});
		M.gather = mat(GATHER_FRAG, {
			tPre: { value: null },
			tTile: { value: null },
			uTexel: shared.uTexel,
			uTileTexel: { value: new Vector2() },
			uTaps: { value: vogelTaps(q.dofTaps) },
			uBoost: { value: .3 }
		}, { DOF_TAPS: q.dofTaps });
		M.fill = mat(FILL_FRAG, {
			tGather: { value: null },
			tPre: { value: null },
			uTexel: shared.uTexel,
			uFill: { value: new Vector2(.2, 18) }
		});
		M.bloomDown = mat(BLOOM_DOWN_FRAG, {
			tPre: { value: null },
			uHalfTexel: { value: new Vector2() },
			uThreshold: { value: 1 }
		});
		M.bloomBlur = mat(BLOOM_BLUR_FRAG, {
			tSrc: { value: null },
			uDir: { value: new Vector2() }
		});
		const defs = {};
		if (q.chroma) defs.POST_CHROMA = 1;
		if (q.aoTaps > 0) defs.POST_AO = 1;
		if (q.bloom) defs.POST_BLOOM = 1;
		if (q.grain) defs.POST_GRAIN = 1;
		if (q.sharpen) defs.POST_SHARPEN = 1;
		M.composite = mat(COMPOSITE_FRAG, {
			...common,
			tScene: { value: null },
			tDepth: { value: null },
			tBlur: { value: null },
			tBloom: { value: null },
			tSpill: { value: null },
			uSpill: { value: 0 },
			tAo: { value: null },
			uTexel: shared.uTexel,
			uTone: { value: new Vector4(1, 1, 1, 0) },
			uShadowTint: { value: new Color() },
			uLens: { value: new Vector4(.2, .02, 1.3, .5) },
			uFx: { value: new Vector4(.5, 1, .3, .04) },
			uAoTint: shared.uAoTint,
			uRimColor: { value: new Color() },
			uSeed: { value: new Vector3(0, 1, 0) },
			uSharpen: { value: .3 },
			uTint: { value: new Vector3(1, 1, 1) }
		}, defs);
	}
	buildMaterials();
	const T = {};
	function target(w, h, opts = {}) {
		const rt = new WebGLRenderTarget(Math.max(1, w), Math.max(1, h), {
			type: opts.type ?? hdrType,
			format: RGBAFormat,
			minFilter: LinearFilter,
			magFilter: LinearFilter,
			depthBuffer: !!opts.depth,
			stencilBuffer: false,
			samples: opts.samples || 0,
			generateMipmaps: false
		});
		rt.texture.colorSpace = "";
		return rt;
	}
	function buildTargets() {
		for (const k in T) {
			if (T[k].depthTexture) T[k].depthTexture.dispose();
			T[k].dispose();
		}
		const w = width;
		const h = height;
		const hw = Math.max(1, Math.round(w * (q.postScale || .5)));
		const hh = Math.max(1, Math.round(h * (q.postScale || .5)));
		T.scene = target(w, h, {
			depth: true,
			samples: canFloat ? q.msaa || 0 : 0
		});
		const depth = new DepthTexture(w, h, UnsignedIntType);
		depth.format = DepthFormat;
		depth.minFilter = depth.magFilter = NearestFilter;
		T.scene.depthTexture = depth;
		T.ao = target(hw, hh, { type: UnsignedByteType });
		T.pre = target(hw, hh);
		T.gather = target(hw, hh);
		T.fill = target(hw, hh);
		T.tile = target(Math.max(1, Math.ceil(hw / 4)), Math.max(1, Math.ceil(hh / 4)));
		T.bloomA = target(Math.max(1, hw >> 1), Math.max(1, hh >> 1));
		T.bloomB = target(Math.max(1, hw >> 1), Math.max(1, hh >> 1));
		T.spillA = target(Math.max(1, hw >> 3), Math.max(1, hh >> 3));
		T.spillB = target(Math.max(1, hw >> 3), Math.max(1, hh >> 3));
		shared.uTexel.value.set(1 / w, 1 / h);
	}
	function resize() {
		renderer.getDrawingBufferSize(_size);
		const w = Math.max(2, Math.floor(_size.x));
		const h = Math.max(2, Math.floor(_size.y));
		if (w !== width || h !== height || !T.scene) {
			width = w;
			height = h;
			buildTargets();
		}
	}
	const _size = new Vector2();
	const _v = new Vector3();
	const _m = new Matrix4();
	const _bg = new Color();
	let toneKey = "";
	resize();
	function pass(material, rt) {
		quad.material = material;
		renderer.setRenderTarget(rt);
		renderer.render(quadScene, quadCam);
	}
	function updateUniforms() {
		const D = CONFIG.dof;
		const P = CONFIG.post;
		camera.updateMatrixWorld();
		const tanHalf = camera.isPerspectiveCamera ? Math.tan(MathUtils.degToRad(camera.fov) / 2) : .27;
		shared.uProj.value.set(camera.near, camera.far, tanHalf, camera.aspect || width / height);
		_m.copy(camera.matrixWorld).invert();
		let fz = 17;
		let fy = .5;
		if (focus) {
			_v.copy(focus).applyMatrix4(_m);
			if (_v.z < -.01) {
				fz = -_v.z;
				fy = .5 + .5 * _v.y / (fz * tanHalf);
			}
		}
		const e = camera.matrixWorld.elements;
		const sinP = Math.min(.9999, Math.max(.05, e[9]));
		const cot = Math.max(.1, Math.sqrt(1 - sinP * sinP) / sinP);
		const kD = Math.min(9, 1 / (2 * Math.atan(tanHalf) * cot));
		shared.uDofA.value.set(fz, Math.min(.9, Math.max(.1, fy)), kD, D.depthWeight);
		const bandScale = Math.min(D.closeBandScale ?? 1.8, Math.max(1, 12 / fz));
		shared.uDofB.value.set(D.focusBand * bandScale / 2, Math.max(.02, D.ramp), D.maxBlurPx * height / 1080, D.nearGain);
		shared.uDofC.value.set(D.farGain, api.enabled ? 1 : 0, P.greenDesat ?? 0, 0);
		setColorCached(shared.uAoTint.value, P.aoTint);
		const G = CONFIG.lights.gobo;
		const F = CONFIG.lights.fade;
		const ks = Math.min(3, Math.max(.82, fz / 17));
		let rx = e[0];
		let rz = e[2];
		const rl = hypot2$1(rx, rz) || 1;
		rx /= rl;
		rz /= rl;
		common.uCamWorld.value.copy(camera.matrixWorld);
		common.uGobo.value.set(rx, rz, 1 / Math.max(.5, G.radius * Math.min(3, fz / 17)), api.enabled ? G.key * (1 - (G.closeRelief ?? 0) * Math.min(1, Math.max(0, (8 - fz) / 4))) : 0);
		common.uGobo2.value.set(api.enabled ? G.tint : 0, F.start * ks, F.end * ks, api.enabled ? F.amount : 0);
		if (focus) common.uFocusW.value.copy(focus);
		M.ao.uniforms.uAo.value.set(P.aoRadius, P.ao, .012, 0);
		M.gather.uniforms.uBoost.value = D.highlightBoost;
		M.fill.uniforms.uFill.value.set(1.9 / Math.sqrt(q.dofTaps), D.maxBlurPx * height / 1080);
		M.bloomDown.uniforms.uThreshold.value = P.bloomThreshold;
		const c = M.composite.uniforms;
		const closeT = Math.min(1, Math.max(0, (8 - fz) / 4));
		c.uTone.value.set(P.exposure * (1 + ((P.closeExposure ?? 1) - 1) * closeT), P.contrast, P.saturation, P.shadowLift);
		if (setColorCached(c.uShadowTint.value, P.shadowTint)) c.uShadowTint.value.convertLinearToSRGB();
		c.uLens.value.set(P.vignette, q.grain ? P.grain : 0, Math.max(1, P.grainSize * height / 900), P.chroma * height / 1080);
		c.uFx.value.set(P.bloom, q.aoTaps > 0 && P.ao > 0 && api.enabled ? 1 : 0, api.enabled ? P.edgeRim * (P.edgeRimDark ? -1 : 1) : 0, P.split);
		setColorCached(c.uRimColor.value, (P.edgeRimDark ? P.edgeRimDarkColor : P.edgeRimColor) || CONFIG.palette.cutEdge);
		c.uSharpen.value = api.enabled ? P.sharpen ?? 0 : 0;
		const tint = P.tint || [
			1,
			1,
			1
		];
		c.uTint.value.set(tint[0], tint[1], tint[2]);
		c.uSeed.value.set(Math.floor(state.time * 60) % 1024, (P.edgeRimPx ?? 1.25) * Math.max(1, height / 900) * (fz < 9 ? 1.5 : 1), api.view || 0);
		const key = [
			P.exposure,
			P.contrast,
			P.saturation,
			(P.tint || []).join(),
			CONFIG.lights.background,
			CONFIG.lights.fade.color,
			CONFIG.lights.fade.colorRight
		].join("|");
		if (key !== toneKey) {
			toneKey = key;
			inverseTone(CONFIG.lights.background, P, _bg);
			inverseTone(CONFIG.lights.fade.color, P, common.uFadeA.value);
			inverseTone(CONFIG.lights.fade.colorRight || CONFIG.lights.fade.color, P, common.uFadeB.value);
		}
		if (scene.background && scene.background.isColor) scene.background.copy(_bg);
	}
	const api = {
		enabled: true,
		/** Debug view for check scripts: 0 final, 1 CoC, 2 AO, 3 blur layer, 4 scene without post. */
		view: 0,
		/** Render the frame to the canvas (the ONLY place that draws to the default framebuffer). */
		render(dt) {
			resize();
			updateUniforms();
			const full = api.enabled;
			const prevAuto = renderer.autoClear;
			renderer.autoClear = true;
			renderReflection(renderer, scene, camera, width, height, qLevel);
			renderer.autoClear = true;
			renderer.setRenderTarget(T.scene);
			renderer.render(scene, camera);
			const depth = T.scene.depthTexture;
			const aoOn = full && q.aoTaps > 0 && CONFIG.post.ao > 0;
			if (aoOn) {
				M.ao.uniforms.tDepth.value = depth;
				pass(M.ao, T.ao);
			}
			if (full) {
				const pu = M.pre.uniforms;
				pu.tScene.value = T.scene.texture;
				pu.tDepth.value = depth;
				pu.tAo.value = T.ao.texture;
				pu.uAoOn.value = aoOn ? 1 : 0;
				pass(M.pre, T.pre);
				M.tile.uniforms.tPre.value = T.pre.texture;
				M.tile.uniforms.uHalfTexel.value.set(1 / T.pre.width, 1 / T.pre.height);
				pass(M.tile, T.tile);
				const gu = M.gather.uniforms;
				gu.tPre.value = T.pre.texture;
				gu.tTile.value = T.tile.texture;
				gu.uTileTexel.value.set(1 / T.tile.width, 1 / T.tile.height);
				pass(M.gather, T.gather);
				M.fill.uniforms.tGather.value = T.gather.texture;
				M.fill.uniforms.tPre.value = T.pre.texture;
				pass(M.fill, T.fill);
				if (q.bloom && CONFIG.post.bloom > 0) {
					M.bloomDown.uniforms.tPre.value = T.pre.texture;
					M.bloomDown.uniforms.uHalfTexel.value.set(1 / T.pre.width, 1 / T.pre.height);
					pass(M.bloomDown, T.bloomA);
					M.bloomBlur.uniforms.tSrc.value = T.bloomA.texture;
					M.bloomBlur.uniforms.uDir.value.set(1 / T.bloomA.width, 0);
					pass(M.bloomBlur, T.bloomB);
					M.bloomBlur.uniforms.tSrc.value = T.bloomB.texture;
					M.bloomBlur.uniforms.uDir.value.set(0, 1 / T.bloomA.height);
					pass(M.bloomBlur, T.bloomA);
					if ((CONFIG.post.spill ?? 0) > 0) {
						let src = T.bloomA;
						for (let i = 0; i < 3; i++) {
							const k = 1.7 + i * 1.5;
							M.bloomBlur.uniforms.tSrc.value = src.texture;
							M.bloomBlur.uniforms.uDir.value.set(k / T.spillA.width, 0);
							pass(M.bloomBlur, T.spillB);
							M.bloomBlur.uniforms.tSrc.value = T.spillB.texture;
							M.bloomBlur.uniforms.uDir.value.set(0, k / T.spillA.height);
							pass(M.bloomBlur, T.spillA);
							src = T.spillA;
						}
					}
				}
			}
			const cu = M.composite.uniforms;
			cu.tScene.value = T.scene.texture;
			cu.tDepth.value = depth;
			cu.tBlur.value = T.fill.texture;
			cu.tBloom.value = T.bloomA.texture;
			cu.tAo.value = T.ao.texture;
			cu.tSpill.value = T.spillA.texture;
			cu.uSpill.value = full && q.bloom && CONFIG.post.bloom > 0 ? CONFIG.post.spill ?? 0 : 0;
			if (!full || !q.bloom || CONFIG.post.bloom <= 0) cu.uFx.value.x = 0;
			pass(M.composite, null);
			renderer.autoClear = prevAuto;
		},
		/** CSS-pixel size; the actual drawing-buffer size is read from the renderer. */
		setSize(w, h) {
			resize();
		},
		/** World-space point that must be sharp (the traveller). Called every frame before render(). */
		setFocus(point) {
			focus = point;
		},
		setQuality(level) {
			q = qualitySettings(level);
			qLevel = level;
			buildMaterials();
			buildTargets();
		},
		dispose() {
			for (const k in T) {
				if (T[k].depthTexture) T[k].depthTexture.dispose();
				T[k].dispose();
			}
			for (const k in M) M[k].dispose();
			tri.dispose();
		}
	};
	return api;
}
// src/audio/paper.js
var MAX_SOUND_SECONDS = .34;
var clamp$1 = (v, a, b) => v < a ? a : v > b ? b : v;
var lerp = (a, b, t) => a + (b - a) * t;
var smooth$1 = (t) => {
	const x = clamp$1(t, 0, 1);
	return x * x * (3 - 2 * x);
};
/** RBJ biquad coefficients, normalised: [b0, b1, b2, a1, a2]. type: 'lp' | 'hp' | 'bp' (0 dB peak). */
function biquad(type, f, q, sr) {
	const w0 = 2 * Math.PI * clamp$1(f, 20, sr * .45) / sr;
	const cs = Math.cos(w0);
	const al = Math.sin(w0) / (2 * q);
	const a0 = 1 + al;
	let b0;
	let b1;
	let b2;
	if (type === "lp") {
		b0 = (1 - cs) / 2;
		b1 = 1 - cs;
		b2 = b0;
	} else if (type === "hp") {
		b0 = (1 + cs) / 2;
		b1 = -(1 + cs);
		b2 = b0;
	} else {
		b0 = al;
		b1 = 0;
		b2 = -al;
	}
	return [
		b0 / a0,
		b1 / a0,
		b2 / a0,
		-2 * cs / a0,
		(1 - al) / a0
	];
}
var NO_BQ = [
	0,
	0,
	0,
	0,
	0
];
/**
* The whole filter stage of one sound in ONE pass (8 filter sections fused: ~2.5x faster than separate passes, and
* no intermediate float32 buffers, so no denormals):
*   out = HP( LP( LP( tilt( gBed * BP_bed(bed) + gDirect * gr + sum_k gRes[k] * BP_res[k](gr) ) ) ) ) + gLow * BP_low(low)
* K: { bed, gBed, res: [c, c, c], gRes: [g, g, g], gDirect, tiltHz (0 = none), lp, hp, low, gLow }; `low` buffer may be null
*/
function shape(out, n, bed, gr, low, K, sr) {
	const cb = K.bed;
	const b0 = cb[0] * K.gBed;
	const b2 = cb[2] * K.gBed;
	const ba1 = cb[3];
	const ba2 = cb[4];
	const c1 = K.res[0] || NO_BQ;
	const c2 = K.res[1] || NO_BQ;
	const c3 = K.res[2] || NO_BQ;
	const p0 = c1[0] * (K.gRes[0] || 0);
	const p2 = c1[2] * (K.gRes[0] || 0);
	const pa1 = c1[3];
	const pa2 = c1[4];
	const q0 = c2[0] * (K.gRes[1] || 0);
	const q2 = c2[2] * (K.gRes[1] || 0);
	const qa1 = c2[3];
	const qa2 = c2[4];
	const r0 = c3[0] * (K.gRes[2] || 0);
	const r2 = c3[2] * (K.gRes[2] || 0);
	const ra1 = c3[3];
	const ra2 = c3[4];
	const gd = K.gDirect;
	const aT = K.tiltHz > 0 ? 1 - Math.exp(-2 * Math.PI * Math.min(K.tiltHz, sr * .45) / sr) : 1;
	const L = K.lp;
	const l0 = L[0];
	const l1 = L[1];
	const l2 = L[2];
	const la1 = L[3];
	const la2 = L[4];
	const H = K.hp;
	const h0 = H[0];
	const h1 = H[1];
	const h2 = H[2];
	const ha1 = H[3];
	const ha2 = H[4];
	const cw = K.low || NO_BQ;
	const w0 = cw[0] * (K.gLow || 0);
	const w2 = cw[2] * (K.gLow || 0);
	const wa1 = cw[3];
	const wa2 = cw[4];
	const hasLow = !!low;
	let bz1 = 0;
	let bz2 = 0;
	let pz1 = 0;
	let pz2 = 0;
	let qz1 = 0;
	let qz2 = 0;
	let rz1 = 0;
	let rz2 = 0;
	let t = 0;
	let az1 = 0;
	let az2 = 0;
	let cz1 = 0;
	let cz2 = 0;
	let hz1 = 0;
	let hz2 = 0;
	let wz1 = 0;
	let wz2 = 0;
	for (let i = 0; i < n; i++) {
		const xb = bed[i];
		const xg = gr[i];
		const yb = b0 * xb + bz1;
		bz1 = -ba1 * yb + bz2;
		bz2 = b2 * xb - ba2 * yb;
		const yp = p0 * xg + pz1;
		pz1 = -pa1 * yp + pz2;
		pz2 = p2 * xg - pa2 * yp;
		const yq = q0 * xg + qz1;
		qz1 = -qa1 * yq + qz2;
		qz2 = q2 * xg - qa2 * yq;
		const yr = r0 * xg + rz1;
		rz1 = -ra1 * yr + rz2;
		rz2 = r2 * xg - ra2 * yr;
		t += aT * (yb + yp + yq + yr + gd * xg - t);
		const ya = l0 * t + az1;
		az1 = l1 * t - la1 * ya + az2;
		az2 = l2 * t - la2 * ya;
		const yc = l0 * ya + cz1;
		cz1 = l1 * ya - la1 * yc + cz2;
		cz2 = l2 * ya - la2 * yc;
		let y = h0 * yc + hz1;
		hz1 = h1 * yc - ha1 * y + hz2;
		hz2 = h2 * yc - ha2 * y;
		if (hasLow) {
			const xw = low[i];
			const yw = w0 * xw + wz1;
			wz1 = -wa1 * yw + wz2;
			wz2 = w2 * xw - wa2 * yw;
			y += yw;
		}
		out[i] = y;
	}
	out[n] = 0;
	out[n + 1] = 0;
}
/** Fast per-sample white noise (xorshift32), seeded from the parameter rng. */
function makeNoise(rng) {
	let s = rng() * 4294967296 >>> 0 | 1;
	return function noise() {
		s ^= s << 13;
		s ^= s >>> 17;
		s ^= s << 5;
		return (s | 0) / 2147483648;
	};
}
/** One crackle grain: enveloped noise burst (3-sample attack, exponential decay tau seconds). */
var grainSeed = 2654435769;
function seedGrains(rng) {
	grainSeed = rng() * 4294967296 >>> 0 | 1;
}
function addGrain(buf, n, sr, noise, t, amp, tau) {
	const i0 = Math.floor(t * sr);
	if (i0 < 0 || i0 + 4 >= n) return;
	const d = Math.exp(-1 / Math.max(1, tau * sr));
	const end = Math.min(n, i0 + Math.ceil(tau * sr * 5.5) + 4);
	let e = amp;
	let s = grainSeed;
	for (let j = 0; j < 3; j++) {
		s ^= s << 13;
		s ^= s >>> 17;
		s ^= s << 5;
		buf[i0 + j] += (s | 0) / 2147483648 * e * (j === 0 ? .15 : j === 1 ? .5 : .85);
		e *= d;
	}
	for (let i = i0 + 3; i < end; i++) {
		s ^= s << 13;
		s ^= s >>> 17;
		s ^= s << 5;
		buf[i] += (s | 0) / 2147483648 * e;
		e *= d;
	}
	grainSeed = s;
}
var scrLen = 0;
var scrA = null;
var scrB = null;
var scrC = null;
function scratch(n) {
	if (n > scrLen) {
		scrLen = n;
		scrA = new Float32Array(n);
		scrB = new Float32Array(n);
		scrC = new Float32Array(n);
	}
	scrA.fill(0, 0, n);
	scrB.fill(0, 0, n);
	scrC.fill(0, 0, n);
}
/** Smooth (smoothstep) fade-in / fade-out, peak-early enforcement and normalisation. Returns n. */
function finish(out, n, sr, T, attack, peakWithin, tailFrom, refCrest, kneeRel = .45, loud = .5, gLo = .86, gHi = 1.2) {
	const na = Math.max(2, Math.round(attack * sr));
	for (let i = 0; i < na && i < n; i++) {
		const u = i / na;
		out[i] *= u * u * (3 - 2 * u);
	}
	const f0 = Math.max(0, Math.floor(T * tailFrom * sr));
	const nf = n - f0;
	for (let i = f0; i < n; i++) {
		const u = 1 - (i - f0) / nf;
		out[i] *= u * u * (3 - 2 * u);
	}
	out[n - 1] = 0;
	const np = Math.min(n, Math.round(peakWithin * sr));
	let early = 0;
	for (let i = 0; i < np; i++) {
		const a = Math.abs(out[i]);
		if (a > early) early = a;
	}
	early = Math.max(early, 1e-6);
	const knee = early * kneeRel;
	const room = early * Math.min(.17, .97 - kneeRel);
	let sq = 0;
	for (let i = 0; i < n; i++) {
		let v = out[i];
		if (i >= np) {
			const a = Math.abs(v);
			if (a > knee) {
				v = (v < 0 ? -1 : 1) * (knee + room * Math.tanh((a - knee) / room));
				out[i] = v;
			}
		}
		sq += v * v;
	}
	const rms = Math.sqrt(sq / Math.max(1, Math.round(T * sr)));
	const crest = early / Math.max(rms, 1e-9);
	const g = 1 / early * clamp$1(Math.pow(crest / refCrest, loud), gLo, gHi);
	for (let i = 0; i < n; i++) out[i] *= g;
	return n;
}
/**
* Synthesise one flap into out[0..n). P: { up, size 0..1, pitch, dur (s to -40 dB), tick 0..1 }.
* Returns the number of samples written.
*/
function synthFlap(out, sr, P, rng) {
	const F = CONFIG.audio.flap;
	const up = P.up;
	const s = P.size;
	const T = P.dur;
	const n = Math.min(out.length - 2, Math.ceil((T + .012) * sr));
	scratch(n);
	const bed = scrA;
	const gr = scrB;
	const th = scrC;
	const resF = [];
	const resG = [];
	for (let k = 0; k < F.resHz.length; k++) {
		resF.push(1 + (rng() * 2 - 1) * F.resJitter);
		resG.push(1 + (rng() * 2 - 1) * F.resGainJitter);
	}
	const noise = makeNoise(rng);
	seedGrains(rng);
	const big01 = smooth$1((s - F.brightFrom) / (F.brightTo - F.brightFrom));
	const bright = F.brightSmall * Math.pow(F.brightLarge / F.brightSmall, big01) * (up ? 1 : F.downBright);
	const air = clamp$1(P.air ?? 0, 0, 1);
	const tiltHz = (up ? F.tiltSmall * Math.pow(F.tiltLarge / F.tiltSmall, big01) : F.tiltSmallDown * Math.pow(F.tiltLargeDown / F.tiltSmallDown, big01)) * Math.pow(P.pitch, F.tiltTrack) * (1 - F.airTilt * air);
	const fs = P.pitch * bright;
	const ts = 1 / Math.sqrt(fs);
	const tick = (P.tick ?? 1) * F.tick;
	const tauE = T / F.decayNepers;
	const tauF = T / F.decayFast;
	const mixF = F.decayFastMix;
	const kBed = Math.exp(-1 / (tauE * (up ? 1 : F.bedDecayDown) * sr));
	const kFast = Math.exp(-1 / (tauF * sr));
	const segs = Math.max(4, Math.round(T / F.lumpEvery * (.8 + rng() * .4)));
	const segLen = Math.ceil(n / segs);
	const gateEvery = Math.max(2, Math.round(F.gateEvery * sr / fs));
	const gSmooth = 1 - Math.exp(-2.2 / gateEvery);
	let env = 1 - mixF;
	let envF = mixF;
	let gate = 1;
	let gTarget = 1;
	let ns = rng() * 4294967296 >>> 0 | 1;
	let gateLeft = 0;
	let v0 = up ? .7 + rng() * .3 : .5 + rng() * .3;
	const kSw = up ? 0 : Math.exp(-1 / (F.downSwell * sr));
	let sw = up ? 0 : 1 - F.downSwellFrom;
	for (let sgi = 0, i = 0; sgi < segs; sgi++) {
		const v1 = F.lumpMin + rng() * (1 - F.lumpMin);
		const end = Math.min(n, i + segLen);
		const inv = 1 / segLen;
		for (let j = 0; i < end; i++, j++) {
			if (--gateLeft <= 0) {
				gateLeft = gateEvery;
				ns ^= ns << 13;
				ns ^= ns >>> 17;
				ns ^= ns << 5;
				const r = (ns | 0) / 2147483648;
				const r2 = r * r;
				gTarget = F.bedSmooth + (1 - F.bedSmooth) * 5 * r2 * r2;
			}
			gate += gSmooth * (gTarget - gate);
			const u = j * inv;
			ns ^= ns << 13;
			ns ^= ns >>> 17;
			ns ^= ns << 5;
			bed[i] = (ns | 0) / 2147483648 * (env + envF) * (v0 + (v1 - v0) * u * u * (3 - 2 * u)) * gate * (1 - sw);
			env *= kBed;
			envF *= kFast;
			sw *= kSw;
		}
		v0 = v1;
	}
	const E = (t) => (1 - mixF) * Math.exp(-t / tauE) + mixF * Math.exp(-t / tauF);
	const nOn = up ? F.onsetGrains : F.onsetGrains - 1;
	for (let k = 0; k < nOn; k++) addGrain(gr, n, sr, noise, (up ? 8e-4 : .0014) + rng() * (up ? .0034 : .0036), tick * (k === 0 ? 1 : .5 + rng() * .45) * (up ? 1 : F.downTick), (up ? 5e-4 + rng() * 8e-4 : .001 + rng() * .001) * ts);
	const dens = up ? 1 : F.downGrains;
	const nMac = Math.round(lerp(F.grainsMin, F.grainsMax, s) * dens);
	const kd = F.grainThin;
	const span = 1 - Math.exp(-kd);
	const thin = () => -Math.log(1 - rng() * span) / kd * T * .84;
	const tStop = T * (up ? .38 + rng() * .24 : F.downStop + rng() * .16);
	let left = nMac;
	while (left > 0) {
		const tc = rng() < F.stopShare ? Math.max(.003, tStop + (rng() + rng() - 1) * T * .11) : .003 + thin();
		const inCl = Math.min(left, 1 + Math.floor(rng() * rng() * 7));
		const width = .0012 + rng() * .006;
		const r = rng();
		const ac = F.grainAmp * (.14 + r * r * r) * E(tc);
		let tg = tc;
		for (let k = 0; k < inCl; k++) {
			addGrain(gr, n, sr, noise, tg, ac * (.45 + .55 * rng()), (15e-5 + rng() * 8e-4) * ts);
			tg += -Math.log(1 - rng() * .95) * width / 2.2;
		}
		left -= inCl;
	}
	const nMic = Math.round(lerp(F.microMin, F.microMax, s) * dens);
	for (let k = 0; k < nMic; k++) {
		const t = .001 + thin() * 1.1;
		addGrain(gr, n, sr, noise, t, F.microAmp * (.2 + rng()) * E(t), (1e-4 + rng() * 3e-4) * ts);
	}
	const nSt = up ? 3 + Math.floor(rng() * 3) : 2 + Math.floor(rng() * 2);
	for (let k = 0; k < nSt; k++) {
		const t = tStop + (k === 0 ? 0 : rng() * (up ? .006 : .004));
		const a = tick * F.stopTick * (k === 0 ? 1 : .25 + rng() * .5);
		if (up) addGrain(gr, n, sr, noise, t, a, (25e-5 + rng() * 5e-4) * ts);
		else addGrain(bed, n, sr, noise, t, a * F.patGain, (.0012 + rng() * .0014) * ts);
	}
	const nQ = 2 + Math.floor(rng() * 4);
	for (let k = 0; k < nQ; k++) {
		const t = tStop + .007 + rng() * Math.max(.001, T * .88 - tStop);
		addGrain(gr, n, sr, noise, t, F.grainAmp * (.25 + rng() * .5) * E(t), (2e-4 + rng() * 4e-4) * ts);
	}
	const big = clamp$1((s - .3) / .7, 0, 1);
	const thAmp = F.thump * Math.pow(big, 1.4);
	if (thAmp > .002) {
		const tau = .0035;
		addGrain(th, n, sr, noise, up ? .0012 : tStop, thAmp * (up ? 1 : F.thumpDown), tau);
		if (up) addGrain(th, n, sr, noise, tStop + .001, thAmp * .55, tau);
	}
	shape(out, n, bed, gr, thAmp > .002 ? th : null, {
		bed: biquad("bp", F.bedHz * fs, F.bedQ, sr),
		gBed: up ? F.bedGain : F.bedGainDown,
		res: [
			biquad("bp", F.resHz[0] * fs * resF[0], F.resQ[0], sr),
			biquad("bp", F.resHz[1] * fs * resF[1], F.resQ[1], sr),
			biquad("bp", F.resHz[2] * fs * resF[2], F.resQ[2], sr)
		],
		gRes: [
			F.resGain[0] * resG[0],
			F.resGain[1] * resG[1],
			F.resGain[2] * resG[2]
		],
		gDirect: F.grainDirect,
		tiltHz,
		lp: biquad("lp", F.lpHz * (1 - F.airLp * air), .6, sr),
		hp: biquad("hp", F.hpHz * Math.sqrt(fs) * (up ? 1 : F.downHp), .7, sr),
		low: biquad("bp", F.thumpHz * P.pitch / (.8 + .4 * s), F.thumpQ, sr),
		gLow: F.thumpGain
	}, sr);
	{
		const fA = 2 * Math.sin(Math.PI * F.airHz * Math.pow(P.pitch, .5) * (up ? 1 : F.downBright) / sr);
		const qA = 1 / F.airQ;
		const fT = 2 * Math.sin(Math.PI * F.lowHz * Math.pow(P.pitch, .5) / (sr * (.8 + .4 * s)));
		const qT = 1 / F.lowQ;
		const tr = (up ? F.airRise : F.airRiseDown) * (.8 + .4 * rng()) * (.7 + .6 * s);
		const kA = Math.exp(-1 / (tr * sr));
		const gA = (up ? F.airGain : F.airGainDown) * lerp(F.airSmall, 1, big01) * Math.E * (1 - kA);
		const lowAmp = F.lowGain * Math.pow(clamp$1((s - F.lowFrom) / (1 - F.lowFrom), 0, 1), .8) * (up ? 1 : F.lowDown);
		const iT = Math.floor((up ? .0015 : tStop) * sr);
		const kT = Math.exp(-1 / (F.lowTau * sr));
		const aL = 1 - Math.exp(-2 * Math.PI * F.airLpHz * Math.pow(P.pitch, .5) / sr);
		let e1 = 1;
		let e2 = 0;
		let eT = 0;
		let al = 0;
		let ab = 0;
		let aw = 0;
		let tl = 0;
		let tb = 0;
		for (let i = 0; i < n; i++) {
			ns ^= ns << 13;
			ns ^= ns >>> 17;
			ns ^= ns << 5;
			const x = (ns | 0) / 2147483648;
			e2 = e2 * kA + e1;
			e1 *= kA;
			al += fA * ab;
			ab += fA * (x - al - qA * ab);
			aw += aL * (ab - aw);
			let y = aw * e2 * gA;
			if (lowAmp > 0) {
				if (i === iT) eT = lowAmp;
				tl += fT * tb;
				tb += fT * (x * eT - tl - qT * tb);
				eT *= kT;
				y += tb;
			}
			out[i] += y;
		}
	}
	return finish(out, n, sr, T, up ? F.attackUp : F.attackDown, .0055, F.tailFrom, F.refCrest, F.peakKnee, F.loudNorm, F.normLo, F.normHi);
}
/** Synthesise one footstep. P: { surface, pitch, dur }. */
function synthStep(out, sr, P, rng) {
	const S = CONFIG.audio.step;
	const V = S.surfaces[P.surface] || S.surfaces.grass;
	const T = P.dur;
	const n = Math.min(out.length - 2, Math.ceil((T + .008) * sr));
	scratch(n);
	const bed = scrA;
	const gr = scrB;
	const kn = scrC;
	const noise = makeNoise(rng);
	seedGrains(rng);
	const fs = P.pitch;
	const kBed = Math.exp(-1 / (T / 4.6 * sr));
	let env = 1;
	for (let i = 0; i < n; i++) {
		bed[i] = noise() * env;
		env *= kBed;
	}
	addGrain(gr, n, sr, noise, 6e-4 + rng() * 8e-4, 1, (5e-4 + rng() * 6e-4) / fs);
	addGrain(gr, n, sr, noise, .0018 + rng() * .0016, .5 + rng() * .3, (4e-4 + rng() * 6e-4) / fs);
	for (let k = 0; k < V.grains; k++) {
		const t = .003 + rng() * T * .6;
		addGrain(gr, n, sr, noise, t, (.12 + .3 * rng()) * Math.exp(-t / T * 3), (2e-4 + rng() * 6e-4) / fs);
	}
	if (V.knock > 0) addGrain(kn, n, sr, noise, 8e-4, V.knock, .003);
	shape(out, n, bed, gr, V.knock > 0 ? kn : null, {
		bed: biquad("bp", V.bedHz * fs, V.bedQ, sr),
		gBed: V.bedGain,
		res: V.resHz.map((f, k) => biquad("bp", f * fs * (.92 + rng() * .16), V.resQ[k], sr)),
		gRes: V.resHz.map(() => V.grain),
		gDirect: .25 * V.grain,
		tiltHz: 0,
		lp: biquad("lp", V.lpHz * fs, .62, sr),
		hp: biquad("hp", 300, .7, sr),
		low: biquad("bp", 560 * fs, 2.6, sr),
		gLow: 5
	}, sr);
	return finish(out, n, sr, T, .0016, .0045, .7, S.refCrest);
}
function makeRoomIR(ctx) {
	const R = CONFIG.audio.room;
	const sr = ctx.sampleRate;
	const n = Math.ceil(R.length * sr);
	const ir = ctx.createBuffer(2, n, sr);
	const rng = mulberry32(502558);
	const lpA = 1 - Math.exp(-2 * Math.PI * R.tailLpHz / sr);
	for (let c = 0; c < 2; c++) {
		const d = ir.getChannelData(c);
		let y = 0;
		const i0 = Math.floor(.003 * sr);
		for (let i = i0; i < n; i++) {
			const t = (i - i0) / sr;
			y += lpA * (rng() * 2 - 1 - y);
			d[i] = y * R.tail * Math.exp(-t / R.tailDecay) * Math.min(1, (i - i0) / (.002 * sr));
		}
		for (const [delay, gain, pan] of R.taps) {
			const g = gain * (c === 0 ? Math.min(1, 1 - pan) : Math.min(1, 1 + pan));
			const i = Math.round(delay * sr);
			if (i > 1 && i + 1 < n) {
				d[i - 1] += g * .25;
				d[i] += g * .5;
				d[i + 1] += g * .25;
			}
		}
		const fo = Math.floor(.004 * sr);
		for (let i = 0; i < fo; i++) d[n - 1 - i] *= i / fo;
		d[0] = 1;
	}
	return ir;
}
function makeLimiterCurve() {
	const L = CONFIG.audio.limiter;
	const N = 4097;
	const curve = new Float32Array(N);
	const k = L.knee;
	for (let i = 0; i < N; i++) {
		const x = (i / 4096 * 2 - 1) * L.range;
		const a = Math.abs(x);
		const y = a <= k ? a : k + (1 - k) * Math.tanh((a - k) / (1 - k));
		curve[i] = x < 0 ? -y : y;
	}
	return curve;
}
function makeAmbience(ctx) {
	const M = CONFIG.audio.ambience;
	const sr = ctx.sampleRate;
	const n = Math.floor(M.length * sr);
	const xf = Math.floor(.3 * sr);
	const buf = ctx.createBuffer(2, n, sr);
	const rng = mulberry32(670494);
	const a1 = 1 - Math.exp(-2 * Math.PI * M.lpHz / sr);
	const a2 = 1 - Math.exp(-2 * Math.PI * 30 / sr);
	for (let c = 0; c < 2; c++) {
		const tmp = new Float32Array(n + xf);
		let y1 = 0;
		let y2 = 0;
		let y3 = 0;
		let sq = 0;
		for (let i = 0; i < n + xf; i++) {
			const w = rng() * 2 - 1;
			y1 += a1 * (w - y1);
			y2 += a1 * (y1 - y2);
			y3 += a2 * (y2 - y3);
			const v = y2 - y3 + w * .004;
			tmp[i] = v;
			sq += v * v;
		}
		const norm = 1 / Math.sqrt(sq / (n + xf));
		const d = buf.getChannelData(c);
		for (let i = 0; i < n; i++) {
			let v = tmp[i];
			if (i < xf) {
				const u = i / xf;
				v = v * Math.sqrt(u) + tmp[n + i] * Math.sqrt(1 - u);
			}
			d[i] = v * norm;
		}
	}
	return buf;
}
function strHash(s) {
	if (typeof s === "number") return s | 0;
	let h = 2166136261;
	const str = String(s ?? "");
	for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
	return h | 0;
}
/** Seed for a fold event: depends only on where the flap is and which flap it is (fold-down = the same card, voiced duller). */
function foldSeed(e) {
	const salt = CONFIG.audio.seed ^ strHash(e.tileId) ^ Math.imul((e.layer ?? 0) + 1, 40503) ^ Math.imul(Math.round((e.size ?? 0) * 1e3), 4577779);
	return hash2(Math.round((e.x ?? 0) * 8), Math.round((e.z ?? 0) * 8), salt | 0);
}
/**
* Pitch / duration / level of one flap. u = 0..1 pitch position (undefined -> from the seed),
* lastSt = semitones of the previous flap (consecutive flaps are kept >= pitchMinStepSt apart).
*/
function flapParams(up, sizeIn, seed, u, lastSt) {
	const F = CONFIG.audio.flap;
	const size = clamp$1(sizeIn ?? .4, 0, 1);
	const r = mulberry32(seed);
	const u0 = r();
	const lo = 12 * Math.log2(F.pitchMin);
	const hi = 12 * Math.log2(F.pitchMax);
	let st = F.pitchSizeSt * (1 - 2 * size) + ((u ?? u0) * 2 - 1) * F.pitchRandSt;
	if (lastSt !== void 0 && lastSt !== null && Math.abs(st - lastSt) < F.pitchMinStepSt) {
		const dir = st >= lastSt ? 1 : -1;
		let cand = lastSt + dir * F.pitchMinStepSt * 1.5;
		if (cand > hi || cand < lo) cand = lastSt - dir * F.pitchMinStepSt * 1.5;
		st = cand;
	}
	st = clamp$1(st, lo, hi);
	const pitch = Math.pow(2, st / 12);
	const dur = lerp(F.durMin, F.durMax, Math.pow(size, F.durCurve)) * Math.pow(pitch, -F.durPitch) * (1 + (r() * 2 - 1) * F.durJitter);
	const level = F.gain * lerp(F.sizeGainMin, 1, size) * (up ? 1 : Math.pow(10, F.downGainDb / 20));
	return {
		up,
		size,
		pitch,
		semitones: st,
		dur,
		level,
		synthSeed: r() * 4294967296 >>> 0
	};
}
function stepParams(surface, seed, foot) {
	const S = CONFIG.audio.step;
	const V = S.surfaces[surface] ? surface : "grass";
	const r = mulberry32(seed);
	const st = (r() * 2 - 1) * S.pitchRandSt + (foot ? S.footSt : -S.footSt);
	const pitch = Math.pow(2, st / 12);
	return {
		surface: V,
		pitch,
		semitones: st,
		dur: S.dur * (.92 + r() * .16) * Math.pow(pitch, -.3),
		level: S.gain * S.surfaces[V].gain * (.85 + r() * .3),
		synthSeed: r() * 4294967296 >>> 0
	};
}
/** Flaps of one tile folding in one direction belong to one gesture. */
var groupKey = (e) => Math.round((e.x ?? 0) * 4) + "," + Math.round((e.z ?? 0) * 4) + (e.dir === "down" ? "d" : "u");
var STEP_CYCLE = [
	"grass",
	"path",
	"bridge"
];
function parseKind(kind, seed) {
	if (kind === "flap-up") return {
		flap: true,
		up: true
	};
	if (kind === "flap-down") return {
		flap: true,
		up: false
	};
	const m = /^step-(\w+)$/.exec(kind || "");
	return {
		flap: false,
		surface: m ? m[1] : STEP_CYCLE[Math.abs(seed | 0) % 3]
	};
}
function distanceGain(d) {
	const A = CONFIG.audio;
	if (!(d >= 0)) return 1;
	if (d >= A.earshot) return 0;
	return 1 / (1 + (d / A.falloff) ** A.falloffPow) * (1 - smooth$1((d - A.earshotFade) / (A.earshot - A.earshotFade)));
}
function buildEngine(ctx) {
	const A = CONFIG.audio;
	const sr = ctx.sampleRate;
	const maxLen = Math.ceil(MAX_SOUND_SECONDS * sr);
	const stats = {
		played: 0,
		dropped: 0,
		grouped: 0,
		stolen: 0,
		skipped: 0,
		maxConcurrent: 0,
		nodes: 0,
		synthMs: 0,
		flaps: 0,
		steps: 0
	};
	const count = (node) => {
		stats.nodes++;
		return node;
	};
	const master = count(ctx.createGain());
	master.gain.value = A.masterGain * A.limiter.ceiling;
	master.connect(ctx.destination);
	const shaper = count(ctx.createWaveShaper());
	shaper.curve = makeLimiterCurve();
	shaper.connect(master);
	const pre = count(ctx.createGain());
	pre.gain.value = 1 / A.limiter.range;
	pre.connect(shaper);
	const conv = count(ctx.createConvolver());
	conv.normalize = false;
	conv.buffer = makeRoomIR(ctx);
	if (A.comp.enabled) {
		const comp = count(ctx.createDynamicsCompressor());
		comp.threshold.value = A.comp.threshold;
		comp.knee.value = A.comp.knee;
		comp.ratio.value = A.comp.ratio;
		comp.attack.value = A.comp.attack;
		comp.release.value = A.comp.release;
		const post = count(ctx.createGain());
		post.gain.value = A.comp.makeupComp;
		conv.connect(comp).connect(post).connect(pre);
	} else conv.connect(pre);
	const busNode = count(ctx.createGain());
	busNode.channelCount = 2;
	busNode.channelCountMode = "explicit";
	busNode.connect(conv);
	if (A.ambience.gain > 0) {
		const amb = count(ctx.createBufferSource());
		amb.buffer = makeAmbience(ctx);
		amb.loop = true;
		const g = count(ctx.createGain());
		const t0 = ctx.currentTime;
		g.gain.setValueAtTime(0, t0);
		g.gain.linearRampToValueAtTime(A.ambience.gain, t0 + A.ambience.fadeIn);
		amb.connect(g).connect(pre);
		amb.start(t0);
	}
	const slots = [];
	for (let i = 0; i < A.maxVoices + A.spareVoices; i++) {
		const gain = count(ctx.createGain());
		gain.gain.value = 0;
		const pan = count(ctx.createStereoPanner());
		gain.connect(pan).connect(busNode);
		slots.push({
			gain,
			pan,
			src: null,
			buffer: ctx.createBuffer(1, maxLen + 2, sr),
			start: -1,
			end: -1,
			freeAt: -1,
			level: 0,
			dur: .1,
			released: true
		});
	}
	const groups = /* @__PURE__ */ new Map();
	let tokens = A.rate.burst;
	let tokenT = -1;
	let lastSt = null;
	/** Estimated current level of a sounding voice (its envelope is ~exponential, -40 dB at dur). */
	const levelAt = (s, t) => s.level * Math.exp(-4.6 * Math.max(0, t - s.start) / s.dur);
	/**
	* Play one sound now. p: { size, pan, gain, seed, u, foot }. Returns the voice description, or null
	* when it was skipped (inaudible), rate-limited or voice-capped.
	*/
	function play(kind, p, when, extGain = 1) {
		const K = parseKind(kind, p.seed);
		const ext = (p.gain ?? 1) * extGain;
		if (ext * (K.flap ? A.flap.gain : A.step.gain) < A.minGain) {
			stats.skipped++;
			return null;
		}
		let active = 0;
		let quiet = null;
		let quietLevel = Infinity;
		let free = null;
		for (const s of slots) {
			if (s.freeAt <= when) {
				if (!free) free = s;
				continue;
			}
			if (s.released || s.end <= when) continue;
			active++;
			const l = levelAt(s, when);
			if (l < quietLevel) {
				quietLevel = l;
				quiet = s;
			}
		}
		const density = clamp$1(active / A.maxVoices, 0, 1);
		const big = K.flap ? smooth$1((clamp$1(p.size ?? .4, 0, 1) - A.detailBelow) / A.detailRange) : 1;
		const cost = K.flap ? 1 + (1 - big) * A.detailCost * density : 0;
		if (tokenT >= 0) tokens = Math.min(A.rate.burst, tokens + (when - tokenT) * A.rate.perSecond);
		tokenT = when;
		if (tokens < cost + (big < .5 ? A.rate.reserve : 0)) {
			stats.dropped++;
			return null;
		}
		const t0 = typeof performance === "undefined" ? 0 : performance.now();
		const V = K.flap ? flapParams(K.up, p.size, p.seed, p.u, lastSt) : stepParams(K.surface, p.seed, p.foot);
		const level = V.level * ext * (1 - A.densityDuck * density * (1 + A.detailDuck * (1 - big))) / Math.sqrt(1 + A.overlapDuck * active);
		if (level < A.minGain) {
			stats.skipped++;
			return null;
		}
		if (active >= A.maxVoices) {
			if (!quiet || quietLevel > level || !free) {
				stats.dropped++;
				return null;
			}
			const g = quiet.gain.gain;
			g.setValueAtTime(quiet.level, when);
			g.linearRampToValueAtTime(0, when + A.stealFade);
			try {
				quiet.src.stop(when + A.stealFade + .001);
			} catch {}
			quiet.released = true;
			quiet.freeAt = when + A.stealFade + .004;
			stats.stolen++;
			active--;
		}
		if (!free) {
			stats.dropped++;
			return null;
		}
		tokens -= cost;
		if (K.flap) lastSt = V.semitones;
		const rng = mulberry32(V.synthSeed);
		const tick = 1 - A.densityTickDuck * density;
		const air = (p.dist ?? 0) / A.earshot;
		const buffer = free.buffer;
		const data = buffer.getChannelData(0);
		const n = K.flap ? synthFlap(data, sr, {
			...V,
			tick,
			air
		}, rng) : synthStep(data, sr, V, rng);
		const start = when + (K.flap ? (A.onsetJitter + A.rippleJitter * density) * ((V.synthSeed & 1023) / 1023) : 0);
		const dur = n / sr;
		const src = count(ctx.createBufferSource());
		src.buffer = buffer;
		src.connect(free.gain);
		free.gain.gain.setValueAtTime(level, start);
		free.pan.pan.setValueAtTime(clamp$1((p.pan ?? 0) * A.panWidth, -1, 1), start);
		src.start(start, 0, dur);
		free.src = src;
		free.start = start;
		free.end = start + dur;
		free.freeAt = start + dur + .03;
		free.level = level;
		free.dur = V.dur;
		free.released = false;
		stats.played++;
		if (K.flap) stats.flaps++;
		else stats.steps++;
		if (active + 1 > stats.maxConcurrent) stats.maxConcurrent = active + 1;
		if (t0) stats.synthMs += performance.now() - t0;
		return {
			...V,
			kind,
			start,
			level,
			pan: p.pan ?? 0
		};
	}
	const G = A.tile;
	const queue = [];
	let nextOnset = -1;
	const startOne = (c, tStart) => {
		c.g.pend = null;
		const wait = Math.max(0, tStart - c.t);
		const v = play(c.kind, c.p, tStart, Math.pow(10, -G.deferDb * Math.min(1, wait / G.maxDefer) / 20) * (c.accent ? G.accentGain : 1));
		if (!v) return null;
		c.g.voiced++;
		c.g.size = clamp$1(c.p.size ?? .4, 0, 1);
		nextOnset = v.start + G.spacing + G.spacingJitter * ((v.synthSeed >>> 10 & 1023) / 1023 * 2 - 1);
		return v;
	};
	/** Start queued flaps whose slot is within the next `lookahead` seconds. */
	function drain(when) {
		while (queue.length && nextOnset <= when + G.lookahead) {
			let bi = 0;
			for (let i = 1; i < queue.length; i++) if (queue[i].score > queue[bi].score) bi = i;
			const c = queue[bi];
			queue.splice(bi, 1);
			const tStart = Math.max(nextOnset, c.t, when);
			if (tStart - c.t > G.maxDefer) {
				c.g.pend = null;
				stats.dropped++;
				continue;
			}
			startOne(c, tStart);
		}
	}
	/**
	* A sound wants to play at `when`: footsteps and flaps without a tile (`p.group`) are played, tile flaps go through
	* the gesture logic above. Returns the voice if it started right away, else null (queued, grouped or dropped).
	*/
	function trigger(kind, p, when) {
		drain(when);
		if (p.group === void 0 || !parseKind(kind, p.seed).flap) return play(kind, p, when);
		const size = clamp$1(p.size ?? .4, 0, 1);
		let g = groups.get(p.group);
		if (!g || when - g.t > A.groupWindow) {
			if (groups.size > 96) {
				for (const [k, v] of groups) if (when - v.t > A.groupWindow && !v.pend) groups.delete(k);
			}
			g = {
				t: when,
				voiced: 0,
				size: 0,
				pend: null
			};
			groups.set(p.group, g);
		}
		const accent = g.voiced > 0;
		if (g.voiced >= G.voicesPerTile || accent && size < g.size + G.accentBigger) {
			stats.grouped++;
			return null;
		}
		const score = (p.gain ?? 1) * lerp(A.flap.sizeGainMin, 1, size) * (kind === "flap-down" ? G.downScore : 1) * (accent ? G.accentScore : 1);
		if (g.pend) {
			if (size > clamp$1(g.pend.p.size ?? .4, 0, 1)) {
				g.pend.p = p;
				g.pend.kind = kind;
				g.pend.score = Math.max(g.pend.score, score);
			}
			stats.grouped++;
			return null;
		}
		const c = {
			kind,
			p,
			t: when,
			score,
			g,
			accent
		};
		if (!queue.length && when >= nextOnset) return startOne(c, when);
		g.pend = c;
		queue.push(c);
		if (queue.length > G.queue) {
			let wi = 0;
			for (let i = 1; i < queue.length; i++) if (queue[i].score < queue[wi].score) wi = i;
			queue[wi].g.pend = null;
			queue.splice(wi, 1);
			stats.dropped++;
		}
		return null;
	}
	return {
		ctx,
		master,
		trigger,
		stats,
		drain,
		pending: () => queue.length,
		activeVoices(t) {
			let a = 0;
			for (const s of slots) if (!s.released && s.end > t) a++;
			return a;
		}
	};
}
function createPaperAudio({ muted = false } = {}) {
	const A = CONFIG.audio;
	let ctx = null;
	let engine = null;
	let isMuted = !!muted;
	let gestureSeen = false;
	let stepCount = 0;
	function ensure() {
		if (ctx || isMuted) return;
		const AC = window.AudioContext || window.webkitAudioContext;
		if (!AC) return;
		try {
			ctx = new AC({
				sampleRate: A.sampleRate,
				latencyHint: "interactive"
			});
		} catch {
			ctx = new AC();
		}
		engine = buildEngine(ctx);
	}
	const live = () => !isMuted && ctx && engine && ctx.state === "running";
	const offFold = bus.on("fold", (e) => {
		if (!live()) return;
		const dist = distanceFor(e.x, e.z);
		const gain = distanceGain(dist);
		if (gain <= 0) {
			engine.stats.skipped++;
			return;
		}
		engine.trigger(e.dir === "down" ? "flap-down" : "flap-up", {
			size: e.size,
			pan: e.pan,
			gain,
			dist,
			seed: foldSeed(e),
			group: groupKey(e)
		}, ctx.currentTime + .004);
		if (engine.pending() && !drainTimer) drainTimer = setTimeout(drainLater, 30);
	});
	let drainTimer = 0;
	function drainLater() {
		drainTimer = 0;
		if (!live()) return;
		engine.drain(ctx.currentTime + .004);
		if (engine.pending()) drainTimer = setTimeout(drainLater, 30);
	}
	const offStep = bus.on("step", (e) => {
		stepCount++;
		if (!live()) return;
		engine.trigger("step-" + (e.surface || "grass"), {
			pan: (e.foot ? 1 : -1) * A.step.footPan,
			gain: 1,
			seed: hash2(stepCount, 31, A.seed),
			foot: e.foot
		}, ctx.currentTime + .004);
	});
	const offFirst = bus.on("input:first", () => {
		api.unlock();
	});
	const api = {
		/** The live AudioContext (null until the first gesture). */
		get context() {
			return ctx;
		},
		get muted() {
			return isMuted;
		},
		/** Create/resume the AudioContext. Must be called from a user gesture (main wires 'input:first'). */
		unlock() {
			gestureSeen = true;
			ensure();
			if (ctx && ctx.state !== "running") ctx.resume().catch(() => {});
		},
		setMuted(m) {
			isMuted = !!m;
			if (!isMuted && gestureSeen) {
				ensure();
				if (ctx && ctx.state !== "running") ctx.resume().catch(() => {});
			}
			if (engine) {
				const g = engine.master.gain;
				const t = ctx.currentTime;
				g.cancelScheduledValues(t);
				g.setTargetAtTime(isMuted ? 0 : A.masterGain * A.limiter.ceiling, t, .015);
			}
		},
		/** Live engine counters ({played, dropped, stolen, skipped, maxConcurrent, nodes, synthMs, ...}). */
		stats() {
			return { live: engine ? {
				...engine.stats,
				voices: engine.activeVoices(ctx.currentTime),
				state: ctx.state,
				sampleRate: ctx.sampleRate,
				time: ctx.currentTime
			} : null };
		},
		dispose() {
			offFold();
			offStep();
			offFirst();
			if (drainTimer) clearTimeout(drainTimer);
			if (ctx) ctx.close();
			ctx = null;
			engine = null;
		}
	};
	return api;
}
// src/audio/music.js
var BEATS = 4;
var LEFT = [
	[
		36,
		43,
		52,
		55
	],
	[
		35,
		43,
		50,
		55
	],
	[
		33,
		40,
		48,
		52
	],
	[
		29,
		41,
		45,
		52
	],
	[
		29,
		36,
		45,
		48
	],
	[
		40,
		48,
		52,
		55
	],
	[
		38,
		45,
		53,
		57
	],
	[
		31,
		38,
		48,
		50
	],
	[
		33,
		40,
		48,
		52
	],
	[
		31,
		40,
		47,
		52
	],
	[
		29,
		36,
		45,
		48
	],
	[
		28,
		40,
		48,
		55
	],
	[
		38,
		45,
		50,
		53
	],
	[
		36,
		45,
		48,
		52
	],
	[
		29,
		41,
		45,
		52
	],
	[
		31,
		38,
		47,
		50
	]
];
var RIGHT = [
	[[
		0,
		76,
		1
	], [
		2,
		79,
		.85
	]],
	[[
		0,
		74,
		.95
	], [
		3,
		71,
		.7
	]],
	[[
		0,
		72,
		.95
	], [
		2,
		76,
		.85
	]],
	[[
		0,
		69,
		.9
	], [
		3,
		72,
		.65
	]],
	[
		[
			0,
			69,
			.8
		],
		[
			1,
			72,
			.85
		],
		[
			2,
			77,
			1
		]
	],
	[[
		0,
		76,
		.95
	], [
		2.5,
		67,
		.65
	]],
	[
		[
			0,
			77,
			.95
		],
		[
			1.5,
			76,
			.8
		],
		[
			2,
			74,
			.85
		]
	],
	[[
		0,
		74,
		.85
	], [
		2,
		71,
		.7
	]],
	[
		[
			0,
			72,
			.85
		],
		[
			1,
			76,
			.9
		],
		[
			2,
			81,
			1
		]
	],
	[
		[
			0,
			79,
			.95
		],
		[
			2,
			76,
			.8
		],
		[
			3,
			74,
			.75
		]
	],
	[[
		0,
		72,
		.9
	], [
		2,
		69,
		.75
	]],
	[
		[
			0,
			67,
			.75
		],
		[
			2,
			72,
			.85
		],
		[
			3,
			76,
			.9
		]
	],
	[[
		0,
		77,
		1
	], [
		2,
		74,
		.8
	]],
	[[
		0,
		76,
		.9
	], [
		2,
		72,
		.75
	]],
	[
		[
			0,
			69,
			.8
		],
		[
			1.5,
			72,
			.8
		],
		[
			3,
			74,
			.85
		]
	],
	[[
		0,
		74,
		.8
	]]
];
var LEFT_BEATS = [
	0,
	.5,
	1,
	1.5,
	2.5,
	3.5
];
var LEFT_IDX = [
	0,
	1,
	2,
	3,
	2,
	1
];
var NOTE_SR = 24e3;
function hash$1(a, b) {
	let h = (Math.imul(a | 0, 2654435761) ^ Math.imul((b | 0) + 2135587861, 2246822507)) >>> 0;
	h ^= h >>> 15;
	h = Math.imul(h, 739982445) >>> 0;
	h ^= h >>> 12;
	h = Math.imul(h, 695872825) >>> 0;
	h ^= h >>> 15;
	return (h >>> 0) / 4294967296;
}
/** Notes of one bar: [{ beat, midi, vel }] */
function barNotes(bar) {
	const i = (bar % 16 + 16) % 16;
	const cycle = Math.floor(bar / 16);
	const r = (k) => hash$1(bar, k);
	const out = [];
	const lh = LEFT[i];
	const sparse = cycle % 3 === 2;
	for (let k = 0; k < LEFT_BEATS.length; k++) {
		if (k > 0 && sparse && k % 2 === 1) continue;
		if (k >= 4 && r(k) < .3) continue;
		const vel = (k === 0 ? .3 : .15 + .03 * (k === 2)) * (.9 + r(10 + k) * .2);
		out.push({
			beat: LEFT_BEATS[k] + (k ? (r(20 + k) - .5) * .035 : 0),
			midi: lh[LEFT_IDX[k]],
			vel
		});
	}
	const low = cycle % 2 === 1;
	for (let k = 0; k < RIGHT[i].length; k++) {
		const [b, m, v] = RIGHT[i][k];
		if (cycle > 0 && k > 0 && r(40 + k) < .22) continue;
		out.push({
			beat: b + .015 + (r(50 + k) - .5) * .04,
			midi: m - 12,
			vel: (low ? .2 : .24) * v * (.9 + r(60 + k) * .2)
		});
	}
	return out;
}
/** One piano note as mono samples at NOTE_SR, peak-normalised. */
function synthNote(midi) {
	const sr = NOTE_SR;
	const f = 440 * Math.pow(2, (midi - 69) / 12);
	const dur = Math.max(3.2, Math.min(7.5, 7.5 - (midi - 36) * .075));
	const n = Math.floor(sr * dur);
	const out = new Float32Array(n);
	const B = 8e-5 * Math.pow(2, (midi - 40) / 12);
	const d0 = .55 + Math.max(0, midi - 40) * .022;
	const maxK = Math.max(2, Math.min(12, Math.floor(2800 / f)));
	for (let k = 1; k <= maxK; k++) {
		const fk = f * k * Math.sqrt(1 + B * k * k);
		if (fk > sr * .45) break;
		const amp = Math.pow(k, -2.4) * Math.abs(Math.sin(Math.PI * k / 8.3)) / Math.abs(Math.sin(Math.PI / 8.3));
		const dk = d0 * (1 + .42 * (k - 1));
		const rFast = Math.exp(-dk * 3.2 / sr);
		const rSlow = Math.exp(-dk * .7 / sr);
		for (let s = 0; s < 2; s++) {
			const cents = (s ? 1 : -1) * (.5 + .12 * k);
			const w = 2 * Math.PI * fk * Math.pow(2, cents / 1200) / sr;
			const c2 = 2 * Math.cos(w);
			const ph = hash$1(midi, k * 2 + s) * 6.283;
			let y1 = Math.sin(ph - w);
			let y2 = Math.sin(ph - 2 * w);
			let eF = .6 * amp * .5;
			let eS = .4 * amp * .5;
			for (let i = 0; i < n; i++) {
				const y = c2 * y1 - y2;
				y2 = y1;
				y1 = y;
				out[i] += y * (eF + eS);
				eF *= rFast;
				eS *= rSlow;
			}
		}
	}
	let seed = midi * 2654435761 >>> 0;
	let lp = 0;
	const thump = .025 * Math.min(1, 200 / f + .3);
	const att = Math.floor(sr * .006);
	const rel = Math.floor(sr * .5);
	let peak = 0;
	for (let i = 0; i < n; i++) {
		if (i < sr * .04) {
			seed = Math.imul(seed, 1664525) + 1013904223 >>> 0;
			lp += (seed / 2147483648 - 1 - lp) * .12;
			out[i] += lp * thump * Math.exp(-i / (sr * .008));
		}
		if (i < att) out[i] *= i / att;
		if (i > n - rel) out[i] *= (n - i) / rel;
		const a = Math.abs(out[i]);
		if (a > peak) peak = a;
	}
	const g = 1 / (peak || 1);
	for (let i = 0; i < n; i++) out[i] *= g;
	return out;
}
var ALL_NOTES = (() => {
	const s = /* @__PURE__ */ new Set();
	for (const l of LEFT) for (const m of l) s.add(m);
	for (const b of RIGHT) for (const [, m] of b) {
		s.add(m);
		s.add(m - 12);
	}
	s.add(79);
	s.add(83);
	return [...s].sort((a, b) => a - b);
})();
var sampleCache = /* @__PURE__ */ new Map();
var samples = (midi) => {
	let d = sampleCache.get(midi);
	if (!d) {
		d = synthNote(midi);
		sampleCache.set(midi, d);
	}
	return d;
};
function makeReverb(ctx) {
	const sr = ctx.sampleRate;
	const n = Math.floor(sr * 4);
	const buf = ctx.createBuffer(2, n, sr);
	let s = 12345;
	const rnd = () => (s = Math.imul(s, 1664525) + 1013904223 >>> 0) / 2147483648 - 1;
	const pre = Math.floor(sr * .022);
	for (let c = 0; c < 2; c++) {
		const d = buf.getChannelData(c);
		let lp = 0;
		for (let i = pre; i < n; i++) {
			const t = (i - pre) / sr;
			lp += (rnd() - lp) * (.03 + .12 * Math.exp(-t * 2.2));
			d[i] = lp * Math.exp(-t * 1.7) * Math.min(1, t / .03);
		}
	}
	return buf;
}
function buildBus(ctx) {
	const M = CONFIG.audio.music;
	const out = ctx.createGain();
	out.gain.value = 0;
	out.connect(ctx.destination);
	const dry = ctx.createGain();
	dry.connect(out);
	const conv = ctx.createConvolver();
	conv.buffer = makeReverb(ctx);
	const wet = ctx.createGain();
	wet.gain.value = M.reverb;
	dry.connect(conv);
	conv.connect(wet);
	wet.connect(out);
	return {
		out,
		dry,
		buffers: /* @__PURE__ */ new Map()
	};
}
function bufferFor(ctx, bus, midi) {
	let b = bus.buffers.get(midi);
	if (!b) {
		const d = samples(midi);
		b = ctx.createBuffer(1, d.length, NOTE_SR);
		b.getChannelData(0).set(d);
		bus.buffers.set(midi, b);
	}
	return b;
}
function playNote(ctx, bus, t, midi, vel) {
	const f = 440 * Math.pow(2, (midi - 69) / 12);
	const src = ctx.createBufferSource();
	src.buffer = bufferFor(ctx, bus, midi);
	const lp = ctx.createBiquadFilter();
	lp.type = "lowpass";
	lp.Q.value = .5;
	lp.frequency.value = Math.max(350, Math.min(1900, f * (1.3 + vel * 5)));
	const g = ctx.createGain();
	g.gain.value = vel;
	src.connect(lp);
	lp.connect(g);
	if (ctx.createStereoPanner) {
		const pan = ctx.createStereoPanner();
		pan.pan.value = Math.max(-.45, Math.min(.45, (midi - 60) / 55));
		g.connect(pan);
		pan.connect(bus.dry);
	} else g.connect(bus.dry);
	src.start(t);
}
/** Schedule every note whose onset lies in [t0, t1) (music time = ctx time - origin). */
function schedule(ctx, bus, origin, t0, t1) {
	const beat = 60 / CONFIG.audio.music.bpm;
	const barLen = beat * BEATS;
	const b0 = Math.max(0, Math.floor((t0 - .2) / barLen) - 1);
	const b1 = Math.floor(t1 / barLen);
	for (let bar = b0; bar <= b1; bar++) {
		const i = bar % 8;
		for (const n of barNotes(bar)) {
			const rub = i === 7 && n.beat > 1.9 ? (n.beat - 1.9) * .05 : 0;
			const t = bar * barLen + (n.beat + rub) * beat + .1;
			if (t >= t0 && t < t1) playNote(ctx, bus, origin + t, n.midi, n.vel);
		}
	}
}
function createMusic({ audio }) {
	const M = CONFIG.audio.music;
	let ctx = null;
	let bus = null;
	let origin = 0;
	let done = 0;
	let on = M.gain > 0;
	let warm = 0;
	function level() {
		if (!bus) return;
		const t = ctx.currentTime;
		bus.out.gain.cancelScheduledValues(t);
		bus.out.gain.setTargetAtTime(on && !audio.muted ? M.gain : 0, t, on ? M.fadeIn / 3 : .25);
	}
	function tick() {
		if (warm < ALL_NOTES.length) {
			samples(ALL_NOTES[warm++]);
			return;
		}
		const c = audio.context;
		if (!c || c.state !== "running") return;
		if (!bus) {
			ctx = c;
			bus = buildBus(ctx);
			origin = ctx.currentTime + .3;
			done = 0;
			level();
		}
		if (!on) {
			done = Math.max(done, ctx.currentTime - origin);
			return;
		}
		const until = ctx.currentTime - origin + 1.2;
		if (until > done) {
			schedule(ctx, bus, origin, done, until);
			done = until;
		}
	}
	const timer = setInterval(tick, 60);
	const CHIME = {
		scrap: {
			lo: 76,
			hi: 84,
			vel: .15,
			notes: 1
		},
		lantern: {
			lo: 43,
			hi: 57,
			vel: .2,
			notes: 1
		},
		stamp: {
			lo: 60,
			hi: 79,
			vel: .16,
			notes: 2,
			gap: .17
		}
	};
	const chimeCand = [];
	let chimeAt = -1;
	let chimeTurn = 0;
	function chime(kind = "scrap") {
		const k = CHIME[kind] || CHIME.scrap;
		if (!bus || !ctx || ctx.state !== "running" || !on || audio.muted || M.gain <= 0) return false;
		const now = ctx.currentTime;
		if (now - chimeAt < .25) return false;
		const beat = 60 / M.bpm;
		const chord = LEFT[Math.max(0, Math.floor((now - origin - .1) / (beat * BEATS))) % 16];
		chimeCand.length = 0;
		for (let i = 0; i < ALL_NOTES.length; i++) {
			const m = ALL_NOTES[i];
			if (m < k.lo || m > k.hi || !sampleCache.has(m)) continue;
			for (let j = 0; j < chord.length; j++) if ((m - chord[j]) % 12 === 0) {
				chimeCand.push(m);
				break;
			}
		}
		if (chimeCand.length === 0) return false;
		chimeAt = now;
		chimeTurn++;
		if (k.notes === 1) playNote(ctx, bus, now + .02, chimeCand[chimeTurn * 2 % chimeCand.length], k.vel);
		else {
			const a = chimeCand.length > 1 ? chimeTurn % (chimeCand.length - 1) : 0;
			playNote(ctx, bus, now + .02, chimeCand[a], k.vel);
			if (chimeCand.length > 1) playNote(ctx, bus, now + .02 + k.gap, chimeCand[a + 1], k.vel * 1.1);
		}
		return true;
	}
	return {
		get on() {
			return on;
		},
		/** Gameplay feedback: chime('stamp' | 'scrap' | 'lantern'). Quiet, in the current chord, rate-limited. @returns true if it sounded */
		chime,
		toggle() {
			on = !on;
			level();
			return on;
		},
		refresh: level,
		dispose() {
			clearInterval(timer);
			if (bus) bus.out.disconnect();
		}
	};
}
// src/render/biomegrade.js
/** Night look shared by all biomes (fixer pass): dark navy ambient, the moon key carries the shapes and the shadows,
* warm only at the lights (glow + spill). Back-lit translucency turns cool so green cards stop going magenta. */
var NIGHT_BASE = {
	lights: {
		key: {
			color: "#8fb0f0",
			intensity: 1.05,
			elevationDeg: 50,
			azimuthDeg: -62
		},
		fill: {
			color: "#3a58ac",
			intensity: .38,
			elevationDeg: 20
		},
		hemi: {
			sky: "#4666c8",
			ground: "#16285c",
			intensity: .5
		},
		lantern: {
			intensity: 2.3,
			distance: 5.6
		},
		paper: {
			wrap: .42,
			translucency: .12,
			translucencyTint: "#7fa0d8",
			fibreCloud: .05
		},
		gobo: {
			key: .2,
			tint: .05
		},
		fade: {
			color: "#070c2a",
			colorRight: "#060922",
			start: 5,
			end: 11.5,
			amount: .92
		},
		shadow: {
			leak: "#16286a",
			lightSize: .22
		},
		background: "#070a24"
	},
	post: {
		exposure: .92,
		bloom: .3,
		spill: 7.5,
		bloomThreshold: 1.25,
		tint: [
			.82,
			.97,
			1.2
		],
		shadowTint: "#091638",
		shadowLift: .042,
		saturation: .74,
		contrast: 1.1,
		vignette: .34,
		aoTint: "#081030",
		greenDesat: .45,
		split: .02,
		edgeRim: .6,
		edgeRimColor: "#fbf6ea",
		aoRadius: .22,
		grain: .02,
		ao: 1
	},
	dof: {
		ramp: .42,
		maxBlurPx: 16,
		nearGain: 1.2
	},
	assets: { glowIntensity: 9 }
};
/**
* Per-biome overrides. Starting points from ref/style2/STYLE.md sec. 3, tuned against captures.
* heartland has no entry on purpose (identity).
*/
var GRADE = {
	desert: {
		day: {
			lights: {
				key: {
					color: "#fff0d2",
					intensity: 3.5,
					elevationDeg: 54,
					azimuthDeg: -58
				},
				fill: {
					color: "#d8b0b4",
					intensity: .95
				},
				hemi: {
					sky: "#ffe9c8",
					ground: "#c08c94",
					intensity: .5
				},
				gobo: {
					key: .16,
					tint: .08
				},
				shadow: {
					lightSize: .28,
					leak: "#8c6470"
				},
				fade: {
					color: "#c0905c",
					colorRight: "#b08668",
					start: 7,
					end: 14,
					amount: .7
				},
				background: "#b4885a"
			},
			post: {
				exposure: .73,
				contrast: 1.1,
				saturation: 1.04,
				tint: [
					1.02,
					.975,
					.94
				],
				shadowTint: "#2c1434",
				aoTint: "#5a3038",
				vignette: .1
			},
			dof: {
				farGain: .68,
				focusBand: .32
			}
		},
		night: { lights: {
			fade: {
				color: "#0c0c2c",
				colorRight: "#0a0a24"
			},
			background: "#0a0a28"
		} }
	},
	snow: {
		day: {
			lights: {
				key: {
					color: "#fbf0e0",
					intensity: 2.8,
					elevationDeg: 52
				},
				fill: {
					color: "#a4bbe0",
					intensity: 1.3
				},
				hemi: {
					sky: "#dce8ff",
					ground: "#96aedc",
					intensity: .55
				},
				gobo: {
					key: .14,
					tint: .03
				},
				shadow: {
					lightSize: .32,
					leak: "#6c84b0"
				},
				fade: {
					color: "#aab4c8",
					colorRight: "#9aa6be",
					start: 6.5,
					end: 13.5,
					amount: .72
				},
				background: "#a2aec4"
			},
			post: {
				exposure: .75,
				contrast: 1.08,
				saturation: 1,
				tint: [
					.98,
					1,
					1.03
				],
				shadowTint: "#0a1c3a",
				aoTint: "#3a5078",
				vignette: .1,
				split: .02
			},
			assets: { glowIntensity: 4.2 }
		},
		night: {
			lights: {
				hemi: { intensity: .36 },
				key: { intensity: .8 },
				fade: {
					color: "#0a1434",
					colorRight: "#08102a"
				},
				background: "#09112e"
			},
			post: {
				exposure: .88,
				saturation: .68
			}
		}
	},
	blossom: {
		day: {
			lights: {
				key: {
					color: "#ffe6cc",
					intensity: 2.9,
					elevationDeg: 62
				},
				fill: {
					color: "#c9b9da",
					intensity: 1.15
				},
				hemi: {
					sky: "#fff1ec",
					ground: "#c4a6b8",
					intensity: .5
				},
				gobo: {
					key: .18,
					tint: .09
				},
				shadow: {
					lightSize: .32,
					leak: "#8c6c88"
				},
				fade: {
					color: "#bc9ea4",
					colorRight: "#ac94a2",
					start: 6.5,
					end: 13.5,
					amount: .7
				},
				background: "#b0969e"
			},
			post: {
				exposure: .8,
				contrast: 1.05,
				saturation: 1.05,
				tint: [
					1.03,
					.98,
					.97
				],
				shadowTint: "#2a1832",
				aoTint: "#5a3848",
				greenDesat: .3,
				vignette: .1
			}
		},
		night: {
			lights: {
				fade: {
					color: "#0b0d2e",
					colorRight: "#090a26"
				},
				background: "#0a0b28"
			},
			post: { saturation: .68 }
		}
	},
	pinewood: {
		day: {
			lights: {
				key: {
					color: "#f8e2b6",
					intensity: 2.8,
					elevationDeg: 60
				},
				fill: {
					color: "#62857f",
					intensity: 1.05
				},
				hemi: {
					sky: "#c0d6cc",
					ground: "#55786e",
					intensity: .6
				},
				gobo: {
					key: .14,
					tint: .03
				},
				shadow: {
					lightSize: .4,
					leak: "#44685c"
				},
				fade: {
					color: "#788e84",
					colorRight: "#6c8480",
					start: 4.8,
					end: 11.5,
					amount: .82
				},
				background: "#748a82"
			},
			post: {
				exposure: .86,
				contrast: 1.08,
				saturation: .98,
				tint: [
					.99,
					1,
					.97
				],
				shadowTint: "#0a2420",
				aoTint: "#2c4c44",
				greenDesat: .4,
				vignette: .13,
				split: .02
			},
			assets: { glowIntensity: 4.2 },
			dof: {
				farGain: .75,
				focusBand: .3
			}
		},
		night: {
			lights: {
				key: {
					color: "#86a8e8",
					intensity: .95
				},
				fill: {
					color: "#3a64a8",
					intensity: .5
				},
				hemi: {
					sky: "#4a74c0",
					ground: "#1a3c60",
					intensity: .85
				},
				fade: {
					color: "#0b2238",
					colorRight: "#0a1c30",
					start: 4.6,
					end: 10.5,
					amount: .86
				},
				background: "#06162a"
			},
			post: { tint: [
				.84,
				.99,
				1.16
			] }
		}
	}
};
var isHex = (v) => typeof v === "string" && v[0] === "#";
var _c = new Color();
function leaves(tree, path, out) {
	for (const k of Object.keys(tree)) {
		const v = tree[k];
		if (v && typeof v === "object" && !Array.isArray(v)) leaves(v, path.concat(k), out);
		else out.set(path.concat(k).join("."), v);
	}
	return out;
}
/** hex -> linear rgb triple, array -> copy, number -> number */
function enc(v) {
	if (isHex(v)) {
		_c.set(v);
		return [
			_c.r,
			_c.g,
			_c.b
		];
	}
	return Array.isArray(v) ? v.slice() : v;
}
/**
* @param {number} [soft] blend half-width (tiles) of the biome cross-fade
* @returns {{ update(dt:number, seed:number, x:number, z:number, night:number):boolean, weights:Float32Array, force(id:string|null):void }}
*/
function createBiomeGrade({ soft = 2 } = {}) {
	const nb = BIOMES.length;
	const nightBase = leaves(NIGHT_BASE, [], /* @__PURE__ */ new Map());
	const dayMaps = BIOMES.map((b) => leaves(GRADE[b] && GRADE[b].day || {}, [], /* @__PURE__ */ new Map()));
	const nightMaps = BIOMES.map((b) => leaves(GRADE[b] && GRADE[b].night || {}, [], /* @__PURE__ */ new Map()));
	const paths = new Set(nightBase.keys());
	for (const m of dayMaps) for (const k of m.keys()) paths.add(k);
	for (const m of nightMaps) for (const k of m.keys()) paths.add(k);
	const items = [];
	for (const path of paths) {
		const parts = path.split(".");
		let obj = CONFIG;
		for (let i = 0; i < parts.length - 1 && obj; i++) obj = obj[parts[i]];
		const k = parts[parts.length - 1];
		if (!obj || obj[k] === void 0) continue;
		const base = obj[k];
		const kind = isHex(base) ? 2 : Array.isArray(base) ? 1 : 0;
		const day = [];
		const night = [];
		for (let b = 0; b < nb; b++) {
			const d = dayMaps[b].has(path) ? dayMaps[b].get(path) : base;
			const n = nightMaps[b].has(path) ? nightMaps[b].get(path) : nightBase.has(path) ? nightBase.get(path) : d;
			day.push(enc(d));
			night.push(enc(n));
		}
		items.push({
			obj,
			k,
			kind,
			base,
			day,
			night,
			acc: kind ? [
				0,
				0,
				0
			] : 0,
			hasNight: nightBase.has(path) || nightMaps.some((m) => m.has(path))
		});
	}
	const target = new Float32Array(nb);
	const w = new Float32Array(nb);
	const sm = new Float32Array(nb);
	sm[0] = 1;
	const applied = new Float32Array(nb).fill(-1);
	let appliedNight = -1;
	let first = true;
	let forced = -1;
	w[0] = 1;
	function write(e) {
		const pureHeartDay = e === 0 && w[0] === 1;
		for (const it of items) {
			if (pureHeartDay) {
				it.obj[it.k] = it.kind === 1 ? it.base.slice() : it.base;
				continue;
			}
			if (it.kind === 0) {
				let d = 0;
				let n = 0;
				for (let b = 0; b < nb; b++) {
					d += w[b] * it.day[b];
					n += w[b] * it.night[b];
				}
				it.obj[it.k] = d + (n - d) * e;
			} else {
				const a = it.acc;
				const len = it.kind === 2 ? 3 : it.base.length;
				for (let i = 0; i < len; i++) {
					let d = 0;
					let n = 0;
					for (let b = 0; b < nb; b++) {
						d += w[b] * it.day[b][i];
						n += w[b] * it.night[b][i];
					}
					a[i] = d + (n - d) * e;
				}
				if (it.kind === 2) it.obj[it.k] = "#" + _c.setRGB(a[0], a[1], a[2]).getHexString();
				else it.obj[it.k] = a.slice(0, len);
			}
		}
	}
	return {
		weights: w,
		/** Debug / captures: pin the grade to one biome (null = follow the traveller). */
		force(id) {
			forced = id == null ? -1 : BIOMES.indexOf(id);
			first = true;
		},
		/**
		* @param {number} dt seconds (0 = snap, used by teleports / captures)
		* @param {number} x world x / TILE_SIZE  @param {number} z world z / TILE_SIZE
		* @param {number} night eased 0..1
		* @returns {boolean} true when CONFIG was rewritten
		*/
		update(dt, seed, x, z, night) {
			if (forced >= 0) {
				target.fill(0);
				target[forced] = 1;
			} else biomeWeights(seed, x, z, target, soft);
			let sum = 0;
			for (let b = 0; b < nb; b++) {
				target[b] = Math.max(0, target[b] - .03);
				sum += target[b];
			}
			const k = first || dt <= 0 ? 1 : 1 - Math.exp(-dt * 2.2);
			first = false;
			let changed = night !== appliedNight;
			let wsum = 0;
			for (let b = 0; b < nb; b++) {
				sm[b] += (target[b] / sum - sm[b]) * k;
				w[b] = Math.round(sm[b] * 512) / 512;
				wsum += w[b];
			}
			for (let b = 0; b < nb; b++) {
				w[b] = wsum > 0 ? w[b] / wsum : +(b === 0);
				if (Math.abs(w[b] - applied[b]) > 1e-4) changed = true;
			}
			if (!changed) return false;
			applied.set(w);
			appliedNight = night;
			write(night);
			return true;
		}
	};
}
// src/render/daynight.js
function createDayNight({ scene, night = false }) {
	const grade = createBiomeGrade();
	let target = night ? 1 : 0;
	let cur = target;
	let glow = null;
	let glowApplied = -1;
	function applyGlow() {
		if (!glow) {
			glow = /* @__PURE__ */ new Set();
			scene.traverse((o) => {
				for (const m of Array.isArray(o.material) ? o.material : o.material ? [o.material] : []) if (m.emissive && m.emissiveIntensity > 0 && m.emissive.getHex() !== 0) glow.add(m);
			});
		}
		const g = CONFIG.assets.glowIntensity;
		if (g === glowApplied) return;
		glowApplied = g;
		for (const m of glow) m.emissiveIntensity = g;
	}
	return {
		get night() {
			return target === 1;
		},
		/** The biome grade (weights, force(id)) for debugging: __atlas.daynight.grade.force('snow'). */
		grade,
		toggle() {
			target = target ? 0 : 1;
			return target === 1;
		},
		set(n, snap = false) {
			target = n ? 1 : 0;
			if (snap) cur = target;
		},
		update(dt) {
			if (cur !== target) cur = target > cur ? Math.min(target, cur + dt / 1.6) : Math.max(target, cur - dt / 1.6);
			const e = cur * cur * (3 - 2 * cur);
			const t = state.traveller;
			const ts = CONFIG.TILE_SIZE || 2;
			if (grade.update(dt, state.seed, t.x / ts, t.z / ts, e) || !glow) applyGlow();
		}
	};
}
// src/life/life.js
var KINDS = [
	"leaves",
	"dust",
	"gusts",
	"snow",
	"petals",
	"rain",
	"mist",
	"fireflies",
	"butterflies",
	"clouds",
	"birds"
];
var K = {};
KINDS.forEach((k, i) => {
	K[k] = i;
});
var NB = BIOMES.length;
var NK = KINDS.length;
var TAU$2 = Math.PI * 2;
var HALF_PI$1 = Math.PI / 2;
var GRAD = 5;
function hash3(a, b, c) {
	let h = (Math.imul(a | 0, 2654435761) ^ Math.imul(b | 0, 2246822507) ^ Math.imul(c | 0, 3266489909)) >>> 0;
	h ^= h >>> 15;
	h = Math.imul(h, 739982445) >>> 0;
	h ^= h >>> 12;
	h = Math.imul(h, 695872825) >>> 0;
	h ^= h >>> 15;
	return (h >>> 0) / 4294967296;
}
var smooth = (a, b, x) => {
	let t = (x - a) / (b - a);
	t = t < 0 ? 0 : t > 1 ? 1 : t;
	return t * t * (3 - 2 * t);
};
var mix = (r, t) => r[0] + (r[1] - r[0]) * t;
var CELLS = {
	leaf: 0,
	flake: 1,
	petal: 2,
	bar: 3,
	ring: 4,
	smoke: 5,
	bird: 6,
	flyWing: 7,
	dot: 8,
	leaf2: 9
};
var GRID = 4;
function makeShapeTexture() {
	const S = 128;
	const cv = document.createElement("canvas");
	cv.width = cv.height = 512;
	const g = cv.getContext("2d");
	g.clearRect(0, 0, cv.width, cv.height);
	const cell = (i, draw, lip = true) => {
		g.save();
		g.translate(i % GRID * S + S / 2, Math.floor(i / GRID) * S + S / 2);
		g.scale(S * .42, S * .42);
		if (lip) {
			g.save();
			g.translate(.07, .09);
			g.fillStyle = g.strokeStyle = "#a9a092";
			draw(false);
			g.restore();
		}
		g.fillStyle = g.strokeStyle = "#ffffff";
		draw(true);
		g.restore();
	};
	const crease = (pts) => {
		g.save();
		g.strokeStyle = "#d2cabb";
		g.lineWidth = .07;
		g.lineCap = "round";
		g.beginPath();
		g.moveTo(pts[0], pts[1]);
		for (let i = 2; i < pts.length; i += 2) g.lineTo(pts[i], pts[i + 1]);
		g.stroke();
		g.restore();
	};
	const poly = (pts) => {
		g.beginPath();
		g.moveTo(pts[0], pts[1]);
		for (let i = 2; i < pts.length; i += 2) g.lineTo(pts[i], pts[i + 1]);
		g.closePath();
		g.fill();
	};
	cell(CELLS.leaf, (top) => {
		g.beginPath();
		g.moveTo(0, -1);
		g.quadraticCurveTo(.82, -.1, 0, 1);
		g.quadraticCurveTo(-.82, -.1, 0, -1);
		g.fill();
		if (top) crease([
			0,
			-.8,
			0,
			.9
		]);
	});
	cell(CELLS.leaf2, (top) => {
		poly([
			0,
			-1,
			.3,
			-.45,
			.85,
			-.55,
			.6,
			-.05,
			.95,
			.3,
			.4,
			.4,
			.3,
			.95,
			0,
			.6,
			-.3,
			.95,
			-.4,
			.4,
			-.95,
			.3,
			-.6,
			-.05,
			-.85,
			-.55,
			-.3,
			-.45
		]);
		if (top) crease([
			0,
			-.7,
			0,
			.8
		]);
	});
	cell(CELLS.flake, () => {
		poly([
			0,
			-.9,
			.8,
			-.42,
			.74,
			.5,
			0,
			.92,
			-.8,
			.46,
			-.76,
			-.44
		]);
	});
	cell(CELLS.petal, (top) => {
		g.beginPath();
		g.moveTo(0, 1);
		g.bezierCurveTo(.95, .5, .75, -.9, .12, -.92);
		g.lineTo(0, -.7);
		g.lineTo(-.12, -.92);
		g.bezierCurveTo(-.75, -.9, -.95, .5, 0, 1);
		g.fill();
		if (top) crease([
			0,
			-.5,
			0,
			.8
		]);
	});
	cell(CELLS.bar, () => {
		g.fillRect(-1.1, -1.1, 2.2, 2.2);
	}, false);
	cell(CELLS.ring, () => {
		g.lineWidth = .24;
		g.beginPath();
		g.arc(0, 0, .8, 0, TAU$2);
		g.stroke();
	}, false);
	cell(CELLS.smoke, (top) => {
		g.beginPath();
		g.arc(0, 0, .9, 0, TAU$2);
		g.fill();
		if (top) {
			g.save();
			g.strokeStyle = "#cfc7b9";
			g.lineWidth = .08;
			g.lineCap = "round";
			g.beginPath();
			for (let a = 0; a <= 9.5; a += .2) {
				const r = .07 + a * .062;
				const x = .02 + Math.cos(a) * r;
				const y = -.05 + Math.sin(a) * r;
				if (a === 0) g.moveTo(x, y);
				else g.lineTo(x, y);
			}
			g.stroke();
			g.restore();
		}
	});
	cell(CELLS.bird, (top) => {
		poly([
			0,
			-.78,
			.16,
			-.42,
			.62,
			-.5,
			1.12,
			-.08,
			.6,
			-.08,
			.2,
			.12,
			.12,
			.5,
			.3,
			.86,
			0,
			.72,
			-.3,
			.86,
			-.12,
			.5,
			-.2,
			.12,
			-.6,
			-.08,
			-1.12,
			-.08,
			-.62,
			-.5,
			-.16,
			-.42
		]);
		if (top) crease([
			0,
			-.6,
			0,
			.6
		]);
	});
	cell(CELLS.flyWing, (top) => {
		g.beginPath();
		g.ellipse(-.18, -.38, .95, .56, -.25, 0, TAU$2);
		g.fill();
		g.beginPath();
		g.ellipse(-.42, .48, .62, .46, .3, 0, TAU$2);
		g.fill();
		if (top) {
			g.save();
			g.fillStyle = "#c9c0b0";
			g.beginPath();
			g.arc(.25, -.42, .16, 0, TAU$2);
			g.fill();
			g.beginPath();
			g.arc(-.3, .55, .12, 0, TAU$2);
			g.fill();
			g.restore();
		}
	});
	cell(CELLS.dot, () => {
		g.beginPath();
		g.arc(0, 0, .85, 0, TAU$2);
		g.fill();
	}, false);
	const N = cv.width;
	const src = g.getImageData(0, 0, N, N).data;
	const px = new Uint8Array(N * N * 4);
	for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
		const s = (y * N + x) * 4;
		const d = ((N - 1 - y) * N + x) * 4;
		const a = src[s + 3];
		if (a < 8) {
			px[d] = px[d + 1] = px[d + 2] = 255;
			px[d + 3] = 0;
		} else {
			px[d] = src[s];
			px[d + 1] = src[s + 1];
			px[d + 2] = src[s + 2];
			px[d + 3] = a;
		}
	}
	const tex = new DataTexture(px, N, N, RGBAFormat);
	tex.magFilter = LinearFilter;
	tex.needsUpdate = true;
	tex.colorSpace = SRGBColorSpace;
	tex.anisotropy = 4;
	tex.generateMipmaps = true;
	tex.minFilter = LinearMipmapLinearFilter;
	return tex;
}
/** uv rect [u0, v0, w, h] of a shape cell (canvas texture, flipY => v up). flip mirrors v. */
function cellRect(out, o, c, flip = false) {
	const col = c % GRID;
	const row = Math.floor(c / GRID);
	if (c === CELLS.bar) {
		out[o] = (col + .5) / GRID;
		out[o + 1] = 1 - (row + .5) / GRID;
		out[o + 2] = 0;
		out[o + 3] = 0;
		return;
	}
	out[o] = col / GRID;
	out[o + 2] = 1 / GRID;
	if (flip) {
		out[o + 1] = 1 - row / GRID;
		out[o + 3] = -1 / GRID;
	} else {
		out[o + 1] = 1 - (row + 1) / GRID;
		out[o + 3] = 1 / GRID;
	}
}
function creasedQuad() {
	const b = .16;
	const geo = new BufferGeometry();
	geo.setAttribute("position", new Float32BufferAttribute([
		-.5,
		-.5,
		b,
		0,
		-.5,
		0,
		0,
		.5,
		0,
		-.5,
		.5,
		b,
		0,
		-.5,
		0,
		.5,
		-.5,
		b,
		.5,
		.5,
		b,
		0,
		.5,
		0
	], 3));
	const nx = .305;
	const nz = .952;
	geo.setAttribute("normal", new Float32BufferAttribute([
		nx,
		0,
		nz,
		nx,
		0,
		nz,
		nx,
		0,
		nz,
		nx,
		0,
		nz,
		-.305,
		0,
		nz,
		-.305,
		0,
		nz,
		-.305,
		0,
		nz,
		-.305,
		0,
		nz
	], 3));
	geo.setAttribute("uv", new Float32BufferAttribute([
		0,
		0,
		.5,
		0,
		.5,
		1,
		0,
		1,
		.5,
		0,
		1,
		0,
		1,
		1,
		.5,
		1
	], 2));
	geo.setIndex([
		0,
		1,
		2,
		0,
		2,
		3,
		4,
		5,
		6,
		4,
		6,
		7
	]);
	return geo;
}
var SOFT_VERT = `
attribute vec4 aCol; attribute vec4 aPar;
varying vec4 vCol; varying vec4 vPar; varying vec2 vUv;
void main() {
  vCol = aCol; vPar = aPar; vUv = uv;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4( position, 1.0 );
  if ( aPar.y > 0.5 ) gl_Position.z = -0.999 * gl_Position.w; // ground shadows darken whatever stands on them
}`;
var SOFT_FRAG = `
varying vec4 vCol; varying vec4 vPar; varying vec2 vUv;
void main() {
  vec2 p = vUv * 2.0 - 1.0;
  float r = length( p );
  float a;
  if ( vPar.w < 0.5 ) { a = pow( max( 0.0, 1.0 - r ), 2.2 ); }
  else {
    float ang = atan( p.y, p.x );
    r *= 1.0 + 0.13 * sin( ang * 3.0 + vPar.z * 6.283 ) + 0.07 * sin( ang * 5.0 + vPar.z * 17.0 );
    a = smoothstep( 1.0, 0.2, r );
  }
  a *= vCol.a;
  gl_FragColor = vec4( vCol.rgb * a, a * vPar.x ); // premultiplied; vPar.x = 0 => additive
}`;
function createLife({ scene, assets, wfc, daynight, camera, quality = "high", seed = state.seed, world = null }) {
	const L = CONFIG.life;
	const C = L.counts;
	const qScale = quality === "low" ? .5 : quality === "med" ? .8 : 1;
	let n = 0;
	const slot = (count) => {
		const s = n;
		n += count;
		return s;
	};
	const S = {
		leaves: slot(C.leaves),
		snow: slot(C.snow),
		petals: slot(C.petals),
		rain: slot(C.rain),
		dust: slot(C.dust),
		gusts: slot(C.gusts),
		butterflies: slot(C.butterflies * 2),
		birds: slot(C.flocks * C.flockSize * 2),
		smoke: slot(C.smokeEmitters * C.smokePuffs)
	};
	const NBITS = n;
	n = 0;
	const T = {
		mist: slot(C.mist),
		clouds: slot(C.clouds),
		birdShadows: slot(C.flocks * C.flockSize),
		fireflies: slot(C.fireflies)
	};
	const NSOFT = n;
	const rng = mulberry32(21956);
	const R = new Float32Array(NBITS * 6);
	for (let i = 0; i < R.length; i++) R[i] = rng();
	const Q = new Float32Array(NSOFT * 6);
	for (let i = 0; i < Q.length; i++) Q[i] = rng();
	const shapeTex = makeShapeTexture();
	const artTex = assets && assets.textures && assets.textures.art || null;
	const bitsMat = new MeshLambertMaterial({
		map: shapeTex,
		side: 2,
		alphaTest: .5
	});
	const artUniform = { value: artTex || shapeTex };
	const liftUniform = { value: 0 };
	bitsMat.onBeforeCompile = (shader) => {
		shader.uniforms.uLifeArt = artUniform;
		shader.uniforms.uLifeLift = liftUniform;
		shader.vertexShader = shader.vertexShader.replace("#include <common>", "#include <common>\nattribute vec4 aRect;\nattribute float aTex;\nvarying float vLifeTex;").replace("#include <uv_vertex>", "#include <uv_vertex>\n	vMapUv = aRect.xy + uv * aRect.zw;\n	vLifeTex = aTex;");
		shader.fragmentShader = shader.fragmentShader.replace("#include <common>", "#include <common>\nuniform sampler2D uLifeArt;\nuniform float uLifeLift;\nvarying float vLifeTex;").replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n	totalEmissiveRadiance += diffuseColor.rgb * uLifeLift * ( 1.0 - step( 0.5, vLifeTex ) );").replace("#include <map_fragment>", "	vec4 lifeTexel = texture2D( map, vMapUv );\n	if ( vLifeTex > 0.5 ) lifeTexel = texture2D( uLifeArt, vMapUv );\n	diffuseColor *= lifeTexel;");
	};
	bitsMat.customProgramCacheKey = () => "life-bits";
	const bitsGeo = creasedQuad();
	const rectArr = new Float32Array(NBITS * 4);
	const texArr = new Float32Array(NBITS);
	const rectAttr = new InstancedBufferAttribute(rectArr, 4);
	rectAttr.setUsage(DynamicDrawUsage);
	const texAttr = new InstancedBufferAttribute(texArr, 1);
	bitsGeo.setAttribute("aRect", rectAttr);
	bitsGeo.setAttribute("aTex", texAttr);
	const bits = new InstancedMesh(bitsGeo, bitsMat, NBITS);
	bits.name = "life_bits";
	bits.instanceMatrix.setUsage(DynamicDrawUsage);
	bits.instanceColor = new InstancedBufferAttribute(new Float32Array(NBITS * 3), 3);
	bits.frustumCulled = false;
	bits.castShadow = false;
	bits.receiveShadow = false;
	const M = bits.instanceMatrix.array;
	M.fill(0);
	for (let i = 0; i < NBITS; i++) M[i * 16 + 15] = 1;
	const col = new Color();
	function paint(start, count, colors, cells, stride = 1) {
		const ca = bits.instanceColor.array;
		for (let j = 0; j < count; j++) {
			const i = start + j;
			const pick = Math.floor(j / stride);
			col.set(colors[Math.floor(hash3(pick, start, 3) * colors.length) % colors.length]);
			const shade = .9 + .1 * hash3(pick, start, 4);
			ca[i * 3] = col.r * shade;
			ca[i * 3 + 1] = col.g * shade;
			ca[i * 3 + 2] = col.b * shade;
			cellRect(rectArr, i * 4, cells[Math.floor(hash3(pick, start, 5) * cells.length) % cells.length], stride === 2 && j % 2 === 1);
		}
	}
	paint(S.leaves, C.leaves, L.leaves.colors, [
		CELLS.leaf,
		CELLS.leaf2,
		CELLS.leaf
	]);
	paint(S.snow, C.snow, L.snow.colors, [CELLS.flake, CELLS.dot]);
	paint(S.petals, C.petals, L.petals.colors, [CELLS.petal]);
	paint(S.rain, C.rain, L.rain.colors, [CELLS.bar]);
	paint(S.dust, C.dust, L.dust.colors, [CELLS.dot, CELLS.flake]);
	paint(S.gusts, C.gusts, L.gusts.colors, [CELLS.bar]);
	paint(S.butterflies, C.butterflies * 2, L.butterflies.colors, [CELLS.flyWing], 2);
	paint(S.birds, C.flocks * C.flockSize * 2, L.birds.colors, [CELLS.bird]);
	paint(S.smoke, C.smokeEmitters * C.smokePuffs, L.smoke.color, [CELLS.smoke]);
	const softGeo = new PlaneGeometry(1, 1);
	const colArr = new Float32Array(NSOFT * 4);
	const parArr = new Float32Array(NSOFT * 4);
	const colAttr = new InstancedBufferAttribute(colArr, 4);
	const parAttr = new InstancedBufferAttribute(parArr, 4);
	colAttr.setUsage(DynamicDrawUsage);
	parAttr.setUsage(DynamicDrawUsage);
	softGeo.setAttribute("aCol", colAttr);
	softGeo.setAttribute("aPar", parAttr);
	const softMat = new ShaderMaterial({
		vertexShader: SOFT_VERT,
		fragmentShader: SOFT_FRAG,
		transparent: true,
		depthWrite: false,
		depthTest: true,
		side: 2,
		toneMapped: false,
		blending: 5,
		blendEquation: 100,
		blendSrc: 201,
		blendDst: 205,
		blendSrcAlpha: 200,
		blendDstAlpha: 201
	});
	const soft = new InstancedMesh(softGeo, softMat, NSOFT);
	soft.name = "life_soft";
	soft.instanceMatrix.setUsage(DynamicDrawUsage);
	soft.frustumCulled = false;
	soft.castShadow = soft.receiveShadow = false;
	soft.renderOrder = 50;
	const SM = soft.instanceMatrix.array;
	SM.fill(0);
	for (let i = 0; i < NSOFT; i++) SM[i * 16 + 15] = 1;
	const group = new Group();
	group.name = "life";
	group.add(bits, soft);
	scene.add(group);
	function hide(A, i) {
		const o = i * 16;
		A[o] = A[o + 1] = A[o + 2] = A[o + 4] = A[o + 5] = A[o + 6] = A[o + 8] = A[o + 9] = A[o + 10] = 0;
	}
	/** R = Ry(yaw) * Rx(pitch) * Rz(roll); the quad lies in local XY (normal +Z), scaled sx / sy. */
	function put(A, i, x, y, z, yaw, pitch, roll, sx, sy) {
		const o = i * 16;
		const cy = Math.cos(yaw);
		const sy_ = Math.sin(yaw);
		const cx = Math.cos(pitch);
		const sx_ = Math.sin(pitch);
		const cz = Math.cos(roll);
		const sz = Math.sin(roll);
		A[o] = (cy * cz + sy_ * sx_ * sz) * sx;
		A[o + 1] = cx * sz * sx;
		A[o + 2] = (-sy_ * cz + cy * sx_ * sz) * sx;
		A[o + 4] = (-cy * sz + sy_ * sx_ * cz) * sy;
		A[o + 5] = cx * cz * sy;
		A[o + 6] = (sy_ * sz + cy * sx_ * cz) * sy;
		A[o + 8] = sy_ * cx * sx;
		A[o + 9] = -sx_ * sx;
		A[o + 10] = cy * cx * sx;
		A[o + 12] = x;
		A[o + 13] = y;
		A[o + 14] = z;
	}
	/** Explicit basis: X (unit) and Y (unit) axes, Z = X x Y (sz scales the crease depth: the fold angle). */
	function putBasis(A, i, x, y, z, Xx, Xy, Xz, Yx, Yy, Yz, sx, sy, sz = sx) {
		const o = i * 16;
		A[o] = Xx * sx;
		A[o + 1] = Xy * sx;
		A[o + 2] = Xz * sx;
		A[o + 4] = Yx * sy;
		A[o + 5] = Yy * sy;
		A[o + 6] = Yz * sy;
		A[o + 8] = (Xy * Yz - Xz * Yy) * sz;
		A[o + 9] = (Xz * Yx - Xx * Yz) * sz;
		A[o + 10] = (Xx * Yy - Xy * Yx) * sz;
		A[o + 12] = x;
		A[o + 13] = y;
		A[o + 14] = z;
	}
	function softPut(i, x, y, z, yaw, pitch, sx, sy, r, g, b, a, opacity, front, shape) {
		put(SM, i, x, y, z, yaw, pitch, 0, sx, sy);
		const o = i * 4;
		colArr[o] = r;
		colArr[o + 1] = g;
		colArr[o + 2] = b;
		colArr[o + 3] = a;
		parArr[o] = opacity;
		parArr[o + 1] = front;
		parArr[o + 2] = Q[i * 6 + 5];
		parArr[o + 3] = shape;
	}
	function softHide(i) {
		hide(SM, i);
		colArr[i * 4 + 3] = 0;
	}
	const wC = new Float32Array(NB);
	const wE = new Float32Array(NB);
	const wW = new Float32Array(NB);
	const wN = new Float32Array(NB);
	const wS = new Float32Array(NB);
	const dC = new Float32Array(NK);
	const dGx = new Float32Array(NK);
	const dGz = new Float32Array(NK);
	let forced = -1;
	let enabled = L.enabled !== false;
	let nightAmt = daynight && daynight.night ? 1 : 0;
	let time = 0;
	let fx = 0;
	let fz = 0;
	let camYaw = 0;
	let camElev = .9;
	let camHX = 0;
	let camHZ = .8;
	let windX = .94;
	let windZ = .34;
	let lightX = .4;
	let lightZ = .3;
	let keyLight = null;
	let keySearched = false;
	const findKey = (o) => {
		if (!keyLight && o.isDirectionalLight && o.castShadow) keyLight = o;
	};
	const cMist = new Color();
	const cMistN = new Color("#2a3350");
	const cMistD = new Color("#e3e9ea");
	const cCloud = new Color();
	const cFly = new Color();
	const NE = C.smokeEmitters;
	const _sp = [
		0,
		0,
		0
	];
	const eOn = new Uint8Array(NE);
	const eX = new Float32Array(NE);
	const eY = new Float32Array(NE);
	const eZ = new Float32Array(NE);
	const eSince = new Float64Array(NE);
	const eCx = new Int32Array(NE);
	const eCz = new Int32Array(NE);
	function dropCell(cx, cz) {
		for (let e = 0; e < NE; e++) if (eOn[e] && eCx[e] === cx && eCz[e] === cz) eOn[e] = 0;
	}
	const offRise = bus.on("tile:rise", (ev) => {
		const cell = wfc.get(ev.x, ev.z);
		if (!cell || !cell.tags || !cell.tags.includes("house")) return;
		for (let e = 0; e < NE; e++) if (eOn[e] && eCx[e] === ev.x && eCz[e] === ev.z) return;
		const offs = L.smoke.offsets[cell.model] || L.smoke.offsets.default;
		const ry = -(cell.rot || 0) * HALF_PI$1;
		const c = Math.cos(ry);
		const s = Math.sin(ry);
		for (let k = 0; k < offs.length; k++) {
			let e = 0;
			while (e < NE && eOn[e]) e++;
			if (e >= NE) return;
			_sp[0] = offs[k][0];
			_sp[1] = offs[k][1];
			_sp[2] = offs[k][2];
			const wd = world;
			if (wd && wd.standPoint && CONFIG.world.cards && CONFIG.world.cards.collide !== false) wd.standPoint(cell.model, _sp);
			const u = _sp[0];
			const v = _sp[2];
			eOn[e] = 1;
			eCx[e] = ev.x;
			eCz[e] = ev.z;
			eSince[e] = state.time;
			eX[e] = ev.x * TILE_SIZE + u * c + v * s;
			eY[e] = _sp[1];
			eZ[e] = ev.z * TILE_SIZE - u * s + v * c;
		}
	});
	const offFlat = bus.on("tile:flat", (ev) => dropCell(ev.x, ev.z));
	const offDespawn = bus.on("tile:despawn", (ev) => dropCell(ev.x, ev.z));
	const NF = C.flocks;
	const FS = C.flockSize;
	const fCyc = new Float64Array(NF).fill(-1e9);
	const fCx = new Float32Array(NF);
	const fCz = new Float32Array(NF);
	let birdSprites = null;
	if (artTex) fetch("./textures/art/atlas.json").then((r) => r.ok ? r.json() : null).then((j) => {
		if (!j || !j.sprites || !j.size) return;
		const want = L.birds.spriteNames || [];
		const list = [];
		for (const name of Object.keys(j.sprites)) {
			const sp = j.sprites[name];
			if (!(want.includes(name) || name.startsWith("sky_bits_") && /bird/i.test(String(sp.kind || sp.label || ""))) || !sp.rect) continue;
			const [x, y, w, h] = sp.rect;
			list.push([
				x / j.size[0],
				(y + h) / j.size[1],
				w / j.size[0],
				-h / j.size[1],
				w / h
			]);
		}
		if (list.length) birdSprites = list;
	}).catch(() => {});
	const landX = new Float32Array(NBITS).fill(1e9);
	const landZ = new Float32Array(NBITS).fill(1e9);
	const landT = new Uint8Array(NBITS);
	const landH = new Float32Array(NBITS);
	function landing(i, x, z) {
		if (Math.abs(landX[i] - x) < .01 && Math.abs(landZ[i] - z) < .01) return landT[i];
		landX[i] = x;
		landZ[i] = z;
		landT[i] = 0;
		landH[i] = 0;
		const w = world;
		if (w) try {
			if (w.surfaceAt(x, z) === "water") landT[i] = 1;
			else if (!w.isWalkable(x, z)) landT[i] = 2;
			else landH[i] = w.heightAt(x, z) || 0;
		} catch (err) {}
		return landT[i];
	}
	const ROOF_Y = .55;
	const NSPOT = NBITS + C.fireflies;
	const spotAX = new Float32Array(NSPOT).fill(1e9);
	const spotAZ = new Float32Array(NSPOT).fill(1e9);
	const spotF = new Uint8Array(NSPOT);
	const spotX = new Float32Array(NSPOT);
	const spotZ = new Float32Array(NSPOT);
	const FLOWER_RX = /flower|garden|orchard|gazebo|blossom|house|village|manor|church|windmill/;
	function spotFlag(i, x, z, kind) {
		if (Math.abs(spotAX[i] - x) < .01 && Math.abs(spotAZ[i] - z) < .01) return spotF[i];
		spotAX[i] = x;
		spotAZ[i] = z;
		spotF[i] = 0;
		spotX[i] = 0;
		spotZ[i] = 0;
		try {
			if (kind === 1) {
				const cell = wfc.get(Math.round(x / TILE_SIZE), Math.round(z / TILE_SIZE));
				if (cell && FLOWER_RX.test(cell.model)) spotF[i] = 1;
			} else {
				const w = world;
				if (w) for (let ri = 0; ri < 4 && !spotF[i]; ri++) for (let k = 0; k < 8; k++) {
					const a = (k + i % 8 * .37) * (TAU$2 / 8);
					const ox = Math.cos(a) * ri * .8;
					const oz = Math.sin(a) * ri * .8;
					if (w.surfaceAt(x + ox, z + oz) === "water") {
						spotF[i] = 1;
						spotX[i] = ox * .85;
						spotZ[i] = oz * .85;
						break;
					}
					if (ri === 0) break;
				}
			}
		} catch (err) {}
		return spotF[i];
	}
	let hOx = 0;
	let hOy = 10;
	let hOz = 10;
	let hDx = 0;
	let hDy = -.7;
	let hDz = -.7;
	let hLen = 0;
	/** 0 on the camera -> traveller line, 1 from 0.42 units off it (and behind him). */
	function clearK(x, y, z) {
		if (hLen <= 0) return 1;
		const rx = x - hOx;
		const ry = y - hOy;
		const rz = z - hOz;
		const t = rx * hDx + ry * hDy + rz * hDz;
		if (t < 0 || t > hLen + .1) return 1;
		const px = rx - hDx * t;
		const py = ry - hDy * t;
		const pz = rz - hDz * t;
		const d2 = px * px + py * py + pz * pz;
		if (d2 > .1764) return 1;
		return smooth(.24, .42, Math.sqrt(d2));
	}
	/** Near-camera fade (pieces close to the lens become big blurred discs). */
	function camK(x, y, z) {
		const rx = x - hOx;
		const ry = y - hOy;
		const rz = z - hOz;
		return smooth(2.2, 5, Math.sqrt(rx * rx + ry * ry + rz * rz));
	}
	const NL = 24;
	const lOn = new Uint8Array(NL);
	const lX = new Float32Array(NL);
	const lY = new Float32Array(NL);
	const lZ = new Float32Array(NL);
	const lCx = new Int32Array(NL);
	const lCz = new Int32Array(NL);
	const lSince = new Float64Array(NL);
	const lUsed = new Uint8Array(NL);
	const lK = new Uint8Array(NL);
	const lG = new Float32Array(NL);
	let lampGate = null;
	const lampCache = /* @__PURE__ */ new Map();
	const LAMP_RE = /(^|_)(lamp|stone_lantern)(_[a-z]|_xf)?$/;
	function lampOffsets(model) {
		if (lampCache.has(model)) return lampCache.get(model);
		const list = [];
		try {
			const proto = assets && assets.getTilePrototype && assets.getTilePrototype(model);
			if (proto) {
				proto.updateMatrixWorld(true);
				const inv = new Matrix4().copy(proto.matrixWorld).invert();
				const box = new Box3();
				const c = new Vector3();
				proto.traverse((n) => {
					if (!n.name || !LAMP_RE.test(n.name)) return;
					box.setFromObject(n);
					if (box.isEmpty()) return;
					box.applyMatrix4(inv);
					box.getCenter(c);
					for (const q of list) if (Math.abs(q[0] - c.x) + Math.abs(q[2] - c.z) < .15) return;
					list.push([
						c.x,
						Math.max(.22, box.max.y * .72),
						c.z
					]);
				});
			}
		} catch (err) {}
		const extra = CONFIG.lights.pools && CONFIG.lights.pools.offsets && CONFIG.lights.pools.offsets[model] || null;
		if (extra) for (const q of extra) list.push(q);
		lampCache.set(model, list);
		return list;
	}
	function dropLamps(cx, cz) {
		for (let e = 0; e < NL; e++) if (lOn[e] && lCx[e] === cx && lCz[e] === cz) lOn[e] = 0;
	}
	const offLampRise = bus.on("tile:rise", (ev) => {
		const cell = wfc.get(ev.x, ev.z);
		if (!cell) return;
		const offs = lampOffsets(cell.model);
		if (!offs.length) return;
		for (let e = 0; e < NL; e++) if (lOn[e] && lCx[e] === ev.x && lCz[e] === ev.z) return;
		const ry = -(cell.rot || 0) * HALF_PI$1;
		const c = Math.cos(ry);
		const s = Math.sin(ry);
		for (let k = 0; k < offs.length; k++) {
			let e = 0;
			while (e < NL && lOn[e]) e++;
			if (e >= NL) return;
			const u = offs[k][0];
			const v = offs[k][2];
			lOn[e] = 1;
			lCx[e] = ev.x;
			lCz[e] = ev.z;
			lSince[e] = state.time;
			lK[e] = k;
			lX[e] = ev.x * TILE_SIZE + u * c + v * s;
			lY[e] = offs[k][1];
			lZ[e] = ev.z * TILE_SIZE - u * s + v * c;
		}
	});
	const offLampFlat = bus.on("tile:flat", (ev) => dropLamps(ev.x, ev.z));
	const offLampGone = bus.on("tile:despawn", (ev) => dropLamps(ev.x, ev.z));
	const cPool = new Color();
	function pools() {
		const P = CONFIG.lights.pools || {};
		const U = paperUniforms.uPaperPool.value;
		const UC = paperUniforms.uPaperPoolCol.value;
		const k = P.enabled === false ? 0 : nightAmt * (P.strength ?? 1);
		if (k <= .004) {
			UC.w = 0;
			return;
		}
		cPool.set(P.color || "#ffc878");
		UC.set(cPool.r * k, cPool.g * k, cPool.b * k, P.radius ?? 1.5);
		lUsed.fill(0);
		for (let e = 0; e < NL; e++) lG[e] = lOn[e] && lampGate ? lampGate(lCx[e], lCz[e], lK[e]) : 1;
		for (let s = 0; s < U.length; s++) {
			let best = -1;
			let bd = 1e9;
			for (let e = 0; e < NL; e++) {
				if (!lOn[e] || lUsed[e] || lG[e] <= 0) continue;
				const d = (lX[e] - fx) * (lX[e] - fx) + (lZ[e] - fz) * (lZ[e] - fz);
				if (d < bd) {
					bd = d;
					best = e;
				}
			}
			if (best < 0) {
				U[s].w = 0;
				continue;
			}
			lUsed[best] = 1;
			U[s].set(lX[best], lY[best], lZ[best], smooth(.5, 1.6, time - lSince[best]) * (1 - smooth(9, 12, Math.sqrt(bd))) * lG[best]);
		}
	}
	function gate(k, dx, dz, rank, W, D) {
		let d = (dC[k] + dGx[k] * dx + dGz[k] * dz - rank * .88) / .12;
		if (d <= 0) return 0;
		if (d > 1) d = 1;
		const ax = Math.abs(dx) / (W * .5);
		const az = Math.abs(dz) / (D * .5);
		const e = ax > az ? ax : az;
		return d * d * (3 - 2 * d) * (e < .86 ? 1 : Math.max(0, (1 - e) / .14));
	}
	function fallers(k, cfg, start, count) {
		const W = L.box.w;
		const D = L.box.d;
		const H = L.box.h;
		for (let j = 0; j < count; j++) {
			const i = start + j;
			const r = i * 6;
			const fall = mix(cfg.fall, R[r]);
			const tFall = H / fall;
			const period = tFall + cfg.land;
			const ph = time / period + R[r + 1] * 7;
			const cyc = Math.floor(ph);
			const u = (ph - cyc) * period;
			let dx = hash3(i, cyc, 11) * W - fx;
			dx -= W * Math.round(dx / W);
			let dz = hash3(i, cyc, 23) * D - fz;
			dz -= D * Math.round(dz / D);
			const g = gate(k, dx, dz, (j + .5) / count, W, D);
			if (g <= 0) {
				hide(M, i);
				continue;
			}
			const size = mix(cfg.size, R[r + 2]) * g;
			const lt = landing(i, fx + dx, fz + dz);
			if (u < tFall) {
				const rem = tFall - u;
				const y = rem * fall;
				if (lt === 2 && y < ROOF_Y) {
					hide(M, i);
					continue;
				}
				const sw = Math.sin(time * (.8 + R[r + 3]) + R[r + 4] * TAU$2) * cfg.sway * (y < 1 ? y : 1);
				const px = fx + dx - windX * cfg.wind * rem - windZ * sw;
				const pz = fz + dz - windZ * cfg.wind * rem + windX * sw;
				const py = y + .03 + landH[i];
				const s = size * smooth(0, .6, u) * clearK(px, py, pz) * camK(px, py, pz) * (lt === 2 ? smooth(ROOF_Y, .8500000000000001, y) : 1);
				if (s <= 5e-4) {
					hide(M, i);
					continue;
				}
				put(M, i, px, py, pz, R[r + 4] * TAU$2 + time * cfg.tumble * (.5 + R[r + 5]), -HALF_PI$1 + .8 * Math.sin(time * cfg.tumble * .9 + R[r + 3] * TAU$2), sw * 1.4, s, s * 1.15);
			} else {
				if (lt !== 0) {
					hide(M, i);
					continue;
				}
				const s = size * (1 - smooth(.55, 1, (u - tFall) / cfg.land));
				put(M, i, fx + dx, .028 + R[r + 5] * .012 + landH[i], fz + dz, R[r + 4] * TAU$2, -HALF_PI$1 + (R[r + 3] - .5) * .3, 0, s, s * 1.15);
			}
		}
	}
	function rain() {
		const cfg = L.rain;
		const W = L.box.w;
		const D = L.box.d;
		const H = L.box.h;
		const count = C.rain;
		const slant = Math.atan2(cfg.wind, 7) * (Math.cos(camYaw) * windX - Math.sin(camYaw) * windZ);
		for (let j = 0; j < count; j++) {
			const i = S.rain + j;
			const r = i * 6;
			const fall = mix(cfg.fall, R[r]);
			const tFall = H / fall;
			const period = tFall + cfg.land;
			const ph = time / period + R[r + 1] * 7;
			const cyc = Math.floor(ph);
			const u = (ph - cyc) * period;
			let dx = hash3(i, cyc, 11) * W - fx;
			dx -= W * Math.round(dx / W);
			let dz = hash3(i, cyc, 23) * D - fz;
			dz -= D * Math.round(dz / D);
			const g = gate(K.rain, dx, dz, (j + .5) / count, W, D);
			if (g <= 0) {
				hide(M, i);
				continue;
			}
			const lt = landing(i, fx + dx, fz + dz);
			if (u < tFall) {
				const rem = tFall - u;
				const len = mix(cfg.size, R[r + 2]);
				if (lt === 2 && rem * fall < ROOF_Y) {
					hide(M, i);
					continue;
				}
				const px = fx + dx - windX * cfg.wind * rem;
				const py = rem * fall + len * .5 + landH[i];
				const pz = fz + dz - windZ * cfg.wind * rem;
				const wd = cfg.width * g * clearK(px, py, pz) * camK(px, py, pz);
				if (wd <= 3e-4) {
					hide(M, i);
					continue;
				}
				cellRect(rectArr, i * 4, CELLS.bar);
				put(M, i, px, py, pz, camYaw, -.35, -slant, wd, len);
			} else {
				if (lt === 2) {
					hide(M, i);
					continue;
				}
				const l = (u - tFall) / cfg.land;
				const s = cfg.splash * (.3 + .7 * l) * g * (l > .8 ? (1 - l) / .2 : 1);
				cellRect(rectArr, i * 4, CELLS.ring);
				put(M, i, fx + dx, .03 + landH[i], fz + dz, 0, -HALF_PI$1, 0, s, s);
			}
		}
	}
	function dust() {
		const cfg = L.dust;
		const W = L.box.w;
		const D = L.box.d;
		const count = C.dust;
		for (let j = 0; j < count; j++) {
			const i = S.dust + j;
			const r = i * 6;
			const sp = mix(cfg.speed, R[r]);
			let dx = R[r + 1] * W + windX * sp * time - fx;
			dx -= W * Math.round(dx / W);
			let dz = R[r + 2] * D + windZ * sp * time - fz;
			dz -= D * Math.round(dz / D);
			const g = gate(K.dust, dx, dz, (j + .5) / count, W, D);
			if (g <= 0) {
				hide(M, i);
				continue;
			}
			const py = mix(cfg.height, R[r + 3]) + .14 * Math.sin(time * .5 + R[r + 5] * TAU$2);
			const s = mix(cfg.size, R[r + 4]) * g * clearK(fx + dx, py, fz + dz) * camK(fx + dx, py, fz + dz);
			if (s <= 5e-4) {
				hide(M, i);
				continue;
			}
			put(M, i, fx + dx, py, fz + dz, camYaw + Math.sin(time * .7 + R[r + 5] * TAU$2), -camElev, time * .4 + R[r] * TAU$2, s, s);
		}
	}
	function gusts() {
		const cfg = L.gusts;
		const W = L.box.w;
		const D = L.box.d;
		const count = C.gusts;
		const yaw = Math.atan2(-windZ, windX);
		for (let j = 0; j < count; j++) {
			const i = S.gusts + j;
			const r = i * 6;
			let env = Math.sin(time * TAU$2 / cfg.period + R[r + 2] * 1.4);
			env = env > 0 ? env * env * env : 0;
			let dx = R[r + 1] * W + windX * cfg.speed * time - fx;
			dx -= W * Math.round(dx / W);
			let dz = R[r + 4] * D + windZ * cfg.speed * time * .6 - fz;
			dz -= D * Math.round(dz / D);
			const g = gate(K.gusts, dx, dz, (j + .5) / count, W, D) * env;
			if (g <= .02) {
				hide(M, i);
				continue;
			}
			put(M, i, fx + dx, mix(cfg.height, R[r + 3]), fz + dz, yaw, -HALF_PI$1 + .25, 0, mix(cfg.length, R[r]) * g, cfg.width);
		}
	}
	/** Two wing instances hinged on the body axis. flap = wing angle above the horizontal. */
	function wings(i, x, y, z, heading, flap, span, chord) {
		const sh = Math.sin(heading);
		const ch = Math.cos(heading);
		const ca = Math.cos(flap);
		const sa = Math.sin(flap);
		let Xx = ch * ca;
		let Xz = -sh * ca;
		putBasis(M, i, x + Xx * span * .42, y + sa * span * .42, z + Xz * span * .42, Xx, sa, Xz, sh, 0, ch, span, chord);
		Xx = -Xx;
		Xz = -Xz;
		putBasis(M, i + 1, x + Xx * span * .42, y + sa * span * .42, z + Xz * span * .42, Xx, sa, Xz, -sh, 0, -ch, span, chord);
	}
	function butterflies() {
		const cfg = L.butterflies;
		const W = L.box.w;
		const D = L.box.d;
		const count = C.butterflies;
		for (let j = 0; j < count; j++) {
			const i = S.butterflies + j * 2;
			const r = i * 6;
			let dx = R[r] * W - fx;
			dx -= W * Math.round(dx / W);
			let dz = R[r + 1] * D - fz;
			dz -= D * Math.round(dz / D);
			let g = gate(K.butterflies, dx * .8, dz * .8, (j + .5) / count, W, D);
			const fl = cfg.flowers > 0 && dC[K.butterflies] > .02 ? spotFlag(i, fx + dx, fz + dz, 1) : 0;
			if (fl) {
				const ax = Math.abs(dx) / (W * .5);
				const az = Math.abs(dz) / (D * .5);
				const e = ax > az ? ax : az;
				g = Math.max(g, cfg.flowers * smooth(.02, .2, dC[K.butterflies]) * (e < .86 ? 1 : Math.max(0, (1 - e) / .14)));
			}
			if (g <= 0) {
				hide(M, i);
				hide(M, i + 1);
				continue;
			}
			const a = time * .45 + R[r + 2] * TAU$2;
			const b = time * .31 + R[r + 3] * TAU$2;
			const rm = fl ? cfg.roam * .6 : cfg.roam;
			const ox = rm * (Math.sin(a) + .4 * Math.sin(2.3 * b));
			const oz = rm * (Math.cos(1.2 * b) + .4 * Math.sin(1.7 * a));
			const vx = .45 * Math.cos(a) + .285 * Math.cos(2.3 * b);
			const vz = -.372 * Math.sin(1.2 * b) + .306 * Math.cos(1.7 * a);
			const y = mix(cfg.height, .5 + .5 * Math.sin(time * .8 + R[r + 4] * TAU$2)) + .04 * Math.sin(time * cfg.flap);
			const ck = g * clearK(fx + dx + ox, y, fz + dz + oz);
			if (ck <= .01) {
				hide(M, i);
				hide(M, i + 1);
				continue;
			}
			wings(i, fx + dx + ox, y, fz + dz + oz, Math.atan2(vx, vz), .1 + 1.05 * Math.abs(Math.sin(time * cfg.flap + R[r + 5] * TAU$2)), cfg.size * ck, cfg.size * 1.25 * ck);
		}
	}
	function birds() {
		const cfg = L.birds;
		const dens = dC[K.birds];
		const sprites = birdSprites;
		for (let f = 0; f < NF; f++) {
			const period = cfg.period * (1 + .23 * f);
			const ph = time / period + .37 * f + .12;
			const cyc = Math.floor(ph);
			const u = (ph - cyc) * period;
			const active = u < cfg.cross && dens > (f + .4) / NF * .9;
			if (active && (fCyc[f] !== cyc || Math.abs(fCx[f] - fx) + Math.abs(fCz[f] - fz) > 30)) {
				const h = cfg.height + .35 * f;
				fCyc[f] = cyc;
				fCx[f] = fx + camHX * h;
				fCz[f] = fz + camHZ * h;
			}
			const ang = hash3(f, cyc, 5) * TAU$2;
			const dirx = Math.cos(ang);
			const dirz = Math.sin(ang);
			const s = u / cfg.cross;
			const along = (s - .5) * cfg.span;
			const lat = (hash3(f, cyc, 7) - .5) * 5 + Math.sin(s * 5 + f) * .8;
			const bx = fCx[f] + dirx * along - dirz * lat;
			const bz = fCz[f] + dirz * along + dirx * lat;
			const nBirds = 3 + Math.floor(hash3(f, cyc, 9) * (FS - 2));
			const heading = Math.atan2(dirx, dirz);
			for (let j = 0; j < FS; j++) {
				const i = S.birds + (f * FS + j) * 2;
				const si = T.birdShadows + f * FS + j;
				if (!active || j >= nBirds) {
					hide(M, i);
					hide(M, i + 1);
					softHide(si);
					continue;
				}
				const row = j + 1 >> 1;
				const side = j % 2 ? 1 : -1;
				const px = bx - dirx * row * .55 - dirz * side * row * .45;
				const pz = bz - dirz * row * .55 + dirx * side * row * .45;
				const py = cfg.height + .35 * f + .12 * Math.sin(time * 1.3 + j * 1.7);
				const beat = Math.sin(time * cfg.flap + j * .9 + f);
				if (sprites) {
					const sp = sprites[(f + j) % sprites.length];
					const o = i * 4;
					rectArr[o] = sp[0];
					rectArr[o + 1] = sp[1];
					rectArr[o + 2] = sp[2];
					rectArr[o + 3] = sp[3];
					texArr[i] = 1;
					put(M, i, px, py, pz, heading + Math.PI, -HALF_PI$1 + .35, beat * .12, cfg.wing * 2 * sp[4] * (.9 + .1 * beat), cfg.wing * 2);
					hide(M, i + 1);
				} else {
					const sp = cfg.wing * 2;
					const sh = Math.sin(heading);
					const ch = Math.cos(heading);
					putBasis(M, i, px, py, pz, -ch, 0, sh, sh, 0, ch, sp * (.92 - .1 * beat), sp, sp * (1.1 + 2.3 * beat));
					hide(M, i + 1);
				}
				const sa = cfg.shadow * (1 - nightAmt);
				if (sa > .003) softPut(si, px - lightX * py, .03, pz - lightZ * py, 0, -HALF_PI$1, .6, .46, cCloud.r, cCloud.g, cCloud.b, sa, 1, 1, 1);
				else softHide(si);
			}
		}
		if (sprites) texAttr.needsUpdate = true;
	}
	function smoke() {
		const cfg = L.smoke;
		const P = C.smokePuffs;
		for (let e = 0; e < NE; e++) {
			const on = eOn[e] ? smooth(.7, 1.7, time - eSince[e]) * (1 + ((cfg.night ?? 1) - 1) * nightAmt) : 0;
			for (let p = 0; p < P; p++) {
				const i = S.smoke + e * P + p;
				if (on <= 0) {
					hide(M, i);
					continue;
				}
				const ph = time / cfg.life + p / P + e * .37;
				const u = ph - Math.floor(ph);
				const s = mix(cfg.size, u) * smooth(0, .14, u) * (1 - smooth(.68, 1, u)) * on;
				const d = cfg.drift * u * u;
				const r = i * 6;
				const px = eX[e] + windX * d + (cfg.wobble ?? .05) * Math.sin(time * .9 + p * 2.1 + e) * u;
				const py = eY[e] + u * cfg.rise;
				const pz = eZ[e] + windZ * d;
				const sk = s * clearK(px, py, pz) * camK(px, py, pz);
				if (sk <= .002) {
					hide(M, i);
					continue;
				}
				put(M, i, px, py, pz, camYaw, -camElev * .7, R[r] * TAU$2 + u * (cfg.spin ?? 1.6) * (R[r + 1] < .5 ? -1 : 1), sk, sk);
			}
		}
	}
	function mist() {
		const cfg = L.mist;
		const W = L.box.w + 4;
		const D = L.box.d;
		const count = C.mist;
		for (let j = 0; j < count; j++) {
			const i = T.mist + j;
			const q = i * 6;
			let dx = Q[q] * W + windX * cfg.drift * (.6 + Q[q + 2]) * time - fx;
			dx -= W * Math.round(dx / W);
			let dz = Q[q + 1] * D - fz;
			dz -= D * Math.round(dz / D);
			const g = gate(K.mist, dx, dz, (j + .5) / count, W, D);
			if (g <= 0) {
				softHide(i);
				continue;
			}
			softPut(i, fx + dx, cfg.y + .06 * Math.sin(time * .3 + Q[q + 3] * TAU$2), fz + dz, camYaw, -.3, mix(cfg.size, Q[q + 3]), cfg.height * (.8 + .4 * Q[q + 4]), cMist.r, cMist.g, cMist.b, cfg.alpha * g, 1, 0, 1);
		}
	}
	function clouds() {
		const cfg = L.clouds;
		const W = cfg.span;
		const count = C.clouds;
		for (let j = 0; j < count; j++) {
			const i = T.clouds + j;
			const q = i * 6;
			let dx = Q[q] * W + windX * cfg.speed * time - fx;
			dx -= W * Math.round(dx / W);
			let dz = Q[q + 1] * W + windZ * cfg.speed * time - fz;
			dz -= W * Math.round(dz / W);
			const g = gate(K.clouds, 0, 0, (j + .5) / count, 1, 1) * (1 - smooth(.8, 1, Math.max(Math.abs(dx), Math.abs(dz)) / (W * .5)));
			if (g <= 0) {
				softHide(i);
				continue;
			}
			const s = mix(cfg.size, Q[q + 2]);
			softPut(i, fx + dx, .02, fz + dz, Q[q + 3] * TAU$2, -HALF_PI$1, s, s * (.62 + .25 * Q[q + 4]), cCloud.r, cCloud.g, cCloud.b, cfg.alpha * g, 1, 1, 1);
		}
	}
	function fireflies() {
		const cfg = L.fireflies;
		const W = L.box.w;
		const D = L.box.d;
		const count = C.fireflies;
		for (let j = 0; j < count; j++) {
			const i = T.fireflies + j;
			const q = i * 6;
			let dx = Q[q] * W - fx;
			dx -= W * Math.round(dx / W);
			let dz = Q[q + 1] * D - fz;
			dz -= D * Math.round(dz / D);
			let g = gate(K.fireflies, dx, dz, (j + .5) / count, W, D);
			let wx = 0;
			let wz = 0;
			if (cfg.water > 0 && dC[K.fireflies] > .02 && spotFlag(NBITS + j, fx + dx, fz + dz, 0)) {
				wx = spotX[NBITS + j];
				wz = spotZ[NBITS + j];
				const ax = Math.abs(dx) / (W * .5);
				const az = Math.abs(dz) / (D * .5);
				const e = ax > az ? ax : az;
				g = Math.max(g, cfg.water * smooth(.02, .2, dC[K.fireflies]) * (e < .86 ? 1 : Math.max(0, (1 - e) / .14)));
			}
			if (g <= 0) {
				softHide(i);
				continue;
			}
			dx += wx;
			dz += wz;
			const a = time * .33 + Q[q + 2] * TAU$2;
			const b = time * .21 + Q[q + 3] * TAU$2;
			let pulse = Math.sin(time * (.9 + Q[q + 4] * .9) + Q[q + 5] * TAU$2);
			pulse = pulse > 0 ? pulse * pulse : 0;
			const glow = cfg.glow * g * (.12 + .88 * pulse);
			const s = cfg.size * (.75 + .5 * Q[q + 4]);
			softPut(i, fx + dx + cfg.roam * (Math.sin(a) + .5 * Math.sin(2.1 * b)), mix(cfg.height, .5 + .5 * Math.sin(time * .4 + Q[q + 2] * TAU$2)), fz + dz + cfg.roam * (Math.cos(1.3 * b) + .5 * Math.sin(1.6 * a)), camYaw, -camElev, s, s, cFly.r * glow, cFly.g * glow, cFly.b * glow, 1, 0, 0, 0);
		}
	}
	function sharpen(w) {
		let s = 0;
		for (let b = 0; b < NB; b++) {
			w[b] = smooth(.2, .8, w[b]);
			s += w[b];
		}
		if (s > 0) for (let b = 0; b < NB; b++) w[b] /= s;
		else w[0] = 1;
	}
	function densities() {
		const ts = 1 / TILE_SIZE;
		if (forced >= 0) for (let b = 0; b < NB; b++) {
			wC[b] = b === forced ? 1 : 0;
			wE[b] = wW[b] = wN[b] = wS[b] = wC[b];
		}
		else {
			biomeWeights(seed, fx * ts, fz * ts, wC);
			biomeWeights(seed, (fx + GRAD) * ts, fz * ts, wE);
			biomeWeights(seed, (fx - GRAD) * ts, fz * ts, wW);
			biomeWeights(seed, fx * ts, (fz + GRAD) * ts, wS);
			biomeWeights(seed, fx * ts, (fz - GRAD) * ts, wN);
		}
		sharpen(wC);
		sharpen(wE);
		sharpen(wW);
		sharpen(wN);
		sharpen(wS);
		const N = L.night;
		for (let k = 0; k < NK; k++) {
			const name = KINDS[k];
			let c = 0;
			let gx = 0;
			let gz = 0;
			for (let b = 0; b < NB; b++) {
				const row = L.biomes[BIOMES[b]];
				const v = row && row[name] || 0;
				c += wC[b] * v;
				gx += (wE[b] - wW[b]) * v;
				gz += (wS[b] - wN[b]) * v;
			}
			const nf = name === "fireflies" ? nightAmt * (N.fireflies ?? 1) : 1 + ((N[name] ?? 1) - 1) * nightAmt;
			const q = name === "clouds" || name === "birds" || name === "butterflies" ? 1 : qScale;
			dC[k] = c * nf * q;
			dGx[k] = gx * nf * q / 10;
			dGz[k] = gz * nf * q / 10;
		}
		const dry = 1 - (L.fireflies.rainCut ?? .4) * Math.min(1, Math.max(0, dC[K.rain]) * 1.5);
		dC[K.fireflies] *= dry;
		dGx[K.fireflies] *= dry;
		dGz[K.fireflies] *= dry;
	}
	function update(dt, focus, cam = camera) {
		if (!enabled) return;
		time = state.time;
		fx = focus.x;
		fz = focus.z;
		const target = daynight && daynight.night ? 1 : 0;
		if (dt <= 0) nightAmt = target;
		else if (nightAmt !== target) nightAmt = target > nightAmt ? Math.min(1, nightAmt + dt / 1.6) : Math.max(0, nightAmt - dt / 1.6);
		if (cam) {
			const cx = cam.position.x - fx;
			const cz = cam.position.z - fz;
			camYaw = Math.atan2(cx, cz);
			camElev = Math.atan2(cam.position.y, Math.sqrt(cx * cx + cz * cz) || 1);
			if (cam.position.y > .5) {
				camHX = cx / cam.position.y;
				camHZ = cz / cam.position.y;
			}
		}
		hLen = 0;
		if (cam) {
			hOx = cam.position.x;
			hOy = cam.position.y;
			hOz = cam.position.z;
			const ax = fx - hOx;
			const ay = (focus.y || 0) + .3 - hOy;
			const az = fz - hOz;
			hLen = Math.sqrt(ax * ax + ay * ay + az * az);
			if (hLen > .001) {
				hDx = ax / hLen;
				hDy = ay / hLen;
				hDz = az / hLen;
			}
		}
		const wl = Math.sqrt(L.wind[0] * L.wind[0] + L.wind[1] * L.wind[1]) || 1;
		windX = L.wind[0] / wl;
		windZ = L.wind[1] / wl;
		if (!keyLight && !keySearched) {
			keySearched = true;
			scene.traverse(findKey);
		}
		if (keyLight) {
			const lx = keyLight.position.x - keyLight.target.position.x;
			const ly = keyLight.position.y - keyLight.target.position.y;
			const lz = keyLight.position.z - keyLight.target.position.z;
			if (ly > .01) {
				lightX = lx / ly;
				lightZ = lz / ly;
			}
		}
		cMist.copy(cMistD).lerp(cMistN, nightAmt);
		liftUniform.value = .09 * nightAmt;
		cCloud.set(L.clouds.color);
		cFly.set(L.fireflies.color);
		densities();
		fallers(K.leaves, L.leaves, S.leaves, C.leaves);
		fallers(K.snow, L.snow, S.snow, C.snow);
		fallers(K.petals, L.petals, S.petals, C.petals);
		rain();
		dust();
		gusts();
		butterflies();
		birds();
		smoke();
		mist();
		clouds();
		fireflies();
		pools();
		bits.instanceMatrix.needsUpdate = true;
		rectAttr.needsUpdate = true;
		soft.instanceMatrix.needsUpdate = true;
		colAttr.needsUpdate = true;
		parAttr.needsUpdate = true;
	}
	return {
		group,
		bits,
		soft,
		update,
		/** Chimneys of every risen house smoke at once (called after world.settle()). */
		settle() {
			for (let e = 0; e < NE; e++) if (eOn[e]) eSince[e] = -1e9;
		},
		/** Debug: pin the weather to one biome ('snow', 'desert', ...); null / undefined = follow the world again. */
		forceBiome(id) {
			forced = id == null ? -1 : BIOME_INDEX[id] ?? -1;
			return forced >= 0 ? BIOMES[forced] : null;
		},
		setEnabled(v) {
			enabled = !!v;
			group.visible = enabled;
		},
		get enabled() {
			return enabled;
		},
		get night() {
			return nightAmt;
		},
		/** Current densities per kind at the traveller (after day / night), for debugging. */
		densities() {
			const o = {};
			for (let k = 0; k < NK; k++) o[KINDS[k]] = +dC[k].toFixed(3);
			return o;
		},
		/** game-hook(lanterns): tile-local lamp anchors of a model [[x, y, z]], and a per-lamp gate fn(cx, cz, lampIndex) -> 0..1 for the night pools. */
		lampOffsets,
		setLampGate(fn) {
			lampGate = fn || null;
		},
		/** Debug: lamp-post pool anchors currently alive [{x, y, z}]. */
		lamps() {
			const a = [];
			for (let e = 0; e < NL; e++) if (lOn[e]) a.push({
				x: +lX[e].toFixed(2),
				y: +lY[e].toFixed(2),
				z: +lZ[e].toFixed(2)
			});
			return a;
		},
		stats() {
			let em = 0;
			for (let e = 0; e < NE; e++) em += eOn[e];
			let lw = 0;
			let lb = 0;
			let lm = 0;
			for (let i = 0; i < NBITS; i++) {
				if (landT[i] === 1) lw++;
				else if (landT[i] === 2) lb++;
				if (landH[i] > .02) lm++;
			}
			const land = {
				water: lw,
				blocked: lb,
				raised: lm,
				world: !!world
			};
			return {
				bits: NBITS,
				soft: NSOFT,
				drawCalls: 2,
				triangles: NBITS * 4 + NSOFT * 2,
				chimneys: em,
				birdSprites: birdSprites ? birdSprites.length : 0,
				land
			};
		},
		dispose() {
			offRise();
			offFlat();
			offDespawn();
			offLampRise();
			offLampFlat();
			offLampGone();
			paperUniforms.uPaperPoolCol.value.w = 0;
			scene.remove(group);
			bitsGeo.dispose();
			bitsMat.dispose();
			shapeTex.dispose();
			softGeo.dispose();
			softMat.dispose();
		}
	};
}
// src/life/animals.js
var PI = Math.PI;
var ST_IDLE = 0;
var ST_WALK = 1;
var ST_FOLLOW = 2;
var ST_RETURN = 3;
var ST_FREEZE = 4;
var ST_FLEE = 5;
var ST_FLY = 6;
var ST_FLOAT = 7;
var ST_PERCH = 8;
var ST_SLIDE = 9;
var ST_NAMES = [
	"idle",
	"walk",
	"follow",
	"return",
	"freeze",
	"flee",
	"fly",
	"float",
	"perch",
	"slide"
];
var VIG = {
	on: 1,
	top: 2,
	at: 3,
	behind: 4,
	door: 5,
	in: 6
};
var VIG_NAMES = [
	"",
	"on",
	"top",
	"at",
	"behind",
	"door",
	"in"
];
var HOUSE_FRONT_RX = /^((?:house|cottage|cabin|manor|nave)(?:_[a-z])?)_front(?:_1)?$/;
var TRUNK_RX = /^(tree|pine|birch|pear|palm|dead_tree)/;
var MODE_GROUND = 0;
var MODE_FLOAT = 1;
var MODE_PERCH = 2;
var MODE_BANK = 3;
var FLEE_OFFS = [
	0,
	.5,
	-.5,
	1,
	-1,
	1.6,
	-1.6,
	2.3,
	-2.3
];
var EMPTY = [];
var cellKey$1 = (cx, cz) => (cx + 32768) * 65536 + (cz + 32768);
var _box$1 = new Box3();
var _m$1 = new Matrix4();
var _l$1 = new Matrix4();
function createAnimals({ scene, renderer, world, traveller, daynight, assets, seed = 0 }) {
	const C = CONFIG.animals;
	const N = Math.max(4, Math.min(64, C.max | 0));
	const HA = ((seed | 0) ^ 4302787) >>> 0;
	const HB = ((seed | 0) ^ 2654435761) >>> 0;
	const geo = new BufferGeometry();
	geo.setAttribute("position", new Float32BufferAttribute([
		0,
		0,
		0,
		1,
		0,
		0,
		1,
		1,
		0,
		0,
		1,
		0
	], 3));
	geo.setAttribute("normal", new Float32BufferAttribute([
		0,
		0,
		1,
		0,
		0,
		1,
		0,
		0,
		1,
		0,
		0,
		1
	], 3));
	geo.setAttribute("uv", new Float32BufferAttribute([
		0,
		0,
		1,
		0,
		1,
		1,
		0,
		1
	], 2));
	geo.setIndex([
		0,
		1,
		2,
		0,
		2,
		3
	]);
	const rectArr = new Float32Array(N * 4);
	const rectAttr = new InstancedBufferAttribute(rectArr, 4);
	rectAttr.setUsage(DynamicDrawUsage);
	geo.setAttribute("aRect", rectAttr);
	const cardN = { value: new Vector2(C.normal[0], C.normal[1]) };
	const mat = new MeshLambertMaterial({
		side: 2,
		alphaTest: C.alphaTest
	});
	mat.onBeforeCompile = (shader) => {
		shader.uniforms.uCardN = cardN;
		shader.vertexShader = shader.vertexShader.replace("#include <common>", "#include <common>\nattribute vec4 aRect;\nuniform vec2 uCardN;").replace("#include <uv_vertex>", "#include <uv_vertex>\n	vMapUv = aRect.xy + uv * aRect.zw;").replace("#include <defaultnormal_vertex>", "#include <defaultnormal_vertex>\n	transformedNormal = normalize( ( viewMatrix * vec4( 0.0, uCardN.x, uCardN.y, 0.0 ) ).xyz );");
	};
	mat.customProgramCacheKey = () => "life-animals";
	const depthMat = new MeshDepthMaterial({ alphaTest: C.alphaTest });
	depthMat.onBeforeCompile = (shader) => {
		shader.vertexShader = shader.vertexShader.replace("#include <common>", "#include <common>\nattribute vec4 aRect;").replace("#include <uv_vertex>", "#include <uv_vertex>\n	vMapUv = aRect.xy + uv * aRect.zw;");
	};
	depthMat.customProgramCacheKey = () => "life-animals-depth";
	const mesh = new InstancedMesh(geo, mat, N);
	mesh.name = "life_animals";
	mesh.instanceMatrix.setUsage(DynamicDrawUsage);
	mesh.frustumCulled = false;
	mesh.castShadow = C.shadows !== false;
	mesh.receiveShadow = true;
	mesh.customDepthMaterial = depthMat;
	mesh.visible = false;
	const M = mesh.instanceMatrix.array;
	M.fill(0);
	for (let i = 0; i < N; i++) {
		M[i * 16 + 10] = 1;
		M[i * 16 + 15] = 1;
	}
	scene.add(mesh);
	let tex = null;
	let loaded = false;
	let disposed = false;
	const SETS = {};
	const SPEC = {};
	let artNames = [];
	function buildPoses(json) {
		const W = json.size[0];
		const H = json.size[1];
		const art = {};
		for (const name of Object.keys(json.animals)) {
			const a = json.animals[name];
			const o = art[name] = {};
			for (const pn of Object.keys(a.poses)) {
				const r = a.poses[pn];
				const e = .5;
				o[pn] = {
					name: pn,
					u0: (r.x + e) / W,
					v0: 1 - (r.y + r.h) / H,
					du: (r.w - 2 * e) / W,
					dv: (r.h - e) / H,
					w: r.w / a.unit,
					h: r.h / a.unit,
					a: (r.ax !== void 0 ? r.ax : r.w / 2) / r.w,
					air: !!r.air
				};
			}
		}
		artNames = Object.keys(art);
		for (const id of Object.keys(C.species)) {
			const sp = C.species[id];
			const coats = sp.coats || [sp.art || id];
			const sets = [];
			for (const cn of coats) {
				const P = art[cn];
				if (!P) continue;
				const first = P[Object.keys(P)[0]];
				const get = (n, fb) => n && P[n] || fb;
				const stand = get("stand", get("sit", get("perched", first)));
				const walk = [get(sp.walk && sp.walk[0], stand), get(sp.walk && sp.walk[1], stand)];
				const idle = [];
				for (const n of sp.idle || []) if (P[n]) idle.push(P[n]);
				if (!idle.length) idle.push(stand);
				sets.push({
					art: cn,
					stand,
					walk,
					idle,
					air: get(sp.air, null),
					sit: get(sp.sit, stand),
					sleep: get(sp.sleep, null),
					float: get(sp.float, null),
					stretch: get("stretch", null),
					alert: get("tail_up", null)
				});
			}
			if (sets.length) {
				SETS[id] = sets;
				SPEC[id] = sp;
			}
		}
	}
	const ready = (async () => {
		try {
			const res = await fetch("./textures/art/animals.json");
			if (!res.ok) return false;
			const json = await res.json();
			const t = await new TextureLoader().loadAsync("./textures/art/" + (json.image || "animals.png"));
			if (disposed) {
				t.dispose();
				return false;
			}
			t.colorSpace = SRGBColorSpace;
			t.magFilter = LinearFilter;
			t.minFilter = LinearMipmapLinearFilter;
			t.generateMipmaps = true;
			t.anisotropy = Math.min(4, renderer && renderer.capabilities.getMaxAnisotropy && renderer.capabilities.getMaxAnisotropy() || 1);
			tex = t;
			mat.map = t;
			mat.needsUpdate = true;
			depthMat.map = t;
			depthMat.needsUpdate = true;
			buildPoses(json);
			if (renderer && renderer.initTexture) renderer.initTexture(t);
			loaded = true;
			mesh.visible = true;
			dirty = true;
			return true;
		} catch (err) {
			console.warn("[animals] no sprite sheet:", err && err.message ? err.message : err);
			return false;
		}
	})();
	/** Fold progress of the tile under (x, z) when it stands or is rising, else -1. */
	function riseAt(x, z) {
		const r = world.tileRecord(Math.round(x / TILE_SIZE), Math.round(z / TILE_SIZE));
		if (r === null || !r.shown || r.fold.target !== 1) return -1;
		const pr = r.fold.progress;
		return pr === void 0 ? 1 : pr;
	}
	const isWater = (x, z) => world.surfaceAt(x, z) === "water";
	function okGround(x, z) {
		return world.clearance(x, z) > C.minClear && riseAt(x, z) >= 0;
	}
	function okWater(x, z) {
		return isWater(x, z) && riseAt(x, z) >= 0;
	}
	const okAt = (sl, x, z) => sl.mode === MODE_FLOAT ? okWater(x, z) : sl.st === ST_FOLLOW ? world.clearance(x, z) > .012 : okGround(x, z);
	const perchCache = /* @__PURE__ */ new Map();
	function perchesFor(model) {
		let out = perchCache.get(model);
		if (out !== void 0) return out;
		out = [];
		try {
			const proto = assets && assets.getTilePrototype ? assets.getTilePrototype(model) : null;
			const re = new RegExp(C.perch.names, "i");
			if (proto) proto.traverse((o) => {
				if (!o.isMesh || !o.geometry || !re.test(o.name || "")) return;
				const pos = o.geometry.getAttribute("position");
				if (!pos) return;
				_m$1.identity();
				for (let a = o; a && a !== proto; a = a.parent) {
					_l$1.compose(a.position, a.quaternion, a.scale);
					_m$1.premultiply(_l$1);
				}
				_box$1.setFromBufferAttribute(pos).applyMatrix4(_m$1);
				if (_box$1.max.y < C.perch.top[0] || _box$1.max.y > C.perch.top[1]) return;
				out.push((_box$1.min.x + _box$1.max.x) / 2, _box$1.max.y, _box$1.max.z, o.name);
			});
		} catch {
			out = [];
		}
		perchCache.set(model, out);
		return out;
	}
	const pieceCache = /* @__PURE__ */ new Map();
	function piecesFor(model, parity) {
		const key = parity ? model + "/1" : model;
		let out = pieceCache.get(key);
		if (out !== void 0) return out;
		out = [];
		try {
			const proto = assets && assets.getTilePrototype ? assets.getTilePrototype(model) : null;
			if (proto) {
				const list = [];
				proto.traverse((o) => {
					if (o.isMesh && o.geometry && !/^base/i.test(o.name || "") && o.geometry.getAttribute("position")) list.push(o);
				});
				const sp = world.standSpecs ? world.standSpecs(model, proto, list) : null;
				list.forEach((o, li) => {
					if (sp && sp.thin[li] === 1) return;
					_m$1.identity();
					for (let a = o; a && a !== proto; a = a.parent) {
						_l$1.compose(a.position, a.quaternion, a.scale);
						_m$1.premultiply(_l$1);
					}
					if (sp && world.standFix) world.standFix(sp, li, parity, _m$1);
					_box$1.setFromBufferAttribute(o.geometry.getAttribute("position"));
					const e = _m$1.elements;
					const sx = _box$1.max.x - _box$1.min.x;
					const sy = _box$1.max.y - _box$1.min.y;
					const sz = _box$1.max.z - _box$1.min.z;
					const mx = (_box$1.min.x + _box$1.max.x) / 2;
					const my = (_box$1.min.y + _box$1.max.y) / 2;
					const mz = (_box$1.min.z + _box$1.max.z) / 2;
					const px = e[0] * mx + e[4] * my + e[8] * mz + e[12];
					const pz = e[2] * mx + e[6] * my + e[10] * mz + e[14];
					const hx = [
						e[0] * sx,
						e[4] * sy,
						e[8] * sz
					];
					const hz = [
						e[2] * sx,
						e[6] * sy,
						e[10] * sz
					];
					let j = 0;
					for (let i = 1; i < 3; i++) if (hx[i] * hx[i] + hz[i] * hz[i] > hx[j] * hx[j] + hz[j] * hz[j]) j = i;
					_box$1.applyMatrix4(_m$1);
					if (_box$1.max.y < .1) return;
					out.push({
						name: String(o.name || "").replace(/^.*__/, ""),
						x: px,
						z: pz,
						hx: hx[j] / 2,
						hz: hz[j] / 2,
						top: _box$1.max.y
					});
				});
			}
		} catch {
			out = [];
		}
		pieceCache.set(key, out);
		return out;
	}
	const rxCache = /* @__PURE__ */ new Map();
	function rxFor(src) {
		let r = rxCache.get(src);
		if (r === void 0) {
			r = new RegExp("^(?:" + src + ")");
			rxCache.set(src, r);
		}
		return r;
	}
	const _anc = {
		x: 0,
		y: 0,
		z: 0,
		face: 0,
		spread: 0
	};
	const _cand = [];
	const spotOk = (x, z, room) => world.clearance(x, z) >= room && world.surfaceAt(x, z) !== "water" && world.surfaceAt(x, z) !== "bridge";
	function taken(list, x, z, r, y = 0) {
		const zy = z - 1.1 * y;
		for (let k = 0; k < list.length; k++) {
			const q = list[k];
			const dx = q.x - x;
			const zq = q.z - 1.1 * (q.y || 0);
			let dz = q.z - z;
			if (dx * dx + dz * dz < r * r) return true;
			dz = zq - zy;
			if (dx * dx + dz * dz < r * r) return true;
		}
		return false;
	}
	/**
	* The spot of a vignette on cell (cx, cz): _anc = world x / y / z (+ face, or spread for 'in'); false when the tile has
	* no such piece or no room there (the caller falls back to the plain rule). Pure function of the cell.
	*/
	function resolveAnchor(vig, re, cell, cx, cz, rot, biome, h1, h2, list) {
		const pieces = piecesFor(cell.model, rot & 1);
		if (!pieces.length) return false;
		const bare = biome === "desert" || biome === "snow";
		const ox = cx * TILE_SIZE;
		const oz = cz * TILE_SIZE;
		const c4 = rot === 0 ? 1 : rot === 2 ? -1 : 0;
		const s4 = rot === 1 ? 1 : rot === 3 ? -1 : 0;
		if (vig === VIG.door) {
			_cand.length = 0;
			for (const pc of pieces) if (HOUSE_FRONT_RX.test(pc.name)) _cand.push(pc);
			for (let k = 0; k < _cand.length; k++) {
				const f = _cand[(Math.floor(h1 * _cand.length) + k) % _cand.length];
				const base = HOUSE_FRONT_RX.exec(f.name)[1];
				let b = null;
				for (const pc of pieces) if (pc.name === base + "_back" || pc.name === base + "_back_1") {
					b = pc;
					break;
				}
				if (b === null) continue;
				let nu = f.x - b.x;
				let nv = f.z - b.z;
				const nl = Math.hypot(nu, nv) || 1;
				nu /= nl;
				nv /= nl;
				const half = Math.hypot(f.hx, f.hz) || .1;
				const side = h2 < .5 ? -1 : 1;
				const along = side * Math.min(.17, half * .6);
				if (nu * s4 + nv * c4 > -.3) for (let d = .1; d < .34; d += .04) {
					const u = f.x + nu * d + f.hx / half * along;
					const v = f.z + nv * d + f.hz / half * along;
					const x = ox + u * c4 - v * s4;
					const z = oz + u * s4 + v * c4;
					if (!spotOk(x, z, .04) || taken(list, x, z, .2)) continue;
					_anc.x = x;
					_anc.z = z;
					_anc.y = 0;
					_anc.face = side;
					return true;
				}
				const mu = (f.x + b.x) / 2;
				const mv = (f.z + b.z) / 2;
				const hxw = ox + mu * c4 - mv * s4 + side * .12;
				const hzw = oz + mu * s4 + mv * c4;
				let wasIn = false;
				for (let d = .05; d < .9; d += .04) {
					if (!spotOk(hxw, hzw + d, .04)) {
						wasIn = true;
						continue;
					}
					if (!wasIn || taken(list, hxw, hzw + d, .2)) continue;
					_anc.x = hxw;
					_anc.z = hzw + d + .02;
					_anc.y = 0;
					_anc.face = side;
					return true;
				}
			}
			return false;
		}
		_cand.length = 0;
		const lo = vig === VIG.top ? .6 : vig === VIG.on ? .13 : .1;
		const hi = vig === VIG.top ? 2.4 : vig === VIG.on ? .75 : 9;
		for (const pc of pieces) {
			if (!re.test(pc.name) || /_x[bf]?$|_rear$|_roof|_side_/.test(pc.name) || pc.top < lo || pc.top > hi) continue;
			if (bare && /^(bush|tuft|flowers|hay)/.test(pc.name)) continue;
			if (biome === "desert" && /^fence/.test(pc.name)) continue;
			_cand.push(pc);
		}
		const n = _cand.length;
		if (n === 0) return false;
		if (vig === VIG.in) {
			if (n < 2) return false;
			let x0 = 9;
			let z0 = 9;
			let x1 = -9;
			let z1 = -9;
			for (const pc of _cand) {
				const ex = Math.abs(pc.hx);
				const ez = Math.abs(pc.hz);
				x0 = Math.min(x0, pc.x - ex);
				x1 = Math.max(x1, pc.x + ex);
				z0 = Math.min(z0, pc.z - ez);
				z1 = Math.max(z1, pc.z + ez);
			}
			const w = Math.min(x1 - x0, z1 - z0);
			if (w < .3) return false;
			const u = (x0 + x1) / 2;
			const v = (z0 + z1) / 2;
			_anc.x = ox + u * c4 - v * s4;
			_anc.z = oz + u * s4 + v * c4;
			_anc.y = 0;
			_anc.face = 0;
			_anc.spread = Math.max(.12, w * .3);
			return true;
		}
		for (let k = 0; k < n; k++) {
			const pc = _cand[(Math.floor(h1 * n) + k) % n];
			const half = Math.hypot(pc.hx, pc.hz);
			const wx = ox + pc.x * c4 - pc.z * s4;
			const wz = oz + pc.x * s4 + pc.z * c4;
			const ax = pc.hx * c4 - pc.hz * s4;
			const az = pc.hx * s4 + pc.hz * c4;
			if (vig === VIG.on || vig === VIG.top) {
				if (vig === VIG.on && half < .07) continue;
				const t = vig === VIG.top ? 0 : (h2 - .5) * .9;
				const x = wx + ax * t;
				const z = wz + az * t + .02;
				if (taken(list, x, z, .16, pc.top)) continue;
				_anc.x = x;
				_anc.z = z;
				_anc.y = vig === VIG.top ? pc.top * C.vignettes.topK : pc.top - C.vignettes.sink;
				_anc.face = h2 < .5 ? -1 : 1;
				return true;
			}
			const s0 = h2 < .5 ? -1 : 1;
			if (vig === VIG.at) {
				const reach = (TRUNK_RX.test(pc.name) ? .08 : Math.abs(ax)) + .14;
				for (let q = 0; q < 4; q++) {
					const sd = q & 1 ? -s0 : s0;
					const x = wx + sd * (q < 2 ? reach : reach * .4);
					const z = wz + (q < 2 ? .07 : .2);
					if (!spotOk(x, z, .06) || taken(list, x, z, .22)) continue;
					_anc.x = x;
					_anc.z = z;
					_anc.y = 0;
					_anc.face = sd;
					return true;
				}
			} else {
				const off = TRUNK_RX.test(pc.name) ? .1 : Math.max(.08, Math.abs(ax) * .8);
				for (let q = 0; q < 2; q++) {
					const sd = q ? -s0 : s0;
					const x = wx + sd * off;
					const z = wz - .05;
					if (!spotOk(x, z, .03) || taken(list, x, z, .22)) continue;
					_anc.x = x;
					_anc.z = z;
					_anc.y = 0;
					_anc.face = sd;
					return true;
				}
			}
		}
		return false;
	}
	const cache = /* @__PURE__ */ new Map();
	const _spot = {
		x: 0,
		z: 0
	};
	function nearWater(x, z, r) {
		for (let i = 0; i < 8; i++) {
			const a = i / 8 * PI * 2;
			if (isWater(x + Math.cos(a) * r, z + Math.sin(a) * r)) return true;
		}
		return false;
	}
	/** A standing spot in the cell around the tile-space-free offset (ax, az); false when the tile has none. */
	function findSpot(cx, cz, salt, mode, ax, az, spread, list) {
		for (let i = 0; i < 26; i++) {
			let ox = ax + (hash2f(cx * 3 + i * 7 + salt, cz * 3 + 1 - salt, HB) - .5) * 2 * spread * (i > 16 ? 1.6 : 1);
			let oz = az + (hash2f(cx * 3 + 2 + salt, cz * 3 + i * 5 - salt, HB + 31) - .5) * 2 * spread * (i > 16 ? 1.6 : 1);
			ox = Math.max(-.84, Math.min(.84, ox));
			oz = Math.max(-.84, Math.min(.84, oz));
			const x = cx * TILE_SIZE + ox;
			const z = cz * TILE_SIZE + oz;
			if (mode === MODE_FLOAT) {
				if (!(isWater(x, z) && isWater(x + .15, z) && isWater(x - .15, z) && isWater(x, z + .15) && isWater(x, z - .15))) continue;
			} else {
				if (world.clearance(x, z) < (mode === MODE_BANK ? .09 : .14)) continue;
				if (world.surfaceAt(x, z) === "bridge") continue;
				if (mode === MODE_BANK && !nearWater(x, z, .3)) continue;
				if (i < 16 && mode !== MODE_BANK && (world.clearance(x, z + .2) <= .02 || world.clearance(x, z + .42) <= .02)) continue;
			}
			let close = false;
			for (let k = 0; k < list.length && !close; k++) {
				const dx = list[k].x - x;
				const dz = list[k].z - z;
				close = i < 18 ? dx * dx + dz * dz * 3.2 < .09 : dx * dx + dz * dz < .0225;
			}
			if (close) continue;
			_spot.x = x;
			_spot.z = z;
			return true;
		}
		return false;
	}
	function specsFor(cx, cz) {
		const k = cellKey$1(cx, cz);
		let list = cache.get(k);
		if (list !== void 0) return list;
		list = EMPTY;
		const cell = world.tileAt(cx, cz);
		const biome = cell && cell.biome || biomeAt(seed, cx, cz);
		const table = cell ? C.spawns[biome] && C.spawns[biome][cell.model] || C.spawns.all[cell.model] : null;
		if (table) {
			list = [];
			const rot = ((cell.rot | 0) % 4 + 4) % 4;
			for (let e = 0; e < table.length; e++) {
				const [id, chance, lo, hi, flags = ""] = table[e];
				const sp = SPEC[id];
				if (!sp) continue;
				if (hash2f(cx * 5 + e * 3, cz * 7 - e, HA) >= chance * C.density) continue;
				const n = lo + Math.floor(hash2f(cx * 5 - e, cz * 7 + e * 3, HA + 7) * (hi - lo + 1));
				const when = flags.includes("d") ? 1 : flags.includes("n") ? 2 : 0;
				const mode = flags.includes("w") ? MODE_FLOAT : flags.includes("p") ? MODE_PERCH : flags.includes("b") ? MODE_BANK : MODE_GROUND;
				const group = flags.includes("h") || flags.includes("c");
				let ax = 0;
				let az = 0;
				let spread = .78;
				if (flags.includes("o")) {
					let u = (hash2f(cx, cz, HA + 3) < .5 ? -1 : 1) * .3;
					let v = .28;
					for (let i = 0; i < rot; i++) {
						const t = u;
						u = -v;
						v = t;
					}
					ax = u;
					az = v;
					spread = .22;
				}
				const a5 = table[e][5];
				const anc = Array.isArray(a5) ? a5 : Array.isArray(table[e][6]) ? table[e][6] : null;
				let vk = 0;
				let vre = null;
				if (typeof a5 === "string" && C.vignettes.enabled !== false) {
					const c = a5.indexOf(":");
					vk = VIG[c < 0 ? a5 : a5.slice(0, c)] || 0;
					vre = c < 0 ? null : rxFor(a5.slice(c + 1));
				}
				const PE = C.vignettes.perchEvery | 0;
				if (vk === VIG.on && id === "cat" && PE > 1) {
					const bx = Math.floor(cx / PE);
					const bz = Math.floor(cz / PE);
					const pick = Math.floor(hash2f(bx * 3 + 1, bz * 5 - 2, HA + 29) * PE * PE);
					if (cx - bx * PE + (cz - bz * PE) * PE !== pick) {
						if (table.some((r) => r[0] === "cat" && r[5] === "door")) continue;
						vk = VIG.door;
						vre = null;
					}
				}
				let fixed = false;
				if (anc !== null) {
					let u = anc[0];
					let v = anc[1];
					for (let i = 0; i < rot; i++) {
						const t = u;
						u = -v;
						v = t;
					}
					ax = u;
					az = v;
					spread = anc[2] || .2;
					fixed = true;
				}
				if (vk === VIG.in && resolveAnchor(vk, vre, cell, cx, cz, rot, biome, 0, 0, list)) {
					ax = _anc.x - cx * TILE_SIZE;
					az = _anc.z - cz * TILE_SIZE;
					spread = _anc.spread;
					fixed = true;
				}
				let prev = null;
				for (let j = 0; j < n; j++) {
					const salt = e * 17 + j * 5;
					let x;
					let z;
					let y = 0;
					let vig = 0;
					let face = 0;
					let m = mode;
					if (vk !== 0 && vk !== VIG.in && resolveAnchor(vk, vre, cell, cx, cz, rot, biome, hash2f(cx * 7 + salt, cz * 3 - salt, HA + 17), hash2f(cx * 3 - salt, cz * 7 + salt, HA + 19), list)) {
						x = _anc.x;
						z = _anc.z;
						y = _anc.y;
						vig = vk;
						face = _anc.face;
						m = vk === VIG.on || vk === VIG.top ? MODE_PERCH : MODE_GROUND;
					} else if (mode === MODE_PERCH) {
						const ps = perchesFor(cell.model);
						if (!ps.length) break;
						const pi = Math.floor(hash2f(cx + salt, cz - salt, HA + 11) * (ps.length / 4)) * 4;
						let u = ps[pi];
						let v = ps[pi + 2] + .015;
						for (let i = 0; i < rot; i++) {
							const t = u;
							u = -v;
							v = t;
						}
						x = cx * TILE_SIZE + u;
						z = cz * TILE_SIZE + v;
						y = ps[pi + 1];
						if (rot !== 0) z += .03;
					} else {
						if (!findSpot(cx, cz, salt, mode, ax, az, spread, list)) break;
						x = _spot.x;
						z = _spot.z;
						if (group && j === 0 && !fixed) {
							ax = x - cx * TILE_SIZE;
							az = z - cz * TILE_SIZE;
							spread = mode === MODE_BANK ? .3 : .2 + .09 * n;
						}
					}
					const spec = {
						key: k * 32 + list.length,
						id,
						sp,
						set: SETS[id][Math.floor(hash2f(cx * 11 + salt, cz * 13 + salt, HA + 5) * SETS[id].length)],
						x,
						y,
						z,
						when,
						mode: m,
						vig: vig || (vk === VIG.in && fixed ? VIG.in : 0),
						face,
						lead: flags.includes("c") ? prev : null,
						seed: hash2f(cx * 17 + salt, cz * 19 - salt, HB + 9) * 4294967296 >>> 0
					};
					list.push(spec);
					prev = spec;
					if (list.length >= 8) break;
				}
				if (list.length >= 8) break;
			}
			if (!list.length) list = EMPTY;
		}
		if (cache.size > 5e3) cache.clear();
		cache.set(k, list);
		return list;
	}
	const slots = [];
	for (let i = 0; i < N; i++) slots.push({
		i,
		live: false,
		spec: null,
		sp: null,
		set: null,
		mode: 0,
		st: 0,
		st0: 0,
		x: 0,
		y: 0,
		z: 0,
		hx: 0,
		hz: 0,
		tx: 0,
		tz: 0,
		fx: 0,
		fz: 0,
		t: 0,
		dur: 0,
		v: 0,
		air: false,
		idle: null,
		face: 1,
		faceK: 1,
		s: 0,
		ph: 0,
		rock: 0,
		lift: 0,
		r: 1,
		mv: false,
		stuck: 0,
		cool: 0,
		ft: 0,
		fmax: 0,
		side: 1,
		ang: 0,
		rad: 0,
		dir: 1,
		stale: false,
		seen: 0,
		comp: false,
		leave: false,
		nap: 0,
		wake: 0,
		bio: 0,
		unset: 0,
		fy: 0
	});
	const byKey = /* @__PURE__ */ new Map();
	let scanId = 0;
	let lastCx = NaN;
	let lastCz = NaN;
	let dirty = true;
	let night = !!(daynight && daynight.night);
	let clock = 0;
	let live = 0;
	let shown = 0;
	let followers = 0;
	let spawned = 0;
	function rnd(sl) {
		sl.r = Math.imul(sl.r, 1664525) + 1013904223 >>> 0;
		return sl.r / 4294967296;
	}
	function hide(sl) {
		const o = sl.i * 16;
		M[o] = M[o + 1] = M[o + 4] = M[o + 5] = 0;
		M[o + 13] = -50;
	}
	function release(sl) {
		if (byKey.get(sl.spec.key) === sl) byKey.delete(sl.spec.key);
		if (comp === sl) comp = null;
		sl.live = false;
		sl.spec = null;
		sl.s = 0;
		sl.comp = false;
		sl.leave = false;
		hide(sl);
	}
	/** Back to where the cell's own rule puts it (also the start state). */
	function reset(sl) {
		const sc = sl.spec;
		sl.x = sl.hx = sc.x;
		sl.z = sl.hz = sc.z;
		sl.y = sc.y;
		sl.r = sc.seed || 1;
		sl.mode = sc.mode;
		sl.st = sl.st0 = sc.mode === MODE_FLOAT ? ST_FLOAT : sc.mode === MODE_PERCH ? ST_PERCH : ST_IDLE;
		sl.t = 0;
		sl.dur = rnd(sl) * 4;
		sl.v = 0;
		sl.air = false;
		sl.stuck = 0;
		sl.cool = 0;
		sl.ft = 0;
		sl.ph = 0;
		sl.rock = 0;
		sl.lift = 0;
		sl.face = rnd(sl) < .5 ? -1 : 1;
		sl.faceK = sl.face;
		sl.side = rnd(sl) < .5 ? -1 : 1;
		sl.idle = sl.set.idle[rnd(sl) * sl.set.idle.length | 0];
		if (sc.mode === MODE_FLOAT) {
			const arc = sl.sp.arc || [.1, .25];
			sl.rad = arc[0] + rnd(sl) * (arc[1] - arc[0]);
			sl.ang = rnd(sl) * PI * 2;
			sl.dir = rnd(sl) < .5 ? -1 : 1;
			sl.fx = sc.x - Math.cos(sl.ang) * sl.rad;
			sl.fz = sc.z - Math.sin(sl.ang) * sl.rad;
			sl.idle = sl.set.float || sl.set.stand;
		} else if (sc.mode !== MODE_PERCH) sl.y = world.heightAt(sc.x, sc.z) || 0;
		if (sc.vig > 0 && sc.vig !== VIG.in) {
			if (sc.face) sl.face = sl.faceK = sc.face;
			if (sc.vig === VIG.door) {
				sl.idle = sl.set.sleep !== null && rnd(sl) < C.vignettes.doorSleep ? sl.set.sleep : sl.set.sit;
				sl.dur = 14 + rnd(sl) * 20;
			} else if (sc.vig !== VIG.top) {
				sl.idle = sl.set.sit;
				sl.dur = 6 + rnd(sl) * 10;
			}
		}
	}
	function spawn(spec) {
		let sl = null;
		for (let i = 0; i < N; i++) if (!slots[i].live) {
			sl = slots[i];
			break;
		}
		if (!sl) return null;
		sl.live = true;
		sl.spec = spec;
		sl.sp = spec.sp;
		sl.set = spec.set;
		sl.mode = spec.mode;
		sl.s = 0;
		sl.stale = false;
		sl.comp = false;
		sl.leave = false;
		sl.nap = 0;
		sl.wake = 0;
		sl.bio = 0;
		sl.unset = 0;
		sl.fy = 0;
		reset(sl);
		byKey.set(spec.key, sl);
		spawned++;
		return sl;
	}
	/** Give every animal of the cells in range a slot (nearest cells first); mark the others stale. */
	function rescan() {
		dirty = false;
		scanId++;
		const p = traveller.position;
		const tcx = Math.round(p.x / TILE_SIZE);
		const tcz = Math.round(p.z / TILE_SIZE);
		lastCx = tcx;
		lastCz = tcz;
		const R = Math.ceil(C.range / TILE_SIZE);
		const r2 = (C.range + TILE_SIZE * .5) * (C.range + TILE_SIZE * .5);
		for (let r = 0; r <= R; r++) for (let dz = -r; dz <= r; dz++) for (let dx = -r; dx <= r; dx++) {
			if (Math.max(Math.abs(dx), Math.abs(dz)) !== r) continue;
			const cx = tcx + dx;
			const cz = tcz + dz;
			const ex = cx * TILE_SIZE - p.x;
			const ez = cz * TILE_SIZE - p.z;
			if (ex * ex + ez * ez > r2) continue;
			const list = specsFor(cx, cz);
			for (let k = 0; k < list.length; k++) {
				const sc = list[k];
				if (sc.when === 1 && night || sc.when === 2 && !night) continue;
				let sl = byKey.get(sc.key);
				if (sl === void 0) sl = spawn(sc);
				if (sl) {
					sl.seen = scanId;
					sl.stale = false;
				}
			}
		}
		for (let i = 0; i < N; i++) {
			const sl = slots[i];
			if (!sl.live || sl.seen === scanId) continue;
			if (sl.comp || sl.spec.key < 0) continue;
			if (sl.st === ST_FOLLOW || sl.st === ST_RETURN) {
				const dx = sl.x - p.x;
				const dz = sl.z - p.z;
				if (dx * dx + dz * dz < 36) continue;
			}
			sl.stale = true;
		}
	}
	/** One step toward (tx, tz): 0 = under way, 1 = there, 2 = blocked. Slides along blockers on one axis. */
	function advance(sl, tx, tz, speed, dt) {
		const ex = tx - sl.x;
		const ez = tz - sl.z;
		const el = Math.sqrt(ex * ex + ez * ez);
		if (el < .02) return 1;
		const st = Math.min(el, speed * dt);
		if (st <= 0) return 0;
		const nx = sl.x + ex / el * st;
		const nz = sl.z + ez / el * st;
		if (okAt(sl, nx, nz)) {
			sl.x = nx;
			sl.z = nz;
		} else if (Math.abs(ex) > .03 && okAt(sl, sl.x + Math.sign(ex) * st, sl.z)) sl.x += Math.sign(ex) * st;
		else if (Math.abs(ez) > .03 && okAt(sl, sl.x, sl.z + Math.sign(ez) * st)) sl.z += Math.sign(ez) * st;
		else return 2;
		sl.ph += Math.min(st / sl.sp.step, dt * C.stepRate);
		sl.mv = true;
		if (Math.abs(ex) > .3 * el) sl.face = ex > 0 ? 1 : -1;
		if (sl.mode !== MODE_FLOAT) sl.y = world.heightAt(sl.x, sl.z) || 0;
		return st >= el ? 1 : 0;
	}
	function wander(sl) {
		const sp = sl.sp;
		if (!(sp.roam > 0) || !(sp.speed > 0)) return false;
		const tx = sl.hx + (rnd(sl) - .5) * 2 * sp.roam;
		const tz = sl.hz + (rnd(sl) - .5) * 2 * sp.roam;
		if (!okAt(sl, tx, tz)) return false;
		sl.tx = tx;
		sl.tz = tz;
		sl.st = ST_WALK;
		sl.t = 0;
		sl.stuck = 0;
		const frisky = sp.frisky && rnd(sl) < sp.frisky;
		sl.v = frisky ? sp.run : sp.speed;
		sl.air = !!frisky || !!sl.set.air && sp.b === "shy";
		return true;
	}
	function think(sl) {
		const sp = sl.sp;
		const b = sp.b;
		const set = sl.set;
		sl.t = 0;
		if (b === "perch") {
			sl.dur = 9;
			return;
		}
		const vg = sl.spec.vig;
		if (vg >= VIG.at && vg <= VIG.door && rnd(sl) < C.vignettes.stay) {
			const hx = sl.x - sl.spec.x;
			const hz = sl.z - sl.spec.z;
			if (hx * hx + hz * hz < .01) {
				if (vg !== VIG.door || sl.idle !== set.sleep) sl.idle = set.sit;
				if (sl.spec.face) sl.face = sl.spec.face;
				sl.dur = 6 + rnd(sl) * 10;
				return;
			}
			if (sp.speed > 0 && okAt(sl, sl.spec.x, sl.spec.z)) {
				sl.tx = sl.spec.x;
				sl.tz = sl.spec.z;
				sl.st = ST_WALK;
				sl.v = sp.speed;
				sl.air = false;
				sl.stuck = 0;
				return;
			}
		}
		let walkP = b === "pet" ? .45 : b === "graze" ? .55 : b === "peck" ? .25 : .3;
		if (night) {
			if (b === "graze" && !sp.restless) walkP = .04;
			else if (b === "pet") walkP = .22;
		}
		if (sp.restless) walkP = .8;
		if (sl.idle !== set.sleep || rnd(sl) < .5) {
			if (rnd(sl) < walkP && wander(sl)) return;
		}
		let pose = set.idle[rnd(sl) * set.idle.length | 0];
		if (night) {
			if (b === "pet" && set.sleep && rnd(sl) < .5) pose = set.sleep;
			else if (b === "graze") pose = set.stand;
		}
		sl.idle = pose;
		sl.dur = pose === set.sleep ? 12 + rnd(sl) * 16 : b === "peck" ? .35 + rnd(sl) * 1.3 : sp.restless ? .6 + rnd(sl) * 1.6 : b === "graze" ? 3 + rnd(sl) * 6 : 2.5 + rnd(sl) * 5;
	}
	/** Away from the traveller (dx, dz = vector to him): a free spot `dist` off, tried at widening angles. */
	function startFlee(sl, dx, dz, dist, fly) {
		const base = Math.atan2(-dz, -dx);
		for (let sc = 0; sc < 2; sc++) {
			const d = dist * (sc ? .6 : 1);
			for (let k = 0; k < FLEE_OFFS.length; k++) {
				const a = base + FLEE_OFFS[k] * (sl.side || 1);
				const tx = sl.x + Math.cos(a) * d;
				const tz = sl.z + Math.sin(a) * d;
				if (!okAt(sl, tx, tz)) continue;
				if (!fly && !okAt(sl, (sl.x + tx) / 2, (sl.z + tz) / 2)) continue;
				sl.tx = tx;
				sl.tz = tz;
				sl.t = 0;
				sl.stuck = 0;
				if (fly) {
					sl.st = ST_FLY;
					sl.fx = sl.x;
					sl.fz = sl.z;
					sl.dur = 1.3 + d * .5;
				} else {
					sl.st = ST_FLEE;
					sl.v = sl.sp.run || sl.sp.speed;
					sl.air = !!sl.set.air || !!sl.sp.leap;
				}
				return true;
			}
		}
		return false;
	}
	function tryFollow(sl, d2, tsp) {
		const sp = sl.sp;
		if (!(sp.follow > 0) || sl.leave || sl.cool > 0 || d2 > sp.notice * sp.notice || tsp < .4 || sl.st === ST_IDLE && sl.idle === sl.set.sleep) return false;
		if (followers >= C.maxFollowers || rnd(sl) >= sp.follow) {
			sl.cool = 8;
			return false;
		}
		sl.st = ST_FOLLOW;
		sl.t = 0;
		sl.ft = 0;
		sl.stuck = 0;
		sl.air = false;
		sl.rad = 0;
		sl.fmax = sp.followTime[0] + rnd(sl) * (sp.followTime[1] - sp.followTime[0]);
		followers++;
		return true;
	}
	function endFollow(sl) {
		sl.cool = C.followCool;
		sl.st = ST_RETURN;
		sl.t = 0;
		sl.stuck = 0;
		sl.air = false;
		sl.tx = sl.hx;
		sl.tz = sl.hz;
		sl.v = sl.sp.speed * 1.7;
	}
	function settleDown(sl, dx) {
		const was = sl.st;
		sl.st = ST_IDLE;
		sl.t = 0;
		sl.stuck = 0;
		sl.air = false;
		if (was === ST_FLEE || was === ST_FLY) {
			sl.cool = 5;
			sl.hx = sl.x;
			sl.hz = sl.z;
			sl.idle = was === ST_FLY ? sl.set.walk[0] : sl.set.sit;
			if (Math.abs(dx) > .1) sl.face = dx > 0 ? 1 : -1;
			sl.dur = 2.5 + rnd(sl) * 3;
		} else if (was === ST_RETURN) {
			sl.idle = sl.set.sit;
			sl.dur = 3 + rnd(sl) * 4;
		} else {
			sl.idle = sl.set.idle[rnd(sl) * sl.set.idle.length | 0];
			sl.dur = sl.sp.b === "pet" ? 2 + rnd(sl) * 5 : .6 + rnd(sl) * 2.5;
		}
	}
	/** A bank duck slides into the water next to it, away from the traveller (dx, dz = vector to him). */
	function startSlide(sl, dx, dz) {
		const base = Math.atan2(-dz, -dx);
		for (let ri = 0; ri < 4; ri++) {
			const r = .3 + ri * .14;
			for (let k = 0; k < FLEE_OFFS.length; k++) {
				const a = base + FLEE_OFFS[k] * (sl.side || 1);
				const tx = sl.x + Math.cos(a) * r;
				const tz = sl.z + Math.sin(a) * r;
				if (!okWater(tx, tz) || !isWater(tx + .13, tz) || !isWater(tx - .13, tz) || !isWater(tx, tz + .13) || !isWater(tx, tz - .13)) continue;
				sl.fx = sl.x;
				sl.fz = sl.z;
				sl.tx = tx;
				sl.tz = tz;
				sl.st = ST_SLIDE;
				sl.t = 0;
				sl.dur = .45 + r * 1.3;
				sl.stuck = 0;
				sl.air = false;
				return true;
			}
		}
		sl.cool = 2.5;
		return false;
	}
	let comp = null;
	let compWait = C.companion && C.companion.after || 5;
	let compSearch = 0;
	let compSeen = -1;
	const compSpec = {
		key: -7,
		id: "",
		sp: null,
		set: null,
		x: 0,
		y: 0,
		z: 0,
		when: 0,
		mode: MODE_GROUND,
		vig: 0,
		face: 0,
		lead: null,
		seed: 1
	};
	function settledAt(x, z) {
		const K = C.companion;
		if (!K.biomes) return true;
		const cx = Math.round(x / TILE_SIZE);
		const cz = Math.round(z / TILE_SIZE);
		const cell = world.tileAt(cx, cz);
		return K.biomes.includes(cell && cell.biome || biomeAt(seed, cx, cz));
	}
	function adopt(sl, quick) {
		let nf = 0;
		for (let i = 0; i < N; i++) if (slots[i].live && slots[i] !== sl && slots[i].st === ST_FOLLOW) nf++;
		for (let i = 0; i < N && nf >= C.maxFollowers; i++) {
			const o = slots[i];
			if (o.live && o !== sl && o.st === ST_FOLLOW && !o.comp) {
				endFollow(o);
				nf--;
			}
		}
		if (sl.st !== ST_FOLLOW) followers++;
		comp = sl;
		sl.comp = true;
		sl.leave = false;
		sl.stale = false;
		sl.st = ST_FOLLOW;
		sl.t = 0;
		sl.ft = 0;
		sl.stuck = 0;
		sl.air = false;
		sl.rad = 0;
		sl.nap = 0;
		sl.unset = 0;
		sl.bio = 1;
		sl.dur = 0;
		sl.wake = quick ? 0 : .6;
		if (compSeen < 0) compSeen = clock;
	}
	/** The companion lets him go: it walks home (a cat of the place), sits and watches him leave, or folds away. */
	let compLeft = "";
	function dismiss(sl, gap, sit, why) {
		const K = C.companion;
		compLeft = why + "@" + clock.toFixed(1);
		sl.comp = false;
		comp = null;
		compWait = gap;
		compSearch = Math.max(0, (K.spawnAfter || 12) - (K.back || 4));
		if (sl.spec.key < 0) {
			if (sit) {
				sl.st = ST_IDLE;
				sl.idle = sl.set.sit;
				sl.t = 0;
				sl.dur = 1e9;
				sl.hx = sl.x;
				sl.hz = sl.z;
				sl.leave = true;
			} else sl.stale = true;
		} else endFollow(sl);
	}
	/** Its own cat pops up `near` him (r = 0: right beside him, for stills) and comes over. */
	function spawnCompanion(p, mdx, mdz, beside) {
		const K = C.companion;
		const id = K.species || "cat";
		if (!SETS[id] || byKey.has(compSpec.key)) return false;
		const base = Math.atan2(mdz, mdx);
		let fx = 0;
		let fz = 0;
		let found = false;
		for (let ri = 0; ri < 4 && !found; ri++) {
			const r = beside ? .3 + ri * .07 : [
				2.2,
				1.7,
				2.7,
				1.3
			][ri];
			for (let k = 0; k < FLEE_OFFS.length && !found; k++) {
				const a = beside ? (k & 1 ? PI : 0) + (k >> 1) * .5 - .25 : base + FLEE_OFFS[(k + 1) % FLEE_OFFS.length] * .8;
				const x = p.x + Math.cos(a) * r;
				const z = p.z + Math.sin(a) * r + (beside ? .06 : 0);
				if (beside ? world.clearance(x, z) > .03 && !isWater(x, z) : okGround(x, z) && riseAt(x, z) >= C.riseAt) {
					fx = x;
					fz = z;
					found = true;
				}
			}
		}
		if (!found) return false;
		const sets = SETS[id];
		let set = sets[0];
		for (let i = 0; i < sets.length; i++) if (sets[i].art === K.coat) set = sets[i];
		compSpec.id = id;
		compSpec.sp = SPEC[id];
		compSpec.set = set;
		compSpec.x = fx;
		compSpec.z = fz;
		compSpec.y = 0;
		compSpec.seed = (Math.floor(clock * 977) ^ HA) >>> 0 || 1;
		let sl = spawn(compSpec);
		if (!sl) {
			let far = null;
			let fd = 4;
			for (let i = 0; i < N; i++) {
				const o = slots[i];
				if (!o.live || o.comp || o.st === ST_FOLLOW) continue;
				const dx = o.x - p.x;
				const dz = o.z - p.z;
				if (dx * dx + dz * dz > fd) {
					fd = dx * dx + dz * dz;
					far = o;
				}
			}
			if (far === null) return false;
			release(far);
			sl = spawn(compSpec);
			if (!sl) return false;
		}
		adopt(sl, beside);
		return true;
	}
	function companionTick(dt, p, tsp, mdx, mdz) {
		const K = C.companion;
		if (!K || K.enabled === false) {
			if (comp !== null) dismiss(comp, 0, false, "off");
			return;
		}
		if (comp !== null) {
			if (comp.live && comp.comp) return;
			comp = null;
		}
		compWait -= dt;
		if (compWait > 0) return;
		compWait = .4;
		if (!settledAt(p.x, p.z)) return;
		const id = K.species || "cat";
		let best = null;
		let bd = K.notice * K.notice;
		for (let i = 0; i < N; i++) {
			const sl = slots[i];
			if (!sl.live || sl.s < .9 || sl.spec.id !== id || sl.spec.lead !== null) continue;
			const up = sl.mode === MODE_PERCH && sl.spec.vig === VIG.on;
			if (sl.mode !== MODE_GROUND && !up) continue;
			if (sl.st !== ST_IDLE && sl.st !== ST_WALK && sl.st !== ST_FOLLOW && sl.st !== ST_RETURN && !(up && sl.st === ST_PERCH)) continue;
			if (sl.st === ST_IDLE && sl.idle === sl.set.sleep) continue;
			const dx = sl.x - p.x;
			const dz = sl.z - p.z;
			const d2 = (dx * dx + dz * dz) * (up ? 2 : 1);
			if (d2 < bd) {
				bd = d2;
				best = sl;
			}
		}
		if (best !== null) {
			const up = best.mode === MODE_PERCH;
			adopt(best, false);
			if (up) {
				best.mode = MODE_GROUND;
				best.rad = 1;
				best.ang = 0;
				best.fx = best.x;
				best.fz = best.z;
				best.fy = best.y;
			}
			return;
		}
		compSearch += .4;
		if (compSearch >= (K.spawnAfter || 12) && spawnCompanion(p, mdx, mdz, false)) compSearch = 0;
	}
	function write(sl, pose) {
		const o = sl.i * 16;
		const k1 = sl.s - 1;
		const k = (1 + 2.4 * k1 * k1 * k1 + 1.4 * k1 * k1) * C.scale * (sl.sp.size || 1);
		const fk = Math.abs(sl.faceK);
		const w = pose.w * k * (fk < .1 ? .1 : fk);
		const h = pose.h * k;
		const c = Math.cos(sl.rock);
		const s = Math.sin(sl.rock);
		const left = sl.faceK < 0;
		const a = left ? 1 - pose.a : pose.a;
		M[o] = w * c;
		M[o + 1] = w * s;
		M[o + 4] = -h * s;
		M[o + 5] = h * c;
		M[o + 12] = sl.x - a * w * c;
		M[o + 13] = sl.y + sl.lift + C.lift - a * w * s;
		M[o + 14] = sl.z;
		const q = sl.i * 4;
		if (left) {
			rectArr[q] = pose.u0 + pose.du;
			rectArr[q + 2] = -pose.du;
		} else {
			rectArr[q] = pose.u0;
			rectArr[q + 2] = pose.du;
		}
		rectArr[q + 1] = pose.v0;
		rectArr[q + 3] = pose.dv;
	}
	function update(dt) {
		if (!loaded) return;
		clock += dt;
		const nowNight = !!(daynight && daynight.night);
		if (nowNight !== night) {
			night = nowNight;
			dirty = true;
		}
		const p = traveller.position;
		const tcx = Math.round(p.x / TILE_SIZE);
		const tcz = Math.round(p.z / TILE_SIZE);
		if (dirty || tcx !== lastCx || tcz !== lastCz) rescan();
		cardN.value.set(C.normal[0], C.normal[1]);
		mat.color.setScalar(C.tint ?? 1);
		const tsp = traveller.speed || 0;
		const md = traveller.moveDir;
		const mdx = md ? md.x : 0;
		const mdz = md ? md.z : 1;
		const flipK = Math.min(1, dt * C.flipRate);
		if (dt > 0) companionTick(dt, p, tsp, mdx, mdz);
		const KC = C.companion;
		let nLive = 0;
		let nShown = 0;
		let nFollow = 0;
		for (let i = 0; i < N; i++) {
			const sl = slots[i];
			if (!sl.live) continue;
			nLive++;
			const sp = sl.sp;
			const set = sl.set;
			if (!sl.stale && (sl.st === ST_FOLLOW || riseAt(sl.x, sl.z) >= C.riseAt)) sl.s = Math.min(1, sl.s + dt * C.popRate);
			else sl.s = Math.max(0, sl.s - dt * C.hideRate);
			if (sl.s <= 0) {
				if (sl.stale || sl.spec.key < 0) {
					release(sl);
					continue;
				}
				if (sl.x !== sl.spec.x || sl.z !== sl.spec.z || sl.st !== sl.st0) reset(sl);
				hide(sl);
				continue;
			}
			nShown++;
			const dx = p.x - sl.x;
			const dz = p.z - sl.z;
			const d2 = dx * dx + dz * dz;
			sl.t += dt;
			if (sl.cool > 0) sl.cool -= dt;
			sl.mv = false;
			if (sl.leave && d2 > 12) sl.stale = true;
			let pose = sl.idle;
			let rock = 0;
			let lift = 0;
			const leader = sl.spec.lead !== null ? byKey.get(sl.spec.lead.key) : void 0;
			if (leader !== void 0 && leader.live && leader.s > 0) {
				const ex = leader.x - sl.x;
				const ez = leader.z - sl.z;
				if (ex * ex + ez * ez > sp.gap * sp.gap) advance(sl, leader.x, leader.z, sp.speed * 1.2, dt);
				pose = set.stand;
			} else switch (sl.st) {
				case ST_IDLE: {
					const b = sp.b;
					if (b === "pet") {
						if (tryFollow(sl, d2, tsp)) break;
						if (sp.wag && d2 < C.wag * C.wag && pose !== set.sleep) {
							pose = set.stand;
							rock = Math.sin(clock * 13 + i) * .07;
							if (Math.abs(dx) > .15) sl.face = dx > 0 ? 1 : -1;
						}
					} else if (b === "graze") {
						if (sl.mode === MODE_BANK && set.float !== null && sl.cool <= 0 && d2 < C.slide * C.slide && startSlide(sl, dx, dz)) break;
						if (sp.shuffle > 0 && sl.cool <= 0 && d2 < C.shuffle * C.shuffle && startFlee(sl, dx, dz, sp.shuffle, false)) {
							sl.st = ST_WALK;
							sl.v = sp.speed * 2.4;
							sl.air = false;
							sl.cool = 3;
							break;
						}
						if (d2 < C.headsUp * C.headsUp) {
							pose = set.stand;
							if (Math.abs(dx) > .2) sl.face = dx > 0 ? 1 : -1;
						}
					} else if (b === "peck") {
						if (d2 < C.scatter * C.scatter && startFlee(sl, dx, dz, sp.flee, !!sp.fly)) break;
					} else if (b === "shy") {
						const ar = sp.alert * (sl.cool > 0 ? .55 : 1);
						if (d2 < ar * ar) {
							sl.st = ST_FREEZE;
							sl.t = 0;
							sl.dur = .35 + rnd(sl) * .4;
							sl.idle = pose = set.stand;
							if (Math.abs(dx) > .1) sl.face = dx > 0 ? 1 : -1;
							break;
						}
					}
					if (sl.t >= sl.dur) think(sl);
					break;
				}
				case ST_WALK:
				case ST_RETURN:
				case ST_FLEE: {
					if (sl.st === ST_WALK) {
						const b = sp.b;
						if (b === "pet") {
							if (tryFollow(sl, d2, tsp)) break;
						} else if (b === "peck") {
							if (d2 < C.scatter * C.scatter && startFlee(sl, dx, dz, sp.flee, !!sp.fly)) break;
						} else if (b === "shy" && sl.cool <= 0 && d2 < sp.alert * sp.alert) {
							sl.st = ST_FREEZE;
							sl.t = 0;
							sl.dur = .3 + rnd(sl) * .3;
							sl.idle = set.stand;
							break;
						}
					}
					let gx = sl.tx;
					let gz = sl.tz;
					if (sl.st === ST_FLEE && sp.zig > 0) {
						const ex = sl.tx - sl.x;
						const ez = sl.tz - sl.z;
						const el = Math.hypot(ex, ez);
						if (el > .3) {
							const w = (Math.sin(sl.t * 13 + i) > 0 ? 1 : -1) * sp.zig * el;
							gx += -ez / el * w;
							gz += ex / el * w;
						}
					}
					let r = advance(sl, gx, gz, sl.v, dt);
					if (r === 2 && (gx !== sl.tx || gz !== sl.tz)) r = advance(sl, sl.tx, sl.tz, sl.v, dt);
					if (r === 2) sl.stuck += dt;
					else sl.stuck = 0;
					if (r === 1 || sl.stuck > .5 || sl.t > 14) settleDown(sl, dx);
					break;
				}
				case ST_FREEZE:
					if (sl.t >= sl.dur) {
						const ar = sp.alert * 1.25;
						if (sp.flee > 0 && d2 < ar * ar) {
							if (!startFlee(sl, dx, dz, sp.flee, false)) sl.dur = sl.t + 1.2;
						} else if (d2 >= ar * ar || !(sp.flee > 0)) {
							if (d2 >= sp.alert * sp.alert) {
								sl.st = ST_IDLE;
								sl.t = 0;
								sl.dur = 1.5 + rnd(sl) * 2;
								sl.cool = 2;
							}
						}
					}
					break;
				case ST_FOLLOW: {
					sl.ft += dt;
					const hx = sl.x - sl.hx;
					const hz = sl.z - sl.hz;
					if (sl.comp) {
						if (d2 > KC.lost * KC.lost || sl.stuck > 2.5) {
							dismiss(sl, KC.away, false, sl.stuck > 2.5 ? "stuck" : "lost");
							break;
						}
						sl.bio -= dt;
						if (sl.bio <= 0) {
							sl.bio = 1;
							if (settledAt(p.x, p.z)) sl.unset = 0;
							else if (++sl.unset >= KC.wild) {
								dismiss(sl, KC.away, true, "wild");
								break;
							}
						}
					} else if (sl.ft > sl.fmax || hx * hx + hz * hz > C.followFar * C.followFar || d2 > C.followLost * C.followLost || sl.stuck > 1.2) {
						endFollow(sl);
						break;
					}
					nFollow++;
					if (sl.wake > 0) {
						sl.wake -= dt;
						pose = sl.nap > KC.nap ? set.stretch || set.sit : set.alert || set.sit;
						if (Math.abs(dx) > .08) sl.face = dx > 0 ? 1 : -1;
						if (sl.wake < .18) lift = Math.sin(Math.max(0, sl.wake) / .18 * PI) * .05;
						if (sl.wake <= 0) sl.nap = 0;
						break;
					}
					if (sl.comp && tsp > .25 && sl.nap > 0) {
						if (sl.nap > KC.nap) {
							sl.wake = .55;
							break;
						}
						sl.nap = 0;
					}
					if (sl.rad > 0) {
						sl.ang += dt / .42;
						const u = Math.min(1, sl.ang);
						const lx = p.x - mdx * .2;
						const lz = p.z - mdz * .2;
						sl.x = sl.fx + (lx - sl.fx) * u;
						sl.z = sl.fz + (lz - sl.fz) * u;
						if (sl.fy > .02) sl.y = sl.fy + ((world.heightAt(sl.x, sl.z) || 0) - sl.fy) * u * u;
						if (Math.abs(lx - sl.fx) > .1) sl.face = lx > sl.fx ? 1 : -1;
						lift = Math.sin(u * PI) * .2;
						rock = (.5 - u) * .5 * sl.face;
						pose = set.walk[0];
						if (u >= 1) {
							sl.rad = 0;
							sl.stuck = 0;
							sl.fy = 0;
							sl.y = world.heightAt(sl.x, sl.z) || 0;
						}
						break;
					}
					let tx;
					let tz;
					if (tsp > .25) {
						const sd = Math.abs(mdx) > .35 ? mdx > 0 ? 1 : -1 : sl.side;
						tx = p.x - mdz * sd * C.followSide + mdx * .22;
						tz = p.z + mdx * sd * C.followSide + mdz * .22;
					} else {
						if (d2 < .2025) {
							if (sl.comp) sl.nap += dt;
							pose = sl.idle = sl.comp && sl.nap > KC.nap && set.sleep !== null ? set.sleep : set.sit;
							if (pose === set.sit && Math.abs(dx) > .08) sl.face = dx > 0 ? 1 : -1;
							break;
						}
						const d = Math.sqrt(d2);
						tx = p.x - dx / d * .32;
						tz = p.z - dz / d * .32;
					}
					const ex = tx - sl.x;
					const ez = tz - sl.z;
					const el = Math.sqrt(ex * ex + ez * ez);
					sl.v = Math.max(.4, Math.min(sl.comp && el > .8 ? sp.run * 1.3 : sp.run, el * 7));
					let r = el > .04 ? advance(sl, tx, tz, sl.v, dt) : 1;
					if (r === 2) {
						sl.side = -sl.side;
						r = advance(sl, p.x - mdx * .2, p.z - mdz * .2, Math.max(sl.v, sp.run * .8), dt);
					}
					if (r === 2) sl.stuck += dt;
					else sl.stuck = 0;
					if (sl.comp) sl.dur = d2 > KC.behind * KC.behind ? sl.dur + dt : 0;
					if ((sl.stuck > .3 || sl.comp && sl.dur > .45) && world.clearance(p.x - mdx * .2, p.z - mdz * .2) > .012) {
						sl.rad = 1;
						sl.ang = 0;
						sl.fx = sl.x;
						sl.fz = sl.z;
						sl.dur = 0;
					}
					pose = set.walk[0];
					break;
				}
				case ST_FLY: {
					const u = Math.min(1, sl.t / sl.dur);
					const e = u * u * (3 - 2 * u);
					const nx = sl.fx + (sl.tx - sl.fx) * e;
					if (Math.abs(sl.tx - sl.fx) > .1) sl.face = sl.tx > sl.fx ? 1 : -1;
					sl.x = nx;
					sl.z = sl.fz + (sl.tz - sl.fz) * e;
					lift = Math.sin(u * PI) * (.35 + .25 * sl.dur * .4);
					rock = Math.sin(clock * 38 + i) * .3 * Math.sin(u * PI) + .25 * Math.sin(u * PI) * (1 - 2 * u);
					pose = set.walk[0];
					if (u >= 1) {
						sl.y = world.heightAt(sl.x, sl.z) || 0;
						settleDown(sl, dx);
					}
					break;
				}
				case ST_FLOAT: {
					const w = (sp.drift || .07) / Math.max(.08, sl.rad);
					const na = sl.ang + sl.dir * w * dt;
					const nx = sl.fx + Math.cos(na) * sl.rad;
					const nz = sl.fz + Math.sin(na) * sl.rad;
					const vx = -Math.sin(na) * sl.dir;
					const vz = Math.cos(na) * sl.dir;
					if (okWater(nx, nz) && isWater(nx + vx * .13, nz + vz * .13)) {
						sl.ang = na;
						sl.x = nx;
						sl.z = nz;
						if (Math.abs(vx) > .45) sl.face = vx > 0 ? 1 : -1;
					} else if (sl.t > .5) {
						sl.dir = -sl.dir;
						sl.t = 0;
					}
					rock = Math.sin(clock * .9 + i * 1.7) * .035;
					lift = Math.sin(clock * 1.4 + i) * .003 - C.lift;
					pose = set.float || set.stand;
					break;
				}
				case ST_SLIDE: {
					const u = Math.min(1, sl.t / sl.dur);
					const e = u * u * (3 - 2 * u);
					sl.x = sl.fx + (sl.tx - sl.fx) * e;
					sl.z = sl.fz + (sl.tz - sl.fz) * e;
					if (Math.abs(sl.tx - sl.fx) > .08) sl.face = sl.tx > sl.fx ? 1 : -1;
					const wet = isWater(sl.x, sl.z);
					pose = wet ? set.float : set.walk[Math.floor(sl.t * 9) & 1];
					rock = Math.sin(sl.t * 15) * .09 * (1 - u);
					lift = wet ? -C.lift : Math.abs(Math.sin(sl.t * 9 * PI)) * sp.hop;
					if (wet) sl.y = 0;
					if (u >= 1) {
						sl.mode = MODE_FLOAT;
						sl.st = ST_FLOAT;
						sl.t = 0;
						sl.y = 0;
						sl.idle = set.float;
						const arc = sp.arc || [.1, .25];
						sl.rad = arc[0] + rnd(sl) * (arc[1] - arc[0]);
						sl.ang = rnd(sl) * PI * 2;
						sl.dir = rnd(sl) < .5 ? -1 : 1;
						sl.fx = sl.x - Math.cos(sl.ang) * sl.rad;
						sl.fz = sl.z - Math.sin(sl.ang) * sl.rad;
					}
					break;
				}
				default:
					rock = Math.sin(clock * .7 + i) * (sp.rock || 0);
					if (sp.b === "pet") {
						if (d2 < 4 && Math.abs(dx) > .2) sl.face = dx > 0 ? 1 : -1;
						if (sl.t >= sl.dur) {
							sl.t = 0;
							sl.dur = 4 + rnd(sl) * 7;
							sl.idle = set.alert !== null && d2 < 2.2 && rnd(sl) < .5 ? set.alert : set.sit;
						}
					}
			}
			if (sl.mv) {
				const ph = sl.ph;
				if (sl.air) {
					const f = ph - Math.floor(ph);
					if (f < .76) {
						pose = set.air || set.walk[0];
						lift = Math.sin(f / .76 * PI) * sp.hop;
						rock = (.38 - f) * .25;
					} else pose = set.walk[0];
				} else {
					pose = set.walk[Math.floor(ph) & 1];
					const fast = sl.v > sp.speed * 1.8 ? 1.8 : 1;
					lift = Math.abs(Math.sin(ph * PI)) * sp.hop * fast;
					rock = Math.sin(ph * PI) * sp.rock;
				}
			} else if (sl.st === ST_IDLE && pose !== set.sleep) rock += Math.sin(clock * 1.1 + i * 2.3) * .012;
			sl.rock = rock;
			sl.lift = lift;
			sl.faceK += (sl.face - sl.faceK) * flipK;
			write(sl, pose);
		}
		live = nLive;
		shown = nShown;
		followers = nFollow;
		mesh.instanceMatrix.needsUpdate = true;
		rectAttr.needsUpdate = true;
	}
	return {
		/** Resolves (true / false) when the sprite sheet is in. Never rejects. */
		ready,
		mesh,
		update,
		/** Deterministic stills: every animal of the cells in range stands at its own spot, shown where its tile stands. */
		settle() {
			if (!loaded) return;
			for (let i = 0; i < N; i++) if (slots[i].live) release(slots[i]);
			followers = 0;
			night = !!(daynight && daynight.night);
			rescan();
			comp = null;
			compWait = C.companion && C.companion.after || 5;
			compSearch = 0;
			const K = C.companion;
			const p = traveller.position;
			if (K && K.enabled !== false && K.stills !== false && settledAt(p.x, p.z)) spawnCompanion(p, 0, 1, true);
			for (let i = 0; i < N; i++) {
				const sl = slots[i];
				if (sl.live) sl.s = sl.st === ST_FOLLOW || riseAt(sl.x, sl.z) >= C.riseAt ? 1 : 0;
			}
			update(0);
		},
		dispose() {
			disposed = true;
			scene.remove(mesh);
			geo.dispose();
			mat.dispose();
			depthMat.dispose();
			if (tex) tex.dispose();
			mesh.dispose();
		},
		/** Slots in use / drawn right now / walking with the traveller / ever spawned. */
		stats() {
			return {
				loaded,
				pool: N,
				live,
				shown,
				followers,
				spawned,
				cells: cache.size,
				art: artNames.length,
				companion: comp !== null,
				companionAt: compSeen,
				companionLeft: compLeft
			};
		},
		/** Debug: every live animal: { id, art, x, y, z, state, pose, shown, mode, home }. Allocates. */
		list() {
			const out = [];
			for (let i = 0; i < N; i++) {
				const sl = slots[i];
				if (!sl.live) continue;
				out.push({
					slot: i,
					id: sl.spec.id,
					art: sl.set.art,
					x: sl.x,
					y: sl.y + sl.lift,
					z: sl.z,
					state: ST_NAMES[sl.st],
					pose: sl.mv ? "moving" : sl.idle ? sl.idle.name : "",
					shown: sl.s > .5,
					s: sl.s,
					mode: sl.mode,
					face: sl.face,
					hx: sl.hx,
					hz: sl.hz,
					cool: sl.cool,
					chain: sl.spec.lead !== null,
					comp: sl.comp,
					vig: VIG_NAMES[sl.spec.vig | 0],
					nap: sl.nap
				});
			}
			return out;
		},
		/** Debug: what the rule puts on the cells of a square window: [{ id, x, z, when, mode, cx, cz, model }]. */
		debugCells(cx, cz, r = 4) {
			const out = [];
			if (!loaded) return out;
			for (let z = cz - r; z <= cz + r; z++) for (let x = cx - r; x <= cx + r; x++) {
				const cell = world.tileAt(x, z);
				for (const sc of specsFor(x, z)) out.push({
					id: sc.id,
					x: sc.x,
					y: sc.y,
					z: sc.z,
					when: sc.when,
					mode: sc.mode,
					vig: VIG_NAMES[sc.vig | 0],
					cx: x,
					cz: z,
					model: cell.model,
					biome: cell.biome
				});
			}
			return out;
		},
		debugPerches(model) {
			return perchesFor(model).slice();
		},
		/** Debug: the pieces a vignette can anchor to: [{ name, x, z, hx, hz, top }] in tile space (rot 0; parity = rot & 1). */
		debugPieces(model, parity = 0) {
			return piecesFor(model, parity).map((q) => ({ ...q }));
		},
		/** Debug: force the rule cache to be rebuilt (after editing CONFIG.animals.spawns / density live). */
		refresh() {
			cache.clear();
			pieceCache.clear();
			for (let i = 0; i < N; i++) if (slots[i].live) release(slots[i]);
			comp = null;
			compSeen = -1;
			compSearch = 0;
			compWait = C.companion && C.companion.after || 5;
			dirty = true;
		}
	};
}
// src/game/progress.js
var blank = () => ({
	cells: {},
	scraps: {},
	scrapCounts: {},
	lanterns: {}
});
function createProgress({ seed = 0, persist = true } = {}) {
	const KEY = "popup-atlas:v1:" + seed;
	let data = blank();
	if (persist) try {
		const raw = localStorage.getItem(KEY);
		if (raw) {
			const old = JSON.parse(raw);
			if (old && typeof old === "object") {
				for (const k in data) if (old[k] && typeof old[k] === "object") data[k] = old[k];
			}
		}
		localStorage.removeItem(KEY + ":stamps");
	} catch {}
	let dirty = false;
	let timer = 0;
	function save() {
		timer = 0;
		if (!persist || !dirty) return;
		dirty = false;
		try {
			localStorage.setItem(KEY, JSON.stringify(data));
		} catch {}
	}
	function touch() {
		dirty = true;
		if (persist && !timer) timer = setTimeout(save, 1500);
	}
	if (persist && typeof window !== "undefined") {
		window.addEventListener("pagehide", save);
		document.addEventListener("visibilitychange", () => {
			if (document.hidden) save();
		});
	}
	const ck = (cx, cz) => cx + "," + cz;
	const api = {
		persist,
		/** Mark a cell as walked. @returns true if new */
		explore(cx, cz, biome) {
			const k = ck(cx, cz);
			if (data.cells[k]) return false;
			data.cells[k] = biome || 1;
			touch();
			bus.emit("game:explore", {
				cx,
				cz,
				biome,
				count: Object.keys(data.cells).length
			});
			return true;
		},
		explored(cx, cz) {
			return !!data.cells[ck(cx, cz)];
		},
		/** Biome id stored for an explored cell, or null. */
		cellBiome(cx, cz) {
			const v = data.cells[ck(cx, cz)];
			return typeof v === "string" ? v : null;
		},
		/** Iterate explored cells: fn(cx, cz, biome). */
		eachCell(fn) {
			for (const k in data.cells) {
				const i = k.indexOf(",");
				fn(+k.slice(0, i), +k.slice(i + 1), data.cells[k]);
			}
		},
		cellCount() {
			return Object.keys(data.cells).length;
		},
		/** Pick up a scrap. key = unique per placed scrap (e.g. "cx,cz,i"). @returns true if new */
		collect(key, kind, x, z) {
			if (data.scraps[key]) return false;
			data.scraps[key] = kind;
			data.scrapCounts[kind] = (data.scrapCounts[kind] || 0) + 1;
			touch();
			bus.emit("game:collect", {
				kind,
				key,
				x,
				z,
				count: data.scrapCounts[kind]
			});
			return true;
		},
		collected(key) {
			return !!data.scraps[key];
		},
		scrapCount(kind) {
			return kind ? data.scrapCounts[kind] || 0 : Object.keys(data.scraps).length;
		},
		/** Light a lamp for good. key = unique per lamp (e.g. "cx,cz" or "cx,cz,node"). @returns true if new */
		light(key, x, z) {
			if (data.lanterns[key]) return false;
			data.lanterns[key] = 1;
			touch();
			bus.emit("game:lantern", {
				key,
				x,
				z,
				count: Object.keys(data.lanterns).length
			});
			return true;
		},
		lit(key) {
			return !!data.lanterns[key];
		},
		lanternCount() {
			return Object.keys(data.lanterns).length;
		},
		/** Plain summary for the atlas page / debugging. */
		summary() {
			return {
				cells: api.cellCount(),
				scraps: { ...data.scrapCounts },
				lanterns: api.lanternCount()
			};
		},
		save,
		reset() {
			data = blank();
			dirty = true;
			save();
			bus.emit("game:reset", {});
		}
	};
	return api;
}
// src/game/catalog.js
var SCRAPS = {
	leaf: {
		biome: "heartland",
		name: "Pressed leaf"
	},
	shell: {
		biome: "desert",
		name: "Fossil shell"
	},
	snowflake: {
		biome: "snow",
		name: "Paper snowflake"
	},
	petal: {
		biome: "blossom",
		name: "Pressed blossom"
	},
	feather: {
		biome: "pinewood",
		name: "Owl feather"
	},
	star: {
		biome: null,
		name: "Paper star",
		night: true
	}
};
var SCRAP_IDS = Object.keys(SCRAPS);
// src/game/scraps.js
var DEFAULTS$2 = {
	density: .24,
	starDensity: .055,
	size: .21,
	starSize: .22,
	tilt: .62,
	rock: .13,
	rockSpeed: 1.7,
	turn: .42,
	turnSpeed: .8,
	bob: .012,
	pickRadius: .3,
	minClearance: .2,
	openClearance: .3,
	propMargin: .1,
	openOnly: true,
	spread: .72,
	range: 6.5,
	nearRadius: 2.3,
	riseDelay: .38,
	popRate: 7,
	hideRate: 9,
	pickTime: .7,
	pickHop: .5,
	pickLift: .62,
	pickSpin: 2.5,
	flourishEvery: 10,
	flourishCount: 8,
	flourishRadius: .62,
	flourishTime: .95,
	glint: .4,
	glintPeriod: 3.4,
	dayLift: .06,
	nightLift: .3,
	flyLift: .4,
	starGlow: .85,
	pool: 56
};
var TAU$1 = Math.PI * 2;
var COLS = 4;
var ROWS = 2;
var CELL = 128;
var TAB_CELL = 6;
var FREE = 0;
var IDLE = 1;
var PICK = 2;
var FX = 3;
var cellKey = (cx, cz) => (cx + 32768) * 65536 + (cz + 32768);
function star(g, n, r0, r1, rot = -Math.PI / 2) {
	g.beginPath();
	for (let i = 0; i < n * 2; i++) {
		const a = rot + i * Math.PI / n;
		const r = i % 2 ? r1 : r0;
		if (i) g.lineTo(Math.cos(a) * r, Math.sin(a) * r);
		else g.moveTo(Math.cos(a) * r, Math.sin(a) * r);
	}
	g.closePath();
}
function poly(g, p) {
	g.beginPath();
	g.moveTo(p[0], p[1]);
	for (let i = 2; i < p.length; i += 2) g.lineTo(p[i], p[i + 1]);
	g.closePath();
}
/** Procedural fallback shapes, drawn in a [-1, 1] box (y down). `edge` = the cut paper core around the shape. */
var DRAW = {
	leaf(g, P) {
		const pts = [
			0,
			-.95,
			.26,
			-.5,
			.74,
			-.62,
			.6,
			-.14,
			.94,
			.12,
			.5,
			.3,
			.56,
			.62,
			.14,
			.48,
			.05,
			.62,
			-.05,
			.62,
			-.14,
			.48,
			-.56,
			.62,
			-.5,
			.3,
			-.94,
			.12,
			-.6,
			-.14,
			-.74,
			-.62,
			-.26,
			-.5
		];
		g.lineJoin = "round";
		g.fillStyle = P.cutEdge;
		g.strokeStyle = P.cutEdge;
		g.lineWidth = .16;
		poly(g, pts);
		g.fill();
		g.stroke();
		g.fillStyle = P.terracotta;
		poly(g, pts);
		g.fill();
		g.fillStyle = P.cutEdge;
		g.fillRect(-.06, .5, .12, .46);
		g.fillStyle = P.brown;
		g.fillRect(-.035, .5, .07, .42);
		g.strokeStyle = P.ochre;
		g.lineWidth = .06;
		g.lineCap = "round";
		g.beginPath();
		g.moveTo(0, .5);
		g.lineTo(0, -.7);
		g.moveTo(0, .2);
		g.lineTo(.55, -.3);
		g.moveTo(0, .2);
		g.lineTo(-.55, -.3);
		g.moveTo(0, .34);
		g.lineTo(.6, .2);
		g.moveTo(0, .34);
		g.lineTo(-.6, .2);
		g.stroke();
	},
	shell(g, P) {
		g.fillStyle = P.cutEdge;
		g.beginPath();
		g.arc(0, 0, .94, 0, TAU$1);
		g.fill();
		g.fillStyle = P.kraft;
		g.beginPath();
		g.arc(0, 0, .82, 0, TAU$1);
		g.fill();
		g.fillStyle = P.paper;
		g.beginPath();
		g.arc(-.06, -.06, .68, 0, TAU$1);
		g.fill();
		g.strokeStyle = P.brown;
		g.lineWidth = .1;
		g.lineCap = "round";
		g.beginPath();
		for (let a = 0; a <= 15.2; a += .15) {
			const r = .05 + a * .048;
			const x = Math.cos(a) * r;
			const y = Math.sin(a) * r;
			if (a === 0) g.moveTo(x, y);
			else g.lineTo(x, y);
		}
		g.stroke();
		g.lineWidth = .05;
		g.strokeStyle = P.terracotta;
		g.beginPath();
		for (let i = 0; i < 9; i++) {
			const a = 9.6 + i * .62;
			const r = .05 + a * .048;
			g.moveTo(Math.cos(a) * (r + .02), Math.sin(a) * (r + .02));
			g.lineTo(Math.cos(a) * (r + .17), Math.sin(a) * (r + .17));
		}
		g.stroke();
	},
	snowflake(g, P) {
		const arms = (w, col) => {
			g.strokeStyle = col;
			g.lineWidth = w;
			g.lineCap = "round";
			g.beginPath();
			for (let i = 0; i < 6; i++) {
				const a = i * Math.PI / 3 - Math.PI / 2;
				const c = Math.cos(a);
				const s = Math.sin(a);
				g.moveTo(0, 0);
				g.lineTo(c * .82, s * .82);
				for (const [d, l] of [[.42, .26], [.64, .18]]) for (const sg of [-1, 1]) {
					const b = a + sg * 1;
					g.moveTo(c * d, s * d);
					g.lineTo(c * d + Math.cos(b) * l, s * d + Math.sin(b) * l);
				}
			}
			g.stroke();
		};
		arms(.3, P.teal);
		arms(.2, "#cfe1ee");
		arms(.1, "#ffffff");
		g.fillStyle = P.teal;
		star(g, 6, .26, .15);
		g.fill();
		g.fillStyle = "#ffffff";
		star(g, 6, .17, .1);
		g.fill();
	},
	petal(g, P) {
		const petals = (r, rx, ry, col) => {
			g.fillStyle = col;
			for (let i = 0; i < 5; i++) {
				const a = i * TAU$1 / 5 - Math.PI / 2;
				g.beginPath();
				g.ellipse(Math.cos(a) * r, Math.sin(a) * r, rx, ry, a, 0, TAU$1);
				g.fill();
			}
		};
		petals(.5, .48, .38, P.cutEdge);
		petals(.5, .4, .3, "#f29db4");
		petals(.42, .24, .15, "#fbd3dc");
		g.fillStyle = P.rust;
		g.beginPath();
		g.arc(0, 0, .2, 0, TAU$1);
		g.fill();
		g.fillStyle = P.ochre;
		g.beginPath();
		g.arc(0, 0, .13, 0, TAU$1);
		g.fill();
	},
	feather(g, P) {
		g.save();
		g.rotate(.5);
		g.fillStyle = P.cutEdge;
		g.beginPath();
		g.ellipse(0, -.12, .42, .84, 0, 0, TAU$1);
		g.fill();
		g.fillRect(-.07, .5, .14, .48);
		g.fillStyle = P.brown;
		g.beginPath();
		g.ellipse(0, -.12, .33, .75, 0, 0, TAU$1);
		g.fill();
		g.save();
		g.beginPath();
		g.ellipse(0, -.12, .33, .75, 0, 0, TAU$1);
		g.clip();
		g.strokeStyle = P.paper;
		g.lineWidth = .11;
		for (let y = -.7; y < .7; y += .3) {
			g.beginPath();
			g.moveTo(-.5, y + .22);
			g.lineTo(0, y);
			g.lineTo(.5, y + .22);
			g.stroke();
		}
		g.restore();
		g.strokeStyle = P.ochre;
		g.lineWidth = .055;
		g.lineCap = "round";
		g.beginPath();
		g.moveTo(0, -.8);
		g.lineTo(0, .92);
		g.stroke();
		g.restore();
	},
	star(g, P) {
		g.lineJoin = "round";
		g.fillStyle = P.cutEdge;
		star(g, 5, .98, .46);
		g.fill();
		g.fillStyle = P.lantern;
		star(g, 5, .84, .37);
		g.fill();
		g.fillStyle = P.ochre;
		g.globalAlpha = .55;
		for (let i = 0; i < 5; i++) {
			const a = -Math.PI / 2 + i * TAU$1 / 5;
			const b = a + Math.PI / 5;
			g.beginPath();
			g.moveTo(0, 0);
			g.lineTo(Math.cos(a) * .84, Math.sin(a) * .84);
			g.lineTo(Math.cos(b) * .37, Math.sin(b) * .37);
			g.closePath();
			g.fill();
		}
		g.globalAlpha = 1;
	}
};
/** Named pixel rect [x, y, w, h] (top-down) from a game_icons.json of any of the usual shapes, or null. */
function iconRect(json, name, iw, ih) {
	if (!json) return null;
	const table = json.sprites || json.cells || json.icons || json.frames || json;
	let e = table && table[name];
	if (!e && Array.isArray(json.names)) {
		const i = json.names.indexOf(name);
		const cols = json.cols || json.grid && json.grid[0];
		const rows = json.rows || json.grid && json.grid[1];
		if (i >= 0 && cols && rows) {
			const w = iw / cols;
			const h = ih / rows;
			return [
				i % cols * w,
				Math.floor(i / cols) * h,
				w,
				h
			];
		}
	}
	if (!e) return null;
	if (e.rect) e = e.rect;
	else if (e.frame) e = e.frame;
	let r = Array.isArray(e) ? e : e.x !== void 0 ? [
		e.x,
		e.y,
		e.w ?? e.width,
		e.h ?? e.height
	] : null;
	if (!r || r.length < 4 || !(r[2] > 0) || !(r[3] > 0)) return null;
	if (r[0] <= 1 && r[1] <= 1 && r[2] <= 1 && r[3] <= 1) r = [
		r[0] * iw,
		r[1] * ih,
		r[2] * iw,
		r[3] * ih
	];
	return r;
}
function makeAtlas() {
	const P = CONFIG.palette;
	const W = 512;
	const H = 256;
	const cv = document.createElement("canvas");
	cv.width = W;
	cv.height = H;
	const g = cv.getContext("2d", { willReadFrequently: true });
	const px = new Uint8Array(W * H * 4);
	const tex = new DataTexture(px, W, H, RGBAFormat);
	tex.colorSpace = SRGBColorSpace;
	tex.magFilter = LinearFilter;
	tex.minFilter = LinearMipmapLinearFilter;
	tex.generateMipmaps = true;
	tex.anisotropy = 4;
	const origin = (c) => [c % COLS * CELL, Math.floor(c / COLS) * CELL];
	function drawFallback(c, kind) {
		const [x, y] = origin(c);
		g.clearRect(x, y, CELL, CELL);
		g.save();
		g.beginPath();
		g.rect(x, y, CELL, CELL);
		g.clip();
		g.translate(x + CELL / 2, y + CELL / 2);
		g.scale(CELL * .45, CELL * .45);
		DRAW[kind](g, P);
		g.restore();
	}
	function drawIcon(c, img, r, backing) {
		const [x, y] = origin(c);
		const box = CELL - CELL * .05 * 2;
		const k = Math.min(box / r[2], box / r[3]);
		g.clearRect(x, y, CELL, CELL);
		g.imageSmoothingQuality = "high";
		const dx = x + (CELL - r[2] * k) / 2;
		const dy = y + (CELL - r[3] * k) / 2;
		if (backing) {
			const o = document.createElement("canvas");
			o.width = CELL;
			o.height = CELL;
			const og = o.getContext("2d");
			og.imageSmoothingQuality = "high";
			og.drawImage(img, r[0], r[1], r[2], r[3], dx - x, dy - y, r[2] * k, r[3] * k);
			og.globalCompositeOperation = "source-in";
			og.fillStyle = backing;
			og.fillRect(0, 0, CELL, CELL);
			const rim = CELL * .035;
			g.save();
			g.beginPath();
			g.rect(x, y, CELL, CELL);
			g.clip();
			for (let i = 0; i < 12; i++) g.drawImage(o, x + Math.cos(i / 12 * TAU$1) * rim, y + Math.sin(i / 12 * TAU$1) * rim);
			g.restore();
		}
		g.drawImage(img, r[0], r[1], r[2], r[3], dx, dy, r[2] * k, r[3] * k);
	}
	/** Canvas -> texture (rows flipped: v up). Transparent pixels take the cell's mean colour so mips do not darken the rim. */
	function upload() {
		const src = g.getImageData(0, 0, W, H).data;
		for (let c = 0; c < 8; c++) {
			const [ox, oy] = origin(c);
			let r = 0;
			let gg = 0;
			let b = 0;
			let n = 0;
			for (let y = oy; y < oy + CELL; y++) for (let x = ox; x < ox + CELL; x++) {
				const s = (y * W + x) * 4;
				if (src[s + 3] > 200) {
					r += src[s];
					gg += src[s + 1];
					b += src[s + 2];
					n++;
				}
			}
			if (n) {
				r /= n;
				gg /= n;
				b /= n;
			} else r = gg = b = 255;
			for (let y = oy; y < oy + CELL; y++) for (let x = ox; x < ox + CELL; x++) {
				const s = (y * W + x) * 4;
				const d = ((255 - y) * W + x) * 4;
				const a = src[s + 3];
				if (a < 8) {
					px[d] = r;
					px[d + 1] = gg;
					px[d + 2] = b;
					px[d + 3] = 0;
				} else {
					px[d] = src[s];
					px[d + 1] = src[s + 1];
					px[d + 2] = src[s + 2];
					px[d + 3] = a;
				}
			}
		}
		tex.needsUpdate = true;
	}
	SCRAP_IDS.forEach((kind, i) => {
		if (DRAW[kind]) drawFallback(i, kind);
	});
	{
		const [x, y] = origin(TAB_CELL);
		g.fillStyle = P.cutEdge;
		g.fillRect(x, y, CELL, CELL);
	}
	upload();
	let art = false;
	/** Replace the drawn shapes by the art icons named "scrap_<kind>" (any that exist). */
	function useIcons(img, json) {
		let n = 0;
		SCRAP_IDS.forEach((kind, i) => {
			const r = iconRect(json, "scrap_" + kind, img.naturalWidth || img.width, img.naturalHeight || img.height);
			if (r) {
				drawIcon(i, img, r, kind === "snowflake" ? "#5f86b4" : null);
				n++;
			}
		});
		if (n) {
			upload();
			art = true;
		}
		return n;
	}
	return {
		tex,
		useIcons,
		get art() {
			return art;
		}
	};
}
function pieceGeometry() {
	const geo = new BufferGeometry();
	const pos = [
		-.5,
		.12,
		0,
		.5,
		.12,
		0,
		.5,
		1.12,
		0,
		-.5,
		1.12,
		0,
		-.06,
		0,
		-.012,
		.06,
		0,
		-.012,
		.06,
		.34,
		-.012,
		-.06,
		.34,
		-.012
	];
	const nor = [
		0,
		0,
		1,
		0,
		0,
		1,
		0,
		0,
		1,
		0,
		0,
		1,
		0,
		0,
		1,
		0,
		0,
		1,
		0,
		0,
		1,
		0,
		0,
		1
	];
	const uv = [
		0,
		0,
		1,
		0,
		1,
		1,
		0,
		1,
		0,
		0,
		1,
		0,
		1,
		1,
		0,
		1
	];
	const part = [
		1,
		0,
		1,
		0,
		1,
		0,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1
	];
	const idx = [
		0,
		1,
		2,
		0,
		2,
		3,
		4,
		5,
		6,
		4,
		6,
		7
	];
	const TAB_N = 8;
	const TAB_R = .36;
	for (let i = 0; i < TAB_N; i++) {
		const a = (i + .5) / TAB_N * TAU$1;
		pos.push(Math.cos(a) * TAB_R, .012, -.1 + Math.sin(a) * TAB_R * .92);
		nor.push(0, 1, 0);
		uv.push(.5, .5);
		part.push(0, 1);
	}
	for (let i = 1; i < 7; i++) idx.push(8, 8 + i + 1, 8 + i);
	geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
	geo.setAttribute("normal", new Float32BufferAttribute(nor, 3));
	geo.setAttribute("uv", new Float32BufferAttribute(uv, 2));
	geo.setAttribute("aPart", new Float32BufferAttribute(part, 2));
	geo.setIndex(idx);
	return geo;
}
var TRIS_PER_PIECE = 10;
var _box = new Box3();
var _m = new Matrix4();
var _l = new Matrix4();
/** [minX, minZ, maxX, maxZ, top, ...] of every standing piece of a tile prototype, in tile space (rot 0). */
function propBoxes(proto, world, model, parity) {
	const out = [];
	if (!proto) return out;
	const list = [];
	proto.traverse((o) => {
		if (o.isMesh && o.geometry && !/^base/i.test(o.name || "") && o.geometry.getAttribute("position")) list.push(o);
	});
	const sp = world && world.standSpecs && CONFIG.world.cards && CONFIG.world.cards.collide !== false ? world.standSpecs(model, proto, list) : null;
	list.forEach((o, li) => {
		if (sp && sp.thin[li] === 1) return;
		const pos = o.geometry.getAttribute("position");
		_m.identity();
		for (let a = o; a && a !== proto; a = a.parent) {
			_l.compose(a.position, a.quaternion, a.scale);
			_m.premultiply(_l);
		}
		if (sp) world.standFix(sp, li, parity, _m);
		_box.setFromBufferAttribute(pos);
		const e = _m.elements;
		const sx = _box.max.x - _box.min.x, sy = _box.max.y - _box.min.y, sz = _box.max.z - _box.min.z;
		const cx = (_box.min.x + _box.max.x) / 2, cy = (_box.min.y + _box.max.y) / 2, cz = (_box.min.z + _box.max.z) / 2;
		const px = e[0] * cx + e[4] * cy + e[8] * cz + e[12], pz = e[2] * cx + e[6] * cy + e[10] * cz + e[14];
		const hx = [
			e[0] * sx,
			e[4] * sy,
			e[8] * sz
		], hz = [
			e[2] * sx,
			e[6] * sy,
			e[10] * sz
		];
		let j = 0;
		for (let i = 1; i < 3; i++) if (hx[i] * hx[i] + hz[i] * hz[i] > hx[j] * hx[j] + hz[j] * hz[j]) j = i;
		const len = Math.hypot(hx[j], hz[j]) || 1e-6;
		let thick = 0;
		for (let i = 0; i < 3; i++) if (i !== j) thick += Math.abs(hx[i] * hz[j] - hz[i] * hx[j]) / len;
		_box.applyMatrix4(_m);
		if (_box.max.y < .07) return;
		out.push(_box.min.x, _box.min.z, _box.max.x, _box.max.z, _box.max.y, px - hx[j] / 2, pz - hz[j] / 2, px + hx[j] / 2, pz + hz[j] / 2, thick / 2);
	});
	return out;
}
function createScraps(ctx) {
	const { scene, world, traveller, progress, daynight, seed = 0 } = ctx;
	const section = CONFIG.game && CONFIG.game.scraps || game && game.scraps || null;
	const S = section ? Object.assign(section, {
		...DEFAULTS$2,
		...section
	}) : { ...DEFAULTS$2 };
	const N = Math.max(16, S.pool | 0);
	const HASH_A = ((seed | 0) ^ 6048401) >>> 0;
	const HASH_B = ((seed | 0) ^ 461845907) >>> 0;
	const KIND_OF_BIOME = {};
	for (const id of SCRAP_IDS) if (SCRAPS[id].biome) KIND_OF_BIOME[SCRAPS[id].biome] = id;
	const KIND_INDEX = {};
	SCRAP_IDS.forEach((id, i) => {
		KIND_INDEX[id] = i;
	});
	const atlas = makeAtlas();
	const fx = { value: new Vector4(0, S.glint, 0, 0) };
	const tabUv = new Vector2(2.5 / COLS, 1 - (Math.floor(TAB_CELL / COLS) + .5) / ROWS);
	const mat = new MeshLambertMaterial({
		map: atlas.tex,
		side: 2,
		alphaTest: .5
	});
	mat.onBeforeCompile = (shader) => {
		shader.uniforms.uScrapFx = fx;
		shader.uniforms.uScrapTab = { value: tabUv };
		shader.vertexShader = shader.vertexShader.replace("#include <common>", `#include <common>
attribute vec4 aRect; attribute vec4 aAnim; attribute vec2 aPart;
uniform vec2 uScrapTab;
varying vec4 vScrap; varying float vScrapFly;
vec3 scrapBend( vec3 p ) {
  float sr = sin( aAnim.x ), cr = cos( aAnim.x ), st = sin( aAnim.y ), ct = cos( aAnim.y );
  vec3 q = vec3( p.x * cr - p.y * sr, p.x * sr + p.y * cr, p.z );
  return vec3( q.x, q.y * ct + q.z * st, -q.y * st + q.z * ct );
}`).replace("#include <uv_vertex>", "#include <uv_vertex>\n	vMapUv = mix( aRect.xy + uv * aRect.zw, uScrapTab, aPart.y );\n	vScrap = vec4( uv, abs( aAnim.z ) * ( 1.0 - aPart.y ), aAnim.w );\n	vScrapFly = step( aAnim.z, 0.0 );").replace("#include <beginnormal_vertex>", "#include <beginnormal_vertex>\n	if ( aPart.x > 0.5 ) objectNormal = scrapBend( objectNormal );").replace("#include <begin_vertex>", "#include <begin_vertex>\n	if ( aPart.y > 0.5 && aAnim.z < 0.0 ) transformed = vec3( 0.0 ); // flying piece (negative glow): no strut, no tab\n	if ( aPart.x > 0.5 ) transformed = scrapBend( transformed );");
		shader.fragmentShader = shader.fragmentShader.replace("#include <common>", "#include <common>\nuniform vec4 uScrapFx;\nvarying vec4 vScrap; varying float vScrapFly;").replace("#include <emissivemap_fragment>", `#include <emissivemap_fragment>
	{
		float sweep = fract( uScrapFx.x + vScrap.w ) * 4.0 - 1.0;
		float band = smoothstep( 0.2, 0.0, abs( ( vScrap.x + vScrap.y ) * 0.5 - sweep ) );
		float card = step( 0.0001, vScrap.z );
		totalEmissiveRadiance += diffuseColor.rgb * ( ( band * uScrapFx.y + uScrapFx.z + uScrapFx.w * vScrapFly ) * card + max( 0.0, vScrap.z - 1.0 ) );
	}`);
	};
	mat.customProgramCacheKey = () => "game-scraps";
	const geo = pieceGeometry();
	const rectArr = new Float32Array(N * 4);
	const animArr = new Float32Array(N * 4);
	const rectAttr = new InstancedBufferAttribute(rectArr, 4);
	const animAttr = new InstancedBufferAttribute(animArr, 4);
	animAttr.setUsage(DynamicDrawUsage);
	geo.setAttribute("aRect", rectAttr);
	geo.setAttribute("aAnim", animAttr);
	const mesh = new InstancedMesh(geo, mat, N);
	mesh.name = "game_scraps";
	mesh.instanceMatrix.setUsage(DynamicDrawUsage);
	mesh.frustumCulled = false;
	mesh.castShadow = false;
	mesh.receiveShadow = true;
	const M = mesh.instanceMatrix.array;
	M.fill(0);
	for (let i = 0; i < N; i++) M[i * 16 + 15] = 1;
	scene.add(mesh);
	let disposed = false;
	(async () => {
		try {
			const res = await fetch("./textures/art/game_icons.json");
			if (!res.ok) return;
			const json = await res.json();
			const img = new Image();
			img.onload = () => {
				if (!disposed) atlas.useIcons(img, json);
			};
			img.src = "./textures/art/" + (json.image || json.file || "game_icons.png");
		} catch {}
	})();
	const boxCache = /* @__PURE__ */ new Map();
	function boxesFor(model, parity) {
		const key = parity ? model + "/1" : model;
		let b = boxCache.get(key);
		if (b === void 0) {
			b = null;
			try {
				if (ctx.assets && ctx.assets.getTilePrototype) b = propBoxes(ctx.assets.getTilePrototype(model), world, model, parity);
			} catch {
				b = null;
			}
			boxCache.set(key, b);
		}
		return b;
	}
	const defs = /* @__PURE__ */ new Map();
	function defAt(cx, cz) {
		const k = cellKey(cx, cz);
		let d = defs.get(k);
		if (d !== void 0) return d;
		d = null;
		const h = hash2f(cx, cz, HASH_A);
		let kind = null;
		if (h < S.density) kind = KIND_OF_BIOME[biomeAt(seed, cx, cz)] || null;
		else if (h < S.density + S.starDensity) kind = "star";
		if (kind) {
			const cell = world.tileAt(cx, cz);
			const boxes = cell ? boxesFor(cell.model, (cell.rot || 0) & 1) : null;
			const th = cell ? rotToY(cell.rot || 0) : 0;
			const co = Math.cos(th);
			const si = Math.sin(th);
			for (let i = 0; i < (S.openOnly ? 24 : 48) && !d; i++) {
				const pass = i < 24 ? 0 : i < 36 ? 1 : 2;
				const ox = (hash2f(cx * 3 + 1, cz * 3 + i * 7, HASH_B) - .5) * 2 * S.spread;
				const oz = (hash2f(cx * 3 + i * 5, cz * 3 + 1, HASH_B + 17) - .5) * 2 * S.spread;
				const x = cx * TILE_SIZE + ox;
				const z = cz * TILE_SIZE + oz;
				const surf = world.surfaceAt(x, z);
				if (surf !== "grass" && surf !== "path") continue;
				if (world.clearance(x, z) < (pass === 0 ? S.openClearance : S.minClearance)) continue;
				if (pass < 2 && boxes) {
					const u = ox * co - oz * si;
					const v = ox * si + oz * co;
					let hit = false;
					for (let k = 0; k < boxes.length && !hit; k += 10) {
						const m = (pass === 0 ? S.propMargin + Math.min(.4, boxes[k + 4] * .5) : S.propMargin) + boxes[k + 9];
						const sx = boxes[k + 7] - boxes[k + 5];
						const sz = boxes[k + 8] - boxes[k + 6];
						const tt = Math.max(0, Math.min(1, ((u - boxes[k + 5]) * sx + (v - boxes[k + 6]) * sz) / (sx * sx + sz * sz || 1e-9)));
						const qx = u - boxes[k + 5] - sx * tt;
						const qz = v - boxes[k + 6] - sz * tt;
						hit = qx * qx + qz * qz < m * m;
						if (!hit && pass === 0 && boxes[k + 4] > .45) {
							const ax = boxes[k] * co + boxes[k + 1] * si;
							const az = -boxes[k] * si + boxes[k + 1] * co;
							const bx = boxes[k + 2] * co + boxes[k + 3] * si;
							const bz = -boxes[k + 2] * si + boxes[k + 3] * co;
							const hide = Math.min(1.1, boxes[k + 4] * .85);
							hit = ox > Math.min(ax, bx) - .12 && ox < Math.max(ax, bx) + .12 && oz < Math.max(az, bz) && oz > Math.min(az, bz) - hide;
						}
					}
					if (hit) continue;
				}
				d = {
					key: cx + "," + cz,
					kind,
					cx,
					cz,
					x,
					y: world.heightAt(x, z),
					z,
					gone: false
				};
			}
		}
		if (defs.size > 6e3) defs.clear();
		defs.set(k, d);
		return d;
	}
	const slots = [];
	for (let i = 0; i < N; i++) slots.push({
		i,
		state: FREE,
		def: null,
		ck: 0,
		kind: 0,
		x: 0,
		y: 0,
		z: 0,
		s: 0,
		delay: 0,
		t: 0,
		ph: 0,
		ang: 0,
		size: S.size,
		seen: 0,
		stale: false
	});
	const byCell = /* @__PURE__ */ new Map();
	const risen = /* @__PURE__ */ new Map();
	let scanId = 0;
	let lastCx = NaN;
	let lastCz = NaN;
	let dirty = true;
	let night = !!(daynight && daynight.night);
	let nightK = night ? 1 : 0;
	let clock = 0;
	let live = 0;
	function setKind(sl, kind) {
		const c = KIND_INDEX[kind] || 0;
		const o = sl.i * 4;
		const e = .5 / 512;
		rectArr[o] = c % COLS / COLS + e;
		rectArr[o + 1] = 1 - (Math.floor(c / COLS) + 1) / ROWS + e;
		rectArr[o + 2] = 1 / COLS - 2 * e;
		rectArr[o + 3] = 1 / ROWS - 2 * e;
		rectAttr.needsUpdate = true;
		sl.kind = kind;
		sl.size = kind === "star" ? S.starSize : S.size;
	}
	function freeSlot() {
		for (let i = 0; i < N; i++) if (slots[i].state === FREE) return slots[i];
		return null;
	}
	function release(sl) {
		if (sl.state === IDLE && byCell.get(sl.ck) === sl) byCell.delete(sl.ck);
		sl.state = FREE;
		sl.def = null;
		sl.s = 0;
		const o = sl.i * 16;
		M[o] = M[o + 2] = M[o + 5] = M[o + 8] = M[o + 10] = 0;
	}
	function write(sl, x, y, z, yaw, scale, roll, tilt, glow) {
		const o = sl.i * 16;
		const c = Math.cos(yaw) * scale;
		const sn = Math.sin(yaw) * scale;
		M[o] = c;
		M[o + 2] = -sn;
		M[o + 5] = scale;
		M[o + 8] = sn;
		M[o + 10] = c;
		M[o + 12] = x;
		M[o + 13] = y;
		M[o + 14] = z;
		const a = sl.i * 4;
		animArr[a] = roll;
		animArr[a + 1] = tilt;
		animArr[a + 2] = glow;
		animArr[a + 3] = sl.ph;
	}
	const onRise = (e) => {
		const k = cellKey(e.x, e.z);
		risen.set(k, 1);
		const sl = byCell.get(k);
		if (sl && sl.s <= 0) sl.delay = S.riseDelay;
	};
	const onFlat = (e) => {
		risen.delete(cellKey(e.x, e.z));
	};
	const offs = [
		bus.on("tile:rise", onRise),
		bus.on("tile:flat", onFlat),
		bus.on("tile:despawn", onFlat),
		bus.on("game:reset", () => {
			defs.clear();
			dirty = true;
		})
	];
	/** Rebuild `risen` from the live tiles (settle / teleports snap folds without events). Allocates: not per frame. */
	function reconcile() {
		risen.clear();
		const tiles = world.activeTiles ? world.activeTiles() : [];
		for (let i = 0; i < tiles.length; i++) {
			const r = tiles[i];
			if (r.shown && r.fold && r.fold.target === 1) risen.set(cellKey(r.cx, r.cz), 1);
		}
	}
	/** Give every un-collected scrap in range a slot; mark the others stale (they shrink away, then free their slot). */
	function rescan() {
		dirty = false;
		scanId++;
		const p = traveller.position;
		const tcx = Math.round(p.x / TILE_SIZE);
		const tcz = Math.round(p.z / TILE_SIZE);
		lastCx = tcx;
		lastCz = tcz;
		const R = Math.ceil(S.range / TILE_SIZE);
		const r2 = S.range * S.range;
		for (let cz = tcz - R; cz <= tcz + R; cz++) for (let cx = tcx - R; cx <= tcx + R; cx++) {
			const d = defAt(cx, cz);
			if (d === null || d.gone) continue;
			if (d.kind === "star" && !night) continue;
			const dx = d.x - p.x;
			const dz = d.z - p.z;
			if (dx * dx + dz * dz > r2) continue;
			const k = cellKey(cx, cz);
			let sl = byCell.get(k);
			if (!sl) {
				if (progress.collected(d.key)) {
					d.gone = true;
					continue;
				}
				sl = freeSlot();
				if (!sl) continue;
				sl.state = IDLE;
				sl.def = d;
				sl.ck = k;
				sl.s = 0;
				sl.delay = 0;
				sl.t = 0;
				sl.x = d.x;
				sl.y = d.y;
				sl.z = d.z;
				sl.ph = hash2f(cx, cz, HASH_B + 3);
				setKind(sl, d.kind);
				byCell.set(k, sl);
			}
			sl.seen = scanId;
			sl.stale = false;
		}
		for (let i = 0; i < N; i++) {
			const sl = slots[i];
			if (sl.state === IDLE && sl.seen !== scanId) sl.stale = true;
		}
	}
	function pick(sl) {
		const d = sl.def;
		d.gone = true;
		byCell.delete(sl.ck);
		if (!progress.collect(d.key, d.kind, d.x, d.z)) {
			release(sl);
			return;
		}
		sl.state = PICK;
		sl.t = 0;
		if (ctx.music && ctx.music.chime) ctx.music.chime("scrap");
		const n = progress.scrapCount(d.kind);
		if (S.flourishEvery > 0 && n > 0 && n % S.flourishEvery === 0) for (let i = 0; i < S.flourishCount; i++) {
			const f = freeSlot();
			if (!f) break;
			f.state = FX;
			f.def = null;
			f.t = 0;
			f.x = d.x;
			f.y = d.y;
			f.z = d.z;
			f.ang = i / S.flourishCount * TAU$1 + .3;
			f.ph = i / S.flourishCount;
			setKind(f, d.kind);
		}
	}
	function update(dt) {
		clock += dt;
		const nowNight = !!(daynight && daynight.night);
		if (nowNight !== night) {
			night = nowNight;
			dirty = true;
		}
		nightK += ((night ? 1 : 0) - nightK) * Math.min(1, dt * 1.6);
		const p = traveller.position;
		const tcx = Math.round(p.x / TILE_SIZE);
		const tcz = Math.round(p.z / TILE_SIZE);
		if (dirty || tcx !== lastCx || tcz !== lastCz) rescan();
		fx.value.x = clock / S.glintPeriod;
		fx.value.y = S.glint * (1 - .5 * nightK);
		fx.value.z = S.dayLift + (S.nightLift - S.dayLift) * nightK;
		fx.value.w = S.flyLift * (1 - .55 * nightK);
		const modal = !!(ctx.game && ctx.game.modal && ctx.game.modal());
		const near2 = S.nearRadius * S.nearRadius;
		const pick2 = S.pickRadius * S.pickRadius;
		live = 0;
		for (let i = 0; i < N; i++) {
			const sl = slots[i];
			if (sl.state === FREE) continue;
			if (sl.state === IDLE) {
				const d = sl.def;
				const dx = d.x - p.x;
				const dz = d.z - p.z;
				const d2 = dx * dx + dz * dz;
				if (!sl.stale && (d.kind !== "star" || night) && (d2 < near2 || risen.has(sl.ck))) {
					if (sl.delay > 0 && d2 >= pick2 * 4) sl.delay -= dt;
					else {
						sl.delay = 0;
						sl.s = Math.min(1, sl.s + dt * S.popRate * .35);
					}
				} else {
					sl.s = Math.max(0, sl.s - dt * S.hideRate * .35);
					if (sl.s <= 0 && (sl.stale || d.kind === "star" && !night)) {
						release(sl);
						continue;
					}
				}
				if (sl.s <= 0) {
					const o = sl.i * 16;
					M[o] = M[o + 2] = M[o + 5] = M[o + 8] = M[o + 10] = 0;
					continue;
				}
				live++;
				if (!modal && sl.s > .5 && d2 < pick2) {
					pick(sl);
					if (sl.state !== PICK) continue;
				}
				const u = sl.s;
				const k = u - 1;
				const pop = 1 + 2.4 * k * k * k + 1.4 * k * k;
				const a = clock + sl.ph * 20;
				const star = d.kind === "star";
				write(sl, d.x, d.y + .006 + S.bob * (.5 + .5 * Math.sin(a * 1.3)), d.z, S.turn * Math.sin(a * S.turnSpeed), sl.size * pop, S.rock * Math.sin(a * S.rockSpeed), S.tilt + (1 - u) * .7, star ? 1 + S.starGlow * nightK * (.82 + .18 * Math.sin(a * 2.1)) : 1);
			} else if (sl.state === PICK) {
				sl.t += dt;
				const u = sl.t / S.pickTime;
				if (u >= 1) {
					release(sl);
					continue;
				}
				live++;
				const e = u < .3 ? 0 : (u - .3) / .7;
				const e2 = e * e * (3 - 2 * e);
				const x = sl.x + (p.x - sl.x) * e2;
				const z = sl.z + (p.z - sl.z) * e2;
				const y = sl.y + S.pickHop * Math.sin(Math.min(1, u / .45) * Math.PI * .5) * (1 - e2) + (p.y + S.pickLift - sl.y) * e2;
				const sc = sl.size * (1 + .3 * Math.sin(Math.min(1, u / .3) * Math.PI)) * (1 - e2 * e2);
				write(sl, x, y, z, u * u * S.pickSpin * TAU$1, sc, 0, S.tilt * (1 - u), -(sl.kind === "star" ? 1 + S.starGlow * nightK : 1));
			} else {
				sl.t += dt;
				const u = sl.t / S.flourishTime;
				if (u >= 1) {
					release(sl);
					continue;
				}
				live++;
				const e = 1 - (1 - u) * (1 - u);
				const r = .08 + S.flourishRadius * e;
				write(sl, sl.x + Math.cos(sl.ang) * r, sl.y + .04 + .42 * Math.sin(u * Math.PI) * (1 - .3 * u), sl.z + Math.sin(sl.ang) * r, .5 * Math.sin(u * 7 + sl.ang), sl.size * .62 * Math.min(1, u * 8) * (1 - u * u * u), .7 * Math.sin(u * 11 + sl.ang), S.tilt, -(sl.kind === "star" ? 1 + S.starGlow * nightK : 1));
			}
		}
		mesh.instanceMatrix.needsUpdate = true;
		animAttr.needsUpdate = true;
	}
	return {
		update,
		/** Deterministic stills: every piece in range stands (or is hidden) at once, pick-ups and flourishes are finished. */
		settle() {
			reconcile();
			for (let i = 0; i < N; i++) {
				const sl = slots[i];
				if (sl.state === PICK || sl.state === FX) release(sl);
			}
			night = !!(daynight && daynight.night);
			nightK = night ? 1 : 0;
			rescan();
			const p = traveller.position;
			const near2 = S.nearRadius * S.nearRadius;
			for (let i = 0; i < N; i++) {
				const sl = slots[i];
				if (sl.state !== IDLE) continue;
				if (sl.stale) {
					release(sl);
					continue;
				}
				const dx = sl.def.x - p.x;
				const dz = sl.def.z - p.z;
				sl.delay = 0;
				sl.s = dx * dx + dz * dz < near2 || risen.has(sl.ck) ? 1 : 0;
			}
			update(0);
		},
		dispose() {
			disposed = true;
			for (const off of offs) off();
			scene.remove(mesh);
			geo.dispose();
			mat.dispose();
			atlas.tex.dispose();
			mesh.dispose();
		},
		/** Pieces that are visible right now (standing, being picked up or part of a flourish). */
		count() {
			return live;
		},
		/** Nearest scrap that can be collected now: { x, z, kind, key, dist, visible } or null. `kind` filters. */
		debugNearest(kind = null) {
			const p = traveller.position;
			let best = null;
			let bd = Infinity;
			for (let i = 0; i < N; i++) {
				const sl = slots[i];
				if (sl.state !== IDLE || sl.stale || kind && sl.def.kind !== kind) continue;
				const d = Math.hypot(sl.def.x - p.x, sl.def.z - p.z);
				if (d < bd) {
					bd = d;
					best = sl;
				}
			}
			return best ? {
				x: best.def.x,
				z: best.def.z,
				kind: best.def.kind,
				key: best.def.key,
				dist: bd,
				visible: best.s > .5
			} : null;
		},
		/** Debug: every scrap of the cells in a square window: [{ x, z, kind, key, collected }]. */
		debugCells(cx, cz, r = 6) {
			const out = [];
			for (let z = cz - r; z <= cz + r; z++) for (let x = cx - r; x <= cx + r; x++) {
				const d = defAt(x, z);
				if (d) out.push({
					x: d.x,
					z: d.z,
					kind: d.kind,
					key: d.key,
					collected: progress.collected(d.key)
				});
			}
			return out;
		},
		get art() {
			return atlas.art;
		},
		mesh,
		trianglesPerPiece: TRIS_PER_PIECE
	};
}
// src/game/lanterns.js
var DEFAULTS$1 = {
	catchRadius: .9,
	riseDelay: .45,
	ramp: .6,
	overshoot: .35,
	flicker: .16,
	dark: "#34333d",
	glint: "#6f9cff",
	glintStrength: .42,
	sparks: 7,
	sparkLife: 1.05,
	sparkRise: .55,
	sparkSize: .045,
	sparkColor: "#ffc45a",
	sparkGain: 2.2
};
var LAMP_RE = /(^|_)(lamp|stone_lantern)(_[a-z]|_xf)?$/;
var LAMP_ANY_RE = /(^|_)(lamp|stone_lantern)(_|$)/;
var HALF_PI = Math.PI / 2;
var NMAX = 48;
var PANES = 6;
var NS = 28;
function createLanterns(ctx) {
	const { scene, world, wfc, traveller, progress, assets, life, daynight } = ctx;
	const C = {
		...DEFAULTS$1,
		...game && game.lanterns || {}
	};
	const on = new Uint8Array(NMAX);
	const lit = new Uint8Array(NMAX);
	const lCx = new Int32Array(NMAX);
	const lCz = new Int32Array(NMAX);
	const lK = new Uint8Array(NMAX);
	const lX = new Float32Array(NMAX);
	const lY = new Float32Array(NMAX);
	const lZ = new Float32Array(NMAX);
	const lT = new Float32Array(NMAX).fill(-1);
	const lLevel = new Float32Array(NMAX);
	const lSince = new Float64Array(NMAX);
	const lKey = new Array(NMAX).fill("");
	const pN = new Uint8Array(NMAX);
	const pMesh = new Array(288).fill(null);
	const pId = /* @__PURE__ */ new Int32Array(288);
	let anyAnim = false;
	const _col = new Color();
	const modelCache = /* @__PURE__ */ new Map();
	function ownOffsets(model) {
		const list = [];
		const proto = assets.getTilePrototype(model);
		proto.updateMatrixWorld(true);
		const inv = new Matrix4().copy(proto.matrixWorld).invert();
		const box = new Box3();
		const c = new Vector3();
		proto.traverse((n) => {
			if (!n.name || !LAMP_RE.test(n.name)) return;
			box.setFromObject(n);
			if (box.isEmpty()) return;
			box.applyMatrix4(inv);
			box.getCenter(c);
			for (const q of list) if (Math.abs(q[0] - c.x) + Math.abs(q[2] - c.z) < .15) return;
			list.push([
				c.x,
				Math.max(.22, box.max.y * .72),
				c.z
			]);
		});
		const extra = CONFIG.lights.pools && CONFIG.lights.pools.offsets && CONFIG.lights.pools.offsets[model] || null;
		if (extra) for (const q of extra) list.push(q);
		return list;
	}
	function modelInfo(model) {
		let info = modelCache.get(model);
		if (info) return info;
		info = {
			offs: [],
			panes: []
		};
		try {
			info.offs = (life && life.lampOffsets ? life.lampOffsets(model) : ownOffsets(model)) || [];
			if (info.offs.length) {
				const proto = assets.getTilePrototype(model);
				proto.updateMatrixWorld(true);
				const inv = new Matrix4().copy(proto.matrixWorld).invert();
				const box = new Box3();
				const c = new Vector3();
				const nearest = (maxD) => {
					let best = -1;
					let bd = maxD;
					for (let i = 0; i < info.offs.length; i++) {
						const d = Math.abs(info.offs[i][0] - c.x) + Math.abs(info.offs[i][2] - c.z);
						if (d < bd) {
							bd = d;
							best = i;
						}
					}
					return best;
				};
				proto.traverse((n) => {
					if (!n.isMesh || !n.userData.glow || !n.geometry) return;
					let k = -1;
					for (let a = n; a && k < 0; a = a.parent) {
						if (!a.name || !LAMP_ANY_RE.test(a.name)) continue;
						box.setFromObject(a);
						if (box.isEmpty()) continue;
						box.applyMatrix4(inv);
						box.getCenter(c);
						k = nearest(.3);
					}
					if (k < 0) {
						box.setFromObject(n);
						if (!box.isEmpty()) {
							box.applyMatrix4(inv);
							box.getCenter(c);
							k = nearest(.16);
						}
					}
					info.panes.push([n.geometry.uuid, k]);
				});
			}
		} catch (err) {
			console.warn("[lanterns] model scan failed", model, err);
		}
		modelCache.set(model, info);
		return info;
	}
	const recCache = /* @__PURE__ */ new WeakMap();
	function recPanes(rec, info) {
		let map = recCache.get(rec);
		if (map) return map;
		map = new Int8Array(rec.meshes.length).fill(-1);
		let p = 0;
		for (let i = 0; i < rec.meshes.length; i++) {
			const m = rec.meshes[i];
			if (!m.userData.glow) continue;
			let q = p;
			while (q < info.panes.length && info.panes[q][0] !== m.geometry.uuid) q++;
			if (q >= info.panes.length) continue;
			map[i] = info.panes[q][1];
			p = q + 1;
		}
		recCache.set(rec, map);
		return map;
	}
	const lampUniforms = {
		uLampCold: { value: new Color(0, 0, 0) },
		uLampDark: { value: new Color(C.dark) }
	};
	const cGlint = new Color(C.glint);
	const hooked = /* @__PURE__ */ new Set();
	function hookGlow(mesh) {
		if (!mesh._colorsTexture && mesh._initColorsTexture) mesh._initColorsTexture();
		const m = mesh.material;
		if (hooked.has(m)) return;
		hooked.add(m);
		const prev = m.onBeforeCompile;
		const prevKey = m.customProgramCacheKey;
		m.onBeforeCompile = (shader, renderer) => {
			if (prev) prev.call(m, shader, renderer);
			const stock = "vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );";
			let vs = shader.vertexShader;
			if (!vs.includes(stock)) vs = vs.replace("#include <color_vertex>", ShaderChunk.color_vertex);
			if (!vs.includes(stock) || !shader.fragmentShader.includes("#include <emissivemap_fragment>")) {
				console.warn("[lanterns] glow hook not applied (unexpected shader)");
				return;
			}
			Object.assign(shader.uniforms, lampUniforms);
			shader.vertexShader = vs.replace(stock, "vLampK = getBatchingColor( getIndirectIndex( gl_DrawID ) ).r;").replace("void main() {", "void main() {\n	vLampK = 1.0;").replace("#include <common>", "#include <common>\nvarying float vLampK;");
			shader.fragmentShader = shader.fragmentShader.replace("#include <common>", "#include <common>\nvarying float vLampK;\nuniform vec3 uLampCold;\nuniform vec3 uLampDark;").replace("#include <emissivemap_fragment>", `#include <emissivemap_fragment>
{ // lanterns: an unlit lamp pane is dark paper with a faint cold glint at night
  float lampK = clamp( vLampK, 0.0, 1.0 );
  totalEmissiveRadiance = totalEmissiveRadiance * vLampK + uLampCold * ( 1.0 - lampK );
  diffuseColor.rgb *= mix( uLampDark, vec3( 1.0 ), lampK );
}`);
		};
		m.customProgramCacheKey = () => (prevKey ? prevKey.call(m) : "") + "|lamp-level-v1";
		m.needsUpdate = true;
	}
	if (world.group) world.group.traverse((o) => {
		const e = o.isBatchedMesh && o.material && o.material.emissive;
		if (e && e.r + e.g + e.b > 0 && o.material.emissiveIntensity > 0) hookGlow(o);
	});
	function paint(e) {
		const n = pN[e];
		if (!n) return;
		_col.setRGB(lLevel[e], 1, 1);
		for (let j = 0; j < n; j++) pMesh[e * PANES + j].setColorAt(pId[e * PANES + j], _col);
	}
	function drop(cx, cz) {
		for (let e = 0; e < NMAX; e++) {
			if (!on[e] || lCx[e] !== cx || lCz[e] !== cz) continue;
			on[e] = 0;
			lT[e] = -1;
			for (let j = 0; j < pN[e]; j++) pMesh[e * PANES + j] = null;
			pN[e] = 0;
		}
	}
	function onRise(ev) {
		const rec = world.tileRecord ? world.tileRecord(ev.x, ev.z) : null;
		const cell = rec ? rec.cell : wfc.get(ev.x, ev.z);
		if (!cell) return;
		const info = modelInfo(cell.model);
		if (!info.offs.length) return;
		drop(ev.x, ev.z);
		const panes = rec ? recPanes(rec, info) : null;
		const ry = -(cell.rot || 0) * HALF_PI;
		const c = Math.cos(ry);
		const s = Math.sin(ry);
		for (let k = 0; k < info.offs.length; k++) {
			let e = 0;
			while (e < NMAX && on[e]) e++;
			if (e >= NMAX) return;
			const u = info.offs[k][0];
			const v = info.offs[k][2];
			on[e] = 1;
			lCx[e] = ev.x;
			lCz[e] = ev.z;
			lK[e] = k;
			lSince[e] = state.time;
			lT[e] = -1;
			lX[e] = ev.x * TILE_SIZE + u * c + v * s;
			lY[e] = info.offs[k][1];
			lZ[e] = ev.z * TILE_SIZE - u * s + v * c;
			lKey[e] = ev.x + "," + ev.z + "," + k;
			lit[e] = progress.lit(lKey[e]) ? 1 : 0;
			lLevel[e] = lit[e];
			pN[e] = 0;
			if (panes) for (let i = 0; i < panes.length && pN[e] < PANES; i++) {
				if (panes[i] !== k) continue;
				const inst = rec.inst[i];
				hookGlow(inst.b.mesh);
				pMesh[e * PANES + pN[e]] = inst.b.mesh;
				pId[e * PANES + pN[e]] = inst.id;
				pN[e]++;
			}
			paint(e);
		}
	}
	const offRise = bus.on("tile:rise", onRise);
	const offFlat = bus.on("tile:flat", (ev) => drop(ev.x, ev.z));
	const offGone = bus.on("tile:despawn", (ev) => drop(ev.x, ev.z));
	const offReset = bus.on("game:reset", () => {
		for (let e = 0; e < NMAX; e++) if (on[e]) {
			lit[e] = progress.lit(lKey[e]) ? 1 : 0;
			lLevel[e] = lit[e];
			lT[e] = -1;
			paint(e);
		}
	});
	/** Night pools (life.js): strength of one lamp, 0 = no pool. */
	function gate(cx, cz, k) {
		for (let e = 0; e < NMAX; e++) if (on[e] && lK[e] === k && lCx[e] === cx && lCz[e] === cz) return lit[e] ? Math.min(1.3, lLevel[e]) : 0;
		return 0;
	}
	if (life && life.setLampGate) life.setLampGate(gate);
	const sparkGeo = new PlaneGeometry(1, 1);
	const cSpark = new Color(C.sparkColor);
	const sparkMat = new MeshBasicMaterial({
		color: cSpark.clone().multiplyScalar(C.sparkGain),
		side: 2,
		fog: false
	});
	const sparks = new InstancedMesh(sparkGeo, sparkMat, NS);
	sparks.name = "game:lantern-sparks";
	sparks.frustumCulled = false;
	sparks.castShadow = false;
	sparks.receiveShadow = false;
	sparks.visible = false;
	sparks.count = 0;
	scene.add(sparks);
	const sT = new Float32Array(NS).fill(-1);
	const sX = new Float32Array(NS);
	const sY = new Float32Array(NS);
	const sZ = new Float32Array(NS);
	const sVx = new Float32Array(NS);
	const sVy = new Float32Array(NS);
	const sVz = new Float32Array(NS);
	const sPh = new Float32Array(NS);
	const sLife = new Float32Array(NS);
	let sparkLive = 0;
	let sparkSeed = 1;
	const rnd = () => {
		sparkSeed = Math.imul(sparkSeed, 1664525) + 1013904223 >>> 0;
		return sparkSeed / 4294967296;
	};
	const _m = new Matrix4();
	const _p = new Vector3();
	const _q = new Quaternion();
	const _qz = new Quaternion();
	const _s = new Vector3();
	const _zAxis = new Vector3(0, 0, 1);
	function burst(x, y, z) {
		let left = C.sparks;
		for (let i = 0; i < NS && left > 0; i++) {
			if (sT[i] >= 0) continue;
			const a = rnd() * Math.PI * 2;
			const r = .04 + rnd() * .07;
			sT[i] = 0;
			sLife[i] = C.sparkLife * (.7 + .5 * rnd());
			sX[i] = x + Math.cos(a) * r;
			sY[i] = y + (rnd() - .3) * .08;
			sZ[i] = z + Math.sin(a) * r;
			sVx[i] = Math.cos(a) * .16 * rnd();
			sVz[i] = Math.sin(a) * .16 * rnd();
			sVy[i] = C.sparkRise * (.6 + .8 * rnd());
			sPh[i] = rnd() * 6.283;
			left--;
			sparkLive++;
		}
	}
	function updateSparks(dt) {
		if (!sparkLive) {
			if (sparks.visible) {
				sparks.visible = false;
				sparks.count = 0;
			}
			return;
		}
		const cam = ctx.follow && ctx.follow.camera;
		let n = 0;
		for (let i = 0; i < NS; i++) {
			if (sT[i] < 0) continue;
			sT[i] += dt;
			const u = sT[i] / sLife[i];
			if (u >= 1) {
				sT[i] = -1;
				sparkLive--;
				continue;
			}
			sVy[i] *= 1 - .9 * dt;
			sVx[i] *= 1 - 1.5 * dt;
			sVz[i] *= 1 - 1.5 * dt;
			const w = Math.sin(sPh[i] + sT[i] * 7);
			sX[i] += (sVx[i] + w * .05) * dt;
			sY[i] += sVy[i] * dt;
			sZ[i] += (sVz[i] + Math.cos(sPh[i] * 1.7 + sT[i] * 6) * .05) * dt;
			const k = Math.min(1, u * 8) * (1 - u * u) * C.sparkSize;
			_p.set(sX[i], sY[i], sZ[i]);
			_qz.setFromAxisAngle(_zAxis, sPh[i] + sT[i] * 3.2);
			if (cam) _q.copy(cam.quaternion).multiply(_qz);
			else _q.copy(_qz);
			_s.set(k, k * (.55 + .45 * Math.abs(w)), k);
			_m.compose(_p, _q, _s);
			sparks.setMatrixAt(n++, _m);
		}
		sparks.count = n;
		sparks.visible = n > 0;
		sparks.instanceMatrix.needsUpdate = true;
	}
	function level(t) {
		const T = C.ramp;
		if (t < T) {
			const u = t / T;
			return u * u * (3 - 2 * u) + C.overshoot * Math.sin(Math.PI * u) * u;
		}
		const a = t - T;
		return 1 + C.flicker * Math.exp(-3.5 * a) * Math.sin(26 * a);
	}
	function catchLamp(e) {
		if (lit[e]) return false;
		lit[e] = 1;
		lT[e] = 0;
		anyAnim = true;
		burst(lX[e], lY[e] + .05, lZ[e]);
		progress.light(lKey[e], lX[e], lZ[e]);
		if (ctx.music && ctx.music.chime) ctx.music.chime("lantern");
		return true;
	}
	let nightK = daynight && daynight.night ? 1 : 0;
	return {
		update(dt) {
			const tgt = daynight && daynight.night ? 1 : 0;
			if (dt <= 0) nightK = tgt;
			else if (nightK !== tgt) nightK = tgt > nightK ? Math.min(1, nightK + dt / 1.6) : Math.max(0, nightK - dt / 1.6);
			const g = nightK * nightK * (3 - 2 * nightK) * C.glintStrength * (.82 + .18 * Math.sin(state.time * 1.7));
			lampUniforms.uLampCold.value.setRGB(cGlint.r * g, cGlint.g * g, cGlint.b * g);
			const sg = C.sparkGain * (.55 + .45 * nightK);
			sparkMat.color.setRGB(cSpark.r * sg, cSpark.g * sg, cSpark.b * sg);
			const p = traveller.position;
			const r2 = C.catchRadius * C.catchRadius;
			const now = state.time;
			let anim = false;
			for (let e = 0; e < NMAX; e++) {
				if (!on[e]) continue;
				if (!lit[e]) {
					const dx = lX[e] - p.x;
					const dz = lZ[e] - p.z;
					if (dt > 0 && dx * dx + dz * dz < r2 && now - lSince[e] >= C.riseDelay && ctx.game.armed !== false) catchLamp(e);
				}
				if (lT[e] >= 0) {
					lT[e] += dt;
					if (lT[e] > C.ramp + 1.4) {
						lT[e] = -1;
						lLevel[e] = 1;
					} else {
						lLevel[e] = level(lT[e]);
						anim = true;
					}
					paint(e);
				}
			}
			anyAnim = anim;
			updateSparks(dt);
		},
		/** Finish every running catch animation (captures). */
		settle() {
			for (let e = 0; e < NMAX; e++) if (on[e] && lT[e] >= 0) {
				lT[e] = -1;
				lLevel[e] = 1;
				paint(e);
			}
			for (let i = 0; i < NS; i++) sT[i] = -1;
			sparkLive = 0;
			sparks.visible = false;
			sparks.count = 0;
			anyAnim = false;
		},
		/** Lamps on the risen tiles around the traveller: [{key, x, z, lit}]. */
		lamps() {
			const a = [];
			for (let e = 0; e < NMAX; e++) if (on[e]) a.push({
				key: lKey[e],
				x: +lX[e].toFixed(2),
				y: +lY[e].toFixed(2),
				z: +lZ[e].toFixed(2),
				lit: !!lit[e],
				panes: pN[e]
			});
			return a;
		},
		get animating() {
			return anyAnim || sparkLive > 0;
		},
		/** Debug: light the nearest unlit lamp whatever the distance. @returns its key or null */
		debugLightNearest() {
			const p = traveller.position;
			let best = -1;
			let bd = 1e9;
			for (let e = 0; e < NMAX; e++) {
				if (!on[e] || lit[e]) continue;
				const d = (lX[e] - p.x) * (lX[e] - p.x) + (lZ[e] - p.z) * (lZ[e] - p.z);
				if (d < bd) {
					bd = d;
					best = e;
				}
			}
			if (best < 0) return null;
			catchLamp(best);
			return lKey[best];
		},
		dispose() {
			offRise();
			offFlat();
			offGone();
			offReset();
			if (life && life.setLampGate) life.setLampGate(null);
			for (let e = 0; e < NMAX; e++) if (on[e]) {
				lLevel[e] = 1;
				paint(e);
				on[e] = 0;
			}
			lampUniforms.uLampCold.value.setRGB(0, 0, 0);
			scene.remove(sparks);
			sparkGeo.dispose();
			sparkMat.dispose();
			sparks.dispose();
		}
	};
}
// src/game/atlasmap.js
var DEFAULTS = {
	duration: .7,
	lift: .75,
	liftPitch: 74,
	minSpan: 5,
	maxSpan: 90,
	fitMax: 24,
	fitPad: 1.5,
	texture: 2048,
	thumb: 128,
	print: "twin",
	inkPaths: true,
	iconsUrl: "textures/art/game_icons",
	panSpeed: .9
};
var INK = "#5a3a28";
var BIOME_GROUND = {
	heartland: "#c3c084",
	desert: "#e3c68f",
	snow: "#e7ecef",
	blossom: "#cdd596",
	pinewood: "#8fa07a"
};
var BIOME_WASH = {
	heartland: [],
	desert: [[
		"color",
		"#dcb878",
		.85
	], [
		"source-over",
		"#ecd3a0",
		.3
	]],
	snow: [[
		"color",
		"#c9d8ea",
		.9
	], [
		"source-over",
		"#f1f4f6",
		.58
	]],
	blossom: [[
		"color",
		"#b3c070",
		.3
	], [
		"source-over",
		"#f0c9c4",
		.1
	]],
	pinewood: [[
		"color",
		"#557250",
		.55
	], [
		"multiply",
		"#b9c7b0",
		.55
	]]
};
var SERIF = "Georgia, 'Times New Roman', serif";
var TAU = Math.PI * 2;
var key = (cx, cz) => (cx + 32768) * 65536 + (cz + 32768);
var clamp = (v, a, b) => v < a ? a : v > b ? b : v;
var hash = (x, z, k) => {
	let h = (Math.imul(x | 0, 2654435761) ^ Math.imul(z | 0, 2246822507) ^ Math.imul(k | 0, 3266489909)) >>> 0;
	h ^= h >>> 15;
	h = Math.imul(h, 739982445) >>> 0;
	h ^= h >>> 12;
	return (h >>> 0) / 4294967296;
};
function scrapShape(ctx, kind, s) {
	ctx.lineWidth = Math.max(1, s * .09);
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	ctx.fillStyle = {
		leaf: "#b9603f",
		shell: "#e8d3ac",
		snowflake: "#fbf6ea",
		petal: "#c98374",
		feather: "#8a6a4c",
		star: "#dca848"
	}[kind] || "#d9a441";
	ctx.strokeStyle = INK;
	ctx.beginPath();
	if (kind === "leaf") {
		ctx.moveTo(0, -s);
		ctx.bezierCurveTo(s * .95, -s * .5, s * .8, s * .5, 0, s);
		ctx.bezierCurveTo(-s * .8, s * .5, -s * .95, -s * .5, 0, -s);
		ctx.fill();
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(0, -s * .7);
		ctx.lineTo(0, s * 1.15);
		ctx.stroke();
	} else if (kind === "shell") {
		ctx.arc(0, 0, s * .9, 0, TAU);
		ctx.fill();
		ctx.stroke();
		ctx.beginPath();
		for (let a = 0; a < 14; a += .3) {
			const r = s * .06 * a;
			ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
		}
		ctx.stroke();
	} else if (kind === "snowflake") {
		ctx.arc(0, 0, s * .95, 0, TAU);
		ctx.fillStyle = "#dfe9ee";
		ctx.fill();
		ctx.strokeStyle = "#5e9c9a";
		ctx.beginPath();
		for (let i = 0; i < 3; i++) {
			const a = i / 3 * Math.PI;
			ctx.moveTo(Math.cos(a) * s * .75, Math.sin(a) * s * .75);
			ctx.lineTo(-Math.cos(a) * s * .75, -Math.sin(a) * s * .75);
		}
		ctx.stroke();
	} else if (kind === "petal") {
		for (let i = 0; i < 5; i++) {
			const a = i / 5 * TAU - Math.PI / 2;
			ctx.moveTo(Math.cos(a) * s * .55 + s * .42, Math.sin(a) * s * .55);
			ctx.arc(Math.cos(a) * s * .55, Math.sin(a) * s * .55, s * .42, 0, TAU);
		}
		ctx.fill();
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(0, 0, s * .2, 0, TAU);
		ctx.fillStyle = "#d9a441";
		ctx.fill();
	} else if (kind === "feather") {
		ctx.save();
		ctx.rotate(.5);
		ctx.ellipse(0, -s * .1, s * .36, s * .95, 0, 0, TAU);
		ctx.fill();
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(0, -s * .9);
		ctx.lineTo(0, s * 1.2);
		ctx.stroke();
		ctx.restore();
	} else {
		for (let i = 0; i < 10; i++) {
			const a = i / 10 * TAU - Math.PI / 2;
			const r = i % 2 ? s * .45 : s;
			ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
		}
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}
}
function createAtlasMap(ctx) {
	const { renderer, world, wfc, traveller, follow, controls, daynight, progress, seed, quality } = ctx;
	const A = {
		...DEFAULTS,
		...CONFIG.game && CONFIG.game.atlasmap || {}
	};
	const P = CONFIG.palette || {};
	const PAPER = P.paper || "#efe0c2";
	const headless = typeof document === "undefined" || !renderer;
	let want = false;
	let t = 0;
	let basePose = null;
	let mapDirty = true;
	let pageDirty = true;
	let cellsDirty = true;
	let zoomIdle = 0;
	let night = 0;
	const nightGoal = () => daynight && daynight.night ? 1 : 0;
	const cells = /* @__PURE__ */ new Map();
	const bounds = {
		x0: 0,
		x1: 0,
		z0: 0,
		z1: 0
	};
	const view = {
		x: 0,
		z: 0,
		span: 12,
		tx: 0,
		tz: 0,
		tspan: 12,
		fit: 12
	};
	const win = {
		x: 0,
		z: 0,
		ppc: 32,
		span: 12,
		ok: false
	};
	const frame = {
		x0: 0,
		y0: 0,
		x1: 1,
		y1: 1
	};
	const held = /* @__PURE__ */ new Set();
	const lamps = /* @__PURE__ */ new Map();
	function lampFromKey(k) {
		const m = /^(-?\d+),(-?\d+)/.exec(k);
		if (m && !lamps.has(k)) lamps.set(k, [+m[1], +m[2]]);
	}
	function loadLamps() {
		if (!progress.persist) return;
		try {
			const raw = localStorage.getItem("popup-atlas:v1:" + seed);
			const d = raw && JSON.parse(raw);
			if (d && d.lanterns) for (const k in d.lanterns) lampFromKey(k);
		} catch {}
	}
	loadLamps();
	const offs = [
		bus.on("game:explore", () => {
			cellsDirty = true;
			mapDirty = true;
			pageDirty = true;
		}),
		bus.on("game:collect", () => {
			pageDirty = true;
		}),
		bus.on("game:lantern", (e) => {
			if (e && e.key !== void 0) lamps.set(e.key, [e.x / TILE_SIZE, e.z / TILE_SIZE]);
			mapDirty = true;
			pageDirty = true;
		}),
		bus.on("game:reset", () => {
			lamps.clear();
			cellsDirty = true;
			mapDirty = true;
			pageDirty = true;
		}),
		bus.on("resize", () => {
			pageDirty = true;
			mapDirty = true;
		})
	];
	let gfx = null;
	let iconTable = null;
	let iconImg = null;
	function ensureGfx() {
		if (gfx || headless) return gfx;
		const pageCanvas = document.createElement("canvas");
		const mapCanvas = document.createElement("canvas");
		const layer = document.createElement("canvas");
		const mask = document.createElement("canvas");
		const mk = (c) => {
			const tex = new CanvasTexture(c);
			tex.colorSpace = "";
			tex.generateMipmaps = false;
			tex.minFilter = LinearFilter;
			tex.magFilter = LinearFilter;
			tex.wrapS = tex.wrapT = ClampToEdgeWrapping;
			return tex;
		};
		const tPage = mk(pageCanvas);
		const tMap = mk(mapCanvas);
		tMap.premultiplyAlpha = true;
		const geo = new BufferGeometry();
		geo.setAttribute("position", new Float32BufferAttribute([
			-1.2,
			-1.2,
			0,
			1.2,
			-1.2,
			0,
			1.2,
			1.5,
			0,
			-1.2,
			-1.2,
			0,
			1.2,
			1.5,
			0,
			-1.2,
			1.5,
			0
		], 3));
		const mat = new ShaderMaterial({
			depthTest: false,
			depthWrite: false,
			transparent: true,
			toneMapped: false,
			uniforms: {
				tPage: { value: tPage },
				tMap: { value: tMap },
				uView: { value: new Vector4() },
				uWin: { value: new Vector4() },
				uFrame: { value: new Vector4() },
				uSlide: { value: new Vector3() },
				uPaper: { value: new Color(PAPER) },
				uNight: { value: 0 },
				uAspect: { value: 1 },
				uInk: { value: new Color(INK) },
				uFeather: { value: new Vector2(.002, .002) }
			},
			vertexShader: `
        uniform vec3 uSlide; uniform float uAspect;
        varying vec2 vUv;
        void main() {
          vUv = position.xy * 0.5 + 0.5;
          vec2 p = position.xy;
          float c = cos(uSlide.z), s = sin(uSlide.z);
          p.x *= uAspect; p = vec2(c * p.x - s * p.y, s * p.x + c * p.y); p.x /= uAspect;
          gl_Position = vec4(p + uSlide.xy, 0.0, 1.0);
        }`,
			fragmentShader: `
        uniform sampler2D tPage; uniform sampler2D tMap;
        uniform vec4 uView; uniform vec4 uWin; uniform vec4 uFrame;
        uniform vec3 uPaper; uniform vec3 uInk; uniform float uNight; uniform float uAspect; uniform vec2 uFeather;
        varying vec2 vUv;
        float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
        void main() {
          if (vUv.y > 1.0 || vUv.x < 0.0 || vUv.x > 1.0 || vUv.y < 0.0) {
            // the shadow the page throws on the diorama it slides over
            float d = max(max(vUv.y - 1.0, 0.0) / 0.25, max(max(-vUv.x, vUv.x - 1.0), -vUv.y) / 0.1);
            float a = clamp(1.0 - d, 0.0, 1.0);
            gl_FragColor = vec4(0.07, 0.04, 0.02, a * a * 0.5);
            return;
          }
          vec3 page = texture2D(tPage, vUv).rgb;
          vec3 col = page;
          // the map lives inside the inked frame and pans / zooms under it
          vec2 e = min(vUv - uFrame.xy, uFrame.zw - vUv) / uFeather;
          float inside = clamp(min(e.x, e.y), 0.0, 1.0);
          if (inside > 0.0) {
            vec2 cell = uView.xy + (vUv - 0.5 * (uFrame.xy + uFrame.zw)) * uView.zw * vec2(1.0, -1.0);
            vec2 muv = vec2(0.5 + (cell.x - uWin.x) * uWin.z, 0.5 - (cell.y - uWin.y) * uWin.w);
            vec4 m = texture2D(tMap, muv);
            vec2 b = min(muv, 1.0 - muv);
            float ma = m.a * inside * step(0.0, min(b.x, b.y));
            vec3 mc = m.a > 0.001 ? m.rgb / m.a : uPaper;
            // the print sits IN the paper: fibres and the page's own ink show through it
            col = mix(col, mc * clamp(page / uPaper, 0.0, 1.08), ma);
          }
          // paper under light: fine tooth, a soft pool of light, darker corners
          vec2 q = (vUv - 0.5) * vec2(uAspect, 1.0);
          float r = length(q);
          col *= 0.985 + 0.03 * hash(floor(gl_FragCoord.xy));
          float vig = smoothstep(0.25, 1.05, r);
          vec3 day = col * mix(vec3(1.03, 1.02, 1.0), vec3(0.78, 0.7, 0.6), vig * vig);
          // night: the page is read by lantern light
          float pool = exp(-r * r * 3.2);
          vec3 night = col * (vec3(0.2, 0.22, 0.34) + vec3(1.0, 0.76, 0.46) * pool * 0.92);
          gl_FragColor = vec4(mix(day, night, uNight), 1.0);
        }`
		});
		const quad = new Mesh(geo, mat);
		quad.frustumCulled = false;
		const scene = new Scene();
		scene.add(quad);
		gfx = {
			pageCanvas,
			mapCanvas,
			layer,
			mask,
			tPage,
			tMap,
			geo,
			mat,
			scene,
			cam: new Camera(),
			thumbs: null,
			thumbTried: 0,
			icons: null,
			iconImg: null
		};
		return gfx;
	}
	function loadIcons() {
		const url = "./" + A.iconsUrl;
		fetch(url + ".json").then((r) => r.ok ? r.json() : null).then((json) => {
			if (!json) return;
			const src = json.sprites || json.cells || json.icons || json.frames || json;
			const table = {};
			for (const name in src) {
				const v = src[name];
				const r = Array.isArray(v) ? v : v && (v.rect || v.frame || v);
				if (!r) continue;
				const rect = Array.isArray(r) ? r : [
					r.x,
					r.y,
					r.w ?? r.width,
					r.h ?? r.height
				];
				if (rect.length >= 4 && rect.every((n) => Number.isFinite(n))) table[name] = rect;
			}
			const img = new Image();
			img.onload = () => {
				iconTable = table;
				iconImg = img;
				mapDirty = true;
				pageDirty = true;
			};
			img.src = url + ".png";
		}).catch(() => {});
	}
	/** Draw a named icon centred at (x, y) fitting a box of `size`. @returns false when the sheet has no such cell */
	function icon(c, name, x, y, size) {
		const r = iconTable && iconTable[name];
		if (!r) return false;
		const k = size / Math.max(r[2], r[3]);
		c.drawImage(iconImg, r[0], r[1], r[2], r[3], x - r[2] * k / 2, y - r[3] * k / 2, r[2] * k, r[3] * k);
		return true;
	}
	function drawScrap(c, kind, x, y, size) {
		if (icon(c, "scrap_" + kind, x, y, size)) return;
		c.save();
		c.translate(x, y);
		scrapShape(c, kind, size * .4);
		c.restore();
	}
	function drawLamp(c, x, y, r) {
		const g = c.createRadialGradient(x, y, 0, x, y, r * 3);
		g.addColorStop(0, "rgba(255, 196, 90, 0.75)");
		g.addColorStop(1, "rgba(255, 196, 90, 0)");
		c.fillStyle = g;
		c.beginPath();
		c.arc(x, y, r * 3, 0, TAU);
		c.fill();
		c.fillStyle = "#ffc45a";
		c.strokeStyle = INK;
		c.lineWidth = Math.max(.75, r * .3);
		c.beginPath();
		c.arc(x, y, r, 0, TAU);
		c.fill();
		c.stroke();
	}
	function drawPin(c, x, y, size, dx, dz) {
		c.save();
		const l = Math.hypot(dx, dz) || 1;
		const ax = dx / l;
		const az = dz / l;
		c.fillStyle = INK;
		c.globalAlpha = .85;
		c.beginPath();
		c.moveTo(x + ax * size * .62, y + az * size * .62);
		c.lineTo(x + ax * size * .3 - az * size * .16, y + az * size * .3 + ax * size * .16);
		c.lineTo(x + ax * size * .3 + az * size * .16, y + az * size * .3 - ax * size * .16);
		c.closePath();
		c.fill();
		c.globalAlpha = 1;
		if (!icon(c, "pin", x, y - size * .42, size)) {
			c.fillStyle = "rgba(42, 26, 18, 0.28)";
			c.beginPath();
			c.ellipse(x + size * .1, y + size * .02, size * .2, size * .08, 0, 0, TAU);
			c.fill();
			c.strokeStyle = INK;
			c.lineWidth = Math.max(1, size * .06);
			c.lineCap = "round";
			c.beginPath();
			c.moveTo(x, y);
			c.lineTo(x, y - size * .55);
			c.stroke();
			c.fillStyle = "#b9603f";
			c.beginPath();
			c.arc(x, y - size * .66, size * .24, 0, TAU);
			c.fill();
			c.stroke();
			c.fillStyle = "rgba(251, 246, 234, 0.7)";
			c.beginPath();
			c.arc(x - size * .07, y - size * .73, size * .07, 0, TAU);
			c.fill();
		}
		c.restore();
	}
	function drawRose(c, x, y, size) {
		if (icon(c, "compass_rose", x, y, size)) return;
		const r = size * .5;
		c.save();
		c.translate(x, y);
		c.strokeStyle = INK;
		c.fillStyle = INK;
		c.lineWidth = Math.max(.75, size * .025);
		c.globalAlpha = .8;
		c.beginPath();
		c.arc(0, 0, r * .62, 0, TAU);
		c.stroke();
		for (let i = 0; i < 8; i++) {
			const a = i / 8 * TAU - Math.PI / 2;
			const len = i % 2 ? r * .5 : r * (i === 0 ? 1 : .86);
			const w = i % 2 ? r * .09 : r * .15;
			c.beginPath();
			c.moveTo(Math.cos(a) * len, Math.sin(a) * len);
			c.lineTo(Math.cos(a + Math.PI / 2) * w, Math.sin(a + Math.PI / 2) * w);
			c.lineTo(Math.cos(a - Math.PI / 2) * w, Math.sin(a - Math.PI / 2) * w);
			c.closePath();
			if (i === 0) {
				c.fillStyle = "#b9603f";
				c.fill();
				c.fillStyle = INK;
			} else if (i % 2) c.stroke();
			else c.fill();
		}
		c.restore();
	}
	function buildThumbs() {
		const book = world && world.book;
		if (!book || !book.atlas || !book.baked || !book.modelIndex || gfx.thumbs) return;
		if (gfx.thumbTried++ > 3) return;
		try {
			const n = book.modelIndex.size;
			const cols = 8;
			const rows = Math.ceil(n / cols);
			const S = A.thumb;
			const w = cols * S;
			const h = rows * S;
			const rt = new WebGLRenderTarget(w, h, { depthBuffer: false });
			const mat = new RawShaderMaterial({
				glslVersion: GLSL3,
				depthTest: false,
				depthWrite: false,
				uniforms: {
					uAtlas: { value: book.atlas.texture },
					uGrid: { value: new Vector2(cols, rows) },
					uOdd: { value: A.print === "base" ? 0 : 1 },
					uLod: { value: Math.max(0, Math.log2(book.atlas.width / S)) }
				},
				vertexShader: "in vec3 position; out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",
				fragmentShader: `precision highp float; precision highp sampler2DArray;
          uniform sampler2DArray uAtlas; uniform vec2 uGrid; uniform float uOdd; uniform float uLod;
          in vec2 vUv; out vec4 o;
          void main() {
            vec2 g = vUv * uGrid; vec2 c = floor(g); vec2 f = g - c;
            float idx = c.x + (uGrid.y - 1.0 - c.y) * uGrid.x;
            vec3 col = textureLod(uAtlas, vec3(f, idx * 2.0 + uOdd), uLod).rgb;
            col = mix(col * 12.92, 1.055 * pow(max(col, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055, step(0.0031308, col));
            o = vec4(col, 1.0);
          }`
			});
			const geo = new BufferGeometry();
			geo.setAttribute("position", new Float32BufferAttribute([
				-1,
				-1,
				0,
				3,
				-1,
				0,
				-1,
				3,
				0
			], 3));
			const mesh = new Mesh(geo, mat);
			mesh.frustumCulled = false;
			const sc = new Scene();
			sc.add(mesh);
			const prev = renderer.getRenderTarget();
			renderer.setRenderTarget(rt);
			renderer.render(sc, gfx.cam);
			const buf = new Uint8Array(w * h * 4);
			renderer.readRenderTargetPixels(rt, 0, 0, w, h, buf);
			renderer.setRenderTarget(prev);
			rt.dispose();
			mat.dispose();
			geo.dispose();
			const cv = document.createElement("canvas");
			cv.width = w;
			cv.height = h;
			const c2 = cv.getContext("2d");
			const img = c2.createImageData(w, h);
			for (let y = 0; y < h; y++) img.data.set(buf.subarray((h - 1 - y) * w * 4, (h - y) * w * 4), y * w * 4);
			c2.putImageData(img, 0, 0);
			gfx.thumbs = {
				canvas: cv,
				cols,
				S,
				index: book.modelIndex
			};
		} catch (err) {
			console.warn("[atlasmap] tile prints unavailable, drawing symbols instead", err);
		}
	}
	function readCells() {
		cells.clear();
		let x0 = 1e9;
		let x1 = -1e9;
		let z0 = 1e9;
		let z1 = -1e9;
		progress.eachCell((cx, cz, biome) => {
			cells.set(key(cx, cz), typeof biome === "string" ? biome : "heartland");
			if (cx < x0) x0 = cx;
			if (cx > x1) x1 = cx;
			if (cz < z0) z0 = cz;
			if (cz > z1) z1 = cz;
		});
		const px = Math.round(traveller.position.x / TILE_SIZE);
		const pz = Math.round(traveller.position.z / TILE_SIZE);
		if (!cells.size) {
			x0 = x1 = px;
			z0 = z1 = pz;
		}
		bounds.x0 = x0;
		bounds.x1 = x1;
		bounds.z0 = z0;
		bounds.z1 = z1;
		cellsDirty = false;
	}
	const frameAspect = () => (frame.x1 - frame.x0) / Math.max(1, frame.y1 - frame.y0);
	/** Centre on the traveller and zoom so the explored land fits round him (clamped). */
	function fitView() {
		const px = traveller.position.x / TILE_SIZE;
		const pz = traveller.position.z / TILE_SIZE;
		const hx = Math.max(px - bounds.x0, bounds.x1 - px) + .5 + A.fitPad;
		const hz = Math.max(pz - bounds.z0, bounds.z1 - pz) + .5 + A.fitPad;
		const span = clamp(Math.max(hz * 2, hx * 2 / frameAspect()), Math.max(A.minSpan, 8), A.fitMax);
		view.fit = span;
		let ox = px;
		let oz = pz;
		const bw = bounds.x1 - bounds.x0 + 1 + A.fitPad * 2;
		const bh = bounds.z1 - bounds.z0 + 1 + A.fitPad * 2;
		if (Math.max(bh, bw / frameAspect()) <= A.fitMax) {
			ox = (px + (bounds.x0 + bounds.x1) / 2) / 2;
			oz = (pz + (bounds.z0 + bounds.z1) / 2) / 2;
			const qx = Math.max(ox - bounds.x0, bounds.x1 - ox) + .5 + A.fitPad;
			const qz = Math.max(oz - bounds.z0, bounds.z1 - oz) + .5 + A.fitPad;
			view.fit = clamp(Math.max(qz * 2, qx * 2 / frameAspect()), Math.max(A.minSpan, 8), A.fitMax);
		}
		view.x = view.tx = ox;
		view.z = view.tz = oz;
		view.span = view.tspan = view.fit;
	}
	function clampView() {
		view.tspan = clamp(view.tspan, A.minSpan, Math.max(A.maxSpan * .25, Math.min(A.maxSpan, view.fit * 1.6)));
		view.tx = clamp(view.tx, bounds.x0 - 2, bounds.x1 + 2);
		view.tz = clamp(view.tz, bounds.z0 - 2, bounds.z1 + 2);
	}
	function drawPage() {
		const g = gfx;
		const dw = renderer.domElement.width || 1280;
		const dh = renderer.domElement.height || 720;
		const k = Math.min(1, A.texture / Math.max(dw, dh));
		const W = Math.max(64, Math.round(dw * k));
		const H = Math.max(64, Math.round(dh * k));
		const cv = g.pageCanvas;
		if (cv.width !== W || cv.height !== H) {
			cv.width = W;
			cv.height = H;
			g.tPage.dispose();
		}
		const c = cv.getContext("2d");
		const u = Math.min(W, H) / 100;
		const rng = mulberry32(684453 ^ seed);
		c.globalAlpha = 1;
		c.globalCompositeOperation = "source-over";
		c.fillStyle = PAPER;
		c.fillRect(0, 0, W, H);
		for (let i = 0; i < 60; i++) {
			const x = rng() * W;
			const y = rng() * H;
			const r = (8 + rng() * 22) * u;
			const gr = c.createRadialGradient(x, y, 0, x, y, r);
			const light = rng() < .5;
			gr.addColorStop(0, light ? "rgba(251, 246, 234, 0.16)" : "rgba(205, 180, 134, 0.13)");
			gr.addColorStop(1, light ? "rgba(251, 246, 234, 0)" : "rgba(205, 180, 134, 0)");
			c.fillStyle = gr;
			c.fillRect(x - r, y - r, r * 2, r * 2);
		}
		c.lineCap = "round";
		const fibres = Math.round(W * H / 520);
		for (let i = 0; i < fibres; i++) {
			const x = rng() * W;
			const y = rng() * H;
			const a = rng() * Math.PI;
			const l = (.5 + rng() * 1.7) * u;
			const bend = (rng() - .5) * l * .6;
			c.strokeStyle = rng() < .55 ? `rgba(253, 249, 240, ${.2 + rng() * .3})` : `rgba(176, 146, 100, ${.1 + rng() * .16})`;
			c.lineWidth = Math.max(.5, (.05 + rng() * .09) * u);
			c.beginPath();
			c.moveTo(x, y);
			c.quadraticCurveTo(x + Math.cos(a) * l * .5 - Math.sin(a) * bend, y + Math.sin(a) * l * .5 + Math.cos(a) * bend, x + Math.cos(a) * l, y + Math.sin(a) * l);
			c.stroke();
		}
		for (let i = 0; i < fibres / 3; i++) {
			c.fillStyle = `rgba(120, 88, 56, ${.05 + rng() * .12})`;
			c.fillRect(rng() * W, rng() * H, Math.max(1, .1 * u), Math.max(1, .1 * u));
		}
		const s = progress.summary();
		const groups = [];
		groups.push({
			label: "Scraps",
			kind: "scraps",
			w: SCRAP_IDS.length * 1.3
		});
		groups.push({
			label: "Lanterns",
			kind: "lamps",
			w: 2.3
		});
		groups.push({
			label: "Explored",
			kind: "cells",
			w: 2.5
		});
		groups.push({
			label: "",
			kind: "rose",
			w: 1.5
		});
		const GAP = .7;
		const margin = Math.max(10, 3.4 * u);
		const avail = W - margin * 2;
		let best = null;
		for (let R = 1; R <= 3; R++) {
			const total = groups.reduce((a, gq) => a + gq.w + GAP, 0);
			const rows = [[]];
			let acc = 0;
			for (const gq of groups) {
				if (rows.length < R && acc > 0 && acc + gq.w * .5 > total / R) {
					rows.push([]);
					acc = 0;
				}
				rows[rows.length - 1].push(gq);
				acc += gq.w + GAP;
			}
			const widest = Math.max(...rows.map((r) => r.reduce((a, gq) => a + gq.w, 0) + (r.length - 1) * GAP));
			const size = Math.min(avail / widest, 5.6 * u, H * .3 / (rows.length * 1.62));
			if (!best || size > best.size * 1.12) best = {
				rows,
				size
			};
			if (best.size >= 3.7 * u) break;
		}
		const S = best.size;
		const rowH = S * 1.62;
		const legendH = best.rows.length * rowH + S * .25;
		frame.x0 = margin;
		frame.y0 = margin;
		frame.x1 = W - margin;
		frame.y1 = H - margin * .75 - legendH;
		c.strokeStyle = INK;
		c.globalAlpha = .8;
		c.lineWidth = Math.max(1, .2 * u);
		const o1 = .55 * u;
		c.strokeRect(frame.x0 - o1, frame.y0 - o1, frame.x1 - frame.x0 + o1 * 2, frame.y1 - frame.y0 + o1 * 2);
		c.globalAlpha = .55;
		c.lineWidth = Math.max(.75, .08 * u);
		c.strokeRect(frame.x0, frame.y0, frame.x1 - frame.x0, frame.y1 - frame.y0);
		c.globalAlpha = .5;
		c.beginPath();
		const tick = (frame.y1 - frame.y0) / 12;
		for (let x = frame.x0 + tick; x < frame.x1 - 1; x += tick) {
			c.moveTo(x, frame.y0 - o1);
			c.lineTo(x, frame.y0);
			c.moveTo(x, frame.y1 + o1);
			c.lineTo(x, frame.y1);
		}
		for (let y = frame.y0 + tick; y < frame.y1 - 1; y += tick) {
			c.moveTo(frame.x0 - o1, y);
			c.lineTo(frame.x0, y);
			c.moveTo(frame.x1 + o1, y);
			c.lineTo(frame.x1, y);
		}
		c.stroke();
		c.globalAlpha = 1;
		const label = (text, x, y, px, align = "left", alpha = .72) => {
			c.save();
			c.font = `600 ${px}px ${SERIF}`;
			c.textAlign = align;
			c.textBaseline = "alphabetic";
			c.fillStyle = INK;
			c.globalAlpha = alpha;
			if ("letterSpacing" in c) c.letterSpacing = (px * .16).toFixed(2) + "px";
			c.fillText(text.toUpperCase(), x, y);
			c.restore();
		};
		const numeral = (text, x, y, px, align = "left") => {
			c.save();
			c.font = `italic ${px}px ${SERIF}`;
			c.textAlign = align;
			c.textBaseline = "middle";
			c.fillStyle = INK;
			c.globalAlpha = .86;
			c.fillText(String(text), x, y);
			c.restore();
		};
		let y = frame.y1 + o1 + S * .42;
		for (const row of best.rows) {
			const rw = row.reduce((a, gq) => a + gq.w, 0) + (row.length - 1) * GAP;
			let x = W / 2 - rw * S / 2;
			const ly = y + S * .3;
			const cy = y + S * .48 + S * .55;
			row.forEach((gq, gi) => {
				if (gi > 0) {
					c.strokeStyle = INK;
					c.globalAlpha = .22;
					c.lineWidth = Math.max(.75, .07 * u);
					c.beginPath();
					c.moveTo(x - GAP * S * .5, y + S * .1);
					c.lineTo(x - GAP * S * .5, y + S * 1.5);
					c.stroke();
					c.globalAlpha = 1;
				}
				if (gq.label) label(gq.label, x + S * .04, ly, Math.max(7, S * .21));
				if (gq.kind === "scraps") SCRAP_IDS.forEach((id, i) => {
					const n = s.scraps[id] || 0;
					const ix = x + S * .42 + i * S * 1.3;
					c.save();
					if (!n) c.globalAlpha = .32;
					drawScrap(c, id, ix, cy, S * .78);
					c.restore();
					numeral(n, ix + S * .46, cy + S * .16, Math.max(8, S * .36));
				});
				else if (gq.kind === "lamps") {
					drawLamp(c, x + S * .5, cy, S * .17);
					numeral(s.lanterns, x + S * 1.08, cy + S * .02, Math.max(9, S * .46));
				} else if (gq.kind === "cells") {
					const q = S * .26;
					const sx = x + S * .1;
					const sy = cy - q;
					const tones = [
						BIOME_GROUND.heartland,
						BIOME_GROUND.desert,
						BIOME_GROUND.pinewood,
						BIOME_GROUND.blossom
					];
					for (let i = 0; i < 4; i++) {
						c.fillStyle = tones[i];
						c.fillRect(sx + i % 2 * q, sy + (i >> 1) * q, q, q);
					}
					c.strokeStyle = INK;
					c.globalAlpha = .7;
					c.lineWidth = Math.max(.75, .08 * u);
					c.strokeRect(sx, sy, q * 2, q * 2);
					c.globalAlpha = 1;
					numeral(s.cells, x + S * .86, cy + S * .02, Math.max(9, S * .46));
				} else if (gq.kind === "rose") {
					drawRose(c, x + gq.w * S * .5, y + S * .86, S * 1.3);
					label("N", x + gq.w * S * .5, y + S * .1, Math.max(7, S * .2), "center", .8);
				}
				x += (gq.w + GAP) * S;
			});
			y += rowH;
		}
		g.tPage.needsUpdate = true;
		pageDirty = false;
	}
	function cellInfo(cx, cz) {
		try {
			return wfc.get(cx, cz);
		} catch {
			return null;
		}
	}
	const ownArt = (id) => {
		const m = MODELS[id];
		const b = m && m.biomes;
		if (!b) return false;
		const ks = Object.keys(b).filter((q) => b[q] > 0);
		return ks.length === 1 && ks[0] !== "heartland";
	};
	function drawMap() {
		const g = gfx;
		if (cellsDirty) readCells();
		buildThumbs();
		const fa = frameAspect();
		const TW = fa >= 1 ? A.texture : Math.round(A.texture * fa);
		const TH = fa >= 1 ? Math.round(A.texture / fa) : A.texture;
		const cv = g.mapCanvas;
		if (cv.width !== TW || cv.height !== TH) {
			cv.width = TW;
			cv.height = TH;
			g.layer.width = TW;
			g.layer.height = TH;
			g.tMap.dispose();
		}
		const span = view.tspan;
		const ppc = Math.min(A.thumb * 1.25, TH / (span * 1.5));
		win.x = view.tx;
		win.z = view.tz;
		win.ppc = ppc;
		win.span = span;
		win.ok = true;
		const X = (cx) => (cx - win.x) * ppc + TW / 2;
		const Y = (cz) => (cz - win.z) * ppc + TH / 2;
		const cx0 = Math.floor(win.x - TW / 2 / ppc) - 1;
		const cx1 = Math.ceil(win.x + TW / 2 / ppc) + 1;
		const cz0 = Math.floor(win.z - TH / 2 / ppc) - 1;
		const cz1 = Math.ceil(win.z + TH / 2 / ppc) + 1;
		const has = (cx, cz) => cells.has(key(cx, cz));
		const c = cv.getContext("2d");
		c.setTransform(1, 0, 0, 1, 0, 0);
		c.globalAlpha = 1;
		c.globalCompositeOperation = "source-over";
		c.clearRect(0, 0, TW, TH);
		c.strokeStyle = INK;
		c.globalAlpha = .075;
		c.lineWidth = Math.max(.75, ppc * .012);
		const stepG = ppc < 14 ? 4 : ppc < 28 ? 2 : 1;
		c.beginPath();
		for (let x = Math.ceil(cx0 / stepG) * stepG; x <= cx1; x += stepG) {
			c.moveTo(X(x - .5), 0);
			c.lineTo(X(x - .5), TH);
		}
		for (let z = Math.ceil(cz0 / stepG) * stepG; z <= cz1; z += stepG) {
			c.moveTo(0, Y(z - .5));
			c.lineTo(TW, Y(z - .5));
		}
		c.stroke();
		c.globalAlpha = 1;
		const l = g.layer.getContext("2d");
		l.setTransform(1, 0, 0, 1, 0, 0);
		l.globalAlpha = 1;
		l.globalCompositeOperation = "source-over";
		l.clearRect(0, 0, TW, TH);
		const th = g.thumbs;
		const list = [];
		for (let cz = cz0; cz <= cz1; cz++) for (let cx = cx0; cx <= cx1; cx++) {
			const mine = has(cx, cz);
			if (!mine && !(has(cx - 1, cz) || has(cx + 1, cz) || has(cx, cz - 1) || has(cx, cz + 1) || has(cx - 1, cz - 1) || has(cx + 1, cz - 1) || has(cx - 1, cz + 1) || has(cx + 1, cz + 1))) continue;
			const info = cellInfo(cx, cz);
			if (!info) continue;
			const biome = info.biome || cells.get(key(cx, cz)) || "heartland";
			const x = X(cx - .5);
			const y = Y(cz - .5);
			const sz = ppc + .6;
			const idx = th ? th.index.get(info.model) : void 0;
			if (th && idx !== void 0) {
				l.save();
				l.translate(X(cx), Y(cz));
				l.rotate((info.rot || 0) * Math.PI / 2);
				l.drawImage(th.canvas, idx % th.cols * th.S + 1, Math.floor(idx / th.cols) * th.S + 1, th.S - 2, th.S - 2, -sz / 2, -sz / 2, sz, sz);
				l.restore();
				if (!ownArt(info.model)) {
					for (const w of BIOME_WASH[biome] || []) {
						l.globalCompositeOperation = w[0];
						l.globalAlpha = w[2];
						l.fillStyle = w[1];
						l.fillRect(x, y, sz, sz);
					}
					l.globalCompositeOperation = "source-over";
					l.globalAlpha = 1;
				}
			} else {
				l.fillStyle = BIOME_GROUND[biome] || BIOME_GROUND.heartland;
				l.fillRect(x, y, sz, sz);
			}
			if (mine) list.push(cx, cz, info);
		}
		l.globalAlpha = .16;
		l.fillStyle = PAPER;
		l.fillRect(0, 0, TW, TH);
		l.globalAlpha = 1;
		const MS = 4;
		const mw = (cx1 - cx0 + 1) * MS;
		const mh = (cz1 - cz0 + 1) * MS;
		g.mask.width = mw;
		g.mask.height = mh;
		const m = g.mask.getContext("2d");
		m.fillStyle = "#fff";
		for (let i = 0; i < list.length; i += 3) {
			const cx = list[i];
			const cz = list[i + 1];
			const n = has(cx, cz - 1) ? 0 : hash(cx, cz, 1) < .5 ? 0 : 1;
			const so = has(cx, cz + 1) ? 0 : hash(cx, cz, 2) < .5 ? 0 : 1;
			const we = has(cx - 1, cz) ? 0 : hash(cx, cz, 3) < .5 ? 0 : 1;
			const ea = has(cx + 1, cz) ? 0 : hash(cx, cz, 4) < .5 ? 0 : 1;
			m.fillRect((cx - cx0) * MS - 1 + we, (cz - cz0) * MS - 1 + n, 6 - we - ea, 6 - n - so);
		}
		l.globalCompositeOperation = "destination-in";
		l.imageSmoothingEnabled = true;
		l.imageSmoothingQuality = "high";
		l.drawImage(g.mask, X(cx0 - .5), Y(cz0 - .5), (cx1 - cx0 + 1) * ppc, (cz1 - cz0 + 1) * ppc);
		l.globalCompositeOperation = "source-over";
		c.drawImage(g.layer, 0, 0);
		const jx = (vx, vz) => X(vx - .5 + (hash(vx, vz, 11) - .5) * .2);
		const jz = (vx, vz) => Y(vz - .5 + (hash(vx, vz, 12) - .5) * .2);
		const coast = new Path2D();
		const edge = (ax, az, bx, bz, k) => {
			const x0 = jx(ax, az);
			const y0 = jz(ax, az);
			const x1 = jx(bx, bz);
			const y1 = jz(bx, bz);
			const w = (hash(ax + bx, az + bz, 13 + k) - .5) * .22 * ppc;
			const nx = -(y1 - y0);
			const ny = x1 - x0;
			const nl = Math.hypot(nx, ny) || 1;
			coast.moveTo(x0, y0);
			coast.quadraticCurveTo((x0 + x1) / 2 + nx / nl * w, (y0 + y1) / 2 + ny / nl * w, x1, y1);
		};
		for (let i = 0; i < list.length; i += 3) {
			const cx = list[i];
			const cz = list[i + 1];
			if (!has(cx, cz - 1)) edge(cx, cz, cx + 1, cz, 0);
			if (!has(cx, cz + 1)) edge(cx, cz + 1, cx + 1, cz + 1, 0);
			if (!has(cx - 1, cz)) edge(cx, cz, cx, cz + 1, 1);
			if (!has(cx + 1, cz)) edge(cx + 1, cz, cx + 1, cz + 1, 1);
		}
		c.lineCap = "round";
		c.lineJoin = "round";
		c.strokeStyle = INK;
		c.globalAlpha = .1;
		c.lineWidth = Math.max(3, ppc * .3);
		c.stroke(coast);
		c.globalAlpha = .1;
		c.lineWidth = Math.max(2, ppc * .13);
		c.stroke(coast);
		c.globalAlpha = .78;
		c.lineWidth = Math.max(1.1, ppc * .035);
		c.stroke(coast);
		if (A.inkPaths || !th) {
			const lanes = new Path2D();
			const water = new Path2D();
			const DX = {
				n: 0,
				e: 1,
				s: 0,
				w: -1
			};
			const DZ = {
				n: -1,
				e: 0,
				s: 1,
				w: 0
			};
			for (let i = 0; i < list.length; i += 3) {
				const cx = list[i];
				const cz = list[i + 1];
				const so = list[i + 2].sockets;
				if (!so) continue;
				for (const d in DX) {
					const p = so[d] === "path" ? lanes : so[d] === "river" ? water : null;
					if (!p) continue;
					p.moveTo(X(cx), Y(cz));
					p.lineTo(X(cx + DX[d] * .5), Y(cz + DZ[d] * .5));
				}
			}
			if (!th) {
				c.globalAlpha = .6;
				c.strokeStyle = P.teal || "#5e9c9a";
				c.lineWidth = Math.max(1.5, ppc * .2);
				c.stroke(water);
			}
			c.globalAlpha = .62;
			c.strokeStyle = INK;
			c.lineWidth = Math.max(1, ppc * .034);
			c.setLineDash([ppc * .11, ppc * .09]);
			c.stroke(lanes);
			c.setLineDash([]);
		}
		c.globalAlpha = 1;
		const mark = Math.max(1.1, span * .075) * ppc;
		for (const p of lamps.values()) {
			const x = X(p[0]);
			const y = Y(p[1]);
			if (x > -20 && y > -20 && x < TW + 20 && y < TH + 20) drawLamp(c, x, y, Math.max(2, mark * .07));
		}
		const md = traveller.moveDir || {
			x: 0,
			z: -1
		};
		drawPin(c, X(traveller.position.x / TILE_SIZE), Y(traveller.position.z / TILE_SIZE), mark * .8, md.x, md.z);
		g.tMap.needsUpdate = true;
		mapDirty = false;
	}
	function syncUniforms(e) {
		const U = gfx.mat.uniforms;
		const W = gfx.pageCanvas.width;
		const H = gfx.pageCanvas.height;
		const cpp = view.span / Math.max(1, frame.y1 - frame.y0);
		U.uView.value.set(view.x, view.z, cpp * W, cpp * H);
		U.uWin.value.set(win.x, win.z, win.ppc / gfx.mapCanvas.width, win.ppc / gfx.mapCanvas.height);
		U.uFrame.value.set(frame.x0 / W, 1 - frame.y1 / H, frame.x1 / W, 1 - frame.y0 / H);
		U.uFeather.value.set(1.5 / W, 1.5 / H);
		U.uAspect.value = W / H;
		U.uSlide.value.set(0, -(1 - e) * 2.75, (1 - e) * -.07);
		U.uNight.value = night;
	}
	/** Does the drawn window still cover the view at a fair resolution? */
	function windowStale() {
		if (!win.ok) return 2;
		const tw = gfx.mapCanvas.width / win.ppc;
		const thh = gfx.mapCanvas.height / win.ppc;
		const vh = view.span;
		const vw = vh * frameAspect();
		if (Math.abs(view.x - win.x) + vw / 2 > tw / 2 || Math.abs(view.z - win.z) + vh / 2 > thh / 2) return 2;
		const r = view.tspan / win.span;
		if (r < .62 || r > 1.25 || Math.abs(view.tx - win.x) > vw * .2 || Math.abs(view.tz - win.z) > vh * .2) return 1;
		return 0;
	}
	const ease = (x) => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
	function liftCamera(e) {
		if (!follow || !follow.setPose || !basePose) return;
		if (e <= 0) {
			follow.setPose(basePose);
			return;
		}
		const d = basePose.distance ?? CONFIG.camera.distance;
		const p = basePose.pitchDeg ?? CONFIG.camera.pitchDeg;
		follow.setPose({
			...basePose,
			distance: d * (1 + A.lift * e),
			pitchDeg: p + (Math.max(p, A.liftPitch) - p) * e,
			driftAmp: (basePose.driftAmp || 0) * (1 - e)
		});
	}
	function setOpen(v) {
		v = !!v;
		if (v === want || headless) return;
		want = v;
		if (v) {
			ensureGfx();
			if (t <= 0 && follow) basePose = follow.pose;
			progress.save && loadLamps();
			night = t > 0 ? night : nightGoal();
			readCells();
			drawPage();
			fitView();
			drawMap();
			held.clear();
		} else {
			held.clear();
			drag = null;
			if (controls && controls.clearTarget) controls.clearTarget();
		}
	}
	const PAN = {
		KeyW: [0, -1],
		ArrowUp: [0, -1],
		KeyS: [0, 1],
		ArrowDown: [0, 1],
		KeyA: [-1, 0],
		ArrowLeft: [-1, 0],
		KeyD: [1, 0],
		ArrowRight: [1, 0]
	};
	let drag = null;
	function onKeyDown(e) {
		if (e.ctrlKey || e.metaKey || e.altKey) return;
		if (e.code === "Tab" || e.code === "KeyE") {
			e.preventDefault();
			if (!e.repeat) api.toggle();
			return;
		}
		if (!want) return;
		if (e.code === "Escape") {
			e.preventDefault();
			setOpen(false);
			return;
		}
		if (PAN[e.code]) {
			held.add(e.code);
			e.stopPropagation();
			e.preventDefault();
			return;
		}
		if (e.code === "Equal" || e.code === "NumpadAdd") {
			view.tspan *= .8;
			zoomIdle = 0;
			clampView();
		} else if (e.code === "Minus" || e.code === "NumpadSubtract") {
			view.tspan *= 1.25;
			zoomIdle = 0;
			clampView();
		}
	}
	function onKeyUp(e) {
		held.delete(e.code);
	}
	function onPointerDown(e) {
		if (!want) return;
		e.stopPropagation();
		drag = {
			x: e.clientX,
			y: e.clientY,
			moved: 0
		};
	}
	function onPointerMove(e) {
		if (!want) return;
		e.stopPropagation();
		if (!drag) return;
		const dx = e.clientX - drag.x;
		const dy = e.clientY - drag.y;
		drag.x = e.clientX;
		drag.y = e.clientY;
		drag.moved += Math.abs(dx) + Math.abs(dy);
		const fh = (frame.y1 - frame.y0) / Math.max(1, gfx.pageCanvas.height) * Math.max(1, window.innerHeight);
		const k = view.span / Math.max(1, fh);
		view.tx -= dx * k;
		view.tz -= dy * k;
		clampView();
		view.x = view.tx;
		view.z = view.tz;
	}
	function onPointerUp(e) {
		if (!want && !drag) return;
		if (want) e.stopPropagation();
		const d = drag;
		drag = null;
		if (want && d && d.moved < 6) setOpen(false);
	}
	function onWheel(e) {
		if (!want) return;
		e.preventDefault();
		view.tspan *= Math.exp(clamp(e.deltaY, -240, 240) * .0016);
		zoomIdle = 0;
		clampView();
	}
	function onBlur() {
		held.clear();
		drag = null;
	}
	if (!headless) {
		window.addEventListener("keydown", onKeyDown, true);
		window.addEventListener("keyup", onKeyUp, true);
		window.addEventListener("pointerdown", onPointerDown, true);
		window.addEventListener("pointermove", onPointerMove, true);
		window.addEventListener("pointerup", onPointerUp, true);
		window.addEventListener("pointercancel", onPointerUp, true);
		window.addEventListener("wheel", onWheel, {
			passive: false,
			capture: true
		});
		window.addEventListener("blur", onBlur);
	}
	function refresh(force) {
		if (!gfx) return;
		if (pageDirty) {
			const fy = frame.y1;
			drawPage();
			if (fy !== frame.y1) mapDirty = true;
		}
		if (mapDirty || force) drawMap();
	}
	loadIcons();
	const api = {
		/** True from the key press that opens the page until the one that closes it (walking input is ignored). */
		get open() {
			return want;
		},
		/** 0 closed .. 1 fully open (eased). */
		get amount() {
			return ease(t);
		},
		toggle() {
			setOpen(!want);
			return want;
		},
		show(v = true) {
			setOpen(v);
		},
		/** Redraw the page and the map now (they otherwise redraw only when progress changes while open). */
		redraw() {
			if (!gfx) return;
			pageDirty = true;
			mapDirty = true;
			refresh(true);
		},
		update(dt) {
			if (!gfx || !want && t <= 0) return;
			const before = t;
			t = clamp(t + (want ? dt : -dt) / Math.max(.05, A.duration), 0, 1);
			if (t !== before || t > 0 && t < 1) liftCamera(ease(t));
			if (t <= 0) {
				basePose = null;
				return;
			}
			night += (nightGoal() - night) * Math.min(1, dt * 3.5);
			if (!want) return;
			if (held.size) {
				let px = 0;
				let pz = 0;
				for (const k of held) {
					px += PAN[k][0];
					pz += PAN[k][1];
				}
				view.tx += px * view.span * A.panSpeed * dt;
				view.tz += pz * view.span * A.panSpeed * dt;
				clampView();
			}
			clampView();
			const k = 1 - Math.exp(-dt * 14);
			view.x += (view.tx - view.x) * k;
			view.z += (view.tz - view.z) * k;
			view.span += (view.tspan - view.span) * k;
			zoomIdle += dt;
			refresh(false);
			const stale = windowStale();
			if (stale === 2 || stale === 1 && zoomIdle > .18 && !drag && !held.size) drawMap();
		},
		/** Finish the transition at once (captures). */
		settle() {
			if (!gfx) return;
			t = want ? 1 : 0;
			night = nightGoal();
			clampView();
			liftCamera(t);
			if (!want) basePose = null;
			view.x = view.tx;
			view.z = view.tz;
			view.span = view.tspan;
			if (want) {
				refresh(false);
				if (windowStale()) drawMap();
			}
		},
		/** Draw the page over the finished frame (called by main.js right after post.render). Free while closed. */
		render() {
			if (!gfx || t <= 0) return;
			syncUniforms(ease(t));
			const prevTarget = renderer.getRenderTarget();
			const prevAuto = renderer.autoClear;
			renderer.setRenderTarget(null);
			renderer.autoClear = false;
			renderer.render(gfx.scene, gfx.cam);
			renderer.autoClear = prevAuto;
			renderer.setRenderTarget(prevTarget);
		},
		/** Debug / checks: the view, the frame and the helper canvases. */
		get view() {
			return view;
		},
		get debug() {
			return gfx ? {
				thumbs: gfx.thumbs && gfx.thumbs.canvas,
				map: gfx.mapCanvas,
				page: gfx.pageCanvas,
				icons: !!iconTable,
				frame,
				win,
				lamps: lamps.size
			} : null;
		},
		dispose() {
			for (const off of offs) off();
			if (!headless) {
				window.removeEventListener("keydown", onKeyDown, true);
				window.removeEventListener("keyup", onKeyUp, true);
				window.removeEventListener("pointerdown", onPointerDown, true);
				window.removeEventListener("pointermove", onPointerMove, true);
				window.removeEventListener("pointerup", onPointerUp, true);
				window.removeEventListener("pointercancel", onPointerUp, true);
				window.removeEventListener("wheel", onWheel, { capture: true });
				window.removeEventListener("blur", onBlur);
			}
			if (basePose && follow) follow.setPose(basePose);
			if (gfx) {
				gfx.tPage.dispose();
				gfx.tMap.dispose();
				gfx.geo.dispose();
				gfx.mat.dispose();
				gfx = null;
			}
			want = false;
			t = 0;
		}
	};
	return api;
}
// src/game/index.js
function createGame(deps) {
	const { seed, traveller, persist = true } = deps;
	const progress = createProgress({
		seed,
		persist
	});
	const game = { progress };
	game.armed = false;
	const spawnX = traveller.position.x;
	const spawnZ = traveller.position.z;
	const ctx = {
		...deps,
		progress,
		game
	};
	game.scraps = createScraps(ctx);
	game.lanterns = createLanterns(ctx);
	game.atlasmap = createAtlasMap(ctx);
	const parts = [
		game.scraps,
		game.lanterns,
		game.atlasmap
	];
	let lastCx = NaN;
	let lastCz = NaN;
	game.update = (dt) => {
		const p = traveller.position;
		if (!game.armed && Math.hypot(p.x - spawnX, p.z - spawnZ) > .6) game.armed = true;
		const cx = Math.round(p.x / TILE_SIZE);
		const cz = Math.round(p.z / TILE_SIZE);
		if (cx !== lastCx || cz !== lastCz) {
			lastCx = cx;
			lastCz = cz;
			progress.explore(cx, cz, biomeAt(seed, cx, cz));
		}
		for (const part of parts) part.update(dt);
	};
	game.settle = () => {
		for (const part of parts) if (part.settle) part.settle();
	};
	/** True while a full-screen game view (the atlas map) is open: walking input should be ignored. */
	game.modal = () => !!(game.atlasmap && game.atlasmap.open);
	game.dispose = () => {
		for (const part of parts) part.dispose();
	};
	return game;
}
// src/camera/views.js
var VIEWS = [
	{
		name: "journey",
		cam: {}
	},
	{
		name: "close",
		cam: {
			distance: 6.4,
			pitchDeg: 30,
			fov: 30,
			screenUp: .35,
			yawDeg: 0
		}
	},
	{
		name: "wide",
		cam: {
			distance: 14.5,
			pitchDeg: 47,
			fov: 27,
			screenUp: 1,
			yawDeg: 0,
			reach: .9
		}
	},
	{
		name: "low",
		cam: {
			distance: 7.6,
			pitchDeg: 25,
			fov: 32,
			screenUp: .5,
			yawDeg: -24,
			reach: .4
		}
	},
	{
		name: "postcard",
		cam: {
			distance: 9.6,
			pitchDeg: 30,
			fov: 30,
			screenUp: .55,
			yawDeg: 26,
			reach: .5
		}
	}
];
var KEYS = [
	"distance",
	"pitchDeg",
	"yawDeg",
	"fov",
	"screenUp",
	"reach"
];
function createViews({ follow }) {
	const C = CONFIG.camera;
	const base = {};
	for (const k of KEYS) base[k] = C[k] ?? 0;
	const cur = { ...base };
	const from = { ...base };
	const to = { ...base };
	let index = 0;
	let t = 1;
	const DUR = .9;
	function go(i) {
		index = (i % VIEWS.length + VIEWS.length) % VIEWS.length;
		for (const k of KEYS) {
			from[k] = cur[k];
			to[k] = VIEWS[index].cam[k] ?? base[k];
		}
		t = 0;
	}
	return {
		get index() {
			return index;
		},
		get name() {
			return VIEWS[index].name;
		},
		next() {
			go(index + 1);
			return VIEWS[index].name;
		},
		set(i, snap = false) {
			go(i);
			if (snap) t = .9999;
		},
		update(dt) {
			if (t >= 1) return;
			t = Math.min(1, t + dt / DUR);
			const e = t * t * (3 - 2 * t);
			for (const k of KEYS) cur[k] = from[k] + (to[k] - from[k]) * e;
			state.viewReach = cur.reach || 0;
			follow.setPose(t >= 1 && index === 0 ? null : cur);
		}
	};
}
// src/main.js
var hypot2 = (a, b) => Math.sqrt(a * a + b * b);
var params = new URLSearchParams(location.search);
var seedParam = parseInt(params.get("seed") ?? "", 10);
var seed = Number.isFinite(seedParam) ? seedParam : CONFIG.DEFAULT_SEED;
var quality = QUALITY[params.get("quality")] ? params.get("quality") : CONFIG.DEFAULT_QUALITY;
var muted = params.get("mute") === "1";
var showHint = params.get("hint") !== "0";
var enableDiag = params.get("diag") === "1";
var diagOverlay = null;
var diagLogs = [];
var MAX_DIAG_LOGS = 200;
var diagStep = 0;
function diagLog(...args) {
	const msg = args.map((a) => a && a.stack ? a.stack : String(a)).join(" ");
	const entry = {
		t: Date.now(),
		step: ++diagStep,
		msg
	};
	diagLogs.push(entry);
	if (diagLogs.length > MAX_DIAG_LOGS) diagLogs.shift();
	if (enableDiag) console.log("[DIAG]", ...args);
}
function diagError(...args) {
	const msg = args.map((a) => a && a.stack ? a.stack : String(a)).join(" ");
	const entry = {
		t: Date.now(),
		step: ++diagStep,
		msg,
		error: true
	};
	diagLogs.push(entry);
	if (diagLogs.length > MAX_DIAG_LOGS) diagLogs.shift();
	if (enableDiag) console.error("[DIAG]", ...args);
}
function createDiagOverlay() {
	if (!enableDiag) return;
	const el = document.createElement("div");
	el.id = "diag-overlay";
	el.style.cssText = "position:fixed;top:0;left:0;right:0;background:#0a0a0a;color:#0f0;font:11px/1.4 monospace;padding:8px;z-index:9999;max-height:50vh;overflow:auto;border-bottom:2px solid #0f0;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;";
	el.innerHTML = "<b>DIAGNOSTIC MODE</b> — initializing...";
	document.body.appendChild(el);
	diagOverlay = el;
	setInterval(() => {
		if (!diagOverlay) return;
		const lines = diagLogs.slice(-80).map((e) => {
			return (e.error ? "✗ " : "✓ ") + e.msg;
		});
		diagOverlay.innerHTML = "<b>DIAGNOSTIC MODE</b> — frame: " + (window.loop?.frame ?? "—") + "<br>" + lines.join("<br>");
	}, 200);
}
window.addEventListener("error", (e) => {
	diagError("Uncaught error:", e.error?.stack || e.message || "Script error.", "at", e.filename ? `${e.filename}:${e.lineno}:${e.colno}` : ":0");
});
window.addEventListener("unhandledrejection", (e) => {
	const reason = e.reason;
	diagError("Unhandled rejection:", reason?.stack || reason?.message || String(reason));
});
state.seed = seed;
state.quality = quality;
async function boot() {
	createDiagOverlay();
	diagLog("boot() started");
	const canvas = document.getElementById("atlas");
	const hint = document.getElementById("hint");
	diagLog("canvas & hint elements:", !!canvas, !!hint);
	const scene = new Scene();
	diagLog("THREE.Scene created");
	const { renderer, setSize: setRendererSize } = createRenderer({
		canvas,
		quality
	});
	diagLog("renderer created");
	const materials = createMaterials({ quality });
	diagLog("materials created");
	const assets = await loadAssets({
		materials,
		renderer,
		quality
	});
	diagLog("assets loaded");
	materials.setTextures(assets.textures);
	diagLog("materials textures set");
	const lights = createLights({
		scene,
		quality
	});
	diagLog("lights created");
	const wfc = createWFC({ seed });
	diagLog("WFC created");
	const world = createWorld({
		scene,
		assets,
		wfc,
		materials,
		quality
	});
	diagLog("world created");
	const alienPlayer = createAlienPlayer({
		scene,
		assets,
		world,
		materials
	});
	diagLog("alienPlayer created");
	const follow = createFollowCamera({ aspect: window.innerWidth / Math.max(1, window.innerHeight) });
	diagLog("follow camera created");
	const controls = createControls({
		domElement: canvas,
		camera: follow.camera,
		traveller: alienPlayer
	});
	diagLog("controls created");
	const views = createViews({ follow });
	diagLog("views created");
	const post = createPost({
		renderer,
		scene,
		camera: follow.camera,
		quality
	});
	diagLog("post-processing created");
	const audio = createPaperAudio({ muted });
	diagLog("audio created");
	const music = createMusic({ audio });
	diagLog("music created");
	const daynight = createDayNight({
		scene,
		night: params.get("night") === "1"
	});
	diagLog("daynight created");
	const life = params.get("life") === "0" || CONFIG.life.enabled === false ? null : createLife({
		scene,
		assets,
		wfc,
		world,
		daynight,
		camera: follow.camera,
		quality,
		seed
	});
	diagLog("life created:", !!life);
	const animals = createAnimals({
		scene,
		assets,
		wfc,
		world,
		daynight,
		camera: follow.camera,
		quality,
		seed
	});
	diagLog("animals created:", !!animals);
	const game = createGame({
		scene,
		renderer,
		world,
		wfc,
		traveller: alienPlayer,
		follow,
		controls,
		lights,
		post,
		daynight,
		music,
		audio,
		life,
		animals,
		assets,
		materials,
		seed,
		quality
	});
	diagLog("game created");
	follow.setAssistGate(game.modal);
	diagLog("assist gate set");
	window.addEventListener("keydown", (e) => {
		if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
		if (e.code === "KeyN") daynight.toggle();
		else if (e.code === "KeyV" && !game.modal()) views.next();
		else if (e.code === "KeyM") music.toggle();
	});
	const plainDepth = new MeshDepthMaterial();
	scene.traverse((o) => {
		if (o.isMesh && !o.isBatchedMesh && !o.isInstancedMesh && o.castShadow && !o.customDepthMaterial) o.customDepthMaterial = plainDepth;
	});
	const idle = {
		x: 0,
		z: 0
	};
	const _right = new Vector3();
	function update(dt) {
		try {
			state.time = loop.time;
			state.frame = loop.frame;
			const input = controls.getInput(dt) || idle;
			alienPlayer.update(dt, game.modal() ? idle : input);
			const p = alienPlayer.position;
			const t = state.traveller;
			t.x = p.x;
			t.y = p.y;
			t.z = p.z;
			t.dirX = alienPlayer.moveDir.x;
			t.dirZ = alienPlayer.moveDir.z;
			t.speed = alienPlayer.speed;
			_right.setFromMatrixColumn(follow.camera.matrixWorld, 0);
			const rl = hypot2(_right.x, _right.z) || 1;
			state.listener.x = p.x;
			state.listener.z = p.z;
			state.listener.rightX = _right.x / rl;
			state.listener.rightZ = _right.z / rl;
			world.update(dt, p, alienPlayer.moveDir);
			views.update(dt);
			follow.update(dt, alienPlayer);
			daynight.update(dt);
			if (life) life.update(dt, p, follow.camera);
			if (animals) animals.update(dt);
			game.update(dt);
			lights.update(dt, alienPlayer, follow.camera);
			materials.update(dt);
			if (enableDiag && loop.frame < 5) diagLog("update frame", loop.frame, "OK");
		} catch (e) {
			diagError("update threw:", e);
			throw e;
		}
	}
	function render(dt) {
		try {
			post.setFocus(follow.focusPoint);
			post.render(dt);
			game.atlasmap.render();
			if (enableDiag && loop.frame < 5) diagLog("render frame", loop.frame, "OK");
		} catch (e) {
			diagError("render threw:", e);
			throw e;
		}
	}
	const loop = createLoop({
		update,
		render
	});
	diagLog("loop created");
	function resize() {
		const w = Math.max(1, window.innerWidth);
		const h = Math.max(1, window.innerHeight);
		setRendererSize(w, h);
		follow.setAspect(w / h);
		post.setSize(w, h);
		bus.emit("resize", {
			width: w,
			height: h,
			dpr: renderer.getPixelRatio()
		});
	}
	window.addEventListener("resize", resize);
	if (showHint) {
		hint.classList.add("on");
		bus.once("input:first", () => hint.classList.remove("on"));
	} else hint.remove();
	function initialPosition() {
		const x = 0;
		const z = 0;
		if (world.isWalkable(x, z)) return [x, z];
		for (let r = .25; r <= TILE_SIZE * 3; r += .25) for (let i = 0; i < 16; i++) {
			const a = i / 16 * Math.PI * 2;
			const nx = x + Math.cos(a) * r;
			const nz = z + Math.sin(a) * r;
			if (world.isWalkable(nx, nz)) return [nx, nz];
		}
		return [x, z];
	}
	if (animals) await animals.ready;
	diagLog("animals ready");
	resize();
	diagLog("resize done");
	const [x, z] = initialPosition();
	diagLog("initial position:", x, z);
	alienPlayer.teleport(x, z);
	diagLog("alienPlayer teleported");
	controls.clearTarget();
	diagLog("controls cleared");
	update(0);
	diagLog("update(0) done");
	follow.snap(alienPlayer);
	diagLog("follow snapped");
	_right.setFromMatrixColumn(follow.camera.matrixWorld, 0);
	const rl = hypot2(_right.x, _right.z) || 1;
	state.listener.rightX = _right.x / rl;
	state.listener.rightZ = _right.z / rl;
	diagLog("listener init done");
	if (world.faceCamera) world.faceCamera();
	diagLog("faceCamera done");
	if (life) life.update(0, alienPlayer.position, follow.camera);
	diagLog("life update(0) done");
	lights.update(0, alienPlayer, follow.camera);
	diagLog("lights update(0) done");
	render(0);
	diagLog("render(0) done — FIRST FRAME");
	window.__debug = {
		loop,
		game,
		traveller: alienPlayer,
		world,
		wfc,
		renderer,
		scene,
		camera: follow.camera,
		assets,
		materials,
		post,
		follow,
		controls,
		views,
		lights,
		audio,
		music,
		daynight,
		life,
		animals,
		state
	};
	diagLog("__debug exposed");
	loop.start();
	diagLog("loop.start() called — ANIMATION LOOP STARTED");
}
boot().catch((err) => {
	diagError("[atlas] boot failed", err);
	console.error("[atlas] boot failed", err);
	throw err;
});
