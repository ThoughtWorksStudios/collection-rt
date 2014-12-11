function List(redis, namespace, key) {
  var redisKey = namespace + ':' + key;

  return {
    add: function(value, callback) {
      redis.rpush(redisKey, value, callback);
    },

    each: function( callback) {
      redis.lrange(redisKey, 0, -1, function(err, data) {
        if(err) return callback(err);
        data.forEach(function(element) {
          callback(null, element);
        });
      });
    }
  }
}

module.exports = function(redis) {
  return {
    list: function(namespace, key) {
      return List(redis, namespace, key);
    }
  }
}
