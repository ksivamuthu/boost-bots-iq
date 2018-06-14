import { Prompts, WaterfallDialog } from "botbuilder";
import { Reservation } from "../model/reservation";

const dialog = new WaterfallDialog([
    async (session, _args, _next) => {
        // Ask party sizes
        Prompts.number(session, 'PARTY_REQUEST');
    },
    async (session, results, _next) => {
        // Get party size
        const partySize = results.response;

        const reservation: Reservation = session.privateConversationData.reservation;
        // tslint:disable-next-line:radix
        reservation.partySize = parseInt(partySize);

        session.send('CONFIRMATION');
        session.endDialogWithResult({ response: partySize });
    }
]);

export { dialog as PartySizeDialog }