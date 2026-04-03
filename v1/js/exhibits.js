/**
 * EXHIBITS
 * Creates exhibit frames on walls, room signage, and info panels.
 */

const Exhibits = (() => {
    const DEFAULT_FRAME_WIDTH = 2.2;
    const DEFAULT_FRAME_HEIGHT = 1.7;
    const FRAME_DEPTH = 0.08;
    const FRAME_BORDER = 0.12;
    const FRAME_Y = 2.2;

    // All clickable exhibit meshes mapped to their data
    const exhibitMap = new Map();
    const allExhibitMeshes = [];

    function computeFrameDimensions(imgWidth, imgHeight) {
        var aspect = imgWidth / imgHeight;
        // Scale so frame area is roughly the same as default
        var area = DEFAULT_FRAME_WIDTH * DEFAULT_FRAME_HEIGHT;
        var h = Math.sqrt(area / aspect);
        var w = h * aspect;
        // Clamp to reasonable bounds
        var maxW = 3.0, maxH = 2.8, minW = 1.2, minH = 1.0;
        if (w > maxW) { w = maxW; h = w / aspect; }
        if (h > maxH) { h = maxH; w = h * aspect; }
        if (w < minW) { w = minW; h = w / aspect; }
        if (h < minH) { h = minH; w = h * aspect; }
        return { w: w, h: h };
    }

    function buildFrameMeshes(group, frameW, frameH, canvasTexture) {
        // Remove old children
        while (group.children.length > 0) {
            var child = group.children[0];
            group.remove(child);
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (child.material.map && child.material.map !== canvasTexture) child.material.map.dispose();
                child.material.dispose();
            }
        }

        var frameMat = new THREE.MeshStandardMaterial({
            color: 0xc9a96e,
            roughness: 0.3,
            metalness: 0.6
        });
        var outerW = frameW + FRAME_BORDER * 2;
        var outerH = frameH + FRAME_BORDER * 2;

        var topBar = new THREE.Mesh(new THREE.BoxGeometry(outerW, FRAME_BORDER, FRAME_DEPTH), frameMat);
        topBar.position.y = frameH / 2 + FRAME_BORDER / 2;

        var bottomBar = new THREE.Mesh(new THREE.BoxGeometry(outerW, FRAME_BORDER, FRAME_DEPTH), frameMat);
        bottomBar.position.y = -frameH / 2 - FRAME_BORDER / 2;

        var leftBar = new THREE.Mesh(new THREE.BoxGeometry(FRAME_BORDER, outerH, FRAME_DEPTH), frameMat);
        leftBar.position.x = -frameW / 2 - FRAME_BORDER / 2;

        var rightBar = new THREE.Mesh(new THREE.BoxGeometry(FRAME_BORDER, outerH, FRAME_DEPTH), frameMat);
        rightBar.position.x = frameW / 2 + FRAME_BORDER / 2;

        var pictureMat = new THREE.MeshBasicMaterial({ map: canvasTexture });
        var picture = new THREE.Mesh(new THREE.PlaneGeometry(frameW, frameH), pictureMat);
        picture.position.z = FRAME_DEPTH / 2 + 0.001;

        group.add(topBar, bottomBar, leftBar, rightBar, picture);

        return { picture: picture, bars: [topBar, bottomBar, leftBar, rightBar] };
    }

    function createFrameTexture(title, subtitle, index, thumbnailKey, onImageLoaded) {
        var canvasW = 512;
        var canvasH = 384;
        var canvas = document.createElement('canvas');
        canvas.width = canvasW;
        canvas.height = canvasH;
        var ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = '#0e0e1a';
        ctx.fillRect(0, 0, canvasW, canvasH);

        var tex = new THREE.CanvasTexture(canvas);

        // If thumbnail available, draw image with title overlay
        var thumbData = (typeof EXHIBIT_THUMBNAILS !== 'undefined') ? EXHIBIT_THUMBNAILS[thumbnailKey] : null;
        if (thumbData) {
            var img = new Image();
            img.onload = function() {
                // Resize canvas to match image aspect ratio
                var aspect = img.naturalWidth / img.naturalHeight;
                if (aspect >= 1) {
                    canvasW = 512;
                    canvasH = Math.round(512 / aspect);
                } else {
                    canvasH = 512;
                    canvasW = Math.round(512 * aspect);
                }
                canvas.width = canvasW;
                canvas.height = canvasH;
                // Redraw background
                ctx.fillStyle = '#0e0e1a';
                ctx.fillRect(0, 0, canvasW, canvasH);
                // Draw image filling the canvas
                ctx.drawImage(img, 0, 0, canvasW, canvasH);
                // Dark gradient at bottom for title
                var gradStart = Math.round(canvasH * 0.65);
                var grad = ctx.createLinearGradient(0, gradStart, 0, canvasH);
                grad.addColorStop(0, 'rgba(0,0,0,0)');
                grad.addColorStop(1, 'rgba(0,0,0,0.85)');
                ctx.fillStyle = grad;
                ctx.fillRect(0, gradStart, canvasW, canvasH - gradStart);
                // Title text
                ctx.fillStyle = '#e8d5b7';
                ctx.font = 'bold 22px Georgia, serif';
                ctx.textAlign = 'center';
                ctx.fillText(title, canvasW / 2, canvasH - 29);
                // Click hint
                ctx.fillStyle = '#a89b8c';
                ctx.font = '13px Helvetica, sans-serif';
                ctx.fillText('Click to view', canvasW / 2, canvasH - 9);
                tex.needsUpdate = true;

                // Notify caller of image dimensions so frame can resize
                if (onImageLoaded) {
                    onImageLoaded(img.naturalWidth, img.naturalHeight, tex);
                }
            };
            img.src = thumbData;
            return tex;
        }

        // Default: text-only frame
        // Inner border
        ctx.strokeStyle = '#c9a96e';
        ctx.lineWidth = 2;
        ctx.strokeRect(20, 20, 472, 344);

        // Number
        ctx.fillStyle = '#c9a96e';
        ctx.font = 'bold 28px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('' + (index + 1), 256, 80);

        // Title
        ctx.fillStyle = '#e8d5b7';
        ctx.font = '22px Georgia, serif';

        // Word wrap title
        var words = title.split(' ');
        var line = '';
        var yPos = 160;
        var maxWidth = 420;
        var lineHeight = 30;

        for (var wi = 0; wi < words.length; wi++) {
            var testLine = line + words[wi] + ' ';
            var metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && line !== '') {
                ctx.fillText(line.trim(), 256, yPos);
                line = words[wi] + ' ';
                yPos += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line.trim(), 256, yPos);

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

        return tex;
    }

    function createExhibitFrame(scene, x, y, z, rotationY, title, data, index, thumbnailKey) {
        var group = new THREE.Group();
        group.position.set(x, y, z);
        group.rotation.y = rotationY;
        scene.add(group);

        var frameW = DEFAULT_FRAME_WIDTH;
        var frameH = DEFAULT_FRAME_HEIGHT;

        var canvasTexture = createFrameTexture(title, 'Artifact', index, thumbnailKey, function(imgW, imgH, tex) {
            // Image loaded — rebuild frame with correct aspect ratio
            var dims = computeFrameDimensions(imgW, imgH);
            var result = buildFrameMeshes(group, dims.w, dims.h, tex);
            // Update the clickable picture userData and tracking
            result.picture.userData = {
                type: 'exhibit',
                data: data,
                groupMeshes: result.bars
            };
            // Replace old picture in tracking arrays
            var oldIdx = allExhibitMeshes.indexOf(picture);
            if (oldIdx !== -1) {
                exhibitMap.delete(allExhibitMeshes[oldIdx].uuid);
                allExhibitMeshes[oldIdx] = result.picture;
            }
            exhibitMap.set(result.picture.uuid, data);
            group.updateMatrixWorld(true);
        });

        // Build initial frame with default dimensions
        var meshes = buildFrameMeshes(group, frameW, frameH, canvasTexture);
        var picture = meshes.picture;

        // Make the picture clickable
        picture.userData = {
            type: 'exhibit',
            data: data,
            groupMeshes: meshes.bars
        };

        group.updateMatrixWorld(true);

        exhibitMap.set(picture.uuid, data);
        allExhibitMeshes.push(picture);

        return { group: group, picture: picture };
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
                    }, i, artifact.thumbnail);
                } else {
                    createExhibitFrame(scene, xPos, FRAME_Y, wallZ_bottom, Math.PI, artifact.title, {
                        ...artifact,
                        exhibitKey,
                        wingName: data.name
                    }, i, artifact.thumbnail);
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
                    }, i, artifact.thumbnail);
                } else {
                    createExhibitFrame(scene, wallX_right, FRAME_Y, zPos, -Math.PI / 2, artifact.title, {
                        ...artifact,
                        exhibitKey,
                        wingName: data.name
                    }, i, artifact.thumbnail);
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
            'About Me', aboutMeData, 0, 'info-aboutme');

        // About This ePortfolio on right wall
        const aboutPortData = {
            title: MUSEUM_DATA.aboutPortfolio.title,
            content: MUSEUM_DATA.aboutPortfolio.content,
            reflection: null,
            type: 'info'
        };
        createExhibitFrame(scene, cx + hw - 0.2, FRAME_Y, cz, -Math.PI / 2,
            'About This ePortfolio', aboutPortData, 1, 'info-portfolio');

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

    function registerExhibitMesh(mesh, data) {
        mesh.userData = { type: 'exhibit', data: data };
        exhibitMap.set(mesh.uuid, data);
        allExhibitMeshes.push(mesh);
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
        registerExhibitMesh,
        getAllExhibitMeshes,
        getExhibitData
    };
})();
