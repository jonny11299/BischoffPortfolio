/**
 * CubesLayer - Self-contained WEBGL vaporwave cubes with bloom
 * 
 * Usage:
 *   import CubesLayer from './CubesLayer.js';
 * 
 *   let cubesLayer;
 * 
 *   p.setup = function() {
 *     cubesLayer = new CubesLayer(p, width, height);
 *   }
 * 
 *   p.draw = function() {
 *     // Get the rendered layer as an image
 *     let cubesImage = cubesLayer.render();
 *     
 *     // Draw it wherever you want
 *     p.image(cubesImage, 0, 0);
 *     
 *     // Continue with your normal 2D code...
 *   }
 */

export default class CubesLayer {
  constructor(p5Instance, width, height, numCubes = 30) {
    this.p = p5Instance;
    this.width = width;
    this.height = height;
    
    // FIXED resolution - never changes
    this.renderScale = 0.5;
    
    // Calculate actual render dimensions
    const renderW = Math.floor(width * this.renderScale);
    const renderH = Math.floor(height * this.renderScale);
    
    // WEBGL graphics buffer at reduced resolution
    this.gl = this.p.createGraphics(renderW, renderH, this.p.WEBGL);
    this.gl.pixelDensity(1);
    
    // Framebuffers for bloom pipeline
    this.sceneBuffer = this.gl.createFramebuffer({ antialias: true });
    this.blurHBuffer = this.gl.createFramebuffer();
    this.blurVBuffer = this.gl.createFramebuffer();
    
    // Create shaders
    this.blurHShader = this.gl.createShader(this._blurVert(), this._blurHFrag());
    this.blurVShader = this.gl.createShader(this._blurVert(), this._blurVFrag());
    
    // Cube data
    this.cubes = [];
    this._initCubes(numCubes);
    
    // Vaporwave colors
    this.vaporYellow = [255, 230, 80];
    this.vaporPink = [255, 80, 150];
  }

  _initCubes(numCubes) {
    // Spread cubes based on RENDER dimensions
    const renderWidth = this.width * this.renderScale;
    const renderHeight = this.height * this.renderScale;
    
    const spreadX = renderWidth * 0.6;
    const spreadY = renderHeight * 0.5;
    const spreadZ = 800;
    
    const maxAttempts = 100; // Prevent infinite loops
    
    for (let i = 0; i < numCubes; i++) {
      let validPosition = false;
      let attempts = 0;
      let x, y, z, size, bobAmount, boundingSphereRadius;
      
      while (!validPosition && attempts < maxAttempts) {
        attempts++;
        
        // Generate random position and size
        x = this.p.random(-spreadX, spreadX);
        y = this.p.random(-spreadY, spreadY);
        z = this.p.random(-spreadZ, 200);
        size = this.p.random(30, 100);
        bobAmount = this.p.random(20, 60);
        
        // Bounding sphere radius = half diagonal of cube + bob range
        boundingSphereRadius = (size * Math.sqrt(3)) / 2 + bobAmount;
        
        // Check against all existing cubes
        validPosition = true;
        for (let existing of this.cubes) {
          const dx = x - existing.x;
          const dy = y - existing.y;
          const dz = z - existing.z;
          const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
          
          // Add their bounding sphere radii + 20% padding
          const minDistance = (boundingSphereRadius + existing.boundingSphereRadius) * 1.2;
          
          if (distance < minDistance) {
            validPosition = false;
            break;
          }
        }
      }
      
      if (!validPosition) {
        console.warn(`Could not find non-overlapping position for cube ${i} after ${maxAttempts} attempts`);
        // Continue anyway with last attempt - better than having fewer cubes
      }
      
      const hue = this.p.random(160, 280);
      const specularRGB = this._hsbToRgb(hue, 60, 90);
      const emissiveRGB = this._hsbToRgb(hue, 80, 30);
      
      this.cubes.push({
        x,
        y,
        z,
        size,
        boundingSphereRadius, // Store this for future reference
        phaseOffset: this.p.random(0, Math.PI * 2),
        rotationSpeed: this.p.random(0.3, 1.2),
        bobSpeed: this.p.random(1.5, 3),
        bobAmount,
        specularR: specularRGB[0],
        specularG: specularRGB[1],
        specularB: specularRGB[2],
        emissiveR: emissiveRGB[0],
        emissiveG: emissiveRGB[1],
        emissiveB: emissiveRGB[2],
      });
    }
  }
  
