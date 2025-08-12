import contact from "./contactStrategy";
import project from './projectStrategy.js';
import about from './aboutStrategy.js';
import def from './defaultStrategy.js';

export const strategies = { contact, project, about, default: def};

export function getStrategy(type) {
    return strategies[type] ?? strategies.default;
}

export function getStrategyType(obj) {
    if (obj.name.includes('sketchbook')) {
        return "about";
    } else if (obj.name.includes('Logo')) {
        return "contact";
    } else {
        return "project";
    }
}