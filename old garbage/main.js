
/*
// Sample import ideas:
import { wavesSketch } from './sketches/wavesSketch.js';
import { particlesSketch } from './sketches/particlesSketch.js';
import { fractalsSketch } from './sketches/fractalsSketch.js';
*/

import {sketch} from "./sketches/sketch.js";
import {home} from "./sketches/home.js";
import {soundLens} from "./sketches/soundLensSketch.js"
import { template } from "./sketches/template.js";
import { appState } from "./utils/appState.js";
import { entranceScreen } from "./sketches/entranceScreen.js";
import { entrance2 } from "./sketches/entrance2.js";
import { entrance3 } from "./sketches/entrance3.js";
import { stylePenSketch } from "./sketches/stylePenSketch.js";
import { entranceInteractive } from "./sketches/entranceInteractive.js";
import { animationsDec2 } from "./sketches/animationsDec2.js";




// to add a new sketch (accessible via #hash),
// 1. import it at the top
// 2. add it to 'const sketches', 




let currentP5Instance = null;

// Sketch registry
const sketches = {
    'home': home, // Could be a landing animation
    'sketch': sketch,
    'soundLens': soundLens,
    'template': template,
    'entranceScreen': entranceScreen,
    'entrance2': entrance2,
    'entrance3': entrance3,
    'stylePenTest': stylePenSketch,
    'entranceInteractive': entranceInteractive,
    'animationsDec2': animationsDec2
    
/*
    'waves': wavesSketch,
    'particles': particlesSketch,
    'fractals': fractalsSketch,*/
};

// const rootSketch = 'entrance3';
const rootSketch = 'animationsDec2'


function loadSketch(sketchName) {

    // Clean up previous sketch
    if (currentP5Instance) {
        // Call custom cleanup if it exists
        if (typeof currentP5Instance.cleanup === 'function') {
            currentP5Instance.cleanup();
        }
        currentP5Instance.remove();
        currentP5Instance = null;

        appState.selectedApp = 'none';
    }
    
    // Get the sketch function
    const sketchFunction = sketches[sketchName];
    console.log('Sketch function found:', !!sketchFunction);
    
    if (sketchFunction) {
        // Pass appState to the sketch so it can access shared data
        currentP5Instance = new p5((p) => sketchFunction(p, appState), 'sketch-container');
    } else {
        // Fallback for unknown sketches
        console.log('Sketch not found:', sketchName);
        loadSketch(rootSketch);
    }
}


// automatically called every time I run:
        // window.location.hash = 'stylePenTest';
// in any sketch
// Handle URL hash changes
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1) || rootSketch;
    loadSketch(hash);
});

// Load initial sketch on page load
window.addEventListener('load', () => {
    const hash = window.location.hash.slice(1) || rootSketch;
    loadSketch(hash);
});