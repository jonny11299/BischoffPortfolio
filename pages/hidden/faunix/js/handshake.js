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
    const lastUpdate = Number(localStorage.getItem('faunix_last_update'));

    if (!lastUpdate) {
        console.log("Never updated");
        return '';
    }

    return lastUpdate;
}

function getFormattedLastUpdatedTime() {

    try {
        const time = new Date(getLastUpdatedTime()).toLocaleString();
        return time;
    } catch (error) {
        console.error('error on getting formatted last updated time.');
        console.error(error);
        return 'never updated.';
    }

}

function setUpdate() {
    localStorage.setItem('faunix_last_update', Date.now());
}




let handshakeComplete = false;
function completeHandshake() {
    setUpdate();
    console.log("Completed handshake. New last update time is " + getFormattedLastUpdatedTime());
    console.log("Raw number: " + getLastUpdatedTime());

    handshakeComplete = true;
    setFooterData();
}


function runHandshake() {
    console.log("Running handshake. Getting all data from sheets.");
    console.log(`Last updated ${getFormattedLastUpdatedTime()}`);
    handshakeComplete = false;


    try {
        const getPromise = get('get_all');
        getPromise.then((msg) => {
            console.log("Got handshake data from sheets. Here it is:");
            console.log(msg);

            if (msg.links) {
                updateLinksFromServer(msg.links);
            }
            if (msg.song_versions) {
                updateSongVersionsFromServer(msg.song_versions);
            }
            if (msg.album_orders) {
                updateAlbumOrdersFromServer(msg.album_orders);
            }

            completeHandshake();
        });

    } catch (error) {
        console.error("Failed to get_all");
        console.error(error);
    }
}


// assumes [0] is headers, [1:end] is data
function formatServerToLocal(a) {
    if (a) {
        if (a.length < 1) {
            console.log("arrayToObject on blank array, returning null")
            return null;
        }
        if (a.length < 2) {
            console.log("arrayToObject on empty array, returning null")
            return null;
        }

        const newArray = [];
        for (let i = 1; i < a.length; i++) {
            const obj = {};
            a[0].forEach((header, j) => {
                obj[header] = a[i][j];
            });
            // console.log(obj);
            newArray.push(obj);
        }

        console.log(newArray);
        return newArray;
    }
    return [];
}


function quickAppendToLocalStorage(storageId, obj) {
    if (storageId === 'faunix_song_versions') {
        let vs = getVersionsFromLocalStorage();
        vs.push(obj);
        localStorage.setItem(storageId, JSON.stringify(vs));
    } else if (storageId === 'faunix_album_orders') {
        let ao = getFaunixAlbumOrders();
        ao.push(obj);
        localStorage.setItem(storageId, JSON.stringify(ao));
    } else if (storageId === 'faunix_quicklinks_list') {
        let links = getLinksFromLocalStorage();
        links.push(obj);
        localStorage.setItem(storageId, JSON.stringify(links));
    } else {
        console.error(`Trying to append to a localStorage whose id is invalid: ${storageId}`);
    }
}


function updateLinksFromServer(serverLinks) {
    // first row is headers
    console.log("updating links from server");
    const serverLinksFull = formatServerToLocal(serverLinks);
    // console.log(serverLinksFull);
    const links = serverLinksFull.filter((l) => !l.deleted);
    // console.log(links);

    const ll = getLinksFromLocalStorage();
    console.log(ll);

    const diff = compare(ll, links, 'text');
    diff.serverOnly.forEach((sl) => {
        quickAppendToLocalStorage('faunix_quicklinks_list', sl);
    });
    // console.log(diff);
}

function updateSongVersionsFromServer(serverVersions) {
    // first row is headers
    console.log("updating song versions from server");
    const versionsFull = formatServerToLocal(serverVersions);
    const versions = versionsFull.filter((v) => !v.deleted);
    // console.log("Versions with the deleted ones scrubbed:");
    // console.log(versions);


    let lhvs = getVersionsFromLocalStorage();
    // console.log(lhvs);

    // compare lhvs to versions. Yes, this is O(n^2)

    const diff = compare(lhvs, versions, 'timestamp');
    diff.serverOnly.forEach((sv) => {
        quickAppendToLocalStorage('faunix_song_versions', sv);
    });

    // diff.localOnly.forEach((sv) => {Add it to an upload queue so it gets put on the server. Might not be necessary, though.})

}

