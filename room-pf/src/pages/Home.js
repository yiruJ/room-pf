import * as THREE from 'three';
import { loadRoomModel } from '../components/room.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

export class HomePage {
    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#cddaf0');  

        this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.controls = new OrbitControls( this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.zoom = 0.2;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

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
        room.castShadow = true;

        // rotation limits
        this.controls.maxPolarAngle = Math.PI / 1.75;
        this.controls.minPolarAngle = Math.PI / 2;
        this.controls.minAzimuthAngle = - Math.PI / 6;
        this.controls.maxAzimuthAngle = Math.PI / 6;

        // zoom limits
        this.controls.maxDistance = 55;
        this.controls.minDistance = 30;

        const clickableMeshes = [];
        room.traverse((child) => {
            if (child.isMesh) {
                if (child.name.includes("instagramLogo")) {
                    child.userData.url = 'https://www.instagram.com/yiru_jang/';
                    clickableMeshes.push(child);
                } else if (child.name.includes("githubLogo")) {
                    child.userData.url = 'https://github.com/yiruJ';
                    clickableMeshes.push(child);
                } else if (child.name.includes("linkedInLogo")) {
                    child.userData.url = 'https://www.linkedin.com/in/yiru-jang-47995a1a0/';
                    clickableMeshes.push(child);
                }
            }
        }); 

        window.addEventListener('click', (event) => {
            // Convert screen coords to NDC
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera);

            const intersects = this.raycaster.intersectObjects(clickableMeshes, true);

            if (intersects.length > 0) {
                const clicked = intersects[0].object;
                const url = clicked.userData.url;
                if (url) {
                    window.open(url, '_blank');
                }
            }
        });


        const animate = () => {
            requestAnimationFrame(animate);
            this.controls.update();
            this.renderScene();
        };

        animate();
    }

}