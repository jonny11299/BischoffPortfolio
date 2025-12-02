import Scene from "./scene.js";
import Button from "../utils/button.js";
import TextBox from "../utils/textBox.js";



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


export default class EntranceInteractiveScene extends Scene {


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
        this.groupSizes = [1, 3, 3]; // stores how we iterate through groups / through order


        this.setup();
    }


    // setup your buttons here:
    setup(){


      // order determines when it'll render
      let w = 750;
      let h = 100;
      let midx = this.w / 2;
      let yFactor = this.h/4;
      let curRectRound = 5;
      // gonna divide in 4 for h

      this.textBoxes.push(new TextBox({
        x: midx,
        y: yFactor,
        w: w,
        h: h,
        autoSize: true,
        rectRound: curRectRound,
        text: 'This portfolio is built using JavaScript\nand animated with the p5 library.',
        textSize: 24,
        group: 1,
        order: 0
      }));

      this.textBoxes.push(new TextBox({
        x: midx,
        y: yFactor * 2,
        w: w,
        h: h,
        autoSize: true,
        rectRound: curRectRound,
        text: 'You can use your keyboard and your mouse\nto interact.',
        textSize: 24,
        group: 1,
        order: 1
      }));

      this.textBoxes.push(new TextBox({
        x: midx,
        y: yFactor * 3,
        w: w,
        h: h,
        autoSize: true,
        rectRound: curRectRound,
        text: 'Go ahead. Change the theme with\nkeys 1 - 4 on your keyboard.',
        textSize: 24,
        group: 1,
        order: 2
      }));

      /* ------------------------------------------------- */

      /*


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


      this.textBoxes.push(new TextBox({
        x: midx,
        y: yFactor,
        w: w,
        h: h,
        autoSize: true,
        rectRound: curRectRound,
        text: "Wasn't that nice?\nPress 'b' anytime to toggle the background animation.",
        textSize: 24,
        group: 2,
        order: 0
      }));

      this.textBoxes.push(new TextBox({
        x: midx,
        y: yFactor * 2,
        w: w,
        h: h,
        autoSize: true,
        rectRound: curRectRound,
        text: 'You can click on this icon at any moment\nto view controls.',
        textSize: 24,
        group: 2,
        order: 1
      }));

      /* put the button right below */
      /* make it slide from one place to another */


      // gonna have to render with an "is selected"
      this.buttons.push(new Button({
          name: "controls",
          x: midx,
          y: yFactor * 3,
          w: w,
          h: h,
          text: "c",
          isToggle: true,
          isCentered: true,
          autoSize: true,
          group: 2,
          order: 2,
          onClick: (button) => {
            console.log("pressed " + button.name + " : toggled ? " + button.isSelected);
          }
      }));



      this.setElementVisibility();
      this.setGroupOrder(2, 1);
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


      for (let tb of this.textBoxes){
        tb.print(buffer, this.palette, this.appState);
      }
      for (let b of this.buttons){
        // this.printButton(buffer, b); // member of "Scene"
        b.print(buffer, this.palette, this.appState);
      }

      /*
      if (this.frameCount % 100 === 0){
        console.log("shapes: " + this.shapes);
        console.log("buttons: " + this.buttons);
      }*/


      /*
      buffer.fill(128, 0, 0);
      buffer.rect(300, 300, 300, 200, 10);
      */

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

    for (let s of this.textBoxes){
      console.log("Text size of " + s.name + ": " + s.textSize);

    }
  }

  nextOrder(){
    this.curOrder++;
    if (this.curOrder >= this.groupSizes[this.curGroup]){
      this.curGroup++;
      this.curOrder = 0;
    }
    if (this.curGroup >= this.groupSizes.length) this.curGroup = 0;
    this.setElementVisibility();
    console.log('+group ' + this.curGroup + ", order " + this.curOrder);
    
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
  }


  // calls nextOrder to ensure that boundaries are checked and setButtonVisibility() is triggered
  setGroupOrder(group, order){
    this.curGroup = group;
    this.curOrder = order - 1; 
    this.nextOrder();
  }

}




// On return:
// let's get them all printing from center.
// let's get their size to be automatically determined.
// let's get them to be smoothly entering and exiting.
// let's get that "data" import thing in here.
