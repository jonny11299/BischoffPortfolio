
let font;
let fontSize = 20;

let emptyMapIframe;
let filledMapIframe;
let loadingEmptyMap = true;
let loadingFilledMap = true;

let momentLoaded = Date.now();

function preload(){
    font = loadFont('/fonts/Roboto_Mono/static/RobotoMono-Regular.ttf');
    

    // Create iframe element
    emptyMapIframe = createElement('iframe', '');
    emptyMapIframe.attribute('src', '/embed/empty_map.html');
    
    // Position and style it
    emptyMapIframe.position(width * 0.1, height * 0.1);
    emptyMapIframe.size(width * 0.8, height * 0.8);
    emptyMapIframe.style('border', '0px solid #ccc');
    emptyMapIframe.style('border-radius', '8px');
    emptyMapIframe.style('z-index', '10');
    emptyMapIframe.style('overflow', 'hidden');


    // Create iframe element
    filledMapIframe = createElement('iframe', '');
    filledMapIframe.attribute('src', '/embed/fish_map.html');
    
    // Position and style it
    filledMapIframe.position(width * 0.1, height * 0.1);
    filledMapIframe.size(width * 0.8, height * 0.8);
    filledMapIframe.style('border', '0px solid #ccc');
    filledMapIframe.style('border-radius', '8px');
    filledMapIframe.style('z-index', '10');
    filledMapIframe.style('overflow', 'hidden');

    // resizeMap();
}

function emptyMapSuccess(){
    loadingEmptyMap = false;
    console.log("Empty map loaded!");
    resizeMaps();
}

function filledMapSuccess(){
    loadingFilledMap = false;
    console.log("Filled map loaded!");
    resizeMaps();

    momentLoaded = Date.now();
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    // your setup code here

    // Add load event listener
    emptyMapIframe.elt.addEventListener('load', emptyMapSuccess);
    filledMapIframe.elt.addEventListener('load', filledMapSuccess);

    textAlign(CENTER, CENTER);
    // loadFont('Courier New');
    textFont(font);

    resizeMaps();
}

function draw() {
    background(30, 30, 60);
    // your draw code here
        
    textSize(fontSize);
    textStyle(NORMAL);

    fill(255, 255, 255);
    noStroke();
    let t = "This is a map showing all of the watersheds, waterbodies, and rivers of a particular quadrant in Western Washington.\n";
    t += "The data is open-source, downloaded from geo.wa.gov. The map is built using GeoPandas and Python in a Jupyter notebook.\n";
    t += "The original goal was to map 6PPD-Quinone pollution patterns by combining this data with traffic data, and thus better address\n";
    t += "cleanup efforts to protect salmon populations. However, upon contacting the EPA, they sent me a map they had already created\n";
    t += "to address this problem. Realizing this data project was not needed, I moved on."
    text(t, 0, -height/2 + height/10);

    let hFromBottom = height/10;

    if (loadingEmptyMap){
        let loadingText = "Loading map";
        for (let i = 0 ; i < Math.floor(frameCount / 20) % 4 ; i++){
            loadingText += "."; // animates the dot dot dot
        }
        text(loadingText, 0, height/2 - hFromBottom);
    }else{
        if (loadingFilledMap){
            let loadingText = "Loading map details";
            for (let i = 0 ; i < Math.floor(frameCount / 20) % 4 ; i++){
                loadingText += "."; // animates the dot dot dot
            }
            loadingText+= "\nfeel free to scroll this empty map, or";
            text(loadingText, 0, height/2 - hFromBottom);

        }else{

            let loadingText = "Loaded map details!";

            // most complex fade out text code you ever seen in your life
            let maxAlpha = 255;
            let delay = 2000; // delay in ms
            let fadeConst = 30;
            let alpha;
            if (Date.now() > momentLoaded + delay){
                alpha = 255 - (Date.now() - (momentLoaded + delay))/fadeConst;
            }else{
                alpha = 255;
            }
            fill(255, 255, 255, alpha);
            if (alpha > 0){
                text(loadingText, 0, height/2 - hFromBottom);
            }


        }
    }


    // rect(50, 50, 50, 50);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    fontSize = 11 * windowWidth/1000;

    resizeMaps();
}

async function downloadMap() {
    try {
        const response = await fetch('/embed/fish_map.html');
        const blob = await response.blob();
        
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'fish_map.html';
        link.click();
        
        // Clean up
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Download failed:', error);
    }
}

function resizeMaps(){
    // Get the iframe's actual dimensions
    // Set max dimensions and let it scale naturally

    let iframeWidth = emptyMapIframe.elt.offsetWidth || 800;  // fallback to 800 if not loaded yet
    let iframeHeight = emptyMapIframe.elt.offsetHeight || 600; // fallback to 600
    console.log(`w, h: ${iframeWidth}, ${iframeHeight}`);

    let w = iframeWidth;
    let h = iframeHeight;

    w = 2 * width / 3;
    h = 2 * height / 3;

    // just need to position it correctly...

    emptyMapIframe.position(width/2 - w/2, height/2 - h/2 + 20);
    emptyMapIframe.size(w, h);

    emptyMapIframe.style('border', '0px solid #ccc');
    emptyMapIframe.style('border-radius', '8px');
    emptyMapIframe.style('z-index', '10');
    emptyMapIframe.style('overflow', 'hidden');

    if (!loadingFilledMap){// Get the iframe's actual dimensions
        emptyMapIframe.hide();
        let filledWidth = filledMapIframe.elt.offsetWidth || 800;  // fallback to 800 if not loaded yet
        let filledHeight = filledMapIframe.elt.offsetHeight || 600; // fallback to 600
        console.log(`w, h: ${iframeWidth}, ${iframeHeight}`);

        let wf = filledWidth;
        let hf = filledHeight;

        wf = 2 * width / 3;
        hf = 2 * height / 3;

        // just need to position it correctly...

        filledMapIframe.position(width/2 - wf/2, height/2 - hf/2 + 20);
        filledMapIframe.size(wf, hf);

        filledMapIframe.style('border', '0px solid #ccc');
        filledMapIframe.style('border-radius', '8px');
        filledMapIframe.style('z-index', '10');
        filledMapIframe.style('overflow', 'hidden');

    }
}

function keyReleased(){
    if (key === 'l'){
        console.log("windowWidth, windowHeight: " + windowWidth + ", " + windowHeight);
        console.log("p width and height: " + width + ", " + height);
    }
    if (key === 'm') {
        if (emptyMapIframe.style('display') === 'none') {
        emptyMapIframe.style('display', 'block');
        } else {
        emptyMapIframe.style('display', 'none');
        }
    }
}