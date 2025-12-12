
let font;
let fontSize = 20;

let t;
let twidth;



// construct a circle around the mouse, else middle
const everyNFrames = 5;
let circleArray = [];
let maxCircles = 50;
let randomDistance = 10;

let circleRadius = 10;
let moveStrength = 10;
let minMoveStrength = 1;
let moveConst = 0.4;
let maxRadius = 100;

let weightDivider = 20;

let latestMouseX = 0;
let latestMouseY = 0;
let lastMouseX = -1;
let lastMouseY = -1;


function preload(){
    font = loadFont('/fonts/Roboto_Mono/static/RobotoMono-Regular.ttf');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    // your setup code here

    recalcConsts();
}

function draw() {
    background(30, 30, 60);
    // your draw code here


    drawCircles();


    let padding = 25;
    let round = 5;
    stroke(255);
    strokeWeight(3);
    fill(30, 30, 60, 210);
    // got to finish this 
    textSize(fontSize);
    textStyle(NORMAL);
    let h = textSize() * t.split('\n').length * 1.4;
    // if (frameCount % 10 === 0) console.log(t.split('\n').length);
    rect(-twidth/2 - padding, 0 - h/2, twidth, h)
        

    fill(255, 255, 255);
    noStroke();
    text(t, - twidth / 2, 0);

    // rect(50, 50, 50, 50);
    defineCircles();
}


// ---------------------------- MOUSE STUFF ----------------------------

// returns webgl coordinates
function mousex(){
    return mouseX - width / 2;
}
function mousey(){
    return mouseY - height / 2;
}

function mouseMoved(){
    lastMouseX = latestMouseX;
    lastMouseY = latestMouseY;
    latestMouseX = mousex();
    latestMouseY = mousey();
    moveStrength = sqrt(sq(lastMouseX - latestMouseX) + sq(lastMouseY - latestMouseY));
}



function drawCircles(){
    if (circleArray){
        // draw lines
        for (let i = 0 ; i < circleArray.length - 1 ; i++){
            for (let i2 = i + 1 ; i2 < circleArray.length && i2 < i + 4; i2++){
                strokeWeight(circleArray[i].r / weightDivider);
                stroke(circleArray[i].color);
                line(circleArray[i].x, circleArray[i].y, circleArray[i].z, circleArray[i2].x, circleArray[i2].y,  circleArray[i2].z);
            }
        }
        
        // draw circles
        for (let c of circleArray){
            push();
            strokeWeight(3);
            stroke(128, 128, 128, c.alpha);
            fill(c.color);
            translate(c.x, c.y, c.z);
            sphere(c.r);
            pop();
        }

    }
}




function defineCircles(){
    let mx = latestMouseX;
    let my = latestMouseY;
    if (frameCount % everyNFrames === 0){
        let alpha = 100;

        circleArray.push({
            x: mx + (Math.random() - 0.5) * randomDistance,
            y: my + (Math.random() - 0.5) * randomDistance,
            z: - Math.random() * 1000 + 100,
            r: constrain(minMoveStrength + moveConst * moveStrength * circleRadius, 10, maxRadius),
            color: [Math.random() * 255, Math.random() * 255, Math.random() * 255, alpha],
            alpha: alpha
        })
    }

    if (circleArray.length > maxCircles) resetCircles();
}

function resetCircles(){
    circleArray = [];
}



function recalcConsts(){
    document.querySelector('canvas').focus();
    fontSize = 14 * windowWidth/1000;

    textAlign(LEFT, CENTER);
    // loadFont('Courier New');
    textFont(font);

    textSize(fontSize);
    textStyle(NORMAL);

    t = "";

    t = "These sketches demonstrate the following skillsets:\n";
    t += "- Website layout and design\n";
    t += "- Live rendering\n";
    t += "- Audio-visual processing \n";
    t += "- Data parsing and processing (Python)\n";
    t += "- User-focused engagement.\n";

    t += "This website was built using HTML, JavaScript, and p5.js (a JavaScript rendering engine.)\n";
    t += "Some portfolio projects are built using Python in tandem with the Pandas library.\n\n";

    t += "\n";
    t += "This website is statically hosted. You are not being tracked.\n";
    t += "Someday I may update this site to anonymously track user engagement patterns.\n\n";

    t += "Feel free to click the center button \"How was I created?\" to understand the technology\n behind each webpage.\n";

    twidth = textWidth(t) * 1.1;

    resetCircles();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    fontSize = 14 * windowWidth/1000;

    recalcConsts();
}

function keyReleased(){
    if (key === 'l'){
        console.log("windowWidth, windowHeight: " + windowWidth + ", " + windowHeight);
        console.log("p width and height: " + width + ", " + height);
    }
}