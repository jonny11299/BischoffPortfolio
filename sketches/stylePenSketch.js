
import { createResizeHandler } from '../utils/resizeHandler.js';
import { Palette } from '../utils/palette.js';
import Button from '../utils/button.js';

import StylePens from '../scenes/stylePenScene.js';


/*
    Creating a new sketch:

    Integrating into website:
    1. Be sure to set <a href=...></a> in "index.html"
    2. add it to the "imports" and to the "const sketches" in main.js

    Making it unique:
    1. Give it a name

*/





/*

// Would you like audio? (yes / no) (audio activates)
// Would you like to go fullscreen? (yes / no)

*/







// 1920 x 1080 gives a 16:9 aspect ratio.
// We will be using letterboxing / pillarboxing to maintain this.
const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;
const DESIGN_ASPECT = DESIGN_WIDTH / DESIGN_HEIGHT;

// For phones, we're flipping it to 9:16
const PHONE_DESIGN_WIDTH = 1080;
const PHONE_DESIGN_HEIGHT = 1920;
const PHONE_ASPECT = PHONE_DESIGN_WIDTH / PHONE_DESIGN_HEIGHT;








export function stylePenSketch(p, appState) {
    let name = "stylePenSketch"
    let resizeHandler;
    let frameCount = 0;
    let curTime = Date.now();// Get current timestamp (milliseconds since Unix epoch)
    // Compare with other timestamps
    // const pastTime = now - 5000;  // 5 seconds ago
    // const futureTime = now + 10000;  // 10 seconds from now

    // DOM elements managed by Processing
    let canvas;
    // Scale of DOM we're within. Buffer will be scaled and printed to this:
    let domWidth;
    let domHeight;
    // Where the p draw's x, y, w, h actually sit, their actual pixels,
    // not the render of design. We stretch the design and place it on these pixels.
    // displayX is the x position of the beginning of our buffer, so when there's black bars on the sides, it's inlaid a bit
    let designX, designY, designW, designH; 
    let vertical = false; // this flag will eventually be used for calculating positioning on mobile
    // current design width and height based on if we're vertical or not
    let curDW, curDH;

    // Setup the buffer for drawing: (pg is processing graphics)
    let pg; 
    const LETTERBOX_BAR_COLOR = [0, 0, 0];


    // Colors:
    let palette = new Palette(p, appState);



    // MY SCENE:

    let curScene; // will be assigned in setup:  = new StylePens(p, appState)
    let moment = 0; // tells what buttons to press, if we have entered or not



    // IO:
    let mouseDown = false;
    let muted = false;
    let volume = 50;
    



    // Processing re-definitions:

    p.setup = function(){
        appState.selectedApp = name;
        // handle the window's sizing:
        resizeHandler = createResizeHandler(p)
        domWidth = resizeHandler.width();
        domHeight = resizeHandler.height();

        // checks for vertical
        if (domWidth < domHeight){
            vertical = true;
        }else{
            vertical = false;
        }

        // Logging
        console.log("Launched the " + name + " sketch");
        console.log(name + " window inner width/height: " + window.innerWidth + ", " + window.innerHeight);

        
        // Set myself in the webpage properly
        canvas = p.createCanvas(domWidth, domHeight);
        canvas.parent('sketch-container');

        calculateDisplayBounds();


        // Make the canvas focusable and focus it
        // canvas.elt = The actual HTML <canvas> DOM element (elt = "element")
        // It's like P5 gives you a nice interface, but canvas.elt is the raw HTML element you can manipulate directly.
        canvas.elt.tabIndex = 1;  // Makes it focusable
        canvas.elt.focus();        // Actually focuses it
        canvas.elt.addEventListener('click', () => { // focuses on-click
            canvas.elt.focus();
        });
        // assigns the mouseMoved function
        canvas.mouseMoved(mouseMoved);
        canvas.mousePressed(mousePressed);
        canvas.mouseReleased(mouseReleased);
        // Hide the focus ring:
        // canvas.elt.style.outline = 'none'; 

        // console.log("Object keys: ")
        // console.log(Object.keys(p)) // inspect what is reserved by "p"
        // Refocus on click

        // Colors
        p.colorMode(p.RGB);
        palette.setScheme('tronLegacy'); // currently controlled by keyboard
        palette.fontTheme();

        // ensure text is aligned
        p.textAlign(p.CENTER, p.CENTER);
        p.angleMode(p.DEGREES);

        // init buffer at design resolution (processingGraphics)
        resetBuffer();
        
        // Look into this if rendering / low framerate struggles appear:
        // p.pixelDensity(1); 
        
        curScene = new StylePens('StylePens1', p, appState);
        appState.logSelf();
    };

    p.draw = function() {
        p.updateFields();

        // sets the background based on theme
        // palette.backgroundTheme();
        pg.background(palette.getColor('background'));
        


        // need to print my scene in here somewhere...


        // finalize the draw function:
        // first, print the letterboxes:
        p.background(LETTERBOX_BAR_COLOR);
        // Scale buffer to actual canvas size and print:
        p.image(pg, designX, designY, designW, designH);
        // Iterate frames:
        frameCount++;;
    };



    // --------------------------- PRINTS / GRAPHICS: ---------------------------

    // this appState should hold palette...
    function printButton(b){
        // determine if the color to use is based on theme or raw:
        pg.fill(palette.getColor(b.color));
        if (b.isSelected) pg.fill(palette.getColor(b.colorSelected));
        if (b.isHovered) pg.fill(palette.getColor(b.colorHovered));
        if (b.isPressed) pg.fill(palette.getColor(b.colorPressed));

        pg.strokeWeight(b.strokeWeight);
        pg.stroke(palette.getColor(b.strokeColor));

        // need to ensure pg has centered text, then print the rectangle, then the text
        pg.rect(b.x, b.y, b.w, b.h, rectRound);

        // text:
        pg.textAlign(p.CENTER, p.CENTER);
        pg.textFont(palette.getFont());
        pg.fill(palette.getColor('fontColor'));
        pg.textSize(24);
        pg.text(b.text, b.x + b.w/2, b.y + b.h/2);
    }



    // --------------------------- REGULAR checks: ---------------------------

    // ensures that all the sketch's fields are up-to-date with the environment
    // called at the start of "draw"
    p.updateFields = function(){
        // sets the canvas size based on display updates
        let neww = resizeHandler.width();
        let newh = resizeHandler.height();
        if (domWidth !== neww || domHeight !== newh){
            domWidth = neww;
            domHeight = newh;
            calculateDisplayBounds();
        }

        if (vertical){
            curDW = PHONE_DESIGN_WIDTH;
            curDH = PHONE_DESIGN_HEIGHT;    
        }else{
            curDW = DESIGN_WIDTH;
            curDH = DESIGN_HEIGHT;
        }

        
        curTime = Date.now();
    };


    // --------------------------- IO ---------------------------

    p.keyReleased = function() {
        console.log("Key released: " + p.key + ", keyCode: " + p.keyCode);
        if (p.key === 'l'){
            console.log("Logging from keyboard: ");
            console.log("vals:\n"
                + "w, h: " + domWidth + ", " + domHeight + "\n"
                + "width, height: " + p.width + ", " + p.height + "\n"
                + "windowWidth, windowHeight: " + p.windowWidth + ", " + p.windowHeight + "\n"
                + "displayWidth, displayHeight: " + p.displayWidth + ", " + p.displayHeight + "\n"
                + "designWidth, designHeight: " + curDW + ", " + curDH + "\n" 
                + "mousex(), mousey(): " + mousex() + ", " + mousey()
            );
            console.log("Selected sketch:\n" + appState.selectedApp);
            console.log("current framerate: " + p.frameRate());
            // console.log("Cube performance stats:");
            // console.log(cubesLayer.getPerformanceStats());
            appState.logSelf();
        }

        // Apply color schemes:
        if (p.key === '1') palette.setScheme('dark');
        if (p.key === '2') palette.setScheme('light');
        if (p.key === '3') palette.setScheme('sunset');
        if (p.key === '4') palette.setScheme('entrance');
        if (p.key === '5') palette.setScheme('tronClassic');
        if (p.key === '6') palette.setScheme('tronLegacy');
        if (p.key === '7') palette.setScheme('neonGrid');
        if (p.key === '8') palette.setScheme('darkCyber');
        if (p.key === '9') palette.setScheme('digitalVoid');


        // now, we run the scene's 'key released'
        curScene.keyReleased(p.key, p.keyCode);
    };


    // get the mousex and mousey positions relative to the design
    // mouse moves between 0, 0, windowWidth, and windowHeight
    // we need to map that to curDW, curDH
    function dx(xRelativeToWindow){
        return p.map(xRelativeToWindow, designX, designX + designW, 0, curDW);
    }
    function dy(yRelativeToWindow){
        return p.map(yRelativeToWindow, designY, designY + designH, 0, curDH);
    }
    function mousex(){
        return dx(p.mouseX);
    }
    function mousey(){
        return dy(p.mouseY);
    }


    function mouseMoved(){
        /*
        console.log("p mousex, mousey to " + p.mouseX + ", " + p.mouseY);
        console.log("dx/dy mousex, mousey to " + mousex() + ", " + mousey());
        */
       curScene.mouseMoved(mousex(), mousey());
       /*
       for (let b of buttons){
            b.checkHover(mousex(), mousey());
       }
            */
    }
    
    function mousePressed(){
        mouseDown = true;
        // console.log("mousePressed at " + mousex() + ", " + mousey());
       curScene.mousePressed(mousex(), mousey());

       /*
       for (let b of buttons){
            b.checkPressed(mousex(), mousey());
       }*/

        // set isPressed for elements
    }
    function mouseReleased(){
        // console.log("mouseReleased at " + mousex() + ", " + mousey());
       curScene.mouseReleased(mousex(), mousey());

        // do whatever you must
        /*
       for (let b of buttons){
            b.release(mousex(), mousey());
       }*/

        mouseDown = false;
    }



    // --------------------------- DOM Handling / UTILITY ---------------------------

    // Clean up when sketch is removed (important!)
    p.cleanup = function() {
        resizeHandler.cleanup();
    };

    // helper functions:
    function isFocused(){
        return document.activeElement === canvas.elt;
    }


    // Releases the old buffer, creates a new one.
    // Also updates our curDW and curDH
    // currently only runs when we switch between vertical/horizontal
    // runs from within calculateDisplayBounds, so don't go callin' that from here...
    function resetBuffer(){

        if (pg) pg.remove();

        if (vertical){
            pg = p.createGraphics(PHONE_DESIGN_WIDTH, PHONE_DESIGN_HEIGHT);
            curDW = PHONE_DESIGN_WIDTH;
            curDH = PHONE_DESIGN_HEIGHT;
        }else{
            pg = p.createGraphics(DESIGN_WIDTH, DESIGN_HEIGHT);
            curDW = DESIGN_WIDTH;
            curDH = DESIGN_HEIGHT;
        }
    }



    // aka updateResolution
    function calculateDisplayBounds() {
        let oldVertical = vertical;


        let canvasAspect = p.width / p.height;
        let curDesignAspect;

        // only need to reset buffer if it changes between vertical or not-vertical

        if (domWidth < domHeight){
            vertical = true;
            curDesignAspect = PHONE_ASPECT;
        }else{
            vertical = false;
            curDesignAspect = DESIGN_ASPECT;
        }

        if (oldVertical !== vertical){
            // console.log("Switched vertical video from " + oldVertical + " to " + vertical);
            resetBuffer();
        }


        
        if (canvasAspect > curDesignAspect) {
            // Canvas is wider - pillarbox (bars on sides)
            designH = p.height;
            designW = p.height * curDesignAspect;
            designX = (p.width - designW) / 2;
            designY = 0;
        } else {
            // Canvas is taller - letterbox (bars on top/bottom)
            designW = p.width;
            designH = p.width / curDesignAspect;
            designX = 0;
            designY = (p.height - designH) / 2;
        }



        /*
        vestigal code... you could uncomment it, and cubesLayer would always return false, and it wouldn't break anything...
        if (cubesLayer){
            cubesLayer.rescale(curDW, curDH)
        }
            */ 
    }

}


