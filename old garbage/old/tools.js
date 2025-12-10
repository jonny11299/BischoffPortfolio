/* 

Stores the overall state of the website

*/


export const state = {
    // Window information:
    width: 400,
    height: 300,
    vertical: false,

    // user input:
    mouseDown: false,

    // utility
    curFrame: 0,
    beginLogging: true,
    toolBarOpen: true
}

export const design = {
    // canvas / stroke colors
    bgcolor: [256, 256, 256],
    myStrokeColor: [0, 0, 0],
    myStrokeWeight: 2,

    // window / UI fill colors
    myWindowFillColor: [230, 230, 256],
    myWindowFillSelectedColor: [200, 256, 200],
    myWindowFillHoveredColor: [225, 256, 225],
}

/*
    // Track screen
    const startingWidth = window.innerWidth
    const startingHeight = window.innerHeight

    let vertical = false

    // Defines the root / absolute positions of things
    // translated via "getx" and "gety" for various elements
    let baseWidth = startingWidth
    let baseHeight = startingHeight

    // scales the utility windows based on user input
    let zoomx = 1
    let zoomy = 1
    let stretchyScale = true;




*/


    export function toggleToolBar() {
        state.toolBarOpen = !state.toolBarOpen;
    }