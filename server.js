var http = require('http');
var userName = '@sktguha';
var flockToken = process.env.FLOCK_TOKEN || (process.argv && process.argv[2]);
var commentUrl = 'http://www.google.com';
/*sendToFlock({
			text  : 'your name was mentioned',
	  		content : {
    			mime_type: "text/html",
    			title : 'your name was mentioned',
    			description : 'your name was mentioned',
    			source : commentUrl ,
    			previews : [{
    			 	inline: "<a href='"+ commentUrl +"'/>"+ commentUrl+"</a>",
    			 	mime_type: "text/html"
    			 }]
    		}
    		}); */
http.createServer( function(req, res) {
    console.log(req.url);
    var payload = "";
    req.on('data', function (chunk) {
    	payload += chunk;
  	});
  req.on('end', function () {
    try{
    console.log('payload: ' + payload);
    payload = JSON.parse(payload);
    var body = payload.comment.body;
    var commentUrl = payload.comment.html_url;
    if (body.indexOf(userName)){
    	//make the flock url call
    	var repoName = payload.repository.name;
    	var userName = payload.comment.user.login;
    	var commentSrc = payload.comment.html_url;
    	sendToFlock({
    		text : userName+'('+repoName+') : '+body,
    	});
    	sendToFlock({
    		content : {
    			mime_type: "text/html",
    			source : commentUrl ,
    			previews : [{
    			 	inline: "<a href='"+ commentUrl +"'/>"+ commentUrl+"</a>",
    			 	mime_type: "text/html"
    			 }]
			}
		});
    }
	} catch(e){
		console.error(e);
	}
  })
    res.end('please visit https://github.com/sktguha/flock-github-integration', 200);
}).listen(process.env.PORT || 8000);

function sendToFlock(data){
	var url = 'https://api.flock.co/hooks/sendMessage/'+ flockToken;
	console.log(url);
	require('request')({
    uri: url,
    method: "POST",
    json: true,
    headers: {
        "content-type": "application/json",
    },
    body: data
	}, reqCallback);
	console.log('request sent to flock');
}

function reqCallback(error, response, body) {
 	if(error){
 		console.error('error occurred', error);
 		return;
 	} 
  console.log('response' , response.body);
}