'use strict';

const https = require('https');
const url = 'https://lemon-server-test.herokuapp.com';

const getOptions = credentials => {
  const credentialsString = credentials[0] + ':' + credentials[1];
  const credentialsBase64 = Buffer.from(credentialsString).toString('base64');
  const options = {
    headers: {
      Authorization: `Basic ${credentialsBase64}`
    },
  };
  return options;
};

const request = (path, credentials) => new Promise((resolve, reject) => {
  const options = getOptions(credentials);
  https.get(url + path, options, res => {
    let data = '';
    if (res.statusCode === 403) {
      reject('Incorrect login or password!');
    } else if (res.statusCode === 401) {
      reject('Login and password should be specified!');
    }
    res.on('data', chunk => {
      data += chunk;
    });
    res.on('end', () => {
      resolve(JSON.parse(data));
    });
  });
});

module.exports = request;
