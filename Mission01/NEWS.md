# News Search

Imagine, we are just starting our new careers as news reporters.  We love data science and are very clever.  Well, then it's pretty clear what must be done.  We use an API to consume a trained model!  And since we are the proud geeks we are, let's ask Bing for the top stories around science and technology...


## First we need the keys

The key is a secret you will get from the MS Cognitive Services folks, so keep it safe to prevent other reporters from borrowing your clever ways. 

We're going to head on over to the Cognitive Services subscriptions site and get our free Bing Search key.  We'll need our MS Account.  It's very likely you already have an MS Account, but if not or you'd like a new one you'll find the links you need below.  You have one _already_ if:
* You sign in to a Windows PC, tablet, or phone
* You have an Xbox Live account
* You have Outlook.com
* You have Hotmail.com
* You use OneDrive
* You have a Skype username (you may need to associate an email, but try it first)
* Or really use/sign-in to any MS service/device

If you need an MS Account, sign up [here](https://signup.live.com) - you can use an existing email address or create a new one.

Our mission is as follows:

1.  Go [here](https://www.microsoft.com/cognitive-services/en-US/subscriptions) to get to subscriptions and log in with your Microsoft Account (see the note right above if you don't have one).
2.  You very well may need to verify your MS account.
3.  Now you will be able click on the big "+" sign to "Subscribe to new free trials".
4.  Check Bing Search and you'll get to agree to the terms and privacy statement (links are there).
5.  Take note of the location of your brand new, shiny subscription key for this API.

Congratulations, you now have access to Bing Search API which includes News!

## Get the Science and Tech Top Stories

As the next step in our mission, we add this bit of code to our `server.js` from the Bootcamp exercise:

```javascript
var request = require('request');

server.get('/news', function(req, res, next) {
        // Build the url we'll be calling to get top news
    var url = "https://api.cognitive.microsoft.com/bing/v5.0/news/?" 
        + "category=scienceandtechnology&count=10&mkt=en-US&originalImg=true";
    // Build options for the request
    var options = {
        uri: url,
        headers: {
            'Ocp-Apim-Subscription-Key': 'place your Bing Search subscription key here'
        },
        json: true // Returns the response in json
    }

    request(options, function (error, response, body) {
        res.send(body);
    });
    next();
});

```

* Run your server.js as before, in terminal with:  `node server.js` (If you're on Windows this is command prompt, not the Bash).
* Check out your http://localhost:3978/news path and you should see the very latest, top stories for science and tech in json format.  Congrats on becoming a very clever reporter.


Note on data privacy:  for info on this, see the Bing section at https://privacy.microsoft.com/en-us/privacystatement.
