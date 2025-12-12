
let font;
let fontSize = 20;

let c;


let numBars = 20;
let randomValue = 50;
let randomSpread = 49;
let values = [];

let leftScroll = 0;
let valueIncrease = 5;

let arrayAlterationFlag = false;
let lostValue = 40;


function preload(){
    font = loadFont('/fonts/Roboto_Mono/static/RobotoMono-Regular.ttf');
}

function setup() {
    c = createCanvas(windowWidth * 0.8, windowHeight);

    c.parent("sketch-container");  // ← forces canvas to be INSIDE the right div
    
    // your setup code here

    textAlign(CENTER, CENTER);
    // loadFont('Courier New');
    textFont(font);

    for (let i = 0 ; i < numBars ; i++){
        values.push(randomValue + Math.random() * randomSpread);
    }
}

function draw() {
    background(30, 30, 60);
    // your draw code here
        
    textSize(fontSize);
    textStyle(NORMAL);

    fill(255, 255, 255);
    noStroke();
    let t = 'Stock App Tour.';
    text(t, width/2, height/2);

    let innerBox = {
        x: width/10,
        y: height/10,
        w: 8 * width/10,
        h: 8 * height/10,
        round: 5
    }

    stroke(255);
    strokeWeight(3);
    fill(30, 30, 60);
    rect(innerBox.x, innerBox.y, innerBox.w, innerBox.h, innerBox.round);

    let padding = 20;

    let maxvalue = 1;
    for (let value of values){
        if (value > maxvalue){
            maxvalue = value;
        }
    }


    // gotta have that extra queued up before we see it, huh?
    let practicalLength = values.length - 5;
    for (let i = 0; i < values.length ; i++){
        // print these bars baybeee
        let w = innerBox.w/practicalLength;
        let x = i * w - leftScroll + innerBox.x;
        let y = innerBox.y + innerBox.h;
        let h = map(values[i], 0, maxvalue, 0, -innerBox.h/2);

        if (x < innerBox.x){
            // time to stack a new one 
            if (x + w <= innerBox.x){
                if (!arrayAlterationFlag) console.log("alter the array.");
                arrayAlterationFlag = true;
            }
            w = constrain(w - (innerBox.x - x), 0, w);
            x = innerBox.x;
        }

        // need to cap that right end
        if (x > innerBox.x + innerBox.w){
            break;
        }
        if (x + w > innerBox.x + innerBox.w){
            // break;
            w = constrain(innerBox.x + innerBox.w - x, 0, w);
        }

        if (i - 1 >= 0){
            if (values[i - 1] < values[i]){
                fill(60, 120, 60);
            }else{
                fill(120, 60, 60);
            }
        }else{
            if (values[i] > lostValue){
                fill(60, 120, 60);
            }else{
                fill(120, 60, 60);
            }
        }
        
        rect(x, y, w, h);
    }

    if (arrayAlterationFlag){
        alterArray();
    }


    // rect(50, 50, 50, 50);
    leftScroll++;
}


function alterArray(){
    randomValue += valueIncrease;
    values.push(randomValue + Math.random() * randomSpread);
    lostValue = values.shift();
    leftScroll = 0;
    arrayAlterationFlag = false;
}


function windowResized() {
    resizeCanvas(windowWidth * 0.8, windowHeight);
    fontSize = 20 * windowWidth/1000;
}

function keyReleased(){
    if (key === 'l'){
        console.log("windowWidth, windowHeight: " + windowWidth + ", " + windowHeight);
        console.log("p width and height: " + width + ", " + height);
    }
}



async function downloadEquations() {
    try {
        const response = await fetch('/embed/polynomial_ensemble_edited.pdf');
        const blob = await response.blob();
        
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'stock polynomial equations.pdf';
        link.click();
        
        // Clean up
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Download failed:', error);
    }
}