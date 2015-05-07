/* eslint no-shadow: 0, no-process-exit: 0 */
'use strict';

var
  fs = require('fs'),
  path = require('path');

// module deps
var
  redis = require('redis');

var
  client = redis.createClient();

client.send_command('COMMAND', [], function (error, response) {

  if (error) { throw error; }

  var
    commands = [];

  response.forEach(function (element) {

    var
      command = element[0],
      arity = element[1],
      flags = element[2],
      firstKeyAt = element[3],
      lastKeyAt = element[4];

    commands.push({
      command: command,
      isKeyable: arity > 0 && flags.indexOf('readonly') !== -1 && firstKeyAt === 1 && lastKeyAt === 1
    });
  });

  var
    filePath = path.resolve(__dirname, '../lib/config.json');

  fs.writeFile(filePath, JSON.stringify(commands), function (error) {

    if (error) { throw error; }

    process.exit();
  });
});
