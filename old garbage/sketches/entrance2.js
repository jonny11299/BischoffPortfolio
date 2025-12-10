
import { createResizeHandler } from '../utils/resizeHandler.js';
import { Palette } from '../utils/palette.js';
import CubesLayer from '../graphics/CubesLayer.js';


/*
    Creating a new sketch:

    Integrating into website:
    1. Be sure to set <a href=...></a> in "index.html"
    2. add it to the "imports" and to the "const sketches" in main.js

    Making it unique:
    1. Give it a name

*/


/*

Needs a 
1. Button class
2. Slider class (shit, maybe just get the data class in here from Claude or that other guy)
3. Buffer

*/



// lowercase because it's a "factory function", not a class.
// These sketches setup a P5 instance mode by defining methods on p. 
// I'm not creating nstances of them, just calling them.



// 1920 x 1080 gives a 16:9 aspect ratio.
// We will be using letterboxing / pillarboxing to maintain this.
const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;
const DESIGN_ASPECT = DESIGN_WIDTH / DESIGN_HEIGHT;

// For phones, we're flipping it to 9:16
const PHONE_DESIGN_WIDTH = 1080;
const PHONE_DESIGN_HEIGHT = 1920;
const PHONE_ASPECT = PHONE_DESIGN_WIDTH / PHONE_DESIGN_HEIGHT;






// Coordinate function system is relative to the design width and height above.
class Button {
    constructor(config) {
        this.name = config.name;
        this.x = config.x;
        this.y = config.y;
        this.w = config.w || 200;
        this.h = config.h || 60;
        this.text = config.text;
        this.isToggle = config.isToggle || false; // affects how it functions, either as a toggle or non-toggle button
        this.isSelected = false; // has been selected (overlaps with isPressed when not toggle)
        this.isHovered = false; // is hovered over
        this.isPressed = false; // physically pressing down with the mouse
        this.color = config.color || 'buttonColor';
        this.colorHovered = config.colorHovered || 'buttonHovered';
        this.colorPressed = config.colorPressed || 'buttonPressed';
        this.colorSelected = config.colorSelected || 'buttonSelected';
        this.strokeWeight = config.strokeWeight || 'strokeWeight';
        this.strokeColor = config.strokeColor || 'stroke';
    }
    
    // Should check hover, pressed, and release when the mouse is moved, pressed, released.
    checkHover(designX, designY) {
        this.isHovered = designX > this.x && designX < this.x + this.w && designY > this.y && designY < this.y + this.h;
        return this.isHovered;
    }
    
    checkPressed(designX, designY) {
        let pressed
        this.isPressed = designX > this.x && designX < this.x + this.w && designY > this.y && designY < this.y + this.h;
        return pressed;
    }

    clicked(){
        // console.log("clicked " + this.text + " , and is it a toggle? " + this.isToggle);
        if (this.isToggle){
            this.isSelected = !this.isSelected;
        }
    }

    // returns true if it was previously pressed
    release(){
        if (this.isPressed){
            // this means we were clicked
            this.clicked();
        }
        let pressed = this.isPressed;
        this.isPressed = false;

        return pressed;
    }

    // print upon pg, the "processing graphics" buffer.
    // We should not print from here -- we should print from within
    // the main function, because this actually has p and pg
}



