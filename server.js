require("dotenv").config();
const express       = require('express');
const app           = express();
const bodyParser    = require("body-parser");
const PORT          = process.env.PORT || 3000;
const siteCheckerService = require('./services/siteChecker');
const sentiment = require("./sentiment.js")

const Promise       = require('bluebird');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function(req, res){
    return res.render('index');
});

app.post('/analyse', function(req, res) {
  var sentimentPercentage = 0;
  return sentiment.getSentimentPromise(req.body.url)
    .then(function(data){
    sentimentObject = data
    return siteCheckerService.getResult(req.body.url)
    })
    .then(result => {
         return res.render('analysis', {
            result: JSON.stringify(result),
            sentiment: JSON.stringify(sentimentObject)
        });
    })
    .catch((error) => {
      console.log("Error", error)
    })
    });



app.listen(PORT, () => {
    console.log("Against Fake News listening on port " + PORT);
    console.log(`http://localhost:${PORT}`);
});
