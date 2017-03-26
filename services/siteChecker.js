
const wotService = require('./wot');
const dateCheck = require('./dateCheck');

module.exports = {
    getResult: getResult,
    test: test
};

function getResult(url) {
    // dateCheck.check(url).then(result => {
    //     console.log(result);
    // });

    return new Promise((resolve) => {
        // wotService.getResult(url).then(wotResult => {
        //     dateCheck.check(url).then(result);
        // });

        Promise.all([
            wotService.getResult(url),
            dateCheck.check(url)
        ])
        .then(results => {
            //console.log('Promise.all then');
            //console.log(results);
            //console.log(calculate(results));

            resolve(calculate(results));
        })
        .catch(reason => {
            console.log('Promise.all catch');
            console.log(reason);
            //reject(reason);
        });
    });
}

function test(url) {
    dateCheck.check(url).then(console.log);
}

function calculate(results) {
    // La fonction s'attend à recevoir
    // 1 - résultat de wot
    // 2 - Résultat de dateCheck

    let wotResult = results[0];
    let dateCheck = results[1];

    //console.log(results[0]);
    //console.log(results[1]);

    let result = 0;
    if (wotResult.confidence > 0) {
        result = (wotResult.reputation / wotResult.confidence) * dateCheck.value;
    }
    //console.log('result: ' + result);
    return result;

}
