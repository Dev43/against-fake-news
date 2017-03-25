const wotService = require('./services/wot');

wotService('').then(result => {
    console.log(result);
});