  // Convert HSB (0-360, 0-100, 0-100) to RGB (0-255, 0-255, 0-255)
  _hsbToRgb(h, s, b) {
    s = s / 100;
    b = b / 100;
    h = h / 60;
    
    const c = b * s;
    const x = c * (1 - Math.abs((h % 2) - 1));
    const m = b - c;
    
    let r, g, bl;
    
    if (h < 1) {
      [r, g, bl] = [c, x, 0];
    } else if (h < 2) {
      [r, g, bl] = [x, c, 0];
    } else if (h < 3) {
      [r, g, bl] = [0, c, x];
    } else if (h < 4) {
      [r, g, bl] = [0, x, c];
    } else if (h < 5) {
      [r, g, bl] = [x, 0, c];
    } else {
      [r, g, bl] = [c, 0, x];
    }
    
    return [
      Math.round((r + m) * 255),
      Math.round((g + m) * 255),
      Math.round((bl + m) * 255)
    ];
  }
  
  render() {
    const t = this.p.millis() / 1000;
    const gl = this.gl;
    
    // === PASS 1: Render scene to framebuffer ===
    this.sceneBuffer.begin();
    gl.clear();
    
    // Vaporwave sun lighting (10 second cycle)
    const sunCycle = (Math.sin(t * (2 * Math.PI / 10)) + 1) / 2;
    const sunR = this.p.lerp(this.vaporPink[0], this.vaporYellow[0], sunCycle);
    const sunG = this.p.lerp(this.vaporPink[1], this.vaporYellow[1], sunCycle);
    const sunB = this.p.lerp(this.vaporPink[2], this.vaporYellow[2], sunCycle);
    
    gl.pointLight(sunR, sunG, sunB, 0, -400, 200);
    gl.pointLight(40, 20, 60, 0, 400, 100);
    gl.ambientLight(15, 10, 25);
    
    // Render all cubes (no color mode switching needed!)
    for (let cube of this.cubes) {
      const cubeTime = t + cube.phaseOffset;
      
      gl.push();
      
      const bobHeight = Math.sin(cubeTime * cube.bobSpeed) * cube.bobAmount;
      gl.translate(cube.x, cube.y + bobHeight, cube.z);
      
      gl.rotateY(cubeTime * cube.rotationSpeed);
      gl.rotateX(0.3 + Math.sin(cubeTime * 0.5) * 0.2);
      
      // Solid black stroke
      gl.stroke(0);
      gl.strokeWeight(5);
      
      // Use pre-calculated RGB colors
      gl.specularMaterial(cube.specularR, cube.specularG, cube.specularB);
      gl.shininess(50);
      gl.emissiveMaterial(cube.emissiveR, cube.emissiveG, cube.emissiveB);
      
      gl.box(cube.size);
      
      gl.pop();
    }
    
    this.sceneBuffer.end();
    
    // === PASS 2: Horizontal blur ===
    this.blurHBuffer.begin();
    gl.clear();
    gl.shader(this.blurHShader);
    this.blurHShader.setUniform('tex0', this.sceneBuffer.color);
    this.blurHShader.setUniform('texelSize', [1.0 / gl.width, 1.0 / gl.height]);
    this.blurHShader.setUniform('blurRadius', 2.0);
    gl.rect(-gl.width/2, -gl.height/2, gl.width, gl.height);
    this.blurHBuffer.end();
    
    // === PASS 3: Vertical blur ===
    this.blurVBuffer.begin();
    gl.clear();
    gl.shader(this.blurVShader);
    this.blurVShader.setUniform('tex0', this.blurHBuffer.color);
    this.blurVShader.setUniform('texelSize', [1.0 / gl.width, 1.0 / gl.height]);
    this.blurVShader.setUniform('blurRadius', 2.0);
    gl.rect(-gl.width/2, -gl.height/2, gl.width, gl.height);
    this.blurVBuffer.end();
    
    // === PASS 4: Composite to main layer ===
    gl.resetShader();
    gl.clear();
    
    // Sharp scene
    gl.push();
    gl.imageMode(this.p.CENTER);
    gl.blendMode(this.p.BLEND);
    gl.image(this.sceneBuffer.color, 0, 0, gl.width, gl.height);
    gl.pop();
    
    // Bloom
    gl.push();
    gl.imageMode(this.p.CENTER);
    gl.blendMode(this.p.ADD);
    gl.tint(255, 180);
    gl.image(this.blurVBuffer.color, 0, 0, gl.width, gl.height);
    gl.tint(255, 100);
    gl.image(this.blurVBuffer.color, 0, 0, gl.width * 1.01, gl.height * 1.01);
    gl.pop();
    
    gl.blendMode(this.p.BLEND);
    
    // Return the graphics buffer to be drawn by caller
    return this.gl;
  }
  
