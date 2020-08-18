require('dotenv').config();

const { getAllTransactionalData } = require('./requests/transactions');
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
    })()
}
