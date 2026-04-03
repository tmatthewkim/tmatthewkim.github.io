/**
 * NPC SYSTEM
 * Diverse humanoid figures that walk around the museum with collision detection,
 * pausing at exhibits to give the space a lived-in feel.
 */

const NPCSystem = (() => {
    const NPC_SPEED = 1.2;
    const NPC_HEIGHT = 1.65;
    const PAUSE_TIME = 4;
    const NPC_RADIUS = 0.35;

    const npcs = [];
    const allNPCMeshes = [];

    // Diverse outfits with varied skin tones, hair, and body types
    const OUTFITS = [
        // Woman, dark skin, natural hair
        { body: 0x8b3a3a, pants: 0x2a2a35, skin: 0x6b3e26, hair: 0x1a1008, hairStyle: 'afro', gender: 'f', height: 0.95 },
        // Man, light skin, brown hair
        { body: 0x3a4a5c, pants: 0x333340, skin: 0xe0b894, hair: 0x5c3a1e, hairStyle: 'short', gender: 'm', height: 1.02 },
        // Woman, East Asian, black hair, long
        { body: 0x4a5a6a, pants: 0x35302a, skin: 0xf0ce98, hair: 0x0e0e0e, hairStyle: 'long', gender: 'f', height: 0.93 },
        // Man, South Asian, dark hair
        { body: 0x5c4a3a, pants: 0x2a2a2a, skin: 0xb87a4a, hair: 0x101010, hairStyle: 'short', gender: 'm', height: 1.0 },
        // Woman, medium-brown skin, auburn hair
        { body: 0x6b5a6b, pants: 0x303038, skin: 0xc88c5c, hair: 0x6b2e14, hairStyle: 'bun', gender: 'f', height: 0.96 },
        // Man, dark skin, short hair
        { body: 0x3a5a4a, pants: 0x282830, skin: 0x5a3420, hair: 0x0a0806, hairStyle: 'short', gender: 'm', height: 1.04 },
    ];

    // Waypoint paths through the museum
    // DOORS at: West x=-12 z=0, East x=12 z=0, North x=0 z=-12, South x=0 z=12
    // Door width 4.5 — NPCs must pass through center (z≈0 or x≈0) at doors
    // Benches at: (-18,0), (18,0), (0,-18), (0,18)
    // Fossils at wing centers: (-23,0), (23,0), (0,-23)
    const PATHS = [
        // NPC 1: Grand Hall -> Trilobite -> Grand Hall -> Archaeopteryx
        [
            { x: 4, z: 2 },
            { x: -6, z: 1 },
            { x: -12, z: 0 },          // through west door
            { x: -16, z: -4, pause: true },
            { x: -26, z: -4, pause: true },
            { x: -26, z: 4, pause: true },
            { x: -16, z: 4 },
            { x: -12, z: 0 },          // back through west door
            { x: -4, z: -1 },
            { x: 6, z: -1 },
            { x: 12, z: 0 },           // through east door
            { x: 16, z: -4, pause: true },
            { x: 26, z: 4, pause: true },
            { x: 16, z: 4 },
            { x: 12, z: 0 },           // back through east door
            { x: 4, z: 2 },
        ],
        // NPC 2: Grand Hall -> Neanderthal -> Grand Hall
        [
            { x: -3, z: -4 },
            { x: -1, z: -8 },
            { x: 0, z: -12 },          // through north door
            { x: -4, z: -16, pause: true },
            { x: -4, z: -26, pause: true },
            { x: 4, z: -26, pause: true },
            { x: 4, z: -16 },
            { x: 0, z: -12 },          // back through north door
            { x: 2, z: -6 },
            { x: 3, z: 3 },
            { x: -3, z: -4 },
        ],
        // NPC 3: Archaeopteryx + Neanderthal
        [
            { x: 5, z: -1 },
            { x: 12, z: 0 },           // through east door
            { x: 20, z: -4, pause: true },
            { x: 26, z: -4, pause: true },
            { x: 26, z: 4, pause: true },
            { x: 20, z: 4 },
            { x: 12, z: 0 },           // back through east door
            { x: 2, z: -4 },
            { x: 0, z: -12 },          // through north door
            { x: 4, z: -20, pause: true },
            { x: -4, z: -26, pause: true },
            { x: -4, z: -16 },
            { x: 0, z: -12 },          // back through north door
            { x: -2, z: -4 },
            { x: -5, z: 2 },
        ],
        // NPC 4: Grand Hall + Info Wing
        [
            { x: 3, z: 3 },
            { x: -3, z: 3 },
            { x: 1, z: 8 },
            { x: 0, z: 12 },           // through south door
            { x: 4, z: 20, pause: true },
            { x: 4, z: 26, pause: true },
            { x: -4, z: 26, pause: true },
            { x: -4, z: 20 },
            { x: 0, z: 12 },           // back through south door
            { x: -1, z: 6 },
            { x: 3, z: 3 },
        ],
        // NPC 5: Trilobite + Info
        [
            { x: -5, z: 2 },
            { x: -8, z: 0 },
            { x: -12, z: 0 },          // through west door
            { x: -20, z: -4, pause: true },
            { x: -26, z: -4, pause: true },
            { x: -20, z: 4 },
            { x: -12, z: 0 },          // back through west door
            { x: -4, z: 4 },
            { x: -1, z: 8 },
            { x: 0, z: 12 },           // through south door
            { x: -4, z: 20, pause: true },
            { x: 0, z: 12 },           // back through south door
            { x: -2, z: 6 },
            { x: -5, z: 2 },
        ],
        // NPC 6: Grand Hall wanderer (stays in center area)
        [
            { x: 5, z: -3 },
            { x: -5, z: -3 },
            { x: -5, z: 3, pause: true },
            { x: 5, z: 3 },
            { x: 5, z: -3 },
        ],
    ];

    function createNPCMesh(outfit) {
        const group = new THREE.Group();
        const sc = outfit.height || 1;

        const skinMat = new THREE.MeshStandardMaterial({ color: outfit.skin, roughness: 0.8, metalness: 0 });
        const bodyMat = new THREE.MeshStandardMaterial({ color: outfit.body, roughness: 0.7, metalness: 0.05 });
        const pantsMat = new THREE.MeshStandardMaterial({ color: outfit.pants, roughness: 0.8, metalness: 0.05 });
        const hairMat = new THREE.MeshStandardMaterial({ color: outfit.hair, roughness: 0.9, metalness: 0 });
        const shoeMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.5 });

        const isFemale = outfit.gender === 'f';
        const shoulderW = isFemale ? 0.28 : 0.34;
        const hipW = isFemale ? 0.26 : 0.28;

        // Head
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 10), skinMat);
        head.position.y = 1.52 * sc;
        head.castShadow = true;
        group.add(head);

        // Hair based on style
        if (outfit.hairStyle === 'afro') {
            const afro = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 10), hairMat);
            afro.position.y = 1.56 * sc;
            afro.scale.set(1, 0.85, 1);
            group.add(afro);
        } else if (outfit.hairStyle === 'long') {
            // Top cap - slightly larger than head, only top hemisphere
            const top = new THREE.Mesh(new THREE.SphereGeometry(0.135, 10, 10, 0, Math.PI * 2, 0, Math.PI * 0.55), hairMat);
            top.position.y = 1.52 * sc;
            group.add(top);
            // Back hair flowing down - connects to head, tapers down
            const back = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.08, 0.28, 8), hairMat);
            back.position.set(0, 1.37 * sc, -0.10);
            group.add(back);
        } else if (outfit.hairStyle === 'bun') {
            // Top cap - slightly larger than head, only top hemisphere
            const top = new THREE.Mesh(new THREE.SphereGeometry(0.135, 10, 10, 0, Math.PI * 2, 0, Math.PI * 0.55), hairMat);
            top.position.y = 1.52 * sc;
            group.add(top);
            // Small bun on top-back of head
            const bun = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), hairMat);
            bun.position.set(0, 1.60 * sc, -0.10);
            group.add(bun);
        } else {
            // Short hair (default) - tight cap on top of head
            const hair = new THREE.Mesh(new THREE.SphereGeometry(0.135, 10, 10, 0, Math.PI * 2, 0, Math.PI * 0.45), hairMat);
            hair.position.y = 1.52 * sc;
            group.add(hair);
        }

        // Neck
        const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.1, 8), skinMat);
        neck.position.y = 1.38 * sc;
        group.add(neck);

        // Torso
        const torso = new THREE.Mesh(new THREE.BoxGeometry(shoulderW, 0.35, 0.18), bodyMat);
        torso.position.y = 1.15 * sc;
        torso.castShadow = true;
        group.add(torso);

        // Hips
        const hips = new THREE.Mesh(new THREE.BoxGeometry(hipW, 0.15, 0.16), pantsMat);
        hips.position.y = 0.9 * sc;
        group.add(hips);

        // Arms
        const armW = isFemale ? 0.07 : 0.08;
        const armOff = shoulderW / 2 + armW / 2;
        const leftArm = new THREE.Mesh(new THREE.BoxGeometry(armW, 0.33, armW), bodyMat);
        leftArm.position.set(-armOff, 1.12 * sc, 0);
        leftArm.name = 'leftArm';
        group.add(leftArm);

        const rightArm = new THREE.Mesh(new THREE.BoxGeometry(armW, 0.33, armW), bodyMat);
        rightArm.position.set(armOff, 1.12 * sc, 0);
        rightArm.name = 'rightArm';
        group.add(rightArm);

        // Hands
        const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 6), skinMat);
        leftHand.position.set(-armOff, 0.93 * sc, 0);
        leftHand.name = 'leftHand';
        group.add(leftHand);

        const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 6), skinMat);
        rightHand.position.set(armOff, 0.93 * sc, 0);
        rightHand.name = 'rightHand';
        group.add(rightHand);

        // Legs
        const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.4, 0.1), pantsMat);
        leftLeg.position.set(-0.08, 0.62 * sc, 0);
        leftLeg.name = 'leftLeg';
        group.add(leftLeg);

        const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.4, 0.1), pantsMat);
        rightLeg.position.set(0.08, 0.62 * sc, 0);
        rightLeg.name = 'rightLeg';
        group.add(rightLeg);

        // Shoes
        const leftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.16), shoeMat);
        leftShoe.position.set(-0.08, 0.4 * sc, 0.02);
        leftShoe.name = 'leftShoe';
        group.add(leftShoe);

        const rightShoe = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.16), shoeMat);
        rightShoe.position.set(0.08, 0.4 * sc, 0.02);
        rightShoe.name = 'rightShoe';
        group.add(rightShoe);

        return group;
    }

    function init(scene) {
        PATHS.forEach((path, i) => {
            const outfit = OUTFITS[i % OUTFITS.length];
            const mesh = createNPCMesh(outfit);
            mesh.position.set(path[0].x, 0, path[0].z);
            scene.add(mesh);

            npcs.push({
                mesh: mesh,
                path: path,
                currentWaypoint: 0,
                pauseTimer: 0,
                isPaused: false,
                walkTime: Math.random() * 10,
                speed: NPC_SPEED * (0.8 + Math.random() * 0.4),
                stuckTimer: 0
            });

            allNPCMeshes.push(mesh);
        });
    }

    // Check NPC collision against museum walls
    function checkNPCCollision(x, z, walls) {
        const bb = new THREE.Box3(
            new THREE.Vector3(x - NPC_RADIUS, 0, z - NPC_RADIUS),
            new THREE.Vector3(x + NPC_RADIUS, NPC_HEIGHT, z + NPC_RADIUS)
        );
        for (const wall of walls) {
            if (!wall.geometry.boundingBox) wall.geometry.computeBoundingBox();
            const wbb = wall.geometry.boundingBox.clone();
            wbb.applyMatrix4(wall.matrixWorld);
            if (bb.intersectsBox(wbb)) return true;
        }
        return false;
    }

    function update(delta, walls) {
        npcs.forEach(npc => {
            if (npc.isPaused) {
                npc.pauseTimer -= delta;
                if (npc.pauseTimer <= 0) {
                    npc.isPaused = false;
                    npc.currentWaypoint = (npc.currentWaypoint + 1) % npc.path.length;
                }
                // Idle sway
                npc.walkTime += delta * 0.5;
                const sway = Math.sin(npc.walkTime) * 0.01;
                npc.mesh.rotation.y += sway * delta;
                // Keep on floor
                npc.mesh.position.y = 0;
                return;
            }

            const target = npc.path[npc.currentWaypoint];
            const pos = npc.mesh.position;
            const dx = target.x - pos.x;
            const dz = target.z - pos.z;
            const dist = Math.sqrt(dx * dx + dz * dz);

            if (dist < 0.5) {
                if (target.pause) {
                    npc.isPaused = true;
                    npc.pauseTimer = PAUSE_TIME + Math.random() * 2;
                    npc.stuckTimer = 0;
                } else {
                    npc.currentWaypoint = (npc.currentWaypoint + 1) % npc.path.length;
                    npc.stuckTimer = 0;
                }
                return;
            }

            const dirX = dx / dist;
            const dirZ = dz / dist;
            const moveSpeed = npc.speed * delta;

            // Face movement direction
            npc.mesh.rotation.y = Math.atan2(dirX, dirZ);

            const newX = pos.x + dirX * moveSpeed;
            const newZ = pos.z + dirZ * moveSpeed;

            // Check collision against walls
            const blocked = checkNPCCollision(newX, newZ, walls);

            if (!blocked) {
                pos.x = newX;
                pos.z = newZ;
                npc.stuckTimer = 0;
            } else {
                // Try X only
                if (!checkNPCCollision(newX, pos.z, walls)) {
                    pos.x = newX;
                    npc.stuckTimer = 0;
                } else if (!checkNPCCollision(pos.x, newZ, walls)) {
                    // Try Z only
                    pos.z = newZ;
                    npc.stuckTimer = 0;
                } else {
                    // Fully blocked — try perpendicular dodge
                    const perpX = pos.x + dirZ * moveSpeed;
                    const perpZ = pos.z - dirX * moveSpeed;
                    if (!checkNPCCollision(perpX, perpZ, walls)) {
                        pos.x = perpX;
                        pos.z = perpZ;
                        npc.stuckTimer = 0;
                    } else {
                        npc.stuckTimer += delta;
                        if (npc.stuckTimer > 0.8) {
                            // Skip waypoint quickly if truly stuck
                            npc.currentWaypoint = (npc.currentWaypoint + 1) % npc.path.length;
                            npc.stuckTimer = 0;
                        }
                    }
                }
            }

            // Walking animation
            npc.walkTime += delta * 6;

            npc.mesh.children.forEach(child => {
                if (child.name === 'leftLeg' || child.name === 'leftShoe') {
                    child.position.z = (child.name === 'leftShoe' ? 0.02 : 0) + Math.sin(npc.walkTime) * 0.08;
                }
                if (child.name === 'rightLeg' || child.name === 'rightShoe') {
                    child.position.z = (child.name === 'rightShoe' ? 0.02 : 0) + Math.sin(npc.walkTime + Math.PI) * 0.08;
                }
                if (child.name === 'leftArm' || child.name === 'leftHand') {
                    child.position.z = Math.sin(npc.walkTime + Math.PI) * 0.05;
                }
                if (child.name === 'rightArm' || child.name === 'rightHand') {
                    child.position.z = Math.sin(npc.walkTime) * 0.05;
                }
            });

            // Keep grounded
            pos.y = 0;
        });
    }

    return {
        init,
        update
    };
})();
