import dotenv = require("dotenv");
dotenv.config();

import { MemoryBotStorage, UniversalBot } from "botbuilder";
import { BotServiceConnector } from "botbuilder-azure";
import * as path from "path";
import { CreateReservationDialog } from "./dialogs/create-reservation-dialog";

const connector = new BotServiceConnector({
  appId: process.env.MicrosoftAppId,
  appPassword: process.env.MicrosoftAppPassword
});

const bot = new UniversalBot(connector, (session, _args) => {
  session.endDialog("NONE");
});

// Set inMemory Storage
bot.set("storage", new MemoryBotStorage());
bot.localePath(path.join(__dirname, "./locale"));

bot
  .dialog("CreateReservation", CreateReservationDialog)
  .triggerAction({ matches: /^create reservation$/i });

export default connector.listen();
