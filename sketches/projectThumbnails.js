
// TO DO:
// Capture gifs of every portfolio piece
// give them descriptions, add in here.




let font;
let fontSize = 20;



const Y_SCROLL_LIMIT = 1000000; // How many pixels you can scroll
let yScroll = 0;

let iconBoxes = [];

let topText, yPos, iconScreen, names;
let bottomY = 0;


let pg;
let gifs;



/*
// Track webgl setup
let webglContextCount = 0;
let webglContexts = [];

// Override getContext to track WebGL contexts
(function() {
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, ...args) {
        if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') {
            webglContextCount++;
            console.log(`WebGL context #${webglContextCount} created`);
            console.trace('Created from:'); // Shows stack trace
            
            const context = originalGetContext.call(this, type, ...args);
            webglContexts.push({
                canvas: this,
                context: context,
                created: new Date().toISOString()
            });
            return context;
        }
        return originalGetContext.call(this, type, ...args);
    };
})();
*/




function preload(){
    font = loadFont('/fonts/Roboto_Mono/static/RobotoMono-Regular.ttf');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    // Focus the canvas
    let canvas = document.querySelector('canvas');
    canvas.setAttribute('tabindex', '0'); // Make it focusable
    canvas.focus();


    textAlign(CENTER, CENTER);
    // loadFont('Courier New');
    textFont(font);

    calculateScreen();
}

function draw() {
    background(30, 30, 60);
    // your draw code here
        
    textSize(fontSize);
    textStyle(NORMAL);

    // top text:
    fill(255, 255, 255);
    noStroke();
    text(topText, 0, yPos);


    // draw the icon screen
    stroke(255);
    strokeWeight(4);
    fill(30, 30, 90);
    rect(iconScreen.x, iconScreen.y, iconScreen.w, iconScreen.h);

    // Redraw the buffer:

    pg.clear();

    for (let box of iconBoxes){
        pg.stroke(255);
        pg.strokeWeight(3);
        pg.fill(box.color);
        pg.rect(box.x, box.y, box.w, box.h);


        pg.textSize(fontSize * 2 / 3);
        textStyle(NORMAL);

        // say my name bro
        pg.fill(255, 255, 255);
        pg.noStroke();
        pg.text(box.name, box.x + box.w/2, box.y + box.h/2);

        // gifs better than names
        if (gifs && box.index < gifs.length){
            pg.image(gifs[box.index], box.x, box.y, box.w, box.h);
        }

        // print the briefDescription
        if (box.hovered){
            tooltips(box);
        }
    }

    
    /*
    for (let i = 0 ; i < 100 ; i++){ // draw random multicolored boxes
        pg.fill(Math.random() * 255, Math.random() * 255, Math.random() * 255);
        pg.rect(Math.random() * pg.width, Math.random() * pg.height, 30, 30);
    }*/

/*
    }*/

    // draw icon buffer:
    image(pg, iconScreen.x, iconScreen.y);



    // debugText();

    // rect(50, 50, 50, 50);
    if (frameCount === 1){
        loadGifs();
    }
}


function tooltips(b){
    // need to make a little floating cutie off the side of the iconScreen
    // if y > 0, have it float up, else down
    // i

    // how far off the icon screen it floats

    
    fill(30, 30, 100);
    stroke(255);
    strokeWeight(2);

    let floatOffset = 10;
    let right = mousex() > 0;
    let up = mousey() > 0;

    let w = (width - iconScreen.w)/2 - floatOffset * 2;
    let h = 200; // will have to alter this based on the text!
    let x = right ? iconScreen.x + iconScreen.w + floatOffset : iconScreen.x  - w - floatOffset;
    let y = up ? mousey() - h : mousey();

    rect(x, y, w, h);

}






function loadGifs(){

    let gifLinks = [
        'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHNrOGNzaGVqY2F4bnRudng5bDhsaGVzdnF4a2IyZ3dvamRwampmcSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/RkDSu8RODB7hT44m3K/giphy.gif',
        'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHNrOGNzaGVqY2F4bnRudng5bDhsaGVzdnF4a2IyZ3dvamRwampmcSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Va4S6GgB3aNf95H01F/giphy.gif',
        'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHNrOGNzaGVqY2F4bnRudng5bDhsaGVzdnF4a2IyZ3dvamRwampmcSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/7j3M2gywEp8kmHAX57/giphy.gif',
        'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHNrOGNzaGVqY2F4bnRudng5bDhsaGVzdnF4a2IyZ3dvamRwampmcSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/cmypcc7bsTGi3Ob56E/giphy.gif',
        'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHNrOGNzaGVqY2F4bnRudng5bDhsaGVzdnF4a2IyZ3dvamRwampmcSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/VexBW9OatPSoanilVy/giphy.gif',
        'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHNrOGNzaGVqY2F4bnRudng5bDhsaGVzdnF4a2IyZ3dvamRwampmcSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/RZxbmVRP4Z9ENB983U/giphy.gif',
        'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHNrOGNzaGVqY2F4bnRudng5bDhsaGVzdnF4a2IyZ3dvamRwampmcSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/88Fu8MtnSXI6j3ywN8/giphy.gif',
    ];

    gifs = [];
    for (let link of gifLinks){
        gifs.push(loadImage(link, imageCallback));
        console.log("loaded gif: " + link);
    }
}

