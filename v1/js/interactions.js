/**
 * INTERACTIONS
 * Raycasting for exhibit detection, overlay management, minimap drawing, brochure system.
 */

const Interactions = (() => {
    const raycaster = new THREE.Raycaster();
    raycaster.far = 8; // Max interaction distance

    let hoveredExhibit = null;
    let overlayOpen = false;
    let brochureOpen = false;
    let camera;

    const promptEl = document.getElementById('interact-prompt');
    const overlayEl = document.getElementById('exhibit-overlay');
    const overlayTitle = document.getElementById('overlay-title');
    const overlayBody = document.getElementById('overlay-body');
    const overlayClose = document.getElementById('overlay-close');
    const roomLabel = document.getElementById('room-label');
    const minimapCanvas = document.getElementById('minimap');
    const minimapCtx = minimapCanvas.getContext('2d');

    let currentRoom = 'Lobby';
    let highlightedFrames = [];

    function init(cam) {
        camera = cam;

        // Close overlay on button click
        overlayClose.addEventListener('click', closeOverlay);

        // Close overlay on ESC; toggle brochure on M
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Escape') {
                if (overlayOpen) closeOverlay();
                else if (brochureOpen) closeBrochure();
            }
            if (e.code === 'KeyM' && !overlayOpen) {
                if (brochureOpen) closeBrochure();
                else openBrochure();
            }
        });

        // Click to interact
        document.addEventListener('click', onClick);

        // Setup brochure
        initBrochure();
    }

    function onClick() {
        if (overlayOpen || brochureOpen) return;
        if (!Player.isPointerLocked()) return;

        if (hoveredExhibit) {
            openOverlay(hoveredExhibit);
        }
    }

    function openOverlay(data) {
        overlayOpen = true;
        document.exitPointerLock();

        const contentEl = overlayEl.querySelector('.overlay-content');
        if (data.type === 'coverLetter') {
            contentEl.classList.add('overlay-wide');
            overlayTitle.style.display = 'none';
        } else {
            contentEl.classList.remove('overlay-wide');
            overlayTitle.style.display = '';
            overlayTitle.textContent = data.title;
        }

        let bodyHTML = '';

        // Artifact content
        if (data.content) {
            bodyHTML += data.content;
        }

        // Image
        if (data.image) {
            bodyHTML += `<img class="artifact-image" src="${data.image}" alt="${data.title}">`;
        }

        // Reflection
        if (data.reflection) {
            bodyHTML += `<h3>Reflection</h3><div class="reflection">${data.reflection}</div>`;
        }

        // Wing name badge for exhibit artifacts
        if (data.wingName) {
            bodyHTML = `<p style="color:#c9a96e; font-size:0.85rem; margin-bottom:1rem; letter-spacing:0.1em;">${data.wingName}</p>` + bodyHTML;
        }

        overlayBody.innerHTML = bodyHTML;
        overlayEl.style.display = 'flex';
        overlayEl.classList.add('fade-in');
    }

    function closeOverlay() {
        overlayOpen = false;
        overlayEl.style.display = 'none';
        overlayEl.classList.remove('fade-in');

        // Re-lock pointer
        setTimeout(() => {
            Player.lockPointer();
        }, 100);
    }

    // ===================== BROCHURE SYSTEM =====================

    // Teleport positions for wings and artifacts
    // Hall geometry: GRAND_HALL = 24x24, center at origin; wings HALL_WIDTH=12, HALL_DEPTH=22
    // Trilobite hall: cx=-23, cz=0, axis='x'; Archaeopteryx: cx=23, cz=0, axis='x'
    // Neanderthal: cx=0, cz=-23, axis='z'; Info: cx=0, cz=23, axis='z'
    // For axis='x': artifacts spaced along X, alternating top wall (z≈-5.8) and bottom (z≈5.8)
    // For axis='z': artifacts spaced along Z, alternating left wall (x≈-5.8) and right (x≈5.8)
    // spacing = HALL_DEPTH / (numArtifacts+1) = 22/4 = 5.5; base = cx-hd or cz-hd where hd=11
    const SP = 5.5; // artifact spacing

    const teleportTargets = {
        grandHall: { x: 0, z: 5, yaw: Math.PI },
        coverLetter: 'overlay',
        trilobiteWing: { x: -15, z: 0, yaw: Math.PI / 2 },
        archaeopteryxWing: { x: 15, z: 0, yaw: -Math.PI / 2 },
        neanderthalWing: { x: 0, z: -15, yaw: 0 },
        infoWing: { x: 0, z: 15, yaw: Math.PI },
        // Trilobite (cx=-23, axis='x'): xPos = -34 + SP*(i+1), even→top wall z=-4, odd→bottom wall z=4
        trilobite_0: { x: -34 + SP * 1, z: -4, yaw: 0 },          // x=-28.5
        trilobite_1: { x: -34 + SP * 2, z: 4, yaw: Math.PI },      // x=-23
        trilobite_2: { x: -34 + SP * 3, z: -4, yaw: 0 },           // x=-17.5
        // Archaeopteryx (cx=23, axis='x'): xPos = 12 + SP*(i+1)
        archaeopteryx_0: { x: 12 + SP * 1, z: -4, yaw: 0 },        // x=17.5
        archaeopteryx_1: { x: 12 + SP * 2, z: 4, yaw: Math.PI },    // x=23
        archaeopteryx_2: { x: 12 + SP * 3, z: -4, yaw: 0 },         // x=28.5
        // Neanderthal (cz=-23, axis='z'): zPos = -34 + SP*(i+1), even→left wall x=-4, odd→right wall x=4
        neanderthal_0: { x: -4, z: -34 + SP * 1, yaw: Math.PI / 2 },   // z=-28.5
        neanderthal_1: { x: 4, z: -34 + SP * 2, yaw: -Math.PI / 2 },   // z=-23
        neanderthal_2: { x: -4, z: -34 + SP * 3, yaw: Math.PI / 2 },   // z=-17.5
        // Info wing (cz=23, axis='z')
        aboutMe: { x: -4, z: 23, yaw: Math.PI / 2 },
        aboutPortfolio: { x: 4, z: 23, yaw: -Math.PI / 2 },
    };

    function initBrochure() {
        const brochureBtn = document.getElementById('brochure-btn');
        const brochureOverlay = document.getElementById('brochure-overlay');
        const brochureClose = document.getElementById('brochure-close');

        if (brochureBtn) {
            brochureBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (brochureOpen) closeBrochure();
                else openBrochure();
            });
        }

        if (brochureClose) {
            brochureClose.addEventListener('click', closeBrochure);
        }

        // Wire up all teleport links in the brochure
        if (brochureOverlay) {
            brochureOverlay.querySelectorAll('[data-teleport]').forEach(el => {
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = el.getAttribute('data-teleport');
                    handleTeleport(target);
                });
            });
        }
    }

    function openBrochure() {
        brochureOpen = true;
        document.exitPointerLock();
        const el = document.getElementById('brochure-overlay');
        if (el) {
            el.style.display = 'flex';
            el.classList.add('fade-in');
        }
    }

    function closeBrochure() {
        brochureOpen = false;
        const el = document.getElementById('brochure-overlay');
        if (el) {
            el.style.display = 'none';
            el.classList.remove('fade-in');
        }
        setTimeout(() => {
            Player.lockPointer();
        }, 100);
    }

    function handleTeleport(targetKey) {
        const target = teleportTargets[targetKey];
        if (!target) return;

        if (target === 'overlay') {
            // Open cover letter
            closeBrochure();
            setTimeout(() => {
                openOverlay({
                    title: MUSEUM_DATA.coverLetter.title,
                    content: MUSEUM_DATA.coverLetter.buildContent(),
                    type: 'coverLetter'
                });
            }, 150);
            return;
        }

        closeBrochure();
        Player.teleportTo(target.x, target.z, target.yaw);
        setTimeout(() => {
            Player.lockPointer();
        }, 150);
    }

    // ===================== RAYCASTING & UPDATE =====================

    function update() {
        if (overlayOpen || brochureOpen || !Player.isPointerLocked()) return;

        // Cast ray from camera center
        raycaster.set(camera.position, Player.getDirection());

        const exhibits = Exhibits.getAllExhibitMeshes();
        const intersects = raycaster.intersectObjects(exhibits, true);

        // Reset previous highlight
        if (highlightedFrames.length > 0) {
            highlightedFrames.forEach(mesh => {
                mesh.material.emissive = new THREE.Color(0x000000);
            });
            highlightedFrames = [];
        }

        if (intersects.length > 0) {
            const hit = intersects[0].object;
            const userData = hit.userData;

            if (userData && userData.type === 'exhibit') {
                hoveredExhibit = userData.data;
                promptEl.style.display = 'block';

                // Highlight frame
                if (userData.groupMeshes) {
                    userData.groupMeshes.forEach(mesh => {
                        mesh.material.emissive = new THREE.Color(0x332200);
                    });
                    highlightedFrames = userData.groupMeshes;
                }
            } else {
                hoveredExhibit = null;
                promptEl.style.display = 'none';
            }
        } else {
            hoveredExhibit = null;
            promptEl.style.display = 'none';
        }

        // Update room label
        const pos = Player.getPosition();
        const newRoom = Museum.getCurrentRoom(pos.x, pos.z);
        if (newRoom !== currentRoom) {
            currentRoom = newRoom;
            roomLabel.textContent = currentRoom;
            roomLabel.style.opacity = '1';
        }

        // Draw minimap
        drawMinimap();
    }

    function drawMinimap() {
        const w = minimapCanvas.width;
        const h = minimapCanvas.height;
        const scale = 1.8; // pixels per unit
        const cx = w / 2;
        const cy = h / 2;

        minimapCtx.clearRect(0, 0, w, h);
        minimapCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        minimapCtx.fillRect(0, 0, w, h);

        const pos = Player.getPosition();
        const dir = Player.getDirection();

        // Draw rooms
        const rooms = Museum.getRooms();
        rooms.forEach(room => {
            const rx = cx + (room.minX - pos.x) * scale;
            const ry = cy + (room.minZ - pos.z) * scale;
            const rw = (room.maxX - room.minX) * scale;
            const rh = (room.maxZ - room.minZ) * scale;

            minimapCtx.fillStyle = currentRoom === room.name
                ? 'rgba(201, 169, 110, 0.25)'
                : 'rgba(100, 90, 75, 0.15)';
            minimapCtx.fillRect(rx, ry, rw, rh);

            minimapCtx.strokeStyle = 'rgba(201, 169, 110, 0.4)';
            minimapCtx.lineWidth = 1;
            minimapCtx.strokeRect(rx, ry, rw, rh);

            // Room label on minimap
            minimapCtx.fillStyle = 'rgba(232, 213, 183, 0.5)';
            minimapCtx.font = '8px sans-serif';
            minimapCtx.textAlign = 'center';
            const labelParts = room.name.split(' ');
            minimapCtx.fillText(labelParts[0], rx + rw / 2, ry + rh / 2 + 3);
        });

        // Draw player position (always at center)
        minimapCtx.fillStyle = '#c9a96e';
        minimapCtx.beginPath();
        minimapCtx.arc(cx, cy, 3, 0, Math.PI * 2);
        minimapCtx.fill();

        // Draw direction indicator
        minimapCtx.strokeStyle = '#c9a96e';
        minimapCtx.lineWidth = 2;
        minimapCtx.beginPath();
        minimapCtx.moveTo(cx, cy);
        minimapCtx.lineTo(cx + dir.x * 12, cy + dir.z * 12);
        minimapCtx.stroke();
    }

    function isOverlayOpen() {
        return overlayOpen;
    }

    function isBrochureOpen() {
        return brochureOpen;
    }

    return {
        init,
        update,
        isOverlayOpen,
        isBrochureOpen,
        openOverlay,
        closeOverlay,
        openBrochure,
        closeBrochure
    };
})();
