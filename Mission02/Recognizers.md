## Recognizers in action

Recognizers are just objects that can pick up on or recognize a user's intent.  We can use LUIS models in our bots with a particular helper method for LUIS integration.  We could also create custom recognizers.  We will see both, but here mostly focus on the LUIS model recognizer.

We will focus on how to use an `EntityRecognizer` and `LuisRecognizer` along with an existing LUIS application to add quick functionality and natural language support to a bot.  There is a portion on a custom recognizer as well.

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

(If you were unsuccessful with getting the LUIS model or didn't for whatever reason, head over to [this](https://gist.githubusercontent.com/michhar/42314f4c74611fd851d0b51cbaac3ab2/raw/a4e254b9b117b20616f03fcf54b0e9dec03cfcc4/api_info.json) gist for a key, but note it might have some lag if many people are using it).

```javascript
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

#### LUIS add-on

Add the "wheretalk" logic to this bot.

* How well is this app performing?  Have you tried "Suggest" in the LUIS.AI portal for this model?  Go ahead and try this out.  Label anything that needs an label and hit "Submit".

[This snippet](https://github.com/michhar/bot-education/tree/master/Student-Resources/BOTs/Node/bot-simpleintent) was taken from another bot-education repo in which simple (non-LUIS) intents are being handled.  Try adding this snippet to the above code.

### Adding a simple hello intent

* Are there other ways to incorporate this snippet?

```javascript
// Just-say-hi intent logic
intents.matches(/^hi|^Hi|^hello|^Hello|^hey|^howdy/i, function(session) {
    session.send("Hi there!");
});
```

### A made-just-for-you recognizer (non-LUIS) or custom recognizer

Take the following code and add this to your bot to add some new intent and dialog logic.

Notice a few things in the "coffeeDialog".  There's a confirmation prompt and an example of using a `triggerAction` which will interrupt any ongoing dialog if the user types "[Cc]offee".

```javascript

// Install a custom recognizer to look for user saying 'food' or 'coffee' to get them to the right place
bot.recognizer({
    recognize: function (context, done) {
        var intent = { score: 0.0 };
        if (context.message.text) {
            switch (context.message.text.toLowerCase()) {
                case 'food':
                    intent = { score: 1.0, intent: 'Food' };
                    break;
                case 'coffee':
                    intent = { score: 1.0, intent: 'Coffee' };
                    break;
            }
        }
        done(null, intent);
    }
});

// Add help dialog with a trigger action bound to the 'Hours' intent
bot.dialog('coffeeDialog',  [
    function (session) {
        builder.Prompts.confirm(session, "Are you looking for coffee?");
    },
    function (session, results) {
        if (results.response == true) {
            session.endDialog("Coffee rocks");
        } else {
            session.endDialog("We also have tea and juice.");
        }
    }
]
).triggerAction({ matches: 'Coffee' });

```

What does "coffeeDialog"'s `results.response` look like?  Go ahead and log that out with `console.log`.

Now, create a "foodDialog" to handle someone looking for the food at a conference.  How would you handle this?  Would you use built-in confirmation prompts as well?

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