function updateAlbumOrdersFromServer(serverAlbumOrders) {
    // first row is headers
    console.log("updating album orders from server");
    const aoFull = formatServerToLocal(serverAlbumOrders);
    const aos = aoFull.filter((a) => !a.deleted);

    // going to make sure my songs aren't still in JSON format
    aos.forEach((a) => {
        try {
            a.songs = JSON.parse(a.songs);
        } catch (error) {
            console.log("Couldn't parse a:");
            console.log(a);
        }
    });

    const ls = getFaunixAlbumOrders();

    const diff = compare(ls, aos, 'album_order_name');
    console.log(diff);
    diff.serverOnly.forEach((ao) => {
        quickAppendToLocalStorage('faunix_album_orders', ao);
    });
}


function compare(localHost, server, uid) {
    const localOnly = [];
    const serverOnly = [];
    const both = [];

    localHost.forEach((lh) => {
        let sv = server.find((s) => lh[uid] === s[uid]);
        // console.log(`lh, sv, uid: ${lh}, ${sv}, ${uid}`);

        // sv is the server version such that the uid from the localHost version matches my uId
        // undefined if none.

        if (sv === undefined) {
            // it's not on the server, but it's on localHost
            localOnly.push(lh);
        } else {
            // it's on both
            both.push(sv);
        }
    });

    server.forEach((sv) => {
        let lhv = localHost.find((lh) => lh[uid] === sv[uid]);

        if (lhv === undefined) {
            // it's on the server, but not localHost
            serverOnly.push(sv);
        } else {
            both.push(lhv);
        }
    });

    // could remove duplicates from both, but not necessary.
    // won't really use this property except for affirmation that we have them.



    const dataObject = {
        localOnly,
        serverOnly,
        both
    };

    console.log(dataObject);

    return dataObject;
}


// Runs this upon entry, (or 2ms in):
setTimeout(() => {

    const timeSinceLastUpdateSeconds = (Date.now() - getLastUpdatedTime()) / 1000;

    console.log("Last updated " + timeSinceLastUpdateSeconds);

    // 5 minutes is 60 * 5 = 300 seconds

    if (timeSinceLastUpdateSeconds > 300) {
        runHandshake();
    } else {
        console.log("No need for handshake, since last update was only " + timeSinceLastUpdateSeconds + " seconds ago.");
    }

    /*
    const getPromise = get('faunix_song_versions');
    getPromise.then((msg) => {
        console.log("Promise resolved in handshake");
        console.log(msg);
    });
    */


}, 2);


setTimeout(() => {
    setFooterData();
}, 25);



function setFooterData() {
    console.log("Running setFooterData()");
    try {
        const lastUpdated = getFormattedLastUpdatedTime();
        document.getElementById('footerLastUpdated').textContent = `Last fetched: ${lastUpdated}`;
        console.log("Updated footer");
        /*
                const inProgress = document.getElementById('footerUpdateInProgress');
        
                if (handshakeComplete) {
                    inProgress.textContent = "Update complete.";
                    inProgress.style = "color: green";
                } else {
                    inProgress.textContent = "Update in-progress. Please don't navigate away.";
                    inProgress.style = "color: red";
                }
                    */

    } catch (error) {
        console.error("In footer, couldn't get last update time because of error:");
        console.error(error);
        // try again in a bit, it probably just hasn't loaded yet.
        setTimeout(() => {
            setFooterData();
        }, 200)
    }
}


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
        const size = new Blob([obj]).size;
        const sizeString = `${size} bytes (${(size / 1024).toFixed(2)} KB)`;
        // console.log(typeof obj);
        // console.log(obj);




        if (typeof obj === 'string') {
            try {
                if (obj[0] === '[' && obj[1] === "{") {
                    // console.log("Seeing a potential array of JSON.string-ified objects");
                    localObjects.push({
                        key: `${key}`,
                        obj: obj,
                        size: sizeString
                    });
                } else {
                    // console.log("Probably just a single string.");
                    localStrings.push({
                        key: `${key}`,
                        obj: obj,
                        size: sizeString
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
                obj: obj,
                size: sizeString
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