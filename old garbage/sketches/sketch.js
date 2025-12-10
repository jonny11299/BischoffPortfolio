// 'p5 vscode setup guide:'
// 'https://github.com/antiboredom/p5.vscode/blob/master/README.md'




export function sketch(p, appState) {

  const startingWidth = 700.0
  const startingHeight = 500.0

  let bgcolor = [0.0, 0.0, 0.0]

  let mouseDown = false


  p.setup = function() {
    p.colorMode(p.RGB);

    console.log("Launched the sketch sketch.");

    p.createCanvas(startingWidth, startingHeight);
  };

  p.draw = function() {
    p.background(bgcolor[0], bgcolor[1], bgcolor[2]);

    checkColor()
  };


  let checkColor = function(){
    if (mouseDown === true) {
      let r = p.mouseX * 256.0 / startingWidth
      let g = p.mouseY * 256.0 / startingWidth 
      let b = bgcolor[2]
      b += 1.0
      b = b % 256.0

      bgcolor = [r, g, b]
    }
  };

  p.mousePressed = function(){
    mouseDown = true
  };
  p.mouseReleased = function(){
    mouseDown = false
  };
}

