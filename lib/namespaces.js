module.exports = function(redis) {
  var key = "__collection_rt:namespaces";

  function each(callback) {
    redis.smembers(key, function(err, data) {
      if(err) return callback(err);
      data.forEach(function(name) {
        callback(null, name)
      });
    })
  }

  function add(name) {
    redis.sadd(key, name);
  }

  return {
    each: each,
    add: add
  };
};
