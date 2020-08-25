const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const path = require('path');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = '../credentials/token.json';
const gCredentials = require('../credentials/credentials.json');

const { client_secret, client_id, redirect_uris } = gCredentials.installed;
const oAuth2Client = new google.auth.OAuth2(
  client_id, client_secret, redirect_uris[0]);
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 */
async function authorize() {
  try {
    // Check if token exists
    const token = require(TOKEN_PATH);
    oAuth2Client.setCredentials(token);

    // Obtain new access token if it is about to expire
    oAuth2Client.on('tokens', (tokens) => {
      if (tokens.refresh_token) oAuth2Client.setCredentials(tokens); // store the new tokens
    });

    return oAuth2Client;
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND' && err.message.includes("token.json")) {
      console.log("<WARNING--- Token does not exists. Generating a new token --->");
      await getNewToken(oAuth2Client);
    }
    else console.log('Error occured: ', err);
  }
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 */
async function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(path.join(__dirname, TOKEN_PATH), JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        return console.log('Token stored to', TOKEN_PATH);
      });
    });
    authorize();
  });
}

module.exports = {
  authorize
}