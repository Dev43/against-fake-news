const satiricalDB = require('../satirical_sites_db');

module.exports = {
    isSatirical: isSatirical
};

function isSatirical(url) {
    return satiricalDB.knownSites.hasOwnProperty("http://" + url) ||
         satiricalDB.knownSites.hasOwnProperty("www." + url);
}
