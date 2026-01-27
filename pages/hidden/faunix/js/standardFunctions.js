

/*

Implmements lots of getting and setting that is required across various webpages.

This does not depend on postman.js.
A few functions from postman.js depend on this.

Include order on every webpage must be:
standardFunctions.js
postman.js
handshake.js

*/




// ------------------ OUTLINE OF THE SHEETS / COLUMNS ------------------


/*
Categories:
users
song_versions
album_orders
notes
links
logins


// USERS:
timestamp
person: {Ash, Nick, Shayne, Jonny, Other}
userID: (all of the randomly-generated ones) (unique)


// SONG_VERSIONS
timestamp
song_name: 
version_name: 
uploader: name
uploader_id: userID
drive name: (name of the quicklink)
drive embed:
// Gosh... is it possible to pull this info from the song itself?
// maybe the flow can be: 
    // 1. Click the name of the song 
            - fills in the song name
    // 2. Enter the link to the drive
            - fills in the version name from the name on the drive
    // 3. Enter the embed link



// ALBUM_ORDERS:
    timestamp
    album_order_name
    songs: [{
        name
        version
    }]
    uploader
    uploader_id: userID
    


// NOTES:
timestamp
song {
    name
    version
}
album_order_name



// LINKS:
timestamp
link_name
link_url
person
userID



// LOGINS:
person
userID
loginTime
exitTime
page
referrer



*/






// ------------------ DEBUG CAPTURE ------------------


function overwriteLogging() {
    const ls = localStorage.getItem('faunix_escapeOverwrittenLogging');
    if (ls) {
        return false;
    } else {
        return true;
    }
}


// Create an array to store all console output
const capturedLogs = [];
if (overwriteLogging()) {


    // Store references to original console methods
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    // Helper function to extract stack info
    function getStackInfo() {
        const stack = new Error().stack;
        const stackLines = stack.split('\n');

        // Primary source: index [2] is the actual caller
        const callerLine = stackLines[2] || '';

        // Extract file:line:column from the caller
        const match = callerLine.match(/([^\/\\]+):(\d+):(\d+)/);
        const source = match ? {
            file: match[1],
            line: match[2],
            column: match[3],
            raw: callerLine.trim()
        } : {
            file: 'unknown',
            line: '?',
            column: '?',
            raw: callerLine.trim()
        };

        // Full call stack (from [2] onward) for context
        const callStack = stackLines.slice(2).map(line => line.trim());

        return { source, callStack };
    }

    // Override console methods
    console.log = function (...args) {
        const stackInfo = getStackInfo();

        capturedLogs.push({
            type: 'log',
            timestamp: new Date().toISOString(),
            message: args.map(arg =>
                typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' '),
            callStack: stackInfo.callStack.slice(1)
        });

        args.push(stackInfo.callStack.slice(1));
        originalLog.apply(console, args);
    };

    console.warn = function (...args) {
        const stackInfo = getStackInfo();

        capturedLogs.push({
            type: 'warn',
            timestamp: new Date().toISOString(),
            message: args.map(arg =>
                typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' '),
            callStack: stackInfo.callStack.slice(1)
        });

        args.push(stackInfo.callStack.slice(1));
        originalWarn.apply(console, args);
    };

    console.error = function (...args) {
        const stackInfo = getStackInfo();

        capturedLogs.push({
            type: 'error',
            timestamp: new Date().toISOString(),
            message: args.map(arg =>
                typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' '),
            callStack: stackInfo.callStack.slice(1)
        });

        args.push(stackInfo.callStack.slice(1));
        originalError.apply(console, args);
    };

}

