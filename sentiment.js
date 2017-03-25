const request = require('request');
require("dotenv").config();
var spawn = require('child_process').spawn,
    py    = spawn('python3', ['application.py']), // script is partially in application.py
    dataString = '';




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
    // console.log(body)
    // console.log(body.documents)
    let avg = averageSentiment(body.documents)
    // console.log(avg)
    resolve(avg)
    });
  })
return p2;
}


// parseWebsite("http://yahoo.com").then(console.log)
// parseWebsite("http://yahoo.com")
//     .then((data) => {
//       return sendRequest(data)
//     })
//     .then((avg) => {
//       console.log(avg)
//     })

function parseWebsite(url){
// Scraping a specific website
  // py.stdin.write(JSON.stringify(url)); // url to scrape
  let p1 = new Promise((resolve, reject) => {

    py.stdout.on('data', function(data){
      dataString += data.toString();
    });

    py.stdout.on('end', function(){
      // console.log('Data received ', dataString);
      dataString = JSON.parse(dataString)
      let sentencesArray = dataString.text.split(".").filter((element) => {
        return element.length > 20 // cannot be null
      }) // filter it more

      resolve(sentencesArray)
    });

    py.stdin.end(JSON.stringify(url));

  })
    // Receiving info from python script
  return p1;
  // Sending information to python script
}
// function parseWebsite(url, cb){
// // Scraping a specific website
//   // py.stdin.write(JSON.stringify(url)); // url to scrape

//   // Receiving info from python script
//   py.stdout.on('data', function(data){
//     dataString += data.toString();
//   });

//   py.stdout.on('end', function(){
//     // console.log('Data received ', dataString);
//     dataString = JSON.parse(dataString)
//     let sentencesArray = dataString.text.split(".").filter((element) => {
//       return element.length > 20 // cannot be null
//     }) // filter it more
//     let preprocessedData = aggregateSentences(sentencesArray)
//     // console.log(preprocessedData)
//     let results = sendRequest(sentencesArray, cb)
//     return
//   });

//  return py.stdin.end(JSON.stringify(url));

//   // Sending information to python script

// }

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