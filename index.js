var server = require('./lib');

server.get('/chat', function(req, res){
  res.sendFile(__dirname + '/chat.html');
});

server.start(8484, function() {
  console.log('listening on *:8484');
});
