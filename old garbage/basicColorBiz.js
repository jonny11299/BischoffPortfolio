

const startingWidth = 1400.0
const startingHeight = 800.0

let bgcolor = [0.0, 0.0, 0.0]

let mouseDown = false


function setup() {
  createCanvas(startingWidth, startingHeight);
}

function draw() {
  background(bgcolor[0], bgcolor[1], bgcolor[2]);

  checkColor()
}


function checkColor(){
  if (mouseDown === true) {
    let r = mouseX * 256.0 / startingWidth
    let g = mouseY * 256.0 / startingWidth 
    let b = bgcolor[2]
    b += 1.0
    b = b % 256.0

    bgcolor = [r, g, b]
  }
}

function mousePressed(){
  mouseDown = true
}
function mouseReleased(){
  mouseDown = false
}