
// going to actually implement this later... 
// it's going to make my project take longer than I have time for.
// just need to be adding functionality quickly.
class DrawOp {
    constructor(name, args) {
      
        if (typeof name !== "string"){
            console.log("name must be a string");
            return;
        }
        if (typeof args !== "object"){
            console.log("args must be an array.");
            return;
        }


        this.name = name.toLowerCase(); // function name as string, e.g., "line"
        this.args = args; // array of arguments
    }

    getName(){
      return this.name;
    }
    getArgs(){
      return this.args;
    }

    // might not end up using this... I kind of
    // prefer doing the actual draw in "JBPaint.js"
    execute(context) {
      try {
          context[this.name](...this.args);
      } catch (err) {
          console.error("Failed to execute buffer.${this.name} with arguments", this.args);
          console.error(err);
      }
    }
}