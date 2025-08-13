import {
    getStrategy,
    getStrategyType
} from "./strategies/index";

export function handleObjectClick(ctx, interactables) {
    window.addEventListener('pointerdown', (e) => {
        const hits = ctx.configureRaycaster(e, ctx.raycaster, ctx.mouse, ctx.camera, interactables);
        if (hits.length === 0) return;

        const obj = hits[0].object;
        if (obj.userData.clicked == true) return;

        ctx.controls.minDistance = 0;
        ctx.controls.enableRotate = false;
        
        const type = getStrategyType(obj);
        const strat = getStrategy(type);
        
        if (type !== "contact") {
            obj.userData.clicked = true;
            ctx.showBackButton();
        }

        strat.onClick(ctx, obj);
    })
}

function hideTitle() {

}