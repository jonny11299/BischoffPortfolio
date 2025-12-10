

// controls how much this sketch fits on the page.
// so 1 == full page, 0.95 == leave some room for margins.
const SCALE_W = 1;
const SCALE_H = 1;

let font;
let fontSize = 20;

let orbitControlToggle = true;
let stopRender = false;


// consts:



function preload(){
    font = loadFont('../fonts/Roboto_Mono/static/RobotoMono-Regular.ttf');
}

function setup() {
    createCanvas(windowWidth * SCALE_W, windowHeight * SCALE_H, WEBGL);


    scaleConstants();

    textAlign(CENTER, CENTER);
    textFont(font);
}

function draw() {
    if (orbitControlToggle){
        orbitControl(); // lets me move around with the mouse
    }

    background(30, 30, 60);
    // your draw code here
        
    textSize(fontSize);
    textStyle(NORMAL);

    fill(255, 255, 255);
    noStroke();
    let t = 'template.';
    text(t, 0, 0);

    strokeWeight(10);
    stroke(0);

    // rect(50, 50, 50, 50);
    // box(thick * coil_speed, r, 100);

    if (!stopRender){
        drawEmittors();
    }
}



// the meat of it
function drawEmittors(){

}





function scaleConstants(){
    // change based on resize
    // basically sets 1000 to be the default width and re-scales based on new widths
    let defaultWidth = 1000;
    let scale = windowWidth / defaultWidth;
    fontSize = 20 * scale;


}

function windowResized() {
    resizeCanvas(windowWidth * SCALE_W, windowHeight * SCALE_H);
    scaleConstants();
}

function keyReleased(){
    console.log("released key, keyCode: " + key + ', ' + keyCode);
    if (key === 'l'){
        console.log("windowWidth, windowHeight: " + windowWidth + ", " + windowHeight);
        console.log("p width and height: " + width + ", " + height);
    }
    if (key === 'r'){ // or whatever key you want
        camera(); // Resets to default view
    }
    
    // if (key === 'o'){
    //     orbitControlToggle = !orbitControlToggle;
    // }

    if (keyCode === 38){ // arrow up
        
    }else if (keyCode === 40){ // arrow down
        
    }else if (keyCode === 37){ // arrow left
        
    }else if (keyCode === 39){ // arrow right
        
    }

    if (key === 't'){
        
    }else if (key === 'g'){
        
    }

    if (key === 'y'){
        
    }else if (key === 'h'){
        
    }else if (key === 'p'){ // probably pause here
        
    }

    if (keyCode === 190){ // . key, means stop render (especially in a laggy emergency situation)
        stopRender = !stopRender;
    }
}

