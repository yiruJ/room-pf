import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { TextureLoader } from 'three';
import { MeshBasicMaterial } from 'three';

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
                    }
                })

                resolve(model);
            },
            undefined,
            (error) => reject(error)
        );
    });
}
