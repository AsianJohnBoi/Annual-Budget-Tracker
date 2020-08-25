const { google } = require('googleapis');

// spreadsheet names
const EXPENSE_SHEET_NAME = 'Expenses'
const SHEET_ID = process.env.SPREADSHEET_ID

// start and finishing positions to read
const START_COL = 'C'
const END_COL = 'Q'
const START_ROW = 5
const END_ROW = 54

const months = [
    'jan', 'feb', 'mar', 'apr',
    'may', 'jun', 'jul', 'aug',
    'sep', 'oct', 'nov', 'dec'
]

/**
 * Gets the cells from the Expenses spreadsheet and determines the cell 
 * positions
 * @see https://docs.google.com/spreadsheets/d/<id>/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
async function mapExpenseSheet(auth) {
    return new Promise((resolve, reject) => {
        const sheets = google.sheets({ version: 'v4', auth });
        sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `${EXPENSE_SHEET_NAME}!${START_COL}${START_ROW}:${END_COL}${END_ROW}`,
        }, (err, res) => {
            if (err) return reject('The API returned an error: ' + err);
            const rows = (res.data.values);
            if (rows.length) {

                // set indexes to determine cell positions
                var indexRow = START_ROW;
                var indexCol = START_COL;

                const categories = rows.map((row) => {
                    var res = {
                        "name": "",
                        "month": {}
                    }

                    // set category as the name
                    res.name = row[0];

                    // create object for each month and cell values
                    months.map(m => {
                        res.month[m] = {
                            "value": 0,
                            "cell": {
                                "col": `${indexCol = nextChar(indexCol)}`,
                                "row": `${indexRow}`
                            }
                        }
                    })

                    indexRow++; // increment row
                    indexCol = START_COL; // reset column

                    return res;
                })
                .filter(x => x.name !== 'Monthly totals:' &&
                            x.name !== undefined);
                resolve(categories);
            }
        });
    });
}

/**
 * Return the next charCode character. e.g. A -> B, j -> k
 * @param {*} c character to pass
 */
function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}

module.exports = { mapExpenseSheet }