
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

export function entranceScreen(p, appState) {
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

    // IO
    let mouseDown = false;


    // Colors:
    let palette = new Palette(p, appState);


    // x: () => getSketchWidth()/2 - 100,  // can define it like that for a function, but you have to access like enter.x() instead of enter.x
    // icons:
    let enter = {
        name: 'enter',
        x: sketchWidth/2 - 100,
        y: sketchHeight/2,
        w: 200,
        h: 60,
        text: "Enter",
        isPressed: false,
        isHovered: false,
        color: 1,
        colorHovered:  3,
        colorPressed: 4
    }
    let enterMuted = {
        name: 'enterMuted',
        x: sketchWidth/2 - 100,
        y: sketchHeight/2 + 80,
        w: 200,
        h: 60,
        text: "Enter (Muted)",
        isPressed: false,
        isHovered: false,
        color: 1,
        colorHovered:  3,
        colorPressed: 4
    }

    // es for elements
    // stores the above buttons/icons
    let myButtons = [];




    // For now, the wavemesh animation works like this:
    // Wherever the mouse is, they move away from it with a certin force.
    // They also wave along a sinewave, and so it's sort of like:
    // they wave up and down, then depending on that resulting force, they are pushed away from the mouse
    // ()

    // shoot man, I don't want to make this animation, it sounds lamer than alternatives.
    // Let's make something where like, the outer frame reaches inwards like a fractal.
    // Going to have an outer frame (box around the screen) and an inner frame (box around the inner text)
    // going to divide it into tiers, and have it reach from the outside, inwards in a fractal way
    // going to have it grow with time.

    // these will be overwritten
    // defined in function entranceScreen(p, appState):




    let offset = 30;

    let outerFrame = {
        get x() { return 0; },
        get y() { return 0; },
        get w() { return sketchWidth; },
        get h() { return sketchHeight; },
        print: function (p, palette) {
            p.stroke(palette.getColor(5));
            p.strokeWeight(2);
            palette.fill([0, 0, 0, 0]);
            p.rect(this.x, this.y, this.w, this.h);
        }
    }

    let innerFrame = {
        get x() { return enter.x - offset; },
        get y() { return enter.y - offset; },
        get w() { return enter.w + 2 * offset; },
        get h() { return enter.h + 2 * offset + enterMuted.y - enter.y; },
        print: function (p, palette) {
            p.stroke(palette.getColor(5));
            p.strokeWeight(2);
            palette.fill([0, 0, 0, 0]);
            p.rect(this.x, this.y, this.w, this.h);
        }
    }

    let interFrames = [];
    let points = [];
    const interFramesAmount = 4;
    // interpolate between outerFrame and innerFrame based on i. Goes from outer --> inner for (0, interFramesAmount - 1)
    for (let i = 0 ; i < interFramesAmount ; i++){
        const t = i / interFramesAmount // need to do this to capture it

        interFrames.push({
            get x() { return outerFrame.x + (innerFrame.x - outerFrame.x) * t; },
            get y() { return outerFrame.y + (innerFrame.y - outerFrame.y) * t; },
            get w() { return outerFrame.w + (innerFrame.w - outerFrame.w) * t; },
            get h() { return outerFrame.h + (innerFrame.h - outerFrame.h) * t; },
            print: function (p, palette) {
                p.stroke(palette.getColor(4));
                p.strokeWeight(1);
                palette.fill([0, 0, 0, 0]);
                p.rect(this.x, this.y, this.w, this.h);
            }
        })

        // top, left, right, bottom
    }
        

    let mouseLastPressed = [8, 8];

    let clickCount = 0;
    let curve = {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        x3: 0,
        y3: 0,
        x4: 0,
        y4: 0,
        print: function(p, palette){
            if (clickCount === 0){
                p.strokeWeight(5);
                p.stroke(palette.getColor(4));
                p.bezier(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3, this.x4, this.y4);
            }else{
                palette.fillTheme(1);
                p.circle(mouseLastPressed[0], mouseLastPressed[1], 8);
            }
        }
    }
    



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
        // assigns the mouseMoved function
        canvas.mouseMoved(mouseMoved);
        canvas.mousePressed(mousePressed);
        canvas.mouseReleased(mouseReleased);
        // Hide the focus ring:
        // canvas.elt.style.outline = 'none'; 

        // console.log("Object keys: ")
        // console.log(Object.keys(p)) // inspect what is reserved by "p"
        // Refocus on click

        // Colors and Styles
        p.colorMode(p.RGB);
        palette.setScheme('entrance'); // currently controlled by keyboard
        // // Set text to align from center (both horizontal and vertical)
        p.textAlign(p.CENTER, p.CENTER);

        
        // Look into this if rendering / low framerate struggles appear:
        // p.pixelDensity(1); 

        myButtons.push(enter);
        myButtons.push(enterMuted);

        setupFractalAnimation();
    };

    p.draw = function() {
        p.updateFields();

        // sets the background based on theme
        palette.backgroundTheme();

        // palette.strokeRGB(255);

        // Sample, for detecting colors:
        // set palette stroke
        // palette.strokeTheme();
        // palette.fillTheme('1');
        // p.circle(sketchWidth/2, sketchHeight/2, 100);


        // p.testFonts();


        // Splash text:
        p.textAlign(p.CENTER, p.CENTER);
        palette.fontTheme();
        p.textSize(20);
        let message = "Welcome to my website.\nThis is where you can see all the cool stuff I make\n As you can see, I make a lot of cool stuff.";
        p.text(message, sketchWidth/2, 200);


        // Print buttons:
        for (let i = 0 ; i < myButtons.length ; i++){
            let e = myButtons[i];
            palette.fillTheme(e.color);
            palette.strokeTheme();

            // print rect
            if (hovered(e)){
                palette.fillTheme(e.colorHovered);
            }
            if (isPressed(e)){
                palette.fillTheme(e.colorPressed);
            }
            p.rect(e.x, e.y, e.w, e.h, 7);
            // if (frameCount % 100 === 0 ) console.log("check out " + e.name + " at " + e.x + ", " + e.y);


            // print text:

            p.textAlign(p.CENTER, p.CENTER);
            palette.fontTheme();
            p.text(e.text, e.x + e.w/2, e.y + e.h/2);
        }

        outerFrame.print(p, palette);
        innerFrame.print(p, palette);
        for (let interFrame of interFrames){
            interFrame.print(p, palette);
        }

        curve.print(p, palette);

        
        // draw a fractal.
        // starts at x, y
        // goes up, then splits
        fractalDraw(sketchWidth/2, sketchHeight/2, 0, -200, 9);
        
        palette.stroke(0);
        frameCount++;
    };


    // should work to call at ((x + w)/2, (y + h)/2, 0, 0, 7)
    function fractalDraw(x, y, xOffset, yOffset, numLeft){
        if (numLeft > 0){
            palette.fillTheme(4);
            p.stroke(palette.getColor(4));
            p.strokeWeight(5);
            let x2 = x + xOffset;
            let y2 = y + yOffset;

            p.line(x, y, x + xOffset, y + yOffset);
            fractalDraw(x + xOffset, y + yOffset, - 20, 10, numLeft - 1);
            fractalDraw(x + xOffset, y + yOffset, 20, 10, numLeft - 1);
        }
    }



    // actually sets and unsets these values for whatever element you call it on
    // if you don't check, it doesn't update.
    function hovered(element){
        let e = element;
        if (p.mouseX >= e.x && p.mouseX <= e.x + e.w && p.mouseY >= e.y && p.mouseY <= e.y + e.h){
            e.isHovered = true;
            return true;
        }else{
            e.isHovered = false;
            return false;
        }
    }
    function isPressed(element){
        return hovered(element) && mouseDown;
    }
    function clicked(element){
        console.log("clicked " + element.name);
    }

    function mouseMoved(){
        // console.log("mouseMoved to " + p.mouseX + ", " + p.mouseY);
        // check elements:
        for (let e of myButtons){
            if (hovered(e)){
                // console.log("Hovered over " + e.name);
                // don't have to do anything here, but we should still keep this empty if
                // because calling the check actually modifies the internal value (I know bro)
            }
        }
    }
    function mousePressed(){
        mouseDown = true;
        // console.log("mousePressed at " + p.mouseX + ", " + p.mouseY);

        // set isPressed for elements
        for (let e of myButtons){
            if (hovered(e)){
                console.log("pressed over " + e.name);
                e.isPressed = true;
            }else{
                e.isPressed = false;
            }
        }
    }
    function mouseReleased(){
        // console.log("mouseReleased at " + p.mouseX + ", " + p.mouseY);

        // call onClick if necessary
        for (let e of myButtons){
            if (hovered(e)){
                console.log("released over " + e.name);
                if (e.isPressed){
                    // released on an element that we clicked
                    clicked(e);
                }else{
                    // released but we're no longer on the previously-clicked element.
                    e.isPressed = false;
                }
            }else{
                // we released on the element, but we never pressed it.
                e.isPressed = false;
            }
            // release all isPressed (probably not necessary)
            // also, if this is the case, I can totally simplify this into a single "if" statement"
            e.isPressed = false;
        }

        let x = p.mouseX;
        let y = p.mouseY;
        mouseLastPressed = [x, y];
        if (clickCount === 0){
            curve.x1 = x;
            curve.y1 = y;
        }else if (clickCount === 1){
            curve.x2 = x;
            curve.y2 = y;
        }else if (clickCount === 2){
            curve.x3 = x;
            curve.y3 = y;
        }else if (clickCount === 3){
            curve.x4 = x;
            curve.y4 = y;
        }
        clickCount++;
        if (clickCount === 4) clickCount = 0;



        mouseDown = false;
    }


    p.testFonts = function(){
        
        // p.fill(palette.getColor('text'));
        // set text color and weight
        palette.fillTheme('text');
        palette.noStroke();
        p.textSize(20);
        
        // Serif fonts
        p.textFont('Georgia');
        p.text('Georgia', 10, 40);

        p.textFont('Times New Roman'); // or just "Times"
        p.text('Times New Roman', 10, 70);

        p.textFont('Palatino');
        p.text('Palatino', 10, 100);

        // Sans-serif fonts
        p.textFont('Arial');
        p.text('Arial', 10, 140);

        p.textFont('Helvetica');
        p.text('Helvetica', 10, 170);

        p.textFont('Verdana');
        p.text('Verdana', 10, 200);

        p.textFont('Tahoma');
        p.text('Tahoma', 10, 230);

        p.textFont('Trebuchet MS');
        p.text('Trebuchet MS', 10, 260);

        // Monospace fonts
        p.textFont('Courier New'); // or "Courier"
        p.text('Courier New', 10, 300);

        p.textFont('Monaco');
        p.text('Monaco', 10, 330);

        p.textFont('Consolas');
        p.text('Consolas', 10, 360);

        // Display fonts
        p.textFont('Comic Sans MS');
        p.text('Comic Sans MS', 10, 400);

        p.textFont('Impact');
        p.text('Impact', 10, 430);

    }
    
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
            console.log("Focused? " + isFocused());
        }

        // Apply color schemes:
        if (p.key === '1') palette.setScheme('dark');
        if (p.key === '2') palette.setScheme('light');
        if (p.key === '3') palette.setScheme('sunset');
        if (p.key === '4') palette.setScheme('entrance');

        // wavemesh calculations:
        if (p.keyCode === 38){ // up arrow
            waveMeshNum.y += 1;
        }else if (p.keyCode === 40){ // down arrow
            waveMeshNum.y -= 1;
        }else if (p.keyCode === 37){ // left arrow
            waveMeshNum.x -= 1;
        }else if (p.keyCode === 39){ // right arrow
            waveMeshNum.y += 1;
        }else if (p.keyCode === 187){ // plus button
            waveMeshNum.z += 1;
        }else if (p.keyCode === 189){ // minus button
            waveMeshNum.z -= 1;
        }
    };



    function setupFractalAnimation(){

    }


    // ensures that all the sketch's fields are up-to-date with the environment
    p.updateFields = function(){
        sketchWidth = resizeHandler.width();
        sketchHeight = resizeHandler.height();
        curTime = Date.now();

        // reposition elements:
        enter.x = sketchWidth/2 - 100;
        enter.y = sketchHeight/2 - 50;
        enterMuted.x = sketchWidth/2 - 100;
        enterMuted.y = sketchHeight/2 + 50;

    };



    // helper functions:
    function isFocused(){
        return document.activeElement === canvas.elt;
    }

    function getSketchWidth(){
        return sketchWidth;
    }
    function getSketchHeight(){
        return sketchHeight;
    }
}
