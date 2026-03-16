


const LATEST_DEPLOYMENT = "https://script.google.com/macros/s/AKfycbxHlyBowr6y9NgKDrsRVUiR4ixYR3rRKK1E1GdZGWUhcxDA708PkUNugBrRcjeUjsftSw/exec";
const LOCAL_SECRET = "BUTIREALLYTRIEDTO";




let pageLoadTime = Date.now();
let userID = getUserID();
let userName = getName();


/*

    Signal flow:

    sync: 
        1. Page loads
        2. userID retrieved from localstorage, or generated
        3. name retrieved from localstorage, or retrieved from database based on userID
            4. If none, ask them who they are (redirect)

        

    Include order on every webpage must be:
        standardFunctions.js
        postman.js
        handshake.js


*/






// ----------------------- LOCAL STORAGE -----------------------

// returns my user ID
function getUserID() {
    let id = localStorage.getItem('faunix_user_id');

    if (!id) {
        id = 'user_' + getFaunixName() + "_" + Date.now();
        localStorage.setItem('faunix_user_id', id);
    }

    console.log("Hello, " + id);

    // Shoot man -- going to need to make an async getName if we don't have our name

    return id;
}

function delete_faunix_user_id() {
    let curUID = getUserID();
    localStorage.removeItem('faunix_user_id');
    console.log("You are no longer " + curUID);
    console.log("You are now " + getUserID());
}


function getName() {
    let un = localStorage.getItem('faunix_name');
    if (!un) {
        un = 'unknown';
        // This below line -- this is where we will have to redirect us to the "WHO ARE YOU" page,
        // and then once we set our name, we have to post that to our databaes, too (async)
        // localStorage.setItem('faunix_name', un);
        let redir = window.location.href;
        if (!window.location.href.includes("whoareyou")) window.location.href = "/pages/hidden/faunix/pages/whoareyou.html?redir=" + redir;

    }

    console.log("You are " + un);

    return un;
}


// Sets their first name 
// called from "WHOAREYOU.html" via button press.
function setName(thisName) {

    const params = new URLSearchParams(window.location.search);
    const redir = params.get("redir");

    // somehow post that this is me
    localStorage.removeItem('faunix_name');
    localStorage.setItem('faunix_name', thisName);
    console.log("Set name to " + thisName);
    // console.log("Pending: Send this to database, also redirect us to the who are you page if no name");
    post("link_username_userID", {
        user_id: userID,
        username: thisName
    });

    if (redir) {
        window.location.href = redir;
    }
}


function deleteLocalName() {
    localStorage.removeItem('faunix_name');
}




function deleteLinkFromLocalStorage(textName) {
    const links = getLinksFromLocalStorage();

    let newLinks = [];

    // Create a new list, skipping the value if it matches
    for (let link of links) {
        if (link.text === textName) {
            console.log("Deleting: " + link.href);
            post('delete_quick_link', { name: link.text, href: link.href });
        } else {
            newLinks.push(link);
        }
    }

    // Reset the local list without it:
    localStorage.setItem('faunix_quicklinks_list', JSON.stringify(newLinks));
}





// ----------------------- DATABASE -----------------------



// write-only function for the server.
//      could be write --> read return data if I modify it to call a callback function.
//      but then would be asyc... let's keep this sync, then create a new function for async communications with server.
// type: how to route it to the server
// data: content for the server. (Does not yet have to be stringified).
function post(type, data, onSuccess = (response) => { }, onFail = (response) => { }) {
    // Send to Google Sheets
    fetch(LATEST_DEPLOYMENT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            eventType: type,
            secret: LOCAL_SECRET, // Same secret
            timestamp: new Date(Date.now()).toLocaleString(),
            userID: userID,
            userName: userName,
            referrer: document.referrer,
            data: JSON.stringify(data)
        })
    }).then(response => {
        console.log("Success on post : " + type);
        console.log("Data: ", data);
        console.log('Response: ', response);
        onSuccess(response);
    }).catch(err => {
        console.log("Failure on post : " + type);
        console.log("Data: ", data);
        console.log('err: ', err);
        onFail(err);
    });
}


