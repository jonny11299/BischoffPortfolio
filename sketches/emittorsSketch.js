

// controls how much this sketch fits on the page.
// so 1 == full page, 0.95 == leave some room for margins.
const SCALE_W = 1;
const SCALE_H = 1;

let font;
let fontSize = 20;

let orbitControlToggle = true;
let stopRender = false;


// consts:
const CELL_SIZE = 10;
let cell_size = CELL_SIZE;

const NUM_CELLS_X = 60;
const NUM_CELLS_Y = 60;
let num_cells_x = NUM_CELLS_X;
let num_cells_y = NUM_CELLS_Y;


// top left point of the grid
let cellsTopLeft = {
    x: -300,
    y: -300
};


const CELL_STROKE = 0;
const CELL_STROKE_WEIGHT = 2;


// cells is a single-dimensional array, but it technically stores a 2d array.
// Just easier when they're all in one bucket...
// You can find (column, row) via "row * numCellsX + column"
let cells;
let arrowTraversalMode = false; // flips it to only update via left-right arrows
let arrowFrame = 0; // counts the number of times we do this.

// force per vector from the emission
// (we emit in 8 directions, so total force is this * 8);
let emissionForce = 1;
// how much of that total force to move from me to the next guy (not yet implemented);
let forceTransfer = 1;
function emittorChance(){
    return Math.random() * 120 <= 1;
}




const WAVE_DECAY = 1.1; // at 1, no energy is lost. Tricky because emmitors are always giving energy.
let wave_decay = WAVE_DECAY;
const WAVE_SPREAD = 0.3; // range from 0 - 1, determines how much the momentup spreads diagonally.
let wave_spread = WAVE_SPREAD;
const COLOR_DECAY = 4;
let color_decay = COLOR_DECAY;

// vector spreads out in direction, +/- 45 degrees.
// By default, it gives equal amount of force to (same direction) as (sum diagonals)
// because it's a square grid, we just need to calculate one vector --> three vectors, not continuous.


let maxForce = 0;

// each cell 
class Cell{
    constructor(x, y, config){
        this.x = x;
        this.y = y;

        this.on = false;

        this.r = 0;
        this.g = 0;
        this.b = 0;
        // base color is full red, green, or blue
        let temp = Math.floor(Math.random() * 3);
        this.baseColor = [0, 0, 0];
        if (temp === 0){
            this.baseColor = [255, 0, 0];
        }else if (temp === 1){
            this.baseColor = [0, 255, 0];
        }else{
            this.baseColor = [0, 0, 255];
        }


        this.n = config.n ?? -1;

        // force vector that may be traveling through us:
        this.f = {
            x: 0,
            y: 0
        };

        this.isEmittor = config.isEmittor ?? false;
        this.period = config.period ?? 5000 // time in milliseconds it emits, irrelevent if non-emittor
        this.lastEmitted = Date.now() - config.period / 2;

        this.initColor();
    }


    initColor(){
        //this.c = [90 + 30 * Math.random(), 120 + 30 * Math.random(),  120 + 30 * Math.random()];
        this.c = [0, 0, 0];
        if (this.isEmittor) this.c = this.baseColor;
    }

    print(){
        stroke(CELL_STROKE);
        strokeWeight(CELL_STROKE_WEIGHT);
        // fill(this.r, this.g, this.b); // purely color-based
        // fill(this.mag() * 255); // purely force-based
        let m = this.mag();
        fill(m * this.r, m * this.g, m * this.b); // mixture of color and magnitude based

        // change color if emitting
        if (this.isEmittor){
            /* The below implements the actual emission itself. We've moved this to isEmitting(), 
            //      which is called from getNextCells.
            if (this.lastEmitted + this.period <= Date.now()){
                // find a color between emittor color emitting and neutral
                this.lastEmitted = Date.now();
            }
                */

            let timeSinceEmission = Date.now() - this.lastEmitted;
            // smaller values are closer to emission color
            // larger values are further
            // timeSinceEmission ranges [0, this.period]

            // maps from baseColor to black.
            let c = {
                r: map(timeSinceEmission, 0, this.period, this.baseColor[0], 0),
                g: map(timeSinceEmission, 0, this.period, this.baseColor[1], 0),
                b: map(timeSinceEmission, 0, this.period, this.baseColor[2], 0)
            }

            fill(c.r, c.g, c.b);
        }else{
            // this.c = [30, 128 + 128 * this.f.x, 128 + 128 * this.f.y];
            // should just use my actual color, which is already set by the fill(this.c) above this if/then.
        }

        rect(this.x, this.y, cell_size, cell_size);

        // below code were used for debugging forces, position, etc.

        // print a red line towards the force
        // if (this.mag() > 0){
        //    let x = this.x + cell_size / 2;
        //    let y = this.y + cell_size / 2;
        //    stroke(255, 0, 0);
            // line(x, y, x + this.mag() * cell_size * cos(this.theta()), y + this.mag() * cell_size * sin(this.theta()))
        //    stroke(0, 0, 0);

        // }

        /*
        fill(255); 
        noStroke();
        textSize(8);
        text(this.n, this.x, this.y); // it does appear that they are printed from the top left to the bottom right
        */
    }