function imageCallback(img){
    img.pause();
    document.querySelector('canvas').focus();
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
    // console.log(`Mouse moved to ${mousex()}, ${mousey()}`);

    if (mouseOverElement(iconScreen, false)){
        // console.log("mouse moved over icon screen");
    }else{
        hoveredOffBoxes();
    }
    for (let b of iconBoxes){
        if (mouseOverElement(b, true)){
            // console.log("mouse hovered over " + b.name);
            hoverOverBox(b);
        }
    }
}
function mouseClicked(){

}
// returns true if the mouse's current x, y (in WEBGL mode) are over the inputted element, false otherwise
// requires the element to have an o.x, o.y, o.w, o.h
// otherwise you get a runtime error (fun!)
function mouseOverElement(o, relativeToPG = false){

    let x = mousex();
    let y = mousey();

    if (relativeToPG){
        x -= iconScreen.x;
        y -= iconScreen.y;
        // console.log(`x, y: ${x}, ${y}`);

        if (x < 0 || x > iconScreen.w || y < 0 || y > iconScreen.h) return false;
    }
    
    
    return (x > o.x && x < o.x + o.w && y > o.y && y < o.y + o.h);
    
}

function mouseWheel(event) {
  if (event.delta > 0) {
    // direction = '▲';
    // yScroll++;
  } else {
    // direction = '▼';
    // yScroll--;
  }
  yScroll += event.delta;

  if (yScroll > Y_SCROLL_LIMIT) yScroll = Y_SCROLL_LIMIT;
  if (yScroll < 0) yScroll = 0;

  recalculateIcons();
  // Uncomment to prevent any default behavior.
  return false;
}




function hoverOverBox(box){
    for (let b of iconBoxes){
        if (b === box){
            b.hovered = true;
            if (!b.playingGif){
                b.playingGif = true;
                if (gifs[b.index]){ // start the gif if it's not playing and it's hovered over
                    gifs[b.index].reset();
                    gifs[b.index].play();
                }
            }

        }else{
            b.hovered = false;
            if (b.playingGif){
                if (gifs[b.index]) gifs[b.index].pause();
            }
            b.playingGif = false;
        }
    }
}

function hoveredOffBoxes(){
    for (let b of iconBoxes){

        b.hovered = false;
        if (b.playingGif){
            if (gifs[b.index]) gifs[b.index].pause();
        }
        b.playingGif = false;
    }
}




// ---------------------------- KEY STUFF ----------------------------


function keyReleased(){
    if (key === 'l'){
        console.log("windowWidth, windowHeight: " + windowWidth + ", " + windowHeight);
        console.log("p width and height: " + width + ", " + height);
    }
}









// ---------------------------- CALCULATE POSITIONS BASED ON WINDOW SIZE AND SCROLL ----------------------------



function calculateScreen(){
    topText = "Hover over a project for a quick descripton.\nClick on a project to learn more.";
    yPos = -height / 2 + height / 10;
    // Calculate bottom position
    let lineCount = topText.split('\n').length;
    let lineHeight = textAscent() + textDescent();
    let totalTextHeight = lineHeight * lineCount;
    bottomY = yPos + totalTextHeight + height/20;


    // define the icon screen
    iconScreen = {
        x: -width/2 + width/5,
        y: bottomY,
        w: width - 2*width/5,
        h: 7 * height/9
    }

    // calculate the names and stuff
    names = [
        'robot man',
        'crazy guy',
        'monty',
        'cutie',
        'fan'
    ];

    // buffer for the actual icons
    // got to remove it on resize
    if (pg) pg.remove();
    pg = createGraphics(iconScreen.w, iconScreen.h);
    pg.textAlign(CENTER, CENTER);
    pg.textFont(font);

    //
    recalculateIcons(); // fills in the icons' values based on scroll height
}


function recalculateIcons(){

    let bgcolors = [];
    for (let i = 0 ; i < 100 ; i++){
        bgcolors.push([i * 15, 100 * (i % 3), 100]);
    }

    iconBoxes = [];
    for (let i = 0 ; i < 20 ; i++){
        /*
            okay i know it's jank, but it just does a grid two wide, however many tall, 
            with padding of size 1 for WEBGL mode

        */
       // just need to lock this aspect ratio somehow
       // there, 16:9 aspect ratio
        let w = pg.width / 2;
        let h = w * 9 / 16;
        
        iconBoxes.push({
            name: names[i] ?? 'undefined',
            x: pg.width/2 * (i % 2) + (i % 2),
            y: h * Math.floor(i/2) + Math.floor(i/2) - yScroll,
            w: w,
            h: h,
            index: i,
            color: bgcolors[i] ?? 100,
            hovered: false,
            playingGif: false
        })
    }
}


function windowResized() {
    noLoop();
    resizeCanvas(windowWidth, windowHeight);
    fontSize = 20 * windowWidth/1000;
    calculateScreen();

    document.querySelector('canvas').focus();
    loop();
}




function debugText(){
    textSize(13);
    textStyle(NORMAL);

    fill(255, 255, 255);
    noStroke();
    
    x =  - windowWidth/2 + 150;
    y = - windowHeight/2 + 100;
    debug_text = "yScroll: " + yScroll + "\n";
    debug_text += "mouseX, mouseY: " + mouseX + ", " + mouseY + "\n";
    debug_text += "mousex(), mousey(): " + mousex() + ", " + mousey() + "\n";
    // debug_text += `WebGL contexts: ${webglContextCount}`;
    
    text(debug_text, x, y);

}
