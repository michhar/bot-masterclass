## Dialogs in action

In this MS Bot Framework lab we learn how to create a simple hello world, work with the dialog stack, use promts, use state stores for our own data, and create cards.

Make sure to read through the comments in the code that explain in a step-by-step fashion what is happening.

### Testing locally

* Let's take care of the initialization of our project with the familiar commands:

    - `npm init`
    - `npm install --save botbuilder@3.6.0`
    - `npm install --save restify@4.3.0`
    
* Name your file `server.js` or somtehing similar
* Run the bot from the command line using `node server.js` and then type anything to wake the bot up.

There are some basic components all of our bots will have and this should look _very_ familiar.  You'll see your friend `restify` and the `createServer` method intializing a webserver.  You'll also see the use of a `server.post` which we saw in the Bootcamp from which we get client data.  There's an addition as well and that is the `builder.ChatConnector` which will be the linker to a relay mechanism for messages.  This linker is leveraged both when we are simply testing on localhost with the **botframework-emulator** as well as when our bot is registered with the Bot Framework and deployed to the cloud.

You are encouraged to read through the comments for more detail.

```javascript

// Import required packages
var builder = require('botbuilder');
var restify = require('restify');

/***************************** SETUP  ************************* */

// These values are filled in once a Microsoft Application (MSA) is created
// The MSA provides a link for this bot to the Bot Framework during registration
var botConnectorOptions = {
    appId: process.env.MICROSOFT_APP_ID || "",
    appPassword: process.env.MICROSOFT_APP_PASSWORD || ""
};

// Connector object to include a hook into the BF Connector (after registration)
var connector = new builder.ChatConnector(botConnectorOptions);

// The RESTful server - remember our bot is essentially a webserver
var server = restify.createServer();

// This is for data coming in or POSTed to our server (the bot) from a client (the user)
server.post('/api/messages', connector.listen());

// This specifies a port to handle http requests/traffic
server.listen(process.env.port || process.env.PORT || 3978, function () { 
    console.log('%s listening to %s', server.name, server.url); 
});
```

Now let's create our bot.

```javascript
// Bot object linked to the connector object for all of its logic and helpers
// After the bot is registered with the Bot Framework the connector object wraps up
//   the logic needed to use the Bot Framework's Connector for message routing to
//    official channels like Skype or Slack
//  UniversalBot will give us all of the handling needed for dialog logic

var bot = new builder.UniversalBot(connector);
```

That was easy.  Notice that we passed the connector object to the `UniversalBot` constructor to link to a message relay system (eventually, the Bot Framework Connector itself).  This is the standard way in the Bot Framework to link our bot to real channels like Skype or Slack (which utilize the Bot Framework Connector in the cloud).  For now, we are going to use the **botframework-emulator** to simulate the Bot Framework Connector, giving us an experience analogous to a bot deployed in the cloud.

We still need to decide what the experience is going to be and will do so with dialog handlers and logic.  Let's launch into some samples of what our bot could do.  Use this code in your `server.js` file and run it in the **botframework-emulator** as you go along to see a simulation of the chat experience.

#### Exmaple 1

It's simply an imperative that we must say Hello to the world.  Does this "/" or route-looking element look familiar?  If you recall this was how our `server.get` routing looked in Bootcamp if you had a chance to do that.  This is what we call the **root dialog**.  Notice that instead of our "request, response, next" we have instead a `session`.  Sessions are just conversational models as well as objects.  All the elements we need for a conversation (including the data - remember our four types) are modeled and contained/referenced using this object.

```javascript
var bot = new builder.UniversalBot(connector);

// Introducing our first piece of dialog logic
bot.dialog('/', function (session) {
    session.send('Hello world');
});

```

Now that we've said Hello to the world, let's create something more interesting.  Just for your reference, however, the "Hello world" bot is an example of a **closure**.

#### Example 2

Next we are going to see the built-in **prompt** used in a series of steps.  Interestingly, the built-in prompt takes care of many things for us one of which is calling that familiar `next` and another being that is passes on response data to the next step.

* Do you see something different about this bot/dialog setup?
* What is the part in the square brackets called?
* What type of data does this built-in prompt expect?


```javascript
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

#### Example 3

Now let's see the **dialog stack** in action where we encounter a method which begins a dialog and one that ends a dialog, pushing child dialogs onto a stack and back off again.  This is not only modularizing our code, it allows for more flexibility in our conversational app and dialog logic.  Here, we have a new dialog handler "askName" which is a child of the root.

* What would happen if we replaced the child dialog's `session.endDialogWithResult` with just a `session.send`?  Is there some way to return to the original behavior?


```javascript
var bot = new builder.UniversalBot(connector);

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

The next code snippet exemplifies the use of the bot's **state** or storage "bags" to store some additional data.

```javascript

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
The four types of data bags are called in the Node.js SDK:

* `userData`
* `conversationData`
* `privateConversationData`
* `dialogData`


#### Example 5

Now we get to _build_ a message of our own creation and in this example we create a hero card.  Let's meet the `builder.Message` method in which we assemble the desired building blocks.  This is the way in which we create cards.  You'll see, again, the use of `endDialog` which pops that dialog logic off the stack and returns the results.

```javascript

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


```

- More samples here:  https://github.com/Microsoft/BotBuilder-Samples
- And here:  https://github.com/Microsoft/BotBuilder/tree/master/Node/examples

