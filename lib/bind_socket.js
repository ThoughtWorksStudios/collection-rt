module.exports = function bindSocket(io, collection, nsp) {
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
      collection.list(nsp, key).add(val, function(err) {
        if(!err) {
          io.of(nsp).emit('add ' + key, val);
        }
      });
    });

    socket.on('list', function(cmd){
      var key = cmdGetKey(cmd);
      collection.list(nsp, key).each(function(err, val) {
        if(err) return console.log(err);
        socket.emit("add " + key , val);
      });
    });
  });
};
