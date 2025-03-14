import HttpClient from "./external/httpClient.js";
import { APIError, InternalServerError, AppError } from "../utils/app-errors.js";
import services from "./external/services.js";
import HttpMessage from "./external/HttpMessage.js"; // Import the HttpMessage class
import EVENTS from "./external/events.js";
class AuthService {
    constructor() {
        this.service = new HttpClient(); // Initialize HttpClient
    }

    /**
     * Create a user in the user service.
     * @param {object} payload - The user data to create.
     * @returns {Promise<object>} - The response from the user service.
     */
    async createUserInUserService(payload) {
        try {
            // Step 2: Call the user service to create a user
            const response = await this.service.callService(
                services.userService, // Service name
                EVENTS.USER_SERVICE.USER_CREATED, // Event or endpoint
                payload // Pass the HttpMessage as the payload
            );
            return response; // Return the response from the user service
        } catch (error) {
            if (error instanceof AppError) {
                // Re-throw custom errors (e.g., APIError, BadRequestError)
                console.log("here am iafdasf")
                throw error;
            } else {
                // Wrap unexpected errors in an InternalServerError
                throw new InternalServerError(
                    "An error occurred while creating the user.",
                    error.message // Include the original error message
                );
            }
        }
    }


    async addRolesAndPermissionsToSession(session) {
        // we add the user's roles to the user's session
        await session.fetchAndSetClaim(UserRoleClaim);

        // we add the permissions of a user to the user's session
        await session.fetchAndSetClaim(PermissionClaim);
    }

    async addRoleToUser(userId, Role) {
        const response = await UserRoles.addRoleToUser("public", userId, Role);
        if (response.status === "UNKNOWN_ROLE_ERROR") {
            // No such role exists
            return;
        }

        if (response.didUserAlreadyHaveRole === true) {
            // The user already had the role
        }
        return true;
    }


}

export default AuthService;