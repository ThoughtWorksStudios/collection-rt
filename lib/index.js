var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis = require("redis").createClient();
var namespaces = require('./namespaces')(redis);
var bindSocket = require('./bind_socket');
var collection = require('./collection')(redis);

redis.on("error", function (err) {
  console.log("Error " + err);
});

app.get('/', function(req, res){
  res.render('index');
});

module.exports = {
  start: function(port, callback) {
    namespaces.each(function(error, name) {
      if(error) return console.error(error);
      bindSocket(io, collection, name);
    });

    namespaces.add("default");

    http.listen(port, callback);
  },

  get: function(path, handler) {
    app.get(path, handler);
  }
};
