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
    } else if (res.statusCode !== 200) {
      reject('Unknown error!');
    }
    res.on('data', chunk => {
      data += chunk;
      console.log(data);
    });
    res.on('end', () => {
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject('Inappropriate data');
      }
    });
  });
});

module.exports = request;
