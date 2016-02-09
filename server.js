var http = require('http');
http.createServer( function(req, res) {
    console.log(req.url);
    res.end('please visit https://github.com/sktguha/bluff/');
}).listen(process.env.PORT || 8000);