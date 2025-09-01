import {clearHoverFeedback} from "../handleFeedback";
import { displayProjects } from "../../components/monitor";

export default {
    onHover(obj, state) {
        state.originalScale = obj.scale.clone();
        state.hoveredObj = obj;
        obj.scale.set(1.15, 1.15, 1.15);
    },
    onClick(ctx, obj) {
        ctx.controls.enableRotate = false;
        clearHoverFeedback(ctx.hoverState, obj);
        obj.userData.clicked = true;
        ctx.actions.zoomTo(ctx.camera, ctx.controls, {x:-0.6,y:0,z:8.9}, {x:0,y:0,z:0});
        displayProjects();
        ctx.handleBackButton('screen', ctx, obj);
    }
}