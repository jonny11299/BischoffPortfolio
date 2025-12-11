
// Writeup:

/*


- Talk about your rolling buffers for the fouriet transform

*/

let spectrum = [];

const C1 = 1.0; //C1 is intensity constant for vibration of each ring
const C2 = 17.0; //C2 is spacing constant between each ring
const CENTER_SIZE = 0; //size of the very middle ring
const STROKE_WEIGHT = 1; //stroke weight of the line
const STROKE_STRENGTH = 256; //stroke strength of the line

const ADJUSTED_PI = Math.PI; // helps visual rendering, preventing tiny gaps in circles

const RED_ZONE = 50; //UNUSED //Used to determine how loud music must be for the ring to change from green to red
const COLOR_SMOOTHING = 15; //how smooth the transition from green to red is
const BLUE_OSC = 0.01; //how quickly the blue color oscilates
const RING_COLOR_DIFF = 0.2; //how much the blue changes ring to ring

//float prevMaxVariation = -1;
//float maxVariation = 0;

let frameCount = 0; //counts how many frameCount have passed


const SCALE_W = 1;
const SCALE_H = 1;

// Functional variables:
let mouseDown = false

// Color variables:
let bgcolor = [0.0, 0.0, 0.0]




// from website:
/* FFT analyzes a very short snapshot of sound called a sample buffer. It returns an array of amplitude measurements, referred to as bins. The array is 1024 bins long by default. You can change the bin array length, but it must be a power of 2 between 16 and 1024 in order for the FFT algorithm to function correctly. The actual size of the FFT buffer is twice the number of bins, so given a standard sample rate, the buffer is 2048/44100 seconds long.*/




let player;        // p5.SoundFile
let song;          // specific song file
let input;         // p5.AudioIn
let audioMetaData



// For these variables, just know:
// the fftBands are the irises themselves.
// The values tracked and stored here are the amplitudes of that frequency.
// So the fftBandsAvg is the amplitudes of those frequencies, smoothed over SMOOTHING frames.
// You will have to use the waveform to make it vibrate, capiche?
// the waveform itself is the vibration pattern.
let fft;           // p5.FFT
let fftBinSize = 1024; // (needs to be between 32 and 1024, power of 2)
let fftBuiltInSmoothing = 0.8 // 0.8 is default
let fftBands = []; // array of arrays for smoothing
let fftBandsAvg = []; // just an array of the average over the past SMOOTHING frames of fftBands
const SMOOTHING = 80; // smoothing over the last 8 frames


let songFile = "/audio/momentToBreathe.mp3"


// monitor audio in
let mic, amplitude
let micStarted = false
let playerStarted = false

// stores the last ampFrames frames of amplitude (for smoothing)
let ampFrames = 10
let ampSmooth = new Array(ampFrames).fill(0);


// press spacebar to toggle logging
let logging = false


let neverStarted = true;


// init variables before sketch runs

let font;
function preload(){
    font = loadFont('/fonts/Roboto_Mono/static/RobotoMono-Regular.ttf');

    textAlign(CENTER, CENTER);
    textFont(font);
}


function setup() {
    createCanvas(windowWidth * SCALE_W, windowHeight * SCALE_H);

    fft = new p5.FFT(fftBuiltInSmoothing, fftBinSize);

    strokeWeight(STROKE_WEIGHT);



    // Get button references
    playMusicBtn = select('#playMusic');
    useMicBtn = select('#useMic');
    
    // Add click handlers
    playMusicBtn.mousePressed(handlePlayMusic);
    useMicBtn.mousePressed(handleUseMic);

    /*for (i = 0 ; i < 21 ; i += 1){
        console.log("fib ", i, ": ", fibonacci(i))
    }*/
}

function draw() {
    background(30, 30, 60);




    if (micStarted || playerStarted){

        // processingfftanimation()
        // processinglevelanimation()
        /*
        if (playerStarted){
            let t = "This is a song I recorded a little while back."

            textAlign(CENTER, CENTER);
            textSize(16);
            fill(255, 255, 255, 120);
            noStroke();
            text(t, width/2, 100);
        }*/

        



        fftAnimate();

        // frameCount % [number of frameCount to wait between logs] === 0
        if (logging && frameCount % 100 === 0){
            console.log("repeat log:")
            // console.log("Level: ", level)
            // console.log("amplitude: ", amplitude)
            console.log("fftBandsAvg:", fftBandsAvg)
        }

        playMusicBtn.style('top', '85%'); // Move down
        useMicBtn.style('top', '90%');
        neverStarted = false;
    }else{

    }

    if (neverStarted){
        let t = "I like to create things with interesting audiovisual feedback.\n";
        t += "Try it out! Please set your audio to a reasonable level,\n";
        t += "and play an original song of mine:";

        textAlign(CENTER, CENTER);
        textSize(20);
        fill(255);
        noStroke();
        text(t, width/2, height/2 - 80);

        let t2 = "(or, you can use your microphone audio:)"

        textSize(14);
        text(t2, width/2, 2*height/3);

        playMusicBtn.style('top', '50%'); // Move down
        useMicBtn.style('top', '70%');

    }

    frameCount += 1
}







