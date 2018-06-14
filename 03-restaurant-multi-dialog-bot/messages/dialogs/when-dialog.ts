import { EntityRecognizer, Prompts, WaterfallDialog } from "botbuilder";
import * as moment from "moment";
import { Reservation } from "../model/reservation";

const dialog = new WaterfallDialog([
    async (session, _args, _next) => {
        // Ask time
        Prompts.time(session, 'WHEN_REQUEST');
    },
    async (session, results, _next) => {
        // Get time
        const whenTime = EntityRecognizer.resolveTime([results.response]);

        const reservation: Reservation = session.privateConversationData.reservation;
        reservation.when = whenTime;

        session.send('WHEN_CONFIRMATION', reservation.restaurant!.name, moment(whenTime).format('LLLL'));
        session.endDialogWithResult({ response: whenTime });
    }
]);

export { dialog as WhenDialog }