// Used to get things from the server
// returns null upon failure, returns an object otherwise.
function get(eventType) {

    // return promise
    let promise = fetchViaJSONP(`${LATEST_DEPLOYMENT}?eventType=${eventType}`)
        .then(response => {
            if (response) {
                // remember to check if response is string or object.
                console.log(`response from get(${eventType}):`);
                console.log(response);
                return response;
            } else {
                console.log("Blank response.");
                return null;
            }

        })
        .catch(err => {
            // console.log('failed to post  ', userId, err);
            console.error('Error in get:', err);
            return null
        });

    return promise;
}


// used for GET requests to subvert CORS
// You should only use this (jsonp) in scenarios where you control both the server and the client.
function fetchViaJSONP(url) {
    return new Promise((resolve, reject) => {
        const callbackName = 'jsonp_' + Date.now();
        const script = document.createElement('script');

        // Set up the callback function
        window[callbackName] = (data) => {
            delete window[callbackName];
            document.head.removeChild(script);
            resolve(data);
        };

        // Handle errors
        script.onerror = (err) => {
            delete window[callbackName];
            document.head.removeChild(script);
            console.error(err);
            reject(new Error('JSONP request failed', err));
        };

        // Add callback parameter to URL
        script.src = url + `&callback=${callbackName}`;
        document.head.appendChild(script);
    });
}





// ----------------------- BUCKET & S3 STUFF -----------------------


// Passing in:
//  file is an object uploaded from user's computer, through <input type="file" id="fileInput" accept="audio/*">
// returns: returnObject specified in the top. 
// success is boolean for success/failure
// reason is self-explanatory
// content is where you'll get the file link from.
// so if your return url's first 6 characters are 'Failed', you probably got failed bucko
// yeah bro. I GIVE you the inputUrl.
let UPLOAD_IN_PROGRESS = false;
let upload_started = Date.now();
async function putAudioFileInBucket(file, accessUrl) {
    UPLOAD_IN_PROGRESS = true;
    upload_started = Date.now();
    window.addEventListener('beforeunload', preventNav);

    // YEAH BRO YOU'RE GONNA GET A NICELY FORMATTED OBJECT FROM THIS ONE!!
    const returnObject = {
        success: false,
        reason: 'string',
        content: 'string'
    }

    const uid = getUserID(); // This is used to verify permission, and also determines the folder the file goes in.

    console.log(`Requesting upload URL for: ${file.name}\nusing url = ${accessUrl}`);

    // Step 1: Get presigned URL from your Lambda
    const response = await fetch('https://s6lwojpyb8.execute-api.us-west-2.amazonaws.com/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            uid: uid,
            filename: file.name,
            url: accessUrl
        })
    });

    const data = await response.json();

    if (!response.ok) {
        const reason = 'Failed to get upload URL: ' + JSON.stringify(data.error);
        console.error(reason);
        alert('Upload failed: ' + data.error); // modify this to be feedback form
        return {
            success: false,
            reason: reason,
            content: null
        };
    }

    // getting the signed upload URL
    const { uploadUrl, key } = data;
    // From server lambda: const key = `uploads/${uid}/${Date.now()}_${filename}`;


    console.log('Got presigned URL, uploading to S3...');

    // Step 2: Upload file directly to S3 using presigned URL
    try {

        const uploadResponse = await fetch(uploadUrl, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type || 'audio/mpeg'
            }
        });


        if (uploadResponse.ok) {
            const publicUrl = `https://faunix-objects.s3.us-west-2.amazonaws.com/${key}`;
            console.log('✅ Upload successful!');
            console.log('File URL:', publicUrl);
            // console.log('anticipated url:', accessUrl);
            // console.log(`anticipated == actual? ${publicUrl === accessUrl}`); // could wrap this in tr
            if (publicUrl !== accessUrl) {
                throw new Error("Url provided by server doesn't match locally-anticipated uploadURL");
            }
            return {
                success: true,
                reason: 'link posted successfully.',
                content: publicUrl
            };
        } else {
            const reason = 'S3 upload failed:' + JSON.stringify(uploadResponse.status);
            console.error(reason);
            alert('Upload to S3 failed');

            return {
                success: false,
                reason: reason,
                content: null
            };
        }

    } catch (error) {
        console.log("Error on fetch: ", error);
        const reason = 'Error on fetch:' + JSON.stringify(error);

        return {
            success: false,
            reason: reason,
            content: null
        };
    }

}



