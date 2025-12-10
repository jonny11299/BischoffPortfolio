

// ============================================
// BASE SCENE CLASS
// ============================================
export default class Scene {
  constructor(name, p, palette, appState) {
    console.log("Launching scene " + name);

    // checking errors for "bro i'mma need a functioning p and appState"
    if (!p){
      throw new Error("no p given to scene '" + name + "'");
    }
    if (!appState){
      throw new Error("no appState given to scene '" + name + "'");
    }
    if (!palette){
      throw new Error("no palette given to scene '" + name + "'");
    }


    this.name = name;
    this.buttons = [];
    this.textBoxes = [];
    this.p = p,
    this.appState = appState
    this.palette = palette;
    this.w = appState.w;
    this.h = appState.h;

    // be sure to overwrite this, now
    this.curGroup = 0;
    this.curOrder = 0;
    this.groupSizes = [1]; // stores how we iterate through groups / through order

    // ui (duplicate of appState but still useful...)
    this.mouseDown = false;

    console.log("Launched scene " + name);
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
  setup() {
    console.log(`[${this.name}] setup() - size: ${this.appState.w}x${this.appState.h}`);
  }
  
  // Main render method
  draw(buffer, mx, my) {
    console.log(`[${this.name}] draw() - mouse: (${mx}, ${my}), size: ${this.appState.w}x${this.appState.h}`);
  }


  setElementVisibility(){
    for (let b of this.buttons){
      let visible = b.group === -1;
      if (!visible && this.curGroup === b.group){
        visible = this.curOrder >= b.order;
      }

      b.setVisibility(visible);
    }

    for (let t of this.textBoxes){
      let visible = t.group === -1;
      if (!visible && this.curGroup === t.group){
        visible = this.curOrder >= t.order;
      }

      t.setVisibility(visible);
    }
  }



  mouseMoved(mx, my){
    //console.log(`[${this.name}] mouseMoved(${mx}, ${my})`);

    for (let b of this.buttons){
          b.checkHover(mx, my);
    }
  }
  
  mousePressed(mx, my){
    // console.log(`[${this.name}] mousePressed(${mx}, ${my})`);
    this.mouseDown = true;

    for (let b of this.buttons){
      b.checkPressed(mx, my);
    }

      // set isPressed for elements
  }
  mouseReleased(mx, my){
    // console.log(`[${this.name}] mouseReleased(${mx}, ${my})`);

    for (let b of this.buttons){
      b.release(mx, my);
    }

    this.mouseDown = false;
  }
  

  // Keyboard events
  keyPressed(key, keyCode) {
    console.log(`[${this.name}] keyPressed(${key}, ${keyCode})`);
  }
  keyReleased(key, keyCode) {
    console.log(`[${this.name}] keyReleased(${key}, ${keyCode})`);
  }
  

  // Window resize
  resize(w, h) {
    console.log(`[${this.name}] resize(${w}, ${h})`);
    this.w = w;
    this.h = h;
    setup(); // gotta re-place those elements.
  }
  
  // Update (for animations/physics)
  update(deltaTime) {
    console.log(`[${this.name}] update(${deltaTime})`);
  }
}