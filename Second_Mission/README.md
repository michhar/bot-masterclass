# Welcome to Botland!

## Your Mission

Go to MISSION1 and learn about dialogs and waterfalls.

That's right, MISSION2 is next.  This will lead you down a path of building recognizers (with smarts) and, hence, the intents of our clients.


## Set up project

Here are some general directions on setting up a project for use with Node.js.  Remember always to find out if you have your correct packages in the directory.  At first you'll look for a `package.json` in your project or given to you somehow.  Don't worry, there's instructions on what to do if it's not there.  You'll end up automatically, after following the directions below, with a folder called `node_modules`.

### If you have a package.json

Create a folder for your bot, cd into it, copy all code over and run npm install to install all things in package.json.  So, in terminal type:

    npm install


### If there is **no** package.json

Create a folder for your bot, `cd` into it, and run an initializing command to begin a project (it alsow creates a `package.json` file for you to add to).  `npm` is the node package manager.  So, in terminal type:

    npm init
    
Get the BotBuilder (let's use `3.6.0` for now) and restify modules using npm.

    npm install --save botbuilder@3.6.0
    npm install --save restify

## Test Locally with the botemulator

Back in terminal run your app with:

    node server.js

In the botemulator desktop app:

* Click in the empty space asking for an Endpoint URL at the top and some choices should pop up
* Select app on port (usually 3978)
* Keep app id and app password blank
* Hit connect
* Type a message to the bot and wait for a response (you could start with "Hey bot!" or "Bye")

Try things out in the code and follow all of the exercises in the MISSION files.  Have fun!



