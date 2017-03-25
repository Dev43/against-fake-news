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

app.listen(PORT, () => {
  console.log("Against Fake News listening on port " + PORT);
  console.log(`http://localhost:${PORT}`);
});
