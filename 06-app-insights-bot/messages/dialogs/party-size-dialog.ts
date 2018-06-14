import { Prompts, WaterfallDialog } from "botbuilder";
import { BotAppInsights } from "../appinsights";
import { Reservation } from "../model/reservation";

const dialog = new WaterfallDialog([
    async (session, args, next) => {

        BotAppInsights.log('Party Size Dialog', session, args);

        const reservation: Reservation = session.privateConversationData.reservation;
        if (reservation.partySize) { if (next) { next(); } return; }

        // Ask party sizes
        Prompts.number(session, 'PARTY_REQUEST');
    },
    async (session, results, _next) => {
        
        BotAppInsights.log('Party Size Dialog - Response', session, results);

        // Get party size
        const partySize = results.response;
        if (partySize) {
            const reservation: Reservation = session.privateConversationData.reservation;
            // tslint:disable-next-line:radix
            reservation.partySize = parseInt(partySize);

            session.send('CONFIRMATION');
        }
        session.endDialogWithResult({ response: partySize });
    }
]);

export { dialog as PartySizeDialog }