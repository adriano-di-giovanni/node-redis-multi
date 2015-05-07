# node-redis-multi

A Node.js library to augment [node_redis](https://github.com/mranney/node_redis) with an enhanced version of MULTI command.

## Installation

```
npm install node-redis-multi --save
```

## Usage

`node-redis-multi` replaces methods that are related to `MULTI`.

The callback of `.exec()` will get invoked with two arguments as the original version but second argument is a [`Response`](#response) object.

```javascript

// module deps
var
  redis = require('redis');

require('../lib/multi')(redis);

var
    client = redis.createClient(),
    multi = client.multi();

multi
    .set('path:to:key', 1)
    .get('path:to:key')
    .exec(function (error, response) {
        console.log(response.get('path:to:key')); // 1
        console.log(response.at(0)); // OK
        console.log(response.at(1)); // 1
    });
```

## Response <a name="response"></a>

Response object lets you query replies from `.exec()` using two different methods: `Response#get(<key>)` and `Response#at(<index>)`.

`Response#get(<key>)` lets you retrieve a reply by key:

```javascript
multi
    .set('path:to:key', 'value')
    .get('path:to:key')
    .exec(function (error, response) {

        var
            reply = response.get('path:to:key');

        console.log(reply); // value
    });
```

`Response#get(<key>)` is applicable only if the issued command has

* arity > 0;
* `readonly` flag;
* position of first key === 1;
* position of last key === 1.

See Redis [COMMAND](http://redis.io/commands/command) for further information.

`Response#at(<index>)` lets you retrieve a reply by its index:

```javascript
multi
    .set('path:to:key', 'value')
    .get('path:to:key')
    .exec(function (error, response) {

        var
            reply = response.at(1);
            
        console.log(reply); // value
    });
```
