const request = require('request');
require("dotenv").config();





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


function sendRequest(data){
  const options = {
    method: 'POST',
    url: 'https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment',
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
    let avg = averageSentiment(body.documents)
    resolve(avg)
    });
  })
return p2;
}



function parseWebsite(url){
// Scraping a specific website
var spawn = require('child_process').spawn,
    py    = spawn('python3', ['application.py']), // script is partially in application.py
    dataString = '';
console.log(py)
  let p1 = new Promise((resolve, reject) => {

    py.stdout.on('data', function(data){
      dataString += data.toString();

    });

    py.stdout.on('end', function(){
      dataString = JSON.parse(dataString)
      let sentencesArray = dataString.text.split(".").filter((element) => {
        return element.length > 20 // cannot be null
      }) // filter it more

      py.kill();
      resolve(sentencesArray)
    });
    // py.on('close', (code) => {
    //   console.log('closed with code', code)
    // py.stdin.end();
    // })
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
    return parseWebsite(url)
    .then((data) => {
      return sendRequest(data)
    })
    .then((avg) => {
      console.log(avg)
      return avg
    })
  }


}
