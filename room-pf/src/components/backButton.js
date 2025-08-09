import gsap from 'gsap';
import {
    hideProjects
} from "./monitor";

// section can be either 'sketchbook' or 'screens'
export function handleBackButton(section, camera, controls, room, clickedObj, originals, sketchbookProperties) {
    const onUpdate = () => controls?.update?.();

    const backButton = document.getElementById('back-button');

    backButton.addEventListener('click', () => {
        controls.enableRotate = true;
        
        if (section === "sketchbook") {
            clearSketchbook(sketchbookProperties);
            
            // reset targets
            gsap.to(controls.target, {
                x: originals.target[0],
                y: originals.target[1],
                z: originals.target[2],
                duration: 1.5,
                ease: 'power2.out',
                onUpdate
            });

            handleBackAnimation(camera, room, originals, onUpdate);
        } else {
            hideProjects();
            handleBackAnimation(camera, room, originals, onUpdate);
        }

        requestAnimationFrame(() => {
            backButton.classList.remove("opacity-100");
            backButton.classList.add("opacity-0");
        });
        
        setTimeout(() => {
            clickedObj.userData.clicked = false;
        }, 300);
    })
}

export function showBackButton() {
    setTimeout(() => {
        const backButton = document.getElementById('back-button');
        requestAnimationFrame(() => {
            backButton.classList.remove('opacity-0');
            backButton.classList.add('opacity-100');
        })
    }, 800)
}

function handleBackAnimation(camera, room, originals) {
    const { cameraPos, target, roomPos, roomRot } = originals;

    gsap.to(camera.position, {
        x: cameraPos[0],
        y: cameraPos[1],
        z: cameraPos[2],
        duration: 1.5, // seconds
        ease: "power2.out"
    });

    gsap.to(room.position, {
        x: roomPos[0],
        y: roomPos[1],
        z: roomPos[2],
        duration: 1.5,
        ease: "power2.out"
    });

    gsap.to(room.rotation, {
        x: roomRot[0],
        y: roomRot[1],
        z: roomRot[2],
        duration: 1.5,
        ease: "power2.out"
    });
}

function clearSketchbook(sketchbookProperties) {
    const {sketchbookMesh, sketchbookGeometry, sketchbookTexture, sketchbookMaterial, scene } = sketchbookProperties;

    // remove sketchbook texture
    scene.remove(sketchbookMesh);
    sketchbookGeometry.dispose();
    sketchbookMaterial.dispose();
    sketchbookTexture.dispose();
}