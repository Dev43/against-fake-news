const wotService = require('./wot');

module.exports = {
    getResult: getResult
};

function getResult(url) {
    return new Promise((resolve) => {
        wotService.getResult(url).then(resolve);
    });
}
