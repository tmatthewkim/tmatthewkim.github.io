/**
 * MUSEUM GEOMETRY
 * Builds the 3D museum: rooms, walls, floors, ceilings, doorways, and lighting.
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

    // Colors
    const COLORS = {
        floor: 0x2a2520,
        ceiling: 0x1a1a2e,
        lobbyWall: 0x3a3530,
        trilobiteWall: 0x3a3028,
        archaeopteryxWall: 0x2a3528,
        neanderthalWall: 0x302a38,
        infoWall: 0x2a2a35,
        doorFrame: 0xc9a96e,
        trim: 0x8B7355
    };

    // Store collision walls for the player
    const collisionWalls = [];
    // Store room boundaries for room detection
    const rooms = [];

    function createTexture(color, roughness) {
        const mat = new THREE.MeshStandardMaterial({
            color: color,
            roughness: roughness || 0.8,
            metalness: 0.1,
            side: THREE.DoubleSide
        });
        return mat;
    }

    function addWall(scene, x, y, z, width, height, depth, color, addCollision = true) {
        const geo = new THREE.BoxGeometry(width, height, depth);
        const mat = createTexture(color);
        const wall = new THREE.Mesh(geo, mat);
        wall.position.set(x, y, z);
        wall.castShadow = true;
        wall.receiveShadow = true;
        scene.add(wall);
        if (addCollision) {
            collisionWalls.push(wall);
        }
        return wall;
    }

    function addFloor(scene, x, z, width, depth, color) {
        const geo = new THREE.PlaneGeometry(width, depth);
        const mat = createTexture(color || COLORS.floor, 0.9);
        const floor = new THREE.Mesh(geo, mat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(x, 0, z);
        floor.receiveShadow = true;
        scene.add(floor);
        return floor;
    }

    function addCeiling(scene, x, z, width, depth) {
        const geo = new THREE.PlaneGeometry(width, depth);
        const mat = createTexture(COLORS.ceiling, 0.9);
        const ceiling = new THREE.Mesh(geo, mat);
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.set(x, WALL_HEIGHT, z);
        scene.add(ceiling);
        return ceiling;
    }

    function addDoorFrame(scene, x, z, rotation) {
        const frameColor = COLORS.doorFrame;
        const frameThick = 0.15;
        const frameDepth = WALL_THICKNESS + 0.1;

        // Left post
        const leftPost = new THREE.Mesh(
            new THREE.BoxGeometry(frameThick, DOOR_HEIGHT, frameDepth),
            createTexture(frameColor, 0.4)
        );
        leftPost.position.set(x - DOOR_WIDTH / 2, DOOR_HEIGHT / 2, z);
        if (rotation) leftPost.position.set(x, DOOR_HEIGHT / 2, z - DOOR_WIDTH / 2);

        // Right post
        const rightPost = new THREE.Mesh(
            new THREE.BoxGeometry(frameThick, DOOR_HEIGHT, frameDepth),
            createTexture(frameColor, 0.4)
        );
        rightPost.position.set(x + DOOR_WIDTH / 2, DOOR_HEIGHT / 2, z);
        if (rotation) rightPost.position.set(x, DOOR_HEIGHT / 2, z + DOOR_WIDTH / 2);

        // Top beam
        const topBeam = new THREE.Mesh(
            new THREE.BoxGeometry(rotation ? frameDepth : DOOR_WIDTH + frameThick * 2, frameThick, rotation ? DOOR_WIDTH + frameThick * 2 : frameDepth),
            createTexture(frameColor, 0.4)
        );
        topBeam.position.set(x, DOOR_HEIGHT, z);

        scene.add(leftPost, rightPost, topBeam);
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
        if (rotation) {
            sign.rotation.y = rotation;
        }
        scene.add(sign);
        return sign;
    }

    function buildLobby(scene) {
        const hs = LOBBY_SIZE / 2;
        const hy = WALL_HEIGHT / 2;

        // Floor & ceiling
        addFloor(scene, 0, 0, LOBBY_SIZE, LOBBY_SIZE);
        addCeiling(scene, 0, 0, LOBBY_SIZE, LOBBY_SIZE);

        // --- NORTH WALL (has door to Neanderthal) ---
        // Left section
        addWall(scene, -(hs - (hs - DOOR_WIDTH / 2) / 2), hy, -hs,
            (hs - DOOR_WIDTH / 2), WALL_HEIGHT, WALL_THICKNESS, COLORS.lobbyWall);
        // Right section
        addWall(scene, (hs - (hs - DOOR_WIDTH / 2) / 2), hy, -hs,
            (hs - DOOR_WIDTH / 2), WALL_HEIGHT, WALL_THICKNESS, COLORS.lobbyWall);
        // Above door
        addWall(scene, 0, DOOR_HEIGHT + (WALL_HEIGHT - DOOR_HEIGHT) / 2, -hs,
            DOOR_WIDTH, WALL_HEIGHT - DOOR_HEIGHT, WALL_THICKNESS, COLORS.lobbyWall);
        addDoorFrame(scene, 0, -hs, false);
        addRoomLabel(scene, 'Neanderthal Wing', 0, DOOR_HEIGHT + 0.6, -hs + 0.2, 0);

        // --- SOUTH WALL (has door to Info Wing) ---
        addWall(scene, -(hs - (hs - DOOR_WIDTH / 2) / 2), hy, hs,
            (hs - DOOR_WIDTH / 2), WALL_HEIGHT, WALL_THICKNESS, COLORS.lobbyWall);
        addWall(scene, (hs - (hs - DOOR_WIDTH / 2) / 2), hy, hs,
            (hs - DOOR_WIDTH / 2), WALL_HEIGHT, WALL_THICKNESS, COLORS.lobbyWall);
        addWall(scene, 0, DOOR_HEIGHT + (WALL_HEIGHT - DOOR_HEIGHT) / 2, hs,
            DOOR_WIDTH, WALL_HEIGHT - DOOR_HEIGHT, WALL_THICKNESS, COLORS.lobbyWall);
        addDoorFrame(scene, 0, hs, false);
        addRoomLabel(scene, 'Info Wing', 0, DOOR_HEIGHT + 0.6, hs - 0.2, Math.PI);

        // --- WEST WALL (has door to Trilobite) ---
        addWall(scene, -hs, hy, -(hs - (hs - DOOR_WIDTH / 2) / 2),
            WALL_THICKNESS, WALL_HEIGHT, (hs - DOOR_WIDTH / 2), COLORS.lobbyWall);
        addWall(scene, -hs, hy, (hs - (hs - DOOR_WIDTH / 2) / 2),
            WALL_THICKNESS, WALL_HEIGHT, (hs - DOOR_WIDTH / 2), COLORS.lobbyWall);
        addWall(scene, -hs, DOOR_HEIGHT + (WALL_HEIGHT - DOOR_HEIGHT) / 2, 0,
            WALL_THICKNESS, WALL_HEIGHT - DOOR_HEIGHT, DOOR_WIDTH, COLORS.lobbyWall);
        addDoorFrame(scene, -hs, 0, true);
        addRoomLabel(scene, 'Trilobite Wing', -hs + 0.2, DOOR_HEIGHT + 0.6, 0, Math.PI / 2);

        // --- EAST WALL (has door to Archaeopteryx) ---
        addWall(scene, hs, hy, -(hs - (hs - DOOR_WIDTH / 2) / 2),
            WALL_THICKNESS, WALL_HEIGHT, (hs - DOOR_WIDTH / 2), COLORS.lobbyWall);
        addWall(scene, hs, hy, (hs - (hs - DOOR_WIDTH / 2) / 2),
            WALL_THICKNESS, WALL_HEIGHT, (hs - DOOR_WIDTH / 2), COLORS.lobbyWall);
        addWall(scene, hs, DOOR_HEIGHT + (WALL_HEIGHT - DOOR_HEIGHT) / 2, 0,
            WALL_THICKNESS, WALL_HEIGHT - DOOR_HEIGHT, DOOR_WIDTH, COLORS.lobbyWall);
        addDoorFrame(scene, hs, 0, true);
        addRoomLabel(scene, 'Archaeopteryx Wing', hs - 0.2, DOOR_HEIGHT + 0.6, 0, -Math.PI / 2);

        rooms.push({
            name: 'Lobby',
            minX: -hs, maxX: hs,
            minZ: -hs, maxZ: hs
        });
    }

    function buildHall(scene, offsetX, offsetZ, axis, wallColor, roomName) {
        // axis: 'x' means hall extends along X, 'z' means along Z
        const hw = HALL_WIDTH / 2;
        const hd = HALL_DEPTH / 2;
        const hy = WALL_HEIGHT / 2;

        let cx, cz, w, d;
        if (axis === 'x') {
            // Hall extends along X axis (Trilobite left, Archaeopteryx right)
            cx = offsetX + (offsetX < 0 ? -hd : hd);
            cz = offsetZ;
            w = HALL_DEPTH;
            d = HALL_WIDTH;

            addFloor(scene, cx, cz, w, d);
            addCeiling(scene, cx, cz, w, d);

            // Top wall (negative Z)
            addWall(scene, cx, hy, cz - hw, w, WALL_HEIGHT, WALL_THICKNESS, wallColor);
            // Bottom wall (positive Z)
            addWall(scene, cx, hy, cz + hw, w, WALL_HEIGHT, WALL_THICKNESS, wallColor);

            // Far end wall
            const farX = offsetX < 0 ? cx - hd : cx + hd;
            addWall(scene, farX, hy, cz, WALL_THICKNESS, WALL_HEIGHT, d, wallColor);

            rooms.push({
                name: roomName,
                minX: cx - hd, maxX: cx + hd,
                minZ: cz - hw, maxZ: cz + hw
            });

        } else {
            // Hall extends along Z axis (Neanderthal north, Info south)
            cx = offsetX;
            cz = offsetZ + (offsetZ < 0 ? -hd : hd);
            w = HALL_WIDTH;
            d = HALL_DEPTH;

            addFloor(scene, cx, cz, w, d);
            addCeiling(scene, cx, cz, w, d);

            // Left wall (negative X)
            addWall(scene, cx - hw, hy, cz, WALL_THICKNESS, WALL_HEIGHT, d, wallColor);
            // Right wall (positive X)
            addWall(scene, cx + hw, hy, cz, WALL_THICKNESS, WALL_HEIGHT, d, wallColor);

            // Far end wall
            const farZ = offsetZ < 0 ? cz - hd : cz + hd;
            addWall(scene, cx, hy, farZ, w, WALL_HEIGHT, WALL_THICKNESS, wallColor);

            rooms.push({
                name: roomName,
                minX: cx - hw, maxX: cx + hw,
                minZ: cz - hd, maxZ: cz + hd
            });
        }

        return { cx, cz, axis };
    }

    function addLighting(scene) {
        // Ambient light for base illumination
        const ambient = new THREE.AmbientLight(0xfff5e6, 0.4);
        scene.add(ambient);

        // Main overhead light in lobby
        const lobbyLight = new THREE.PointLight(0xffe8cc, 1.0, 25);
        lobbyLight.position.set(0, WALL_HEIGHT - 0.5, 0);
        lobbyLight.castShadow = true;
        scene.add(lobbyLight);

        // Hall lights
        const hallPositions = [
            [-LOBBY_SIZE / 2 - HALL_DEPTH / 2, WALL_HEIGHT - 0.5, 0],      // Trilobite
            [LOBBY_SIZE / 2 + HALL_DEPTH / 2, WALL_HEIGHT - 0.5, 0],       // Archaeopteryx
            [0, WALL_HEIGHT - 0.5, -LOBBY_SIZE / 2 - HALL_DEPTH / 2],      // Neanderthal
            [0, WALL_HEIGHT - 0.5, LOBBY_SIZE / 2 + INFO_HALL_DEPTH / 2],  // Info
        ];

        hallPositions.forEach(pos => {
            const light = new THREE.PointLight(0xffe8cc, 0.8, 22);
            light.position.set(pos[0], pos[1], pos[2]);
            scene.add(light);
        });

        // Subtle directional light for shadows
        const dirLight = new THREE.DirectionalLight(0xfff0dd, 0.3);
        dirLight.position.set(5, WALL_HEIGHT, 5);
        scene.add(dirLight);
    }

    function addCoverLetterPedestal(scene) {
        // Pedestal in lobby center
        const pedestalGeo = new THREE.BoxGeometry(1.5, 1, 1.5);
        const pedestalMat = createTexture(COLORS.trim, 0.5);
        const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
        pedestal.position.set(0, 0.5, 0);
        pedestal.castShadow = true;
        scene.add(pedestal);
        collisionWalls.push(pedestal);

        // Angled display surface
        const displayGeo = new THREE.BoxGeometry(1.3, 0.05, 1.0);
        const displayMat = createTexture(0x1a1a2e, 0.3);
        const display = new THREE.Mesh(displayGeo, displayMat);
        display.position.set(0, 1.1, 0);
        display.rotation.x = -0.3;
        scene.add(display);

        // "Cover Letter" label on pedestal
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#8B7355';
        ctx.fillRect(0, 0, 256, 64);
        ctx.fillStyle = '#e8d5b7';
        ctx.font = '20px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Cover Letter', 128, 32);

        const labelTexture = new THREE.CanvasTexture(canvas);
        const labelMat = new THREE.MeshBasicMaterial({ map: labelTexture });
        const labelGeo = new THREE.PlaneGeometry(1.3, 0.325);
        const label = new THREE.Mesh(labelGeo, labelMat);
        label.position.set(0, 0.5, 0.76);
        scene.add(label);

        return display;
    }

    function build(scene) {
        // Build lobby
        buildLobby(scene);

        // Build exhibit halls
        const trilobiteHall = buildHall(scene, -LOBBY_SIZE / 2, 0, 'x', COLORS.trilobiteWall, 'Trilobite Wing');
        const archaeopteryxHall = buildHall(scene, LOBBY_SIZE / 2, 0, 'x', COLORS.archaeopteryxWall, 'Archaeopteryx Wing');
        const neanderthalHall = buildHall(scene, 0, -LOBBY_SIZE / 2, 'z', COLORS.neanderthalWall, 'Neanderthal Wing');

        // Info wing (slightly smaller)
        const infoHall = buildHall(scene, 0, LOBBY_SIZE / 2, 'z', COLORS.infoWall, 'Info Wing');

        // Add lighting
        addLighting(scene);

        // Add cover letter pedestal
        const coverLetterDisplay = addCoverLetterPedestal(scene);

        // Floor trim / baseboards
        const baseMat = createTexture(COLORS.trim, 0.6);

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

    function getCollisionWalls() {
        return collisionWalls;
    }

    function getCurrentRoom(x, z) {
        for (const room of rooms) {
            if (x >= room.minX && x <= room.maxX && z >= room.minZ && z <= room.maxZ) {
                return room.name;
            }
        }
        return 'Lobby';
    }

    function getRooms() {
        return rooms;
    }

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
