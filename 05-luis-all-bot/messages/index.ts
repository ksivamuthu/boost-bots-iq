import dotenv = require('dotenv');
dotenv.config();

import { LuisRecognizer, MemoryBotStorage, UniversalBot } from "botbuilder";
import { BotServiceConnector } from "botbuilder-azure";
import { CONSTANTS } from "./constants";
import { ConfirmReservationDialog } from "./dialogs/confirm-reservation-dialog";
import { CreateReservationDialog } from "./dialogs/create-reservation-dialog";
import { CuisineDialog } from "./dialogs/cuisine-dialog";
import { LocationDialog } from "./dialogs/location-dialog";
import { PartySizeDialog } from "./dialogs/party-size-dialog";
import { RestaurantDialog } from "./dialogs/restaurant-dialog";
import { WhenDialog } from "./dialogs/when-dialog";

import * as path from 'path';

const connector = new BotServiceConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

const bot = new UniversalBot(connector, (session, _args) => {
    session.send('NONE');
});

// Set inMemory Storage
bot.set('storage', new MemoryBotStorage());
bot.localePath(path.join(__dirname, './locale'));

// Add LUIS
const luisAppId = process.env.LuisAppId;
const luisApiKey = process.env.LuisAPIKey;
const luisApiHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

const luisModelUrl = 'https://' + luisApiHostName + '/luis/v2.0/apps/' + luisAppId + '?subscription-key=' + luisApiKey;

// Create a recognizer that gets intents from LUIS, and add it to the bot
const recognizer = new LuisRecognizer(luisModelUrl);
bot.recognizer(recognizer);

bot.dialog('CreateReservation', CreateReservationDialog)
   .triggerAction({ matches: [
    CONSTANTS.intents.CREATE_RESERVATION, CONSTANTS.intents.SET_RESERVATION_CUISINE,
    CONSTANTS.intents.SET_RESERVATION_DATE, CONSTANTS.intents.SET_RESERVATION_LOCATION,
    CONSTANTS.intents.SET_RESERVATION_PARTY_SIZE
]});

bot.dialog('LocationDialog', LocationDialog);
bot.dialog('CuisineDialog', CuisineDialog);
bot.dialog('RestaurantDialog', RestaurantDialog);
bot.dialog('WhenDialog', WhenDialog);
bot.dialog('PartySizeDialog', PartySizeDialog);
bot.dialog('ConfirmReservationDialog', ConfirmReservationDialog);

export default connector.listen();
