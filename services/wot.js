const Promise = require('bluebird');
const request = require('request');
const wotConfig = require('../config/wotConfig');

module.exports = function(url) {
    return new Promise((resolve, reject) => {
        const requestUrl = `${wotConfig.api.baseUrl}/?hosts=${url}/&key=${wotConfig.api.key}`;

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
