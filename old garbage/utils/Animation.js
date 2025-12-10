


// This class handles animations
// Every textbox and button "has" an animation class, and can call it.
// Probably should call it via:
// textBox.animation_glide(toX, toY, glideTime, startTime = Date.now());
// textBox.animation_fadeIn(fadeTime, startTime = Date.now());
// textBox.animation_fadeOut(fadeTime, startTime = Date.now());

// textBox itself, on-print, will retrieve info from the Animation class if necessary

// should contain:
// isAnimating (true/false) (true when there is an animation in progress)
// if isAnimating is true, then we need to be setting the parent's x, y, alpha to this class's values thereof


// shouldn't really matter if this is within a centered element or topleft element, because we're still just
// moving around the new x and y

// if we want to queue up animations, we should manage that via an animation queue object, or something encapsulating this.



// shit bruhhh... BUG:
// I can't do two animations at once, because closing out one stops the other mid-progress.
// quick fix -- let's just set opacity to 1 
// to really fix, we need to:
// 1. Change this.isAnimating to a function that returns the boolean product of 
//      this.isGliding
//  and this.isFading
// 2. break startTime and endTime up into 
//
// hmmmm... or I could just give the textBox and button two separate animation objects, 
// one for fading, one for moving...
// yes, delightfully devilish, seymour...

export default class Animation {

    constructor(parent) {
        this.parent = parent;
        this.x = parent.x;
        this.y = parent.y;
        this.opacity = 1,

        this.glideState = {
            isAnimating: false,
            startTime: null,
            endTime: null,
            start_x: -1,
            start_y: -1,
            destination_x: -1,
            destination_y: -1
        }

        this.fadeState = {
            isAnimating: false,
            startTime: null,
            endTime: null,
            startOpacity: 0,
            endOpacity: 1
        }

        

        /*
        this.isAnimating = false;
        this.isAnimatingType = 'none' // stores the type of animation that is happening:
        
        //    'none'
        //    'glide'
        //    'fadeIn'
        //    'fadeOut'
        
        this.startTime = null;
        this.endTime = null;
        
        // movement animations:
        this.start_x = -1;
        this.start_y = -1;
        this.destination_x = -1;
        this.destination_y = -1;

        // fade animation:
        this.opacity = 1; // (ranges from 0 - 1, we multiply the parent element's opacity times this.);
        */
    }


    // to use:
    // for a button or shape, pass in
    // Animation anim = new Animation(b);
    // anim.glide(xTo, yTo, glideTime); // startTime defaults to now.
    // in your PRINT function, you need to call anim.updateFields();
    // that should be it...


    updateFields(){

        // update all referenced functions here...

        // check glide animation:
        if (this.glideState.isAnimating){
            console.assert(this.glideState.startTime !== null && this.glideState.endTime !== null);

            // check if we need to close out:
            if (Date.now() >= this.glideState.endTime){
                this._closeOutGlideAnimation();
            }else{
                let now = Date.now();
                console.assert(now >= this.glideState.startTime); // really need to be sure that this.isAnimating is never true before this.animationStartTime

                // we know that we're gliding right now:
                // map this.x and this.y from start_x, start_y to destination_x, destination_y based on time 

                let frac = (now - this.glideState.startTime) / (this.glideState.endTime - this.glideState.startTime);
                let newx = this.glideState.start_x + frac * (this.glideState.destination_x - this.glideState.start_x);
                let newy = this.glideState.start_y + frac * (this.glideState.destination_y - this.glideState.start_y);
                // console.log("frac, newx, newy: " + frac + ", " + newx + ", " + newy);
                // console.log("this.startTime, this.endTime: " + this.startTime + ", " + newx + ", " + newy);

                this.x = newx;
                this.y = newy;

                // console.log("Gliding to (" + newx + ", " + newy + ")");
                // this.logSelf();

                this._assignPositionToParent();
            }
        }else{
            // check if we should start a new animation
            if (this.glideState.startTime !== null){
                // we have queued up an animation and it's beginning
                if (this.glideState.startTime <= Date.now()){
                    this.glideState.isAnimating = true;
                }
            }
        }

        // check fade animation:
        if (this.fadeState.isAnimating){
            console.assert(this.fadeState.startTime !== null && this.fadeState.endTime !== null);
            // check if we need to close out:
            if (Date.now() >= this.endTime){
                this._closeOutFadeAnimation();
            }else{
                let now = Date.now();
                console.assert(now >= this.fadeState.startTime);

                // interpolate opacity from 0 - 1 based on startTime and endTime
                // fade from startOpacity to endOpacity
                let frac = (now - this.fadeState.startTime) / (this.fadeState.endTime - this.fadeState.startTime);
                let newOpacity = this.fadeState.startOpacity + frac * (this.fadeState.endOpacity - this.fadeState.startOpacity);
                this.opacity = newOpacity;
                
                this._assignOpacityToParent();
            }
        }else{
            // check if we should start a new animation
            if (this.fadeState.startTime !== null){
                // we have queued up an animation and it's beginning
                if (this.fadeState.startTime <= Date.now()){
                    this.fadeState.isAnimating = true;
                }
            }

        }

        

    }

