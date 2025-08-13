import * as THREE from 'three';
import gsap from 'gsap';

export function createSketchbookPlane(scene) {
    // Create plane for 'About Me' paragraph
    const sketchbookGeometry = new THREE.PlaneGeometry(2.7, 1.7);
    const canvas = document.createElement('canvas');
    canvas.id = 'sketchbook';
    canvas.width = 2000;
    canvas.height = 1000;

    const ctx = canvas.getContext('2d');

    // Draw label text
    ctx.fillStyle = '#4B3F33';
    ctx.font = '120px Pacifico';

    const lines = [
        { text: 'About Me', font: '120px Pacifico', x: 800, y: 200, opacity: 0},
        { text: 'Hi, I am Yiru, UNSW Computer Science ', font: '100px Pacifico', x: 200, y: 350, opacity: 0},
        { text: 'student passionate about design, coding ', font: '100px Pacifico', x: 200, y: 500, opacity: 0},
        { text: 'and AR - eager to apply creative and ', font: '100px Pacifico', x: 200, y: 650, opacity: 0},
        { text: 'technical skills in real-world projects:)', font: '100px Pacifico', x: 200, y: 800, opacity: 0}
    ]

    // Create texture and force update
    const sketchbookTexture = new THREE.CanvasTexture(canvas);
    sketchbookTexture.needsUpdate = true;

    const sketchbookMaterial = new THREE.MeshBasicMaterial({
        map: sketchbookTexture,
        transparent: true
    });

    const sketchbookMesh = new THREE.Mesh(sketchbookGeometry, sketchbookMaterial);
    sketchbookMesh.position.set(4.2, 1.8, -2.3);
    sketchbookMesh.rotation.set(-Math.PI / 8.5, -Math.PI / 4.85, -Math.PI / 7);
    scene.add(sketchbookMesh);

    // asynchronously change the opacity of the line over time
    lines.forEach((line, i) => {
        gsap.to(line, {
            opacity: 1, 
            duration: 1, 
            delay: i * 0.8
        });
    });

    function draw() {
        // clear canvas before drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const line of lines) {
            ctx.font = line.font;
            ctx.globalAlpha = line.opacity;
            ctx.fillText(line.text, line.x, line.y);
        }

        ctx.globalAlpha = 1;

        sketchbookTexture.needsUpdate = true;
        
        requestAnimationFrame(draw);
    }

    draw();

    return {
        sketchbookMesh, 
        sketchbookGeometry, 
        sketchbookTexture,
        sketchbookMaterial,
    }
}