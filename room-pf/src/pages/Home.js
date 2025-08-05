import * as THREE from 'three';
import { loadRoomModel } from '../components/room.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

import {
    handleHoverFeedback,
    handleObjectClick,
    registerCLickableObjects,
    handleRoomSize,
    controlListeners
} from '../helper.js'

export class HomePage {
    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#cddaf0');  
        
        this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.set(0, 2, 65);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.domElement.style.zIndex = '0'; // 👈 Add this line
        
        this.controls = new OrbitControls( this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.zoom = 0.2;
        
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.hoverState = {
            hoveredObj : null,
            originalScale : null
        }
        
        document.body.appendChild( this.renderer.domElement );
    }

    renderScene() {
        this.renderer.render(this.scene, this.camera);
    }

    async init() {
        // load model
        const room = await loadRoomModel();
        this.scene.add(room);

        controlListeners(this.controls);

        const box = new THREE.Box3().setFromObject(room);
        const center = new THREE.Vector3();
        box.getCenter(center);
        room.position.sub(center);

        handleRoomSize(this.renderer, room, this.camera);
        
        // lights
        const light = new THREE.DirectionalLight(0xFFFFFF, 3);
        light.position.set(-1, 2, 4);
        this.scene.add(light);

        // configure room
        room.rotation.set(0.3, 0.8, 0);
        room.position.set(0, -5, 0);
        
        // rotation limits
        this.controls.maxPolarAngle = Math.PI / 1.75;
        this.controls.minPolarAngle = Math.PI / 2;
        this.controls.minAzimuthAngle = - Math.PI / 6;
        this.controls.maxAzimuthAngle = Math.PI / 6;

        // zoom limits
        this.controls.maxDistance = 55;
        this.controls.minDistance = 30;
        
        // fetch clickable objects
        const clickableObjects = registerCLickableObjects(room);
        handleHoverFeedback(this.raycaster, this.mouse, this.camera, clickableObjects, this.hoverState);
        
        // contact links
        const contactLinks = clickableObjects.filter((object) => object.type === "contact");
        handleObjectClick(this.raycaster, this.mouse, this.camera, this.controls, contactLinks, this.scene);

        // monitor screens / projects
        const screen = clickableObjects.filter((object) => object.type === "project");
        handleObjectClick(this.raycaster, this.mouse, this.camera, this.controls, screen, room, this.scene);

        // sketchbook
        const sketchbook = clickableObjects.filter((object) => object.type === "about");
        handleObjectClick(this.raycaster, this.mouse, this.camera, this.controls, sketchbook, room, this.scene);

        const animate = () => {
            requestAnimationFrame(animate);
            this.controls.update();
            this.renderScene();
        };

        animate();
    }

}