
module.exports = {
    download: download
};

function download(url) {
    return new Promise((resolve, reject) => {
        resolve(url);
    });
}