    // checked from getNextCells
    isEmitting(){
        if (this.lastEmitted + this.period <= Date.now()){
            // we shoudl emit.
            this.lastEmitted = Date.now();
            return true;
        }else{
            return false;
        }
        // return Date.now() - this.lastEmitted >= this.period;
    }


    // magnitude of the force vector
    mag(){
        return sqrt(sq(this.f.x) + sq(this.f.y));
    }
    // angle of the force vector
    theta(){
        return atan2(this.f.y, this.f.x);
    }
}





// On return...
// I will have to do the force calculations.
// That will be fun. I hope to see their colors transfer and stuff.
// Following that, I'll need to wire in a way for the mouse to cause a temporary emission,
// without fully making a cell an emittor. Maybe I add some quick, like,
// get the x/y of the mouse --> index of cell, check if it is emission time, then go for it?
// could involve copy+pasting over some emission code. But that's fine to have just one duplicate I suppose.
// Would be interesting for a rotating color of the mouse. Like, it goes thru the color wheel.

// ^ That message is from earlier.
// What really needs to be done now
// is create some new array to store the new forces, and then just update the old one at the end.
// if making a deep copy of an object in JS is complicated, then shit, let's just do a workaround.

function getNextCells(){
    
    // I guess having simple 'copy constructors' is something of OOP-based languages, and
    // Javascript is more of a 'prototype-based' language with OOP shelled on top.
    // So I have to create a new force array and then assign the forces at the end 
    // using parallel arrays for memory efficiency
    let newForces_x = new Array(cells.length);
    let newForces_y = new Array(cells.length);

    let newColor_r = new Array(cells.length);
    let newColor_g = new Array(cells.length);
    let newColor_b = new Array(cells.length);

    for (let i = 0 ; i < cells.length ; i++){
        newForces_x[i] = 0;
        newForces_y[i] = 0;

        newColor_r[i] = 0;
        newColor_g[i] = 0;
        newColor_b[i] = 0;
    }
    



    // step 1:
    // get all the forces moving.

    // step 2:
    // calculate the emittor stuff.

    for (let cIndex = 0 ; cIndex < cells.length ; cIndex++){
        let c = cells[cIndex];
        if (c.isEmittor){
            // emmitor calculations
            if (c.isEmitting()){
                // Calculate that circular force!

                // get our neighbors
                for (let i = 0 ; i < 9 ; i++){
                    let x = Math.floor(i % 3 - 1);
                    let y = Math.floor(i/3 - 1);

                    // we skip i === 4... that's (0, 0);
                    if (i !== 4){
                        let f = emissionForce;
                        let theta = atan2(-y, x);
                        // forceTransmission will be wired here... this will be important
                        // newCellIndex = cellIndex + y * cell_size_x + x
                        let newCellIndex = indexOffset(cIndex, x, y);
                        if (newCellIndex != -1){
                            // we're on the board, so put that force down.
                            // assigning instead of adding because emittor wipes out whatever's happening there
                            newForces_x[newCellIndex] += f * cos(theta);
                            newForces_y[newCellIndex] += f * sin(theta);
                            // if (frameCount % 100 === 0 ){
                                // console.log("f, theta, x, y: " + f + ", " + theta + ", " + x + ", " + y);
                            // }
                            newColor_r[newCellIndex] += c.baseColor[0];
                            newColor_g[newCellIndex] += c.baseColor[1];
                            newColor_b[newCellIndex] += c.baseColor[2];

                        }else{
                            // shoot we're off the board, fam. Maybe we can reflect the force? Idk.
                            // Would probably just be some quick theta calculation and other stuff.
                        }
                    }
                }
            }else{
                // not really much to do here, maybe change color? 
                // this is for an emittor that's not emitting.
                // If we do nothing, we'll make it absorptive of forces. But we can
                // allow for forces to pass through an emmitor if we want.
            }
        }else{
            // move that force!
            let totalForce = wave_decay * c.mag();

            if (totalForce > 0){
                // return {
                //     theta_left: thetaLeft,
                //     theta_center: thetaCenter,
                //     theta_right: thetaRight,
                //     force_left: fSideLeft,
                //     force_center: fCenter,
                //     force_right: fSideRight
                // }

                let f = getForces(totalForce, c.theta());
                
                // looks like a garble but really says, hey, shift the x/y coordinates based on theta and that's your new cell
                let l_to_n = thetaToNeighbor(f.theta_left);
                let c_to_n = thetaToNeighbor(f.theta_center);
                let r_to_n = thetaToNeighbor(f.theta_right);

                let cellLeft = indexOffset(cIndex, l_to_n.x, l_to_n.y);
                let cellCenter = indexOffset(cIndex, c_to_n.x, c_to_n.y);
                let cellRight = indexOffset(cIndex, r_to_n.x, r_to_n.y);
                
                // console.log("Cell, cellLeft, cellCenter, cellRight: " + ...)


                // assign forces, remove from myself
                let ftemp, thetatemp, cell, lx, ly;

                // also going to do the color transfer here...
                let lr, lg, lb;

                for (let i = 0 ; i < 3 ; i++){
                    // giving the temp variables the correct force, angle, and index
                    if (i === 0){
                        ftemp = f.force_left;
                        thetatemp = f.theta_left;
                        cell = cellLeft;
                    }else if (i === 1){
                        ftemp = f.force_center;
                        thetatemp = f.theta_center;
                        cell = cellCenter;
                    }else if (i === 2){
                        ftemp = f.force_right;
                        thetatemp = f.theta_right;
                        cell = cellRight
                    }else{
                        console.log("Error in this force assigning route");
                    }

                    if (ftemp > maxForce){
                        maxForce = ftemp;
                    }

                    // assign, so long as we're not off the board
                    if (cell !== -1){
                        lx = ftemp * cos(thetatemp);
                        ly = ftemp * sin(thetatemp);

                        newForces_x[cell] += lx;
                        newForces_y[cell] += ly;
                        // newForces_x[cIndex] -= lx;
                        // newForces_y[cIndex] -= ly;

                        // the amount of force I give you, that's the amount of color you get.
                        // amount of color transfer is scaled by emissionForce
                        // so if the force is as strong as emissionForce, it's an entire color transfer
                        lr = constrain(cells[cIndex].r, 0, 255);
                        lg = constrain(cells[cIndex].g, 0, 255);
                        lb = constrain(cells[cIndex].b, 0, 255);



                        // let colorScaleAmount = map(ftemp, 0, emissionForce, 0, 255);
                        newColor_r[cell] += lr * color_decay * ftemp;
                        newColor_g[cell] += lg * color_decay * ftemp;
                        newColor_b[cell] += lb * color_decay * ftemp;

                        // newColor_r[cIndex] -= ftemp * lr;
                        // newColor_g[cIndex] -= ftemp * lg;
                        // newColor_b[cIndex] -= ftemp * lb;
                    }
                }
                
            }
        }
    }

    // now we have to go through the newForces array and assign to cells
    for (let i = 0 ; i < cells.length ; i++){
        cells[i].f.x = newForces_x[i];
        cells[i].f.y = newForces_y[i];

        cells[i].r = newColor_r[i];
        cells[i].g = newColor_g[i];
        cells[i].b = newColor_b[i];

    }
    
    
}



