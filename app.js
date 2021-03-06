require('dotenv').config();

const { getAllTransactionalData } = require('./requests/transactions');
const { authorize } = require('./requests/authGoogle');
const { mapExpenseSheet } = require('./requests/sheet');

const CALC_YEAR = true;
const spendingAccount = process.env.UP_SPENDING_ACC;

const commonDescriptions = [
    'Auto Transfer from Savings',
    'Round Up'
]

if (CALC_YEAR) {
    (async () => {
        const tsns = await getAllTransactionalData('2020-08-01T00:00:00.52z', '2020-12-31T00:00:00.52z');

        // filter
        const spendingTsns = tsns.filter(e =>
            e.relationships.account.data.id === spendingAccount
            && !commonDescriptions.includes(e.attributes.description)
        )

        // Authorise user
        const auth = await authorize();

        // get data from the spreadsheet
        const expenseCells = await mapExpenseSheet(auth);

        // save to spreadsheet

    })()
}
