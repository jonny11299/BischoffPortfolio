

// will require the webpage to also include tool_server.js

function post_blob(cell, content, onSuccess = (response) => { }, onFail = (response) => { }) {
    console.log(`Posting blob at ${location}`);
    console.log(content);
    post("blob", content, cell, onSuccess, onFail);
}

async function get_blob(cell) {
    // console.log("Getting blob at cell " + cell);
    const obj = await get('get_blob', cell);
    // console.log("Got blob:");
    // console.log(obj);
    return obj;
}



// stores a list of keys for different blobs
const blob_keys = [
    {
        name: 'copypaste_body',
        row: 10,
        column: 'a'
    },
    {
        name: 'policy_notes',
        row: 11,
        column: 'a'
    },
    {
        name: 'blank',
        row: 0,
        column: 'a'
    },
    {
        name: 'fr_ruleset_default',
        row: 1,
        column: 'b'
    },
    {
        name: 'fr_ruleset_default_conditional',
        row: 3,
        column: 'b'
    },
    {
        name: 'fr_ruleset_user',
        row: 2,
        column: 'b'
    }
];



function getLocation(name) {
    for (let key of blob_keys) {
        if (key.name === name) {
            return `${key.column}${key.row}`;
        }
    }

    return null;
}
