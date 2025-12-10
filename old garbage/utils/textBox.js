
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


// in a perfect world, button would extend textBox, but for now, we just update both classes with new models...
import Animation from "./Animation.js";


export default class TextBox {
    constructor(config) {
        this.name = config.name || 'n/a';
        this._textGetter = config.text; // Store the getter function or static text, accessible via '.text'
        this.textSize = config.textSize || 24;
        this.x = config.x;
        this.y = config.y;
        this.w = config.w || 200;
        this.h = config.h || 60;
        this.rectRound = config.rectRound || 5;
        this.autoSize = config.autoSize ?? false; // set to true if you want to let it pick its own size based on the text within.
        this.autoSizePaddingX = config.autoSizePaddingX ?? 20;
        this.autoSizePaddingY = config.autoSizePaddingY ?? 20;
        this.manualW = this.w;
        this.manualH = this.h;

        this.isCentered = config.isCentered ?? true; // set this to "true" for x/y to store the center, not the topleft
        this.isVisible = config.isVisible ?? true;

        this.isToggle = config.isToggle || false; // affects how it functions, either as a toggle or non-toggle button
        this.isSelected = false; // has been selected (overlaps with isPressed when not toggle)
        this.isHovered = false; // is hovered over
        this.isPressed = false; // physically pressing down with the mouse
        this.color = config.color || '1';
        this.strokeWeight = config.strokeWeight || 'strokeWeight';
        this.strokeColor = config.strokeColor || 'stroke';
        this.onClick = config.onClick ?? null; // Add callback function


        // used for sequential rendering. We divie elements into groups, and groups into orders.
        // things render in-order for a specific group, then it changes groups.
        this.group = config.group || -1;
        this.order = config.order || -1;
        this.timeInit = Date.now();

        this.opacity = 1; // (ranges from 0 - 1, used for fade ins and fade outs controlled by animation);
        this.animation = new Animation(this); // set to false if there's no animation
        this.autoFadeIn = config.autoFadeIn ?? false; // should just be true or false
        

    }


    get text() {
        // If _textGetter is a function, call it with 'this' context
        // Otherwise return it as a static string
        return typeof this._textGetter === 'function' 
            ? this._textGetter.call(this) 
            : this._textGetter || this.name;
    }


    updateDimensions(buffer, palette){
        if (this.autoSize){
            buffer.textFont(palette.getFont());
            buffer.textSize(this.textSize);
            
            // Split text by newlines and find the widest line
            let lines = this.text.split('\n');
            let maxWidth = 0;
            for (let line of lines) {
                let lineWidth = buffer.textWidth(line);
                if (lineWidth > maxWidth) {
                    maxWidth = lineWidth;
                }
            }
            
            let numLines = lines.length;

            this.w = maxWidth + (this.autoSizePaddingX * 2);
            this.h = (this.textSize * numLines) + (this.autoSizePaddingY * 2);
        } else {
            this.w = this.manualW || 50;
            this.h = this.manualH || 50;
        }
    }
    

    // dude... please print within here, all I need is buffer, palette, and appState
    // might not even need appState in here. I guess for the theme?
    // but the theme automatically changes on palette's getColor, so...
    print(buffer, palette, appState){
        if (this.isVisible){
            this.updateDimensions(buffer, palette);
            if (this.animation.isActive()){
                // could be a bug here if we need to run animation.updateFields() to set variables correctly,
                // yet animation's 'this.isAnimating' is false...
                // however, I think we checked that sufficiently in Animation.
                this.animation.updateFields();
            }


            let x = this.x;
            let y = this.y;
            if (this.isCentered){
                let p = this._toTopLeft(x, y);
                x = p.x;
                y = p.y;
            }

            // determine if the color to use is based on theme or raw:
            buffer.fill(palette.getColorWithOpacity(this.color, this.opacity));
            

            buffer.strokeWeight(this.strokeWeight);
            buffer.stroke(palette.getColorWithOpacity(this.strokeColor, this.opacity));

            // need to ensure pg has centered text, then print the rectangle, then the text
            buffer.rect(x, y, this.w, this.h, this.rectRound);

            // text:
            buffer.noStroke();
            buffer.textAlign(buffer.CENTER, buffer.CENTER);
            buffer.textFont(palette.getFont());
            buffer.fill(palette.getColorWithOpacity('fontColor', this.opacity));
            buffer.textSize(this.textSize);
            buffer.text(this.text, x + this.w/2, y + this.h/2);

            // console.log("printing " + this.name + " at x, y === " + x + ", " + y);
        }
    }


    fadeIn(fadeInTime = 1000){
        this.animation.fadeIn(fadeInTime);
    }
    fadeOut(fadeOutTime = 1000){
        this.animation.fadeOut(fadeOutTime);
    }
    glideTo(x, y, glideTime = 1000){
        this.animation.glide(x, y, glideTime);
    }


    // scene change should set this visible or not... as in, from scene, we tell the button to set visibility or not.
    setVisibility(visible){
        if (typeof visible === 'boolean'){
            // could also do scene change stuff here, like reset timeInit, etc

            // we only want to do the following if we WERE invisible but are now visible...
            if (visible && !this.isVisible && this.autoFadeIn){
                this.fadeIn();
            }

            this.isVisible = visible;
        }else{
            this.isVisible = false;
        }
    }
    


    // helper functions:
    // input the center point, return the top left point.
    _toTopLeft(centerx, centery){
        return {
            x: centerx - this.w/2,
            y: centery - this.h/2
        }
    }
    // input the top left point, return the center point.
    _toCenter(topleftx, toplefty){
        return {
            x: topleftx + this.w/2,
            y: toplefty + this.h/2
        }
    }
}