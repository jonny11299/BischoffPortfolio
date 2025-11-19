// Manages how HTML interacts with sketch windows, etc



let defaultWidthOffset = 200
let defaultHeightOffset  = 100;


export function createResizeHandler(p, widthOffset = defaultWidthOffset, heightOffset = defaultHeightOffset){

    let width = window.innerWidth - widthOffset;
    let height = window.innerHeight - heightOffset;

    function updateSize() {
        // console.log("Updating canvas size. Window inner width/height: " + window.innerWidth + ", " + window.innerHeight);

        width = window.innerWidth - widthOffset;
        height = window.innerHeight - heightOffset;

        p.resizeCanvas(width, height);
    }

    // Attach the listener:
    window.addEventListener("resize", updateSize);

    // Return cleanup function and current dimensions:
    return {
        width: () => width,
        height: () => height,
        cleanup: () => window.removeEventListener("resize", updateSize)
    }
}