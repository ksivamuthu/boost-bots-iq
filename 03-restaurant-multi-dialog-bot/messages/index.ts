import dotenv = require('dotenv');
dotenv.config();

import { MemoryBotStorage, UniversalBot } from "botbuilder";
import { BotServiceConnector } from "botbuilder-azure";
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
    session.endDialog('NONE');
});

// Set inMemory Storage
bot.set('storage', new MemoryBotStorage());
bot.localePath(path.join(__dirname, './locale'));

bot.dialog('CreateReservation', CreateReservationDialog)
    .triggerAction({ matches: /^create reservation$/i });
bot.dialog('LocationDialog', LocationDialog);
bot.dialog('CuisineDialog', CuisineDialog);
bot.dialog('RestaurantDialog', RestaurantDialog);
bot.dialog('WhenDialog', WhenDialog);
bot.dialog('PartySizeDialog', PartySizeDialog);
bot.dialog('ConfirmReservationDialog', ConfirmReservationDialog);

export default connector.listen();
