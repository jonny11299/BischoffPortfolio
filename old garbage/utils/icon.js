import { appState } from "./appState";
/*
    stores different icons that the user can interact with
*/


/*
    p (processing)
    palette (from parent)

    name,
    x, y, w, h,
    color, colorHovered, colorSelected (default to from palette)
    round,

    isHovered();
    isSelected();
    
    onClick();

    print();
*/



export function Icon(p, palette, config) {
    this.p = p;
    this.palette = palette;

    this.name = config.name;
    this.x = config.x;
    this.y = config.y;
    this.w = config.w;
    this.h = config.h;
    this.color = config.color;
    this.round = config.round || 0;

    this.isSelected = false;

    // Store custom callbacks
    this.onClickCallback = config.onClick || null;
    this.customPrint = config.print || null;
    
    this.isHovered = function() {
        return this.p.mouseX >= this.x && this.p.mouseX <= this.x + this.w &&
               this.p.mouseY >= this.y && this.p.mouseY <= this.y + this.h;
    };
    
    this.isSelected = function() {
        /* tell where mouse is */ 

        // return appState.selectedTool === this.name;
    };
    
    this.onClick = function() {
        if (this.onClickCallback) {
            this.onClickCallback(this.name, appState);
        }
    };
    
    this.print = function() {
        // Default rendering
        if (this.customPrint) {
            this.customPrint.call(this);  // Custom rendering
        } else {
            // Default button rendering
            this.p.fill(this.color);
            this.p.rect(this.x, this.y, this.w, this.h, this.round);
        }
    };
}





// Courtesy of Claude:
export function ClaudeIcon(p, appState, palette, config) {
    this.p = p;
    this.palette = palette;

    this.name = config.name;
    this.x = config.x;
    this.y = config.y;
    this.w = config.w;
    this.h = config.h;
    this.color = config.color;
    this.round = config.round || 0;

    // Store custom callbacks
    this.onClickCallback = config.onClick || null;
    this.customPrint = config.print || null;
    
    this.isHovered = function() {
        return this.p.mouseX >= this.x && this.p.mouseX <= this.x + this.w &&
               this.p.mouseY >= this.y && this.p.mouseY <= this.y + this.h;
    };
    
    this.isSelected = function() {
        return appState.selectedTool === this.name;
    };
    
    this.onClick = function() {
        if (this.onClickCallback) {
            this.onClickCallback(this.name, appState);
        }
    };
    
    this.print = function() {
        // Default rendering
        if (this.customPrint) {
            this.customPrint.call(this);  // Custom rendering
        } else {
            // Default button rendering
            this.p.fill(this.color);
            this.p.rect(this.x, this.y, this.w, this.h, this.round);
        }
    };
}

// Usage in parent sketch:
let brushIcon = new Icon(p, appState, palette, {
    name: 'brush',
    x: 10, y: 10, w: 50, h: 50,
    color: [100, 200, 255],
    onClick: function(name, appState) {
        appState.selectedTool = name;
        console.log(name + " selected!");
    },
    print: function() {
        // Custom rendering for brush icon
        let col = this.isSelected() ? [255, 200, 50] : this.color;
        this.p.fill(col);
        this.p.rect(this.x, this.y, this.w, this.h, this.round);
    }
});