    logSelf() {
        const data = {};
        for (let key in this) {
            if (typeof this[key] !== 'function') {
                data[key] = this[key];
            }
        }
        console.log(data);
    }

    isActive(){
        return this.fadeState.isAnimating || this.glideState.isAnimating;
    }
    isGliding(){
        return this.glideState.isAnimating;
    }
    isFading(){
        return this.fadeState.isAnimating;
    }

    _closeOutGlideAnimation(){
        console.log("Closing out glide animation");

        this.x = this.glideState.destination_x;
        this.y = this.glideState.destination_y;

        this.glideState.destination_x = -1;
        this.glideState.destination_y = -1;
        this.glideState.start_x = -1;
        this.glideState.start_y = -1;

        this._assignPositionToParent();

        this.glideState.startTime = null;
        this.glideState.endTime = null;
        this.glideState.isAnimating = false;
    }

    _closeOutFadeAnimation(){
        console.log("Closing out fade animation");

        this.opacity = this.glideState.endOpacity;
        this._assignOpacityToParent();

        this.fadeState.startOpacity = -1;
        this.fadeState.endOpacity = -1;

        this.fadeState.startTime = null;
        this.fadeState.endTime = null;
        this.fadeState.isAnimating = false;
    }
    
    
    _assignPositionToParent(){
        this.parent.x = this.x;
        this.parent.y = this.y;
    }
    _assignOpacityToParent(){
        // console.log("assigning " + this.opacity + " for parent opacity");
        this.parent.opacity = this.opacity;
    }


    // (startTime is always an integer, milliseconds))
    glide(xTo, yTo, glideTime = 1000, startTime = Date.now()){
        this.glideState.startTime = startTime;
        this.glideState.endTime = startTime + glideTime;

        this.x = this.parent.x;
        this.y = this.parent.y;
        this.glideState.start_x = this.parent.x;
        this.glideState.start_y = this.parent.y;
        this.glideState.destination_x = xTo;
        this.glideState.destination_y = yTo;

        if (startTime <= Date.now()){
            this.glideState.isAnimating = true;
        }
    }

    // fades from 0 to 1
    fadeIn(fadeTime = 1000, startTime = Date.now()){
        this.fadeState.startTime = startTime;
        this.fadeState.endTime = startTime + fadeTime;
        
        this.fadeState.startOpacity = 0;
        this.fadeState.endOpacity = 1;
        
        if (startTime <= Date.now()){
            this.opacity = 0;
            this.fadeState.isAnimating = true;
        }

    }

    // fades from 1 to 0
    fadeOut(fadeTime = 1000, startTime = Date.now()){
        this.fadeState.startTime = startTime;
        this.fadeState.endTime = startTime + fadeTime;

        this.fadeState.startOpacity = 1;
        this.fadeState.endOpacity = 0;

        if (startTime <= Date.now()){
            // this.opacity = 1; // nah, let's keep this out -- opacity might quickly jump in that case.
            this.fadeState.isAnimating = true;
        }

    }

    // fade from wherever we are to a specific fade
    // undefined bro... i'll make this later.
    fadeTo(fadeTime = 1000, startTime = Date.now(), destination = 0.5){

    }


    
}