export function entrance2(p, appState) {
    let name = "entrance2"
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



    // IO:
    let mouseDown = false;

    // icons:
    let rectRound = 5;

    let bw = 200;
    let bx = curDW / 2 - bw / 2;

    let buttons = [];
    buttons.push(new Button({
        name: "enter",
        x: bx,
        y: DESIGN_HEIGHT / 2 - 50,
        w: bw,
        h: 100,
        text: "Enter"
    }))
    buttons.push(new Button({
        name: "enterMuted",
        x: bx,
        y: DESIGN_HEIGHT / 2 + 100,
        w: bw,
        h: 100,
        text: "Enter (Muted)",
    }))



    // layer that handles the cubes:
    let cubesLayer;




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
        palette.settheme('tronLegacy'); // currently controlled by keyboard
        palette.fontTheme();

        // ensure text is aligned
        p.textAlign(p.CENTER, p.CENTER);
        p.angleMode(p.DEGREES);

        // init buffer at design resolution (processingGraphics)
        resetBuffer();
        
        // Look into this if rendering / low framerate struggles appear:
        // p.pixelDensity(1); 

        // Create the cubes layer (after you have curDW and curDH)
        cubesLayer = new CubesLayer(p, curDW, curDH, 30); // 30 cubes
    };

    p.draw = function() {
        p.updateFields();

        // sets the background based on theme
        // palette.backgroundTheme();
        pg.background(palette.getColor('background'));
        


        // Render cubes and draw them FIRST (behind everything)
        let cubesImage = cubesLayer.render();
        pg.image(cubesImage, 0, 0, curDW, curDH);



        pg.stroke(palette.getColor('stroke'));
        // Sample, for detecting colors:
        // set palette stroke
        let strokew = 1;



        // text:

        // text x
        let tx = curDW / 2;
        let text1 = "Welcome to my portfolio.\nFor best viewing experience, please use\na widescreen browser with stereo audio."

        // rect behind:
        pg.fill(palette.getColor('1', 230));
        pg.rect(curDW/2 - 500, 150, 1000, 200, rectRound);

        pg.textAlign(p.CENTER, p.CENTER);
        pg.textFont(palette.getFont());
        pg.fill(palette.getColor('fontColor'));
        pg.textSize(40);
        pg.text(text1, tx, 250);


        /* 
            Welcome to my portfolio.
            For best viewing experience, please use
            a browser with stereo audio.

            enter
            enter (muted)
        */


        // print buttons:

        // re-center the buttons
        for (let b of buttons){
            let bw = 200;
            let bx = curDW / 2 - bw / 2;
            b.x = bx;
            b.w = bw;
            printButton(b);
        }



        // finalize the draw function:
        // first, print the actual background:
        p.background(LETTERBOX_BAR_COLOR);
        // Scale buffer to actual canvas size and print:
        p.image(pg, designX, designY, designW, designH);
        // Iterate frames:
        frameCount++;;
    };



    // --------------------------- PRINTS / GRAPHICS: ---------------------------

    function printButton(b){
        /*
        constructor(config) {
        this.name = config.name;
        this.x = config.x;
        this.y = config.y;
        this.w = config.w || 200;
        this.h = config.h || 60;
        this.text = config.text;
        this.isPressed = false;
        this.isHovered = false;
        this.isToggle = false;
        this.isSelected = false;
        this.color = config.color || '1';
        this.colorHovered = config.colorHovered || '3';
        this.colorPressed = config.colorPressed || '4';
        this.colorSelected = config.colorSelected || '2';
        this.strokeWidth = config.strokeWidth || 'strokeWeight';
        this.strokeColor = config.strokeColor || 'stroke';
    }*/
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
            console.log("Cube performance stats:");
            console.log(cubesLayer.getPerformanceStats());
        }

        // Apply color themes:
        if (p.key === '1') palette.settheme('dark');
        if (p.key === '2') palette.settheme('light');
        if (p.key === '3') palette.settheme('sunset');
        if (p.key === '4') palette.settheme('entrance');
        if (p.key === '5') palette.settheme('tronClassic');
        if (p.key === '6') palette.settheme('tronLegacy');
        if (p.key === '7') palette.settheme('neonGrid');
        if (p.key === '8') palette.settheme('darkCyber');
        if (p.key === '9') palette.settheme('digitalVoid');
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
       for (let b of buttons){
            b.checkHover(mousex(), mousey());
       }
    }
    
    function mousePressed(){
        mouseDown = true;
        // console.log("mousePressed at " + mousex() + ", " + mousey());

       for (let b of buttons){
            b.checkPressed(mousex(), mousey());
       }

        // set isPressed for elements
    }
    function mouseReleased(){
        // console.log("mouseReleased at " + mousex() + ", " + mousey());

        // do whatever you must

       for (let b of buttons){
            b.release(mousex(), mousey());
       }

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



        if (cubesLayer){
            cubesLayer.rescale(curDW, curDH)
        }
    }

}


