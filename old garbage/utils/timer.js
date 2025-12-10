



export default class Timer {
    constructor(){
        this.init = Date.now();
    }


    getNow(){
        return this.format(Date.now());
    }

    format(dateTimeObject){
        const now = dateTimeObject
        // Get parts
        const MM   = String(now.getMonth() + 1).padStart(2, '0'); // getMonth() is 0–11
        const DD   = String(now.getDate()).padStart(2, '0');
        const YYYY = now.getFullYear();
        const hh   = String(now.getHours()).padStart(2, '0');
        const mm   = String(now.getMinutes()).padStart(2, '0');
        const ss   = String(now.getSeconds()).padStart(2, '0');

        // Microseconds: JavaScript only gives milliseconds.
        // We fake microseconds by adding 3 random digits, or `000` if you want.
        const micro = String(now.getMilliseconds()).padStart(3, '0') + "000";

        return `${MM}-${DD}-${YYYY}-${hh}:${mm}.${ss}.${micro}`;
    }
}
