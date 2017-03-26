
module.exports = {
    check: check,
    findDateWithinSite: findDateWithinSite,
    lnDiffDates: lnDiffDates
};

function check(url) {
    return new Promise((resolve) => {

        // findDateInUrl(url)
        // .then(resolve)
        // .catch(reason => {
        //     // Fallback vers le téléchargement de la page.
        //     //console.log(reason);

        //     const siteDownloader = require('./siteDownloader');

        //     siteDownloader.download(url).then(body => {
        //         findDateWithinSite(body).then(date => {
        //             console.log('then findDateWithinSite');
        //             resolve(lnDiffDates(date));
        //         })
        //         .catch(reason => {
        //             console.log('1');
        //             reject(reason);
        //         });
        //     }).catch(reason => {
        //         console.log('1');
        //         reject(reason);
        //     });
        // });

        findDateInUrl(url)
            .then(date => {
                resolve({
                    value: lnDiffDates(date),
                    reason: 'Date trouvée dans URL.'
                });
            })
            .catch(reason => {
                // pas de date trouvée dans l'URL
                //console.log(reason);

                const siteDownloader = require('./siteDownloader');

                siteDownloader.download(url)
                    .then(body => {
                        //console.log('téléchargé');

                        findDateWithinSite(body)
                            .then(date => {
                                //console.log(date);

                                //today.diff(future) // today - future < 0

                                // const moment = require('moment');
                                // const now = moment();
                                // const end = moment(date.foundDate, date.format);
                                // let duration = moment.duration(now.diff(end));

                                let duration = getDuration(date);

                                if (duration < 0) {
                                    resolve({
                                        value: 0,
                                        reason: 'La date est dans le futur.'
                                    });
                                } else {

                                    resolve({
                                        value: lnDiffDates(duration),
                                        reason: 'Date trouvée dans le site.'
                                    });
                                }
                            });
                    });
            });
    });
}

function findDateInUrl(url) {
    return new Promise((resolve, reject) => {
        let regex = /\d{4}\/\d{2}\/\d{2}/g;

        const found = url.match(regex);

        if (found && found.length) {
            resolve({
                foundDate: found[0],
                format: 'YYYY/MM/DD'
            });
        } else {
            reject({
                value: 0,
                reason: "Aucune date trouvée dans l'URL."
            });
        }
    });
}

function findDateWithinSite(body) {
    return new Promise((resolve, reject) => {

        const dateRegExes = [{
            format: 'YYYY/MM/DD',
            regex: /\d{4}\/\d{2}\/\d{2}/g
        },{
            format: 'MM/DD/YYYY',
            regex: /\d{1,2}\/\d{1,2}\/\d{4}/g
        }];

        let i = 0;
        let foundDate;

        while (i < dateRegExes.length && !foundDate) {
            let dateRegEx = dateRegExes[i++];

            let found = body.match(dateRegEx.regex);

            if (found && found.length) {
                foundDate = found[0];

                resolve({
                    foundDate: foundDate,
                    format: dateRegEx.format
                });
            }
        }

        if (!foundDate) {
            reject({
                value: 0,
                reason: 'Aucune date trouvée sur le site.'
            });
        }
    });
}

function lnDiffDates(date) {

    return new Promise((resolve, reject) => {

        console.log(date);

        const moment = require('moment');
        const now = moment();
        const end = moment(date.foundDate, date.format);

        let duration = moment.duration(now.diff(end));

        // if (duration < 0) { // revient à dire que la date est dans le futur
        //     reject({
        //         value: 0,
        //         reason: 'La date trouvée est dans le futur.'
        //     });
        // }

        console.log(duration.asMinutes());

        //let result = Math.log(duration.asMinutes());
        //return result;

        resolve(Math.log(duration.asMinutes()));

    });
}

function getDuration(date) {

    if (date.foundDate || date.format) {

        const moment = require('moment');
        const now = moment();
        const end = moment(date.foundDate, date.format);

        return moment.duration(now.diff(end));

    } else {
        return 0;
    }

}