async function putBugReportInBucket(bugReportObject, accessUrl) {
    // reportObject instead of file
    UPLOAD_IN_PROGRESS = true;
    upload_started = Date.now();
    window.addEventListener('beforeunload', preventNav);

    // YEAH BRO YOU'RE GONNA GET A NICELY FORMATTED OBJECT FROM THIS ONE!!
    const returnObject = {
        success: false,
        reason: 'string',
        content: 'string'
    }

    const uid = getUserID(); // This is used to verify permission, and also determines the folder the file goes in.

    console.log(`Requesting upload URL for: ${bugReportObject.description}\nusing url = ${accessUrl}`);

    // Step 1: Get presigned URL from your Lambda
    const response = await fetch('https://s6lwojpyb8.execute-api.us-west-2.amazonaws.com/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            uid: uid,
            filename: `${Date.now()}.json`,
            url: accessUrl
        })
    });

    const data = await response.json();

    if (!response.ok) {
        const reason = 'Failed to get upload URL: ' + JSON.stringify(data.error);
        console.error(reason);
        alert('Upload failed: ' + data.error); // modify this to be feedback form
        return {
            success: false,
            reason: reason,
            content: null
        };
    }

    // getting the signed upload URL
    const { uploadUrl, key } = data;
    // From server lambda: const key = `uploads/${uid}/${Date.now()}_${filename}`;


    console.log('Got presigned URL, uploading to S3...');

    // Step 2: Upload file directly to S3 using presigned URL
    try {

        const uploadResponse = await fetch(uploadUrl, {
            method: 'PUT',
            body: JSON.stringify(bugReportObject),
            headers: {
                'Content-Type': 'application/json'
            }
        });


        if (uploadResponse.ok) {
            const publicUrl = `https://faunix-objects.s3.us-west-2.amazonaws.com/${key}`;
            console.log('✅ Upload successful!');
            console.log('File URL:', publicUrl);
            // console.log('anticipated url:', accessUrl);
            // console.log(`anticipated == actual? ${publicUrl === accessUrl}`); // could wrap this in tr
            if (publicUrl !== accessUrl) {
                throw new Error("Url provided by server doesn't match locally-anticipated uploadURL");
            }
            return {
                success: true,
                reason: 'link posted successfully.',
                content: publicUrl
            };
        } else {
            const reason = 'S3 upload failed:' + JSON.stringify(uploadResponse.status);
            console.error(reason);
            alert('Upload to S3 failed');

            return {
                success: false,
                reason: reason,
                content: null
            };
        }

    } catch (error) {
        console.log("Error on fetch: ", error);
        const reason = 'Error on fetch:' + JSON.stringify(error);

        return {
            success: false,
            reason: reason,
            content: null
        };
    }

}


function preventNav(e) { // connects via eventListener, ctrl+F for 'eventListener' to see the hooks.
    if (UPLOAD_IN_PROGRESS) {
        e.preventDefault();
        e.returnValue = '';
        return "WAIT! You're uploading a song right now! Please wait until done to navigate away.";
    }
}



function postSongVersionToSheets(version) {
    // run a post, define the 'then' functionality
    const success = (response) => {
        // successful post, we can now set our flag 'in_db' to 'true'

        const songVersions = getVersionsFromLocalStorage();
        let vers = songVersions.find(v => v.timestamp === version.timestamp);
        vers.in_db = true;
        console.log(`Successfully completed post of ${version.song_name} : ${version.version_name}`);
        // console.log(songVersions);
        localStorage.setItem('faunix_song_versions', JSON.stringify(songVersions));

        UPLOAD_IN_PROGRESS = false;
        window.removeEventListener('beforeunload', preventNav);
        const timeElapsed = Date.now() - upload_started;
        console.log(`time elapsed (ms): ${timeElapsed}`);

        if (upWarning) {
            upWarning.textContent = "Upload Successful :)";
            upWarning.style = "color: green";
        }
    };
    const fail = (err) => {
        console.error(`Failed to post ${version.song_name} : ${version.version_name} to sheets because of:`);
        console.error(err);


        if (upWarning) {
            upWarning.textContent = "Upload failed to post to google Sheets -- server responded with error. See console logs for more details.";
        }

        UPLOAD_IN_PROGRESS = false;
        window.removeEventListener('beforeunload', preventNav);
        const timeElapsed = Date.now() - upload_started;
        console.log(`time elapsed (ms): ${timeElapsed}`);
    }
    post('upload_song_version', version, success, fail);
}

