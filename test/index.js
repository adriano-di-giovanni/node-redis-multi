'use strict';

var
  chai = require('chai');

global.expect = chai.expect;

// module deps
var
  redis = require('redis');

require('../lib/multi')(redis, true);

describe('Unit tests', function () {

  var
    client;

  before(function () {
    client = redis.createClient();
  });

  it('should work', function (done) {

    var
      multi = client.multi();

    multi
      .set('a', 1)
      .get('a')
      .exec(function (error, response) {
        console.log(response);
        expect(response.get('a')).to.equal('1');
        expect(response.at(0)).to.equal('OK');
        expect(response.at(1)).to.equal(response.get('a'));
        done(error);
      });
  });
});
