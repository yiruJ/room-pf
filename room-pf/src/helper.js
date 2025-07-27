import gsap from 'gsap';
import * as THREE from 'three';

function configureRaycaster(event, raycaster, mouse, camera, meshes) {
    // Convert mouse cord from pixel --> NDC for raycaster
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    const meshObjects = meshes.map(entry => entry.object); // 🔧 Extract only the objects

    raycaster.setFromCamera(mouse, camera);
    return raycaster.intersectObjects(meshObjects, true);
}

export function handleObjectClick(raycaster, mouse, camera, controls, meshes, room) {
    window.addEventListener('click', (event) => {
        const intersects = configureRaycaster(event, raycaster, mouse, camera, meshes);
        
        // check if any object was hit
        if (intersects.length > 0) {

            // only execute function of nearest object
            const clickedObj = intersects[0].object;
            // if the object is a contact link
            if (clickedObj.userData.url) {
                const url = clickedObj.userData.url;
                window.open(url, '_blank');
            } else if (clickedObj.name.includes("screen")) {
                if (!clickedObj.userData.clicked) {
                    const moveDistance = window.innerWidth < 768 ? 5 : 18;
                    const offset = new THREE.Vector3(-1, 0, -0.5).normalize().multiplyScalar(moveDistance);

                    gsap.to(room.position, {
                        x: room.position.x + offset.x,
                        y: room.position.y + offset.y,
                        z: room.position.z + offset.z,
                        duration: 1,
                        ease: "power2.inOut"
                        });

                    gsap.to(room.rotation, {
                        y: room.rotation.y + Math.PI / 6,
                        duration: 1,
                        ease: "power2.inOut"
                    });

                    controls.enableRotate = false;
                }
                
                clickedObj.userData.clicked = true;

                // open pop-up
                const projectsPopup = document.getElementById('project-popup');
                projectsPopup.classList.remove('hidden');
                projectsPopup.classList.add('translate-y-full', 'opacity-0');
                
                setTimeout(() => {
                    requestAnimationFrame(() => {
                        projectsPopup.classList.remove('translate-y-full', 'opacity-0');
                        projectsPopup.classList.add('translate-y-0', 'opacity-100');
                    })
                }, 300)
            }
        }
    });
}

export function handleHoverFeedback(raycaster, mouse, camera, meshes, state) {
    window.addEventListener('mousemove', (event) => {
        const intersects = configureRaycaster(event, raycaster, mouse, camera, meshes);
        
        if (intersects.length > 0) {
            const hovered = intersects[0].object;

            if (hovered.userData.clicked) {
                return;
            }

            if (hovered !== state.hoveredObj) {
                if (state.hoveredObj) {
                    state.hoveredObj.scale.copy(state.originalScale);
                }

                state.originalScale = hovered.scale.clone();
                state.hoveredObj = hovered;
                if (hovered.name.includes("sketchbook")) {
                    if (!hovered.userData.originalPosition) {
                        hovered.userData.originalPosition = hovered.position.clone();
                    }

                    hovered.scale.set(1.2, 1.2, 1.2);

                    // Shift forward slightly along local Z axis to prevent back face from showing
                    const forward = new THREE.Vector3(-0.6, -0.5, -0.6); // adjust the amount as needed
                    hovered.localToWorld(forward);
                    hovered.worldToLocal(forward);
                    hovered.position.add(forward);

                } else {
                    hovered.scale.set(1.15, 1.15, 1.15);
                }
                document.body.style.cursor = 'pointer';
                displayObjectLabel(hovered.name);
            }
        } else {
            if (state.hoveredObj) {
                if (state.hoveredObj.name.includes('sketchbook')) {
                    state.hoveredObj.scale.copy(state.originalScale);

                    if (state.hoveredObj.userData.originalPosition) {
                        state.hoveredObj.position.copy(state.hoveredObj.userData.originalPosition);
                        delete state.hoveredObj.userData.originalPosition;
                    }
                }
                state.hoveredObj.scale.copy(state.originalScale);
                state.hoveredObj = null;
                state.originalScale = null;
                document.body.style.cursor = 'default';

                const labelPopup = document.getElementById('labelPopup');
                labelPopup.classList.remove('opacity-100');

                requestAnimationFrame(() => {
                    labelPopup.classList.add('opacity-0');
                })

            }
        }
    });
}

function displayObjectLabel(name) {
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

export function controlListeners(controls) {
    const title = document.getElementById('title');

    controls.addEventListener('start', () => {
        requestAnimationFrame(() => {
            title.classList.remove('opacity-100');
            title.classList.add('opacity-0');
        })
    });

    // controls.addEventListener('end', () => {
    //     requestAnimationFrame(() => {
    //         title.classList.remove('opacity-0');
    //         title.classList.add('opacity-100');
    //     })
    // });
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