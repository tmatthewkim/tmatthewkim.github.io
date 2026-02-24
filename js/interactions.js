/**
 * INTERACTIONS
 * Raycasting for exhibit detection, overlay management, minimap drawing.
 */

const Interactions = (() => {
    const raycaster = new THREE.Raycaster();
    raycaster.far = 8; // Max interaction distance

    let hoveredExhibit = null;
    let overlayOpen = false;
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

        // Close overlay on ESC
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Escape' && overlayOpen) {
                closeOverlay();
            }
        });

        // Click to interact
        document.addEventListener('click', onClick);
    }

    function onClick() {
        if (overlayOpen) return;
        if (!Player.isPointerLocked()) return;

        if (hoveredExhibit) {
            openOverlay(hoveredExhibit);
        }
    }

    function openOverlay(data) {
        overlayOpen = true;
        document.exitPointerLock();

        overlayTitle.textContent = data.title;

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

    function update() {
        if (overlayOpen || !Player.isPointerLocked()) return;

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

    return {
        init,
        update,
        isOverlayOpen
    };
})();
