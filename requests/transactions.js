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

module.exports = {
    getTransactions,
    nextPageTransactions
}