// --------------------- IO ---------------------


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
    if (logging){
        console.log("Logging now.")
    }else{
        console.log("Stopped logging.")
    }
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


/*

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
    */

function handlePlayMusic(){
    if (playerStarted === false){
        stopMic()
        startPlayer()
        playMusicBtn.html('⏸ Pause Music');
    }else{
        stopPlayer()
        playMusicBtn.html('▶ Play Music');
        // playMusicBtn.style('top', '50%'); // Move back
    }
    moveButtons();
}
function handleUseMic(){
    if (micStarted === false){
        stopPlayer()
        startMic()
        playMusicBtn.html('▶ Play Music');
        useMicBtn.html('Stop Mic Input');
    }else{
        stopMic()
    }
    moveButtons();
}

function moveButtons(){
    playMusicBtn.style('top', '85%'); // Move down
    useMicBtn.style('top', '90%');
}



// --------------------- AUDIO IN ---------------------
function startMic(){
  mic = new p5.AudioIn();
  amplitude = new p5.Amplitude();

  mic.start(
    () => { // async function, so we want to do the following only upon success.
      console.log("Mic started");
      amplitude.setInput(mic); // safe: attach AFTER mic is live
      fftInit(mic) // set input for FFT
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
            fftInit(player)
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






// --------------------- VISUALIZING ---------------------


// built by the processing team, used for learning syntax and testing
function processinglevelanimation(){
    // amplitude.setInput(mic); // monitor the mic input
    let level = amplitude.getLevel();

    // update the smooth array
    let i = frameCount % ampFrames
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


// built by the processing team, used for learning syntax and testing
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


// looks at the stored bands, sees how the averages print over the fft itself

function testBandsVisual(){

    // print normal spectrum
    noStroke();
    fill(0, 0, 255);
    for (let i = 0; i< spectrum.length; i++){
        let x = map(i, 0, spectrum.length, 0, width);
        let h = -height + map(spectrum[i], 0, 255, height, 0);
        rect(x, height, width / spectrum.length, h )
    }

    // print smoothed averages
    fill(255, 0, 0);
    for (let i = 0; fibonacci(i) < fftBandsAvg.length; i++){
        let f = fibonacci(i)
        let x = map(f, 0, fftBandsAvg.length, 0, width);
        let h = -height + map(fftBandsAvg[f], 0, 255, height, 0);
        rect(x, height, width / fftBandsAvg.length, h )
    }
}




// --------------------- INITIALIZING ---------------------


// initializes the bands powered by fft (fast-fouriet transform)
// i.e. the irises of the eye
function fftInit(fftInput){
    fft = new p5.FFT(fftBuiltInSmoothing, fftBinSize);

    fft.setInput(fftInput)

    // create the fft, and the average (smoothing) bands
    // array 1: fft bin size, each bin goes to "smoothing" depth
    fftBands = []
    for (let i = 0 ; i < fftBinSize ; i++){
        fftBands.push(new Array(SMOOTHING).fill(0));
        fftBandsAvg[i] = 0;
    }

}




// --------------------- HELPER FUNCTIONS ---------------------

// returns the nth fibonacci number
// 0-indexed
// sample output for 0-8:  0, 1, 2, 3, 5, 8, 13, 21, 34
// technically should have 1 twice but not useful for our purposes, since we're iterating through our
// frequency bands and showing only the fibonacci-numbered bands
// (is that even fair? shouldn't we just pick less bands and/or average them?)
// (like, what happens if the bass hits at 70hz and the fibonacci number checks the bass at 83hz?)
// (to be honest, I'm going to build it like this, and it if looks good, shit, it looks good.)
const fibonacci = (function () {
    const memo = { 0: 0, 1: 1 };  // memory bank
    // the memo above basically just caches all the results so I don't have to re-calculate constantly.

    return function fib(n) {
        if (memo[n] !== undefined) return memo[n];

        // compute new result using your iterative logic
        let x = 0;
        let x1 = 1;
        let x2 = 1;

        for (let i = 0; i < n; i++) {
            x = x1 + x2;
            x1 = x2;
            x2 = x;
        }

        memo[n] = x1; // store result
        return x1;
    };
})();




// --------------------- MY FFT CODE ---------------------

// Desired update: bro, we should actually sum up the spectrum
// if we're pulling at each fibonacci number, rather than accessing just that number,
// we should probably have an average of everything <= that number
// otherwise we're missing out on audio data.

function fftAnimate(){
    

    spectrum = fft.analyze()
    let f = 0;
    let lastf = f;

    // smooth the bins
    for (let i = 0 ; fibonacci(i) < spectrum.length ; i += 1){
        lastf = f
        f = fibonacci(i)

        // band seems to be 0 to 255, so that's its weight
        // let bandWeight = spectrum[f]
        // instead of taking just one band weight, we should sum up across the freq spectrum.
        // let's see how performance goes:
        
        let bandWeight = 0;
        if (lastf === f){
            bandWeight = spectrum[f]
        }else{
            // sums from last frequency bin checked (exclusive) to current bin (inclusive)
            // if you're confused at what I'm talking about, just run testBandsVisual()
            // it's summing across the previous red band to the next
            let count = 0
            for (b = lastf + 1 ; b <= f ; b++){
                bandWeight += spectrum[b]
                count++
            }
            bandWeight /= count
        }

        // jesus, the above frequency summing makes it look SO much better, and doesn't really
        // seem to drop performance too much. I guess my compy can handle 1024 summations per frame
        // pretty easily. 
        

        // we're going to use frame % smoothing to access that array element.
        // then, we're going to read what's there, subtract it from the average,
        // and add the new value in-place.
        // that way, we don't need to calculate the average from every element,
        // we just update as we go.

        let frameIndex = frameCount % SMOOTHING 

        // update the rolling window of values (fftBands)
        let lastValue = fftBands[f][frameIndex]
        fftBands[f][frameIndex] = bandWeight 

        // update the average weights (fftBandsAvg)
        fftBandsAvg[f] -= lastValue / SMOOTHING 
        fftBandsAvg[f] += bandWeight / SMOOTHING 
    }

    // this function just helps me see if the bands are printing correctly
    // testBandsVisual();


    // Next, let's draw each of the irises using the fft spectrum & smoothed values
    stroke(0, 255, 255);

    // each fft band uses the same waveform for vibration pattern, it's just that
    // intensity is determined by fft amplitude.
    let waveform = fft.waveform();
    if (logging && frameCount % 100 === 0){
        console.log("Waveform size: ", waveform.length)
    }

    let numFrames = waveform.length;
    let curRing = 0

    for (let i = 0 ; fibonacci(i) < fftBinSize ; i++){
        f = fibonacci(i)


        // Assign location of the points:
        // initializing points:
        let pointx = new Array(numFrames).fill(0) // points.x
        let pointy = new Array(numFrames).fill(0) // points.y

        let freq = C2 * (curRing + CENTER_SIZE)

        // build out the point arrays
        for (let j = 0 ; j < numFrames ; j++){

            // Use the cube root, then square it to optimize for visuals
            // we want it dynamic, but not too spikey

            //player.mix.get(j) --> waveform[j]

            let variable = Math.cbrt(waveform[j] * fftBandsAvg[f] + 1); // smoothing
            let variation = variable*variable 
            variation *= curRing + 1

            // the big moment where the point's y is calculated
            let y = map(j, 0, numFrames, ADJUSTED_PI / 2, 3 * ADJUSTED_PI / 2)

            // fill the points arrays
            pointx[j] = wrap(variation, y, freq, "cos")
            pointy[j] = wrap(variation, y, freq, "sin")
        }

        // assign color:

        let colorvar = fftBinSize / ADJUSTED_PI * atan((C1 * fftBandsAvg[f])/COLOR_SMOOTHING)

        let red = colorvar ;
        let green = 512 - colorvar;
        if (green > 256) green = 256;

        let blue = map(sin(BLUE_OSC * frameCount + curRing * RING_COLOR_DIFF * (-1)), -1, 1, 0, 256)

        stroke(red, green, blue, STROKE_STRENGTH);

        // lines are drawn here
        for (let n = 0 ; n < numFrames - 1 ; n++){
            line(pointx[n], pointy[n], pointx[n+1], pointy[n+1]);
            // mirror image:
            line(width - pointx[n], pointy[n], width - pointx[n+1], pointy[n+1])
        }

        curRing = curRing + 1
    }
}


// wraps the points in a circle, I believe
function wrap(variation, y, freq, funct){
    let trig = y;
    let offset = 0;

    funct = funct.toLowerCase();

    if (funct === "sin") {
        trig = sin(y);
        offset = height / 2;
    } else if (funct === "cos") {
        trig = cos(y);
        offset = width / 2;
    } else {
        console.log("Strange case");
    }

    return ((C1 * variation) + freq) * trig + offset;
}



function windowResized() {
    resizeCanvas(windowWidth * SCALE_W, windowHeight * SCALE_H);
    scaleConstants();
}