// all this math was worked out in "emittorsWork.js" and then transferred here.
// f_total will scale the force
function getForces(f_total, f_angle){
    let theta = f_angle;
    let t = Math.PI / 8;
    let theta_t = ((theta + 2 * Math.PI - t) % (2 * t)) + t;
    //stroke(0, 0, 255);
    //line(0, 0, (l - 10) * cos(theta_t), - (l - 10) * sin(theta_t)); // tracks to make sure t is printed correctly
    // line(0, 0, 40, 40); // notice how WEB.GL quadrants are setup, (1, 1) is down right.

    let fTotal = f_total;
    let fCenter = (1 - wave_spread) * fTotal;
    let fSide = fTotal - fCenter;

    // print the force total
    //stroke(255, 0, 0);
    //line(0, 0, fTotal * cos(theta), - fTotal * sin(theta));

    // these plus fCenter should add up to fTotal
    let fSideLeft = fSide * map(theta_t, t, 3*t, 0, 1);
    let fSideRight = fSide * map(theta_t, t, 3*t, 1, 0);

    // if (frameCount % 100 === 0){
    //     console.log("fTotal, fCenter, fSideLeft, fSideRight: " + fTotal + ", " + fCenter + ", " + fSideLeft + ", " + fSideRight);
    // }

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


    return {
        theta_left: thetaLeft,
        theta_center: thetaCenter,
        theta_right: thetaRight,
        force_left: fSideLeft,
        force_center: fCenter,
        force_right: fSideRight
    }
}



