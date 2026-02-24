/**
 * NPC SYSTEM
 * Simple humanoid figures that walk around the museum,
 * pausing at exhibits to give the space a lived-in feel.
 */

const NPCSystem = (() => {
    const NPC_SPEED = 1.2;
    const NPC_HEIGHT = 1.65;
    const PAUSE_TIME = 4; // seconds to pause at waypoints
    const NPC_RADIUS = 0.3;

    const npcs = [];
    const allNPCMeshes = [];

    // Muted, natural clothing colors
    const OUTFITS = [
        { body: 0x3a4a5c, pants: 0x2a2a35, skin: 0xd4a574, hair: 0x2c1810 },
        { body: 0x6b4c3b, pants: 0x333340, skin: 0xc68642, hair: 0x1a1a1a },
        { body: 0x4a5a4a, pants: 0x35302a, skin: 0xe8c4a0, hair: 0x8b6914 },
        { body: 0x5c3a3a, pants: 0x2a2a2a, skin: 0xb87333, hair: 0x1c1008 },
    ];

    // Waypoint paths through the museum
    const PATHS = [
        // NPC 1: Lobby -> Trilobite -> Lobby -> Archaeopteryx -> loop
        [
            { x: 3, z: 3 },
            { x: -5, z: 0 },
            { x: -12, z: 0, pause: true },
            { x: -18, z: -3, pause: true },
            { x: -18, z: 3, pause: true },
            { x: -12, z: 0 },
            { x: -5, z: 0 },
            { x: 3, z: -3 },
            { x: 5, z: 0 },
            { x: 12, z: 0, pause: true },
            { x: 18, z: 3, pause: true },
            { x: 12, z: 0 },
            { x: 5, z: 0 },
            { x: 3, z: 3 },
        ],
        // NPC 2: Lobby -> Neanderthal -> back
        [
            { x: -3, z: -3 },
            { x: 0, z: -5 },
            { x: 0, z: -12, pause: true },
            { x: -3, z: -18, pause: true },
            { x: 3, z: -18, pause: true },
            { x: 0, z: -12 },
            { x: 0, z: -5 },
            { x: -3, z: 3 },
            { x: 0, z: 5 },
            { x: 0, z: 10, pause: true },
            { x: 0, z: 5 },
            { x: -3, z: -3 },
        ],
        // NPC 3: Wanders exhibit halls
        [
            { x: 4, z: -2 },
            { x: 5, z: 0 },
            { x: 14, z: 0, pause: true },
            { x: 14, z: -3, pause: true },
            { x: 14, z: 3, pause: true },
            { x: 5, z: 0 },
            { x: 0, z: -5 },
            { x: 0, z: -15, pause: true },
            { x: 3, z: -17, pause: true },
            { x: 0, z: -10 },
            { x: 0, z: -5 },
            { x: -4, z: 2 },
        ],
        // NPC 4: Slow wanderer in lobby and info wing
        [
            { x: 2, z: 2 },
            { x: -2, z: -2 },
            { x: 2, z: -2 },
            { x: 0, z: 5 },
            { x: 0, z: 10, pause: true },
            { x: 3, z: 12, pause: true },
            { x: -3, z: 12, pause: true },
            { x: 0, z: 8 },
            { x: 0, z: 5 },
            { x: -2, z: 2 },
            { x: 2, z: 2 },
        ],
    ];

    function createNPCMesh(outfit) {
        const group = new THREE.Group();

        const skinMat = new THREE.MeshStandardMaterial({
            color: outfit.skin, roughness: 0.8, metalness: 0
        });
        const bodyMat = new THREE.MeshStandardMaterial({
            color: outfit.body, roughness: 0.7, metalness: 0.05
        });
        const pantsMat = new THREE.MeshStandardMaterial({
            color: outfit.pants, roughness: 0.8, metalness: 0.05
        });
        const hairMat = new THREE.MeshStandardMaterial({
            color: outfit.hair, roughness: 0.9, metalness: 0
        });

        // Head
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 10), skinMat);
        head.position.y = 1.52;
        head.castShadow = true;
        group.add(head);

        // Hair (slightly larger half-sphere on top)
        const hair = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 10, 0, Math.PI * 2, 0, Math.PI / 2), hairMat);
        hair.position.y = 1.55;
        group.add(hair);

        // Neck
        const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.1, 8), skinMat);
        neck.position.y = 1.38;
        group.add(neck);

        // Torso (upper body)
        const torso = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.35, 0.18), bodyMat);
        torso.position.y = 1.15;
        torso.castShadow = true;
        group.add(torso);

        // Lower torso / hips
        const hips = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.15, 0.16), pantsMat);
        hips.position.y = 0.9;
        group.add(hips);

        // Left arm
        const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.08), bodyMat);
        leftArm.position.set(-0.2, 1.12, 0);
        leftArm.castShadow = true;
        group.add(leftArm);

        // Right arm
        const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.08), bodyMat);
        rightArm.position.set(0.2, 1.12, 0);
        rightArm.castShadow = true;
        group.add(rightArm);

        // Left hand
        const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), skinMat);
        leftHand.position.set(-0.2, 0.92, 0);
        group.add(leftHand);

        // Right hand
        const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), skinMat);
        rightHand.position.set(0.2, 0.92, 0);
        group.add(rightHand);

        // Left leg
        const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.4, 0.1), pantsMat);
        leftLeg.position.set(-0.08, 0.62, 0);
        leftLeg.name = 'leftLeg';
        leftLeg.castShadow = true;
        group.add(leftLeg);

        // Right leg
        const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.4, 0.1), pantsMat);
        rightLeg.position.set(0.08, 0.62, 0);
        rightLeg.name = 'rightLeg';
        rightLeg.castShadow = true;
        group.add(rightLeg);

        // Left shoe
        const shoeMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.5 });
        const leftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.16), shoeMat);
        leftShoe.position.set(-0.08, 0.4, 0.02);
        leftShoe.name = 'leftShoe';
        group.add(leftShoe);

        // Right shoe
        const rightShoe = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.16), shoeMat);
        rightShoe.position.set(0.08, 0.4, 0.02);
        rightShoe.name = 'rightShoe';
        group.add(rightShoe);

        return group;
    }

    function init(scene) {
        PATHS.forEach((path, i) => {
            const outfit = OUTFITS[i % OUTFITS.length];
            const mesh = createNPCMesh(outfit);
            mesh.position.set(path[0].x, 0, path[0].z);
            mesh.castShadow = true;
            scene.add(mesh);

            npcs.push({
                mesh: mesh,
                path: path,
                currentWaypoint: 0,
                pauseTimer: 0,
                isPaused: false,
                walkTime: Math.random() * 10, // offset animation phase
                speed: NPC_SPEED * (0.8 + Math.random() * 0.4) // slight speed variation
            });

            allNPCMeshes.push(mesh);
        });
    }

    function update(delta, walls) {
        npcs.forEach(npc => {
            if (npc.isPaused) {
                npc.pauseTimer -= delta;
                if (npc.pauseTimer <= 0) {
                    npc.isPaused = false;
                    npc.currentWaypoint = (npc.currentWaypoint + 1) % npc.path.length;
                }
                // Idle animation - slight body sway
                npc.walkTime += delta * 0.5;
                const sway = Math.sin(npc.walkTime) * 0.01;
                npc.mesh.rotation.y += sway * delta;
                return;
            }

            const target = npc.path[npc.currentWaypoint];
            const pos = npc.mesh.position;
            const dx = target.x - pos.x;
            const dz = target.z - pos.z;
            const dist = Math.sqrt(dx * dx + dz * dz);

            if (dist < 0.3) {
                // Reached waypoint
                if (target.pause) {
                    npc.isPaused = true;
                    npc.pauseTimer = PAUSE_TIME + Math.random() * 2;
                } else {
                    npc.currentWaypoint = (npc.currentWaypoint + 1) % npc.path.length;
                }
                return;
            }

            // Move toward target
            const dirX = dx / dist;
            const dirZ = dz / dist;
            const moveSpeed = npc.speed * delta;

            // Face movement direction
            npc.mesh.rotation.y = Math.atan2(dirX, dirZ);

            // Try movement with simple collision check
            const newX = pos.x + dirX * moveSpeed;
            const newZ = pos.z + dirZ * moveSpeed;

            // Simple boundary check (stay within museum)
            const maxBound = 22;
            if (Math.abs(newX) < maxBound && Math.abs(newZ) < maxBound) {
                pos.x = newX;
                pos.z = newZ;
            } else {
                // Skip to next waypoint if stuck
                npc.currentWaypoint = (npc.currentWaypoint + 1) % npc.path.length;
            }

            // Walking animation
            npc.walkTime += delta * 6;
            const legSwing = Math.sin(npc.walkTime) * 0.25;
            const armSwing = Math.sin(npc.walkTime) * 0.15;

            // Animate legs
            npc.mesh.children.forEach(child => {
                if (child.name === 'leftLeg' || child.name === 'leftShoe') {
                    child.position.z = (child.name === 'leftShoe' ? 0.02 : 0) + Math.sin(npc.walkTime) * 0.08;
                }
                if (child.name === 'rightLeg' || child.name === 'rightShoe') {
                    child.position.z = (child.name === 'rightShoe' ? 0.02 : 0) + Math.sin(npc.walkTime + Math.PI) * 0.08;
                }
            });

            // Subtle body bob
            npc.mesh.position.y = Math.abs(Math.sin(npc.walkTime * 2)) * 0.02;
        });
    }

    return {
        init,
        update
    };
})();
