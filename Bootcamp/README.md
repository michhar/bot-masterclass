# This is Bootcamp!

This is not an introduction to Node.js.  We will go fast and learn the Node.js commands we need to know to go to the next level (calling APIs and building bots).  If this is easy for you, turn to a neighbor and see if they could use a hand.

We're going to create a simple webserver.  (Bots are really just part webserver anyway)  The story goes, we place (copy or write) some code in our intellisense editor (I'll just say VSCode, but use whatever works for you).  We then will ensure our libraries are installed and run the simple server code on the command line.  Finally, we'll check if the webserver we've made works on localhost.

Let's start with this chunk of code.  Place this in your editor and call the file `server.js`.

```javascript
// Import resify library
var restify = require('restify');

// Values associated with the named "placeholders" are in req.params
// next() is used here in order to run the next handler in the chain
function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

// Create the server
var server = restify.createServer();

// These are our routes with handler functions for our webserver
// The things with a ":" in front of them are called "placeholders"
// get:  Performs an HTTP get; if no payload was returned, obj defaults to {} for you (so you don't get a bunch of null pointer errors).
// head:  Just like get, but without obj
server.get('/hello/:name', respond);
server.head('/hello/:name', respond);

// And now we set up the webserver itself
server.listen(3978, function() {
  console.log('%s listening at %s', server.name, server.url);
});

```

Fist we are importing the [restify](http://restify.com) library to set up a [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer) webserver.

We then create a function, `respond`, which we'll use as a [callback](https://docs.nodejitsu.com/articles/getting-started/control-flow/what-are-callbacks/) for responding to a client (remember this code is meant to run on a server).




