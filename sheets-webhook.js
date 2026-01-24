// =============================================================================
// GOOGLE APPS SCRIPT - PhysioAssist Patient Data Webhook
// =============================================================================
// SETUP INSTRUCTIONS:
// 1. Go to Google Drive and create a new Google Sheet
// 2. Name it "PhysioAssist Patient Data"
// 3. In the sheet, add these headers in Row 1:
//    A1: Timestamp, B1: Name, C1: Mobile, D1: Age, E1: Gender, F1: Occupation,
//    G1: Diet, H1: Diabetes, I1: BP, J1: Heart, K1: Recent Surgery,
//    L1: Problem Area, M1: Problem Statement, N1: Pain Level
// 4. Go to Extensions > Apps Script
// 5. Replace the default code with this entire file
// 6. Click Deploy > New Deployment
// 7. Select Type: Web App
// 8. Execute as: Me, Who has access: Anyone
// 9. Click Deploy and copy the Web App URL
// 10. Paste the URL in config.js SHEETS_WEBHOOK_URL
// =============================================================================

function doPost(e) {
    try {
        // Parse incoming data
        const data = JSON.parse(e.postData.contents);

        // Open the active spreadsheet
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

        // Format timestamp
        const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

        // Append row with patient data
        sheet.appendRow([
            timestamp,
            data.name || '',
            data.mobile || '',
            data.age || '',
            data.gender || '',
            data.occupation || '',
            data.dietPreference || '',
            data.condition_diabetes || 'No',
            data.condition_bp || 'No',
            data.condition_heart || 'No',
            data.recentSurgery || 'none',
            data.problemArea || '',
            data.problemStatement || '',
            data.painLevel || ''
        ]);

        // Return success response
        return ContentService.createTextOutput(JSON.stringify({
            status: 'success',
            message: 'Data saved successfully'
        })).setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        // Return error response
        return ContentService.createTextOutput(JSON.stringify({
            status: 'error',
            message: error.toString()
        })).setMimeType(ContentService.MimeType.JSON);
    }
}

// Test function - run this to verify the script works
function testDoPost() {
    const testData = {
        postData: {
            contents: JSON.stringify({
                name: 'Test Patient',
                mobile: '9999999999',
                age: '30',
                gender: 'male',
                occupation: 'IT',
                dietPreference: 'vegetarian',
                condition_diabetes: 'Yes',
                condition_bp: 'No',
                condition_heart: 'No',
                recentSurgery: 'none',
                problemArea: 'back',
                problemStatement: 'Lower back pain while sitting',
                painLevel: '6'
            })
        }
    };

    const result = doPost(testData);
    Logger.log(result.getContent());
}
