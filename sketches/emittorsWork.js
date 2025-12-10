

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

    camera(1, 1, 800);
}



let theta = Math.PI / 16;
let wave_spread = 0.5;

let thetaStep = 0.01;

function draw() {
    if (orbitControlToggle){
        orbitControl(); // lets me move around with the mouse
    }

    background(30, 30, 60);
    // your draw code here
        
    textSize(fontSize);
    textStyle(NORMAL);

    fill(0);
    noStroke();


    let r = 70
    circle(0, 0, r*2);


    let l = r + 20;
    strokeWeight(3);
    stroke(255, 0, 0);

    // line(0, 0, l * cos(theta), l * sin(theta));

    let t = Math.PI / 8;
    let theta_t = ((theta + 2 * Math.PI - t) % (2 * t)) + t;
    stroke(0, 0, 255);
    line(0, 0, (l - 10) * cos(theta_t), (l - 10) * sin(theta_t)); // tracks to make sure t is printed correctly
    // line(0, 0, 40, 40); // notice how WEB.GL quadrants are setup, (1, 1) is down right.

    let fTotal = 100;
    let fCenter = (1 - wave_spread) * fTotal;
    let fSide = fTotal - fCenter;

    // print the force total
    stroke(255, 0, 0);
    line(0, 0, fTotal * cos(theta), fTotal * sin(theta));

    // these plus fCenter should add up to fTotal
    let fSideLeft = fSide * map(theta_t, t, 3*t, 0, 1);
    let fSideRight = fSide * map(theta_t, t, 3*t, 1, 0);

    if (frameCount % 100 === 0){
        console.log("fTotal, fCenter, fSideLeft, fSideRight: " + fTotal + ", " + fCenter + ", " + fSideLeft + ", " + fSideRight);
    }

    // theta needs to snap to the nearest of the 8 directions it could point towards
    let theta_diff = theta % (2 * t);
    let thetaCenter;
    if (theta_diff <= t){ // snap right
        thetaCenter = theta - theta_diff;
    }else{ // snap left
        thetaCenter = theta + (2 * t - theta_diff);
    }
    
    let thetaLeft = thetaCenter + 2 * t;
    let thetaRight = thetaCenter - 2 * t;
    

    // from left to right, let's go yellowish green, hard green, blueish green

    // left (yellow)
    stroke(255, 255, 0);
    line(0, 0, fSideLeft * cos(thetaLeft), fSideLeft * sin(thetaLeft));

    // center (green)
    stroke (0, 255, 0);
    line(0, 0, fCenter * cos(thetaCenter), fCenter * sin(thetaCenter));

    // right (blue-green)
    stroke (0, 255, 255);
    line(0, 0, fSideRight * cos(thetaRight), fSideRight * sin(thetaRight));
    


    // let's see where those cells are.
    /*
    let cellLeft = map((thetaLeft % (2 * Math.PI)) / 8, 0, 2 * Math.PI, 0, 8 * 8);
    let cellCenter = map((thetaCenter % (2 * Math.PI)) / 8, 0, 2 * Math.PI, 0, 8 * 8);
    let cellRight = map((thetaRight % (2 * Math.PI)) / 8, 0, 2 * Math.PI, 0, 8 * 8);
    */

    let cellLeft = [thetaToNeighbor(thetaLeft).xOffset, thetaToNeighbor(thetaLeft).yOffset];
    let cellCenter = [thetaToNeighbor(thetaCenter).xOffset, thetaToNeighbor(thetaCenter).yOffset];
    let cellRight = [thetaToNeighbor(thetaRight).xOffset, thetaToNeighbor(thetaRight).yOffset];


    if (frameCount % 100 === 0){
        console.log("l, c, r: " + cellLeft[0] + "|" + cellLeft[1] + ", " + cellCenter[0] + "|" + cellCenter[1] + ", " + cellRight[0] + "|" + cellRight[1]);

    }




    strokeWeight(10);
    stroke(0);

    // rect(50, 50, 50, 50);
    // box(thick * coil_speed, r, 100);

    if (!stopRender){
        drawEmittors();
    }

    theta += thetaStep;
}



function thetaToNeighbor(theta){

    let a = (theta + Math.PI * 2) % (Math.PI * 2); // get that negative into the unit circle
    let t = Math.PI / 8;
    

    let x = 0;
    let y = 0;

    if (a < t){
        x = 1;
        y = 0;
    }else if (a < 3 * t){
        x = 1;
        y = -1;
    }else if (a < 5 * t){
        x = 0;
        y = -1;
    }else if (a < 7 * t){
        x = -1;
        y = -1;
    }else if (a < 9 * t){
        x = -1;
        y = 0;
    }else if (a < 11 * t){
        x = -1;
        y = 1;
    }else if (a < 13 * t){
        x = 0;
        y = 1;
    }else if (a < 15 * t){
        x = 1;
        y = 1;
    }else if (a < 17 * t){ // back to center
        x = 1;
        y = 0;
    }

    return {
        xOffset: x,
        yOffset: y
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
        wave_spread -= 0.05;
    }else if (keyCode === 40){ // arrow down
        wave_spread += 0.05;
        
    }else if (keyCode === 37){ // arrow left
        thetaStep += 0.01;
        
    }else if (keyCode === 39){ // arrow right
        thetaStep -= 0.01;
        
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

