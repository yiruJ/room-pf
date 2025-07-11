import * as THREE from 'three';
import { loadRoomModel } from '../components/room.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

export class HomePage {
    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#f6f1eb');  

        this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.controls = new OrbitControls( this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.zoom = 0.2;

        document.body.appendChild( this.renderer.domElement );
    }

    renderScene() {
        this.renderer.render(this.scene, this.camera);
    }

    async init() {
        const room = await loadRoomModel();
        this.scene.add(room);
        
        const color = 0xFFFFFF
        const intensity = 3;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        this.scene.add(light);

        this.camera.position.set(0, 2, 65);

        room.rotation.set(0.3, 0.8, 0);
        room.position.y = -5
        room.position.x = 0;

        // rotation limits
        this.controls.maxPolarAngle = Math.PI / 1.75;
        this.controls.minPolarAngle = Math.PI / 2;

        this.controls.minAzimuthAngle = - Math.PI / 6;
        this.controls.maxAzimuthAngle = Math.PI / 6;

        // preserve the original update settings into originalUpdate
        const originalUpdate = this.controls.update.bind(this.controls);
        
        // Distance to limit edges
        window.addEventListener('mousemove', (event) => {
            mouseX = event.clientX;
        })

        const animate = () => {
            requestAnimationFrame(animate);
            this.controls.update();
            this.renderScene();
        };

        animate();
    }

}