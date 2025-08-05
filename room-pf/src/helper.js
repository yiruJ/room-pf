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

export function handleObjectClick(raycaster, mouse, camera, controls, meshes, room, scene) {
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
                const projectsPopupShadow = document.getElementById('project-popup-shadow');

                projectsPopupShadow.classList.remove('hidden');
                projectsPopupShadow.classList.add('translate-y-full', 'opacity-0');
                
                projectsPopup.classList.remove('hidden');
                projectsPopup.classList.add('translate-y-full', 'opacity-0');
                
                setTimeout(() => {
                    requestAnimationFrame(() => {
                        projectsPopupShadow.style.transform = 'translateY(4%)';
                        projectsPopupShadow.classList.add('translate-y-0', 'opacity-100');

                        projectsPopup.classList.remove('translate-y-full', 'opacity-0');
                        projectsPopup.classList.add('translate-y-0', 'opacity-100');
                    })
                }, 300)
            } else if (clickedObj.name.includes('sketchbook')) {
                controls.minDistance = 0;
                if (!clickedObj.userData.clicked) {
                    gsap.to(camera.position, {
                        x: 2.75,
                        y: 1.4,
                        z: 3.42,
                        duration: 1,
                        ease: "power2.inOut",
                        onUpdate: () => controls.update() // keeps view in sync
                    });

                    gsap.to(controls.target, {
                        x: 3.7,
                        y: 1.4,
                        z: 0.1,
                        duration: 1,
                        ease: "power2.inOut",
                        onUpdate: () => controls.update()
                    });
                }

                clickedObj.userData.clicked = true;

                // Create plane for 'About Me' paragraph
                const sketchbookPlane = new THREE.PlaneGeometry(2.7, 1.7);
                const canvas = document.createElement('canvas');
                canvas.width = 2000;
                canvas.height = 1000;
        
                const ctx = canvas.getContext('2d');
        
                // Draw label text
                ctx.fillStyle = '#4B3F33';
                ctx.font = '120px Pacifico';

                const lines = [
                    { text: 'About Me', font: '120px Pacifico', x: 800, y: 200, opacity: 0},
                    { text: 'Hi, I am Yiru, UNSW Computer Science ', font: '100px Pacifico', x: 200, y: 350, opacity: 0},
                    { text: 'student passionate about design, coding ', font: '100px Pacifico', x: 200, y: 500, opacity: 0},
                    { text: 'and AR - eager to apply creative and ', font: '100px Pacifico', x: 200, y: 650, opacity: 0},
                    { text: 'technical skills in real-world projects:)', font: '100px Pacifico', x: 200, y: 800, opacity: 0}
                ]
        
                // Create texture and force update
                const sketchbookTexture = new THREE.CanvasTexture(canvas);
                sketchbookTexture.needsUpdate = true;
        
                const sketchbookMaterial = new THREE.MeshBasicMaterial({
                    map: sketchbookTexture,
                    transparent: true
                });
        
                const sketchbookMesh = new THREE.Mesh(sketchbookPlane, sketchbookMaterial);
                sketchbookMesh.position.set(4.2, 1.8, -2.3);
                sketchbookMesh.rotation.set(-Math.PI / 8.5, -Math.PI / 4.85, -Math.PI / 7);
                scene.add(sketchbookMesh);

                // asynchronously change the opacity of the line over time
                lines.forEach((line, i) => {
                    gsap.to(line, {
                        opacity: 1, 
                        duration: 1, 
                        delay: i * 0.8
                    });
                });

                function draw() {
                    // clear canvas before drawing
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    for (const line of lines) {
                        ctx.font = line.font;
                        ctx.globalAlpha = line.opacity;
                        ctx.fillText(line.text, line.x, line.y);
                    }

                    ctx.globalAlpha = 1;

                    sketchbookTexture.needsUpdate = true;
                    
                    requestAnimationFrame(draw);
                }

                draw();
                
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