function thetaToNeighbor(theta){
    let a = (theta + Math.PI * 2) % (Math.PI * 2);
    let t = Math.PI / 4;  // 45 degrees
    
    // Round to nearest direction (0-7)
    let dir = Math.round((a + t/2) / t) % 8;
    
    // Directions: E, NE, N, NW, W, SW, S, SE
    const directions = [
        {x: 1, y: 0},    // E:  0°
        {x: 1, y: -1},   // NE: 45°
        {x: 0, y: -1},   // N:  90°
        {x: -1, y: -1},  // NW: 135°
        {x: -1, y: 0},   // W:  180°
        {x: -1, y: 1},   // SW: 225°
        {x: 0, y: 1},    // S:  270°
        {x: 1, y: 1}     // SE: 315°
    ];

    // let d = directions[dir];
    // console.log("d === " + d);
    
    return directions[dir];
}


function indexOffset(i, x, y){
    let j = i + y * num_cells_x + x;
    if (j >= 0 && j < cells.length){
        return j;
    }else{
        return -1;
    }
}



// simple functions for the WEBGL mouse x and y, i.e. translating (0, 0) from topleft to center.
function mousex(){
    return mouseX - width/2;
}
function mousey(){
    return mouseY - height/2;
}

function mouseMoved(){
    /*
    let x = mouseX - width/2;
    let y = mouseY - height/2;
    for (let cell of cells){
        if (x >= cell.x && x<= cell.x + cell_size && y >= cell.y && y <= cell.y + cell_size ){
            cell.c = [0, 0, 255];
        }else{
            cell.c = [30, 30, 30];
        }
    }
    */

    // Calculate that circular force!

    // have to scale the x and y because of WEBGL mode (center is 0, 0)
    // but mouseX and mouseY are still related to the canvas.
    let x = mouseX - width/2;
    let y = mouseY - height/2;
    // console.log("on cell " + getCellIndex(x, y));

    // proves that getCellIndex works.
    let i = getCellIndexFromScreen(mousex(), mousey());
    if (i !== -1){
        cells[i].c = [0, 0, 255];
    }
}

function mouseReleased(){
    console.log("Mouse released at " + mouseX + ", " + mouseY);
}


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
        // orbitControl(); // lets me move around with the mouse
        // disabled for this sketch... too much math needed
    }

    background(30, 30, 60);
    // your draw code here
        
    textSize(fontSize);
    textStyle(NORMAL);

    fill(255, 255, 255);
    noStroke();
    let t = 'emittors.';
    // text(t, 0, 0);

    strokeWeight(10);
    stroke(0);

    // rect(50, 50, 50, 50);
    // box(thick * coil_speed, r, 100);

    if (!stopRender){
        drawCells();
        if (!arrowTraversalMode) getNextCells();
    }


    if (frameCount % 100 === 0 ){
        console.log("Max Force: " + maxForce);
    }

}



// the meat of it
function drawCells(){

    // let's go 10 back...
    // translate(cellsTopLeft.x, cellsTopLeft.y, -10);

    translate(0, 0, -10);

    for (let c of cells){
        c.print();
    }
}




