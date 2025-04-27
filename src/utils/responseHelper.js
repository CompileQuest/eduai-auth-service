import { STATUS_CODES } from './app-errors.js';
class ResponseHelper {
    // Success response structure
    static success(message, data = null) {
        return {
            success: true,
            statusCode: 200,
            message: message,
            data: data,
        };
    }

    // Error response structure
    static error(description, error = {}) { // default empty object
        return {
            success: false,
            statusCode: error.statusCode || STATUS_CODES.INTERNAL_ERROR,
            description: description,
            message: error.message || 'An unexpected error occurred.',
            data: error.data || null,
        };
    }
}

export default ResponseHelper;