function postAlbumOrderToSheets(package, feedbackForm) {

    /*
        const package = {
            timestamp: timestamp,
            album_order_name: name,
            songs: selectedSongs,
            uploader: getName(),
            uploader_id: getUserID(),
            in_db: false
        };
    */

    const success = (response) => {
        const albumOrders = getFaunixAlbumOrders();
        let ao = albumOrders.find((a) => a.timestamp === package.timestamp);
        console.log("Found ao! Here it is: ");
        console.log(ao);
        ao.in_db = true;
        localStorage.setItem('faunix_album_orders', JSON.stringify(albumOrders));
        console.log("Successfully posted album order to sheets: " + package.album_order_name);

        feedbackForm.style = 'color: #11ee11'; // green
        feedbackForm.textContent = "Upload Successful :)";
    }

    const fail = (err) => {
        console.error("Failed to upload album order to google sheets:");
        console.error(err);
    }

    post('upload_album_order', package, success, fail);
}


// this is where I upload the song
function setS3LinkComplete(version) {
    let songs = getVersionsFromLocalStorage();
    let vers = songs.find(v => v.timestamp === version.timestamp); // .find returns a reference to the obj, so we can write to it.
    vers.upload_complete = true; // goddamn it... now 'upload_complete' means the s3 link is properly placed, not that it's in the server.
    // whatever, i'm just goint to give it a flag in_db
    console.log("Completed upload for " + vers.version_name);
    console.log(songs);
    // set local storage with 'songs' then
    localStorage.setItem('faunix_song_versions', JSON.stringify(songs));

    postSongVersionToSheets(vers);

    // Instead of the below here, I should do it after posting in the server
    // UPLOAD_IN_PROGRESS = false;
    // window.removeEventListener('beforeunload', preventNav);
    // const timeElapsed = Date.now() - upload_started;
    // console.log(`time elapsed (ms): ${timeElapsed}`);
}

// returns the embed link of a particular song upload.
// Should only use this once and reference it later.
const AMAZONBASE = `https://faunix-objects.s3.us-west-2.amazonaws.com/`;
function generateAccessUrl(version) {
    const base = AMAZONBASE
    const key = base + `uploads/${version.uploader}/${version.uploader_id}/${version.song_name}/${version.version_name}_${Date.now()}`;
    console.log("generateAccessUrl: " + key);
    return key;
}

function generateErrorLogUrl() {
    const base = AMAZONBASE;
    const key = base + `lambda_error_log/${getName()}/${getUserID()}/${Date.now()}`;
    console.log("generateErrorLogUrl: " + key);
    return key;
}


function replaceSpaces(obj) {
    for (let key in obj) {
        if (typeof obj[key] === 'string') {
            obj[key] = obj[key].replaceAll(' ', '_');
            // console.log(obj[key]);
        }
    }
}


// Don't make it async because I don't want to immediately return a promise.
// localstorage access is sync, server communications are async.

// tryna mark this on whatever page wants to warn of upload in-progres... i.e. uploadSong.html
// have to wait till the dom loads
let upWarning;
setTimeout(() => {
    upWarning = document.getElementById('upload_warning');
}, 10);


