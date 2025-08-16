export function configureRaycaster(event, raycaster, mouse, camera, interactables) {
    // Convert mouse cord from pixel --> NDC for raycaster
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    const meshObjects = interactables.map(entry => entry.object); // 🔧 Extract only the objects

    raycaster.setFromCamera(mouse, camera);
    return raycaster.intersectObjects(meshObjects, true);
}

export function displayObjectLabel(name) {
    const labelPopup = document.getElementById('labelPopup');

    if (name.includes('screen')) {
        labelPopup.textContent = "PROJECTS";
    } else if (name.includes('github')) {
        labelPopup.textContent = "GITHUB";
    } else if (name.includes('instagram')) {
        labelPopup.textContent = "INSTAGRAM";
    } else if (name.includes('linkedIn')) {
        labelPopup.textContent = "LINKEDIN";
    } else if (name.includes('sketchbook')) {
        labelPopup.textContent = "ABOUT ME";
    }

    requestAnimationFrame(() => {
        labelPopup.classList.remove('opacity-0');
        labelPopup.classList.add('opacity-100');
    })
}

function hideTitle(title) {
    requestAnimationFrame(() => {
        title.classList.remove('opacity-100');
        title.classList.add('opacity-0');
    })
}

function showTitle(title) {
    requestAnimationFrame(() => {
        title.classList.remove('opacity-0');
        title.classList.add('opacity-100');
    })
}

function hideOverlay(overlay) {
    requestAnimationFrame(() => {
        overlay.classList.remove('opacity-100');
        overlay.classList.add('opacity-0');
    })
}

function showOverlay(overlay) {
    requestAnimationFrame(() => {
        overlay.classList.add('opacity-100');
        overlay.classList.remove('opacity-0');
    })
}

export function indicateUserClick() {
    setTimeout(() => {
        const overlay = document.getElementById('indicateUserClick');
        showOverlay(overlay);
        initTitleTrans();
    }, 2000);
}

export function controlListeners(controls) {
    const title = document.getElementById('titleText');
    const overlay = document.getElementById('userPrompt');

    controls.addEventListener('start', () => {hideTitle(title); hideOverlay(overlay);});
    controls.addEventListener('end', () => {showTitle(title);});
}

export function initTitleTrans() {
    const title = document.getElementById('titleText');

    title.classList.remove('opacity-0', '-translate-y-6');
    title.classList.add('opacity-100', 'translate-y-0');
}

export function registerCLickableObjects(room) {
    const objects = [];
    room.traverse((child) => {
        if (child.isMesh) {
            if (child.name.includes("instagramLogo")) {
                child.userData.url = 'https://www.instagram.com/yiru_jang/';
                objects.push({
                    object: child,
                    type: "contact"
                });
            } else if (child.name.includes("githubLogo")) {
                child.userData.url = 'https://github.com/yiruJ';
                objects.push({
                    object: child,
                    type: "contact"
                });
            } else if (child.name.includes("linkedInLogo")) {
                child.userData.url = 'https://www.linkedin.com/in/yiru-jang-47995a1a0';
                objects.push({
                    object: child,
                    type: "contact"
                });
            } else if (child.name.includes("screen_right")) {
                objects.push({
                    object: child,
                    type: "project"
                });
            } else if (child.name.includes("sketchbook")) {
                objects.push({
                    object: child,
                    type: "about"
                });
            } 
        }
    });

    return objects;
}

export function handleRoomSize(renderer, room, camera) {
    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        const scaleFactor = window.innerWidth < 768 ? 0.8 : 1;
        room.scale.set(scaleFactor, scaleFactor, scaleFactor);
    });
}