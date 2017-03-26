
const wotService = require('./wot');
const dateCheck = require('./dateCheck');

module.exports = {
    getResult: getResult
};

function getResult(url) {


    dateCheck.check(url).then(result => {
        console.log(result);
    });

    return new Promise((resolve) => {
        // wotService.getResult(url).then(wotResult => {
        //     dateCheck.check(url).then(result);
        // });

        Promise.all([
            wotService.getResult(url),
            //dateCheck.check(url)
        ])
        .then(result => {
            console.log(result[0].categories);
            resolve(result[0].categories)
        })
        .catch(reason => {
            console.log(reason);
        });



    });



}
