import { Prompts, WaterfallDialog } from "botbuilder";
import { Reservation } from "../model/reservation";

const dialog = new WaterfallDialog([
    (session, _args, _next) => {
        Prompts.text(session, 'LOCATION_REQUEST');
    },
    async (session, results, _next) => {
        // Get location
        const location = results.response;
        const reservation: Reservation = session.privateConversationData.reservation;
        reservation.location = location;
        session.send('LOCATION_CONFIRMATION', location);
        session.endDialogWithResult({ response: location });
    }
]);

export { dialog as LocationDialog }