'use strict';

const https = require('https');
const url = 'https://lemon-server-test.herokuapp.com/';

const getOptions = credentials => {
    if (credentials === 'Unauthorized') return {};
    const credentialsBase64 = Buffer.from(credentials).toString('base64');
    let options = {
        headers: {
            Authorization: `Basic ${ credentialsBase64 }`
        },
    };
    return options;
};

const request = (path, credentials) => {
    return new Promise((resolve, reject) => {
        const options = getOptions(credentials);
        let req = https.get(url + path, options, res => {
            let data = '';
            if (res.statusCode === 403){
                reject('Incorrect login or password!');
            } else if (res.statusCode === 401) {
                reject('Login and password should be specified!');
            }
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on("end", () => {
                //console.log(JSON.parse(data));
                resolve(JSON.parse(data));
            });
        })
    })

};

module.exports = request;