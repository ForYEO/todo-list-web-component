var express = require('express');
var app = express();
var http = require('http').Server(app);

app.use("/components",express.static(__dirname + "/web/components"));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/web/index.html');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});