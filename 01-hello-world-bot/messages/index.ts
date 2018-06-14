import { MemoryBotStorage, UniversalBot } from "botbuilder";
import { BotServiceConnector } from "botbuilder-azure";
import * as dotenv from 'dotenv';

dotenv.config();

// Step 1: Connector
const connector = new BotServiceConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Step 2: Universal Bot
const bot = new UniversalBot(connector, (session, _args) => {
    const text = session.message.text!
    // Count the text length and send it back
    session.endDialog(`You sent \"${text}\" which was ${text.length} characters`);
});

// Set inMemory Storage
bot.set('storage', new MemoryBotStorage());

module.exports = connector.listen();
