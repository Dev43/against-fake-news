module.exports = {
 getRelated: function(url){
    var spawn = require('child_process').spawn,
        py    = spawn('python3', ['relatedArticles.py']), // script is partially in application.py
        dataString = '';

    let p1 = new Promise((resolve, reject) => {

      py.stdout.on('data', function(data){
        dataString += data.toString();
      });

      py.stdout.on('end', function(){
        dataString = JSON.parse(dataString);
        py.kill();
        return resolve(dataString)
      });

      py.stdin.write(JSON.stringify(url));
      py.stdin.end();
    })
    return p1;
  }
}
