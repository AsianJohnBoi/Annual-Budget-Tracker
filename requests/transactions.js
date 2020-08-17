const axios = require('axios');

/*
    Get all transactions between specified date-times

    params:
        since - date-time string formatted according to rfc-3339
        until - date-time string formatted according to rfc-3339

    returns:
        An object containing transactional data and any links to pages 
*/
async function getTransactions(since, until) {
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
            resolve(response.data)
        })
        .catch(function(error) {
            reject(error);
        })
    });
}

/*
    Get all transactions from a page link

    params:
        link - URL to a page of transactions

    returns:
        An object containing transactional data and any links to pages 
*/
async function nextPageTransactions(link) {
    return new Promise((resolve, reject) => {
        axios({
            method: 'get',
            url: link,
            headers: { 
                Authorization: `Bearer ${process.env.UP_TOKEN}` 
            }
        })
        .then(function(response) {
            resolve(response.data)
        })
        .catch(function(error) {
            reject(error);
        })
    });
}

/*
    Get all transactional data between specified date-times

    params:
        since - date-time string formatted according to rfc-3339
        until - date-time string formatted according to rfc-3339

    returns:
        An array containing transactional data between specified date-times
*/
async function getAllTransactionalData(since, until) {
    var data = [];

    // Get transactions
    const ts = await getTransactions(since, until);
    data = [...data, ...ts.data];
    var link = ts.links.next !== null ? ts.links.next : null;
    
    // scrape transactional data from other pages
    while (link !== null) {
        var npt = await nextPageTransactions(link);
        data = [...data, ...npt.data];
        link = npt.links.next !== null ? npt.links.next : null
    }

    return data;
}


module.exports = {
    getTransactions,
    nextPageTransactions,
    getAllTransactionalData
}