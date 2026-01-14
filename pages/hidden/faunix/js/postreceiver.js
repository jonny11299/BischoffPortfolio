
/*
  12/20/25: I'm writing this on the flight back to Wisconsin, so it's inevitably going to be quite buggy
            when I first start using it. Regardless, hope I can get a template, and hope it works.


*/


const SECRET = "BUTIREALLYTRIEDTO";


// For adding data to the database:
function doPost(e) {


  // Begin parsing logic:

  const data = JSON.parse(e.postData.contents);

  if (data.secret !== SECRET) {
    return ContentService.createTextOutput('Unauthorized');
  }


  // Yeah, don't re-order the tabs or this will break.
  // Sure, I could do an "assert," but I'll just notice it when shit shows up wonky on the sheet.

  // Get the spreadsheet
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  // Get first tab (sheet1)
  const sheet = spreadsheet.getSheets()[0];  // Index 0 = first tab

  // Get second tab (sheet2)
  const sheet_notracking = spreadsheet.getSheets()[1];  // Index 1 = second tab



  if (data.eventType === 'page_exit') {
    sheet.appendRow([
      data.timestamp,
      data.userId,
      data.page,
      '',
      data.timeSpent
    ]);
  } else if (data.eventType === 'log_page_view') {
    sheet.appendRow([
      data.timestamp,
      data.userId,
      data.page,
      data.referrer,
      ''
    ]);

  } else if (data.eventType === 'do_not_track') {
    sheet_notracking.appendRow([
      data.timestamp,
      data.userId,
      data.reason
    ]);


  } else if (data.eventType === 'do_track') {
    // Add a debug sheet (create a third tab called "Debug" first)
    const debugSheet = spreadsheet.getSheets()[2];  // Your debug tab

    debugSheet.appendRow([
      new Date(),
      'do_track called',
      'Looking for: ' + data.userId
    ]);

    const dataRange = sheet_notracking.getDataRange();
    const values = dataRange.getValues();

    debugSheet.appendRow(['Total rows', values.length]);

    let deletedCount = 0;
    for (let i = values.length - 1; i >= 1; i--) {
      const sheetUserId = String(values[i][1]).trim();
      const targetUserId = String(data.userId).trim();

      debugSheet.appendRow(['Row ' + i, 'Comparing', sheetUserId, 'to', targetUserId, sheetUserId === targetUserId]);

      if (sheetUserId === targetUserId) {
        sheet_notracking.deleteRow(i + 1);
        deletedCount++;
      }
    }

    debugSheet.appendRow(['Deleted rows', deletedCount]);


  } else {

    let rowJson = JSON.stringify({
      timestamp: Date.now(),
      userId: "unknown",
      page: 'unknown POST request',
      referrer: "data.eventType: " + data.eventType,
    });

    sheet.appendRow([
      rowJson.timestamp,
      rowJson.userId,
      rowJson.page,
      rowJson.referrer,
      ''
    ]);
  }

  return ContentService.createTextOutput('Success');
}


// For pulling data from the database:
// This operation is sometimes rejected by CORS, and Google Sheets does not have CORS support.
// We're circumventing that using "fetchViaJSONP()" on our local side.
// I don't actually understand how that function works at all... let me ask Claude. He provided it.
// -------------------
// okay so it's a javascript injection window, effectively. I return a javascript function that resolves to the requested data.
// So funny that you can get javascript in scenarios when, say, XML or JSON is blocked.
// You should only use this (jsonp) in scenarios where you control both the server and the client.
function doGet(e) {
  const eventType = e.parameter.eventType;
  const callback = e.parameter.callback;

  if (eventType === 'get_opted_out_users' && callback) {
    const jsonData = getOptedOutUsersLocal();

    // Return as JSONP (executable JavaScript)
    return ContentService
      .createTextOutput(`${callback}(${jsonData})`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  } else if (data.eventType === "get_user_data_summary") {
    // THIS CURRENTLY RETURNS ALL USERS
    // Get first tab (sheet1)
    const sheet = spreadsheet.getSheets()[0];  // Index 0 = first tab

    const data = sheet.getDataRange().getValues();

    // Skip header row (assuming row 1 is headers)
    const rows = data.slice(1);

    // 1. Count of each page accessed
    const pageCounts = {};
    rows.forEach(row => {
      const page = row[2]; // Column C (0-indexed, so index 2)
      pageCounts[page] = (pageCounts[page] || 0) + 1;
    });

    // 2. Sum of time spent
    const totalTimeSpent = rows.reduce((sum, row) => {
      const timeSpent = row[4] || 0; // Column E (index 4)
      return sum + timeSpent;
    }, 0);

    // Return summary
    return ContentService
      .createTextOutput(JSON.stringify({
        pageCounts: pageCounts,
        totalTimeSpent: totalTimeSpent
      }))
      .setMimeType(ContentService.MimeType.JSON);

  }

  return ContentService.createTextOutput(JSON.stringify({ error: 'Invalid request' }));
}



function getOptedOutUsersLocal() {

  // Yeah, don't re-order the tabs or this will break.
  // Sure, I could do an "assert," but I'll just notice it when shit shows up wonky on the sheet.
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const optOutSheet = spreadsheet.getSheets()[1];
  const data = optOutSheet.getDataRange().getValues();
  const optedOutUsers = data.slice(1).map(row => row[1]); // Column B

  // Return as JSONP (executable JavaScript)
  const jsonData = JSON.stringify({ optedOutUsers: optedOutUsers });
  return jsonData;
}
