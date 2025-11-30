import Scene from "./scene.js";
import Button from "../utils/button.js";






export default class StylePens extends Scene {


    // define that global shit:
    constructor(name, p, appState) {
        super(name || 'StylePensDefault', p, appState); // Call parent constructor with scene name
        // ^ does...
        // this.p
        // this.appState
        // ... end.
        
        
        this.buttons = [];
        this.shapes = [];

        // Add your own properties
        this.bgColor = [20, 20, 40];
        this.particles = [];

        this.curPenStyle = 'sketch';
    }



    getCurPenStyle(){
        return this.curPenStyle;
    }
    changeCurPenStyle(){
        if (this.curPenStyle === 'sketch'){
            this.curPenStyle = 'curve';
        }else{
            this.curPenStyle = 'sketch';
        }
    }

}





/*


// ============================================
// BASE SCENE CLASS
// ============================================
export default class Scene {
  constructor(name) {
    this.name = name;
    this.buttons = [];
    this.shapes = [];
  }
  
  // Called when scene becomes active
  onEnter() {
    console.log(`[${this.name}] onEnter()`);
  }
  
  // Called when scene is deactivated
  onExit() {
    console.log(`[${this.name}] onExit()`);
  }


  // Main setup method
  setup(buffer, w, h) {
    console.log(`[${this.name}] setup() - size: ${w}x${h}`);
  }
  
  // Main render method
  draw(buffer, mx, my, w, h) {
    console.log(`[${this.name}] draw() - mouse: (${mx}, ${my}), size: ${w}x${h}`);
  }
  
  // Mouse events
  mousePressed(mx, my) {
    console.log(`[${this.name}] mousePressed(${mx}, ${my})`);
    
  }
  
  mouseMoved(mx, my) {
    console.log(`[${this.name}] mouseMoved(${mx}, ${my})`);
  }
  
  mouseReleased(mx, my) {
    console.log(`[${this.name}] mouseReleased(${mx}, ${my})`);
  }
  
  // Keyboard events
  keyPressed(key, keyCode) {
    console.log(`[${this.name}] keyPressed(${key}, ${keyCode})`);
  }
  
  // Window resize
  onResize(w, h) {
    console.log(`[${this.name}] onResize(${w}, ${h})`);
  }
  
  // Update (for animations/physics)
  update(deltaTime) {
    console.log(`[${this.name}] update(${deltaTime})`);
  }
}



*/