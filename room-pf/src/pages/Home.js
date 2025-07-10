import * as THREE from 'three';
import { loadRoomModel } from '../components/room.js';

export class HomePage {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderer.domElement );
    }

    renderScene() {
        this.renderer.render(this.scene, this.camera);
    }

    async init() {
        const room = await loadRoomModel();
        this.scene.add(room);

        this.camera.position.z = 5;
    }

}