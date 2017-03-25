//const wotService = require('./services/wot');


// wotService(url).then(result => {
//     console.log(result);
// });

// const siteCheckerService = require('./services/siteChecker');

// siteCheckerService.getResult(url).then(result => {
//     console.log(result);
// });

// require('./services/wot').extractDomain(url);


// const siteDownloader = require('./services/siteDownloader');

// siteDownloader.download(url).then(body => {
//     console.log(body);

// });


const urls = [
    'http://www.legorafi.fr/2017/03/24/un-membre-du-cabinet-noir-de-francois-hollande-en-arrive-a-douter-de-sa-propre-existence/',
    'https://thevalleyreport.com/2016/04/25/woman-arrested-for-defecating-on-boss-desk-after-winning-the-lottery/',
    'http://www.firealive.it/rage-against-the-machine-to-reunite-and-release-anti-donald-trump-album/'
];


//console.log(require('./services/dateCheck').findDateInUrl(urlWithDate));

require('./services/dateCheck').findDateInUrl(urls[2]).then(date => {
    console.log(date);
}).catch(reason => {
    console.log(reason);
});

