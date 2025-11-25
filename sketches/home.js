

import { createResizeHandler } from '../utils/resizeHandler.js';

/* 

    p keys:
    width
    height
    windowWidth
    windowHeight
    displayWidth
    displayHeight

*/

/*
    old garbage when i was figuring out how to do shit
*/

export function home(p, appState) {
    let resizeHandler;
    let frameCount = 0;
    let name = "Home"

    let canvas;

    let bgcolor = [255, 100, 255]

    let w = 700;
    let h = 500;

    let widthPadding = 200;
    let heightPadding = 100

    p.setup = function(){
        // handle the window's sizing:
        resizeHandler = createResizeHandler(p, widthPadding, heightPadding)
        w = window.innerWidth - widthPadding;
        h = window.innerHeight - heightPadding;

        // Colors
        p.colorMode(p.RGB);

        // Logging
        console.log("Launched the " + name + " sketch");
        console.log(name + " window inner width/height: " + window.innerWidth + ", " + window.innerHeight);
        
        // Set myself in the webpage properly
        canvas = p.createCanvas(w, h);
        canvas.parent('sketch-container');


        // Make the canvas focusable and focus it
        canvas.elt.tabIndex = 1;  // Makes it focusable
        canvas.elt.focus();        // Actually focuses it
        canvas.elt.addEventListener('click', () => { // focuses on-click
            canvas.elt.focus();
        });
        /*
        canvas.elt = The actual HTML <canvas> DOM element (elt = "element")
        It's like P5 gives you a nice interface, but canvas.elt is the raw HTML element you can manipulate directly.
        */

        // console.log("Object keys: ")
        // console.log(Object.keys(p)) // inspect what is reserved by "p"
        // Refocus on click

        // Hide the focus ring:
        // canvas.elt.style.outline = 'none'; 
    };

    p.draw = function() {
        p.updateFields();

        p.background(bgcolor[0], bgcolor[1], bgcolor[2]);
        p.stroke(255);
        p.strokeWeight(4);
        p.fill(255, 255, 255);
        p.circle(w/2, h/2, 100);

        p.stroke(0);
        // Debug focus
        if (document.activeElement === canvas.elt) {
            p.fill(0, 255, 0);
            p.text('FOCUSED', 10, 20);
        } else {
            p.fill(255, 0, 0);
            p.text('NOT FOCUSED - Click canvas!', 10, 20);
        }

        frameCount++;
    };

    p.updateFields = function(){
        w = resizeHandler.width();
        h = resizeHandler.height();
    };
    
    // Clean up when sketch is removed (important!)
    p.cleanup = function() {
        resizeHandler.cleanup();
    };


    p.keyReleased = function() {
        console.log("Key released: " + p.key + ", keyCode: " + p.keyCode);
        if (p.key === 'l'){
            console.log("vals:\n"
                + "w, h: " + w + ", " + h + "\n"
                + "width, height: " + p.width + ", " + p.height + "\n"
                + "windowWidth, windowHeight: " + p.windowWidth + ", " + p.windowHeight + "\n"
                + "displayWidth, displayHeight: " + p.displayWidth + ", " + p.displayHeight
            );
        }
    };

}