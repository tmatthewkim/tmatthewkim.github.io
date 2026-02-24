/**
 * EXHIBITS
 * Creates exhibit frames on walls, room signage, and info panels.
 */

const Exhibits = (() => {
    const FRAME_WIDTH = 2.2;
    const FRAME_HEIGHT = 1.7;
    const FRAME_DEPTH = 0.08;
    const FRAME_BORDER = 0.12;
    const FRAME_Y = 2.2;

    // All clickable exhibit meshes mapped to their data
    const exhibitMap = new Map();
    const allExhibitMeshes = [];

    function createFrameTexture(title, subtitle, index) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 384;
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = '#0e0e1a';
        ctx.fillRect(0, 0, 512, 384);

        // Inner border
        ctx.strokeStyle = '#c9a96e';
        ctx.lineWidth = 2;
        ctx.strokeRect(20, 20, 472, 344);

        // Number
        ctx.fillStyle = '#c9a96e';
        ctx.font = 'bold 28px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${index + 1}`, 256, 80);

        // Title
        ctx.fillStyle = '#e8d5b7';
        ctx.font = '22px Georgia, serif';

        // Word wrap title
        const words = title.split(' ');
        let line = '';
        let y = 160;
        const maxWidth = 420;
        const lineHeight = 30;

        for (const word of words) {
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && line !== '') {
                ctx.fillText(line.trim(), 256, y);
                line = word + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line.trim(), 256, y);

        // Subtitle
        if (subtitle) {
            ctx.fillStyle = '#a89b8c';
            ctx.font = 'italic 16px Georgia, serif';
            ctx.fillText(subtitle, 256, 320);
        }

        // "Click to view" hint
        ctx.fillStyle = '#6a6050';
        ctx.font = '14px Helvetica, sans-serif';
        ctx.fillText('Click to view', 256, 360);

        return new THREE.CanvasTexture(canvas);
    }

    function createExhibitFrame(scene, x, y, z, rotationY, title, data, index) {
        const group = new THREE.Group();

        // Frame border (gold)
        const frameMat = new THREE.MeshStandardMaterial({
            color: 0xc9a96e,
            roughness: 0.3,
            metalness: 0.6
        });
        const outerW = FRAME_WIDTH + FRAME_BORDER * 2;
        const outerH = FRAME_HEIGHT + FRAME_BORDER * 2;

        // Frame pieces (top, bottom, left, right)
        const topBar = new THREE.Mesh(
            new THREE.BoxGeometry(outerW, FRAME_BORDER, FRAME_DEPTH),
            frameMat
        );
        topBar.position.y = FRAME_HEIGHT / 2 + FRAME_BORDER / 2;

        const bottomBar = new THREE.Mesh(
            new THREE.BoxGeometry(outerW, FRAME_BORDER, FRAME_DEPTH),
            frameMat
        );
        bottomBar.position.y = -FRAME_HEIGHT / 2 - FRAME_BORDER / 2;

        const leftBar = new THREE.Mesh(
            new THREE.BoxGeometry(FRAME_BORDER, outerH, FRAME_DEPTH),
            frameMat
        );
        leftBar.position.x = -FRAME_WIDTH / 2 - FRAME_BORDER / 2;

        const rightBar = new THREE.Mesh(
            new THREE.BoxGeometry(FRAME_BORDER, outerH, FRAME_DEPTH),
            frameMat
        );
        rightBar.position.x = FRAME_WIDTH / 2 + FRAME_BORDER / 2;

        // Canvas/picture area
        const canvasTexture = createFrameTexture(title, 'Artifact', index);
        const pictureMat = new THREE.MeshBasicMaterial({ map: canvasTexture });
        const picture = new THREE.Mesh(
            new THREE.PlaneGeometry(FRAME_WIDTH, FRAME_HEIGHT),
            pictureMat
        );
        picture.position.z = FRAME_DEPTH / 2 + 0.001;

        group.add(topBar, bottomBar, leftBar, rightBar, picture);
        group.position.set(x, y, z);
        group.rotation.y = rotationY;

        scene.add(group);

        // Make the picture clickable
        picture.userData = {
            type: 'exhibit',
            data: data,
            groupMeshes: [topBar, bottomBar, leftBar, rightBar]
        };

        // Need to update world matrix for raycasting
        group.updateMatrixWorld(true);

        exhibitMap.set(picture.uuid, data);
        allExhibitMeshes.push(picture);

        return { group, picture };
    }

    function placeExhibitsInHall(scene, hall, exhibitKey) {
        const data = MUSEUM_DATA.exhibits[exhibitKey];
        if (!data) return;

        const artifacts = data.artifacts;
        const { cx, cz, axis } = hall;
        const hw = Museum.HALL_WIDTH / 2;
        const hd = Museum.HALL_DEPTH / 2;
        const wallOffset = 0.2; // distance from wall

        if (axis === 'x') {
            // Hall extends along X: artifacts go on top (neg Z) and bottom (pos Z) walls
            const wallZ_top = cz - hw + wallOffset;
            const wallZ_bottom = cz + hw - wallOffset;

            artifacts.forEach((artifact, i) => {
                const spacing = Museum.HALL_DEPTH / (artifacts.length + 1);
                const xPos = cx - hd + spacing * (i + 1);

                // Alternate walls
                if (i % 2 === 0) {
                    createExhibitFrame(scene, xPos, FRAME_Y, wallZ_top, 0, artifact.title, {
                        ...artifact,
                        exhibitKey,
                        wingName: data.name
                    }, i);
                } else {
                    createExhibitFrame(scene, xPos, FRAME_Y, wallZ_bottom, Math.PI, artifact.title, {
                        ...artifact,
                        exhibitKey,
                        wingName: data.name
                    }, i);
                }
            });
        } else {
            // Hall extends along Z: artifacts go on left (neg X) and right (pos X) walls
            const wallX_left = cx - hw + wallOffset;
            const wallX_right = cx + hw - wallOffset;

            artifacts.forEach((artifact, i) => {
                const spacing = Museum.HALL_DEPTH / (artifacts.length + 1);
                const zPos = cz - hd + spacing * (i + 1);

                if (i % 2 === 0) {
                    createExhibitFrame(scene, wallX_left, FRAME_Y, zPos, Math.PI / 2, artifact.title, {
                        ...artifact,
                        exhibitKey,
                        wingName: data.name
                    }, i);
                } else {
                    createExhibitFrame(scene, wallX_right, FRAME_Y, zPos, -Math.PI / 2, artifact.title, {
                        ...artifact,
                        exhibitKey,
                        wingName: data.name
                    }, i);
                }
            });
        }

        // Wing name sign at entrance
        addWingSign(scene, hall, data.name, data.subtitle);
    }

    function addWingSign(scene, hall, name, subtitle) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = 'rgba(26, 26, 46, 0.9)';
        ctx.fillRect(0, 0, 512, 256);

        ctx.strokeStyle = '#c9a96e';
        ctx.lineWidth = 3;
        ctx.strokeRect(15, 15, 482, 226);

        ctx.fillStyle = '#e8d5b7';
        ctx.font = 'bold 32px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText(name, 256, 100);

        if (subtitle) {
            ctx.fillStyle = '#a89b8c';
            ctx.font = 'italic 22px Georgia, serif';
            ctx.fillText(subtitle, 256, 150);
        }

        const texture = new THREE.CanvasTexture(canvas);
        const mat = new THREE.MeshBasicMaterial({ map: texture });
        const geo = new THREE.PlaneGeometry(3, 1.5);
        const sign = new THREE.Mesh(geo, mat);

        const { cx, cz, axis } = hall;
        if (axis === 'x') {
            sign.position.set(cx, Museum.WALL_HEIGHT - 1, cz);
            sign.rotation.y = cx < 0 ? Math.PI / 2 : -Math.PI / 2;
        } else {
            sign.position.set(cx, Museum.WALL_HEIGHT - 1, cz);
            sign.rotation.y = cz < 0 ? 0 : Math.PI;
        }

        scene.add(sign);
    }

    function placeInfoExhibits(scene, infoHall) {
        const { cx, cz, axis } = infoHall;
        const hw = Museum.HALL_WIDTH / 2;

        // About Me on left wall
        const aboutMeData = {
            title: MUSEUM_DATA.aboutMe.title,
            content: MUSEUM_DATA.aboutMe.content,
            reflection: null,
            type: 'info'
        };
        createExhibitFrame(scene, cx - hw + 0.2, FRAME_Y, cz, Math.PI / 2,
            'About Me', aboutMeData, 0);

        // About This ePortfolio on right wall
        const aboutPortData = {
            title: MUSEUM_DATA.aboutPortfolio.title,
            content: MUSEUM_DATA.aboutPortfolio.content,
            reflection: null,
            type: 'info'
        };
        createExhibitFrame(scene, cx + hw - 0.2, FRAME_Y, cz, -Math.PI / 2,
            'About This ePortfolio', aboutPortData, 1);

        // Wing sign
        addWingSign(scene, infoHall, 'Info Wing', 'About Me & This ePortfolio');
    }

    function placeCoverLetterExhibit(scene, coverLetterDisplay) {
        // The cover letter pedestal is clickable
        const data = {
            title: MUSEUM_DATA.coverLetter.title,
            content: MUSEUM_DATA.coverLetter.content,
            reflection: null,
            type: 'coverLetter'
        };

        coverLetterDisplay.userData = {
            type: 'exhibit',
            data: data
        };

        exhibitMap.set(coverLetterDisplay.uuid, data);
        allExhibitMeshes.push(coverLetterDisplay);
    }

    function getAllExhibitMeshes() {
        return allExhibitMeshes;
    }

    function getExhibitData(mesh) {
        return exhibitMap.get(mesh.uuid);
    }

    return {
        placeExhibitsInHall,
        placeInfoExhibits,
        placeCoverLetterExhibit,
        getAllExhibitMeshes,
        getExhibitData
    };
})();
