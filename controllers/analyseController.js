const siteChecker = require('../services/siteChecker');
const sentiment = require("../sentiment.js");
const relatedArticles = require("../relatedArticles.js");
const satirical = require('../services/satirical');

module.exports = {
    post: post
};

function post(req, res) {

    const url = req.body.url;

    if(!req.body.url){
        return res.render("error")
    }
    let isSatirical = satirical.isSatirical(url);
    let totalScore = Math.random()*100

    Promise.all([
        // sentiment.getSentimentPromise(req.body.url),
        relatedArticles.getRelated(req.body.url),
        siteChecker.getResult(url)
    ]).then(results => {
        // console.log(results)
	console.log("HEEEERE    /n")
       	console.log("The results are" + JSON.stringify(results))
        // console.log(cleanCategories(results[1]))
        return res.render('analysis', {
            sentiment: JSON.stringify(results[0]),
            articles: JSON.stringify(results[0].relatedArticles),
            result: JSON.stringify(results[1]),
            isSatirical: JSON.stringify(isSatirical),
            description: cleanCategories(results[1]),
	       totalScore: getScore(results[1]),
           score: getScore(results[1])
        });
    }).catch((err) => {
        console.log("Error, the error is", err)
    });

}

function cleanCategories(resultFromWot){
    console.log("THE WOT RESULTS ARE" + JSON.stringify(resultFromWot))
    var newCategories = []
        resultFromWot.wotResult.categories.forEach(function(category) {
            console.log(category.name)
            if(newCategories.indexOf(category.name)){
                newCategories.push(category.name)
            }
        })
        console.log(newCategories)
        return newCategories

}

function getScore(resultFromWot){
    console.log(resultFromWot.score)
    return resultFromWot.score
}
