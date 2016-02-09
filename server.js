var http = require('http');
var userName = '@sktguha';
var flockToken = process.env.FLOCK_TOKEN || (process.argv && process.argv[0]);
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
    	var repoName = obj.repository.name;
    	var userName = obj.comment.user.login;
    	sendToFlock({
    		text : userName+'('+repoName+') : '+body,
    	});
    	sendToFlock(content : {
    			source : payload.comment.html_url,//comment source
    			mime_type: "text/html",
    			inline: "<a href='"+ commentUrl +"'/>"+ commentUrl+"</a>"
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