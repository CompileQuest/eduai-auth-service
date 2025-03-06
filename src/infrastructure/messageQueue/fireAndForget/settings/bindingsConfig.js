import RoutingKeys from "./routingKeys.js";
const bindingsConfig = {
    course_service: {
        exchange: "course_exchange",
        queue: "course_queue",
        bindings: [
            { exchange: "user_exchange", routingKeys: [RoutingKeys.USER_CREATED, RoutingKeys.USER_DELETED_SOFT] },
            { exchange: "payment_exchange", routingKeys: [RoutingKeys.PAYMENT_COMPLETED] },
        ],
    },
    user_service: {
        exchange: "user_exchange",
        queue: "user_queue",
        bindings: [
            { exchange: "course_exchange", routingKeys: [RoutingKeys.COURSE_CREATED] },
        ],
    },
    payment_service: {
        exchange: "payment_exchange",
        queue: "payment_queue",
        bindings: [
            { exchange: "user_exchange", routingKeys: [RoutingKeys.USER_CREATED] },
        ],
    },
    auth_service: {
        exchange: "auth_exchange",
        queue: "auth_queue",
        bindings: [
            { exchange: "user_exchange", routingKeys: [RoutingKeys.USER_CREATED] },
            { exchange: "course_exchange", routingKeys: [RoutingKeys.COURSE_CREATED, RoutingKeys.COURSE_ALL_EVENTS] },
        ],
    },
};

export default bindingsConfig