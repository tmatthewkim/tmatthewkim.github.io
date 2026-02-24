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
    scene.background = new THREE.Color(0x0a0a14);
    scene.fog = new THREE.Fog(0x0a0a14, 15, 35);

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
    renderer.toneMappingExposure = 1.2;
    document.body.appendChild(renderer.domElement);

    // ===================== RESIZE HANDLER =====================
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ===================== BUILD MUSEUM =====================
    const loadingFill = document.getElementById('loading-fill');
    const loadingText = document.getElementById('loading-text');

    // Simulate loading steps
    let loadProgress = 0;
    function updateLoading(progress, text) {
        loadProgress = progress;
        loadingFill.style.width = progress + '%';
        loadingText.textContent = text;
    }

    updateLoading(10, 'Building museum walls...');

    // Build the museum geometry
    const museumResult = Museum.build(scene);
    updateLoading(40, 'Placing exhibits...');

    // Place exhibits in halls
    Exhibits.placeExhibitsInHall(scene, museumResult.halls.trilobite, 'trilobite');
    updateLoading(55, 'Placing exhibits...');

    Exhibits.placeExhibitsInHall(scene, museumResult.halls.archaeopteryx, 'archaeopteryx');
    updateLoading(70, 'Placing exhibits...');

    Exhibits.placeExhibitsInHall(scene, museumResult.halls.neanderthal, 'neanderthal');
    updateLoading(80, 'Setting up info wing...');

    // Place info exhibits
    Exhibits.placeInfoExhibits(scene, museumResult.halls.info);
    updateLoading(85, 'Setting up cover letter...');

    // Place cover letter
    Exhibits.placeCoverLetterExhibit(scene, museumResult.coverLetterDisplay);
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
