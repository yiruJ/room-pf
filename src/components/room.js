import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { TextureLoader } from 'three';
import { MeshBasicMaterial } from 'three';
import * as THREE from 'three';

const textureLoader = new TextureLoader();

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

export function loadRoomModel() {
    const textures = {
        textureOne: textureLoader.load('/textures/FirstTextureSet.webp'),
        textureTwo: textureLoader.load('/textures/SecondTextureSet.webp'),
        textureThree: textureLoader.load('/textures/ThirdTextureSet.webp'),
        textureFour: textureLoader.load('/textures/FourthTextureSet.webp'),
        textureFive: textureLoader.load('/textures/roomCapsTexture.webp')
    }

    return new Promise((resolve, reject) => {
        loader.load(
            "/models/room_fixed_compressed.glb", 
            (gltf) => {
                const model = gltf.scene;

                Object.values(textures).forEach((texture) => {
                    texture.flipY = false;
                });

                model.traverse((child) => {
                    if (child.isMesh) {
                        if (child.name.toLowerCase().includes("first")) {
                            child.material = new MeshBasicMaterial({ map: textures.textureOne});
                        } else if (child.name.toLowerCase().includes("second")) {
                            child.material = new MeshBasicMaterial({ map: textures.textureTwo});
                        } else if (child.name.toLowerCase().includes("third")) {
                            child.material = new MeshBasicMaterial({ map: textures.textureThree});
                        } else if (child.name.toLowerCase().includes("fourth")) {
                            child.material = new MeshBasicMaterial({ map: textures.textureFour});
                        } else {
                            // room caps
                            child.material = new MeshBasicMaterial({ map: textures.textureFive});
                        }

                        // originally transparent
                        child.material.transparent = true;
                        child.material.opacity = 0;
                    }
                })
                resolve(model);
            },
            undefined,
            (error) => reject(error)
        );
    });
}

export function configureRoom(scene, controls, room) {
    // lights
    const light = new THREE.DirectionalLight(0xFFFFFF, 3);
    light.position.set(-1, 2, 4);
    scene.add(light);

    // configure room
    room.rotation.set(0.3, 0.8, 0);
    room.position.set(0, -5, 0);
    
    // rotation limits
    controls.maxPolarAngle = Math.PI / 1.75;
    controls.minPolarAngle = Math.PI / 2;
    controls.minAzimuthAngle = - Math.PI / 6;
    controls.maxAzimuthAngle = Math.PI / 6;

    // zoom limits
    controls.maxDistance = 55;
    controls.minDistance = 30;

}
