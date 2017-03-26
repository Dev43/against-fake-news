const wotService = require('./wot');
const dateCheck = require('./dateCheck');
const sentiment = require("../sentiment.js")

module.exports = {
    getResult: getResult
};

function getResult(url) {

    return new Promise((resolve, reject) => {
       return Promise.all([
            wotService.getResult(url),
            dateCheck.check(url),
            sentiment.getSentimentPromise(url)
        ])
        .then(results => {
            let sentimentResult = results[2];

            // let wotSourcesPromises = [];
            // let length = sentimentResult.sources.length >= 3 ? 3 : sentimentResult.sources.length;

            // for (let i = 0; i < length; i++) {
            //     wotSourcesPromises.push(wotService.getResult(sentimentResult.sources[i]));
            // }

            return resolve(calculate(results));
        })
        .catch(reject);
    });
}

function calculate(results) {
    // 0.5((R/100*C/100)*F)+D+T+S*0.2

    let wotResult = results[0];
    let dateResult = results[1];
    let sentimentResult = results[2];


    let f = sentimentResult.language.French ? 1.4 : 1;
    let rep = wotResult.reputation || 50;
    let r = rep / 100;
    let conf = wotResult.confidence || 50;
    let c = conf / 100;
    let s = (50 - Math.abs(50 - sentimentResult.sentiment_avg)) * 0.4;

    // let d = dateResult.value / 100;
    let t = sentimentResult.scoreTitle / 100;
    console.log(f,r,c,s,t)

    let score = (0.5 * (r * c * f) + t + s) *100//d;
    console.log("the score is", score)
    return {score: score, wotResult: wotResult, dateResult: dateResult, sentimentResult: sentimentResult};
}
