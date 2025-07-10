import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

export function loadRoomModel() {
    return new Promise((resolve, reject) => {
        loader.load(
            "/models/room_portfolio_compressed.glb", 
            (gltf) => resolve(gltf.scene),
            undefined,
            (error) => reject(error)
        );
    });
}
