require("dotenv").config();
const express       = require('express');
const app           = express();
const bodyParser    = require("body-parser");
const PORT          = process.env.PORT || 3000;
const siteCheckerService = require('./services/siteChecker');
const sentiment = require("./sentiment.js")

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function(req, res){
    res.render('index');
});

app.post('/analyse', function(req, res) {
  var sentimentPercentage = 0;
  sentiment.getSentiment(req.body.url, function(data){
    sentimentPercentage = data
    siteCheckerService.getResult(req.body.url).then(result => {
        res.render('analysis', {
            result: JSON.stringify(result),
            sentiment: sentimentPercentage
        });
      })
    });

});

app.listen(PORT, () => {
    console.log("Against Fake News listening on port " + PORT);
    console.log(`http://localhost:${PORT}`);
});
