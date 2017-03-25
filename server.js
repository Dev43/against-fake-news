require("dotenv").config();
const express       = require('express');
const app           = express();
const bodyParser    = require("body-parser");
const morgan        = require("morgan");
const PORT          = process.env.PORT || 3000;
const ENV           = process.env.ENV || "development";

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }))


app.get('/', function(req, res){
  res.render('index');
});

app.post('/analyse', function(req, res) {
  // L'information necessaire (le URL est dans req.body.url -- le reste est de passe
  // ce URL a l'analyse)
  console.log(req.body.url)

  // Ppour passer les resultats de l'analyse, on les passes dans un obnjet quand on render

  res.render('analysis', {url: req.body.url})

})

app.listen(PORT, () => {
  console.log("Against Fake News listening on port " + PORT);
  console.log(`http://localhost:${PORT}`);
});
