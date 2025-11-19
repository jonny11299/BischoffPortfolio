

/*

Basic vision is:

    1. Scale the window
    2. Render system follows the window's scale
    3. Render system follows the window's zoom
    4. Render system reads phone vs laptop
    5. Render system is built on a command queue that can fallback on past commands
        therefore enabling it to re-draw a sketch that has been saved,
        or effectively re-scale what has been drawn

    # Scale 
    xPos()
    yPos()


    # Render system
    # stores the "ops" (operations)
    # enqueueOp(), drawOp(), etc

*/






// Track screen
const startingWidth = window.innerWidth
const startingHeight = window.innerHeight

let vertical = false

// Defines the root / absolute positions of things
// translated via "getx" and "gety" for various elements
let baseWidth = startingWidth
let baseHeight = startingHeight

// scales the utility windows based on user input
let zoomx = 1
let zoomy = 1
let stretchyScale = true;



// track user input
let mouseDown = false




// utility
let curFrame = 0;
let beginLogging = true;




// design
let bgcolor = [256, 256, 256];
let myStrokeColor = [0, 0, 0];
let myStrokeWeight = 2;

let myWindowFillColor = [230, 230, 256];
let myWindowFillSelectedColor = [200, 256, 200];
let myWindowFillHovoredColor = [225, 256, 225];

let toolBarOpen = true;




class Icon{
    constructor(xin, yin, win, hin){
        this.xpos = xin;
        this.ypos = yin;
        this.w = win;
        this.h = hin;

        this.hovered = false;
        this.selected = false;
        
        this.iconStrokeColor = myStrokeColor;
        this.iconStrokeWeight = myStrokeWeight;
        this.iconFillColor = myWindowFillColor;
        this.iconFillSelectedColor = myWindowFillSelectedColor;
        this.iconFillHoveredColor = myWindowFillHovoredColor;
    }
}




window.setup = function () {
    colorMode(RGB)

    createCanvas(startingWidth, startingHeight);
}

window.draw = function() {
    background(bgcolor[0], bgcolor[1], bgcolor[2]);

    strokeWeight(1);
    stroke(0, 0, 0);
    textSize(20);
    text("Hey bro", getx(600), gety(100));


    screenData = [
        "width: " + width +
        "\nheight: " + height +
        "\nmouseX: " + mouseX +
        "\nmouseY: " + mouseY +
        "\nscreenX: " + screenX +
        "\nscreenY: " + screenY +
        "\nvertical? " + vertical
    ];

    text(screenData, getx(50), gety(50));


    // logging within Draw:
    if (curFrame % 100 == 0){
        // some type of incremental logging
        // drawOp("draw", [1, 2, 3, 4, 7]);
    }

    printRects();

    toolBar();

    curFrame++;
}





// Drawing functions:

function printRects(){
    fill(0, 0, 255, 255)
    for (let i = 0 ; i < 10 ; i++){
        rect(getx(i*5 + 500), gety(i*5 + 50), getx(50), gety(50));
    }
}


// sets the window's colors based on the window's position
// referring to if the mouse is over it or not (highlighting)
function setWindowFillColors(xin, yin, win, hin){
    let hovered = mouseX > xin && mouseX < xin + win && mouseY > yin && mouseY < yin + hin;
    if (hovered){
        fill(myWindowFillHovoredColor)
    }else{
        fill(myWindowFillColor)
    }
    if (hovered && mouseDown){
        fill(myWindowFillSelectedColor)
    }
}




function toolBar(){
    let xpos = 10;
    let ypos = 10;
    let w = 20;
    let h = 20;

    stroke(myStrokeColor);
    strokeWeight(myStrokeWeight);
    setWindowFillColors(xpos, ypos, w, h);
    
    // print the guy
    rect(xpos, ypos, w, h);

    // print the little arrow
    
    fill(myStrokeColor)
    if (toolBarOpen){
        let points = [
            xpos + w/2,
            ypos + 2,
            xpos + w - 2,
            ypos + h/2,
            xpos + w/2,
            ypos + h - 2
        ];
        triangle(points[0], points[1], points[2], points[3], points[4], points[5]);
    }else{
        let points = [
            xpos + 2,
            ypos + h/2,
            xpos + w/2,
            ypos + h - 2,
            xpos + w - 2,
            ypos + h/2
        ];
        triangle(points[0], points[1], points[2], points[3], points[4], points[5]);
    }
}





// UI:
// Mouse:
function mousePressed(){
  mouseDown = true
}
function mouseReleased(){
  mouseDown = false
}


// Key Listeners:

function keyReleased(){
    if (beginLogging){
        console.log("Key released. Key = " + key + " | KeyCode = " + keyCode);
    }


    if (keyCode === 37){
        // left arrow

    }else if (keyCode === 39){
        // right arrow

    }else if (keyCode === 38){
        // up arrow

    }else if (keyCode === 40){
        // down arrow

    }else if (key === 't'){
        // t for toggle
        // right now it's toggling my scale behavior
        stretchyScale = !stretchyScale; 
    }else if (key === 'l'){
        // begin logging
        beginLogging = !beginLogging;
    }
}


/* 
Key released. Key = ArrowLeft | KeyCode = 37
JBPaint.js:132 Key released. Key = ArrowUp | KeyCode = 38
JBPaint.js:132 Key released. Key = ArrowRight | KeyCode = 39
JBPaint.js:132 Key released. Key = ArrowDown | KeyCode = 40
*/


// Zoom / window rendering:

window.addEventListener("resize", updateSize);
function updateSize() {
    if (beginLogging){
        console.log("Window width:", window.innerWidth);
        console.log("Window height:", window.innerHeight);
    }


    resizeCanvas(window.innerWidth, window.innerHeight);

    vertical = width < height;
}


// pass in absolute values relative to the starting screen size, return scaled values
// based on actual window size
// for now, it just has the canvas resize everthing with it, stretchy style

function getx(xIn){
    if (stretchyScale){
        return xIn * width / startingWidth;
    }else{
        return xIn;
    }
}
function gety(yIn){
    if (stretchyScale){
        return yIn * height / startingHeight;
    }else{
        return yIn;
    }
}
