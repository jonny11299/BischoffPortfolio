// import 'standardFunctions.js'
// import 'postman.js';

// the above doesn't do anything... just readable for me.

console.log(getFaunixName());


/*

    Include order on every webpage must be:
        standardFunctions.js
        postman.js
        handshake.js

*/



function getLastUpdatedTime() {
    const lastUpdate = localStorage.getItem('faunix_last_update');

    if (!lastUpdate) {
        console.log("Never updated");
        return '';
    }

    return lastUpdate;
}

function setUpdate() {
    localStorage.setItem('faunix_last_update', Date.now());
}



// Runs this upon entry, (or 2ms in):
setTimeout(() => {
    console.log(getLastUpdatedTime());

    const getPromise = get('faunix_song_versions');
    getPromise.then((msg) => {
        console.log("Promise resolved in handshake");
        console.log(msg);
    });

    console.log();
}, 2);



// 1/22/26 wrapping-up thoughts:
// I just generally want to make an audit() function that:
// 1. Takes each localStorage item
// 2. Pulls all of them from the server (at once) 
// 3. Compares to local versions
// 4. Prints out the differences (what they share, and what one has but not the other)
// 5. Then from there, I'll go about saving to localStorage and doing other stuff.
// 6. Maybe I can make a 'payload' localStorage item, with a flag "posted = true"
// 7. that attempts to post, and if interrupted, picks up where it left off.

// 8. Yeah, that'll be a good idea... figuring out where I left off






// get current time
// for each local object that needs to be updated,
// 1. get from the server when the last entry was added
// 2. if that's later than right now, we need to pull those latest elements.
// 3. then, only on success, we set our memory that we have updated recently.

// 4. Occasionally check if we've diverged from online? 



// do you think it's a better pattern to set everything locally to the online version once I get it? Or to only add entries that appear there
// that do not appear here?
// the former gives opportunity to overwrite local data, erase it, but the latter gives chance to diverge from online.
// To be honest, i have to only append when things are new, otherwise I could suddenly and invisibly delete things that were just added locally.
// I can just compare keys and identify outliers.

// could start by making 'audit' function that prints a table of data that appears on one location but not the other



function getAllLocalStorage(onlyFaunixKeys = true, logResults = false) {
    console.log(localStorage);
    if (logResults) console.log("Great, now to get the Object and iterate through Keys");
    const keys = Object.keys(localStorage);


    const localObjects = [];
    const localStrings = [];
    const localErrors = [];


    keys.forEach((key) => {
        // console.log(key);
        // console.log(`typeof ${key}:`);
        if (onlyFaunixKeys) {
            if (!key.includes('faunix')) return;
        }


        const obj = localStorage.getItem(key);
        // console.log(typeof obj);
        // console.log(obj);

        if (typeof obj === 'string') {
            try {
                if (obj[0] === '[' && obj[1] === "{") {
                    // console.log("Seeing a potential array of JSON.string-ified objects");
                    localObjects.push({
                        key: `${key}`,
                        obj: obj
                    });
                } else {
                    // console.log("Probably just a single string.");
                    localStrings.push({
                        key: `${key}`,
                        obj: obj
                    });
                }
            } catch (error) {
                console.log("Could parse because error:");
                console.error(error);
            }
        } else {
            // hmmm... everything is a string!
            if (logResults) console.log("Not a string!!");
            localErrors.push({
                key: `${key}`,
                obj: obj
            });
        }
    });

    localObjects.forEach((o) => {
        try {
            o.obj = JSON.parse(o.obj);
        } catch (error) {
            console.log("Could not parse " + o.key);
            console.log(error);
        }
    });

    if (logResults) {
        console.log("localObjects:");
        console.log(localObjects);

        console.log("localStrings:");
        console.log(localStrings);

        console.log("localErrors:");
        console.log(localErrors);
    }


    return {
        objs: localObjects,
        strings: localStrings,
        errors: localErrors
    };

}


function printAllLocalStorage(onlyFaunixKeys = true) {
    const dummy = getAllLocalStorage(true, true);
}