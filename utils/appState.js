
import Timer from "./timer.js";


export let appState = {
    theme: 'dark',
    muted: true,
    volume: 50, // integer from 0 to 100,
    timer: new Timer,
    get userName(){ return 'Visitor from ' + this.timer.format(new Date)},
    selectedApp: 'template',

    w: 100,
    h: 100,
    vertical: false,
    fullscreen: false,

    logSelf() {
        const data = {};
        for (let key in this) {
            if (typeof this[key] !== 'function') {
                data[key] = this[key];
            }
        }
        console.log(data);
    },
};