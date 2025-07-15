function configureRaycaster(event, raycaster, mouse, camera, meshes) {
    // Convert mouse cord from pixel --> NDC for raycaster
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    const meshObjects = meshes.map(entry => entry.object); // 🔧 Extract only the objects

    raycaster.setFromCamera(mouse, camera);
    return raycaster.intersectObjects(meshObjects, true);
}

export function handleObjectClick(raycaster, mouse, camera, controls, meshes) {
    window.addEventListener('click', (event) => {
        const intersects = configureRaycaster(event, raycaster, mouse, camera, meshes);
        
        // check if any object was hit
        if (intersects.length > 0) {

            // only execute function of nearest object
            const clickedObj = intersects[0].object;
            // console.log(clickedObj);
            // if the object is a contact link
            if (clickedObj.userData.url) {
                const url = clickedObj.userData.url;
                window.open(url, '_blank');
            } else if (clickedObj.name.includes("screen")) {
                // controls.minDistance = 0.1;
                // controls.enableDamping = false;
                camera.position.set(99, -2, 1);
                // camera.lookAt(clickedObj.position);
                controls.update();

                
            }
        }
    });
}

export function handleHoverFeedback(raycaster, mouse, camera, meshes, state) {
    window.addEventListener('mousemove', (event) => {
        const intersects = configureRaycaster(event, raycaster, mouse, camera, meshes);
        
        if (intersects.length > 0) {
            const hovered = intersects[0].object;

            if (hovered !== state.hoveredObj) {
                if (state.hoveredObj) {
                    state.hoveredObj.scale.copy(state.originalScale);
                }

                state.originalScale = hovered.scale.clone();
                state.hoveredObj = hovered;
                hovered.scale.set(1.15, 1.15, 1.15);
                document.body.style.cursor = 'pointer';
            }
        } else {
            if (state.hoveredObj) {
                state.hoveredObj.scale.copy(state.originalScale);
                state.hoveredObj = null;
                state.originalScale = null;
                document.body.style.cursor = 'default';
            }
        }
    });
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