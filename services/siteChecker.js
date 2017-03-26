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
            let sentimentResult = results[2];

            console.log(sentimentResult.sources);
            return Promise.all(sentimentResult.sources.map((url, index) => {
                while(index < 3){
                    return wotService.getResult(url)
                }
                return;
            }))
            .then((wotResults) => {
                console.log("HI")
                return resolve(calculate(results));
            });

        })
        .catch((err) => console.log);
    });
}

function calculate(results) {
    let wotResult = results[0];
    let dateCheck = results[1];
    let sentimentResult = results[2];

    console.log(sentimentResult);

    let result = 0;
    if (wotResult.confidence > 0) {
        result = (wotResult.reputation / wotResult.confidence) * dateCheck.value;
    }

    return {wotResult: wotResult, dateCheck: dateCheck, sentiment: sentimentResult, result: result};
}
