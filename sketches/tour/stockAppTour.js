
let font;
let fontSize = 20;

let c;


const STARTING_VALUE = 50;
let numBars = 20;
let randomValue = STARTING_VALUE;
let randomSpread = STARTING_VALUE - 1;
let values = [];

let leftScroll = 0;
let valueIncrease = 0.5;

let arrayAlterationFlag = false;
let lostValue = 40;

let oldMaxValue = 0;

let rollingWindowHeight;
let newStockValue;


let innerBox;


let latestEventText;
let latestEventTime;


// how much money you have
const STARTING_WALLET = 1000;
let wallet = STARTING_WALLET;
let portfolio = 0;
let numShares = 0;



function preload(){
    font = loadFont('/fonts/Roboto_Mono/static/RobotoMono-Regular.ttf');
}

function setup() {
    c = createCanvas(windowWidth * 0.8, windowHeight);

    c.parent("sketch-container");  // ← forces canvas to be INSIDE the right div
    
    // your setup code here

    fontSize = 11 * windowWidth/1000;
    textAlign(CENTER, CENTER);
    // loadFont('Courier New');
    textFont(font);

    for (let i = 0 ; i < numBars ; i++){
        values.push(randomValue + Math.random() * randomSpread);
    }

    let value = getMaxValue();
    rollingWindowHeight = value;
    newStockValue = value;


    innerBox = {
        x: width/10,
        y: 3 * height/10,
        w: 7 * width/10,
        h: 6 * height/10,
        round: 5
    }

}

function getMaxValue(){
    let maxvalue = 1;
    for (let value of values){
        if (value > maxvalue){
            maxvalue = value;
        }
    }
    // if (oldMaxValue === 0) oldMaxValue = maxvalue;
    oldMaxValue = maxvalue;

    return maxvalue;
}

function draw() {
    background(30, 30, 60);
    // your draw code here
        
    textSize(fontSize);
    textStyle(NORMAL);
    textAlign(CENTER, CENTER);

    fill(255, 255, 255);
    noStroke();
    let t = 'Stock App Tour.';
    text(t, width/2, height/2);

    

    stroke(255);
    strokeWeight(3);
    fill(30, 30, 60);
    rect(innerBox.x, innerBox.y, innerBox.w, innerBox.h, innerBox.round);

    let padding = 20;

    let maxvalue = getMaxValue();
    if (maxvalue > rollingWindowHeight) rollingWindowHeight += 0.2 * (randomValue / STARTING_VALUE);


    let maxHeight = rollingWindowHeight;
    // shoot dude I need to make the height adjustment just like... rise slowly
    // maybe approach maxValue


    // gotta have that extra queued up before we see it, huh?
    textAlign(LEFT, CENTER);

    let practicalLength = values.length - 5;
    for (let i = 0; i < values.length ; i++){
        // print these bars baybeee
        let w = innerBox.w/practicalLength;
        let x = i * w - leftScroll + innerBox.x;
        let y = innerBox.y + innerBox.h;
        let h = map(values[i], 0, maxHeight, 0, -2 * innerBox.h/3);

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
            // this is our newRightValue;
            w = constrain(innerBox.x + innerBox.w - x, 0, w);

            // need to give this a price
            newStockValue = Number((values[i]).toFixed(2));
            // print new right value at the far right;
            // text
            stroke(255);
            strokeWeight(3);
            let l = 20;
            let tempx = innerBox.x + innerBox.w;
            line(tempx, y + h, tempx + l, y + h);

            noStroke();
            fill(255);
            let myText = `\$${newStockValue}`;
            // textAlign(LEFT, CENTER);
            text(myText, tempx + l + 10, y + h);
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
        
        stroke(255);
        strokeWeight(3)
        rect(x, y, w, h);

        // line(innerBox.x + innerBox.w, )
    }

    if (arrayAlterationFlag){
        alterArray();
    }

    // let's get some buy/sell action:
    
    let buttonw = 80;
    let buttonh = 40;
    let distance = height/5;

    let buyButton = {
        x: innerBox.x,
        y: innerBox.y - distance,
        w: buttonw,
        h: buttonh,
        text: "Buy"
    }
    let sellButton = {
        x: innerBox.x,
        y: innerBox.y - 2 * distance,
        w: buttonw,
        h: buttonh,
        text: "Sell"
    }

    // rect
    /*
    fill(50, 50, 100);
    rect(buyButton.x, buyButton.y, buyButton.w, buyButton.h, 5);
    rect(sellButton.x, sellButton.y, sellButton.w, sellButton.h, 5);

    // text
    noStroke();
    fill(255);
    */
    noStroke();
    fill(255);
    text("Press 'b' to buy,\nand 's' to sell.", buyButton.x, buyButton.y);

    fill (255, 255, 0);

    text(latestEventText, buyButton.x, buyButton.y + distance/2);


    // print wallet
    fill(255);
    portfolio = numShares * newStockValue;
    let walletText = getWalletText();
    text(walletText, buyButton.x + innerBox.w/2, buyButton.y + distance/5);
    


    // rect(50, 50, 50, 50);
    leftScroll++;
}


function alterArray(){
    randomValue += valueIncrease;
    randomSpread = 49 * randomValue / 50;
    values.push(randomValue + Math.random() * randomSpread);
    lostValue = values.shift();
    leftScroll = 0;
    arrayAlterationFlag = false;
}


function windowResized() {
    resizeCanvas(windowWidth * 0.8, windowHeight);
    fontSize = 11 * windowWidth/1000;


    innerBox = {
        x: width/10,
        y: 3 * height/10,
        w: 7 * width/10,
        h: 6 * height/10,
        round: 5
    }
}

function keyReleased(){
    if (key === 'l'){
        console.log("windowWidth, windowHeight: " + windowWidth + ", " + windowHeight);
        console.log("p width and height: " + width + ", " + height);
    }


    if (key === 'b'){
        buy();
    }else if (key === 's'){
        sell();
    }
}


function buy(){
    if (wallet >= newStockValue){
        latestEventText = `Bought stock at \$${newStockValue}`;
        latestEventTime = Date.now();
        numShares++;
        wallet -= newStockValue;

    }else{
        latestEventText = `Not enough funds!`;
    }
}

function sell(){
    if(numShares > 0){
        latestEventText = `Sold stock at \$${newStockValue}`;
        latestEventTime = Date.now();
        numShares--;
        wallet += newStockValue;
    }else{
        latestEventText = `No stocks to sell!`;
    }
}

function getWalletText(){
    let profit = Number(wallet - STARTING_WALLET + portfolio).toFixed(2);
    let percent = Number(profit/STARTING_WALLET * 100).toFixed(2);
    let percentString = Number(percent) < 0 ? `-%${Math.abs(percent)}` : `%${percent}`;

    let walletToString = Number(wallet).toFixed(2);
    let portfolioToString = Number(portfolio).toFixed(2);

    
    return `Wallet: \$${walletToString}\nPortfolio: \$${portfolioToString}\nShares owned: ${numShares}\nProfit: \$${profit}\nPercent Growth: ${percentString}`;
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