
import { createResizeHandler } from '../utils/canvasManager.js';
import { Palette } from '../utils/palette.js';
import { appState } from '../utils/appState.js';


/*
    Creating a new sketch:

    Integrating into website:
    1. Be sure to set <a href=...></a> in "index.html"
    2. add it to the "imports" and to the "const sketches" in main.js

    Making it unique:
    1. Give it a name

*/



// lowercase because it's a "factory function", not a class.
// These sketches setup a P5 instance mode by defining methods on p. 
// I'm not creating nstances of them, just calling them.

export function template(p, appState) {
    let name = "template"
    let resizeHandler;
    let frameCount = 0;
    let curTime = Date.now();// Get current timestamp (milliseconds since Unix epoch)
    // Compare with other timestamps
    // const pastTime = now - 5000;  // 5 seconds ago
    // const futureTime = now + 10000;  // 10 seconds from now

    // DOM elements managed by Processing
    let canvas;

    // Scale of sketch:
    let sketchWidth;
    let sketchHeight;


    // Colors:
    let palette = new Palette(p, appState);

    // icons:


    // Processing re-definitions:

    p.setup = function(){
        appState.selectedApp = name;
        // handle the window's sizing:
        resizeHandler = createResizeHandler(p)
        sketchWidth = resizeHandler.width();
        sketchHeight = resizeHandler.height();

        // Logging
        console.log("Launched the " + name + " sketch");
        console.log(name + " window inner width/height: " + window.innerWidth + ", " + window.innerHeight);
        
        // Set myself in the webpage properly
        canvas = p.createCanvas(sketchWidth, sketchHeight);
        canvas.parent('sketch-container');

        // Make the canvas focusable and focus it
        // canvas.elt = The actual HTML <canvas> DOM element (elt = "element")
        // It's like P5 gives you a nice interface, but canvas.elt is the raw HTML element you can manipulate directly.
        canvas.elt.tabIndex = 1;  // Makes it focusable
        canvas.elt.focus();        // Actually focuses it
        canvas.elt.addEventListener('click', () => { // focuses on-click
            canvas.elt.focus();
        });
        // Hide the focus ring:
        // canvas.elt.style.outline = 'none'; 

        // console.log("Object keys: ")
        // console.log(Object.keys(p)) // inspect what is reserved by "p"
        // Refocus on click

        // Colors
        p.colorMode(p.RGB);
        palette.setScheme('dark'); // currently controlled by keyboard

        
        // Look into this if rendering / low framerate struggles appear:
        // p.pixelDensity(1); 
    };

    p.draw = function() {
        p.updateFields();

        // sets the background based on theme
        palette.backgroundTheme();

        // palette.strokeRGB(255);

        // Sample, for detecting colors:
        // set palette stroke
        let strokew = 1;
        palette.strokeTheme(strokew);
        palette.fillTheme('1');
        p.circle(sketchWidth/2, sketchHeight/2, 100);

        strokew++;
        palette.strokeTheme(strokew);
        palette.fillTheme('2');
        p.circle(sketchWidth/4, sketchHeight/4, 70);

        strokew++;
        palette.strokeTheme(strokew);
        palette.fillTheme('3');
        p.circle(3*sketchWidth/4, sketchHeight/4, 70);

        strokew++;
        palette.strokeTheme(strokew);
        palette.fillTheme('4');
        p.circle(sketchWidth/4, 3*sketchHeight/4, 70);

        strokew++;
        palette.strokeTheme(strokew);
        palette.fillTheme('5');
        p.circle(3*sketchWidth/4, 3*sketchHeight/4, 70);

        strokew++;
        palette.strokeTheme(strokew);
        palette.fillTheme('6');
        p.circle(5*sketchWidth/6, sketchHeight/2, 50);


        // check that rgba alpha
        palette.strokeTheme(1);
        for (let x = 30 ; x < this.width ; x+= 15){
            let y = 100 + x / 2;
            let side = 70;
            let colorNum = Math.floor((frameCount / 100) % 6 + 1);
            colorNum = colorNum.toString();

            palette.fillTheme(colorNum, 30);
            p.rect(x, y, side, side);
        }

        palette.stroke(0);
        // Debug focus
        if (isFocused()) {
            p.fill(0, 255, 0);
            p.text('FOCUSED', 10, 20);
        } else {
            p.fill(255, 0, 0);
            p.text('NOT FOCUSED - Click canvas!', 10, 20);
        }

        frameCount++;
    };

    // ensures that all the sketch's fields are up-to-date with the environment
    p.updateFields = function(){
        sketchWidth = resizeHandler.width();
        sketchHeight = resizeHandler.height();
        curTime = Date.now();
    };
    
    // Clean up when sketch is removed (important!)
    p.cleanup = function() {
        resizeHandler.cleanup();
    };


    p.keyReleased = function() {
        console.log("Key released: " + p.key + ", keyCode: " + p.keyCode);
        if (p.key === 'l'){
            /*console.log("vals:\n"
                + "w, h: " + sketchWidth + ", " + sketchHeight + "\n"
                + "width, height: " + p.width + ", " + p.height + "\n"
                + "windowWidth, windowHeight: " + p.windowWidth + ", " + p.windowHeight + "\n"
                + "displayWidth, displayHeight: " + p.displayWidth + ", " + p.displayHeight
            );*/
            console.log("Selected sketch:\n" + appState.selectedApp);
            console.log("current framerate: " + p.frameRate());
        }

        // Apply color schemes:
        if (p.key === '1') palette.setScheme('dark');
        if (p.key === '2') palette.setScheme('light');
        if (p.key === '3') palette.setScheme('sunset');
    };


    // helper functions:
    function isFocused(){
        return document.activeElement === canvas.elt;
    }
}