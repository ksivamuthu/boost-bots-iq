import { WaterfallDialog } from "botbuilder";
import * as moment from "moment";
import { Reservation } from "../model/reservation";

const dialog = new WaterfallDialog([
    (session, _args, _next) => {
        const reservation = new Reservation();
        session.privateConversationData.reservation = reservation;

        session.send('GREETINGS');
        session.beginDialog('LocationDialog');
    },
    (session, _results, _next) => {
        session.beginDialog('CuisineDialog');
    },
    (session, _results, _next) => {
        session.beginDialog('RestaurantDialog');
    },
    (session, _results, _next) => {
        session.beginDialog('WhenDialog');
    },
    (session, _results, _next) => {
        session.beginDialog('PartySizeDialog');
    },
    (session, _results, _next) => {
        session.beginDialog('ConfirmReservationDialog');
    },
    (session, _results, _next) => {    
        const reservation: Reservation = session.privateConversationData.reservation;    
        // Ask confirmation
        session.send('BOOKED_CONFIRMATION', reservation.restaurant!.name, moment(reservation.when).format('ll'), moment(reservation.when).format('LT'));
        session.endConversation();
    }
]);

export { dialog as CreateReservationDialog }