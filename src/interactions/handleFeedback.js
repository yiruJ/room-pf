import {
    getStrategy,
    getStrategyType
} from "./strategies/index";

export function handleHoverFeedback(ctx, interactables) {
    window.addEventListener('mousemove', (e) => {
        const hits = ctx.configureRaycaster(e, ctx.raycaster, ctx.mouse, ctx.camera, interactables);
        
        if (hits.length > 0) {
            const obj = hits[0].object;
            if (obj.userData.clicked) return;

            // if we move to a new object, clear old hover first
            // ctx.hoverState.hoveredObj is the prev hovered obj
            if (ctx.hoverState.hoveredObj && ctx.hoverState.hoveredObj !== obj) {
                clearHoverFeedback(ctx.hoverState);
            }

            if (ctx.hoverState.hoveredObj !== obj) {
                const type = getStrategyType(obj);
                const strat = getStrategy(type);
    
                strat.onHover(obj, ctx.hoverState);
    
                document.body.style.cursor = 'pointer';
                ctx.displayObjectLabel(obj.name);          
            }

        } else {
            if (ctx.hoverState.hoveredObj) clearHoverFeedback(ctx.hoverState);
        }
    })
}

export function clearHoverFeedback(state) {
    if (state.hoveredObj) {
        if (state.hoveredObj.name.includes('sketchbook')) {
            state.hoveredObj.scale.copy(state.originalScale);

            if (state.hoveredObj.userData.originalPosition) {
                state.hoveredObj.position.copy(state.hoveredObj.userData.originalPosition);
                delete state.hoveredObj.userData.originalPosition;
            }
        }
        state.hoveredObj.scale.copy(state.originalScale);
        state.hoveredObj = null;
        state.originalScale = null;
        document.body.style.cursor = 'default';

        const labelPopup = document.getElementById('labelPopup');
        labelPopup.classList.remove('opacity-100');

        requestAnimationFrame(() => {
            labelPopup.classList.add('opacity-0');
        })
    }
}