const Promise = require('bluebird');
const request = require('request');
const wotConfig = require('../config/wotConfig');

const wotApiBaseUrl = 'http://api.mywot.com/0.4/public_link_json2';

module.exports = function(url) {
    return new Promise((resolve, reject) => {
        const requestUrl = `${wotApiBaseUrl}/?hosts=${url}/&key=${wotConfig.apiKey}`;

        var options = {
            url: requestUrl,
            method: 'GET',
            json: true
        };

        request(options, (error, response, body) => {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });

    });
};
