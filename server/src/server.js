var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server, { origins: '*:*'});
var path = require("path");

var socketEvent = require("./io/socketEvent")(io);


const staticFiles = express.static(path.join(__dirname, '../../client/build'));
app.use(staticFiles);

app.use('/*', staticFiles);

app.use(bodyParser.json());

var port = process.env.PORT || 8080;

server.listen(port, function(err) {
	if (err) {
		console.log(err);
	} else {
		const host = server.address().address;
		const port = server.address().port;
		console.log(`Server listening on ${host}:${port}`);
	}
});