const Promise = require('bluebird');
const wotApiBaseUrl = 'http://api.mywot.com/0.4/public_link_json2';
const wotConfig = require('../config/wotConfig');

module.exports = function(url) {
    return new Promise((resolve, reject) => {
        const requestUrl = `${wotApiBaseUrl}?/hosts=${url}/&key=${wotConfig.apiKey}`;

        resolve(requestUrl);

    });
};
