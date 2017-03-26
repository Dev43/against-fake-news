require("dotenv").config();
const express       = require('express');
const app           = express();
const bodyParser    = require("body-parser");
const PORT          = process.env.PORT || 3000;
const Promise       = require('bluebird');

const analyseController = require('./controllers/analyseController');

app.use(express.static('public'))
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function(req, res){
    return res.render('index');
});


app.post('/analyse', analyseController.post);

app.listen(PORT, () => {
    console.log("Against Fake News listening on port " + PORT);
    console.log(`http://localhost:${PORT}`);
});
