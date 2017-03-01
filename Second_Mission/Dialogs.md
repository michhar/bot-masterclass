This Bot is part of a lab on how to create a simple hello world, dialog stack/promts and 
old vs. new style (v3.5) bot.  Sections will be uncommented and modified.

# RUN THE BOT:
* Name your file `server.js` or somtehing similar
* Run the bot from the command line using `node server.js` or whatever you named the file and then type anything to wake the bot up.


Let's get the basic bits we always have.  Explanation after.

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

Now let's create our bot and modify it's dialogs to create different experiences.

```javascript
//********************* EXAMPLES ************************* */
// Uncomment out each individually to run

/************* Example 1 **************/

// Create a bot
var bot = new builder.UniversalBot(connector);

// Dialog handling
bot.dialog('/', function (session) {
    session.send('Hello world');
});

// get to name with session.userData.name -> will this work locally?
```

Now that we've got "Hello World" out of the way, let's dig in to some much more interesting stuff.  Just for your reference, however, the "Hello world" bot is an example of a **closure**.

```javascript


/************* Example 2 **************/

// // What's different about this bot setup? (this is the new style, btw, for v3.5.0)
// var bot = new builder.UniversalBot(connector, [
//     function (session) {
//         // Introducing a builtin prompt
//         builder.Prompts.text(session, 'Hi! What is your name?');
//     },
//     function (session, results) {
//         // Step 2 in the waterfall
//         session.send('Hello %s!', results.response);
//     }
// ]);

// What is the portion between the square brackets called?


/************* Example 3 **************/


// // Back to old style of non-root message handling
// var bot = new builder.UniversalBot(connector);

// // Think of a sandwich (the bread is the root dialog and meat/cheese the 'askName' dialog)
// bot.dialog('/', [
//     function (session) {
//         // "push" onto the dialog stack
//         session.beginDialog('/askName');
//     },
//     function (session, results) {
//         session.send('Hello %s!', results.response);
//     }
// ]);

// bot.dialog('/askName', [ // this is a small waterfall
//     function (session) {
//         builder.Prompts.text(session, 'Hi! What is your name?');
//     },
//     function (session, results) {
//         // "pop" off of the dialog stack and return the results
//         session.endDialogWithResult(results);
//     }
// ]);

// // Can you make this into the new style?

/************* Example 4 **************/

// // Setup bot and root waterfall - os this old or new style?
// var bot = new builder.UniversalBot(connector, [
//     function (session) {
//         builder.Prompts.text(session, "Hello... What's your name?");
//     },
//     function (session, results) {
//         session.userData.name = results.response;
//         builder.Prompts.number(session, "Hi " + results.response + ", How many years have you been coding?"); 
//     },
//     function (session, results) {
//         session.userData.coding = results.response;
//         builder.Prompts.choice(session, "What language do you code Node using?", ["JavaScript", "CoffeeScript", 
//             "TypeScript"]);
//     },
//     function (session, results) {
//         session.userData.language = results.response.entity;
//         session.send("Got it... " + session.userData.name + 
//                      " you've been programming for " + session.userData.coding + 
//                      " years and use " + session.userData.language + ".");
//     }
// ]);

/************* Advanced Example **************/

// Test this bot locally: https://github.com/Microsoft/BotBuilder/blob/master/Node/examples/basics-menus/app.js

/************************* OPTIONAL PARTS *************************/

// Serve a static web page - for testing deployment
server.get(/.*/, restify.serveStatic({
	'directory': '.',
	'default': 'index.html'
}));

/************* Example 5 **************/


// // Create a bot
// var bot = new builder.UniversalBot(connector);

// // Think of a sandwich (the bread is the root dialog and meat/cheese the 'askName' dialog)
// bot.dialog('/', [
//     function (session) {
//         // "push" onto the dialog stack
//         session.beginDialog('/cards');
//     },
//     function (session, msg) {
//         session.send(msg);
//     }
// ]);

// // Cards in messages
// bot.dialog('/cards', [
//     function (session) {
//         var msg = new builder.Message(session)
//             .textFormat(builder.TextFormat.xml)
//             .attachments([
//                 new builder.HeroCard(session)
//                     .title("Hero Card")
//                     .subtitle("Space Needle")
//                     .text("The <b>Space Needle</b> is an observation tower in Seattle, Washington, a landmark of the Pacific Northwest, and an icon of Seattle.")
//                     .images([
//                         builder.CardImage.create(session, 
//                             "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/320px-Seattlenighttimequeenanne.jpg")
//                     ])
//                     .tap(builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Space_Needle"))
//             ]);
//         session.endDialog(msg);
//     }
// ]);

// More samples here:  https://github.com/Microsoft/BotBuilder-Samples
// And of course here:  https://github.com/Microsoft/BotBuilder/tree/master/Node/examples


```

