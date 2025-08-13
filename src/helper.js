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

export function hideTitle(title) {
    requestAnimationFrame(() => {
        title.classList.remove('opacity-100');
        title.classList.add('opacity-0');
    })
}

export function showTitle(title) {
    requestAnimationFrame(() => {
        title.classList.remove('opacity-0');
        title.classList.add('opacity-100');
    })
}

export function controlListeners(controls) {
    const title = document.getElementById('title');

    controls.addEventListener('start', () => {hideTitle(title);});
    controls.addEventListener('end', () => {showTitle(title);});
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