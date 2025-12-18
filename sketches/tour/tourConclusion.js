
let font;
let fontSize = 20;

let t;
let twidth;



// construct a circle around the mouse, else middle
const Y_ROTATION_SPEED = - 1/(Math.PI * 2) * 0.03;
const everyNFrames = 5;
let circleArray = [];
let maxCircles = 50;
let randomDistance = 10;

let circleRadius = 10;
let moveStrength = 0.01;
const MOVE_STRENGTH_MULTIPLIER = 0.5;
let vx = 0;
let vy = 0;
const V_MULTIPLIER = 0.08;
const V_LIMIT = 5;
let minMoveStrength = 1;
let moveConst = 0.4;
let maxRadius = 100;

let weightDivider = 20;

let latestMouseX = 0;
let latestMouseY = 0;
let lastMouseX = -1;
let lastMouseY = -1;

let mouseHasMoved = false;


let dims;
let textWindowColor = [30, 30, 60, 210];



function preload(){
    font = loadFont('/fonts/Roboto_Mono/static/RobotoMono-Regular.ttf');
}

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    // your setup code here
    canvas.elt.tabIndex = 1;  // Makes it focusable
    canvas.elt.focus();        // Actually focuses it
    canvas.elt.addEventListener('click', () => { // focuses on-click
        canvas.elt.focus();
    });

    recalcConsts();
}

function draw() {
    background(30, 30, 60);
    // your draw code here


    drawCircles();


    stroke(255);
    strokeWeight(3);
    fill(textWindowColor);
    // got to finish this 
    textSize(fontSize);
    textStyle(NORMAL);
    let h = textSize() * t.split('\n').length * 1.4;
    // if (frameCount % 10 === 0) console.log(t.split('\n').length);

    // print rect:
    if(mouseInDims()){
        textWindowColor = [60, 60, 150, 210];
    }else{
        textWindowColor = [30, 30, 60, 210];
    }


    rect(dims.x, dims.y, dims.w, dims.h);
        

    fill(255, 255, 255);
    noStroke();
    text(t, - twidth / 2, 0);

    // rect(50, 50, 50, 50);
    if (mouseHasMoved) defineCircles();
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
    mouseHasMoved = true;
    lastMouseX = latestMouseX;
    lastMouseY = latestMouseY;
    latestMouseX = mousex();
    latestMouseY = mousey();
    moveStrength = MOVE_STRENGTH_MULTIPLIER * sqrt(sq(lastMouseX - latestMouseX) + sq(lastMouseY - latestMouseY));
    vx = V_MULTIPLIER * (latestMouseX - lastMouseX);
    vy = V_MULTIPLIER * (latestMouseY - lastMouseY);
    if (Math.abs(vx) > V_LIMIT) vx = 0;
    if (Math.abs(vy) > V_LIMIT) vy = 0;
    // console.log(`vx, vy: ${vx}, ${vy}`);
}



function drawCircles(){
    if (circleArray){
        // update pos
        for (let c of circleArray){
            c.x += c.vx;
            c.y += c.vy;
        }
        // draw lines
        for (let i = 0 ; i < circleArray.length - 1 ; i++){
            for (let i2 = i + 1 ; i2 < circleArray.length && i2 < i + 4; i2++){
                // rotateY(frameCount * Y_ROTATION_SPEED)
                strokeWeight(circleArray[i].r / weightDivider);
                stroke(circleArray[i].color);
                line(circleArray[i].x, circleArray[i].y, circleArray[i].z, circleArray[i2].x, circleArray[i2].y,  circleArray[i2].z);
            }
        }
        
        // draw circles
        for (let c of circleArray){
            push();
            strokeWeight(1);
            stroke(255, 255, 255, c.alpha);
            fill(c.color);
            translate(c.x, c.y, c.z);
            rotateY(frameCount * Y_ROTATION_SPEED);
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
            alpha: alpha,
            vx: vx,
            vy: vy
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

    t = "Thus concludes my portfolio tour.\n\n";
    t += "You may click this window to contact me.\n\n";
    t += "Future iterations of the portfolio will incorporate more nature-themed animations,\nand more of these projects will be 100% complete.\n\n";
    t += "I would also like to implement seamless background music between slides.\n\n"
    
    t += "Thanks!\n";
    
    twidth = textWidth(t) * 1.1;


    let padding = 25;
    let round = 5;
    strokeWeight(3);
    fill(textWindowColor);
    // got to finish this 
    textSize(fontSize);
    textStyle(NORMAL);
    let h = textSize() * t.split('\n').length * 1.4;
    dims = {
        x: -twidth/2 - padding,
        y: - h/2,
        w: twidth,
        h: h
    }

    resetCircles();
}

function mouseInDims(){
    let mx = mouseX - width/2;
    let my = mouseY - height/2;

    return mx > dims.x && mx < dims.x + dims.w && my > dims.y && my < dims.y + dims.h;
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

function mouseReleased(){
    if (mouseInDims()){
        let link = document.createElement('a');
        link.href = 'https://docs.google.com/forms/d/e/1FAIpQLSdwAbaJEbhGDEP0X3JiQlthuCF5TYWEn2JEjKJSLuQHrTRZyA/viewform?usp=dialog';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.click();
    }
}