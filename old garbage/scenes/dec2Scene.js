import Scene from "./scene.js";
import Button from "../utils/button.js";
import TextBox from "../utils/textBox.js";
import Animation from "../utils/Animation.js";



/*


2. 
This portfolio is built using JavaScript 
and animated with the p5 library.

You can use your keyboard and your mouse
to interact.

Go ahead. Change the theme with
keys 1 - 4 on your keyboard.


3.
Wasn't that nice? 
Press 'b' anytime to toggle the background animation.

You can click on this icon at any moment
to view controls.

(icon toggles this:)
'b' toggle background animation
'm' mute / unmute
'right arrow' skip forwards
'left arrow' skip backwards
'1 - 9' change theme

*/



export default class Dec2Scene extends Scene {

    

    // define that global shit:
    constructor(name, p, palette, appState) {
        super(name || 'entrance_interactive_default', p, palette, appState); // Call parent constructor with scene name
        // ^ does...
        // this.p
        // this.appState
        // ... end.

        this.frameCount = 0;
        
        
        this.buttons = [];
        this.textBoxes = [];

        // Add your own properties
        this.bgColor = [20, 20, 40];
        this.particles = [];

        
        this.timeInit = Date.now();
        this.timeToWait = 2000; // time in ms to wait between renders
        this.curGroup = 0;
        this.curOrder = 0;
        this.groupSizes = [1, 3, 4]; // stores how we iterate through groups / through order


        this.setup();
    }


    // setup your buttons here:
    setup(){


    
        // sketches:
        this.renderDNASketch = true;
        this.renderParticleEmittors = false;
    
        // buttons:
        this.rectRoundButtons = 5;
        
        this.buttons.push(new Button({
            name: "dna",
            x: 50,
            y: 50,
            w: 50,
            h: 50,
            autoSize: true,
            rectRound: 5,
            text: 'dna',
            textSize: 24,
            toggle: true,
            onClick: (button) => {
                if (button.isSelected){
                    button.parent.renderDNASketch = true;
                }else{
                    button.parent.renderDNASketch = false;
                }
            }
        }));
        this.buttons.push(new Button({
            name: "particle emittors",
            parent: this,
            x: 50,
            y: 150,
            w: 50,
            h: 50,
            autoSize: true,
            rectRound: 5,
            text: 'particle emittors',
            textSize: 24,
            onClick: (button) => {
                if (button.isSelected){
                    button.parent.renderParticleEmittors = true;
                }else{
                    button.parent.renderParticleEmittors = false;
                }
            }
        }));

            
        
        this.gl = this.p.createGraphics(this.appState.w, this.appState.h, this.p.WEBGL);
        this.gl.pixelDensity(1);
        // rotates the dna coil
        this.t = 1;


      this.setElementVisibility();
      // this.setGroupOrder(2, 1);
    };



    // Main render method
    // should be getting buffer with the p.CENTER and stuff already set...

    /**
   * @param {import('p5').Graphics} buffer
   * @param {number} mx
   * @param {number} my
   */
    draw(buffer, mx, my) {
      // console.log(`[${this.name}] draw() - mouse: (${mx}, ${my}), size: ${this.appState.w}x${this.appState.h}`);
      buffer.background(this.palette.getColor('background'));
      buffer.textFont(this.palette.getFont());
      buffer.textAlign(buffer.CENTER, buffer.CENTER);
      buffer.orbitControl();


      for (let tb of this.textBoxes){
        tb.print(buffer, this.palette, this.appState);
      }
      for (let b of this.buttons){
        // this.printButton(buffer, b); // member of "Scene"
        b.print(buffer, this.palette, this.appState);
      }
    

    // going to add some buttons in here to switch between scenes:
    if (this.renderDNASketch){

        let coilTightness = 10;
        
        coilTightness = coilTightness / 100;

        let points = [];
        let t = this.t;
        let gl = this.gl;
        gl.push();
        gl.orbitControl();
        for (let z = 0 ; z < 1020 ; z += 20){
            // let i be z
            let x, y;
            x = Math.cos(t + z * coilTightness);
            y = Math.sin(t + z * coilTightness);
            points.push([x, y, z]);
        }

        // now print on graphics buffer...
        gl.box(50, 75, 100);


        
        this.t++;
        gl.pop();
        buffer.image(gl, 0, 0, this.appState.w, this.appState.h);
    }
    if (this.renderParticleEmittors){

    }

      




      this.frameCount++;
    }


  keyReleased(key, keyCode) {
    // console.log(`[${this.name}] keyReleased(${key}, ${keyCode})`);
    if (key === 'ArrowLeft'){
      this.prevOrder();
    }
    if (key === 'ArrowRight'){
      this.nextOrder();
    }

    /*
    for (let s of this.textBoxes){
      console.log("Text size of " + s.name + ": " + s.textSize);

    }*/
  }

  nextOrder(){
    this.curOrder++;
    if (this.curOrder >= this.groupSizes[this.curGroup]){
      this.curGroup++;
      this.curOrder = 0;
    }
    if (this.curGroup >= this.groupSizes.length) this.curGroup = 0;
    this.setElementVisibility();

    // build the above function, check if we're doing any cool newx newy type stuff
    console.log('+group ' + this.curGroup + ", order " + this.curOrder);
    
    // quick animation:
    if (this.curGroup === 2 && this.curOrder === 3){
      let newx = Math.random() * this.appState.w;
      let newy = Math.random() * this.appState.h;
      for (let b of this.buttons){
        b.glideTo(newx, newy, 1500);
      }
    }
  }
  prevOrder(){
    this.curOrder--;
    if (this.curOrder < 0){
      this.curGroup--;
      if (this.curGroup < 0){
        this.curGroup = this.groupSizes.length - 1;
      }
      this.curOrder = this.groupSizes[this.curGroup] - 1;
    }
    this.setElementVisibility();
    console.log('-group ' + this.curGroup + ", order " + this.curOrder);


    // quick animation:
    if (this.curGroup === 2 && this.curOrder === 3){
      let newx = Math.random() * this.appState.w;
      let newy = Math.random() * this.appState.h;
      for (let b of this.buttons){
        b.glideTo(newx, newy, 1500);
      }
    }
  }


  // calls nextOrder to ensure that boundaries are checked and setButtonVisibility() is triggered
  setGroupOrder(group, order){
    this.curGroup = group;
    this.curOrder = order - 1; 
    this.nextOrder();
  }

}



// On return:
// let's get them to be smoothly entering and exiting.
// let's get that "data" import thing in here.

