const axios = require('axios');

/*
    Get all transactions between specified date-times

    params:
        since - date-time string formatted according to rfc-3339
        until - date-time string formatted according to rfc-3339

    returns:
        Array of objects containing transactions
*/
async function transactions(since, until) {
    return new Promise((resolve, reject) => {
        axios({
            method: 'get',
            url: 'https://api.up.com.au/api/v1/transactions',
            headers: { 
                Authorization: `Bearer ${process.env.UP_TOKEN}` 
            },
            params: {
                'filter[since]': since,
                'filter[until]': until
            }
        })
        .then(function(response) {
            resolve(response)
        })
        .catch(function(error) {
            reject(error);
        })
    });
}

module.exports = {
    transactions
}