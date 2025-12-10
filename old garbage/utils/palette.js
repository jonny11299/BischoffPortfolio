/*

    Stores all the colors for sketches

    Allows you to change the colortheme effortlessly


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
    this.appState = appState;

    // Current theme
    this.currentTheme = 'dark';

    this.fallbacktheme = 'dark';
    this.fallbackColor = '1'

    this.errorColor = [255, 0, 255]; // hot pink is error color

    this.fallBackFont = 'Arial';


    // Define color themes
    // Should define button themes...

    // buttonColor
    // buttonHovered
    // buttonPressed
    // buttonSelected
    this.themes = {
        dark: {
            background: [20, 20, 30],
            1: [100, 200, 255],      // Cool blue
            2: [255, 100, 150],      // Warm pink
            buttonColor: [100, 255, 150],      // Bright mint green
            buttonHovered: [180, 100, 255],      // Vibrant purple
            buttonPressed: [255, 220, 100],      // Warm yellow (energetic highlight)
            buttonSelected: [100, 255, 255],      // Cyan (cool tech accent)
            accent: [255, 200, 50],  // Golden orange
            text: [255, 255, 255],
            stroke: [200, 210, 225],
            strokeWeight: 3,
            font: 'Arial',
            fontColor: [255, 255, 255]
        },
        light: {
            background: [240, 240, 245],
            1: [50, 100, 200],       // Deep blue
            2: [200, 50, 100],       // Deep rose
            buttonColor: [50, 180, 100],       // Forest green
            buttonHovered: [120, 50, 180],       // Deep purple
            buttonPressed: [220, 140, 50],       // Amber/rust (warm earthy tone)
            buttonSelected: [50, 160, 180],       // Teal (cool professional accent)
            accent: [200, 120, 30],  // Burnt orange (sophisticated pop)
            text: [20, 20, 20],
            stroke: [60, 60, 70],
            strokeWeight: 3,
            font: 'Arial',
            fontColor: [20, 20, 20]
        },
        sunset: {
            background: [200, 255, 210],  // Very light cool gray (neutral base)
            1: [100, 150, 230],           // Medium sky blue (stronger blue)
            2: [255, 180, 120],           // Rich peach (warmer, more saturated)
            buttonColor: [255, 130, 150],           // Vibrant coral pink (punchier)
            buttonHovered: [200, 160, 240],           // Soft lavender (distinct from blues/pinks)
            buttonPressed: [120, 180, 210],           // Deep sky blue (cooler contrast)
            buttonSelected: [255, 140, 100],           // Bold salmon-orange (warm pop)
            accent: [255, 170, 80],       // Bright golden peach (clear highlight)
            text: [50, 45, 70],           // Dark slate purple (strong readability)
            stroke: [100, 90, 120],       // Deep purple-gray (clear definition)
            strokeWeight: 3,
            font: 'Arial',
            fontColor: [50, 45, 70]
        },
        entrance: {
            background: [20, 20, 30],
            1: [100, 200, 255, 130],      // Cool blue
            2: [255, 100, 150, 130],      // Warm pink
            buttonColor: [50, 200, 200, 130],      // Bright mint green
            buttonHovered: [100, 220, 220, 210],      // Bright mint green
            buttonPressed: [255, 220, 100, 130],      // Warm yellow (energetic highlight)
            buttonSelected: [100, 255, 255, 130],      // Cyan (cool tech accent)
            accent: [255, 200, 50, 190],  // Golden orange
            text: [255, 255, 255, 255],   // White
            stroke: [240, 240, 240, 255], // translucent yellow
            strokeWeight: 3,
            font: 'Arial',
            fontColor: [255, 255, 255, 255]
        },

        // CLASSIC TRON - Deep blue/cyan with orange accents
        tronClassic: {
            background: [5, 10, 20],              // Almost black blue
            1: [0, 200, 255, 130],                // Cyan glow
            2: [0, 150, 255, 130],                // Deep cyan
            buttonColor: [0, 220, 255, 130],      // Bright cyan
            buttonHovered: [100, 240, 255, 210],  // Lighter cyan
            buttonPressed: [255, 140, 0, 180],    // Orange flash
            buttonSelected: [0, 255, 255, 180],   // Electric cyan
            accent: [255, 140, 0, 190],           // Tron orange
            text: [200, 240, 255, 255],           // Cool white
            stroke: [0, 255, 255, 200],           // Cyan stroke
            strokeWeight: 2,
            font: 'Rajdhani',                  // Tech font
            fontColor: [200, 240, 255, 255]
        },

        // TRON LEGACY - Cooler palette with ice blue
        tronLegacy: {
            background: [8, 12, 18],              // Deep navy
            1: [80, 200, 255, 130],               // Ice blue
            2: [140, 180, 255, 130],              // Lavender blue
            buttonColor: [100, 210, 255, 220],    // Sky blue
            buttonHovered: [150, 230, 255, 240],  // Bright ice
            buttonPressed: [255, 180, 80, 220],   // Warm amber
            buttonSelected: [120, 220, 255, 220], // Selected blue
            accent: [255, 170, 80, 190],          // Amber accent
            text: [220, 240, 255, 255],           // Icy white
            stroke: [100, 220, 255, 200],         // Blue glow
            strokeWeight: 2,
            font: 'Orbitron',
            fontColor: [220, 240, 255, 255]
        },

        // NEON GRID - More purple/magenta to match your cubes
        neonGrid: {
            background: [15, 5, 25],              // Deep purple-black
            1: [150, 100, 255, 130],              // Electric purple
            2: [255, 50, 200, 130],               // Hot pink
            buttonColor: [180, 100, 255, 130],    // Neon purple
            buttonHovered: [200, 150, 255, 210],  // Bright purple
            buttonPressed: [255, 220, 0, 180],    // Yellow flash
            buttonSelected: [255, 100, 255, 180], // Magenta
            accent: [0, 255, 200, 190],           // Cyan-green contrast
            text: [240, 220, 255, 255],           // Warm white
            stroke: [180, 120, 255, 200],         // Purple glow
            strokeWeight: 2,
            font: 'Audiowide',
            fontColor: [240, 220, 255, 255]
        },

        // DARK CYBER - Matches your cube's purple/cyan range
        darkCyber: {
            background: [10, 8, 18],              // Almost black
            1: [100, 200, 255, 130],              // Your current cyan
            2: [200, 100, 255, 130],              // Purple to match cubes
            buttonColor: [150, 150, 255, 130],    // Mid purple-blue
            buttonHovered: [180, 180, 255, 210],  // Lighter
            buttonPressed: [0, 255, 200, 180],    // Cyan flash
            buttonSelected: [200, 150, 255, 180], // Purple select
            accent: [0, 255, 180, 190],           // Cyan-teal
            text: [230, 230, 255, 255],           // Clean white
            stroke: [150, 180, 255, 200],         // Soft glow
            strokeWeight: 2,
            font: 'Share Tech Mono',
            fontColor: [230, 230, 255, 255]
        },

        // DIGITAL VOID - Ultra minimal, cold
        digitalVoid: {
            background: [2, 4, 8],                // True black-blue
            1: [0, 180, 255, 100],                // Transparent cyan
            2: [80, 140, 255, 100],               // Transparent blue
            buttonColor: [0, 200, 255, 100],      // Ghost cyan
            buttonHovered: [0, 255, 255, 180],    // Solid cyan
            buttonPressed: [255, 255, 255, 200],  // White flash
            buttonSelected: [0, 255, 255, 150],   // Bright cyan
            accent: [255, 255, 255, 220],         // Pure white
            text: [180, 220, 255, 255],           // Ice white
            stroke: [0, 200, 255, 150],           // Thin cyan
            strokeWeight: 1,
            font: 'Rajdhani',
            fontColor: [180, 220, 255, 255]
        }
    };

    // Methods
    this.settheme = function(themeName) {
        if (!this.themes[themeName]){
            // can't find themeName
            // Error handling:
            console.error("theme " + themeName + " not found in function settheme()");
            this.currentTheme = this.fallbacktheme;
        }else{
            // found themeName in themes
            this.currentTheme = themeName;
            appState.theme = themeName;
        }
    };

    this.gettheme = function(){
        return this.currentTheme;
    }




    // get a color from the currently selected theme
    // allows for modifying transparency "alpha" of the colors now.
    // YOU HAVE TO PASS IN COLORNAME AS A STRING IF IT'S ACCESSING THEME COLOR, else it defaults to RGP
    this.getColor = function(colorName, alpha = -1) {

        let c;
        let r, g, b, a;

        if (typeof colorName !== 'string'){
            let c = colorName;
            if (Array.isArray(c)){
                if (c.length === 4){
                    [r, g, b, a] = c;
                    // this statement says, "if we've specified a different alpha, accept it. Else, leave from the palette."
                    if (alpha !== -1) a = alpha;
                }else if (c.length === 3){
                    [r, g, b] = c;
                    a = alpha;
                }else{
                    throw new Error('getColor with non-string getting an array of length not 3 or 4 ');
                }
            }else if (typeof c === 'number') {
                // treat as greyscale
                [r, g, b, a] = [c, c, c, alpha]
            }else{
                throw new Error("getColor with non-string got neither array nor number, but " + typeof c);
            }
        }


        const theme = this.themes[this.currentTheme];

        // Can't find current theme:
        if (!theme){
            console.error("theme " + this.currentTheme + " not found in function getColor()");
            return this.errorColor;
        }

        // Can't find color in theme:
        if (!theme[colorName]){
            console.error("Color " + colorName + " not found in " + this.currentTheme + " in function getColor()");
            if (colorName.toLowerCase() === 'text'){
                return this.fallbackColor;
            }else{
                return this.errorColor;
            }
            
        }

        c = theme[colorName];

        if (Array.isArray(c)){
            if (c.length === 4){
                [r, g, b, a] = c;
                // this statement says, "if we've specified a different alpha, accept it. Else, leave from the palette."
                if (alpha !== -1) a = alpha;
            }else if (c.length === 3){
                [r, g, b] = c;
                a = alpha;
            }else{
                throw new Error('getColor getting an array of length not 3 or 4 ');
            }
        }else if (typeof c === 'number') {
            // treat as greyscale
            [r, g, b, a] = [c, c, c, alpha]
        }else{
            throw new Error("getColor got neither array nor number, but " + typeof c);
        }

        // Successful case:
        if (a === -1) a = 255;
        return [r, g, b, a];
    };



    // opacity should be (0 - 1);
    this.getColorWithOpacity = function(colorName, opacity, alpha = -1){

        if (typeof opacity !== 'number'){
            console.error("Not sure why you'd pass in " + typeof opacity + " for opacity...");
        }
        if (opacity < 0){
            opacity = 0;
        }
        if (opacity > 1){
            opacity = 1;
        }

        let c = this.getColor(colorName, alpha);
        let r, g, b, a;
        [r, g, b, a] = [c[0], c[1], c[2], c[3]];
        a = a * opacity;
        return [r, g, b, a];
    }


    this.getStrokeWeight = function(){
        const theme = this.themes[this.currentTheme];

        // Can't find current theme:
        if (!theme){
            console.error("theme " + this.currentTheme + " not found in function getStrokeWeight()");
            return 1; // default to strokeWeight of 1
        }

        // Can't find strokeWeight in theme:
        if (!theme['strokeWeight']){
            console.error("strokeWeight not found in " + this.currentTheme + " in function getStrokeWeight()");
            return 1; // default to strokeWeight of 1
        }

        return theme['strokeWeight'];
    }


    this.getFont = function(){
        const theme = this.themes[this.currentTheme];

        // Can't find current theme:
        if (!theme){
            console.error("theme " + this.currentTheme + " not found in function getFont()");
            return this.errorColor;
        }

        // Can't find color in theme:
        if (!theme['font']){
            console.error("font not found in " + this.currentTheme + " in function getFont()");
            return this.fallBackFont;
        }

        return theme['font']
    }





    /* All of the following functions, except maybe lerpColors and fonttheme, are completely useless
    because I can already easily do any of them with p.fill(palette.getColor('colorname')); any time I want
    to select a specific color.

    The reason this grew so enormous is because I didn't stop and wander around and think about
    why I felt I needed to do this,
    I just kept on building it out hugely because I felt I needed to.
    I was too feverishly coding in a "get it done, and abstractly setup everything" instead of
    "I am trying to create a specific product here that I'm aiming for."

    */



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
        // okay, so the theme color may or may not have an alpha component.
        // we also may or may not use alpha here. So, these cases:
        // no alpha in theme, no alpha defined = use solid color
        // alpha in theme, no alpha defined = use alpha in theme
        // no alpha in theme, alpha defined = use alpha defined
        // alpha in theme, alpha defined = use alpha defined
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
        const theme = this.themes[this.currentTheme];

        // Can't find current theme:
        if (!theme){
            console.error("theme " + this.currentTheme + " not found in function fontTheme()");
            p.fill(this.errorColor);
            p.textFont(this.fallBackFont);
        }

        // Can't find color in theme:
        if (!theme['font']){
            console.error("Font 'font' not found in function fontTheme()");
            p.textFont(this.fallBackFont);
        }else{
            p.textFont(theme['font']);
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