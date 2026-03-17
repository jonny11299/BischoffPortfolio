


// ----------------------- DATABASE -----------------------





// shoves a bunch of JSON blobs into a google sheet


const LATEST_DEPLOYMENT = "https://script.google.com/macros/s/AKfycbxwmLs3CKJfIj58pdWViRjWG54B-zQwq1tx2vgTokIiKL0o5eteI4EJy3G8v8pmc_nn3w/exec";
const LOCAL_SECRET = "BLOBS_ARE_SO_EASY";



// type: blob
// cell is what cell to post it to
function post(type, content, cell, onSuccess = (response) => { }, onFail = (response) => { }) {
    fetch(LATEST_DEPLOYMENT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            eventType: type,
            secret: LOCAL_SECRET, // Same secret
            timestamp: new Date(Date.now()).toLocaleString(),
            // userID: userID,
            // userName: userName,
            // referrer: document.referrer,
            content: JSON.stringify(content),
            cell: cell
        })
    }).then(response => {
        console.log(`%c Success on post : ${type}`, 'color: green');
        console.log("Data: ", content);
        console.log('Response: ', response);
        onSuccess(response);
    }).catch(err => {
        console.log(`%c Failure on post : ${type}`, 'color: red');
        console.log("Data: ", content);
        console.log('err: ', err);
        onFail(err);
    });
}




// Used to get things from the server
// returns null upon failure, returns an object otherwise.
function get(eventType, cell) {

    // return promise
    let promise = fetchViaJSONP(`${LATEST_DEPLOYMENT}?eventType=${eventType}&cell=${cell}`)
        .then(response => {
            if (response) {
                // remember to check if response is string or object.
                // console.log(`response from get(${eventType}):`);
                // console.log(response);
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
