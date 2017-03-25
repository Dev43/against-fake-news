const request = require('request');
require("dotenv").config();
var spawn = require('child_process').spawn,
    py    = spawn('python3', ['application.py']), // script is partially in application.py
    data = "www.yahoo.com",
    dataString = '';

const test = "J'adore la belle journee ";
const test1 = "Je deteste le plat Nato";
const sentences = [test, test1]


function parseWebsite(url){
// Scraping a specific website

  // Receiving info from python script
  py.stdout.on('data', function(data){
    dataString += data.toString();
  });

  py.stdout.on('end', function(){
    // console.log('Data received ', dataString);
    dataString = JSON.parse(dataString)
    let sentencesArray = dataString.text.split(".").filter((element) => {
      return element.length > 0 // cannot be null
    }) // filter it more
    let preprocessedData = aggregateSentences(sentencesArray)
    console.log("the preprocessed data is" + JSON.stringify(preprocessedData))
    let results = sendRequest(sentencesArray)
    // console.log(results)
    // let avg = averageSentiment(results)
    // console.log(avg)

    return dataString;
  });

  // Sending information to python script
  py.stdin.write(JSON.stringify(url)); // url to scrape
  py.stdin.end();
}


function averageSentiment(analysisResponse){
  return analysisResponse.reduce((acc, next) => {
    return acc + next.score
  }, 0) / analysisResponse.length
}

function aggregateSentences(sentences){
  const objArray =  [];
  sentences.forEach((sentence, index) => {
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

console.log(options)

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    // get all the scores for all the sentenvces, make a mean score
    console.log(body)
    // console.log(response)
    console.log(averageSentiment(body.documents))

  });
}


parseWebsite("http://yahoo.com")