// self-explanatory
function getCellIndex(column, row){
    let i = row * num_cells_x + column;
    if (i >= 0 && i < cells.length){
        return i;
    }else{
        return -1;
    }
}

// pass in x, y from center coordinate (WEBGL), return i of cell
// functions in O(1) time.
function getCellIndexFromScreen(screenx, screeny){
    let x = screenx;
    let y = screeny;

    let column = (x - cellsTopLeft.x) / cell_size;
    let row = (y - cellsTopLeft.y) / cell_size;
    let onBoard = (column > 0 && column < num_cells_x) && (row > 0 && row < num_cells_y);

    // console.log("(" + x + ", " + y + ") --> (column, row, onBoard) of (" + column + ", " + row + ", " + onBoard + ")");

    if (onBoard){
        column = Math.floor(column);
        row = Math.floor(row);
        // console.log("i == " + index);
        return getCellIndex(column, row);
    }

    /*
    // exceptionally lazy math,  O(n) solution
    for (let i = 0 ; i < cells.length ; i++){
        let cell = cells[i];
        if (x >= cell.x && x<= cell.x + cell_size && y >= cell.y && y <= cell.y + cell_size ){
            return i;
        }
    }*/

    return -1; 
}




function scaleConstants(){
    // change based on resize
    // basically sets 1000 to be the default width and re-scales based on new widths
    let defaultWidth = 1000;
    let scale = windowWidth / defaultWidth;
    fontSize = 20 * scale;

    let w = cell_size * num_cells_x;
    let h = cell_size * num_cells_y;
    cellsTopLeft = {
        x: -w/2 + cell_size / 2,
        y: -h/2 + cell_size / 2
    }


    cells = [];
    let x = cellsTopLeft.x;
    let y = cellsTopLeft.y;


    // filling in the array from top left, to the right, then down.
    let n = 0;
    for (let i = 0 ; i < num_cells_y ; i++){
        for (let j = 0 ; j < num_cells_x ; j++){
            cells.push(new Cell(x, y, {
                isEmittor: emittorChance(), // should templatize this as chanceOfEmittor();
                period: Math.random() * 3000 + 3500, // range from 3500 - 6500
                n: n // stores my number
            }));
            x += cell_size;
            n++;
        }

        // finished a row
        x = cellsTopLeft.x;
        y += cell_size;
    }
}



/* some IO stuff and window resizing stuff */


function windowResized() {
    resizeCanvas(windowWidth * SCALE_W, windowHeight * SCALE_H);
    scaleConstants();
}

function keyReleased(){
    console.log("released key, keyCode: " + key + ', ' + keyCode);
    if (key === 'l'){
        console.log("windowWidth, windowHeight: " + windowWidth + ", " + windowHeight);
        console.log("p width and height: " + width + ", " + height);
        
        // for (let cell of cells){
        //    console.log("cell x, y: " + cell.x + ", " + cell.y);
        // }
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
        getNextCells();

        arrowFrame++;
            // Log all cell forces
        // console.log("NEXTFRAME! Frame is now " + arrowFrame);
        /* // debugging for me:
        for (let i = 0; i < cells.length; i++){
            if (cells[i].f.x !== 0 || cells[i].f.y !== 0){
                console.log(`Cell ${i}: f.x=${cells[i].f.x}, f.y=${cells[i].f.y}`);
            }
        }*/
       // Debugging for claude:
       /*
        console.log(`Frame ${arrowFrame}:`);
        console.log(`Consts: (emmisionForce, wave_decay, wave_spread) ${emissionForce}, ${wave_decay}, ${wave_spread}`);
        console.log(`num_cells_x, num_cells_y === ${num_cells_x}, ${num_cells_y}`);
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].mag() > 0.01) {  // only log non-zero forces
                let x_grid = i % num_cells_x;
                let y_grid = Math.floor(i / num_cells_x);
                // console.log(`  Cell(${x_grid}, ${y_grid}): fx=${cells[i].f.x.toFixed(3)}, fy=${cells[i].f.y.toFixed(3)}, mag=${cells[i].mag().toFixed(3)}, theta=${cells[i].theta().toFixed(3)}`);
                // if (cells[i].isEmittor) console.log(`Cell ${i} is an emittor. Its period is every ${cells[i].period}ms and its last emission was ${cells[i].timeSinceEmission} ms ago.`);
            }
        }*/
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

