const { months } = require('../requests/sheet');

function calculateExpenses(transactions, cells) {
    const updatedCells = cells.map(t => {
        // filter all transactions without a category
        transactions = transactions.filter(x => x.relationships.category.data !== null);
        // filter transactions by category
        const catExps = transactions.filter(x => x.relationships.category.data.id == t.name);
        
        // calc expenses for each month
        for (var i = 0; i < 12; i++) {
            var value = catExps.filter(x => (new Date(Date.parse(x.attributes.createdAt)).getMonth() === i))

            if (value.length !== 0) {
                value = value.reduce((sum, cur) => sum + parseFloat(cur.attributes.amount.value), 0);
                // console.log(`category is ${t.name}, month is ${i}, value= ${value}`)
                t.month[months[i]].value = value;
            }
        }
    })
    return updatedCells;
}

module.exports = { calculateExpenses }