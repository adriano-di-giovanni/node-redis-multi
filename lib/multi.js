'use strict';

module.exports = function (redis, isKeep) {

  // core deps
  var
    util = require('util');

  // file deps
  var
    config = require('./config.json'),
    Response = require('./Response');

  var
    SuperMulti = redis.Multi,
    exec = SuperMulti.prototype.exec;

  function Multi() {
    SuperMulti.apply(this, arguments);
    this._response = new Response();
  }

  util.inherits(Multi, SuperMulti);

  config.forEach(function (element) {

    var
      command = element.command,
      isKeyable = element.isKeyable,
      proxy = function (key) {
        this._response.enqueue(isKeyable ? key : false);
        return SuperMulti.prototype[command].apply(this, arguments);
      };

    Multi.prototype[command] = proxy;
    Multi.prototype[command.toUpperCase()] = proxy;
  });

  Multi.prototype.exec = function (done) {

    var
      callback = function (error, replies) {

        if (error) { return done(error); }

        this._response.processReplies(replies);

        done(null, this._response);
      };

    return exec.call(this, callback.bind(this));
  };

  Multi.prototype.EXEC = Multi.prototype.exec;

  var
    constructorName,
    methodName;

  if ( !! isKeep) {
    constructorName = 'MultiWithResponse';
    methodName = 'multiWithResponse'
  } else {
    constructorName = 'Multi';
    methodName = 'multi';
  }

  redis[constructorName] = Multi;

  var
    SuperRedisClient = redis.RedisClient;

  SuperRedisClient.prototype[methodName] = function (args) {
    return new Multi(this, args);
  };

  SuperRedisClient.prototype[methodName.toUpperCase()] = SuperRedisClient.prototype[methodName];
};
