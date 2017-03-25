
module.exports = {
    findDateInUrl: findDateInUrl
};

function findDateInUrl(url) {
    return new Promise((resolve, reject) => {
        let regex = /\d{4}\/\d{2}\/\d{2}/g;

        const found = url.match(regex);

        if (found && found.length) {
            resolve(found[0]);
        } else {
            reject('Date not found in Url.');
        }
    });

}
