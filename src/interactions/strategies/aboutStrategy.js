import {clearHoverFeedback} from "../handleFeedback";
import * as THREE from 'three';

export default {
    onHover(obj, state) {
        state.originalScale = obj.scale.clone();
        state.hoveredObj = obj;

        if (!obj.userData.originalPosition) {
            obj.userData.originalPosition = obj.position.clone();
        }
        obj.scale.set(1.2, 1.2, 1.2);

        // Shift forward slightly along local Z axis to prevent back face from showing
        const forward = new THREE.Vector3(-0.6, -0.5, -0.6);
        obj.localToWorld(forward); obj.worldToLocal(forward); obj.position.add(forward);
    },
    onClick(ctx, obj) {
        ctx.controls.enableRotate = false;
        clearHoverFeedback(ctx.hoverState, obj);
        obj.userData.clicked = true;
        ctx.actions.zoomTo(ctx.camera, ctx.controls, {x:2.75, y: 1.4, z:3.42}, {x:3.7, y:1.4, z: 0.1});
        const {sketchbookMesh, sketchbookGeometry, sketchbookTexture, sketchbookMaterial} = ctx.createSketchbookPlane(ctx.scene);
        const sketchbookProperties = {
            sketchbookMesh, 
            sketchbookGeometry, 
            sketchbookTexture, 
            sketchbookMaterial,    
        };
        ctx.handleBackButton('sketchbook', ctx, obj, sketchbookProperties);   
    }
}