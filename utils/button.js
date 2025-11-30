


/*
// 1920 x 1080 gives a 16:9 aspect ratio.
// We will be using letterboxing / pillarboxing to maintain this.
const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;
const DESIGN_ASPECT = DESIGN_WIDTH / DESIGN_HEIGHT;

// For phones, we're flipping it to 9:16
const PHONE_DESIGN_WIDTH = 1080;
const PHONE_DESIGN_HEIGHT = 1920;
const PHONE_ASPECT = PHONE_DESIGN_WIDTH / PHONE_DESIGN_HEIGHT;
*/


// Coordinate function system is relative to the design width and height above.
export default class Button {
    constructor(config) {
        this.name = config.name;
        this.x = config.x;
        this.y = config.y;
        this.w = config.w || 200;
        this.h = config.h || 60;
        this._textGetter = config.text; // Store the getter function or static text
        this.isToggle = config.isToggle || false; // affects how it functions, either as a toggle or non-toggle button
        this.isSelected = false; // has been selected (overlaps with isPressed when not toggle)
        this.isHovered = false; // is hovered over
        this.isPressed = false; // physically pressing down with the mouse
        this.color = config.color || 'buttonColor';
        this.colorHovered = config.colorHovered || 'buttonHovered';
        this.colorPressed = config.colorPressed || 'buttonPressed';
        this.colorSelected = config.colorSelected || 'buttonSelected';
        this.strokeWeight = config.strokeWeight || 'strokeWeight';
        this.strokeColor = config.strokeColor || 'stroke';
        this.onClick = config.onClick || null; // Add callback function
    }


    get text() {
        // If _textGetter is a function, call it with 'this' context
        // Otherwise return it as a static string
        return typeof this._textGetter === 'function' 
            ? this._textGetter.call(this) 
            : this._textGetter || this.name;
    }

    
    
    // Should check hover, pressed, and release when the mouse is moved, pressed, released.
    checkHover(designX, designY) {
        this.isHovered = designX > this.x && designX < this.x + this.w && designY > this.y && designY < this.y + this.h;
        return this.isHovered;
    }
    
    checkPressed(designX, designY) {
        let pressed
        this.isPressed = designX > this.x && designX < this.x + this.w && designY > this.y && designY < this.y + this.h;
        return pressed;
    }

    clicked(){
        // console.log("clicked " + this.text + " , and is it a toggle? " + this.isToggle);
        if (this.isToggle){
            this.isSelected = !this.isSelected;
        }

        // Call the callback if it exists
        if (this.onClick) {
            this.onClick(this); // Pass the button instance so parent can access its state
        }else{
            console.log("(default log) You clicked " + this.name);
        }
    }

    // returns true if it was previously pressed
    release(designX, designY){
        if (this.isPressed){
            if (this.checkHover(designX, designY)){
                // this means we were clicked
                this.clicked();
            }
        }
        let pressed = this.isPressed;
        this.isPressed = false;

        return pressed;
    }

    // print upon pg, the "processing graphics" buffer.
    // We should not print from here -- we should print from within
    // the main function, because this actually has p and pg
}