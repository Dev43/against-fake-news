const request = require('request');

module.exports = {
    download: download
};

function download(url) {
    return new Promise((resolve, reject) => {

        var options = {
            url: url,
            method: 'GET'
        };

        request(options, (error, response, body) => {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    });

}
