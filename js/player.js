/**
 * PLAYER CONTROLS
 * First-person WASD movement + mouse look with collision detection.
 */

const Player = (() => {
    const MOVE_SPEED = 5;
    const MOUSE_SENSITIVITY = 0.002;
    const PLAYER_HEIGHT = 1.7;
    const PLAYER_RADIUS = 0.4;
    const HEAD_BOB_SPEED = 8;
    const HEAD_BOB_AMOUNT = 0.04;

    let camera;
    let euler = new THREE.Euler(0, 0, 0, 'YXZ');
    let isLocked = false;
    let headBobTime = 0;

    const keys = {
        forward: false,
        backward: false,
        left: false,
        right: false
    };

    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();

    function init(cam) {
        camera = cam;
        camera.position.set(0, PLAYER_HEIGHT, 5);
        camera.rotation.order = 'YXZ';

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
        document.addEventListener('mousemove', onMouseMove);
    }

    function lockPointer() {
        document.body.requestPointerLock();
    }

    function setupPointerLock() {
        document.addEventListener('pointerlockchange', () => {
            isLocked = document.pointerLockElement === document.body;
        });
    }

    function onKeyDown(e) {
        switch (e.code) {
            case 'KeyW': case 'ArrowUp': keys.forward = true; break;
            case 'KeyS': case 'ArrowDown': keys.backward = true; break;
            case 'KeyA': case 'ArrowLeft': keys.left = true; break;
            case 'KeyD': case 'ArrowRight': keys.right = true; break;
        }
    }

    function onKeyUp(e) {
        switch (e.code) {
            case 'KeyW': case 'ArrowUp': keys.forward = false; break;
            case 'KeyS': case 'ArrowDown': keys.backward = false; break;
            case 'KeyA': case 'ArrowLeft': keys.left = false; break;
            case 'KeyD': case 'ArrowRight': keys.right = false; break;
        }
    }

    function onMouseMove(e) {
        if (!isLocked) return;

        euler.setFromQuaternion(camera.quaternion);
        euler.y -= e.movementX * MOUSE_SENSITIVITY;
        euler.x -= e.movementY * MOUSE_SENSITIVITY;
        euler.x = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, euler.x));
        camera.quaternion.setFromEuler(euler);
    }

    function checkCollision(newPos, walls) {
        const playerBB = new THREE.Box3(
            new THREE.Vector3(newPos.x - PLAYER_RADIUS, 0, newPos.z - PLAYER_RADIUS),
            new THREE.Vector3(newPos.x + PLAYER_RADIUS, PLAYER_HEIGHT, newPos.z + PLAYER_RADIUS)
        );

        for (const wall of walls) {
            if (!wall.geometry.boundingBox) {
                wall.geometry.computeBoundingBox();
            }
            const wallBB = wall.geometry.boundingBox.clone();
            wallBB.applyMatrix4(wall.matrixWorld);

            if (playerBB.intersectsBox(wallBB)) {
                return true;
            }
        }
        return false;
    }

    function update(delta, walls) {
        if (!isLocked) return;

        // Calculate movement direction
        direction.set(0, 0, 0);

        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();

        const right = new THREE.Vector3();
        right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

        if (keys.forward) direction.add(forward);
        if (keys.backward) direction.sub(forward);
        if (keys.left) direction.sub(right);
        if (keys.right) direction.add(right);

        const isMoving = direction.lengthSq() > 0;

        if (isMoving) {
            direction.normalize();
        }

        const speed = MOVE_SPEED * delta;

        // Try X movement
        const newPosX = camera.position.clone();
        newPosX.x += direction.x * speed;
        if (!checkCollision(newPosX, walls)) {
            camera.position.x = newPosX.x;
        }

        // Try Z movement
        const newPosZ = camera.position.clone();
        newPosZ.z += direction.z * speed;
        if (!checkCollision(newPosZ, walls)) {
            camera.position.z = newPosZ.z;
        }

        // Head bob
        if (isMoving) {
            headBobTime += delta * HEAD_BOB_SPEED;
            camera.position.y = PLAYER_HEIGHT + Math.sin(headBobTime) * HEAD_BOB_AMOUNT;
        } else {
            headBobTime = 0;
            camera.position.y += (PLAYER_HEIGHT - camera.position.y) * 0.1;
        }
    }

    function getPosition() {
        return camera ? camera.position : new THREE.Vector3();
    }

    function getDirection() {
        if (!camera) return new THREE.Vector3(0, 0, -1);
        const dir = new THREE.Vector3();
        camera.getWorldDirection(dir);
        return dir;
    }

    function isPointerLocked() {
        return isLocked;
    }

    return {
        init,
        update,
        lockPointer,
        setupPointerLock,
        getPosition,
        getDirection,
        isPointerLocked
    };
})();
