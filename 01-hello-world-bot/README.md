# Hello World Bot

## Prerequisites

Please install the following prerequisites.

* [NodeJS 8](https://nodejs.org)
* [VSCode](https://code.visualstudio.com) - IDE. VSCode can do anything. :-)
* [Azure Functions for Visual Studio Code](https://github.com/Microsoft/vscode-azurefunctions) - VSCode [extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) to run the Azure functions host locally and lot of other cool features
* [Azure Functions Pack](https://github.com/Azure/azure-functions-pack) - Package azure functions for optimization.
* [Bot Emulator](https://emulator.botframework.com) - Emulator to test the bot.

To install NodeJS(8.x) - At this time, NodeJS 10 is not supported by Azure Functions
```sh
brew install node@8
```

To install Azure Functions for Visual Studio, run the below command.
```bash
brew tap azure/functions
brew install azure-functions-core-tools
```

To install Azure functions pack, run the below command
```
npm install -g azure-functions-pack
```

## Start and test your bot

In visual studio code, go to debug window and launch "Attach to Javascript functions" configuration.


### Start the emulator and connect your bot

After you start your bot, connect to your bot in the emulator:

1. Type `http://localhost:7071/api/messages` into the address bar. (This is the default endpoint that your bot listens to when hosted locally.)
2. Click **Connect**. You won't need to specify **Microsoft App ID** and **Microsoft App Password**. You can leave these fields blank for now. You'll get this information later when you register your bot.

### Try out your bot

Now that your bot is running locally and is connected to the emulator, try out your bot by typing a few messages in the emulator.
You should see that the bot responds to each message you send by echoing back

`You sent <message> which was <message length> characters`

For eg: If you send `hello`, you might see `You sent hello which was 5 characters`

You've successfully created your first bot using the Bot Builder SDK for Node.js!