// Function to get all captured logs for the bug report
function getBugReportData() {
    try {
        return {
            logs: JSON.stringify(capturedLogs),
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error("Failed to getBugReportData()");
        console.error(error);
        return {
            logs: 'empty',
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: new Date().toISOString()
        };
    }
}


function startBugReport() {
    console.log("Starting a bug report");


    let myLogs = 'empty';
    if (overwriteLogging()) {
        // now I can get the logs.
        myLogs = getBugReportData();
    }

    // Create modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: black;
        padding: 20px;
        border: 2px solid #333;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 600px;
        width: 90%;
    `;

    modal.innerHTML = `
        <header>
        <p></p>
        <h1>Bug Report:</h1>
        <br>
        <br>
        <h3>Please enter a brief description of the bug, then click submit:</h3>
        </header>
        
        <br>
        <br>
        
        <textarea id="bugText" rows="10" cols="50" placeholder="Type quick description of bug here..."></textarea>
        <br>
        <button id="submitBugButton">Submit</button>
        <button id="cancelBugButton">Cancel</button>
    `;

    document.body.appendChild(modal);


    // Submit handler
    document.getElementById('submitBugButton').addEventListener('click', async () => {
        const description = document.getElementById('bugText').value;

        const amazonObject = {
            description: description,
            logs: myLogs
        }

        const errorLogURL = generateErrorLogUrl(); // from postman
        const bugReportObject = {
            description: description,
            logs: errorLogURL
        }

        // need to post the bugreport object to amazon with myLogs
        try {
            let uploadPromise = putBugReportInBucket(amazonObject, errorLogURL).then(response => {
                console.log("uploadPromise for bug report resolved. Response:");
                console.log(response);
                if (response.success) {

                } else {

                }
            });
        } catch (error) {
            console.log(`Could not upload bug because:`);
            console.log(error);
        }



        post('bug_report', bugReportObject);

        document.body.removeChild(modal);
    });

    // Cancel handler
    document.getElementById('cancelBugButton').addEventListener('click', () => {
        document.body.removeChild(modal);
    });


}





// ------------------ PREVIOUS STUFF: ------------------


function bubbleSort(list) {
    let alphList = list;
    for (let i = 0; i < alphList.length; i++) {
        for (let j = i + 1; j < alphList.length; j++) {
            if (alphList[i] > alphList[j]) {
                let temp = alphList[i];
                alphList[i] = alphList[j];
                alphList[j] = temp;
            }
        }
    }

    alphList.push("other");

    return alphList;
}


function getSongNames(alphabetize = true) {
    let list = [
        "XIII",
        "The Sugars Are Collapsing Pt 2",
        "The Tower",
        "XOXO",
        "If U Wanted To",
        "Cloud Sparkle Moment",
        "I'll Bet Ur Dead",
        "Limbo",
        "Lizard Lightning",
        "Mood Light",
        "Myx II",
        "If Ur Up This Late",
        "Malevolent 1",
        "Solar Numbness",
        "Symmetry Races",
        "Metal Pyramid"
    ];

    // alphabetize (bubble sort)
    if (alphabetize) {
        bubbleSort(list);
    }

    return (list);
}

function getSongNamesFormattedForS3(alphabetize = true) {
    let songnames = getSongNames(alphabetize);
    let newlist = [];
    for (let song of songnames) {
        newlist.push(song.replaceAll(' ', '_'));
    }
    return newlist;
}



function getFaunixAlbumOrders() {
    let albumOrders = JSON.parse(localStorage.getItem('faunix_album_orders'));

    // console.log("Getting album orders.");
    // console.log(albumOrders);

    // return blank if none, else self.
    return !albumOrders ? [] : albumOrders;
}




function getLinksFromLocalStorage() {
    let links = JSON.parse(localStorage.getItem('faunix_quicklinks_list'));


    if (!links || links == "") {
        links = [{
            href: "https://drive.google.com/drive/folders/1Kw1kFYGfQDCKzo8wHE0iFxZtNeyDPEI4",
            text: "Nick Mixes"
        }, {
            href: "https://soundcloud.com/wearefaunix/sets/album-2-mixes/s-xdCbxz3fRoi?si=0aa49764602e43f79d431c8d0d18c88c&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
            text: "SoundCloud"
        }]

        localStorage.setItem('faunix_quicklinks_list', JSON.stringify(links));
    }

    // console.log("Here's your links from getLinksFromLocalStorage: ");
    // console.log(links);

    return links;
}


// gets song versions from local storage. Follows this schema:
/*

    let songs = getVersionsFromLocalStorage();

    songs.push({
        timestamp: version.timestamp,
        song_name: version.song_name,
        version_name: version.version_name,
        uploader: version.uploader,
        uploader_id: version.uploader_id,
        drive_name: version.drive_name,
        s3_url: version.s3_url
    })

    localStorage.setItem('faunix_song_versions', JSON.stringify(songs));
*/
function getVersionsFromLocalStorage() {
    let versions = JSON.parse(localStorage.getItem('faunix_song_versions'));

    // if undefined, make it a blank list so we can push stuff to it.
    if (!versions) versions = [];

    // console.log("Song versions:");
    // console.log(versions);

    return versions;
}

// flips the above inside out, so it's a list of:
/*
{
    songName: "song_1"
    versions: {
        "a",
        "b",
        "c"
    }
}
*/
// O(n) baybee
function getVersionsMappedToName() {
    const vs = getVersionsFromLocalStorage();

    let map = {};
    for (let v of vs) {
        if (!map[v.song_name]) {
            map[v.song_name] = [];
        }
        // map[v.song_name].push(v.version_name);
        map[v.song_name].push(v);
    }
    // console.log(map);
    return map;
}


function getBlankSongVersion() {
    return {
        timestamp: null,
        song_name: 'null_song',
        version_name: 'blank',
        uploader: null,
        uploader_id: null,
        drive_name: null,
        s3_url: null
    };
}

// yeah bro, this should be the most recently added one.
// Feels like we can traverse in reverse order and add the first occurance.
// don't modify that return statement... it will affect order.html
// actually returns the whole version. Not just the name.
function getDefaultSongVersion(songName) {
    let vs = getVersionsFromLocalStorage();
    for (let i = vs.length - 1; i >= 0; i--) {
        if (vs[i].song_name === songName) {
            return vs[i];
        }
    }

    return getBlankSongVersion();
}




// ------------------ JSON FORMATTING TO HTML: ------------------


function getULfromJSONobj(obj) {

    const ul = document.createElement('ul');

    for (let key in obj) {
        const li = document.createElement('li');
        li.style = "margin: 0;line-height: 1.2;"

        if (typeof obj[key] === 'object') {
            li.appendChild(getULfromJSONobj(obj[key]));
        } else {
            const keytext = document.createElement('p');
            const objtext = document.createElement('p');
            keytext.style = "color: green; display: inline-block;";
            objtext.style = "color: white; display: inline-block;";
            keytext.textContent = `${key}: \t`;
            objtext.textContent = `\t${obj[key]}`;
            li.appendChild(keytext);
            li.appendChild(objtext);
        }

        ul.appendChild(li);
    }

    return ul;
}