import {clearHoverFeedback} from "../handleFeedback";

export default {
    onHover(obj, state) {
        state.originalScale = obj.scale.clone();
        state.hoveredObj = obj;
        obj.scale.set(1.15, 1.15, 1.15);
    },
    onClick(ctx, obj) {
        ctx.actions.openUrl(obj.userData.url);
    }
}