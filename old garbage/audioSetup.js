






let frames = 0; //counts how many frames have passed



const startingWidth = 800.0
const startingHeight = 800.0

// Functional variables:
let mouseDown = false

// Color variables:
let bgcolor = [0.0, 0.0, 0.0]

// Drawing variables:
let strokeWeight = 1





let player;        // p5.SoundFile
let song;          // specific song file
let input;         // p5.AudioIn
let audioMetaData
let fft;           // p5.FFT


let songFile = "./audio/howifeel.mp3"


// monitor audio in
let mic, amplitude
let micStarted = false
let playerStarted = false

// stores the last 10 frames of amplitude (for smoothing)
let ampFrames = 10
let ampSmooth = new Array(ampFrames).fill(0);


// press spacebar to toggle logging
let logging = false



// init variables before sketch runs
function preload() {
    
}

function setup() {
    createCanvas(startingWidth, startingHeight);

    fft = new p5.FFT(); 
}

function draw() {
    background(bgcolor[0], bgcolor[1], bgcolor[2]);

    if (micStarted || playerStarted){

        processingfftanimation()
        processinglevelanimation()

        // frames % [number of frames to wait between logs] === 0
        if (logging && frames % 100 === 0){
            console.log("Level: ", level)
            console.log("amplitude: ", amplitude)
        }
    }

    frames += 1
}



function processingfftanimation(){
    let spectrum = fft.analyze();
    noStroke();
    fill(255, 0, 255);
    for (let i = 0; i< spectrum.length; i++){
        let x = map(i, 0, spectrum.length, 0, width);
        let h = -height + map(spectrum[i], 0, 255, height, 0);
        rect(x, height, width / spectrum.length, h )
    }

    let waveform = fft.waveform();
    noFill();
    beginShape();
    stroke(20);
    for (let i = 0; i < waveform.length; i++){
        let x = map(i, 0, waveform.length, 0, width);
        let y = map( waveform[i], -1, 1, 0, height);
        vertex(x,y);
    }
    endShape();
}






function mousePressed(){
  mouseDown = true
}
function mouseReleased(){
  mouseDown = false
}

function keyReleased() {
  console.log("key, keycode === ", key, ", ", keyCode)

  // Press spacebar to toggle repetitive logging
  if (keyCode === 32){
    logging = !logging
  }else if(key === 'm'){ // start mic with m
    if (micStarted === false){
        // stopPlayer()
        startMic()
    }else{
        stopMic()
    }
  }else if (key === 'p'){
    if (playerStarted === false){
        // stopMic()
        startPlayer()
    }else{
        stopPlayer()
    }
  }
}


function startMic(){
  mic = new p5.AudioIn();
  amplitude = new p5.Amplitude();

  mic.start(
    () => { // async function, so we want to do the following only upon success.
      console.log("Mic started");
      amplitude.setInput(mic); // safe: attach AFTER mic is live
      fft.setInput(mic) // set input for FFT
      micStarted = true;       // only now mark it started
    },
    (err) => console.error("Mic error:", err)
  );
}

function stopMic() {
  if (mic) {
    mic.stop();           // stops the audio stream
    mic.disconnect();     // disconnect from p5.sound processing
    micStarted = false;   // optional: reset your flag
    console.log("Mic stopped");
  }
}


function startPlayer(){
    console.log("player started")
    amplitude = new p5.Amplitude();

    player = loadSound(
        songFile,
        () => { // success callback
            console.log("Found song file:", songFile);
            player.play()
            amplitude.setInput(player);
            fft.setInput(player)
            playerStarted = true;
        },
        (err) => { // error callback
            console.error("Could not load song file:", songFile, err);
            playerStarted = false;
        }
    );
}

function stopPlayer(){
    console.log("player stopped")
    if (player && player.isPlaying()) {
        player.stop();
    }
    playerStarted = false;
    // amplitude.setInput();
}


function processinglevelanimation(){
    // amplitude.setInput(mic); // monitor the mic input
    let level = amplitude.getLevel();

    // update the smooth array
    let i = frames % ampFrames
    ampSmooth[i] = level
    let ampSmoothAvg = 0
    for (let i = 0 ; i < ampFrames ; i++){
        ampSmoothAvg += ampSmooth[i]
    }
    ampSmoothAvg = ampSmoothAvg / ampFrames

    // Simple visualization
    let h = map(ampSmoothAvg, 0, 0.3, 0, height); // map to canvas height
    fill(100, 200, 100);
    rect(width / 2 - 25, height - h, 50, h);
}