function addSongToLocalStorage(version, file) {

    // version.song_name = version.song_name.replace(' ', '_');
    // version.version_name = version.version_name.replace(' ', '_');
    replaceSpaces(version);

    let vs = getVersionsFromLocalStorage();

    // url just needs the version / submission...
    // needs to replace any ' ' with '_'
    let url = generateAccessUrl(version);

    vs.push({
        timestamp: version.timestamp,
        song_name: version.song_name,
        version_name: version.version_name,
        uploader: version.uploader,
        uploader_id: version.uploader_id,
        drive_name: version.drive_name,
        s3_url: url,
        upload_complete: false,
        in_db: false
    })

    localStorage.setItem('faunix_song_versions', JSON.stringify(vs));

    console.log(`Successful publish to localStorage for ${version.version_name} `);
    console.log(vs);

    console.log("Uploading song file to s3 bucket now: ");
    if (upWarning) {
        upWarning.textContent = "UPLOAD IN PROGRESS -- DO NOT CLOSE THIS WINDOW";
        upWarning.style = "color: red";
    }
    try {
        let uploadPromise = putAudioFileInBucket(file, url).then(response => {
            console.log("uploadPromise resolved. Response:");
            console.log(response);
            if (response.success) {
                setS3LinkComplete(version);
                // workflow:
                // remove embed link...
                // 1. Choose file
                // 2. song name and version name attempt to auto-populate 
                // 3. get "listen" to work good :)


            } else {
                // unsuccessful... remove song entry? Or let people do partial uploads? Maybe just have them send it to me.
                if (upWarning) {
                    upWarning.textContent = "Upload failed -- server responded with error. See console logs for more details.";
                }
            }
        });
    } catch (error) {
        console.log(`Could not upload song file to version ${version.version_name} because:`);
        console.log(error);

        if (upWarning) {
            upWarning.textContent = "Upload failed -- caught an exception. See console logs for more details.";
        }
    }


}



// noteText is string, song is the {name, order, version} object, timeInSong is a number, albumOrder is the albumOrder the note is in.
// I'll need to capture the stuff that lets this note be associated with all its relevant context
// probably:
/*
// post already handles uploader, uploader_id, timestamp
note = {
    uploader (handled by post)
    uploader_id (handled by post)

    (these from object)
    song_name
    version_name
    version_timestamp

    album_order_name
    album_order_timestamp
    note_text
    time_in_song
}

*/
function postSongNote(noteText, song, timeInSong, albumOrder) {

    // console.log(noteText);

    if (noteText.length === 0) {
        // blank note, don't submit.
        console.log("Left a blank note, don't submit.");
        return;
    }

    const dataObject = {
        song_name: song.version.song_name,
        version_name: song.version.version_name,
        version_timestamp: song.version.timestamp,

        album_order_name: albumOrder.album_order_name,
        album_order_timestamp: albumOrder.timestamp,
        note_text: noteText,
        time_in_song: timeInSong
    };

    console.log("Posting song note: ");
    console.log(dataObject);

    post('song_note', dataObject);
}


function postFeatureRequest(featureText) {
    console.log('Posting feature request:', featureText);

    if (featureText.length === 0) {
        console.log("Blank feature, don't submit.");
        return;
    }


    post('feature_request', featureText);
}




function markAsDeletedInSheets(version) {
    console.log(`Marking ${version.version_name} as deleted.`);
    post('mark_as_deleted', version);
}







// Runs this upon entry:
setTimeout(() => {
    // timeStart = Date.now();
    // userID = getUserID();
}, 0);



// Post data on exit:
window.addEventListener('beforeunload', function () {
    // can do something here
});





function getFaunixName() {
    let firstnamelist = [];
    let lastnamelist = [];
    firstnamelist.push("Haunted");
    firstnamelist.push("Hidden");
    firstnamelist.push("Shimmering");
    firstnamelist.push("Peaceful");
    firstnamelist.push("Occult");
    firstnamelist.push("Thrashing");
    firstnamelist.push("Casting");
    firstnamelist.push("Ancient");
    firstnamelist.push("Random");
    firstnamelist.push("Zen");
    firstnamelist.push("Angry");
    firstnamelist.push("Grateful");
    firstnamelist.push("Mischevious");

    lastnamelist.push("Beaver");
    lastnamelist.push("Ghost");
    lastnamelist.push("Daemon");
    lastnamelist.push("Goth");
    lastnamelist.push("Deity");
    lastnamelist.push("Gardener");
    lastnamelist.push("Beep-Boop");
    lastnamelist.push("Arpeggio");
    lastnamelist.push("Moog");
    lastnamelist.push("Portal");
    lastnamelist.push("Circuit");
    lastnamelist.push("Cabin");
    lastnamelist.push("Void");
    lastnamelist.push("Release");
    lastnamelist.push("Cat");


    let firstname = firstnamelist[Math.floor(Math.random() * firstnamelist.length)];
    let lastname = lastnamelist[Math.floor(Math.random() * lastnamelist.length)];
    // console.log("Hello, " + firstname + " " + lastname);
    return firstname + "-" + lastname;

}


