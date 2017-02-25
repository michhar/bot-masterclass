# Bing News Search

So, we're just starting our new careers as reporters.  We love data science and are clever programmers.  Well, then it's pretty clear what must be done.  We use an API to consume a trained model!  And since we are the proud geeks we are, let's ask Bing for the top stories around science and technology...


## First we need the keys

We're going to head on over to the Cognitive Services subscriptions site and get our free Bing Search key.  We'll need our MS Account (if you sign in to a **Windows PC, tablet, or phone, Xbox Live, Outlook.com, Hotmail.com or OneDrive, use that account** or really any MS service/device, otherwise you can use any email address to get one [here](https://signup.live.com) or even sign up for Outlook.com [here](https://www.microsoft.com/en-us/outlook-com/)).  Whew.

1.  Go [here](https://www.microsoft.com/cognitive-services/en-US/subscriptions) to get to subscriptions and log in with your Microsoft Account (see the note right above if you don't have one).
2.  You very well may need to verify your MS account so please do that to unlock the wonders of these APIs.
3.  Now you will be able click on the big "+" sign to "Subscribe to new free trials".
4.  Check Bing Search and you'll get to agree to the terms and privacy statement (links are there).
5.  Take note of the location of your brand new, shiny subscription key for this API.

Congratulations, you completed a mostly pain-free process and have access to Bing Search API which includes News!!!

## Get the Science and Tech Top Stories

Add this bit of code to your `server.js` from the Bootcamp exercise:

```javascript

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
* Check out your http://localhost:3978/news path and you should see the very latest, top stories for science and tech.  Congrats on becoming a very clever reporter.


