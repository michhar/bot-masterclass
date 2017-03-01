This Bot is part of a lab on how to create a simple hello world, dialog stack/promts and 
old vs. new style (v3.5) bot.

## Testing locally

* Let's take care of the initialization of our project with the familiar commands:

    - `npm init`
    - `npm install --save botbuilder@3.6.0`
    - `npm install --save restify@4.3.0`
    
* Name your file `server.js` or somtehing similar
* Run the bot from the command line using `node server.js` and then type anything to wake the bot up.

There are some basic components all of our bots will have and this should look _very_ familiar.  You'll see your friend `restify` and the `createServer` method intializing a webserver.  You'll also see the use of a `server.post` which we saw in the Bootcamp from which we get client data.  And an addition, the `builder.ChatConnector` which will be the relay mechanism for messages.  This relay mechanism or method is leveraged both when we are just testing on localhost with the botframework-emulator as well as when our bot is deployed to the cloud. 

```javascript

// Required packages
var builder = require('botbuilder');
var restify = require('restify');

/***************************** SETUP  ************************* */

// Connector options
var botConnectorOptions = {
    appId: process.env.MICROSOFT_APP_ID || "",
    appPassword: process.env.MICROSOFT_APP_PASSWORD || ""
};

// Instatiate the chat connector to route messages
var connector = new builder.ChatConnector(botConnectorOptions);

// Handle Bot Framework messages with a restify server
var server = restify.createServer();
server.post('/api/messages', connector.listen());
server.listen(process.env.port || process.env.PORT || 3978, function () { 
    console.log('%s listening to %s', server.name, server.url); 
});
```

Now let's create our bot.

```javascript
// Create a bot
var bot = new builder.UniversalBot(connector);
```

That was easy.  Notice we passed the `UniversalBot` constructor the connector, our message relay system.  This is the standard way in the Bot Framework and links our bot instance to this relay system.  

We still need to decide what the experience is going to be and will do so with dialog handlers and logic.  Let's launch into some samples of what our bot could do.  Use this code in your `server.js` file and run it in the botframework-emulator as you go along to see a simulation of the chat experience.

Sample 1.  It's simply an imerative that we must say Hello to the world.  Does this "/" or route-looking element look fammiliar?  It should, because this was how our `server.get` routing looked in Bootcamp.  This is what we call the **root dialog**.  Notice that instead of our "request, response, next" we have instead a `session`.  Sessions are just conversational models as well as objects.  All the elements we need for a conversation (including the data - remember our four types) are modeled and contained/referenced using this object.

```javascript
// Dialog handling
bot.dialog('/', function (session) {
    session.send('Hello world');
});

```

Now that we've said Hello to the world, let's create something more interesting.  Just for your reference, however, the "Hello world" bot is an example of a **closure**.

Next we are going to see the built-in **prompt** used in a series of steps.  Interestingly, the built-in prompt takes care of many things for us one of which is calling that familiar `next` and another being that is passes on response data to the next step.

#### Example 2

```javascript


/************* Example 2 **************/

var bot = new builder.UniversalBot(connector, [
    function (session) {
        // Introducing a builtin prompt
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        // Step 2 in the waterfall
        session.send('Hello %s!', results.response);
    }
]);
```

For the above:
* Do you see something different about this bot/dialog setup?
* What is the part in the square brackets called?

#### Example 3

```javascript

/************* Example 3 **************/

// Back to old style of non-root message handling
var bot = new builder.UniversalBot(connector);

// Think of a sandwich (the bread is the root dialog and meat/cheese the 'askName' dialog)
bot.dialog('/', [
    function (session) {
        // "push" onto the dialog stack
        session.beginDialog('/askName');
    },
    function (session, results) {
        session.send('Hello %s!', results.response);
    }
]);

bot.dialog('/askName', [ // this is a small waterfall
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        // "pop" off of the dialog stack and return the results
        session.endDialogWithResult(results);
    }
]);

```

#### Example 4

```javascript

/************* Example 4 **************/

// Setup bot and root waterfall - os this old or new style?
var bot = new builder.UniversalBot(connector, [
    function (session) {
        builder.Prompts.text(session, "Hello... What's your name?");
    },
    function (session, results) {
        session.userData.name = results.response;
        builder.Prompts.number(session, "Hi " + results.response + ", How many years have you been coding?"); 
    },
    function (session, results) {
        session.userData.coding = results.response;
        builder.Prompts.choice(session, "What language do you code Node using?", ["JavaScript", "CoffeeScript", 
            "TypeScript"]);
    },
    function (session, results) {
        session.userData.language = results.response.entity;
        session.send("Got it... " + session.userData.name + 
                     " you've been programming for " + session.userData.coding + 
                     " years and use " + session.userData.language + ".");
    }
]);
```

#### Example 5

```

/************* Example 5 **************/


// Create a bot
var bot = new builder.UniversalBot(connector);

bot.dialog('/', [
    function (session) {
        // "push" onto the dialog stack
        session.beginDialog('/cards');
    },
    function (session, msg) {
        session.send(msg);
    }
]);

// Cards in messages
bot.dialog('/cards', [
    function (session) {
        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    .title("Hero Card")
                    .subtitle("Space Needle")
                    .text("The <b>Space Needle</b> is an observation tower in Seattle, Washington, a landmark of the Pacific Northwest, and an icon of Seattle.")
                    .images([
                        builder.CardImage.create(session, 
                            "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/320px-Seattlenighttimequeenanne.jpg")
                    ])
                    .tap(builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Space_Needle"))
            ]);
        session.endDialog(msg);
    }
]);

// More samples here:  https://github.com/Microsoft/BotBuilder-Samples
// And of course here:  https://github.com/Microsoft/BotBuilder/tree/master/Node/examples

```

