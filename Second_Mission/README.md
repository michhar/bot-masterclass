# Introduction to conversational apps

## Your Mission

In `Dialogs.md` you will learn about dialog handling and logic.

`Recognizers.md` leads you down a path of building recognizers to intelligently pick up the intents of our clients.

## Prerequisites

Ensure you have fufilled those listed on the main [README](../README.md) for this course.

## Set up project

> On Windows, Mac and Unix, the instructions are pretty much the same.

Here are some general directions on setting up a project for use with Node.js.  Remember always to find out if you have your correct packages in the directory.  At first you'll look for a `package.json` in your project or given to you somehow.  Don't worry, there's instructions on what to do if it's not there.  You'll end up, after all package installs, with a folder called `node_modules`.

### If you have a package.json

Create a folder for your bot, cd into it, and run npm install to install all libraries in package.json.  So, if you have a package.json, in terminal type:

    npm install


### If there is **no** package.json

Create a folder for your bot, `cd` into it, and run an initializing command to begin a project (it also creates a `package.json` file for you to add to).  `npm` is the node package manager.  So, in terminal type:

    npm init
    
Get the BotBuilder (let's use `3.6.0` for now) and restify libraries using npm.

    npm install --save botbuilder@3.6.0
    npm install --save restify

### Setup Environment

Ensure you have the emulator installed (found in the prereqs link above).  See, also, [this](https://github.com/microsoft/botframework-emulator/wiki/Getting-Started#get-up-and-running) to get up and running with emulator.

### Visual Studio Code or Code Editor/IDE

You will use your editor to create the server-side code in a file I often call `server.js` (and will reference it as such here), but you can name it `app.js`, `catsarebetterthandogs.js` or something a bit more descriptive.

## Testing Locally

When going through MISSION1 and 2 and piecing together your code, you will test it in this manner:

3.  Open the folder, where your newly created package.json exists for each mission, in VSCode.
3.  You can start the process in the command terminal (you can use VSCode's integrated terminal under the "View" menu option) and type into the commmand prompt:
  - `node server.js`
  
  > Doesn't work? Windows not able to find the node command?  First make sure you've run `npm install` as described above.  Try adding `NODE_PATH` as a System variable in the Advanced tab of the System Properties dialog and set to the path `%AppData%\npm\node_modules` (Windows 7/8/10) or wherever npm was installed.
5.  You can now open the emulator (make sure this is in your PATH or go to its folder or search for "botframework-emulator").
6.  In the botemulator desktop app:
    * Click in the empty space asking for an Endpoint URL at the top and some choices should pop up
    * Select app on port (usually 3978)
    * Keep app id and app password blank
    * Hit connect
    * Type a message to the bot and wait for a response (you could start with "Hey bot!" or "Bye")

Try things out in the code and follow all of the exercises in the MISSION files.  Have fun!

More info on connecting to a bot on localhost [here](https://github.com/microsoft/botframework-emulator/wiki/Getting-Started#connect-to-a-bot-running-on-localhost)


