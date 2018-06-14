import {
    AttachmentLayout, CardAction, CardImage, EntityRecognizer,
    HeroCard, Message, Prompts, SuggestedActions,
    ThumbnailCard,
    WaterfallDialog
} from "botbuilder";
import * as _ from "lodash";
import * as moment from "moment";
import { Reservation } from "../model/reservation";
import { Restaurant } from "../model/restaurant";
import { RestaurantService } from "../service/restaurant-service";

const restaurantService = new RestaurantService();

const dialog = new WaterfallDialog([
    (session, _args, _next) => {
        const reservation = new Reservation();
        session.privateConversationData.reservation = reservation;

        session.send('GREETINGS');
        Prompts.text(session, 'LOCATION_REQUEST');
    },
    async (session, results, _next) => {
        // Get location
        const location = results.response;
        const reservation: Reservation = session.privateConversationData.reservation;
        reservation.location = location;
        session.send('LOCATION_CONFIRMATION', location);

        // Ask cuisines
        const cuisines = await restaurantService.getCuisines(location);
        const cardActions = _.map(cuisines, (x) => {
            return CardAction.imBack(session, x.name, `${x.name} (${x.count})`);
        });

        const choices = _.map(cuisines, (x) => x.name);
        const suggestedActions = SuggestedActions.create(session, cardActions);

        const msg = new Message(session)
            .text('CUISINE_REQUEST')
            .suggestedActions(suggestedActions);

        Prompts.choice(session, msg, choices);
    },
    async (session, results, _next) => {
        // Get Cuisine
        const cuisine = results.response.entity;
        const reservation: Reservation = session.privateConversationData.reservation;
        reservation.cuisine = cuisine;

        session.send('CUISINE_CONFIRMATION');

        const restaurants = await restaurantService.getRestaurants(reservation.location!, reservation.cuisine!);
        const cardAttachments = _.map(restaurants, (restaurant) => {
            const card = new ThumbnailCard(session)
                .title(restaurant.name)
                .subtitle(restaurant.address)
                .images([CardImage.create(session, restaurant.logoUrl.toString())])
                .buttons([
                    CardAction.openUrl(session, restaurant.url.toString(), 'More Info'),
                    CardAction.imBack(session, restaurant.name, 'Select')
                ])
            return card.toAttachment();
        });

        const choices = _.map(restaurants, (x) => x.name);

        const msg = new Message(session)
            .text('RESTAURANT_REQUEST', reservation.cuisine, reservation.location)
            .attachments(cardAttachments)
            .attachmentLayout(AttachmentLayout.carousel);

        Prompts.choice(session, msg, choices);
    },
    async (session, results, _next) => {
        // Get restaurant
        const restaurantName = results.response.entity;
        const reservation: Reservation = session.privateConversationData.reservation;

        const restaurant = await restaurantService.getRestaurant(reservation.location!, restaurantName);

        if (restaurant) {
            reservation.restaurant = restaurant;
            session.send('RESTAURANT_CONFIRMATION', restaurant.name);
        }

        // Ask time
        Prompts.time(session, 'WHEN_REQUEST');
    },
    (session, results, _next) => {
        // Get time
        const whenTime = EntityRecognizer.resolveTime([results.response]);

        const reservation: Reservation = session.privateConversationData.reservation;
        reservation.when = whenTime;

        session.send('WHEN_CONFIRMATION', reservation.restaurant!.name, moment(whenTime).format('LLLL'));

        // Ask party sizes
        Prompts.number(session, 'PARTY_REQUEST');
    },
    (session, results, _next) => {
        // Get party size
        const partySize = results.response;

        const reservation: Reservation = session.privateConversationData.reservation;
        // tslint:disable-next-line:radix
        reservation.partySize = parseInt(partySize);

        // Ask confirmation
        const when = moment(reservation.when);
        const restaurant = Restaurant.fromJson(reservation.restaurant);

        const card = new HeroCard(session)
            .title(`${restaurant.name} (${reservation.partySize})`)
            .subtitle(when.format('LLLL'))
            .text(`${restaurant.address}`)
            .images([CardImage.create(session, restaurant.logoUrl.toString())])
            .buttons([CardAction.imBack(session, 'Reserve', 'Reserve')]);

        const msg = new Message(session)
            .text('CONFIRMATION')
            .attachments([card.toAttachment()]);

        Prompts.choice(session, msg, 'Reserve');
    },
    (session, _results, _next) => {    
        const reservation: Reservation = session.privateConversationData.reservation;    
        // Ask confirmation
        session.send('BOOKED_CONFIRMATION', reservation.restaurant!.name, moment(reservation.when).format('ll'), moment(reservation.when).format('LT'));
        session.endConversation();
    }
]);

export { dialog as CreateReservationDialog }