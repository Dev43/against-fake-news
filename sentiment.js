require("dotenv").config();

const request = require('request');
var scraperjs = require('scraperjs');


const test = "J'adore la belle journee ";
const test1 = "Je deteste le plat Nato";
const sentences = [test, test1]

function aggregateSentences(sentences){
  const objArray =  [];
  sentences.forEach((sentence, index) => {
    objArray.push({
      "id": index +1,
      "text": sentence
    })
  })
  console.log(objArray)
  return (objArray);
}


var options = {
  method: 'POST',
  url: 'https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment',
  headers: {
     'cache-control': 'no-cache',
     "accept": 'application/json',
     'content-type': 'application/json',
     'ocp-apim-subscription-key': '0faf54fce59e41719f46aaa3d6687995' },
  body:{
    documents: aggregateSentences(sentences)
    },
  json: true

  };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
  // get all the scores for all the sentenvces, make a mean score
  console.log(averageSentiment(body.documents))

});




function averageSentiment(analysisResponse){
  return analysisResponse.reduce((acc, next) => {
    return acc + next.score
  }, 0) / analysisResponse.length
}