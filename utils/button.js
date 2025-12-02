


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


// Coordinate function system is relative to the design width and height above.
export default class Button {
    constructor(config) {
        this.name = config.name;
        this.x = config.x;
        this.y = config.y;
        this.w = config.w || 200;
        this.h = config.h || 60;
        this.rectRound = config.rectRound || 5;
        this.textSize = config.textSize || 24; // ⭐ NEW
        this.autoSize = config.autoSize ?? false;
        this.autoSizePaddingX = config.autoSizePaddingX ?? 8;
        this.autoSizePaddingY = config.autoSizePaddingY ?? 8;
        this.manualW = this.w;
        this.manualH = this.h;
        this.isCentered = config.isCentered ?? true;
        this._textGetter = config.text;
        this.isVisible = config.isVisible ?? true;

        this.isToggle = config.isToggle || false;
        this.isSelected = false;
        this.isHovered = false;
        this.isPressed = false;
        this.color = config.color || 'buttonColor';
        this.colorHovered = config.colorHovered || 'buttonHovered';
        this.colorPressed = config.colorPressed || 'buttonPressed';
        this.colorSelected = config.colorSelected || 'buttonSelected';
        this.strokeWeight = config.strokeWeight || 'strokeWeight';
        this.strokeColor = config.strokeColor || 'stroke';
        this.onClick = config.onClick ?? null;

        this.group = config.group || -1;
        this.order = config.order || -1;
        this.timeInit = Date.now();
    }

    get text() {
        return typeof this._textGetter === 'function' 
            ? this._textGetter.call(this) 
            : this._textGetter || this.name;
    }

    // ⭐ NEW METHOD
    updateDimensions(buffer, palette) {
        if (this.autoSize) {
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

    setVisibility(visible) {
        if (typeof visible === 'boolean') {
            this.isVisible = visible;
        } else {
            this.isVisible = false;
        }
    }
    
    checkHover(mx, my) {
        if (!this.isVisible) {
            this.isHovered = false;
            return false;
        }
        
        if (this.isCentered) {
            let p1 = this._toCenter(mx, my);
            mx = p1.x;
            my = p1.y;
        }
        this.isHovered = mx > this.x && mx < this.x + this.w && my > this.y && my < this.y + this.h;
        return this.isHovered;
    }
    
    checkPressed(mx, my) {
        if (!this.isVisible) {
            this.isHovered = false;
            this.isPressed = false;
            return false;
        }

        let pressed;
        if (this.isCentered) {
            let p1 = this._toCenter(mx, my);
            mx = p1.x;
            my = p1.y;
        }

        pressed = mx > this.x && mx < this.x + this.w && my > this.y && my < this.y + this.h;
        this.isPressed = pressed;
        return pressed;
    }

    clicked() {
        if (this.isToggle) {
            this.isSelected = !this.isSelected;
        }

        if (this.onClick) {
            this.onClick(this);
        } else {
            console.log("(default log) You clicked " + this.name);
        }
    }

    release(mx, my) {
        if (this.isPressed) {
            if (this.checkHover(mx, my)) {
                this.clicked();
            }
        }
        let pressed = this.isPressed;
        this.isPressed = false;

        return pressed;
    }

    print(buffer, palette, appState) {
        if (this.isVisible) {
            this.updateDimensions(buffer, palette); // ⭐ NEW

            let x = this.x;
            let y = this.y;

            if (this.isCentered) {
                let p = this._toTopLeft(x, y);
                x = p.x;
                y = p.y;
            }

            // Determine fill color based on state
            buffer.fill(palette.getColor(this.color));
            if (this.isSelected) buffer.fill(palette.getColor(this.colorSelected));
            if (this.isHovered) buffer.fill(palette.getColor(this.colorHovered));
            if (this.isPressed) buffer.fill(palette.getColor(this.colorPressed));

            buffer.strokeWeight(this.strokeWeight);
            buffer.stroke(palette.getColor(this.strokeColor));

            buffer.rect(x, y, this.w, this.h, this.rectRound);

            // text: ⭐ UPDATED
            buffer.noStroke();
            buffer.textAlign(buffer.CENTER, buffer.CENTER);
            buffer.textFont(palette.getFont());
            buffer.fill(palette.getColor('fontColor'));
            buffer.textSize(this.textSize); // ⭐ Use this.textSize instead of hardcoded 24
            buffer.text(this.text, x + this.w/2, y + this.h/2);
        }
    }

    _toTopLeft(centerx, centery) {
        return {
            x: centerx - this.w/2,
            y: centery - this.h/2
        }
    }

    _toCenter(topleftx, toplefty) {
        return {
            x: topleftx + this.w/2,
            y: toplefty + this.h/2
        }
    }
}