  // Shader code
  _blurVert() {
    return `
      precision highp float;
      attribute vec3 aPosition;
      attribute vec2 aTexCoord;
      varying vec2 vTexCoord;
      
      void main() {
        vTexCoord = aTexCoord;
        vec4 positionVec4 = vec4(aPosition, 1.0);
        positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
        gl_Position = positionVec4;
      }
    `;
  }
  
  _blurHFrag() {
    return `
      precision highp float;
      varying vec2 vTexCoord;
      uniform sampler2D tex0;
      uniform vec2 texelSize;
      uniform float blurRadius;
      
      void main() {
        vec4 sum = vec4(0.0);
        
        float kernel[11];
        kernel[0] = 0.0044;
        kernel[1] = 0.0175;
        kernel[2] = 0.0540;
        kernel[3] = 0.1295;
        kernel[4] = 0.2420;
        kernel[5] = 0.3163;
        kernel[6] = 0.2420;
        kernel[7] = 0.1295;
        kernel[8] = 0.0540;
        kernel[9] = 0.0175;
        kernel[10] = 0.0044;
        
        for (int i = -5; i <= 5; i++) {
          vec2 offset = vec2(float(i) * texelSize.x * blurRadius, 0.0);
          sum += texture2D(tex0, vTexCoord + offset) * kernel[i + 5];
        }
        
        gl_FragColor = sum;
      }
    `;
  }
  
  _blurVFrag() {
    return `
      precision highp float;
      varying vec2 vTexCoord;
      uniform sampler2D tex0;
      uniform vec2 texelSize;
      uniform float blurRadius;
      
      void main() {
        vec4 sum = vec4(0.0);
        
        float kernel[11];
        kernel[0] = 0.0044;
        kernel[1] = 0.0175;
        kernel[2] = 0.0540;
        kernel[3] = 0.1295;
        kernel[4] = 0.2420;
        kernel[5] = 0.3163;
        kernel[6] = 0.2420;
        kernel[7] = 0.1295;
        kernel[8] = 0.0540;
        kernel[9] = 0.0175;
        kernel[10] = 0.0044;
        
        for (int i = -5; i <= 5; i++) {
          vec2 offset = vec2(0.0, float(i) * texelSize.y * blurRadius);
          sum += texture2D(tex0, vTexCoord + offset) * kernel[i + 5];
        }
        
        gl_FragColor = sum;
      }
    `;
  }
  
  // Update dimensions if canvas resizes
  resize(newWidth, newHeight) {
    this.width = newWidth;
    this.height = newHeight;
    
    // Calculate new render dimensions at fixed scale
    const renderW = Math.floor(newWidth * this.renderScale);
    const renderH = Math.floor(newHeight * this.renderScale);
    
    // Dispose old framebuffers
    if (this.sceneBuffer) this.sceneBuffer.remove();
    if (this.blurHBuffer) this.blurHBuffer.remove();
    if (this.blurVBuffer) this.blurVBuffer.remove();
    
    // Dispose old graphics buffer
    if (this.gl) {
      this.gl.remove();
    }
    
    // Create new buffer at fixed render scale
    this.gl = this.p.createGraphics(renderW, renderH, this.p.WEBGL);
    this.gl.pixelDensity(1);
    
    // Recreate framebuffers
    this.sceneBuffer = this.gl.createFramebuffer({ antialias: true });
    this.blurHBuffer = this.gl.createFramebuffer();
    this.blurVBuffer = this.gl.createFramebuffer();
    
    // Recreate shaders
    this.blurHShader = this.gl.createShader(this._blurVert(), this._blurHFrag());
    this.blurVShader = this.gl.createShader(this._blurVert(), this._blurVFrag());
  }
  
  // Rescale cube positions based on new dimensions (preserves relative positions)
  rescale(newWidth, newHeight) {
    // Calculate scale factors
    const scaleX = newWidth / this.width;
    const scaleY = newHeight / this.height;
    
    // Update each cube's position proportionally
    for (let cube of this.cubes) {
      cube.x *= scaleX;
      cube.y *= scaleY;
      // Z-depth doesn't scale with screen size, keep it the same
    }
    
    // Update dimensions and resize canvas
    this.resize(newWidth, newHeight);
  }
}