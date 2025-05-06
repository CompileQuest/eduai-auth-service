import AuthService from "../../services/auth-service.js";
import RoutingKeys from "./fireAndForget/settings/routingKeys.js"
class MessageHandler {
    constructor() {
        this.paymentService = new AuthService();

        // Bind handlers
        this.handleCourseCreated = this.handleCourseCreated.bind(this);
        this.handleUserUpdated = this.handleUserUpdated.bind(this);
        this.handlePaymentCompleted = this.handlePaymentCompleted.bind(this);
        this.handleUnknownMessage = this.handleUnknownMessage.bind(this);

        // Use routing keys instead of hardcoded strings
        this.handlers = {
            [RoutingKeys.COURSE_CREATED]: this.handleCourseCreated,
            [RoutingKeys.USER_UPDATED]: this.handleUserUpdated,
            [RoutingKeys.PAYMENT_COMPLETED]: this.handlePaymentCompleted,
        };
    }

    async handleMessage(message) {
        const { type, payload } = message;
        const handler = this.handlers[type] || this.handleUnknownMessage;
        return await handler(payload, type);
    }

    async handleCourseCreated(payload, type) {
        console.log(`📘 [${type}] Course Created Payload:`, payload);
        return { success: true, message: `Handled ${type}` };
    }

    async handleUserUpdated(payload, type) {
        console.log(`👤 [${type}] User Updated:`, payload);
        return { success: true, message: `Handled ${type}` };
    }

    async handlePaymentCompleted(payload, type) {
        console.log(`💰 [${type}] Payment Completed:`, payload);
        return { success: true, message: `Handled ${type}` };
    }

    async handleUnknownMessage(payload, type) {
        console.warn(`❓ Unknown message type: ${type}`, payload);
        return { success: false, message: `Unknown message type: ${type}` };
    }
}

export default MessageHandler;
