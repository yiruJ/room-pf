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
        this.hoveredObj = null;
        this.originalScale = null;
        
        document.body.appendChild( this.renderer.domElement );
    }
    
    configureRaycaster(event, meshes) {
        // Convert mouse cord from pixel --> NDC for raycaster
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    
        this.raycaster.setFromCamera(this.mouse, this.camera);
    
        return this.raycaster.intersectObjects(meshes, true);
    }

    renderScene() {
        this.renderer.render(this.scene, this.camera);
    }

    handleHoverFeedback(meshes) {
        window.addEventListener('mousemove', (event) => {
            const intersects = this.configureRaycaster(event, meshes);
            
            if (intersects.length > 0) {
                const hovered = intersects[0].object;

                if (hovered !== this.hoveredObj) {
                    if (this.hoveredObj) {
                        this.hoveredObj.scale.copy(this.originalScale);
                    }
                    
                    this.originalScale = hovered.scale.clone();
                    this.hoveredObj = hovered;
                    hovered.scale.set(1.2, 1.2, 1.2); // slightly enlarge
                    document.body.style.cursor = 'pointer';
                }
            } else {
                if (this.hoveredObj) {
                    this.hoveredObj.scale.copy(this.originalScale);
                    this.hoveredObj = null;
                    this.originalScale = null;
                    document.body.style.cursor = 'default';
                }
            }
        })
    }

    handleObjectClick(meshes) {
        window.addEventListener('click', (event) => {
            const intersects = this.configureRaycaster(event, meshes);
            // check if any object was hit
            if (intersects.length > 0) {
                // only execute function of nearest object
                const clickedObj = intersects[0].object;

                // if the object is a contact link
                if (meshes.includes(clickedObj)) {
                    const url = clickedObj.userData.url;
                    window.open(url, '_blank');
                }
            }
        });
    }

    // configure links into the contact objects
    registerContactLinks(room) {
        const contactLinks = [];
        room.traverse((child) => {
            console.log(child.name);
            if (child.isMesh) {
                if (child.name.includes("instagramLogo")) {
                    child.userData.url = 'https://www.instagram.com/yiru_jang/';
                    contactLinks.push(child);
                } else if (child.name.includes("githubLogo")) {
                    child.userData.url = 'https://github.com/yiruJ';
                    contactLinks.push(child);
                } else if (child.name.includes("linkedInLogo")) {
                    child.userData.url = 'https://www.linkedin.com/in/yiru-jang-47995a1a0';
                    contactLinks.push(child);
                }
            }
        });

        return contactLinks;
    }

    async init() {
        // load model
        const room = await loadRoomModel();
        this.scene.add(room);
        
        // lights
        const light = new THREE.DirectionalLight(0xFFFFFF, 3);
        light.position.set(-1, 2, 4);
        this.scene.add(light);

        this.camera.position.set(0, 2, 65);

        // configure room
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
        
        // user interactions
        const contactLinks = this.registerContactLinks(room);

        this.handleObjectClick(contactLinks);
        this.handleHoverFeedback(contactLinks);

        const animate = () => {
            requestAnimationFrame(animate);
            this.controls.update();
            this.renderScene();
        };

        animate();
    }

}