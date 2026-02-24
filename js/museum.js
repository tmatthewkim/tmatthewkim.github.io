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
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        const ts = canvas.width / tileCount;

        for (let tx = 0; tx < tileCount; tx++) {
            for (let ty = 0; ty < tileCount; ty++) {
                const isL = (tx + ty) % 2 === 0;
                const c = isL ? light : dark;
                ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
                ctx.fillRect(tx * ts, ty * ts, ts, ts);

                // Rich marble veining
                for (let v = 0; v < 6; v++) {
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
                for (let p = 0; p < 4; p++) {
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
        for (let i = 0; i < 800; i++) {
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
            map: floorTex, roughness: 0.25, metalness: 0.15, side: THREE.DoubleSide,
            envMapIntensity: 0.4
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
    const _goldMat = new THREE.MeshStandardMaterial({ color: 0xc9a96e, roughness: 0.25, metalness: 0.65 });
    const _darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.3, metalness: 0.8 });
    const _marbleMat = new THREE.MeshStandardMaterial({ color: 0xe8e0d0, roughness: 0.3, metalness: 0.12 });
    const _glassMat = new THREE.MeshStandardMaterial({
        color: 0xccddee, roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.12
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
            new THREE.MeshStandardMaterial({ color: 0xfff0dd, emissive: 0xffe8cc, emissiveIntensity: 0.6, roughness: 0.4 })
        );
        shade.position.set(x, y + 0.14, z);
        shade.rotation.x = Math.PI;
        scene.add(shade);
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
        ctx.fillText('Science Communication ePortfolio', 256, 350);

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
        ctx.fillText('MUSEUM OF SCIENCE COMMUNICATION', 512, 110);
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
        addInfoKiosk(scene, -5, 6);
        addDisplayCase(scene, 5, 7, 'Featured Exhibit');

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
            addBench(scene, cx, cz, Math.PI / 2);
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
            addBench(scene, cx, cz, 0);
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
        scene.add(new THREE.HemisphereLight(0xdde8f0, 0xb0a090, 0.55));
        scene.add(new THREE.AmbientLight(0xfff5e6, 0.4));

        // Grand hall center light (shadow-casting)
        const mainLight = new THREE.PointLight(0xffe8cc, 1.0, 35);
        mainLight.position.set(0, WALL_HEIGHT - 0.5, 0);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 512;
        mainLight.shadow.mapSize.height = 512;
        scene.add(mainLight);

        // One light per exhibit hall (no shadows)
        const hw = GRAND_HALL_WIDTH / 2;
        const hd = GRAND_HALL_DEPTH / 2;
        [
            [-hw - HALL_DEPTH / 2, 0],       // Trilobite (west)
            [hw + HALL_DEPTH / 2, 0],         // Archaeopteryx (east)
            [0, -hd - HALL_DEPTH / 2],        // Neanderthal (north)
            [0, hd + HALL_DEPTH / 2],         // Info (south)
        ].forEach(([hx, hz]) => {
            const l = new THREE.PointLight(0xffe8cc, 0.65, 28);
            l.position.set(hx, WALL_HEIGHT - 0.5, hz);
            scene.add(l);
        });
    }

    // ===================== COVER LETTER PEDESTAL =====================

    function addCoverLetterPedestal(scene) {
        const px = 0, pz = -2;

        // Tiered marble base
        scene.add(new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.3, 0.15, 16), _marbleMat).translateX(px).translateY(0.075).translateZ(pz));
        scene.add(new THREE.Mesh(new THREE.CylinderGeometry(1, 1.1, 0.15, 16), _marbleMat).translateX(px).translateY(0.225).translateZ(pz));

        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.85, 0.65, 12), _stoneMat);
        body.position.set(px, 0.625, pz);
        body.castShadow = true;
        scene.add(body);
        collisionWalls.push(body);

        // Glass display case
        const glass = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.7, 1.2), _glassMat);
        glass.position.set(px, 1.35, pz);
        scene.add(glass);

        // Display surface — tilted toward south (player spawn)
        const display = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 0.06, 1),
            new THREE.MeshStandardMaterial({ color: 0x2a2218, roughness: 0.3 })
        );
        display.position.set(px, 1.05, pz);
        display.rotation.x = 0.35;
        scene.add(display);

        // "Cover Letter" label
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
        ctx.font = '20px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Cover Letter', 128, 32);
        const label = new THREE.Mesh(
            new THREE.PlaneGeometry(1.3, 0.325),
            new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas) })
        );
        label.position.set(px, 0.6, pz + 0.86);
        scene.add(label);

        return display;
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

        const coverLetterDisplay = addCoverLetterPedestal(scene);

        return {
            halls: { trilobite: trilobiteHall, archaeopteryx: archaeopteryxHall, neanderthal: neanderthalHall, info: infoHall },
            coverLetterDisplay
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

    return { build, getCollisionWalls, getCurrentRoom, getRooms, WALL_HEIGHT, HALL_WIDTH, HALL_DEPTH };
})();
