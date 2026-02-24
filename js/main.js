/**
 * MAIN
 * Entry point: sets up Three.js scene, orchestrates museum building,
 * manages loading/start screens, and runs the animation loop.
 */

(function () {
    // ===================== MOBILE DETECTION =====================
    const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        || (navigator.maxTouchPoints > 1 && window.innerWidth < 1024);

    if (isMobile) {
        showMobileFallback();
        return;
    }

    // ===================== THREE.JS SETUP =====================
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1814);
    scene.fog = new THREE.Fog(0x1a1814, 20, 50);

    const camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    document.body.appendChild(renderer.domElement);

    // ===================== RESIZE HANDLER =====================
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ===================== DUST PARTICLE SYSTEM =====================
    let dustParticles;
    function createDustParticles() {
        const count = 200;
        const positions = new Float32Array(count * 3);
        const velocities = [];
        const spread = 40;

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * spread;
            positions[i * 3 + 1] = Math.random() * Museum.WALL_HEIGHT;
            positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
            velocities.push({
                x: (Math.random() - 0.5) * 0.1,
                y: (Math.random() - 0.5) * 0.05,
                z: (Math.random() - 0.5) * 0.1
            });
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const mat = new THREE.PointsMaterial({
            color: 0xffe8cc,
            size: 0.03,
            transparent: true,
            opacity: 0.4,
            sizeAttenuation: true
        });

        dustParticles = new THREE.Points(geo, mat);
        dustParticles.userData.velocities = velocities;
        scene.add(dustParticles);
    }

    function updateDustParticles(delta) {
        if (!dustParticles) return;
        const positions = dustParticles.geometry.attributes.position.array;
        const velocities = dustParticles.userData.velocities;
        const spread = 40;

        for (let i = 0; i < velocities.length; i++) {
            positions[i * 3] += velocities[i].x * delta;
            positions[i * 3 + 1] += velocities[i].y * delta;
            positions[i * 3 + 2] += velocities[i].z * delta;

            // Wrap around bounds
            if (Math.abs(positions[i * 3]) > spread / 2) positions[i * 3] *= -0.9;
            if (positions[i * 3 + 1] < 0 || positions[i * 3 + 1] > Museum.WALL_HEIGHT) velocities[i].y *= -1;
            if (Math.abs(positions[i * 3 + 2]) > spread / 2) positions[i * 3 + 2] *= -0.9;

            // Gentle drift change
            if (Math.random() < 0.01) {
                velocities[i].x += (Math.random() - 0.5) * 0.02;
                velocities[i].z += (Math.random() - 0.5) * 0.02;
            }
        }
        dustParticles.geometry.attributes.position.needsUpdate = true;
    }

    // ===================== BUILD MUSEUM =====================
    const loadingFill = document.getElementById('loading-fill');
    const loadingText = document.getElementById('loading-text');

    let loadProgress = 0;
    function updateLoading(progress, text) {
        loadProgress = progress;
        loadingFill.style.width = progress + '%';
        loadingText.textContent = text;
    }

    updateLoading(10, 'Building museum walls...');

    const museumResult = Museum.build(scene);
    updateLoading(35, 'Placing exhibits...');

    Exhibits.placeExhibitsInHall(scene, museumResult.halls.trilobite, 'trilobite');
    updateLoading(45, 'Placing exhibits...');

    Exhibits.placeExhibitsInHall(scene, museumResult.halls.archaeopteryx, 'archaeopteryx');
    updateLoading(55, 'Placing exhibits...');

    Exhibits.placeExhibitsInHall(scene, museumResult.halls.neanderthal, 'neanderthal');
    updateLoading(65, 'Setting up info wing...');

    Exhibits.placeInfoExhibits(scene, museumResult.halls.info);
    updateLoading(72, 'Setting up cover letter...');

    Exhibits.placeCoverLetterExhibit(scene, museumResult.coverLetterDisplay);
    updateLoading(78, 'Creating atmosphere...');

    createDustParticles();
    updateLoading(85, 'Populating museum visitors...');

    NPCSystem.init(scene);
    updateLoading(95, 'Initializing controls...');

    // ===================== INIT SYSTEMS =====================
    Player.init(camera);
    Player.setupPointerLock();
    Interactions.init(camera);

    updateLoading(100, 'Ready!');

    // ===================== LOADING -> START TRANSITION =====================
    setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('start-screen').style.display = 'flex';
    }, 600);

    // ===================== START BUTTON =====================
    document.getElementById('start-button').addEventListener('click', () => {
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('hud').style.display = 'block';
        Player.lockPointer();
    });

    // Re-lock pointer when clicking canvas (after ESC)
    renderer.domElement.addEventListener('click', () => {
        if (!Player.isPointerLocked() && !Interactions.isOverlayOpen()) {
            Player.lockPointer();
        }
    });

    // ===================== ANIMATION LOOP =====================
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const delta = Math.min(clock.getDelta(), 0.1);

        Player.update(delta, Museum.getCollisionWalls());
        Interactions.update();
        NPCSystem.update(delta, Museum.getCollisionWalls());
        updateDustParticles(delta);

        renderer.render(scene, camera);
    }

    animate();

    // ===================== MOBILE FALLBACK =====================
    function showMobileFallback() {
        document.getElementById('loading-screen').style.display = 'none';
        const fallback = document.getElementById('mobile-fallback');
        fallback.style.display = 'block';

        let html = `
            <h1>Museum of Science Communication</h1>
            <p class="mobile-subtitle">NSC ePortfolio — Mobile View</p>
            <p style="text-align:center; color:#a89b8c; margin-bottom:2rem; font-size:0.9rem;">
                For the full 3D museum experience, please visit on a desktop computer.
            </p>
        `;

        // Cover letter
        html += `<div class="mobile-section">
            <h2>${MUSEUM_DATA.coverLetter.title}</h2>
            ${MUSEUM_DATA.coverLetter.content}
        </div>`;

        // About Me
        html += `<div class="mobile-section">
            <h2>${MUSEUM_DATA.aboutMe.title}</h2>
            ${MUSEUM_DATA.aboutMe.content}
        </div>`;

        // Exhibits
        for (const [key, exhibit] of Object.entries(MUSEUM_DATA.exhibits)) {
            html += `<div class="mobile-section">
                <h2>${exhibit.name}</h2>
                <p style="font-style:italic; color:#a89b8c; margin-bottom:1rem;">${exhibit.subtitle}</p>`;

            exhibit.artifacts.forEach(artifact => {
                html += `<div class="mobile-artifact">
                    <h3>${artifact.title}</h3>
                    ${artifact.content}
                    ${artifact.image ? `<img src="${artifact.image}" style="width:100%; border-radius:8px; margin:0.5rem 0;" alt="${artifact.title}">` : ''}
                    ${artifact.reflection ? `<div class="reflection">${artifact.reflection}</div>` : ''}
                </div>`;
            });

            html += `</div>`;
        }

        // About Portfolio
        html += `<div class="mobile-section">
            <h2>${MUSEUM_DATA.aboutPortfolio.title}</h2>
            ${MUSEUM_DATA.aboutPortfolio.content}
        </div>`;

        fallback.innerHTML = html;
    }
})();
