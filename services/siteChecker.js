const wotService = require('./wot');
const dateCheck = require('./dateCheck');
const sentiment = require("../sentiment.js")

module.exports = {
    getResult: getResult
};

function getResult(url) {

    return new Promise((resolve, reject) => {
        Promise.all([
            wotService.getResult(url),
            dateCheck.check(url),
            sentiment.getSentimentPromise(url)
        ])
        .then(results => {
            resolve(calculate(results));
        })
        .catch(reject);
    });
}

function calculate(results) {
    let wotResult = results[0];
    let dateCheck = results[1];
    let sentimentResult = results[2];

    let result = 0;
    if (wotResult.confidence > 0) {
        result = (wotResult.reputation / wotResult.confidence) * dateCheck.value;
    }

    return {wotResult: wotResult, dateCheck: dateCheck, sentiment: sentimentResult, result: result};
}
