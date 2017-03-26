
module.exports = {
    check: check,
    findDateWithinSite: findDateWithinSite,
    lnDiffDates: lnDiffDates
};

function check(url) {
    return new Promise((resolve, reject) => {

        findDateInUrl(url)
        .then(resolve)
        .catch(reason => {
            // Fallback vers le téléchargement de la page.
            console.log(reason);

            const siteDownloader = require('./siteDownloader');

            siteDownloader.download(url).then(body => {
                findDateWithinSite(body).then(date => {
                    resolve(lnDiffDates(date));
                })
                .catch(reject);

            }).catch(reject);
        });
    });

}

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

function findDateWithinSite(body) {
    return new Promise((resolve, reject) => {

        const dateRegExes = [
            /\d{1,2}\/\d{1,2}\/\d{4}/g,
            /\d{4}\/\d{2}\/\d{2}/g,
        ];

        let i = 0;
        let foundDate;

        while (i < dateRegExes.length && !foundDate) {
            let r = dateRegExes[i++];

            let found = body.match(r);

            if (found && found.length) {
                foundDate = found[0];

                resolve(foundDate);
            }
        }

        if (!foundDate) {
            reject('Aucune date trouvée.');
        }
    });
}

function lnDiffDates(dateArticle) {
    const moment = require('moment');
    const now = moment();
    const end = moment(dateArticle);

    var duration = moment.duration(now.diff(end));

    let result = Math.log(duration.asMinutes());

    return result;
}
