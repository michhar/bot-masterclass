## Recognizers in action

Recognizers are just objects that can pick up on or recognize a user's intent.  We can use LUIS models in our bots with a particular helper method for LUIS integration.  We could also create custom recognizers.  We will see both, but here mostly focus on the LUIS model recognizer.

We will focus on how to use an `EntityRecognizer` and `LuisRecognizer` along with an existing LUIS application to add quick functionality and natural language support to a bot.  There is a portion on a custom recognizer as well.

Now, let's make this smart bot!

### Testing locally

We saw how to initialize our project in `Dialogs.md` so refer back on how to create your `package.json` in this new folder (here's the [link](https://github.com/michhar/bot-masterclass/blob/master/Mission02/Dialogs.md#testing-locally) to refer back).

Also, in `Dialogs.md` we learnt about the basic components we begin with for a bot in the Bot Framework.  Let's add these same ones to our new `server.js` file.

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

And of course we need the bot and a connection from the bot to the connector (which when deployed will actually link us to the Bot Framework Connector).

```javascript
var bot = new builder.UniversalBot(connector);
```

Our bot has no dialog logic, so let's begin the process of recognizing user intents with LUIS.

### Setting up LUIS

Before starting on this tutorial, we first need to make our bot understand natural language. If you haven't created a "GetNews" LUIS model go back to the [LUIS](../Mission01/LUIS.md) lab in Mission01 to get your endpoint URL.

### Connecting LUIS to your bot

Connecting LUIS to your bot is as simple as pasting the publish URL into the intent dialog you already have.

```js
var luisRecognizer = new builder.LuisRecognizer('Your publish URL here');
var intentDialog = new builder.IntentDialog({recognizers: [luisRecognizer]});
bot.dialog('/', intentDialog);
```

After that, your bot will be able to understand natural language.

What do you think the answers to these questions are?

* Can you add more than one recognizer of intents?  
* Can you have more than one LUIS model in a bot?

### After setting up LUIS and connecting it to the bot

**By the way, you'll see this again in the Final Mission with more complexity**

Let's try fetching news based on category so we can stay updated with civilisation.

**NOTE: We will be asking you questions at the end of this so do not just copy and paste without understanding what is going on.**

**So what are we using to get the news?**

We're gonna go to CNN and copy paste the headlines manually into our bot. Just kidding. We'll be using the [Bing News API](https://www.microsoft.com/cognitive-services/en-us/bing-news-search-api). We can use it to get top news by categories, search the news, and get trending topics. I highly suggest briefly looking through the following links to familiarise yourself with the API:

- [Endpoints and examples of requests and responses](https://msdn.microsoft.com/en-us/library/dn760783.aspx)
- [Parameters for requests](https://msdn.microsoft.com/en-us/library/dn760793(v=bsynd.50).aspx)
- [Market Codes for Bing](https://msdn.microsoft.com/en-us/library/dn783426.aspx)
- [Categories for Bing News by market](https://msdn.microsoft.com/en-us/library/dn760793(v=bsynd.50).aspx#categoriesbymarket)

To start using the Bing News API, we will need a subscription key. We hopefully have already done this in the [News](../Mission01/NEWS.md) lab in Mission01.

Now that you have your subscription key (you can use either key 1 or key 2, it doesn't matter), you can go to the [API testing console](https://dev.cognitive.microsoft.com/docs/services/56b43f72cf5ff8098cef380a/operations/56f02400dbe2d91900c68553) and play around with the API if you'd like. Try sending some requests and see the responses you get. [Here](https://msdn.microsoft.com/en-us/library/dn760793(v=bsynd.50).aspx#categoriesbymarket) are all the possible categories for Category News by the way. 


**Ok cool, now how do we link the news to the bot?**

Let's start off by getting the bot to understand us when we try to look for news or scan an image. Make sure your intentsDialog.matches line looks like below.

Also, don't forget about your LUIS recognizer and bot root dialog from the Mission1 [part](MISSION1.md).  You'll need this code as well so go ahead and paste it in.

```js
intentDialog.matches(/\b(hi|hello|hey|howdy)\b/i, '/sayHi')
    .matches('GetNews', '/topNews')
    .onDefault(builder.DialogAction.send("Sorry, I didn't understand what you said."));
```

Also, let's be friendly and add a dialog handler for 'sayHi' as follows:

```js
bot.dialog('/sayHi', function(session) {
    session.send('Hi there!  Try saying things like "Get news in Toyko"');
    session.endDialog();
});
```

Go ahead and run your bot code from the command line as you have been with `node server.js`.

Basically, when the user's utterance comes in to the bot, it gets checked against the regex first. If none of the regexes match, it will make a call to LUIS and route the message to the intent that it matches to. Add this snippet of code at the end to create a dialog for top news:

```js
bot.dialog('/topNews', [
    function (session){
        // Ask the user which category they would like
        // Choices are separated by |
        builder.Prompts.choice(session, "Which category would you like?", "Technology|Science|Sports|Business|Entertainment|Politics|Health|World|(quit)");
    }, function (session, results){
        var userResponse = results.response.entity;
        session.endDialog("You selected: " + userResponse);
    }
]);
```

Try using natural language to ask your bot for news - it should work perfectly. :) Notice that if you ask it to analyse an image it's gonna crash. That's because we haven't written out any dialogs called '/analyseImage' yet.

#### LUIS Interactive Learning in the portal

* How well is this app performing?  Have you tried "Suggest" in the LUIS.AI portal for this model?  Go ahead and try this out.  Label anything that needs an label and hit "Submit".

### A made-just-for-you recognizer (non-LUIS) or custom recognizer

Take the following code and add this to your bot to add some new intent and dialog logic.  Does it work as expected?

Notice a few things in the "twitterDialog".  There's a confirmation prompt and an example of using a `triggerAction` which will interrupt any ongoing dialog if the user types "[Tt]witter".

```javascript

// Install a custom recognizer to look for user saying 'twitter' to get them to the right place - we'll need more useful logic later
bot.recognizer({
    recognize: function (context, done) {
        var intent = { score: 0.0 };
        if (context.message.text) {
            switch (context.message.text.toLowerCase()) {
                case 'twitter':
                    intent = { score: 1.0, intent: 'Twitter' };
                    break;
//                case 'other_case':
//                    intent = { score: 1.0, intent: 'something_else_here' };
//                    break;
            }
        }
        done(null, intent);
    }
});

// Add help dialog with a trigger action bound to the 'Twitter' intent from the custom recognizer above
bot.dialog('twitterDialog',  [
    function (session) {
        builder.Prompts.confirm(session, "Are you looking for twitter?");
    },
    function (session, results) {
        if (results.response == true) {
            session.endDialog("Twitter rocks");
        } else {
            session.endDialog("Try a bing web search for other types of social media.");
        }
    }
]
).triggerAction({ matches: /^twitter/i });

```

What does "twitterDialog"'s `results.response` look like?  Go ahead and log that out with `console.log`.

Now, create a "facebookDialog" to handle someone looking for the facebook info.  How would you handle this?  Would you use built-in confirmation prompts as well?  Try it out and create a useful or intriguing response.

#### An optional part for checking the Web Service after deployment

For directing to the url in a brower to the app.  This will show the `index.html` which we don't have here, but you could create. This helps with knowing your App Service is running successfully.

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
