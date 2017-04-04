# This is Bootcamp!

This is not an introduction to Node.js.  We will go fast and learn the Node.js commands we need to know to go to the next level (calling APIs and building bots).  If this is easy for you, turn to a neighbor and see if they could use a hand.

We're going to create a simple webserver.  (Bots are really just part webserver anyway)  The story goes, we place (copy or write) some code in our intellisense editor (I'll just say VSCode, but use whatever works for you).  We then will ensure our libraries are installed and run the simple server code on the command line.  Finally, we'll check if the webserver we've made works on localhost.

To begin this project (we will be using this throughout) on the command line/prompt we type two commands:

    npm init

and then

    npm install --save restify

to install our necessary library, `restify` and create a file to remember what we've done, called `package.json` (that was the `init` command).

Let's work with the following piece of code.  Place this in your editor and call the file `server.js`.

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

First we are importing the [restify](http://restify.com) library to set up a [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer) webserver.

We then create a function, `respond`, which we'll use as a [callback](https://docs.nodejitsu.com/articles/getting-started/control-flow/what-are-callbacks/) for responding to a client (remember this code is meant to run on a server).

We can think of the `server.get` as our routing method call and the `:name` part as a placeholder for a value yet to be determined (you'll see shortly).  Also, a nifty thing about `get` is that it will return an empty `{}` as it's object return value instead of null which would need extra handling.  the `server.head` is like `server.get` but without an object return value.  This is a really simple example, however great place to start.

Finally, we set up the webserver itself, listening to port `3978` which I pretty much pulled out of a magic hat (or maybe not, as we'll see later), but it could be any available port for http requests at this point.

### Exercises

We'll go through these together or if you are reading this later, you'll get to go through them on your own.  Some advanced exercises are included for those who get through these very quickly.

1.  Run all of this code on the command line with `node server.js` or whatever your "server.js" is called.
1.  Fill in the blank and go to http://localhost:____
3.  Add a "root" handler with "/" as the route and using GET and do (1) again
2.  What goes in the blank?  And what happens?  http://localhost:____/
2.  What goes in the blanks?  Try giving this route your name.  http://localhost:____/____/<your name here>
4.  Replace "respond" in the "server.get('/hello/:name'..." route with this code chunk and see what happens.

```javascript
    function respond1(req, res, next) {
        console.log("Do something in first handler");
        return next();
    },
    function respond2(req, res, next) {
        res.send('Hello now ' + req.params.name);
        return next();
    }
```



### Advanced exercise

(For the brave) Add the following route for a POST HTTP request (post:  Takes a complete object to serialize from client and sends to the server.)

This is essentially for data coming in or POSTed to our server from a client.  The `server.use` allows us to be able to access the client's posted data in a more useful form.

```javascript
server.use(restify.bodyParser());
server.post('/hello', function create(req, res, next) {
    res.send(201, "Good to go\n");
    console.log("This is the value of name POSTed: " + req.params.name);
    return next();
});
```
And then, for fun, pretend you are a client with data to send TO the server (POSTed).  Try in terminal on OSX/Unix or Git Bash on Windows with curl, like this (replace name if you wish):
`curl -X POST -H "Content-Type: application/json" -d '{"name":"Sam"}' http://localhost:3978/hello`

Another very useful bit of code you should include in your `is an error handler.  We'll see later that this can be accomplished with promises, but that's another topic.

```javascript
 // Adding error handling:
function respond(req, res, next) {
    if (!req.params.name) {
        next(new Error('Please give me a name.'));
        return;
    }
    res.send('hello ' + req.params.name);
    next();
}
```






