var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis = require("redis").createClient();


function bindSocket(nsp) {
  function cmdGetKey(cmd) {
    return cmd[0];
  }

  function cmdGetValue(cmd) {
    return cmd[1];
  }

  console.log("binding socket for namespace " + nsp);
  io.of(nsp).on('connection', function(socket){
    console.log('a user connected to namespace ' + nsp);
    socket.on('disconnect', function(){
      console.log('user disconnected from namespace' + nsp);
    });

    socket.on('add', function(cmd){
      var key = cmdGetKey(cmd);
      var val = cmdGetValue(cmd);
      console.log(key, val)
      redis.rpush(key, val);
      io.of(nsp).emit('add ' + key, val);
    });

    socket.on('list', function(cmd){
      console.log(cmd)
      var key = cmdGetKey(cmd);
      redis.lrange(key, 0, -1, function(err, data) {
        if(err) return console.log(err);
        data.forEach(function(msg) {
          socket.emit("add " + key , msg);
        })
      });
    });
  });
}


redis.on("error", function (err) {
  console.log("Error " + err);
});

redis.lrange("_namespaces_", 0, -1, function(err, data) {
  if(err) return console.log(err);
  data.forEach(bindSocket);
})

app.get('/', function(req, res){
  res.render('index');
});

app.get('/chat', function(req, res){
  res.sendFile(__dirname + '/chat.html');
});

http.listen(8484, function(){
  console.log('listening on *:8484');
});
