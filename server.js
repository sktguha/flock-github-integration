var http = require('http');
http.createServer( function(req, res) {
    console.log(req.url);
    var body = "";
    req.on('data', function (chunk) {
    	body += chunk;
  	});
  req.on('end', function () {
    console.log('body: ' + body);
    var jsonObj = JSON.parse(body);
  })
    res.end('please visit https://github.com/sktguha/flock-github-integration', 200);
}).listen(process.env.PORT || 8000);