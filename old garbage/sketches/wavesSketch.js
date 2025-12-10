export function wavesSketch(p, appState) {
  let waves = [];
  
  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    // Access shared state
    console.log('Theme:', appState.theme);
  };
  
  p.draw = function() {
    p.background(appState.theme === 'dark' ? 20 : 240);
    // Your wave drawing code...
  };
  
  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
}