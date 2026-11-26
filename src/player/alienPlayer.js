// Alien player controller (3D movement, replaces paper traveller).
// API: { position, velocity, update(dt, input), teleport(x,z), getHeight() }
// input: { x, z } normalized direction vector (from controls)

import * as THREE from 'three';
import { CONFIG } from '../core/config.js';
import { state } from '../core/state.js';

const GRAVITY = -24;
const JUMP_SPEED = 10;
const WALK_SPEED = 3.5;
const RUN_SPEED = 7;
const ACCELERATION = 30;
const AIR_ACCELERATION = 15;
const TURN_SPEED = 8;
const BOB_SPEED = 8;
const BOB_AMOUNT = 0.02;

export function createAlienPlayer({ scene, assets, world }) {
    const model = assets.alien_player;
    if (!model) {
        console.error('[alienPlayer] alien_player.glb not loaded!');
        return createFallbackPlayer(scene);
    }

    const group = new THREE.Group();
    group.name = 'alien-player-root';
    scene.add(group);

    // Clone the model
    const playerModel = model.clone(true);
    group.add(playerModel);

    // Find parts for animation
    const body = playerModel.getObjectByName('body');
    const head = playerModel.getObjectByName('head');
    const leg_l = playerModel.getObjectByName('leg_l');
    const leg_r = playerModel.getObjectByName('leg_r');
    const arm_l = playerModel.getObjectByName('arm_l');
    const arm_r = playerModel.getObjectByName('arm_r');

    // Enable shadows
    playerModel.traverse((o) => {
        if (o.isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;
        }
    });

    // Physics state
    const velocity = new THREE.Vector3();
    const moveDir = new THREE.Vector3();
    let onGround = false;
    let speed = 0;
    let walkTime = 0;

    // Collider: capsule approximated by sphere at feet + raycast
    const PLAYER_RADIUS = 0.22;
    const PLAYER_HEIGHT = CONFIG.TRAVELLER_HEIGHT; // 0.6

    // World collision checks (for camera/controls pathfinding)
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

    function checkGround() {
        const pos = group.position;
        const groundY = getGroundHeight(pos.x, pos.z);
        return pos.y <= groundY + 0.02;
    }

    function update(dt, input) {
        const pos = group.position;
        const isRunning = input && input.run;

        // Horizontal movement
        if (input && (Math.abs(input.x) > 0.01 || Math.abs(input.z) > 0.01)) {
            // Calculate target direction
            moveDir.set(input.x, 0, input.z).normalize();

            // Smooth rotation toward move direction
            const targetAngle = Math.atan2(moveDir.x, moveDir.z);
            let currentAngle = group.rotation.y;
            let diff = targetAngle - currentAngle;
            diff = (diff + Math.PI) % (Math.PI * 2) - Math.PI; // wrap to [-PI, PI]
            currentAngle += diff * Math.min(1, TURN_SPEED * dt);
            group.rotation.y = currentAngle;

            // Acceleration
            const targetSpeed = isRunning ? RUN_SPEED : WALK_SPEED;
            const accel = onGround ? ACCELERATION : AIR_ACCELERATION;
            speed = THREE.MathUtils.lerp(speed, targetSpeed, Math.min(1, accel * dt));

            velocity.x = moveDir.x * speed;
            velocity.z = moveDir.z * speed;

            walkTime += dt * speed * 1.5;
        } else {
            // Decelerate
            const decel = onGround ? ACCELERATION * 2 : AIR_ACCELERATION;
            speed = THREE.MathUtils.lerp(speed, 0, Math.min(1, decel * dt));
            velocity.x = THREE.MathUtils.lerp(velocity.x, 0, Math.min(1, decel * dt));
            velocity.z = THREE.MathUtils.lerp(velocity.z, 0, Math.min(1, decel * dt));
            walkTime = 0;
        }

        // Jump
        if (input && input.jump && onGround) {
            velocity.y = JUMP_SPEED;
            onGround = false;
        }

        // Gravity
        velocity.y += GRAVITY * dt;

        // Apply velocity
        pos.x += velocity.x * dt;
        pos.z += velocity.z * dt;
        pos.y += velocity.y * dt;

        // Ground collision
        const groundY = getGroundHeight(pos.x, pos.z);
        if (pos.y <= groundY) {
            pos.y = groundY;
            velocity.y = 0;
            onGround = true;
        } else {
            onGround = false;
        }

        // Bob animation while walking
        if (speed > 0.5 && onGround) {
            const bob = Math.sin(walkTime) * BOB_AMOUNT * (speed / WALK_SPEED);
            playerModel.position.y = bob;

            // Leg swing
            const swing = Math.sin(walkTime) * 0.3 * (speed / WALK_SPEED);
            if (leg_l) leg_l.rotation.x = swing;
            if (leg_r) leg_r.rotation.x = -swing;
            if (arm_l) arm_l.rotation.x = -swing * 0.5;
            if (arm_r) arm_r.rotation.x = swing * 0.5;

            // Body lean
            playerModel.rotation.x = Math.sin(walkTime * 0.5) * 0.02 * (speed / RUN_SPEED);
        } else {
            playerModel.position.y = 0;
            if (leg_l) leg_l.rotation.x = 0;
            if (leg_r) leg_r.rotation.x = 0;
            if (arm_l) arm_l.rotation.x = 0;
            if (arm_r) arm_r.rotation.x = 0;
            playerModel.rotation.x = 0;
        }

        // Head look (slight turn toward move direction)
        if (head) {
            head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, moveDir.x * 0.2, 0.1);
        }

        // Update state for other systems
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
        get onGround() { return onGround; },
        get speed() { return speed; }
    };
}

function createFallbackPlayer(scene) {
    const group = new THREE.Group();
    group.name = 'alien-player-fallback';
    scene.add(group);

    const geom = new THREE.SphereGeometry(0.3, 16, 16);
    const mat = new THREE.MeshStandardMaterial({ color: 0x5aff5a, roughness: 0.5, metalness: 0.1 });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.y = 0.3;
    mesh.castShadow = true;
    group.add(mesh);

    const velocity = new THREE.Vector3();
    let speed = 0;
    let onGround = true;

    function canStand(x, z) { return true; }
    function canPass(x, z) { return true; }

    function update(dt, input) {
        const pos = group.position;
        if (input && (Math.abs(input.x) > 0.01 || Math.abs(input.z) > 0.01)) {
            const moveDir = new THREE.Vector3(input.x, 0, input.z).normalize();
            const targetAngle = Math.atan2(moveDir.x, moveDir.z);
            group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetAngle, 0.15);
            speed = THREE.MathUtils.lerp(speed, 4, 0.2);
            group.position.x += moveDir.x * speed * 0.016;
            group.position.z += moveDir.z * speed * 0.016;
        } else {
            speed = THREE.MathUtils.lerp(speed, 0, 0.1);
        }
    }

    function teleport(x, z) {
        group.position.set(x, 0, z);
    }

    return {
        group,
        position: group.position,
        velocity: new THREE.Vector3(),
        moveDir: new THREE.Vector3(),
        update,
        teleport,
        getHeight: () => group.position.y,
        canStand,
        canPass,
        get onGround() { return true; },
        get speed() { return speed; }
    };
}