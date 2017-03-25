const wotService = require('./services/wot');

const url = 'http://www.legorafi.fr/2017/03/24/un-membre-du-cabinet-noir-de-francois-hollande-en-arrive-a-douter-de-sa-propre-existence/';

wotService(url).then(result => {
    console.log(result);
});
