# Language Understanding Intelligent Service (LUIS)

## Natural Language
Bots often do not just take binary inputs. Users rarely type in the exact way you want them to, which often makes direct string comparison difficult. The solution is to use LUIS.AI to understand natural language.

## Intents and Entities
LUIS allows us to detect what the user wants based on the sentence they send, which is often known as an "intent". Sometimes we want to parse the actionable information within the sentence, which is often known as "entities". We can then execute logic or send back messages depending on the intent and entities in the sentence.

For example, let's say a user says "What's the news in `Paris` on `Thursday`?". Using LUIS, we can tell that the intent is to "GetNews" while the entities are location ("Paris") and date ("Thursday"). This allows the program to know that the user wants to find news at the location and date specified.

## Activating LUIS
First, login to [LUIS.AI](https://www.luis.ai) using your personal Microsoft account or work/school account. 

Hover over your name on the top right and click Settings. Go to the "Subscription Keys" tab where you can enter the subscription key you generated on Azure.

## Making a new LUIS app
Go back to the [LUIS.AI](https://www.luis.ai) page and click Create New Application.

Fill up the form:
- Name can be set to anything you want
- Set application usage scenario to Bots
- Set domain to anything you want
- Click Add Application

## Adding intents and entities
After clicking your LUIS app, you should be directed to a page. The left sidebar allows us to add new intents and entities. 

![LUIS UI](https://raw.githubusercontent.com/alyssaong1/HOL-NUSHackathon/master/Images/Luis/LUIS.PNG)

### Making a new entity
Let's first add a new pre-built entity for "geography" by clicking the plus button for "Pre-built Entities".

![NewEntity](https://raw.githubusercontent.com/michhar/bot-masterclass/master/Extras/images/PrebuiltEntity.jpg)

### Making a new intent
The default intent is "None", which will be used whenever no intent is detected from a user's sentence.

We can use the + button to add a new intent. Let's add "GetNews" for now. As an example utterance, write "Give me the news in Singapore".

![NewIntent](https://raw.githubusercontent.com/alyssaong1/HOL-NUSHackathon/master/Images/Luis/NewIntent.PNG)

After clicking OK, our model should automatically label the intent as GetNews and entity as geography for geographical locations.

## More utterances
In order for LUIS to perform better, you need to give it more examples of an intent.  Usually we need a minimum of 5 per entity per intent.

Let's add another utterance saying "Can I get the news in London".  Go ahead and add a few more.  You can try off the wall ones like "I'm from Mars" to see how well it does labeling as None.

![NewUtterance](https://raw.githubusercontent.com/michhar/bot-masterclass/master/Extras/images/LabelUtterence.png)

- Select the correct intent from the dropdown box, in this case being "GetNews".
- Select the word "London" and make sure it is labeled as geography.

Now that LUIS has more data to work with, it is now able to understand when the user wants to get news with greater accuracy. If you want to, you can keep adding more utterances to improve understanding.

## Publishing LUIS
To make sure that our LUIS service is accessible by the bot, we first need to publish it.

First, click the "Train" button on the bottom left so that LUIS can train itself on your provided data.

Then, click the publish button on the top left.

![Publish](https://raw.githubusercontent.com/alyssaong1/HOL-NUSHackathon/master/Images/Luis/Publish.PNG)

Leave the checkbox unticked, then click the publish web service button. After publishing, a URL will be provided to you. Copy and take note of this URL (you can remove the "&verbose=true" part.

## Updating LUIS
Whenever we add new intents, entities or utterances, LUIS has to be updated. We can do this by clicking train again, then clicking the publish button.

![Update](https://raw.githubusercontent.com/alyssaong1/HOL-NUSHackathon/master/Images/Luis/UpdateNew.PNG)

## Connecting LUIS to your bot
Connecting LUIS to your bot is as simple as pasting the publish URL into the intent dialog you already have.

```js
var luisRecognizer = new builder.LuisRecognizer('Your publish URL here');
var intentDialog = new builder.IntentDialog({recognizers: [luisRecognizer]});
bot.dialog('/', intentDialog);
```

After that, your bot will be able to understand natural language.
