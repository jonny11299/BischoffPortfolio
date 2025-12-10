


/*

    Started Dec 3, 2025
    Last Updated Dec 3, 2025




    Updates:
        - Add controls for modifying parameters (or even a simple "show controls" button)

        - Add some color parameterization (I would like to see the color
            shoot up and down the DNA strand)
            - js 'data' class would be great for this, actually.


        - Add some 'rungs' to the ladder
    

    Interesting parameters:
        - flipping phi and theta in the rotation calculation gives interesting results...






    Reflections:
        This was the first sketch that was really simple to do
        after spending three weeks in framework hell.
        I'm really glad we're stepping back and finding a more
        fun and interesting way to do this.

        I really do feel like smoking weed and writing down some
        fun mathematical ideas last night helped propelled this 
        "step back and reassess" mentality.

        We were quite effectively reinventing the wheel,
        instead of simply driving...

        But now, we're back on the road, and full-force.

*/










const SCALE_W = 1;
const SCALE_H = 1;


let font;
let fontSize = 20;

let orbitControlToggle = true;
let stopRender = false;



// DNA consts:
// (scaled with width based on divisor)

const EXTEND_PAST_HEIGHT = 1.5;

const DNA_RADIUS = 100;
let r;

const DNA_WIDTH = 145;
let dna_wideness;

const DNA_THICK = 25;
let dna_thickness = DNA_THICK;

const SEGMENT_LENGTH = 15;
let seg_len = SEGMENT_LENGTH; // Can maybe reassign this later but it's fine

const COIL_SPEED = 0.1;
let coil_speed = COIL_SPEED;




let tStart = 0;
let tChange = 0.01;
let tPause = false;



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
    let t = 'DNA strand.\nPretty cool, huh?\nI\'ll add some control instructions soon.';
    text(t, 0, 0);

    strokeWeight(10);
    stroke(0);

    // rect(50, 50, 50, 50);
    // box(thick * coil_speed, r, 100);

    if (!stopRender){
        drawDNA();
    }
}



// the meat of it
function drawDNA(){

    // build strand 1:
    let points = [];
    let hStart = (height / 2) * EXTEND_PAST_HEIGHT;
    let t = tStart;

    // builds from the top of the screen, down
    for (let y = hStart ; y >= -hStart ; y -= seg_len){
        let x = dna_wideness * cos(t);
        let z = dna_wideness * sin(t);

        points.push({
            x: x,
            y: y,
            z: z
        });

        t += coil_speed;
    }

    // build strand 2:
    let points2 = [];
    hStart = (height / 2) * EXTEND_PAST_HEIGHT;
    t = tStart;

    // builds from the top of the screen, down
    for (let y = hStart ; y >= -hStart ; y -= seg_len){
        let x = dna_wideness * cos(t);
        let z = dna_wideness * sin(t);

        points2.push({
            x: -x,
            y: y,
            z: - z
        });

        t += coil_speed;
    }



    // print strand 1:
    strokeWeight(3);
    stroke(0);
    fill(255);

    drawStrandFromPoints(points);



    // print strand 2:
    strokeWeight(3);
    stroke(255);
    fill(128, 128, 255);

    drawStrandFromPoints(points2);

    
    /* old draw function
    for (let i = 0 ; i < points2.length - 1 ; i++){
        // line(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
        push();
        translate(points2[i].x, points2[i].y, points2[i].z);
        box(seg_len);
        pop();
    }
        */

    if (!tPause){
        tStart += tChange;
    }
}


function drawStrandFromPoints(points){
    for (let i = 0 ; i < points.length - 1 ; i++){
        // line(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
        let p1 = points[i];
        let p2 = points[i + 1];
        
        // Midpoint between the two points
        let midX = (p1.x + p2.x) / 2;
        let midY = (p1.y + p2.y) / 2;
        let midZ = (p1.z + p2.z) / 2;
        
        // Direction vector
        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;
        let dz = p2.z - p1.z;
        
        // Distance between points (length of box)
        let d = sqrt(dx*dx + dy*dy + dz*dz);
        
        push();
        translate(midX, midY, midZ);
        
        // Rotate to align with direction vector
        let theta = atan2(sqrt(dx*dx + dz*dz), dy);
        let phi = atan2(dz, dx);
        rotateY(-phi);
        rotateZ(-theta);
        
        box(dna_thickness, d, dna_thickness); // width, height (length), depth
        pop();
    }
}





function scaleConstants(){
    // change based on resize
    // basically sets 1000 to be the default width and re-scales based on new widths
    let defaultWidth = 1000;
    let scale = windowWidth / defaultWidth;
    fontSize = 20 * scale;

    r = DNA_RADIUS * scale;
    dna_wideness = DNA_WIDTH * scale;



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
        console.log("coil speed: " + coil_speed);
        console.log("dna_wideness: " + dna_wideness);
        console.log("dna_thickness: " + dna_thickness);
        console.log("tChange: " + tChange);
    }
    if (key === 'r'){ // or whatever key you want
        camera(); // Resets to default view
    }
    
    // if (key === 'o'){
    //     orbitControlToggle = !orbitControlToggle;
    // }

    if (keyCode === 38){ // arrow up
        coil_speed *= 1.2;
    }else if (keyCode === 40){ // arrow down
        coil_speed /= 1.2;
    }else if (keyCode === 37){ // arrow left
        dna_wideness -= 6;
    }else if (keyCode === 39){ // arrow right
        dna_wideness += 6;
    }

    if (key === 't'){
        dna_thickness *= 1.1;
    }else if (key === 'g'){
        dna_thickness /= 1.1;
    }

    if (key === 'y'){
        tChange += 0.01;
    }else if (key === 'h'){
        tChange -= 0.01;
    }else if (key === 'p'){
        tPause = !tPause;
    }

    if (keyCode === 190){ // . key, means stop render
        stopRender = !stopRender;
    }
}