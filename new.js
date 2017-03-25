test = require("./sentiment.js")

test.getSentiment("http://yahoo.com", function(data){
  console.log(data)
})