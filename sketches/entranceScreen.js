
import { createResizeHandler } from '../utils/resizeHandler.js';
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
    const interFramesAmount = 7;
    // interpolate between outerFrame and innerFrame based on i. Goes from outer --> inner for (0, interFramesAmount - 1)
    for (let i = 0 ; i < interFramesAmount ; i++){
        const t = i / interFramesAmount // need to do this to capture it

        interFrames.push({
            get x() { return outerFrame.x + (innerFrame.x - outerFrame.x) * t; },
            get y() { return outerFrame.y + (innerFrame.y - outerFrame.y) * t; },
            get w() { return outerFrame.w + (innerFrame.w - outerFrame.w) * t; },
            get h() { return outerFrame.h + (innerFrame.h - outerFrame.h) * t; },
            print: function (p, palette) {
                p.stroke(palette.getColor(3));
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
        x: [0, 0, 0, 0],
        y: [0, 0, 0, 0],
        print: function(p, palette){
            if (clickCount === 0){
                p.strokeWeight(5);
                p.stroke(palette.getColor(4));
                p.bezier(this.x[0], this.y[0], this.x[1], this.y[1], this.x[2], this.y[2], this.x[3], this.y[3]);
            }
            // also print the clicked circles
            for (let i = 0 ; i < 4 ; i++){
                p.circle(this.x[i], this.y[i], 8)
            }
            palette.fillTheme(1);
            p.circle(mouseLastPressed[0], mouseLastPressed[1], 8);
        
        }
    }
    

    // for treeFractal
    const LengthRatio = 0.7;
    const ThicknessRatio = 0.7;
    const AngleSpread = 20; // 20 degrees, i.e. fit all children within 20 degrees spread



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
        palette.settheme('entrance'); // currently controlled by keyboard
        // // Set text to align from center (both horizontal and vertical)
        p.textAlign(p.CENTER, p.CENTER);
        p.angleMode(p.DEGREES);

        
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

        /* // don't print frames:
        outerFrame.print(p, palette);
        innerFrame.print(p, palette);
        for (let interFrame of interFrames){
            interFrame.print(p, palette);
        }
            */

        // curve.print(p, palette);

        
        // draw a fractal.
        // starts at x, y
        // goes up, then splits
        // fractalDraw(sketchWidth/2, sketchHeight/2, 0, -200, 9);


        /*

        I would just like to print a fractal.

        startingX, startingY, angle (where does it reach towards), length, thickness, color, numChildren

        We place various fractals at different starting positions, and have them reach to the mouse.
        We can figure the length and length decrease by the following:
        totalLength = firstTerm / (1 - ratio) --> firstTerm = totalLength(1 - ratio)

        for numChildren, let's just start with alternating 2 and 3

        The number of children will be proportional to how many interFrames I'm within...
        
        */

        // let's figure out this function call... 
        // startingX, startingY is at the bottom middle of the page, angle is towards mouse, 
        // length we take firstTerm = sum(1 - ratio) so sum is the distance to the mouse, ratio is above
        // thickness 10, go to 2/3 each time. Color we'll start with some random one, but it'll be cool to make
        // an incremental color selector that moves the color along a circle, if that makes sense.
        // numChildren is how many interFrames we are within.

        // let's wrap the below in a for loop that determines many inital calls to the treeFractal. I want these things to start from all around the screen.
        let startingPoints = [
            {x: 0, y: 0},
            {x: sketchWidth/2, y: 0},
            {x: sketchWidth, y: 0},
            {x: 0, y: sketchHeight/2},
            {x: sketchWidth, y: sketchHeight/2},
            {x: 0, y: sketchHeight},
            {x: sketchWidth/2, y: sketchHeight},
            {x: sketchWidth, y: sketchHeight},
        ];

        for (let point of startingPoints){
            let startx = point.x;
            let starty = point.y;
            let a = p.atan2((p.mouseY - starty), (p.mouseX - startx));

            // sum is the minimum distance from the edge
            let sum = p.mouseX;
            if (sketchWidth - p.mouseX < sum) sum = sketchWidth - p.mouseX;
            if (p.mouseY < sum) sum = p.mouseY;
            if (sketchHeight - p.mouseY < sum) sum = sketchHeight - p.mouseY;
            // stop it from exceeding the distance to the innerFrame 
            // let maxLength = outerFrame.y + outerFrame.h - (innerFrame.y + innerFrame.h);
            // if (sum > maxLength) sum = maxLength;

            let l = sum * (1 - LengthRatio );
            let c = palette.getColor(4);
            let numChildren = 3;
            let iter = 0; // number of times to run the fractal
            for (let iframe of interFrames){
                if (iframe.x <= p.mouseX && p.mouseX <= iframe.x + iframe.w && iframe.y <= p.mouseY && p.mouseY <= iframe.y + iframe.h){
                    iter++;
                }
            }
            // console.log("numChildren: " + numChildren + ", iter: " + iter); // these are being calculated correctly
            
            treeFractal(startx, starty, a, l, 10, c, numChildren, iter);
        }


        
        palette.stroke(0);
        frameCount++;
    };

    // Awesome. This shit works so well.
    // I can totally see advancing the color printing of it, making the color more intuitive.
    // Let's see if we can't 
    function treeFractal(startingX, startingY, angle, length, thickness, color, numChildren, iter){
        let p1 = [startingX, startingY];
        let p2 = [startingX + length * p.cos(angle), startingY + length * p.sin(angle)];
        p.strokeWeight(thickness);
        p.stroke(color);
        p.line(p1[0], p1[1], p2[0], p2[1]);
        if (iter > 0){
            if (numChildren > 2){
                // make 3 children, each with 2 children of their own
                let angles = [angle - AngleSpread, angle, angle + AngleSpread];
                treeFractal(p2[0], p2[1], angles[0], length * LengthRatio, thickness * ThicknessRatio, color, 2, iter - 1);
                treeFractal(p2[0], p2[1], angles[1], length * LengthRatio, thickness * ThicknessRatio, color, 2, iter - 1);
                treeFractal(p2[0], p2[1], angles[2], length * LengthRatio, thickness * ThicknessRatio, color, 2, iter - 1);
            }else{
                // make 2 children, each with 3 children of their own
                let angles = [angle - AngleSpread * 2 / 3, angle + AngleSpread * 2 / 3];
                treeFractal(p2[0], p2[1], angles[0], length * LengthRatio, thickness * ThicknessRatio, color, 3, iter - 1);
                treeFractal(p2[0], p2[1], angles[1], length * LengthRatio, thickness * ThicknessRatio, color, 3, iter - 1);
            }
        }
    }


    // should work to call at ((x + w)/2, (y + h)/2, 0, 0, 7)
    // this one sucks
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
        if (clickCount < 4){
            curve.x[clickCount] = x;
            curve.y[clickCount] = y;
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
            console.log("vals:\n"
                + "w, h: " + sketchWidth + ", " + sketchHeight + "\n"
                + "width, height: " + p.width + ", " + p.height + "\n"
                + "windowWidth, windowHeight: " + p.windowWidth + ", " + p.windowHeight + "\n"
                + "displayWidth, displayHeight: " + p.displayWidth + ", " + p.displayHeight
            );
            console.log("Selected sketch:\n" + appState.selectedApp);
            console.log("current framerate: " + p.frameRate());
            console.log("Focused? " + isFocused());
        }

        // Apply color themes:
        if (p.key === '1') palette.settheme('dark');
        if (p.key === '2') palette.settheme('light');
        if (p.key === '3') palette.settheme('sunset');
        if (p.key === '4') palette.settheme('entrance');

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
