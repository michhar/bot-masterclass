## LUIS Model

We will use LUIS again, but this time you will use a feature in the LUIS portal that allows us to import all of the intents, entities and utterences saved by another app creator (how kind!).

1.  Again, go to [LUIS.AI](https://www.luis.ai)
2.  We will use the ConfApp.json file in this directory so the easiest way would be to `git clone` this repo (which you may have already done) or download the repo as a zip file (from the repo's main page).
3.  In LUIS portal click on "+New App" and then "Import Existing Application"
4.  Select our ConfApp.json file and give the app a name then click "Import".
5.  You should now be able to see in the app intents such as "wherespeaker" and entities such as "talk_title".



```javascript

/*-----------------------------------------------------------------------------
This Bot demonstrates how to use an EntityRecognizer and LuisRecognizer along
with a Cortana pre-built LUIS application to add quick functionality and
natural language support to a bot. The example also shows how to use 
UniversalBot.send() to push notifications to a user.

It's part of the bot-education labs.

Based loosely on this bot(s):  
- https://github.com/Microsoft/BotBuilder/blob/master/Node/examples/basics-naturalLanguage/app.js

Worth looking at the custom intent recognizer option as well:
- https://github.com/Microsoft/BotBuilder/blob/master/Node/examples/feature-customRecognizer/app.js

For a complete walkthrough of creating an alarm bot see the article below (an alternative setup with LUIS)
Notice the many changes from this documentation.  Still a valid approach, however.
    http://docs.botframework.com/builder/node/guides/understanding-natural-language/

List of pre-built cortana entities from LUIS: https://www.luis.ai/Help#PreBuiltApp

Try this out with a test dialog ("hello", "set appointment", "test name", "hello again"...).
Does it work as expected?  Any changes needed?

-----------------------------------------------------------------------------*/

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

//********************* EXAMPLE ************************* */

// The model_url of format:  
//   https://api.projectoxford.ai/luis/v2.0/apps/[model id goes here]?subscription-key=[key goes here]
//  Fill in the parts in [] with your model information
var model_url = process.env.LUIS_MODEL || "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/c3b5b76b-23e0-4b93-9822-f037975a6b22?subscription-key=01da21fa37f542bc8b3d20f1282fc02b";

// Create LUIS recognizer that points at our model and add it as the root '/' dialog for our Cortana Bot.
var recognizer = new builder.LuisRecognizer(model_url);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });


// Setup bot and default message handler
var bot = new builder.UniversalBot(connector);

// Add the intent dialogs to the root logic of the bot
bot.dialog('/', intents);

// When a user expresses the intent to find out where a speaker is talking,
// this dialog (just confirming at this point) is spawned
intents.matches('wherespeaker', [ 
    function (session, args, next) {
        var intent = args.intent;
        var speaker = builder.EntityRecognizer.findEntity(intent.entities, 'speaker');
        if (!speaker) {
            builder.Prompts.text(session, 
                "What is the first and last name of the speaker?");
        } else {
            next({ response: speaker });
        }
    },
    function (session, results) {
        if (results.response) {
            session.send("Ok...it looks like you are trying to find the location of a talk by %s.", 
                results.response);
        } else {
            session.send("Ok");
        }
    }
]
);

intents.onDefault(builder.DialogAction.send("Hi, I'm a conference bot.  Try 'help' for more info."));

// Add help dialog with a trigger action bound to the 'Help' intent
bot.dialog('/help', function (session) {
    session.endDialog("try asking:<br>What time is personA's talk?<br>or<br>Where is personB speaking?");
}
// a trigger for dialog added here for help
).triggerAction({ matches: /^help|^Help/i });

/************************* ADVANCED EXERCISE *************************/

// Add options to enter date and time.

/************************* OPTIONAL PARTS *************************/

// Serve a static web page - for testing deployment
server.get(/.*/, restify.serveStatic({
	'directory': '.',
	'default': 'index.html'
}));






```


* More samples here:  https://github.com/Microsoft/BotBuilder-Samples
* And of course here:  https://github.com/Microsoft/BotBuilder/tree/master/Node/examples
