'use strict';

// core deps
var
  util = require('util');

var
  isArray = util.isArray;

function Response() {
  this._keys = [];
  this._replies = [];
  this._repliesByKey = {};
}

Response.prototype.enqueue = function (key) {
  this._keys.push(key);
  return this;
};

Response.prototype.processReplies = function (replies) {

  this._replies = replies;

  var
    keys = this._keys,
    repliesByKey = this._repliesByKey;

  replies.forEach(function (reply, index) {

    var
      key = keys[index];

    if ( ! key) { return; }

    if ( ! repliesByKey[key]) {

      repliesByKey[key] = reply;
    } else {

      if ( ! isArray(repliesByKey[key])) {
        repliesByKey[key] = [ repliesByKey[key] ];
      }

      repliesByKey[key].push(reply);
    }
  });
};

Response.prototype.at = function (index) {
  return this._replies[index];
};

Response.prototype.get = function (key) {
  return this._repliesByKey[key];
};

module.exports = Response;
