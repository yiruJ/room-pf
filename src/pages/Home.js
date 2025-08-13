import * as THREE from 'three';
import gsap from 'gsap';

import { loadRoomModel, configureRoom } from '../components/room.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {
    configureRaycaster,
    displayObjectLabel,
    registerCLickableObjects,
    controlListeners,
    handleRoomSize
} from '../helper.js'
import { handleHoverFeedback } from '../interactions/handleFeedback.js';
import { handleObjectClick } from '../interactions/handleClick.js';
import { handleBackButton, showBackButton } from '../components/backButton.js';
import { createSketchbookPlane } from '../components/sketchbook.js';

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
        
        configureRoom(this.scene, this.controls, room);

        // store original values for back button
        const originals = {
            cameraPos: this.camera.position.toArray(),
            target: this.controls.target.toArray(),
            roomPos: room.position.toArray(),
            roomRot: [room.rotation.x, room.rotation.y, room.rotation.z]
        }
        
        // store actions for user interactions
        const actions = {
            openUrl(url) {
                window.open(url, '_blank');
            },
            zoomTo(camera, controls, targetPos, targetLook) {
                gsap.to(camera.position, { ...targetPos, duration: 1, ease: "power2.inOut", onUpdate: () => controls.update() });
                gsap.to(controls.target,  { ...targetLook, duration: 1, ease: "power2.inOut", onUpdate: () => controls.update() });
            }
        };

        const ctx = {
            room,
            scene : this.scene, 
            camera: this.camera,
            controls: this.controls,
            hoverState: this.hoverState,
            originals,
            raycaster: this.raycaster,
            mouse: this.mouse,
            configureRaycaster,
            displayObjectLabel,
            handleBackButton,
            createSketchbookPlane,
            showBackButton,
            actions
        }

        const interactables = registerCLickableObjects(room);

        handleHoverFeedback(ctx, interactables, actions);
        handleObjectClick(ctx, interactables, actions);

        const animate = () => {
            requestAnimationFrame(animate);
            this.controls.update();
            this.renderScene();
        };

        animate();
    }
}