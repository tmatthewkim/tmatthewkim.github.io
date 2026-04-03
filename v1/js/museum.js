/**
 * MUSEUM GEOMETRY
 * Grand natural history museum inspired by the Field Museum.
 * Single grand hall with four exhibit wings in a cross layout.
 */

const Museum = (() => {
    const WALL_HEIGHT = 8;
    const WALL_THICKNESS = 0.4;
    const DOOR_WIDTH = 4.5;
    const DOOR_HEIGHT = 5.5;

    // Grand hall — one big open space (Field Museum style)
    const GRAND_HALL_WIDTH = 24;
    const GRAND_HALL_DEPTH = 24;

    // Exhibit wings
    const HALL_WIDTH = 12;
    const HALL_DEPTH = 22;

    const collisionWalls = [];
    const rooms = [];

    // ===================== HIGH-QUALITY PROCEDURAL TEXTURES =====================

    function createMarbleTexture(light, dark, tileCount) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        const ts = canvas.width / tileCount;

        for (let tx = 0; tx < tileCount; tx++) {
            for (let ty = 0; ty < tileCount; ty++) {
                const isL = (tx + ty) % 2 === 0;
                const c = isL ? light : dark;
                ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
                ctx.fillRect(tx * ts, ty * ts, ts, ts);

                // Marble veining
                for (let v = 0; v < 3; v++) {
                    const sx = tx * ts + Math.random() * ts;
                    const sy = ty * ts + Math.random() * ts;
                    const grad = ctx.createLinearGradient(sx, sy, sx + Math.random() * 80 - 40, sy + Math.random() * 80 - 40);
                    grad.addColorStop(0, `rgba(${c[0] + 30},${c[1] + 25},${c[2] + 20},0.15)`);
                    grad.addColorStop(1, `rgba(${c[0] - 10},${c[1] - 10},${c[2] - 8},0.05)`);
                    ctx.strokeStyle = grad;
                    ctx.lineWidth = 0.5 + Math.random() * 1.5;
                    ctx.beginPath();
                    ctx.moveTo(sx, sy);
                    const cp1x = sx + Math.random() * 100 - 50;
                    const cp1y = sy + Math.random() * 100 - 50;
                    const cp2x = sx + Math.random() * 120 - 60;
                    const cp2y = sy + Math.random() * 120 - 60;
                    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, sx + Math.random() * 140 - 70, sy + Math.random() * 140 - 70);
                    ctx.stroke();
                }

                // Subtle color variation patches
                for (let p = 0; p < 2; p++) {
                    const px = tx * ts + Math.random() * ts;
                    const py = ty * ts + Math.random() * ts;
                    const r = 10 + Math.random() * 20;
                    const grd = ctx.createRadialGradient(px, py, 0, px, py, r);
                    grd.addColorStop(0, `rgba(${c[0] + 15},${c[1] + 12},${c[2] + 10},0.12)`);
                    grd.addColorStop(1, 'rgba(0,0,0,0)');
                    ctx.fillStyle = grd;
                    ctx.fillRect(px - r, py - r, r * 2, r * 2);
                }

                // Grout lines
                ctx.strokeStyle = `rgba(${Math.min(c[0] - 30, 255)},${Math.min(c[1] - 30, 255)},${Math.min(c[2] - 25, 255)},0.4)`;
                ctx.lineWidth = 2;
                ctx.strokeRect(tx * ts, ty * ts, ts, ts);
            }
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.anisotropy = 4;
        return texture;
    }

    function createStoneWallTexture(baseColor) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        const r = (baseColor >> 16) & 0xff;
        const g = (baseColor >> 8) & 0xff;
        const b = baseColor & 0xff;

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(0, 0, 512, 512);

        // Stone block pattern
        const blockH = 64;
        for (let row = 0; row < 8; row++) {
            const offset = (row % 2) * 40;
            const y = row * blockH;
            ctx.strokeStyle = `rgba(${r - 20},${g - 20},${b - 18},0.2)`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(512, y);
            ctx.stroke();

            for (let col = 0; col < 5; col++) {
                const x = offset + col * 110;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x, y + blockH);
                ctx.stroke();
            }
        }

        // Surface variation
        for (let i = 0; i < 200; i++) {
            const px = Math.random() * 512;
            const py = Math.random() * 512;
            const v = Math.random() * 10 - 5;
            ctx.fillStyle = `rgba(${r + v},${g + v},${b + v},0.25)`;
            ctx.fillRect(px, py, 3 + Math.random() * 3, 3 + Math.random() * 3);
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

        ctx.fillStyle = '#e8e2d8';
        ctx.fillRect(0, 0, 512, 512);

        // Ornate coffered panels
        const ps = 128;
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
                const px = x * ps, py = y * ps;
                ctx.strokeStyle = 'rgba(180,170,155,0.7)';
                ctx.lineWidth = 4;
                ctx.strokeRect(px + 6, py + 6, ps - 12, ps - 12);
                ctx.fillStyle = 'rgba(220,215,205,0.5)';
                ctx.fillRect(px + 14, py + 14, ps - 28, ps - 28);
                ctx.strokeStyle = 'rgba(195,185,170,0.5)';
                ctx.lineWidth = 2;
                ctx.strokeRect(px + 14, py + 14, ps - 28, ps - 28);
                ctx.strokeStyle = 'rgba(190,180,165,0.3)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(px + ps / 2, py + ps / 2, 15, 0, Math.PI * 2);
                ctx.stroke();
            }
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }

    // ===================== MATERIAL CACHE =====================

    let floorTex, ceilTex;
    const wallTexCache = {};

    function floorMat() {
        if (!floorTex) floorTex = createMarbleTexture([195, 185, 168], [155, 142, 125], 4);
        return new THREE.MeshStandardMaterial({
            map: floorTex, roughness: 0.18, metalness: 0.25, side: THREE.DoubleSide,
            envMapIntensity: 0.6
        });
    }

    function ceilMat() {
        if (!ceilTex) ceilTex = createCeilingTexture();
        return new THREE.MeshStandardMaterial({
            map: ceilTex, roughness: 0.95, metalness: 0.02, side: THREE.DoubleSide
        });
    }

    function wallMat(color) {
        if (!wallTexCache[color]) wallTexCache[color] = createStoneWallTexture(color);
        return new THREE.MeshStandardMaterial({
            map: wallTexCache[color], roughness: 0.75, metalness: 0.05, side: THREE.DoubleSide
        });
    }

    const _woodMat = new THREE.MeshStandardMaterial({ color: 0x5c3a1e, roughness: 0.55, metalness: 0.08 });
    const _darkWoodMat = new THREE.MeshStandardMaterial({ color: 0x3a2210, roughness: 0.5, metalness: 0.1 });
    const _stoneMat = new THREE.MeshStandardMaterial({ color: 0xd0c8b8, roughness: 0.4, metalness: 0.12 });
    const _goldMat = new THREE.MeshStandardMaterial({ color: 0xc9a96e, roughness: 0.25, metalness: 0.65, emissive: 0x3a2800, emissiveIntensity: 0.3 });
    const _darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.3, metalness: 0.8 });
    const _marbleMat = new THREE.MeshStandardMaterial({ color: 0xe8e0d0, roughness: 0.3, metalness: 0.12 });
    const _glassMat = new THREE.MeshStandardMaterial({
        color: 0xccddee, roughness: 0.05, metalness: 0.3, transparent: true, opacity: 0.15, emissive: 0x112233, emissiveIntensity: 0.08
    });
    const _leatherMat = new THREE.MeshStandardMaterial({ color: 0x4a3020, roughness: 0.7, metalness: 0.05 });
    const _carpetMat = new THREE.MeshStandardMaterial({ color: 0x6b2020, roughness: 0.95, metalness: 0 });

    // Wall colors
    const COLORS = {
        hall: 0xc2b8a5,
        trilobite: 0xb8a890,
        archaeopteryx: 0xa5b598,
        neanderthal: 0xb0a0b5,
        info: 0xa5a5b8,
    };

    // ===================== CORE GEOMETRY =====================

    function addWall(scene, x, y, z, w, h, d, color, col = true) {
        const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallMat(color));
        wall.position.set(x, y, z);
        wall.receiveShadow = true;
        scene.add(wall);
        if (col) collisionWalls.push(wall);
        return wall;
    }

    function addFloor(scene, x, z, w, d) {
        const f = new THREE.Mesh(new THREE.PlaneGeometry(w, d), floorMat());
        f.rotation.x = -Math.PI / 2;
        f.position.set(x, 0, z);
        f.receiveShadow = true;
        scene.add(f);
    }

    function addCeiling(scene, x, z, w, d) {
        const c = new THREE.Mesh(new THREE.PlaneGeometry(w, d), ceilMat());
        c.rotation.x = Math.PI / 2;
        c.position.set(x, WALL_HEIGHT, z);
        scene.add(c);
    }

    // ===================== ARCHITECTURAL ELEMENTS =====================

    function addColumn(scene, x, z, height) {
        const h = height || WALL_HEIGHT;
        const plinth = new THREE.Mesh(new THREE.BoxGeometry(1, 0.2, 1), _stoneMat);
        plinth.position.set(x, 0.1, z);
        scene.add(plinth);
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 0.35, 10), _stoneMat);
        base.position.set(x, 0.375, z);
        scene.add(base);
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, h - 1.2, 10), _marbleMat);
        shaft.position.set(x, h / 2, z);
        shaft.castShadow = true;
        scene.add(shaft);
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.3, 0.4, 10), _stoneMat);
        cap.position.set(x, h - 0.55, z);
        scene.add(cap);
        const ab = new THREE.Mesh(new THREE.BoxGeometry(1, 0.15, 1), _stoneMat);
        ab.position.set(x, h - 0.275, z);
        scene.add(ab);
        const cb = new THREE.Mesh(new THREE.BoxGeometry(0.8, h, 0.8));
        cb.position.set(x, h / 2, z);
        cb.visible = false;
        scene.add(cb);
        collisionWalls.push(cb);
    }

    function addBaseboard(scene, x, z, len, rot) {
        const b = new THREE.Mesh(new THREE.BoxGeometry(len, 0.25, 0.12), _darkWoodMat);
        b.position.set(x, 0.125, z);
        if (rot) b.rotation.y = rot;
        scene.add(b);
    }

    function addCrownMolding(scene, x, z, len, rot) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(len, 0.18, 0.18), _stoneMat);
        m.position.set(x, WALL_HEIGHT - 0.09, z);
        if (rot) m.rotation.y = rot;
        scene.add(m);
    }

    function addTrim(scene, cx, cz, w, d) {
        const hw = w / 2, hd = d / 2, off = 0.18;
        addBaseboard(scene, cx, cz - hd + off, w, 0);
        addBaseboard(scene, cx, cz + hd - off, w, 0);
        addBaseboard(scene, cx - hw + off, cz, d, Math.PI / 2);
        addBaseboard(scene, cx + hw - off, cz, d, Math.PI / 2);
        addCrownMolding(scene, cx, cz - hd + off, w, 0);
        addCrownMolding(scene, cx, cz + hd - off, w, 0);
        addCrownMolding(scene, cx - hw + off, cz, d, Math.PI / 2);
        addCrownMolding(scene, cx + hw - off, cz, d, Math.PI / 2);
    }

    function addDoorFrame(scene, x, z, rotated) {
        const thick = 0.18, fd = WALL_THICKNESS + 0.15;
        if (!rotated) {
            scene.add(new THREE.Mesh(new THREE.BoxGeometry(thick, DOOR_HEIGHT, fd), _goldMat).translateX(x - DOOR_WIDTH / 2).translateY(DOOR_HEIGHT / 2).translateZ(z));
            scene.add(new THREE.Mesh(new THREE.BoxGeometry(thick, DOOR_HEIGHT, fd), _goldMat).translateX(x + DOOR_WIDTH / 2).translateY(DOOR_HEIGHT / 2).translateZ(z));
            scene.add(new THREE.Mesh(new THREE.BoxGeometry(DOOR_WIDTH + thick * 2, thick * 1.5, fd), _goldMat).translateX(x).translateY(DOOR_HEIGHT + thick * 0.5).translateZ(z));
        } else {
            scene.add(new THREE.Mesh(new THREE.BoxGeometry(fd, DOOR_HEIGHT, thick), _goldMat).translateX(x).translateY(DOOR_HEIGHT / 2).translateZ(z - DOOR_WIDTH / 2));
            scene.add(new THREE.Mesh(new THREE.BoxGeometry(fd, DOOR_HEIGHT, thick), _goldMat).translateX(x).translateY(DOOR_HEIGHT / 2).translateZ(z + DOOR_WIDTH / 2));
            scene.add(new THREE.Mesh(new THREE.BoxGeometry(fd, thick * 1.5, DOOR_WIDTH + thick * 2), _goldMat).translateX(x).translateY(DOOR_HEIGHT + thick * 0.5).translateZ(z));
        }
    }

    function addRoomSign(scene, text, x, y, z, rot) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#2a2218';
        ctx.fillRect(0, 0, 512, 128);
        ctx.strokeStyle = '#c9a96e';
        ctx.lineWidth = 3;
        ctx.strokeRect(6, 6, 500, 116);
        ctx.strokeStyle = '#c9a96e';
        ctx.lineWidth = 1;
        ctx.strokeRect(12, 12, 488, 104);
        ctx.fillStyle = '#e8d5b7';
        ctx.font = '32px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 256, 64);

        const sign = new THREE.Mesh(
            new THREE.PlaneGeometry(3.2, 0.8),
            new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas) })
        );
        sign.position.set(x, y, z);
        if (rot) sign.rotation.y = rot;
        scene.add(sign);
    }

    function addWallSconce(scene, x, y, z) {
        scene.add(new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.2, 0.16), _goldMat).translateX(x).translateY(y).translateZ(z));
        const shade = new THREE.Mesh(
            new THREE.ConeGeometry(0.14, 0.22, 6, 1, true),
            new THREE.MeshStandardMaterial({ color: 0xfff0dd, emissive: 0xffe8cc, emissiveIntensity: 0.8, roughness: 0.4 })
        );
        shade.position.set(x, y + 0.14, z);
        shade.rotation.x = Math.PI;
        scene.add(shade);

        // Warm point light (cheap, no shadows)
        const pl = new THREE.PointLight(0xffe0b0, 0.3, 8);
        pl.position.set(x, y - 0.5, z);
        scene.add(pl);

        // Subtle glow orb
        const glowOrb = new THREE.Mesh(
            new THREE.SphereGeometry(0.06, 6, 6),
            new THREE.MeshBasicMaterial({ color: 0xffe8cc, transparent: true, opacity: 0.6 })
        );
        glowOrb.position.set(x, y + 0.05, z);
        scene.add(glowOrb);
    }

    // ===================== FURNITURE =====================

    function addBench(scene, x, z, rot) {
        const group = new THREE.Group();
        const seat = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.08, 0.75), _leatherMat);
        seat.position.y = 0.52;
        seat.castShadow = true;
        group.add(seat);
        const lg = new THREE.CylinderGeometry(0.035, 0.035, 0.52, 6);
        [[-1.1, -0.3], [-1.1, 0.3], [1.1, -0.3], [1.1, 0.3]].forEach(([lx, lz]) => {
            group.add(new THREE.Mesh(lg, _darkMetalMat).translateX(lx).translateY(0.26).translateZ(lz));
        });
        group.add(new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.03, 0.03), _darkMetalMat).translateY(0.2));
        group.position.set(x, 0, z);
        if (rot) group.rotation.y = rot;
        scene.add(group);
        const col = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.6, 0.75));
        col.position.set(x, 0.3, z);
        if (rot) col.rotation.y = rot;
        col.visible = false;
        scene.add(col);
        collisionWalls.push(col);
    }

    function addPottedPlant(scene, x, z) {
        const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.22, 0.6, 8), new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 0.8 }));
        pot.position.set(x, 0.3, z);
        pot.castShadow = true;
        scene.add(pot);
        const leafMat = new THREE.MeshStandardMaterial({ color: 0x3d6b35, roughness: 0.8 });
        [[0, 0.95, 0, 0.2], [0.15, 0.82, 0.1, 0.16], [-0.12, 0.85, -0.08, 0.17], [0.08, 0.75, -0.12, 0.14], [-0.1, 0.78, 0.12, 0.15]].forEach(([px, py, pz, s]) => {
            scene.add(new THREE.Mesh(new THREE.SphereGeometry(s, 6, 6), leafMat).translateX(x + px).translateY(py).translateZ(z + pz));
        });
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.2, 6));
        col.position.set(x, 0.6, z);
        col.visible = false;
        scene.add(col);
        collisionWalls.push(col);
    }

    function addRopeBarrier(scene, x1, z1, x2, z2) {
        [{ x: x1, z: z1 }, { x: x2, z: z2 }].forEach(({ x, z }) => {
            scene.add(new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.95, 6), _goldMat).translateX(x).translateY(0.475).translateZ(z));
            scene.add(new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.06, 8), _goldMat).translateX(x).translateY(0.03).translateZ(z));
            scene.add(new THREE.Mesh(new THREE.SphereGeometry(0.055, 6, 6), _goldMat).translateX(x).translateY(0.97).translateZ(z));
        });
        const pts = [];
        const dx = x2 - x1, dz = z2 - z1;
        for (let t = 0; t <= 1; t += 0.1) pts.push(new THREE.Vector3(x1 + dx * t, 0.85 - Math.sin(t * Math.PI) * 0.1, z1 + dz * t));
        scene.add(new THREE.Mesh(
            new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 8, 0.018, 4, false),
            new THREE.MeshStandardMaterial({ color: 0x8B0000, roughness: 0.6 })
        ));
    }

    // ===================== GRAND HALL FURNITURE =====================

    function addReceptionDesk(scene, x, z) {
        const group = new THREE.Group();
        group.add(new THREE.Mesh(new THREE.BoxGeometry(5, 1.1, 0.15), _darkWoodMat).translateY(0.55).translateZ(-0.6));
        group.add(new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.06, 1.3), _marbleMat).translateY(1.12));
        group.add(new THREE.Mesh(new THREE.BoxGeometry(5, 0.9, 0.1), _darkWoodMat).translateY(0.45).translateZ(0.55));
        group.add(new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.1, 1.2), _darkWoodMat).translateX(-2.45).translateY(0.55));
        group.add(new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.1, 1.2), _darkWoodMat).translateX(2.45).translateY(0.55));
        group.add(new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.35, 0.4), _darkWoodMat).translateY(1.3).translateZ(-0.45));
        group.add(new THREE.Mesh(new THREE.BoxGeometry(5.1, 0.04, 0.04), _goldMat).translateY(1.14).translateZ(-0.62));

        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 48;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#2a2218';
        ctx.fillRect(0, 0, 256, 48);
        ctx.fillStyle = '#c9a96e';
        ctx.font = '22px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('ADMISSIONS', 128, 24);
        const signMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(1.5, 0.28),
            new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas) })
        );
        signMesh.position.set(0, 1.52, -0.66);
        group.add(signMesh);

        group.position.set(x, 0, z);
        scene.add(group);

        const col = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.5, 1.3));
        col.position.set(x, 0.75, z);
        col.visible = false;
        scene.add(col);
        collisionWalls.push(col);
    }

    function addDisplayCase(scene, x, z, label) {
        const ped = new THREE.Mesh(new THREE.BoxGeometry(1, 0.9, 1), _stoneMat);
        ped.position.set(x, 0.45, z);
        ped.castShadow = true;
        scene.add(ped);
        collisionWalls.push(ped);
        const glass = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.8), _glassMat);
        glass.position.set(x, 1.2, z);
        scene.add(glass);
        if (label) {
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#2a2218';
            ctx.fillRect(0, 0, 256, 64);
            ctx.strokeStyle = '#c9a96e';
            ctx.lineWidth = 2;
            ctx.strokeRect(4, 4, 248, 56);
            ctx.fillStyle = '#e8d5b7';
            ctx.font = '16px Georgia, serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, 128, 32);
            const plaque = new THREE.Mesh(
                new THREE.PlaneGeometry(0.8, 0.2),
                new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas) })
            );
            plaque.position.set(x, 0.5, z + 0.51);
            scene.add(plaque);
        }
    }

    function addInfoKiosk(scene, x, z) {
        const group = new THREE.Group();
        group.add(new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.3, 6), _darkMetalMat).translateY(0.65));
        group.add(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.04, 8), _darkMetalMat).translateY(0.02));
        group.add(new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 0.04), _darkWoodMat).translateY(1.55));

        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 384;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#1e1a14';
        ctx.fillRect(0, 0, 512, 384);
        ctx.strokeStyle = '#c9a96e';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 10, 492, 364);
        ctx.fillStyle = '#c9a96e';
        ctx.font = 'bold 22px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('MUSEUM DIRECTORY', 256, 50);
        ctx.font = '16px Georgia, serif';
        ctx.fillStyle = '#e8d5b7';
        ctx.textAlign = 'left';
        const dirs = [
            '\u2190  Trilobite Wing \u2014 Foundations',
            '\u2192  Archaeopteryx Wing \u2014 Growth',
            '\u2191  Neanderthal Wing \u2014 Engagement',
            '\u2193  Info Wing \u2014 About',
        ];
        dirs.forEach((d, i) => ctx.fillText(d, 40, 110 + i * 45));
        ctx.font = 'italic 14px Georgia, serif';
        ctx.fillStyle = '#a89b8c';
        ctx.textAlign = 'center';
        ctx.fillText('Matthew Kim\'s Museum of Science Communication', 256, 350);

        const board = new THREE.Mesh(
            new THREE.PlaneGeometry(1.15, 0.86),
            new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas) })
        );
        board.position.set(0, 1.55, 0.025);
        group.add(board);

        group.position.set(x, 0, z);
        scene.add(group);

        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 2, 6));
        col.position.set(x, 1, z);
        col.visible = false;
        scene.add(col);
        collisionWalls.push(col);
    }

    function addWelcomeBanner(scene, x, y, z, rot) {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#2a2218';
        ctx.fillRect(0, 0, 1024, 256);
        ctx.strokeStyle = '#c9a96e';
        ctx.lineWidth = 4;
        ctx.strokeRect(8, 8, 1008, 240);
        ctx.strokeStyle = '#c9a96e';
        ctx.lineWidth = 1;
        ctx.strokeRect(16, 16, 992, 224);
        ctx.fillStyle = '#e8d5b7';
        ctx.font = 'bold 48px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('MATTHEW KIM\'S MUSEUM OF SCIENCE COMMUNICATION', 512, 110);
        ctx.font = 'italic 28px Georgia, serif';
        ctx.fillStyle = '#a89b8c';
        ctx.fillText('A Notation in Science Communication ePortfolio', 512, 170);
        ctx.font = '20px Georgia, serif';
        ctx.fillStyle = '#8a7d6e';
        ctx.fillText('Stanford University', 512, 210);

        const banner = new THREE.Mesh(
            new THREE.PlaneGeometry(8, 2),
            new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas) })
        );
        banner.position.set(x, y, z);
        if (rot) banner.rotation.y = rot;
        scene.add(banner);
    }

    function addCarpetRunner(scene, x, z, w, d) {
        const carpet = new THREE.Mesh(new THREE.PlaneGeometry(w, d), _carpetMat);
        carpet.rotation.x = -Math.PI / 2;
        carpet.position.set(x, 0.01, z);
        scene.add(carpet);
        const borderMat = new THREE.MeshStandardMaterial({ color: 0xc9a96e, roughness: 0.6 });
        const bw = 0.08;
        const b1 = new THREE.Mesh(new THREE.PlaneGeometry(w, bw), borderMat);
        b1.rotation.x = -Math.PI / 2;
        b1.position.set(x, 0.012, z - d / 2);
        scene.add(b1);
        const b2 = new THREE.Mesh(new THREE.PlaneGeometry(w, bw), borderMat);
        b2.rotation.x = -Math.PI / 2;
        b2.position.set(x, 0.012, z + d / 2);
        scene.add(b2);
    }

    // ===================== WALL WITH DOOR =====================

    function wallWithDoor(scene, wallLen, wallColor, doorX, doorZ, rotated) {
        const hy = WALL_HEIGHT / 2;
        const sectionLen = (wallLen - DOOR_WIDTH) / 2;

        if (!rotated) {
            addWall(scene, doorX - DOOR_WIDTH / 2 - sectionLen / 2, hy, doorZ, sectionLen, WALL_HEIGHT, WALL_THICKNESS, wallColor);
            addWall(scene, doorX + DOOR_WIDTH / 2 + sectionLen / 2, hy, doorZ, sectionLen, WALL_HEIGHT, WALL_THICKNESS, wallColor);
            addWall(scene, doorX, DOOR_HEIGHT + (WALL_HEIGHT - DOOR_HEIGHT) / 2, doorZ, DOOR_WIDTH, WALL_HEIGHT - DOOR_HEIGHT, WALL_THICKNESS, wallColor);
        } else {
            addWall(scene, doorX, hy, doorZ - DOOR_WIDTH / 2 - sectionLen / 2, WALL_THICKNESS, WALL_HEIGHT, sectionLen, wallColor);
            addWall(scene, doorX, hy, doorZ + DOOR_WIDTH / 2 + sectionLen / 2, WALL_THICKNESS, WALL_HEIGHT, sectionLen, wallColor);
            addWall(scene, doorX, DOOR_HEIGHT + (WALL_HEIGHT - DOOR_HEIGHT) / 2, doorZ, WALL_THICKNESS, WALL_HEIGHT - DOOR_HEIGHT, DOOR_WIDTH, wallColor);
        }
        addDoorFrame(scene, doorX, doorZ, rotated);
    }

    // ===================== GRAND HALL =====================

    function buildGrandHall(scene) {
        const hw = GRAND_HALL_WIDTH / 2;  // 12
        const hd = GRAND_HALL_DEPTH / 2;  // 12
        const hy = WALL_HEIGHT / 2;

        // Floor & ceiling
        addFloor(scene, 0, 0, GRAND_HALL_WIDTH, GRAND_HALL_DEPTH);
        addCeiling(scene, 0, 0, GRAND_HALL_WIDTH, GRAND_HALL_DEPTH);

        // NORTH wall — door to Neanderthal
        wallWithDoor(scene, GRAND_HALL_WIDTH, COLORS.hall, 0, -hd, false);
        addRoomSign(scene, 'Neanderthal Wing', 0, DOOR_HEIGHT + 0.6, -hd + 0.25, 0);

        // SOUTH wall — door to Info Wing
        wallWithDoor(scene, GRAND_HALL_WIDTH, COLORS.hall, 0, hd, false);
        addRoomSign(scene, 'Info Wing', 0, DOOR_HEIGHT + 0.6, hd - 0.25, Math.PI);

        // WEST wall — door to Trilobite
        wallWithDoor(scene, GRAND_HALL_DEPTH, COLORS.hall, -hw, 0, true);
        addRoomSign(scene, 'Trilobite Wing', -hw + 0.25, DOOR_HEIGHT + 0.6, 0, Math.PI / 2);

        // EAST wall — door to Archaeopteryx
        wallWithDoor(scene, GRAND_HALL_DEPTH, COLORS.hall, hw, 0, true);
        addRoomSign(scene, 'Archaeopteryx Wing', hw - 0.25, DOOR_HEIGHT + 0.6, 0, -Math.PI / 2);

        // COLONNADE — Field Museum style rows of columns
        [-8, -3, 3, 8].forEach(z => {
            addColumn(scene, -9, z);
            addColumn(scene, 9, z);
        });

        // ENTRANCE AREA (south section, z > 4)

        // Carpet runner from south toward north
        addCarpetRunner(scene, 0, 2, 3, 18);

        // Plants in corners
        addPottedPlant(scene, -hw + 2, hd - 2);
        addPottedPlant(scene, hw - 2, hd - 2);
        addPottedPlant(scene, -hw + 2, -hd + 2);
        addPottedPlant(scene, hw - 2, -hd + 2);

        // Benches between columns
        addBench(scene, -9, 6, Math.PI / 2);
        addBench(scene, 9, 6, Math.PI / 2);
        addBench(scene, -9, -6, Math.PI / 2);
        addBench(scene, 9, -6, Math.PI / 2);

        // Sconces on walls
        addWallSconce(scene, -hw + 0.35, 5.5, -7);
        addWallSconce(scene, -hw + 0.35, 5.5, 7);
        addWallSconce(scene, hw - 0.35, 5.5, -7);
        addWallSconce(scene, hw - 0.35, 5.5, 7);
        addWallSconce(scene, -7, 5.5, -hd + 0.35);
        addWallSconce(scene, 7, 5.5, -hd + 0.35);
        addWallSconce(scene, -7, 5.5, hd - 0.35);
        addWallSconce(scene, 7, 5.5, hd - 0.35);

        // Trim
        addTrim(scene, 0, 0, GRAND_HALL_WIDTH, GRAND_HALL_DEPTH);

        rooms.push({ name: 'Grand Hall', minX: -hw, maxX: hw, minZ: -hd, maxZ: hd });
    }

    // ===================== EXHIBIT HALLS =====================

    function buildExhibitHall(scene, offsetX, offsetZ, axis, wallColor, roomName) {
        const hw = HALL_WIDTH / 2;
        const hd = HALL_DEPTH / 2;
        const hy = WALL_HEIGHT / 2;

        let cx, cz;
        if (axis === 'x') {
            cx = offsetX + (offsetX < 0 ? -hd : hd);
            cz = offsetZ;
            addFloor(scene, cx, cz, HALL_DEPTH, HALL_WIDTH);
            addCeiling(scene, cx, cz, HALL_DEPTH, HALL_WIDTH);
            addWall(scene, cx, hy, cz - hw, HALL_DEPTH, WALL_HEIGHT, WALL_THICKNESS, wallColor);
            addWall(scene, cx, hy, cz + hw, HALL_DEPTH, WALL_HEIGHT, WALL_THICKNESS, wallColor);
            const farX = offsetX < 0 ? cx - hd : cx + hd;
            addWall(scene, farX, hy, cz, WALL_THICKNESS, WALL_HEIGHT, HALL_WIDTH, wallColor);
            addTrim(scene, cx, cz, HALL_DEPTH, HALL_WIDTH);
            addBench(scene, cx + (offsetX < 0 ? 5 : -5), cz, Math.PI / 2);
            if (offsetX < 0) addRopeBarrier(scene, farX + 2, cz - 2, farX + 2, cz + 2);
            else addRopeBarrier(scene, farX - 2, cz - 2, farX - 2, cz + 2);
            addWallSconce(scene, cx - 4, 5, cz - hw + 0.35);
            addWallSconce(scene, cx + 4, 5, cz - hw + 0.35);
            addWallSconce(scene, cx - 4, 5, cz + hw - 0.35);
            addWallSconce(scene, cx + 4, 5, cz + hw - 0.35);
            rooms.push({ name: roomName, minX: cx - hd, maxX: cx + hd, minZ: cz - hw, maxZ: cz + hw });
        } else {
            cx = offsetX;
            cz = offsetZ + (offsetZ < 0 ? -hd : hd);
            addFloor(scene, cx, cz, HALL_WIDTH, HALL_DEPTH);
            addCeiling(scene, cx, cz, HALL_WIDTH, HALL_DEPTH);
            addWall(scene, cx - hw, hy, cz, WALL_THICKNESS, WALL_HEIGHT, HALL_DEPTH, wallColor);
            addWall(scene, cx + hw, hy, cz, WALL_THICKNESS, WALL_HEIGHT, HALL_DEPTH, wallColor);
            const farZ = offsetZ < 0 ? cz - hd : cz + hd;
            addWall(scene, cx, hy, farZ, HALL_WIDTH, WALL_HEIGHT, WALL_THICKNESS, wallColor);
            addTrim(scene, cx, cz, HALL_WIDTH, HALL_DEPTH);
            addBench(scene, cx, cz + (offsetZ < 0 ? 5 : -5), 0);
            if (offsetZ < 0) addRopeBarrier(scene, cx - 2, farZ + 2, cx + 2, farZ + 2);
            else addRopeBarrier(scene, cx - 2, farZ - 2, cx + 2, farZ - 2);
            addWallSconce(scene, cx - hw + 0.35, 5, cz - 4);
            addWallSconce(scene, cx - hw + 0.35, 5, cz + 4);
            addWallSconce(scene, cx + hw - 0.35, 5, cz - 4);
            addWallSconce(scene, cx + hw - 0.35, 5, cz + 4);
            rooms.push({ name: roomName, minX: cx - hw, maxX: cx + hw, minZ: cz - hd, maxZ: cz + hd });
        }
        return { cx, cz, axis };
    }

    // ===================== LIGHTING =====================

    function addLighting(scene) {
        scene.add(new THREE.HemisphereLight(0xdde8f0, 0x6b5840, 0.45));
        scene.add(new THREE.AmbientLight(0xfff5e6, 0.25));

        // Grand hall center light (shadow-casting) — main dramatic light
        const mainLight = new THREE.PointLight(0xffe8cc, 1.2, 40);
        mainLight.position.set(0, WALL_HEIGHT - 0.5, 0);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 512;
        mainLight.shadow.mapSize.height = 512;
        mainLight.shadow.bias = -0.002;
        mainLight.shadow.radius = 3;
        scene.add(mainLight);
        animatedLights.push(mainLight);

        // (light beams removed for performance)

        // One light per exhibit hall (no accent lights for performance)
        const hw = GRAND_HALL_WIDTH / 2;
        const hd = GRAND_HALL_DEPTH / 2;
        const wingLights = [
            { pos: [-hw - HALL_DEPTH / 2, 0], color: 0xffe0c0 },  // Trilobite warm
            { pos: [hw + HALL_DEPTH / 2, 0], color: 0xe8f0dd },    // Archaeopteryx green
            { pos: [0, -hd - HALL_DEPTH / 2], color: 0xe0d8f0 },   // Neanderthal violet
            { pos: [0, hd + HALL_DEPTH / 2], color: 0xd8e0f0 },    // Info blue
        ];
        wingLights.forEach(({ pos, color }) => {
            const l = new THREE.PointLight(color, 0.8, 30);
            l.position.set(pos[0], WALL_HEIGHT - 0.5, pos[1]);
            scene.add(l);
        });

        // Directional fill light for soft overall shadows
        const dirLight = new THREE.DirectionalLight(0xffeedd, 0.15);
        dirLight.position.set(5, WALL_HEIGHT, 5);
        scene.add(dirLight);
    }

    const animatedLights = [];

    function addLightBeam(scene, x, z, color, radius, height) {
        const beamGeo = new THREE.CylinderGeometry(radius * 0.3, radius, height, 8, 1, true);
        const beamMat = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.018,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        const beam = new THREE.Mesh(beamGeo, beamMat);
        beam.position.set(x, height / 2, z);
        scene.add(beam);
    }

    function getAnimatedLights() { return animatedLights; }

    // ===================== FOSSIL CENTERPIECES =====================

    const _boneMat = new THREE.MeshStandardMaterial({ color: 0xe8dcc8, roughness: 0.6, metalness: 0.05 });
    const _darkBoneMat = new THREE.MeshStandardMaterial({ color: 0xc8b8a0, roughness: 0.65, metalness: 0.05 });
    const _fossilMat = new THREE.MeshStandardMaterial({ color: 0xd4c8b0, roughness: 0.55, metalness: 0.08 });

    function addFossilPedestal(scene, x, z) {
        // Tiered base
        scene.add(new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.5, 0.12, 16), _marbleMat).translateX(x).translateY(0.06).translateZ(z));
        scene.add(new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.3, 0.12, 16), _marbleMat).translateX(x).translateY(0.18).translateZ(z));
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.0, 0.7, 12), _stoneMat);
        body.position.set(x, 0.59, z);
        body.castShadow = true;
        scene.add(body);
        collisionWalls.push(body);
        // Display platform top
        scene.add(new THREE.Mesh(new THREE.CylinderGeometry(1.0, 0.9, 0.08, 16), _marbleMat).translateX(x).translateY(0.98).translateZ(z));

        // Point light on fossil (cheaper than SpotLight)
        const pl = new THREE.PointLight(0xfff0dd, 0.6, 10);
        pl.position.set(x, WALL_HEIGHT - 1, z);
        scene.add(pl);

        return { x, z, topY: 1.02 };
    }

    // Wing image paths (for overlay click-through)
    const WING_IMAGES = {
        trilobite: 'assets/images/trilobite.png',
        archaeopteryx: 'assets/images/archaeopteryx.png',
        neanderthal: 'assets/images/neanderthal.png'
    };
    // Base64 image data loaded from wing-images.js (WING_IMAGE_DATA global)

    function addWallSign(scene, hall, exhibitKey, wingName, subtitle, description) {
        const { cx, cz, axis } = hall;
        const hd = HALL_DEPTH / 2;

        // Determine far wall position and sign orientation
        // Wall center is at farX/farZ, inner face is WALL_THICKNESS/2 closer to center
        const wallOff = WALL_THICKNESS / 2 + 0.05; // just in front of inner wall face
        let signX, signZ, rotY;
        if (axis === 'x') {
            const farX = cx > 0 ? cx + hd : cx - hd;
            signX = farX + (cx > 0 ? -wallOff : wallOff);
            signZ = cz;
            rotY = cx > 0 ? -Math.PI / 2 : Math.PI / 2;
        } else {
            const farZ = cz > 0 ? cz + hd : cz - hd;
            signX = cx;
            signZ = farZ + (cz > 0 ? -wallOff : wallOff);
            rotY = cz > 0 ? Math.PI : 0;
        }

        const group = new THREE.Group();

        // === PAINTING (framed image on wall) ===
        // Native aspect ratios: trilobite 4:3 landscape, others ~3:4 portrait
        const IMG_ASPECTS = { trilobite: 512/384, archaeopteryx: 512/685, neanderthal: 512/678 };
        const aspect = IMG_ASPECTS[exhibitKey] || (4/3);
        const maxDim = 3.5; // max width or height in world units
        let imgW, imgH;
        if (aspect >= 1) {
            imgW = maxDim;
            imgH = maxDim / aspect;
        } else {
            imgH = maxDim;
            imgW = maxDim * aspect;
        }
        const imgCenterY = 1.0 + imgH / 2 + 0.8; // bottom of painting ~1.8m up

        // Gold frame around painting
        const frameMat = _goldMat;
        const frameThick = 0.15;
        const frameTop = new THREE.Mesh(new THREE.BoxGeometry(imgW + frameThick * 2, frameThick, 0.08), frameMat);
        frameTop.position.set(0, imgCenterY + imgH / 2 + frameThick / 2, 0);
        group.add(frameTop);
        const frameBot = new THREE.Mesh(new THREE.BoxGeometry(imgW + frameThick * 2, frameThick, 0.08), frameMat);
        frameBot.position.set(0, imgCenterY - imgH / 2 - frameThick / 2, 0);
        group.add(frameBot);
        const frameLeft = new THREE.Mesh(new THREE.BoxGeometry(frameThick, imgH + frameThick * 2, 0.08), frameMat);
        frameLeft.position.set(-imgW / 2 - frameThick / 2, imgCenterY, 0);
        group.add(frameLeft);
        const frameRight = new THREE.Mesh(new THREE.BoxGeometry(frameThick, imgH + frameThick * 2, 0.08), frameMat);
        frameRight.position.set(imgW / 2 + frameThick / 2, imgCenterY, 0);
        group.add(frameRight);

        // Image plane — use base64 data URL drawn onto canvas (works on file://)
        const imgPath = WING_IMAGES[exhibitKey];
        const imgDataURL = (typeof WING_IMAGE_DATA !== 'undefined') ? WING_IMAGE_DATA[exhibitKey] : null;
        const canvasW = 512, canvasH = Math.round(512 / aspect);
        const imgCanvas = document.createElement('canvas');
        imgCanvas.width = canvasW;
        imgCanvas.height = canvasH;
        const imgCtx = imgCanvas.getContext('2d');
        imgCtx.fillStyle = '#1a1610';
        imgCtx.fillRect(0, 0, canvasW, canvasH);
        const imgTex = new THREE.CanvasTexture(imgCanvas);
        const imgMat = new THREE.MeshBasicMaterial({ map: imgTex, side: THREE.DoubleSide });
        const imgPlane = new THREE.Mesh(new THREE.PlaneGeometry(imgW, imgH), imgMat);
        imgPlane.position.set(0, imgCenterY, 0.05);
        group.add(imgPlane);

        if (imgDataURL) {
            const img = new Image();
            img.onload = function() {
                imgCtx.drawImage(img, 0, 0, canvasW, canvasH);
                imgTex.needsUpdate = true;
            };
            img.src = imgDataURL;
        }

        // === MUSEUM PLACARD (small label below painting) ===
        const placardW = Math.min(imgW, 2.4), placardH = 0.7;
        const placardY = imgCenterY - imgH / 2 - frameThick - 0.15 - placardH / 2;

        // Placard canvas
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 160;
        const ctx = canvas.getContext('2d');

        // White/cream background like a real museum label
        ctx.fillStyle = '#f5f0e8';
        ctx.fillRect(0, 0, 512, 160);

        // Thin border
        ctx.strokeStyle = '#c9a96e';
        ctx.lineWidth = 2;
        ctx.strokeRect(2, 2, 508, 156);

        // Wing name (bold)
        ctx.fillStyle = '#1a1610';
        ctx.font = 'bold 24px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText(wingName, 256, 35);

        // Subtitle (italic)
        ctx.fillStyle = '#5a4a30';
        ctx.font = 'italic 17px Georgia, serif';
        ctx.fillText(subtitle, 256, 60);

        // Thin line
        ctx.strokeStyle = '#c9a96e';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(80, 70);
        ctx.lineTo(432, 70);
        ctx.stroke();

        // Short description (truncated to 2 lines)
        ctx.fillStyle = '#3a3020';
        ctx.font = '13px Georgia, serif';
        ctx.textAlign = 'center';
        const words = description.split(' ');
        let line1 = '', line2 = '';
        let onLine1 = true;
        for (const word of words) {
            if (onLine1) {
                const test = line1 + word + ' ';
                if (ctx.measureText(test).width > 440) {
                    onLine1 = false;
                    line2 = word + ' ';
                } else {
                    line1 = test;
                }
            } else {
                const test = line2 + word + ' ';
                if (ctx.measureText(test).width > 430) {
                    line2 = line2.trim() + '...';
                    break;
                }
                line2 = test;
            }
        }
        ctx.fillText(line1.trim(), 256, 92);
        if (line2) ctx.fillText(line2.trim(), 256, 112);

        // Click hint
        ctx.fillStyle = '#9a8a6a';
        ctx.font = '11px Helvetica, sans-serif';
        ctx.fillText('Click to read more', 256, 145);

        const placardTex = new THREE.CanvasTexture(canvas);

        // Placard backing (slight depth)
        const placardBack = new THREE.Mesh(
            new THREE.BoxGeometry(placardW + 0.06, placardH + 0.06, 0.03),
            new THREE.MeshStandardMaterial({ color: 0x2a2520, roughness: 0.7 })
        );
        placardBack.position.set(0, placardY, 0.01);
        group.add(placardBack);

        // Placard face
        const placardFace = new THREE.Mesh(
            new THREE.PlaneGeometry(placardW, placardH),
            new THREE.MeshBasicMaterial({ map: placardTex, side: THREE.DoubleSide })
        );
        placardFace.position.set(0, placardY, 0.03);
        group.add(placardFace);

        group.position.set(signX, 0, signZ);
        group.rotation.y = rotY;
        scene.add(group);

        // Update world matrix for raycasting
        group.updateMatrixWorld(true);

        // Register as clickable exhibit
        const overlayData = {
            title: wingName,
            content: '<p style="color:#c9a96e; font-size:0.85rem; margin-bottom:1rem; letter-spacing:0.1em;">' + subtitle + '</p><p>' + description + '</p>',
            image: imgPath,
            reflection: null,
            type: 'info'
        };
        if (imgPlane) Exhibits.registerExhibitMesh(imgPlane, overlayData);
        Exhibits.registerExhibitMesh(placardFace, overlayData);
    }

    function buildTrilobiteFossil(scene, ped) {
        const group = new THREE.Group();
        // Central body — segmented ellipsoid
        for (let i = 0; i < 9; i++) {
            const t = i / 8;
            const segW = 0.35 * Math.sin(t * Math.PI) + 0.12;
            const segH = 0.06;
            const seg = new THREE.Mesh(
                new THREE.CylinderGeometry(segW, segW * 0.95, segH, 8),
                _fossilMat
            );
            seg.position.z = (t - 0.5) * 1.0;
            seg.position.y = 0.04;
            seg.castShadow = true;
            group.add(seg);

            // Ridge line down center
            const ridge = new THREE.Mesh(
                new THREE.CylinderGeometry(segW * 0.35, segW * 0.3, segH + 0.02, 6),
                _boneMat
            );
            ridge.position.z = seg.position.z;
            ridge.position.y = 0.07;
            group.add(ridge);

            // Leg protrusions on each side
            if (i > 0 && i < 8) {
                [-1, 1].forEach(side => {
                    const leg = new THREE.Mesh(
                        new THREE.BoxGeometry(segW * 0.7, 0.015, 0.03),
                        _darkBoneMat
                    );
                    leg.position.set(side * (segW + segW * 0.3), 0.02, seg.position.z);
                    leg.rotation.z = side * 0.3;
                    group.add(leg);
                });
            }
        }

        // Head shield (cephalon)
        const head = new THREE.Mesh(
            new THREE.SphereGeometry(0.22, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2),
            _fossilMat
        );
        head.position.set(0, 0.04, -0.55);
        head.rotation.x = -0.2;
        group.add(head);

        // Eyes
        [-1, 1].forEach(side => {
            const eye = new THREE.Mesh(
                new THREE.SphereGeometry(0.04, 6, 6),
                new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.3, metalness: 0.4 })
            );
            eye.position.set(side * 0.12, 0.1, -0.52);
            group.add(eye);
        });

        // Tail (pygidium)
        const tail = new THREE.Mesh(
            new THREE.ConeGeometry(0.15, 0.25, 6),
            _fossilMat
        );
        tail.position.set(0, 0.04, 0.6);
        tail.rotation.x = Math.PI / 2;
        group.add(tail);

        group.position.set(ped.x, ped.topY, ped.z);
        group.rotation.x = -0.15;
        scene.add(group);
    }

    function buildArchaeopteryxFossil(scene, ped) {
        const group = new THREE.Group();
        const bone = _boneMat;

        // --- Running pose: body leaning forward, one leg forward, wings back ---

        // Spine (tilted forward ~40 degrees from horizontal)
        const spinePoints = [];
        for (let i = 0; i <= 8; i++) {
            const t = i / 8;
            spinePoints.push(new THREE.Vector3(0, t * 0.22, t * 0.38));
        }
        const spineCurve = new THREE.CatmullRomCurve3(spinePoints);
        const spine = new THREE.Mesh(new THREE.TubeGeometry(spineCurve, 10, 0.018, 5, false), bone);
        group.add(spine);

        // Ribcage (along tilted spine)
        for (let i = 0; i < 5; i++) {
            [-1, 1].forEach(side => {
                const rib = new THREE.Mesh(
                    new THREE.TorusGeometry(0.06 + i * 0.004, 0.007, 4, 8, Math.PI * 0.55),
                    _darkBoneMat
                );
                const t = (i + 1) / 6;
                rib.position.set(0, t * 0.22, t * 0.38);
                rib.rotation.y = side * Math.PI / 2;
                rib.rotation.z = 0.5; // match spine tilt
                group.add(rib);
            });
        }

        // Pelvis
        const pelvis = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.012, 4, 8, Math.PI), _darkBoneMat);
        pelvis.position.set(0, 0.02, 0.04);
        pelvis.rotation.x = Math.PI / 2;
        group.add(pelvis);

        // Short neck (Archaeopteryx had a relatively short neck)
        const neckPts = [
            new THREE.Vector3(0, 0.22, 0.38),
            new THREE.Vector3(0, 0.27, 0.42),
            new THREE.Vector3(0, 0.30, 0.44),
        ];
        const neckCurve = new THREE.CatmullRomCurve3(neckPts);
        group.add(new THREE.Mesh(new THREE.TubeGeometry(neckCurve, 6, 0.012, 5, false), bone));

        // Skull (compact, thrust forward — Archaeopteryx had a small toothed head)
        const skull = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 6), bone);
        skull.position.set(0, 0.31, 0.46);
        skull.scale.set(0.85, 0.7, 1.3);
        group.add(skull);

        // Toothed jaw (distinctive Archaeopteryx feature — teeth, not a beak)
        const jaw = new THREE.Mesh(new THREE.ConeGeometry(0.012, 0.06, 4), bone);
        jaw.position.set(0, 0.30, 0.52);
        jaw.rotation.x = Math.PI / 2;
        group.add(jaw);

        // Tiny teeth along jaw
        for (let t = 0; t < 3; t++) {
            const tooth = new THREE.Mesh(new THREE.ConeGeometry(0.003, 0.012, 3),
                new THREE.MeshStandardMaterial({ color: 0xf0e8d0, roughness: 0.4 }));
            tooth.position.set((t - 1) * 0.008, 0.285, 0.50 + t * 0.005);
            group.add(tooth);
        }

        // Eyes
        const eyeMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3 });
        [-1, 1].forEach(side => {
            const eye = new THREE.Mesh(new THREE.SphereGeometry(0.008, 4, 4), eyeMat);
            eye.position.set(side * 0.025, 0.32, 0.49);
            group.add(eye);
        });

        // Wings (swept back in running pose, partially folded)
        const featherMat = new THREE.MeshStandardMaterial({
            color: 0xb8a888, roughness: 0.7, side: THREE.DoubleSide, transparent: true, opacity: 0.55
        });
        [-1, 1].forEach(side => {
            // Humerus (upper arm, swept back)
            const humerus = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.007, 0.14, 4), bone);
            humerus.position.set(side * 0.09, 0.16, 0.26);
            humerus.rotation.z = side * 0.8;
            humerus.rotation.x = -0.4;
            group.add(humerus);

            // Radius/ulna (forearm, folded)
            const radius = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.005, 0.13, 4), bone);
            radius.position.set(side * 0.20, 0.12, 0.18);
            radius.rotation.z = side * 0.4;
            radius.rotation.x = -0.5;
            group.add(radius);

            // Clawed fingers (3 clawed digits — key Archaeopteryx feature)
            for (let c = 0; c < 3; c++) {
                const claw = new THREE.Mesh(new THREE.ConeGeometry(0.004, 0.03, 3), _darkBoneMat);
                claw.position.set(side * (0.27 + c * 0.01), 0.09 - c * 0.01, 0.12 - c * 0.02);
                claw.rotation.z = side * 0.3;
                claw.rotation.x = -0.3;
                group.add(claw);
            }

            // Feather impressions along wing (trailing back)
            for (let f = 0; f < 6; f++) {
                const feather = new THREE.Mesh(new THREE.PlaneGeometry(0.025, 0.10), featherMat);
                feather.position.set(side * (0.11 + f * 0.035), 0.14 - f * 0.008, 0.22 - f * 0.025);
                feather.rotation.z = side * (0.25 + f * 0.06);
                feather.rotation.x = -0.35;
                group.add(feather);
            }
        });

        // Bird legs using connected curves (proper bird anatomy:
        // femur short & close to body, tibiotarsus long going down,
        // tarsometatarsus angling forward to feet)

        // LEFT LEG — forward stride
        const lLegPts = [
            new THREE.Vector3(-0.03, 0.0, 0.06),   // hip joint at pelvis
            new THREE.Vector3(-0.035, -0.08, 0.10), // femur end / knee
            new THREE.Vector3(-0.035, -0.22, 0.06), // tibiotarsus down
            new THREE.Vector3(-0.035, -0.28, 0.12), // ankle (bird "knee")
            new THREE.Vector3(-0.035, -0.32, 0.14), // foot
        ];
        const lLegCurve = new THREE.CatmullRomCurve3(lLegPts);
        const lLeg = new THREE.Mesh(new THREE.TubeGeometry(lLegCurve, 10, 0.008, 4, false), bone);
        group.add(lLeg);

        // Left foot talons
        for (let t = 0; t < 3; t++) {
            const talon = new THREE.Mesh(new THREE.ConeGeometry(0.004, 0.03, 3), _darkBoneMat);
            talon.position.set(-0.035 + (t - 1) * 0.012, -0.34, 0.16 + t * 0.006);
            talon.rotation.x = 0.5;
            group.add(talon);
        }

        // RIGHT LEG — back stride (pushing off)
        const rLegPts = [
            new THREE.Vector3(0.03, 0.0, 0.02),     // hip joint at pelvis
            new THREE.Vector3(0.035, -0.07, -0.03),  // femur end / knee
            new THREE.Vector3(0.035, -0.22, -0.06),  // tibiotarsus down
            new THREE.Vector3(0.035, -0.28, -0.02),  // ankle
            new THREE.Vector3(0.035, -0.32, 0.01),   // foot
        ];
        const rLegCurve = new THREE.CatmullRomCurve3(rLegPts);
        const rLeg = new THREE.Mesh(new THREE.TubeGeometry(rLegCurve, 10, 0.008, 4, false), bone);
        group.add(rLeg);

        // Right foot talons
        for (let t = 0; t < 3; t++) {
            const talon = new THREE.Mesh(new THREE.ConeGeometry(0.004, 0.03, 3), _darkBoneMat);
            talon.position.set(0.035 + (t - 1) * 0.012, -0.34, 0.03 + t * 0.006);
            talon.rotation.x = 0.5;
            group.add(talon);
        }

        // Tail (extending back for balance, slightly raised)
        for (let i = 0; i < 10; i++) {
            const vert = new THREE.Mesh(
                new THREE.SphereGeometry(0.012 - i * 0.0008, 4, 4),
                bone
            );
            vert.position.set(0, 0.02 + i * 0.008, -0.05 - i * 0.03);
            group.add(vert);
        }

        // Tail feather fan (spread behind for balance)
        for (let f = 0; f < 5; f++) {
            const tf = new THREE.Mesh(new THREE.PlaneGeometry(0.025, 0.1), featherMat);
            tf.position.set((f - 2) * 0.02, 0.10, -0.35);
            tf.rotation.x = -0.3;
            group.add(tf);
        }

        // Mount rod (thin metal rod from body down to pedestal)
        const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.4, 4), _darkMetalMat);
        rod.position.set(0, -0.18, 0.04);
        group.add(rod);

        group.position.set(ped.x, ped.topY + 0.45, ped.z);
        group.scale.set(1.5, 1.5, 1.5);
        scene.add(group);
    }

    function buildNeanderthalSkull(scene, ped) {
        const group = new THREE.Group();

        // Cranium — elongated sphere with pronounced brow
        const cranium = new THREE.Mesh(
            new THREE.SphereGeometry(0.22, 12, 10),
            _fossilMat
        );
        cranium.scale.set(1, 0.9, 1.15);
        cranium.position.y = 0.15;
        cranium.castShadow = true;
        group.add(cranium);

        // Brow ridge — prominent
        const brow = new THREE.Mesh(
            new THREE.TorusGeometry(0.16, 0.035, 6, 12, Math.PI),
            _boneMat
        );
        brow.position.set(0, 0.12, -0.17);
        brow.rotation.x = 0.3;
        group.add(brow);

        // Eye sockets
        const eyeSocketMat = new THREE.MeshStandardMaterial({ color: 0x1a1512, roughness: 0.9 });
        [-1, 1].forEach(side => {
            const socket = new THREE.Mesh(
                new THREE.SphereGeometry(0.055, 8, 8),
                eyeSocketMat
            );
            socket.position.set(side * 0.08, 0.08, -0.2);
            socket.scale.z = 0.5;
            group.add(socket);
        });

        // Nasal cavity
        const nose = new THREE.Mesh(
            new THREE.BoxGeometry(0.05, 0.06, 0.04),
            eyeSocketMat
        );
        nose.position.set(0, 0.01, -0.22);
        group.add(nose);

        // Cheekbones
        [-1, 1].forEach(side => {
            const cheek = new THREE.Mesh(
                new THREE.SphereGeometry(0.04, 6, 6),
                _fossilMat
            );
            cheek.position.set(side * 0.15, 0.02, -0.16);
            group.add(cheek);
        });

        // Upper jaw (maxilla)
        const maxilla = new THREE.Mesh(
            new THREE.BoxGeometry(0.16, 0.05, 0.1),
            _boneMat
        );
        maxilla.position.set(0, -0.05, -0.18);
        group.add(maxilla);

        // Teeth row
        for (let i = 0; i < 6; i++) {
            const tooth = new THREE.Mesh(
                new THREE.BoxGeometry(0.018, 0.025, 0.015),
                new THREE.MeshStandardMaterial({ color: 0xf0e8d0, roughness: 0.4 })
            );
            tooth.position.set(-0.05 + i * 0.02, -0.085, -0.2);
            group.add(tooth);
        }

        // Lower jaw (mandible)
        const jaw = new THREE.Mesh(
            new THREE.TorusGeometry(0.1, 0.025, 6, 10, Math.PI),
            _boneMat
        );
        jaw.position.set(0, -0.1, -0.14);
        jaw.rotation.x = Math.PI;
        jaw.rotation.z = Math.PI;
        group.add(jaw);

        // Chin (not very pronounced for Neanderthal — receding)
        const chin = new THREE.Mesh(
            new THREE.SphereGeometry(0.03, 6, 6),
            _boneMat
        );
        chin.position.set(0, -0.13, -0.18);
        group.add(chin);

        // Temporal bones (sides)
        [-1, 1].forEach(side => {
            const temporal = new THREE.Mesh(
                new THREE.SphereGeometry(0.06, 6, 6),
                _fossilMat
            );
            temporal.position.set(side * 0.2, 0.1, -0.02);
            temporal.scale.set(0.5, 0.8, 1);
            group.add(temporal);
        });

        group.position.set(ped.x, ped.topY + 0.15, ped.z);
        group.rotation.y = Math.PI;
        group.scale.set(1.4, 1.4, 1.4);
        scene.add(group);
    }

    function addFossilCenterpiece(scene, hall, exhibitKey) {
        const data = MUSEUM_DATA.exhibits[exhibitKey];
        if (!data) return;

        const { cx, cz, axis } = hall;
        const ped = addFossilPedestal(scene, cx, cz);

        // Build the appropriate fossil
        if (exhibitKey === 'trilobite') buildTrilobiteFossil(scene, ped);
        else if (exhibitKey === 'archaeopteryx') buildArchaeopteryxFossil(scene, ped);
        else if (exhibitKey === 'neanderthal') buildNeanderthalSkull(scene, ped);

        // Wall-mounted info sign on the far wall of the wing
        addWallSign(scene, hall, exhibitKey, data.name, data.subtitle, data.description);
    }

    // ===================== BUILD =====================

    function build(scene) {
        buildGrandHall(scene);

        const hw = GRAND_HALL_WIDTH / 2;
        const hd = GRAND_HALL_DEPTH / 2;

        // Four exhibit wings branching off the grand hall
        const trilobiteHall = buildExhibitHall(scene, -hw, 0, 'x', COLORS.trilobite, 'Trilobite Wing');
        const archaeopteryxHall = buildExhibitHall(scene, hw, 0, 'x', COLORS.archaeopteryx, 'Archaeopteryx Wing');
        const neanderthalHall = buildExhibitHall(scene, 0, -hd, 'z', COLORS.neanderthal, 'Neanderthal Wing');
        const infoHall = buildExhibitHall(scene, 0, hd, 'z', COLORS.info, 'Info Wing');

        addLighting(scene);

        // Fossil centerpieces in each exhibit wing
        addFossilCenterpiece(scene, trilobiteHall, 'trilobite');
        addFossilCenterpiece(scene, archaeopteryxHall, 'archaeopteryx');
        addFossilCenterpiece(scene, neanderthalHall, 'neanderthal');

        return {
            halls: { trilobite: trilobiteHall, archaeopteryx: archaeopteryxHall, neanderthal: neanderthalHall, info: infoHall }
        };
    }

    function getCollisionWalls() { return collisionWalls; }

    function getCurrentRoom(x, z) {
        for (const room of rooms) {
            if (x >= room.minX && x <= room.maxX && z >= room.minZ && z <= room.maxZ) return room.name;
        }
        return 'Grand Hall';
    }

    function getRooms() { return rooms; }

    return { build, getCollisionWalls, getCurrentRoom, getRooms, getAnimatedLights, WALL_HEIGHT, HALL_WIDTH, HALL_DEPTH };
})();
