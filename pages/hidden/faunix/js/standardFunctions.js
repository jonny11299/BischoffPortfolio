

/*

Implmements lots of getting and setting that is required across various webpages.

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



// ------------------ END OF OUTLINE OF THE SHEETS / COLUMNS ------------------





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

