import { EntityRecognizer, Prompts, WaterfallDialog } from "botbuilder";
import * as moment from "moment";
import { BotAppInsights } from "../appinsights";
import { Reservation } from "../model/reservation";

const dialog = new WaterfallDialog([
    async (session, args, next) => {
        
        BotAppInsights.log('When Dialog', session, args);
        
        const reservation: Reservation = session.privateConversationData.reservation;
        if (reservation.when) { if (next) { next(); } return; }
        // Ask time
        Prompts.time(session, 'WHEN_REQUEST');
    },
    async (session, results, _next) => {

        BotAppInsights.log('When Dialog - Response', session, results);

        // Get time
        let whenTime : Date | null = null;
        if (results.response) {
            whenTime = EntityRecognizer.resolveTime([results.response]);

            const reservation: Reservation = session.privateConversationData.reservation;
            reservation.when = whenTime;

            session.send('WHEN_CONFIRMATION', moment(whenTime).format('LLLL'));
        }
        
        session.endDialogWithResult({ response: whenTime });
    }
]);

export { dialog as WhenDialog }