
let font;
let fontSize = 20;

function preload(){
    font = loadFont('/fonts/Roboto_Mono/static/RobotoMono-Regular.ttf');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    // your setup code here

    textAlign(CENTER, CENTER);
    // loadFont('Courier New');
    textFont(font);
}

function draw() {
    background(30, 30, 60);
    // your draw code here
        
    textSize(fontSize);
    textStyle(NORMAL);

    fill(255, 255, 255);
    noStroke();
    let t = 'ideas.';
    text(t, 0, 0);

    // rect(50, 50, 50, 50);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    fontSize = 20 * windowWidth/1000;
}

function keyReleased(){
    if (key === 'l'){
        console.log("windowWidth, windowHeight: " + windowWidth + ", " + windowHeight);
        console.log("p width and height: " + width + ", " + height);
    }
}