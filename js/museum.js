/**
 * MUSEUM GEOMETRY
 * Builds the 3D museum with procedural textures, architectural details,
 * furniture, and enhanced lighting for a realistic museum feel.
 */

const Museum = (() => {
    // Room dimensions
    const WALL_HEIGHT = 4;
    const WALL_THICKNESS = 0.3;
    const LOBBY_SIZE = 14;
    const HALL_WIDTH = 10;
    const HALL_DEPTH = 16;
    const DOOR_WIDTH = 3;
    const DOOR_HEIGHT = 3.2;
    const INFO_HALL_DEPTH = 12;

    const collisionWalls = [];
    const rooms = [];

    // ===================== PROCEDURAL TEXTURES =====================

    function createMarbleFloorTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        const tileSize = 128;
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
                const isLight = (x + y) % 2 === 0;
                const base = isLight ? [62, 55, 50] : [35, 30, 26];

                ctx.fillStyle = `rgb(${base[0]}, ${base[1]}, ${base[2]})`;
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

                // Marble veins
                ctx.strokeStyle = `rgba(${base[0] + 20}, ${base[1] + 18}, ${base[2] + 15}, 0.3)`;
                ctx.lineWidth = 1;
                for (let v = 0; v < 4; v++) {
                    ctx.beginPath();
                    const sx = x * tileSize + Math.random() * tileSize;
                    const sy = y * tileSize + Math.random() * tileSize;
                    ctx.moveTo(sx, sy);
                    ctx.bezierCurveTo(
                        sx + Math.random() * 60 - 30, sy + Math.random() * 60 - 30,
                        sx + Math.random() * 80 - 40, sy + Math.random() * 80 - 40,
                        sx + Math.random() * 100 - 50, sy + Math.random() * 100 - 50
                    );
                    ctx.stroke();
                }

                // Tile grout lines
                ctx.strokeStyle = 'rgba(20, 18, 15, 0.6)';
                ctx.lineWidth = 2;
                ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }

    function createWallTexture(baseColor) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        const r = (baseColor >> 16) & 0xff;
        const g = (baseColor >> 8) & 0xff;
        const b = baseColor & 0xff;

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(0, 0, 256, 256);

        // Subtle stucco/plaster noise
        for (let i = 0; i < 3000; i++) {
            const px = Math.random() * 256;
            const py = Math.random() * 256;
            const variation = Math.random() * 16 - 8;
            ctx.fillStyle = `rgba(${r + variation}, ${g + variation}, ${b + variation}, 0.4)`;
            ctx.fillRect(px, py, 2, 2);
        }

        // Subtle horizontal plaster lines
        for (let y = 0; y < 256; y += 32 + Math.random() * 20) {
            ctx.strokeStyle = `rgba(${r - 10}, ${g - 10}, ${b - 10}, 0.15)`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(256, y + Math.random() * 4 - 2);
            ctx.stroke();
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }

    function createCeilingTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, 512, 512);

        // Coffered panel pattern
        const panelSize = 128;
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
                const px = x * panelSize;
                const py = y * panelSize;

                // Panel border (raised edge)
                ctx.strokeStyle = 'rgba(40, 40, 60, 0.8)';
                ctx.lineWidth = 3;
                ctx.strokeRect(px + 8, py + 8, panelSize - 16, panelSize - 16);

                // Inner recess
                ctx.strokeStyle = 'rgba(15, 15, 30, 0.5)';
                ctx.lineWidth = 1;
                ctx.strokeRect(px + 16, py + 16, panelSize - 32, panelSize - 32);

                // Subtle inner fill
                ctx.fillStyle = 'rgba(22, 22, 40, 0.6)';
                ctx.fillRect(px + 16, py + 16, panelSize - 32, panelSize - 32);
            }
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }

    function createWoodTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#3d2b1f';
        ctx.fillRect(0, 0, 256, 64);

        // Wood grain lines
        for (let i = 0; i < 30; i++) {
            const y = Math.random() * 64;
            ctx.strokeStyle = `rgba(${50 + Math.random() * 20}, ${30 + Math.random() * 15}, ${15 + Math.random() * 10}, 0.4)`;
            ctx.lineWidth = 1 + Math.random();
            ctx.beginPath();
            ctx.moveTo(0, y);
            for (let x = 0; x < 256; x += 10) {
                ctx.lineTo(x, y + Math.sin(x * 0.05) * 2 + Math.random() * 2 - 1);
            }
            ctx.stroke();
        }

        return new THREE.CanvasTexture(canvas);
    }

    // Cache textures
    let floorTexture, ceilingTexture, woodTexture;
    const wallTextures = {};

    function getFloorMaterial() {
        if (!floorTexture) floorTexture = createMarbleFloorTexture();
        return new THREE.MeshStandardMaterial({
            map: floorTexture,
            roughness: 0.4,
            metalness: 0.1,
            side: THREE.DoubleSide
        });
    }

    function getCeilingMaterial() {
        if (!ceilingTexture) ceilingTexture = createCeilingTexture();
        return new THREE.MeshStandardMaterial({
            map: ceilingTexture,
            roughness: 0.9,
            metalness: 0.05,
            side: THREE.DoubleSide
        });
    }

    function getWallMaterial(color) {
        if (!wallTextures[color]) wallTextures[color] = createWallTexture(color);
        return new THREE.MeshStandardMaterial({
            map: wallTextures[color],
            roughness: 0.85,
            metalness: 0.05,
            side: THREE.DoubleSide
        });
    }

    function getWoodMaterial() {
        if (!woodTexture) woodTexture = createWoodTexture();
        return new THREE.MeshStandardMaterial({
            map: woodTexture,
            roughness: 0.6,
            metalness: 0.1
        });
    }

    // ===================== COLORS =====================

    const COLORS = {
        floor: 0x2a2520,
        ceiling: 0x1a1a2e,
        lobbyWall: 0x3a3530,
        trilobiteWall: 0x3a3028,
        archaeopteryxWall: 0x2a3528,
        neanderthalWall: 0x302a38,
        infoWall: 0x2a2a35,
        doorFrame: 0xc9a96e,
        trim: 0x8B7355,
        column: 0x4a4540,
        bench: 0x3d2b1f,
        plant: 0x2d5a27,
        pot: 0x6b4226
    };

    // ===================== BUILDING FUNCTIONS =====================

    function addWall(scene, x, y, z, width, height, depth, color, addCollision = true) {
        const geo = new THREE.BoxGeometry(width, height, depth);
        const mat = getWallMaterial(color);
        const wall = new THREE.Mesh(geo, mat);
        wall.position.set(x, y, z);
        wall.castShadow = true;
        wall.receiveShadow = true;
        scene.add(wall);
        if (addCollision) collisionWalls.push(wall);
        return wall;
    }

    function addFloor(scene, x, z, width, depth) {
        const geo = new THREE.PlaneGeometry(width, depth);
        const mat = getFloorMaterial();
        const floor = new THREE.Mesh(geo, mat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(x, 0, z);
        floor.receiveShadow = true;
        scene.add(floor);
        return floor;
    }

    function addCeiling(scene, x, z, width, depth) {
        const geo = new THREE.PlaneGeometry(width, depth);
        const mat = getCeilingMaterial();
        const ceiling = new THREE.Mesh(geo, mat);
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.set(x, WALL_HEIGHT, z);
        scene.add(ceiling);
        return ceiling;
    }

    // ===================== ARCHITECTURAL DETAILS =====================

    function addColumn(scene, x, z) {
        const colMat = new THREE.MeshStandardMaterial({
            color: COLORS.column,
            roughness: 0.5,
            metalness: 0.15
        });

        // Base (wider)
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.38, 0.25, 16), colMat);
        base.position.set(x, 0.125, z);
        base.castShadow = true;
        scene.add(base);

        // Base plinth
        const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 0.8), colMat);
        plinth.position.set(x, 0.05, z);
        scene.add(plinth);

        // Shaft
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.28, WALL_HEIGHT - 0.7, 16), colMat);
        shaft.position.set(x, WALL_HEIGHT / 2, z);
        shaft.castShadow = true;
        scene.add(shaft);

        // Capital (wider top)
        const capital = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.25, 0.3, 16), colMat);
        capital.position.set(x, WALL_HEIGHT - 0.35, z);
        scene.add(capital);

        // Capital top plate
        const capPlate = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 0.8), colMat);
        capPlate.position.set(x, WALL_HEIGHT - 0.15, z);
        scene.add(capPlate);

        // Add collision for column
        const colBox = new THREE.Mesh(new THREE.BoxGeometry(0.6, WALL_HEIGHT, 0.6));
        colBox.position.set(x, WALL_HEIGHT / 2, z);
        colBox.visible = false;
        scene.add(colBox);
        collisionWalls.push(colBox);
    }

    function addBaseboard(scene, x, z, length, rotation) {
        const geo = new THREE.BoxGeometry(length, 0.15, 0.08);
        const mat = getWoodMaterial();
        const board = new THREE.Mesh(geo, mat);
        board.position.set(x, 0.075, z);
        if (rotation) board.rotation.y = rotation;
        scene.add(board);
    }

    function addCrownMolding(scene, x, z, length, rotation) {
        const geo = new THREE.BoxGeometry(length, 0.1, 0.12);
        const mat = getWoodMaterial();
        const molding = new THREE.Mesh(geo, mat);
        molding.position.set(x, WALL_HEIGHT - 0.05, z);
        if (rotation) molding.rotation.y = rotation;
        scene.add(molding);
    }

    function addWainscoting(scene, x, z, length, rotation) {
        // Horizontal trim line at chair rail height
        const geo = new THREE.BoxGeometry(length, 0.06, 0.06);
        const mat = getWoodMaterial();
        const rail = new THREE.Mesh(geo, mat);
        rail.position.set(x, 1.2, z);
        if (rotation) rail.rotation.y = rotation;
        scene.add(rail);
    }

    // ===================== FURNITURE =====================

    function addBench(scene, x, z, rotation) {
        const woodMat = getWoodMaterial();
        const metalMat = new THREE.MeshStandardMaterial({
            color: 0x2a2a2a,
            roughness: 0.3,
            metalness: 0.8
        });

        const group = new THREE.Group();

        // Seat
        const seat = new THREE.Mesh(new THREE.BoxGeometry(2, 0.08, 0.6), woodMat);
        seat.position.y = 0.5;
        seat.castShadow = true;
        group.add(seat);

        // Metal legs (4)
        const legGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8);
        [[-0.85, -0.22], [-0.85, 0.22], [0.85, -0.22], [0.85, 0.22]].forEach(([lx, lz]) => {
            const leg = new THREE.Mesh(legGeo, metalMat);
            leg.position.set(lx, 0.25, lz);
            leg.castShadow = true;
            group.add(leg);
        });

        // Cross bars
        const barGeo = new THREE.BoxGeometry(1.7, 0.03, 0.03);
        const bar = new THREE.Mesh(barGeo, metalMat);
        bar.position.set(0, 0.2, 0);
        group.add(bar);

        group.position.set(x, 0, z);
        if (rotation) group.rotation.y = rotation;
        scene.add(group);

        // Collision
        const benchCol = new THREE.Mesh(new THREE.BoxGeometry(2, 0.6, 0.6));
        benchCol.position.set(x, 0.3, z);
        if (rotation) benchCol.rotation.y = rotation;
        benchCol.visible = false;
        scene.add(benchCol);
        collisionWalls.push(benchCol);
    }

    function addPottedPlant(scene, x, z) {
        // Terracotta pot
        const potMat = new THREE.MeshStandardMaterial({
            color: COLORS.pot, roughness: 0.8, metalness: 0.05
        });
        const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.18, 0.5, 12), potMat);
        pot.position.set(x, 0.25, z);
        pot.castShadow = true;
        scene.add(pot);

        // Pot rim
        const rim = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.03, 8, 16), potMat);
        rim.position.set(x, 0.5, z);
        rim.rotation.x = Math.PI / 2;
        scene.add(rim);

        // Soil
        const soil = new THREE.Mesh(
            new THREE.CircleGeometry(0.23, 12),
            new THREE.MeshStandardMaterial({ color: 0x2a1f15, roughness: 1 })
        );
        soil.position.set(x, 0.49, z);
        soil.rotation.x = -Math.PI / 2;
        scene.add(soil);

        // Foliage - multiple green spheres
        const leafMat = new THREE.MeshStandardMaterial({
            color: COLORS.plant, roughness: 0.8, metalness: 0
        });
        const positions = [[0, 0.85, 0], [0.12, 0.75, 0.08], [-0.1, 0.78, -0.06], [0.05, 0.7, -0.1], [-0.08, 0.72, 0.1]];
        positions.forEach(([px, py, pz]) => {
            const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.15 + Math.random() * 0.08, 8, 8), leafMat);
            leaf.position.set(x + px, py, z + pz);
            leaf.castShadow = true;
            scene.add(leaf);
        });

        // Collision
        const plantCol = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1, 8));
        plantCol.position.set(x, 0.5, z);
        plantCol.visible = false;
        scene.add(plantCol);
        collisionWalls.push(plantCol);
    }

    function addRopeBarrier(scene, x1, z1, x2, z2) {
        const metalMat = new THREE.MeshStandardMaterial({
            color: 0xc9a96e, roughness: 0.3, metalness: 0.7
        });

        // Stanchions
        [{ x: x1, z: z1 }, { x: x2, z: z2 }].forEach(({ x, z }) => {
            // Post
            const post = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.9, 8), metalMat);
            post.position.set(x, 0.45, z);
            post.castShadow = true;
            scene.add(post);

            // Base
            const base = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.05, 12), metalMat);
            base.position.set(x, 0.025, z);
            scene.add(base);

            // Top ball
            const ball = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), metalMat);
            ball.position.set(x, 0.92, z);
            scene.add(ball);
        });

        // Rope (curved tube)
        const ropePoints = [];
        const dx = x2 - x1;
        const dz = z2 - z1;
        for (let t = 0; t <= 1; t += 0.1) {
            const sag = Math.sin(t * Math.PI) * 0.12;
            ropePoints.push(new THREE.Vector3(
                x1 + dx * t,
                0.82 - sag,
                z1 + dz * t
            ));
        }
        const ropePath = new THREE.CatmullRomCurve3(ropePoints);
        const ropeGeo = new THREE.TubeGeometry(ropePath, 12, 0.015, 6, false);
        const ropeMat = new THREE.MeshStandardMaterial({
            color: 0x8B0000, roughness: 0.7, metalness: 0.1
        });
        const rope = new THREE.Mesh(ropeGeo, ropeMat);
        rope.castShadow = true;
        scene.add(rope);
    }

    function addWallSconce(scene, x, y, z, rotationY) {
        // Bracket
        const bracketMat = new THREE.MeshStandardMaterial({
            color: COLORS.doorFrame, roughness: 0.3, metalness: 0.6
        });
        const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.15, 0.12), bracketMat);
        bracket.position.set(x, y, z);
        scene.add(bracket);

        // Light shade (cone)
        const shadeMat = new THREE.MeshStandardMaterial({
            color: 0xf5e6cc, roughness: 0.5, metalness: 0.1,
            emissive: 0xffe8cc, emissiveIntensity: 0.3
        });
        const shade = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.18, 8, 1, true), shadeMat);
        shade.position.set(x, y + 0.1, z);
        shade.rotation.x = Math.PI; // upside down cone
        scene.add(shade);

        // Actual point light
        const light = new THREE.PointLight(0xffe8cc, 0.3, 6);
        light.position.set(x, y + 0.15, z);
        scene.add(light);
    }

    // ===================== DOOR & LABEL =====================

    function addDoorFrame(scene, x, z, rotation) {
        const frameMat = new THREE.MeshStandardMaterial({
            color: COLORS.doorFrame, roughness: 0.3, metalness: 0.5
        });
        const frameThick = 0.15;
        const frameDepth = WALL_THICKNESS + 0.1;

        if (!rotation) {
            // Door along X axis
            const leftPost = new THREE.Mesh(new THREE.BoxGeometry(frameThick, DOOR_HEIGHT, frameDepth), frameMat);
            leftPost.position.set(x - DOOR_WIDTH / 2, DOOR_HEIGHT / 2, z);
            const rightPost = new THREE.Mesh(new THREE.BoxGeometry(frameThick, DOOR_HEIGHT, frameDepth), frameMat);
            rightPost.position.set(x + DOOR_WIDTH / 2, DOOR_HEIGHT / 2, z);

            // Arch top (curved)
            const archGeo = new THREE.TorusGeometry(DOOR_WIDTH / 2, frameThick / 2, 8, 16, Math.PI);
            const arch = new THREE.Mesh(archGeo, frameMat);
            arch.position.set(x, DOOR_HEIGHT, z);
            arch.rotation.z = Math.PI;
            scene.add(leftPost, rightPost, arch);
        } else {
            // Door along Z axis
            const leftPost = new THREE.Mesh(new THREE.BoxGeometry(frameDepth, DOOR_HEIGHT, frameThick), frameMat);
            leftPost.position.set(x, DOOR_HEIGHT / 2, z - DOOR_WIDTH / 2);
            const rightPost = new THREE.Mesh(new THREE.BoxGeometry(frameDepth, DOOR_HEIGHT, frameThick), frameMat);
            rightPost.position.set(x, DOOR_HEIGHT / 2, z + DOOR_WIDTH / 2);

            const archGeo = new THREE.TorusGeometry(DOOR_WIDTH / 2, frameThick / 2, 8, 16, Math.PI);
            const arch = new THREE.Mesh(archGeo, frameMat);
            arch.position.set(x, DOOR_HEIGHT, z);
            arch.rotation.x = Math.PI;
            arch.rotation.y = Math.PI / 2;
            scene.add(leftPost, rightPost, arch);
        }
    }

    function addRoomLabel(scene, text, x, y, z, rotation) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, 512, 128);
        ctx.strokeStyle = '#c9a96e';
        ctx.lineWidth = 3;
        ctx.strokeRect(10, 10, 492, 108);

        // Decorative corners
        const cornerSize = 20;
        ctx.strokeStyle = '#c9a96e';
        ctx.lineWidth = 2;
        [[15, 15], [492, 15], [15, 113], [492, 113]].forEach(([cx, cy]) => {
            ctx.beginPath();
            ctx.arc(cx, cy, cornerSize / 3, 0, Math.PI * 2);
            ctx.stroke();
        });

        ctx.fillStyle = '#e8d5b7';
        ctx.font = '36px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 256, 64);

        const texture = new THREE.CanvasTexture(canvas);
        const mat = new THREE.MeshBasicMaterial({ map: texture });
        const geo = new THREE.PlaneGeometry(2.5, 0.625);
        const sign = new THREE.Mesh(geo, mat);
        sign.position.set(x, y, z);
        if (rotation) sign.rotation.y = rotation;
        scene.add(sign);
        return sign;
    }

    // ===================== ROOM BUILDING =====================

    function addTrimToRoom(scene, cx, cz, width, depth) {
        const hw = width / 2;
        const hd = depth / 2;
        const offset = 0.16;

        // Baseboards
        addBaseboard(scene, cx, cz - hd + offset, width, 0);
        addBaseboard(scene, cx, cz + hd - offset, width, 0);
        addBaseboard(scene, cx - hw + offset, cz, depth, Math.PI / 2);
        addBaseboard(scene, cx + hw - offset, cz, depth, Math.PI / 2);

        // Crown molding
        addCrownMolding(scene, cx, cz - hd + offset, width, 0);
        addCrownMolding(scene, cx, cz + hd - offset, width, 0);
        addCrownMolding(scene, cx - hw + offset, cz, depth, Math.PI / 2);
        addCrownMolding(scene, cx + hw - offset, cz, depth, Math.PI / 2);

        // Wainscoting
        addWainscoting(scene, cx, cz - hd + offset, width, 0);
        addWainscoting(scene, cx, cz + hd - offset, width, 0);
        addWainscoting(scene, cx - hw + offset, cz, depth, Math.PI / 2);
        addWainscoting(scene, cx + hw - offset, cz, depth, Math.PI / 2);
    }

    function buildLobby(scene) {
        const hs = LOBBY_SIZE / 2;
        const hy = WALL_HEIGHT / 2;

        addFloor(scene, 0, 0, LOBBY_SIZE, LOBBY_SIZE);
        addCeiling(scene, 0, 0, LOBBY_SIZE, LOBBY_SIZE);

        // --- NORTH WALL (door to Neanderthal) ---
        addWall(scene, -(hs - (hs - DOOR_WIDTH / 2) / 2), hy, -hs,
            (hs - DOOR_WIDTH / 2), WALL_HEIGHT, WALL_THICKNESS, COLORS.lobbyWall);
        addWall(scene, (hs - (hs - DOOR_WIDTH / 2) / 2), hy, -hs,
            (hs - DOOR_WIDTH / 2), WALL_HEIGHT, WALL_THICKNESS, COLORS.lobbyWall);
        addWall(scene, 0, DOOR_HEIGHT + (WALL_HEIGHT - DOOR_HEIGHT) / 2, -hs,
            DOOR_WIDTH, WALL_HEIGHT - DOOR_HEIGHT, WALL_THICKNESS, COLORS.lobbyWall);
        addDoorFrame(scene, 0, -hs, false);
        addRoomLabel(scene, 'Neanderthal Wing', 0, DOOR_HEIGHT + 0.6, -hs + 0.2, 0);

        // --- SOUTH WALL (door to Info) ---
        addWall(scene, -(hs - (hs - DOOR_WIDTH / 2) / 2), hy, hs,
            (hs - DOOR_WIDTH / 2), WALL_HEIGHT, WALL_THICKNESS, COLORS.lobbyWall);
        addWall(scene, (hs - (hs - DOOR_WIDTH / 2) / 2), hy, hs,
            (hs - DOOR_WIDTH / 2), WALL_HEIGHT, WALL_THICKNESS, COLORS.lobbyWall);
        addWall(scene, 0, DOOR_HEIGHT + (WALL_HEIGHT - DOOR_HEIGHT) / 2, hs,
            DOOR_WIDTH, WALL_HEIGHT - DOOR_HEIGHT, WALL_THICKNESS, COLORS.lobbyWall);
        addDoorFrame(scene, 0, hs, false);
        addRoomLabel(scene, 'Info Wing', 0, DOOR_HEIGHT + 0.6, hs - 0.2, Math.PI);

        // --- WEST WALL (door to Trilobite) ---
        addWall(scene, -hs, hy, -(hs - (hs - DOOR_WIDTH / 2) / 2),
            WALL_THICKNESS, WALL_HEIGHT, (hs - DOOR_WIDTH / 2), COLORS.lobbyWall);
        addWall(scene, -hs, hy, (hs - (hs - DOOR_WIDTH / 2) / 2),
            WALL_THICKNESS, WALL_HEIGHT, (hs - DOOR_WIDTH / 2), COLORS.lobbyWall);
        addWall(scene, -hs, DOOR_HEIGHT + (WALL_HEIGHT - DOOR_HEIGHT) / 2, 0,
            WALL_THICKNESS, WALL_HEIGHT - DOOR_HEIGHT, DOOR_WIDTH, COLORS.lobbyWall);
        addDoorFrame(scene, -hs, 0, true);
        addRoomLabel(scene, 'Trilobite Wing', -hs + 0.2, DOOR_HEIGHT + 0.6, 0, Math.PI / 2);

        // --- EAST WALL (door to Archaeopteryx) ---
        addWall(scene, hs, hy, -(hs - (hs - DOOR_WIDTH / 2) / 2),
            WALL_THICKNESS, WALL_HEIGHT, (hs - DOOR_WIDTH / 2), COLORS.lobbyWall);
        addWall(scene, hs, hy, (hs - (hs - DOOR_WIDTH / 2) / 2),
            WALL_THICKNESS, WALL_HEIGHT, (hs - DOOR_WIDTH / 2), COLORS.lobbyWall);
        addWall(scene, hs, DOOR_HEIGHT + (WALL_HEIGHT - DOOR_HEIGHT) / 2, 0,
            WALL_THICKNESS, WALL_HEIGHT - DOOR_HEIGHT, DOOR_WIDTH, COLORS.lobbyWall);
        addDoorFrame(scene, hs, 0, true);
        addRoomLabel(scene, 'Archaeopteryx Wing', hs - 0.2, DOOR_HEIGHT + 0.6, 0, -Math.PI / 2);

        // COLUMNS at lobby corners
        const colOffset = 1.2;
        addColumn(scene, -hs + colOffset, -hs + colOffset);
        addColumn(scene, hs - colOffset, -hs + colOffset);
        addColumn(scene, -hs + colOffset, hs - colOffset);
        addColumn(scene, hs - colOffset, hs - colOffset);

        // Additional columns flanking doorways
        addColumn(scene, -DOOR_WIDTH / 2 - 0.6, -hs + colOffset);
        addColumn(scene, DOOR_WIDTH / 2 + 0.6, -hs + colOffset);
        addColumn(scene, -DOOR_WIDTH / 2 - 0.6, hs - colOffset);
        addColumn(scene, DOOR_WIDTH / 2 + 0.6, hs - colOffset);

        // Wall sconces in lobby
        addWallSconce(scene, -hs + 0.3, 2.8, -3, 0);
        addWallSconce(scene, -hs + 0.3, 2.8, 3, 0);
        addWallSconce(scene, hs - 0.3, 2.8, -3, Math.PI);
        addWallSconce(scene, hs - 0.3, 2.8, 3, Math.PI);

        // Potted plants near doorways
        addPottedPlant(scene, -hs + 1.5, 0);
        addPottedPlant(scene, hs - 1.5, 0);

        rooms.push({
            name: 'Lobby',
            minX: -hs, maxX: hs,
            minZ: -hs, maxZ: hs
        });
    }

    function buildHall(scene, offsetX, offsetZ, axis, wallColor, roomName) {
        const hw = HALL_WIDTH / 2;
        const hd = HALL_DEPTH / 2;
        const hy = WALL_HEIGHT / 2;

        let cx, cz, w, d;
        if (axis === 'x') {
            cx = offsetX + (offsetX < 0 ? -hd : hd);
            cz = offsetZ;
            w = HALL_DEPTH;
            d = HALL_WIDTH;

            addFloor(scene, cx, cz, w, d);
            addCeiling(scene, cx, cz, w, d);

            addWall(scene, cx, hy, cz - hw, w, WALL_HEIGHT, WALL_THICKNESS, wallColor);
            addWall(scene, cx, hy, cz + hw, w, WALL_HEIGHT, WALL_THICKNESS, wallColor);

            const farX = offsetX < 0 ? cx - hd : cx + hd;
            addWall(scene, farX, hy, cz, WALL_THICKNESS, WALL_HEIGHT, d, wallColor);

            // Trim
            addTrimToRoom(scene, cx, cz, w, d);

            // Bench in center of hall
            addBench(scene, cx, cz, Math.PI / 2);

            // Rope barriers in front of far-end wall exhibits
            const ropeZ1 = cz - 1.2;
            const ropeZ2 = cz + 1.2;
            if (offsetX < 0) {
                addRopeBarrier(scene, farX + 1.5, ropeZ1, farX + 1.5, ropeZ2);
            } else {
                addRopeBarrier(scene, farX - 1.5, ropeZ1, farX - 1.5, ropeZ2);
            }

            // Wall sconces between exhibits
            addWallSconce(scene, cx - 3, 2.8, cz - hw + 0.3, 0);
            addWallSconce(scene, cx + 3, 2.8, cz - hw + 0.3, 0);
            addWallSconce(scene, cx - 3, 2.8, cz + hw - 0.3, Math.PI);
            addWallSconce(scene, cx + 3, 2.8, cz + hw - 0.3, Math.PI);

            // Columns at entrance
            const entranceX = offsetX < 0 ? cx + hd : cx - hd;
            addColumn(scene, entranceX, cz - hw + 1);
            addColumn(scene, entranceX, cz + hw - 1);

            rooms.push({
                name: roomName,
                minX: cx - hd, maxX: cx + hd,
                minZ: cz - hw, maxZ: cz + hw
            });

        } else {
            cx = offsetX;
            cz = offsetZ + (offsetZ < 0 ? -hd : hd);
            w = HALL_WIDTH;
            d = HALL_DEPTH;

            addFloor(scene, cx, cz, w, d);
            addCeiling(scene, cx, cz, w, d);

            addWall(scene, cx - hw, hy, cz, WALL_THICKNESS, WALL_HEIGHT, d, wallColor);
            addWall(scene, cx + hw, hy, cz, WALL_THICKNESS, WALL_HEIGHT, d, wallColor);

            const farZ = offsetZ < 0 ? cz - hd : cz + hd;
            addWall(scene, cx, hy, farZ, w, WALL_HEIGHT, WALL_THICKNESS, wallColor);

            // Trim
            addTrimToRoom(scene, cx, cz, w, d);

            // Bench
            addBench(scene, cx, cz, 0);

            // Rope barrier near far wall
            const ropeX1 = cx - 1.2;
            const ropeX2 = cx + 1.2;
            if (offsetZ < 0) {
                addRopeBarrier(scene, ropeX1, farZ + 1.5, ropeX2, farZ + 1.5);
            } else {
                addRopeBarrier(scene, ropeX1, farZ - 1.5, ropeX2, farZ - 1.5);
            }

            // Wall sconces
            addWallSconce(scene, cx - hw + 0.3, 2.8, cz - 3, Math.PI / 2);
            addWallSconce(scene, cx - hw + 0.3, 2.8, cz + 3, Math.PI / 2);
            addWallSconce(scene, cx + hw - 0.3, 2.8, cz - 3, -Math.PI / 2);
            addWallSconce(scene, cx + hw - 0.3, 2.8, cz + 3, -Math.PI / 2);

            // Columns at entrance
            const entranceZ = offsetZ < 0 ? cz + hd : cz - hd;
            addColumn(scene, cx - hw + 1, entranceZ);
            addColumn(scene, cx + hw - 1, entranceZ);

            rooms.push({
                name: roomName,
                minX: cx - hw, maxX: cx + hw,
                minZ: cz - hd, maxZ: cz + hd
            });
        }

        return { cx, cz, axis };
    }

    // ===================== LIGHTING =====================

    function addLighting(scene) {
        // Hemisphere light (warm ground, cool sky)
        const hemiLight = new THREE.HemisphereLight(0x8899bb, 0x665544, 0.3);
        scene.add(hemiLight);

        // Ambient light
        const ambient = new THREE.AmbientLight(0xfff5e6, 0.35);
        scene.add(ambient);

        // Main overhead light in lobby
        const lobbyLight = new THREE.PointLight(0xffe8cc, 1.2, 25);
        lobbyLight.position.set(0, WALL_HEIGHT - 0.5, 0);
        lobbyLight.castShadow = true;
        lobbyLight.shadow.mapSize.width = 1024;
        lobbyLight.shadow.mapSize.height = 1024;
        scene.add(lobbyLight);

        // Hall lights (two per hall for more even coverage)
        const hallConfigs = [
            { pos: [-LOBBY_SIZE / 2 - HALL_DEPTH * 0.3, 0], label: 'tri1' },
            { pos: [-LOBBY_SIZE / 2 - HALL_DEPTH * 0.7, 0], label: 'tri2' },
            { pos: [LOBBY_SIZE / 2 + HALL_DEPTH * 0.3, 0], label: 'arch1' },
            { pos: [LOBBY_SIZE / 2 + HALL_DEPTH * 0.7, 0], label: 'arch2' },
            { pos: [0, -LOBBY_SIZE / 2 - HALL_DEPTH * 0.3], label: 'nean1' },
            { pos: [0, -LOBBY_SIZE / 2 - HALL_DEPTH * 0.7], label: 'nean2' },
            { pos: [0, LOBBY_SIZE / 2 + INFO_HALL_DEPTH * 0.3], label: 'info1' },
            { pos: [0, LOBBY_SIZE / 2 + INFO_HALL_DEPTH * 0.7], label: 'info2' },
        ];

        hallConfigs.forEach(cfg => {
            const light = new THREE.PointLight(0xffe8cc, 0.6, 15);
            light.position.set(cfg.pos[0], WALL_HEIGHT - 0.5, cfg.pos[1]);
            scene.add(light);
        });

        // Subtle directional light for shadows
        const dirLight = new THREE.DirectionalLight(0xfff0dd, 0.2);
        dirLight.position.set(5, WALL_HEIGHT, 5);
        dirLight.castShadow = true;
        scene.add(dirLight);
    }

    // ===================== COVER LETTER PEDESTAL =====================

    function addCoverLetterPedestal(scene) {
        // Pedestal - marble-like material
        const pedestalMat = new THREE.MeshStandardMaterial({
            color: 0x5a5045,
            roughness: 0.4,
            metalness: 0.15
        });

        // Tiered base
        const base1 = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.15, 2.0), pedestalMat);
        base1.position.set(0, 0.075, 0);
        base1.castShadow = true;
        scene.add(base1);

        const base2 = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.15, 1.7), pedestalMat);
        base2.position.set(0, 0.225, 0);
        base2.castShadow = true;
        scene.add(base2);

        const body = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.7, 1.4), pedestalMat);
        body.position.set(0, 0.65, 0);
        body.castShadow = true;
        scene.add(body);

        collisionWalls.push(body);

        // Glass display case on top
        const glassMat = new THREE.MeshStandardMaterial({
            color: 0xaaccee,
            roughness: 0.1,
            metalness: 0.1,
            transparent: true,
            opacity: 0.2
        });
        const glassCase = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 1.0), glassMat);
        glassCase.position.set(0, 1.3, 0);
        scene.add(glassCase);

        // Display surface inside
        const displayMat = new THREE.MeshStandardMaterial({
            color: 0x1a1a2e, roughness: 0.3, metalness: 0.1
        });
        const display = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.05, 0.9), displayMat);
        display.position.set(0, 1.05, 0);
        display.rotation.x = -0.3;
        scene.add(display);

        // Spotlight on pedestal
        const spotLight = new THREE.SpotLight(0xffe8cc, 1.0, 8, Math.PI / 6, 0.5);
        spotLight.position.set(0, WALL_HEIGHT - 0.3, 0);
        spotLight.target = display;
        spotLight.castShadow = true;
        scene.add(spotLight);
        scene.add(spotLight.target);

        // "Cover Letter" label
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#5a5045';
        ctx.fillRect(0, 0, 256, 64);
        ctx.strokeStyle = '#c9a96e';
        ctx.lineWidth = 2;
        ctx.strokeRect(5, 5, 246, 54);
        ctx.fillStyle = '#e8d5b7';
        ctx.font = '20px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Cover Letter', 128, 32);

        const labelTexture = new THREE.CanvasTexture(canvas);
        const labelMat = new THREE.MeshBasicMaterial({ map: labelTexture });
        const labelGeo = new THREE.PlaneGeometry(1.3, 0.325);
        const label = new THREE.Mesh(labelGeo, labelMat);
        label.position.set(0, 0.65, 0.71);
        scene.add(label);

        return display;
    }

    // ===================== BUILD =====================

    function build(scene) {
        buildLobby(scene);

        const trilobiteHall = buildHall(scene, -LOBBY_SIZE / 2, 0, 'x', COLORS.trilobiteWall, 'Trilobite Wing');
        const archaeopteryxHall = buildHall(scene, LOBBY_SIZE / 2, 0, 'x', COLORS.archaeopteryxWall, 'Archaeopteryx Wing');
        const neanderthalHall = buildHall(scene, 0, -LOBBY_SIZE / 2, 'z', COLORS.neanderthalWall, 'Neanderthal Wing');
        const infoHall = buildHall(scene, 0, LOBBY_SIZE / 2, 'z', COLORS.infoWall, 'Info Wing');

        addLighting(scene);

        // Lobby trim
        addTrimToRoom(scene, 0, 0, LOBBY_SIZE, LOBBY_SIZE);

        const coverLetterDisplay = addCoverLetterPedestal(scene);

        return {
            halls: {
                trilobite: trilobiteHall,
                archaeopteryx: archaeopteryxHall,
                neanderthal: neanderthalHall,
                info: infoHall
            },
            coverLetterDisplay
        };
    }

    function getCollisionWalls() { return collisionWalls; }

    function getCurrentRoom(x, z) {
        for (const room of rooms) {
            if (x >= room.minX && x <= room.maxX && z >= room.minZ && z <= room.maxZ) {
                return room.name;
            }
        }
        return 'Lobby';
    }

    function getRooms() { return rooms; }

    return {
        build,
        getCollisionWalls,
        getCurrentRoom,
        getRooms,
        WALL_HEIGHT,
        LOBBY_SIZE,
        HALL_WIDTH,
        HALL_DEPTH
    };
})();
