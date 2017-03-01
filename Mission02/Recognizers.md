## Recognizers in action

This Bot demonstrates how to use an `EntityRecognizer` and `LuisRecognizer` along with an existing LUIS application to add quick functionality and natural language support to a bot.

### LUIS Model

We will use LUIS again, but this time you will use a feature in the LUIS portal that allows us to import all of the intents, entities and utterences saved by another app creator (how kind!).

1.  Again, go to [LUIS.AI](https://www.luis.ai)
2.  We will use the ConfApp.json file in this directory so the easiest way would be to `git clone` this repo (which you may have already done) or download the repo as a zip file (from the repo's main page).
3.  In LUIS portal click on "+New App" and then "Import Existing Application"
4.  Select our ConfApp.json file and give the app a name then click "Import".
5.  You should now be able to see in the app intents such as "wherespeaker" and entities such as "talk_title".
6.  Enter some more utterences and label them.
7.  Retrain using the Train button.
8.  Click on Publish and publish this app, noting the URL endpoint given (we'll use in a minute).

### Testing locally

We saw how to initialize our project in `Dialogs.md` so refer back if you have a new folder without a `package.json` file.

Also, in `Dialogs.md` we learnt about the basic components we begin with for a bot app in the Bot Framework.  Let's add these to our new `server.js` file.

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

// A POST method to gather the input from the user, employing the connector
server.post('/api/messages', connector.listen());
server.listen(process.env.port || process.env.PORT || 3978, function () { 
    console.log('%s listening to %s', server.name, server.url); 
});

```

Next, we define our recognizer using our LUIS model's endpoint URL from the LUIS.AI portal.

* Can you add more than one recognizer of intents?  Can you have more than one LUIS model?



```
// The model_url of format
//  Replace the [] with your model information
var model_url = process.env.LUIS_MODEL || "https://api.projectoxford.ai/luis/v2.0/apps/[model id goes here]?subscription-key=[key goes here]";

// Create LUIS recognizer that points at our model and add it as the root '/' dialog for our Bot.
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
```

Next, I'll leave it to you to add the wheretalk.

* How well is this app performing?  Have you tried "Suggest" in the LUIS.AI portal for this model?  Go ahead and try this out.  Label anything that needs an label and hit "Submit".

[This snippet](https://github.com/michhar/bot-education/tree/master/Student-Resources/BOTs/Node/bot-simpleintent) was taken from another bot-education repo in which simple (non-LUIS) intents are being handled.  Try adding this snippet to the above code.

* Are there other ways to incorporate this snippet?

```javascript
// Just-say-hi intent logic
intents.matches(/^hi|^Hi|^hello|^Hello|^hey|^howdy/i, function(session) {
    session.send("Hi there!");
});
```


### Advanced exercise

Add options to enter date and time to the LUIS model and handle the behavior in this app with dialogs and intents.

#### An optional part

For directing to the url in a brower to the app.  This will show the `index.html` which we don't have hear, but you could create.

```
/************************* OPTIONAL PARTS *************************/

// Serve a static web page - for testing deployment
server.get(/.*/, restify.serveStatic({
	'directory': '.',
	'default': 'index.html'
}));
```






```


* More samples here:  https://github.com/Microsoft/BotBuilder-Samples
* And of course here:  https://github.com/Microsoft/BotBuilder/tree/master/Node/examples
