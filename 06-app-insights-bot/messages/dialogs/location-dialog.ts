import { Prompts, WaterfallDialog } from "botbuilder";
import { BotAppInsights } from "../appinsights";
import { Reservation } from "../model/reservation";

const dialog = new WaterfallDialog([
    (session, args, next) => {

        BotAppInsights.log('Location Dialog', session, args);

        const reservation: Reservation = session.privateConversationData.reservation;
        if (reservation.location) { if (next) { next(); } return; }

        Prompts.text(session, 'LOCATION_REQUEST');
    },
    async (session, results, _next) => {

        BotAppInsights.log('Location Dialog Response', session, results);

        // Get location
        const location = results.response;
        if (location) {
            const reservation: Reservation = session.privateConversationData.reservation;
            reservation.location = location;
            session.send('LOCATION_CONFIRMATION', location);
        }
        session.endDialogWithResult({ response: location });
    }
]);

export { dialog as LocationDialog }