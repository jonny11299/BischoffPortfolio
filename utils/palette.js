/*

    Stores all the colors for sketches

    Allows you to change the colorscheme effortlessly


*/


// Focus for now:
// 1. define Palette
// 2. Implement in template
// 3. define appState to pass state variables across sketches


// To do:
// potential issue #4
// potential issue #6


// New class
export function Palette(p, appState){

    this.p = p;

    // Current scheme
    this.currentScheme = 'dark';

    this.fallbackScheme = 'dark';
    this.fallbackColor = '1'

    this.errorColor = [255, 0, 255]; // hot pink is error color

    this.fallBackFont = 'Arial';


    // Define color schemes
    this.schemes = {
        // 1 for neutral
        // 3 for selected
        // 4 for hovered
        dark: {
            background: [20, 20, 30],
            1: [100, 200, 255],      // Cool blue
            2: [255, 100, 150],      // Warm pink
            3: [100, 255, 150],      // Bright mint green
            4: [180, 100, 255],      // Vibrant purple
            5: [255, 220, 100],      // Warm yellow (energetic highlight)
            6: [100, 255, 255],      // Cyan (cool tech accent)
            accent: [255, 200, 50],  // Golden orange
            text: [255, 255, 255],
            stroke: [200, 210, 225],
            strokeWeight: 3,
            font: 'Arial'
        },
        light: {
            background: [240, 240, 245],
            1: [50, 100, 200],       // Deep blue
            2: [200, 50, 100],       // Deep rose
            3: [50, 180, 100],       // Forest green
            4: [120, 50, 180],       // Deep purple
            5: [220, 140, 50],       // Amber/rust (warm earthy tone)
            6: [50, 160, 180],       // Teal (cool professional accent)
            accent: [200, 120, 30],  // Burnt orange (sophisticated pop)
            text: [20, 20, 20],
            stroke: [60, 60, 70],
            strokeWeight: 3,
            font: 'Arial'
        },
        sunset: {
            background: [200, 255, 210],  // Very light cool gray (neutral base)
            1: [100, 150, 230],           // Medium sky blue (stronger blue)
            2: [255, 180, 120],           // Rich peach (warmer, more saturated)
            3: [255, 130, 150],           // Vibrant coral pink (punchier)
            4: [200, 160, 240],           // Soft lavender (distinct from blues/pinks)
            5: [120, 180, 210],           // Deep sky blue (cooler contrast)
            6: [255, 140, 100],           // Bold salmon-orange (warm pop)
            accent: [255, 170, 80],       // Bright golden peach (clear highlight)
            text: [50, 45, 70],           // Dark slate purple (strong readability)
            stroke: [100, 90, 120],       // Deep purple-gray (clear definition)
            strokeWeight: 3,
            font: 'Arial'
        },
        entrance: {
            background: [20, 20, 30],
            1: [100, 200, 255, 130],      // Cool blue
            2: [255, 100, 150, 130],      // Warm pink
            3: [100, 255, 255, 130],      // Bright mint green
            4: [100, 255, 255, 210],      // Bright mint green
            5: [255, 220, 100, 130],      // Warm yellow (energetic highlight)
            6: [100, 255, 255, 130],      // Cyan (cool tech accent)
            accent: [255, 200, 50, 190],  // Golden orange
            text: [255, 255, 255, 255],   // White
            stroke: [240, 240, 240, 255], // translucent yellow
            strokeWeight: 3,
            font: 'Arial'
        }
    };

    // Methods
    this.setScheme = function(schemeName) {
        if (!this.schemes[schemeName]){
            // can't find schemeName
            // Error handling:
            console.error("Scheme " + schemeName + " not found in function setScheme()");
            this.currentScheme = this.fallbackScheme;
        }else{
            // found schemeName in schemes
            this.currentScheme = schemeName;
        }
    };

    this.getScheme = function(){
        return this.currentScheme;
    }



    // put the error checks in a function
    this.getColor = function(colorName) {
        const scheme = this.schemes[this.currentScheme];

        // Can't find current scheme:
        if (!scheme){
            console.error("Scheme " + this.currentScheme + " not found in function getColor()");
            return this.errorColor;
        }

        // Can't find color in scheme:
        if (!scheme[colorName]){
            console.error("Color " + colorName + " not found in " + this.currentScheme + " in function getColor()");
            if (colorName.toLowerCase() === 'text'){
                return this.fallbackColor;
            }else{
                return this.errorColor;
            }
            
        }

        let c = scheme[colorName];
        let r, g, b, a;
        if (Array.isArray(c)){
            if (c.length === 4){
                [r, g, b, a] = c;
            }else if (c.length === 3){
                [r, g, b] = c;
                a = 255;
            }else{
                throw new Error('getColor getting an array of length not 3 or 4 ');
            }
        }else if (typeof c === 'number') {
            // treat as greyscale
            [r, g, b, a] = [c, c, c, 255]
        }else{
            throw new Error("getColor got neither array nor number, but " + typeof c);
        }

        // Successful case:
        return [r, g, b, a];
    };

    this.getStrokeWeight = function(){
        const scheme = this.schemes[this.currentScheme];

        // Can't find current scheme:
        if (!scheme){
            console.error("Scheme " + this.currentScheme + " not found in function getStrokeWeight()");
            return 1; // default to strokeWeight of 1
        }

        // Can't find strokeWeight in scheme:
        if (!scheme['strokeWeight']){
            console.error("strokeWeight not found in " + this.currentScheme + " in function getStrokeWeight()");
            return 1; // default to strokeWeight of 1
        }

        return scheme['strokeWeight'];
    }


    // sets the background based on custom color
    this.background = function(color){
        let r, g, b, a = 255;
        if (Array.isArray(color)) {
            if (color.length === 4) [r, g, b, a] = color;
            else if (color.length === 3) [r, g, b] = color;
        } else if (typeof color === 'number'){
            r = g = b = color;
        }else{
            throw new Error('background function passing in weird type, ' + typeof color);
        }
        this.p.background(r, g, b, a);
    }

    // sets the background based on theme
    this.backgroundTheme = function() {
        this.background(this.getColor('background'));
    }

    // fills custom color
    this.fill = function(color){
        let r, g, b, alpha = 255;
        let err = false;

        if (Array.isArray(color)) {
            if (color.length === 4) [r, g, b, alpha] = color;
            else if (color.length === 3) [r, g, b] = color;
            else err = "color array is mis-sized, color.length === " + color.length;
        } else if (typeof color === 'number'){
            // treat as grayscale
            r = g = b = color;
        } else {
            err = "color is neither array nor number, but " + typeof color;
        }

        if (err){
            this.p.fill(this.errorColor);
            throw new Error('fill: ' + err);
        }else{
            this.p.fill(r, g, b, alpha);
        }
    }

    // fills based on theme
    this.fillTheme = function(colorName, alpha = -1){
        // okay, so the scheme color may or may not have an alpha component.
        // we also may or may not use alpha here. So, these cases:
        // no alpha in scheme, no alpha defined = use solid color
        // alpha in scheme, no alpha defined = use alpha in scheme
        // no alpha in scheme, alpha defined = use alpha defined
        // alpha in scheme, alpha defined = use alpha defined
        let c = this.getColor(colorName);
        let r, g, b;
        let err = false;

        if (Array.isArray(c)){
            if (c.length === 4){
                // set the rgb
                [r, g, b] = c;
                // set alpha if it isn't specified.
                if (alpha === -1) alpha = c[3];
                // else, alpha is specified, so keep the incoming value (no change).
            } else if (c.length === 3){
                // alpha not defined by theme -- default to 255
                [r, g, b] = c;
                if (alpha === -1) alpha = 255;
                // else, alpha is specified, so keep the incoming value (no change).
            } else {
                err = "fillTheme returned mis-sized color, c.length === " + c.length;
            }
        }
            
        if (err){
            this.p.fill(this.errorColor)
            throw new Error('fillTheme: ' + err);
        }else{
            this.fill([r, g, b, alpha]);  
        }
    }


    // Support RGB, RGBA, and greyscale
    this.stroke = function(color, weight = 1){
        let r, g, b, alpha = 255;
        let err = false;
        
        if (Array.isArray(color)) {
            if (color.length === 4) [r, g, b, alpha] = color;
            else if (color.length === 3) [r, g, b] = color;
            else err = "color array is mis-sized, color.length === " + color.length;
        } else if (typeof color === 'number'){
            // Treat as grayscale if single number
            r = g = b = color;
        } else {
            err = "color is neither array nor number, but " + typeof color;
        }

        if (err){
            this.p.stroke(this.errorColor);
            this.p.strokeWeight(1);
            throw new Error('stroke: ' + err);
        }else{
            this.p.stroke(r, g, b, alpha);
            this.p.strokeWeight(weight);
        }
    }

    this.strokeWeight = function(weight = 1){
        this.p.strokeWeight(weight);
    }


    // sets stroke based on theme
    this.strokeTheme = function(weight = undefined, alpha = -1){
        if (weight === undefined) weight = this.getStrokeWeight();
        let strokeColor = this.getColor('stroke');
        if (alpha !== -1) strokeColor[3] = alpha;  // ✅ Just modify the alpha if needed
        this.stroke(strokeColor, weight);
    }
    
    // sets to no stroke
    this.noStroke = function() {
        this.p.noStroke();
    };

    this.fontTheme = function(setDefaultColor = true, stroke = false, strokeWeight = -1){
        const scheme = this.schemes[this.currentScheme];

        // Can't find current scheme:
        if (!scheme){
            console.error("Scheme " + this.currentScheme + " not found in function fontTheme()");
            p.fill(this.errorColor);
            p.textFont(this.fallBackFont);
        }

        // Can't find color in scheme:
        if (!scheme['font']){
            console.error("Font 'font' not found in function fontTheme()");
            p.textFont(this.fallBackFont);
        }else{
            p.textFont(scheme['font']);
            if (setDefaultColor) this.fillTheme('text');
            if (stroke){
                if (strokeWeight === -1) p.noStroke();
                else p.strokeWeight(strokeWeight);
            }else{
                p.noStroke();
            }
        }

                
    }



    // Linear interpolation:
    this.lerpColors = function(c1, c2, amt) {
        let [r1, g1, b1, a1] = [255, 255, 255, 255];
        let [r2, g2, b2, a2] = [255, 255, 255, 255];
        if (typeof c1 === 'number'){
            [r1, g1, b1] = [c1, c1, c1];
        }else if (Array.isArray(c1)){
            if (c1.length === 4) [r1, g1, b1, a1] = [c1[0], c1[1], c1[2], c1[3]];
            else if (c1.length === 3) [r1, g1, b1] = [c1[0], c1[1], c1[2]];
            else throw new Error('lerpColors called with c1 array of length not 3 or 4: ' + c1.length)
        }else{
            throw new Error('lerpColors called with non-number, non-array for c1: ' + c1);
        }

        if (typeof c2 === 'number'){
            [r2, g2, b2] = [c2, c2, c2];
        }else if (Array.isArray(c2)){
            if (c2.length === 4) [r2, g2, b2, a2] = [c2[0], c2[1], c2[2], c2[3]];
            else if (c2.length === 3) [r2, g2, b2] = [c2[0], c2[1], c2[2]];
            else throw new Error('lerpColors called with c2 array of length not 3 or 4: ' + c2.length)
        }else{
             throw new Error('lerpColors called with non-number, non-array for c2: ' + c2);
        }

        return [
            this.p.lerp(r1, r2, amt),
            this.p.lerp(g1, g2, amt),
            this.p.lerp(b1, b2, amt),
            this.p.lerp(a1, a2, amt)
        ];
    }

    // Linear interpolation between two theme colors
    this.lerpColorsTheme = function(colorName1, colorName2, amt) {
        return this.lerpColors(
            this.getColor(colorName1), 
            this.getColor(colorName2), 
            amt
        );
    };
    
}