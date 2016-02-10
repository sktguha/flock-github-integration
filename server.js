var http = require('http');
var request = require('request');
var _ = require('underscore');
var name = '@sktguha';
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
    res.uniqueCustomTimestamp = Date.now();
    console.log('url : ',req.url, ' id : '+res.uniqueCustomTimestamp);
    var payload = "";
    req.on('data', function (chunk) {
    	payload += chunk;
  	});
  req.on('end', function () {
    try{
    console.log('payload: ' + payload);
    payload = JSON.parse(payload);
    console.log('body and username : ', body, name );
   var body = payload.comment.body;
    if (body.indexOf(name) !==-1){
    	//make the flock url call
    	var repoName = payload.repository.name;
    	var userName = payload.comment.user.login;
        var commentUrl = payload.comment.html_url;
        sendToFlock({
    		text : userName+'('+repoName+') : '+body
    	}, res);
    	/*sendToFlock({
    		content : {
    			mime_type: "text/html",
    			source : commentUrl ,
    			previews : [{
    			 	inline: "<a href='"+ commentUrl +"'/>"+ commentUrl+"</a>",
    			 	mime_type: "text/html"
    			 }]
			}
		}, res);
		*/
    }  else {
        res.end('username not found in body' +  body + ' name : '+name+' id : '+res.uniqueCustomTimestamp, 200);
    }
	} catch(e){
		console.error(e);
		res.end('error occurred. ' + e.toString()+ ' id '+res.uniqueCustomTimestamp, 500)
	}
  })
    
}).listen(process.env.PORT || 8000);

function sendToFlock(data, res){
	var url = 'https://api.flock.co/hooks/sendMessage/'+ flockToken;
	console.log('url and data ',url, data);
	request({
    uri: url,
    method: "POST",
    json: true,
    headers: {
        "content-type": "application/json",
    },
    body: data
	}, _.partial(reqCallback, [data, res]));
	console.log('call to flock issued. parameters : ', data);
}

function reqCallback(args, error, response, body) {
 	var data = args[0], res = args[1];
    if(error){
 		console.error('error occurred', error);
 		res.end('error occurred. ' + error.toString()+ ' data : '+data+" id : "+res.uniqueCustomTimestamp, 500);
 		return;
 	} 
  console.log('response' , response.body);
  res.end('request sent to flock. ' + JSON.stringify(response.body)+' data : '+JSON.stringify(data)+' id : '+res.uniqueCustomTimestamp, 200);
}