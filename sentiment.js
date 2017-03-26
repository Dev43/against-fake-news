const request = require('request');
require("dotenv").config();
const SENTIMENT_URL = 'https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment';
const LANGUAGE_URL = "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/languages";

function averageSentiment(analysisResponse){
  return analysisResponse.reduce((acc, next) => {
    if(next.score < 0.25){
      next.score = -2
    }
    return acc + next.score
  }, 0) / analysisResponse.length
}

function aggregateSentences(sentences){
  const objArray =  [];
  sentences.forEach((sentence, index) => {
    if(index > 999) {
      return // cannot have more than 1000 lines
    }
    objArray.push({
      "id": index + 1,
      "text": sentence
    })
  })
  return (objArray);
}

function mostImportantLanguage(languageArray){
  let languages = {}
  languageArray.forEach((element) => {
    if(!languages.hasOwnProperty(element.detectedLanguages[0].name) && element.detectedLanguages[0].name !== undefined){
      languages[element.detectedLanguages[0].name] = {count: 1, coefficient: element.detectedLanguages[0].score};
    } else if(element.detectedLanguages[0].name !== undefined){
      languages[element.detectedLanguages[0].name].count++;
      languages[element.detectedLanguages[0].name].coefficient += element.detectedLanguages[0].score;
    }
  })
    // console.log(languages)
    var maxCount = 0;
    var maxObject = {}
    for(var langs in languages){

      if(languages[langs].count > maxCount ){
        maxCount = languages[langs].count
        maxObject = {[langs]: languages[langs].coefficient/languages[langs].count}
      }
    }

    // console.log(maxObject)
    return maxObject
}

function sendRequest(data, url){
  const options = {
    method: 'POST',
    url: url,
    headers: {
       'cache-control': 'no-cache',
       "accept": 'application/json',
       'content-type': 'application/json',
       'ocp-apim-subscription-key': '0faf54fce59e41719f46aaa3d6687995' },
    body:{
      documents: aggregateSentences(data)//data
      },
    json: true
  };

  let p2 = new Promise((resolve, reject) => {

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      // get all the scores for all the sentenvces, make a mean score
      if(url === SENTIMENT_URL){
        let avg = averageSentiment(body.documents)
        resolve(avg)
      } else if (url === LANGUAGE_URL){
        // console.log(JSON.stringify(body.documents))
        let prominentLanguage = mostImportantLanguage(body.documents)
        resolve(prominentLanguage)
      }
      });
    })
  return p2;
}


function parseWebsite(url){
  var spawn = require('child_process').spawn,
    py    = spawn('python3', ['application.py']), // script is partially in application.py
    dataString = '';

  let p1 = new Promise((resolve, reject) => {

    py.stdout.on('data', function(data){
      dataString += data.toString();
    });

    py.stdout.on('end', function(){
      dataString = JSON.parse(dataString)
      var scoreTitle = dataString.scoreTitle;
      var sources = dataString.source
      // console.log(dataString)
      let sentencesArray = dataString.text.split(".").filter((element) => {
        return element.length > 20 // cannot be null
      }) // filter it more

      py.kill();
      resolve({sentences: sentencesArray, scores: scoreTitle, sources: sources})
    });

    py.stdin.write(JSON.stringify(url));
    py.stdin.end();
  })
  return p1;
}


module.exports = {
  getSentiment: function(url, cb){
    parseWebsite(url, cb)
  },

  getSentimentPromise: function(url){
    let dataObject = {}
    let theData;

    return parseWebsite(url)
    .then((data) => {
      theData = data.sentences
      dataObject["scoreTitle"] = data.scores;
      dataObject["sources"] = data.sources
      return sendRequest(theData, SENTIMENT_URL)
    })
    .then((avg) => {
      console.log(avg)
      dataObject["sentiment_avg"] = avg
      // return avg;
      return sendRequest(theData, LANGUAGE_URL)
    })
    .then((languageObject) => {
      console.log(languageObject)
      dataObject["language"] = languageObject
      return Promise.resolve(dataObject)
    })

  }


}
