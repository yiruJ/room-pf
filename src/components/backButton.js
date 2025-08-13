import gsap from 'gsap';
import {
    hideProjects
} from "./monitor";

import { showTitle } from "../helper";

// section can be either 'sketchbook' or 'screens'
export function handleBackButton(section, ctx, clickedObj, sketchbookProperties) {
    const onUpdate = () => ctx.controls?.update?.();

    const backButton = document.getElementById('back-button');

    backButton.addEventListener('click', () => {
        ctx.controls.enableRotate = true;
        
        if (section === "sketchbook") {
            clearSketchbook(sketchbookProperties, ctx.scene);
            
            // reset targets
            gsap.to(ctx.controls.target, {
                x: ctx.originals.target[0],
                y: ctx.originals.target[1],
                z: ctx.originals.target[2],
                duration: 1.5,
                ease: 'power2.out',
                onUpdate
            });

            handleBackAnimation(ctx, onUpdate);
        } else {
            hideProjects();
            handleBackAnimation(ctx, onUpdate);
        }

        requestAnimationFrame(() => {
            backButton.classList.remove("opacity-100");
            backButton.classList.add("opacity-0");
        });
        
        ctx.controls.minDistance = 30;
        
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

function handleBackAnimation(ctx, onUpdate) {
    const { cameraPos, target, roomPos, roomRot } = ctx.originals;

    gsap.to(ctx.camera.position, {
        x: cameraPos[0],
        y: cameraPos[1],
        z: cameraPos[2],
        duration: 1.5, // seconds
        ease: "power2.out",
        onUpdate
    });

    gsap.to(ctx.room.position, {
        x: roomPos[0],
        y: roomPos[1],
        z: roomPos[2],
        duration: 1.5,
        ease: "power2.out",
        onUpdate
    });

    gsap.to(ctx.room.rotation, {
        x: roomRot[0],
        y: roomRot[1],
        z: roomRot[2],
        duration: 1.5,
        ease: "power2.out",
        onUpdate
    });
}

function clearSketchbook(sketchbookProperties, scene) {
    const {sketchbookMesh, sketchbookGeometry, sketchbookTexture, sketchbookMaterial } = sketchbookProperties;

    // remove sketchbook texture
    scene.remove(sketchbookMesh);
    sketchbookGeometry.dispose();
    sketchbookMaterial.dispose();
    sketchbookTexture.dispose();
}