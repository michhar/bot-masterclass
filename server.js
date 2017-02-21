/*-----------------------------------------------------------------------------
This Bot demonstrates basic bot setup, a simple hello dialog and a waterfall.
There's also a trigger action included for fun.

It's part of the bot-education labs.

Try this out with a test dialog ("hi", "bye" or any words really).
Does it work as expected?  Does it get stuck anywhere?  Any changes needed?

Make sure to try uncommenting out the waterfall part below.  Good to test this
with the Bot Framework emulator (https://docs.botframework.com/en-us/tools/bot-framework-emulator/).

-----------------------------------------------------------------------------*/

// Required packages
var builder = require('botbuilder');
var restify = require('restify');

//============================================================
// Setting up server and connector
//============================================================

// Connector options
var botConnectorOptions = {
    appId: process.env.MICROSOFT_APP_ID || "",
    appPassword: process.env.MICROSOFT_APP_PASSWORD || ""
};

// Handle Bot Framework messages with a restify server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   //When testing on a local machine, 3978 indicates the port to test on
   console.log('%s listening to %s', server.name, server.url); 
});

// Instatiate the chat connector to route messages and create chat bot
var connector = new builder.ChatConnector(botConnectorOptions);
server.post('/api/messages', connector.listen());

//============================================================
// Defining how bot carries on the conversation with the user
//============================================================

// Create our bot
var bot = new builder.UniversalBot(connector);

// This is the root dialog
bot.dialog('/', [ 
    function(session) {

        // This is considered the root dialog ("/") and we can send a welcome here
        session.send("Hi there!  Welcome to the root dialog.  You are going places...");

        // "Push" the hello dialog onto the dialog stack
        session.beginDialog('/hello');

        // Uncomment to have the option of the waterfall dialog below, and comment the hello out
        // It doesn't do much, but the code is interesting...
        // session.beginDialog('/waterfall');
    },
    function(session, results) {
        // Using the returned results, print out the response to the prompt and send reply
        session.send("Welcome back to the root dialog, %s!", results.response);
    }
]);

bot.dialog('/hello', [
    function(session) {
        session.send("Welcome to the hello dialog...")
        builder.Prompts.text(session, "Hi there.  What's a good nickname for you?");
    },
    function(session, results) {
        // "Pop" the current dialog off the stack and return to parent
        session.endDialogWithResult(results);
    }
]);


// This is a dialog with a waterfall (an array of functions for a conversation)
// It makes use of a storage "bag" called the dialogData used for temp storage
bot.dialog('/waterfall', [
    function(session, args, next) {
        //session.send("This is step one.");
        session.dialogData.stepone = "Made it through step one.  ";
        next();
    },
    function (session, results, next) {
        session.dialogData.steptwo = "Made it through step two.  ";
        next();
    },
    function (session, results) {
        var mymsg = session.dialogData.stepone + "<br>" + session.dialogData.steptwo + "<br>";
        session.endDialog(mymsg + "Let's end this waterfall and return control to the root dialog :) .");
    }
]);

//============================================================
// Set up some trigger actions
//============================================================

// Example of a triggered action - when user types something matched by
// the trigger, this dialog begins, clearing the stack and interrupting
// the current dialog (so be cognizant of this).
// What if we had put 'send' instead of 'endDialog' here - try this.
bot.dialog('/bye', function (session) {
    // end dialog with a cleared stack.  we may want to add an 'onInterrupted'
    // handler to this dialog to keep the state of the current
    // conversation by doing something with the dialog stack
    session.endDialog("Ok... See you later.");
}).triggerAction({matches: /^bye|Bye/i});

//============================================================
// Additional Exercises
//============================================================

// Add a user prompt for a fun user name or nickname
// e.g.  builder.Prompts.text(session, 'Hi! What is your nickname?');
// Where would this go and how would you include it?
// Good ref:  https://docs.botframework.com/en-us/node/builder/chat/session/#starting-and-ending-dialogs

//============================================================
// Add-ons
//============================================================

// Serve a static web page - for testing deployment (note: this is optional)
server.get(/.*/, restify.serveStatic({
	'directory': '.',
	'default': 'index.html'
}));



// More samples here:  https://github.com/Microsoft/BotBuilder-Samples
// And of course here:  https://github.com/Microsoft/BotBuilder/tree/master/Node/examples
