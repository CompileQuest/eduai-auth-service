import {
    extractFormFields,
} from "../../utils/index.js";
import { PublishUserEvent } from "../../services/publisher.js";
import AuthService from "../../services/auth-service.js";
import HttpClient from "../../services/external/httpClient.js";
import services from "../../services/external/services.js";
import { FormateData } from "../../utils/index.js";
const authService = new AuthService();
const httpClient = new HttpClient();
export const EmailAndPasswordSignUpFlow = async (originalImplementation, input) => {
    const formData = extractFormFields(input.userContext);

    if (!formData) {
        console.error("Form fields are missing in the request");
        return {
            status: "GENERAL_ERROR",
            message: "Form fields are missing in the request.",
        };
    }

    console.log("Form data extracted from the request:", formData);

    const userNamePayload = FormateData(formData.username);

    // Check if username exists in the user service (To be implemented)
    const usernameExit = await httpClient.callService(
        services.userService,
        "check-username-exists",
        userNamePayload
    );
    if (usernameExit) { // If username exists
        console.error("Username already exists");
        return {
            status: "BAD_REQUEST",
            message: "Username already exists.",
        };
    }


    // Sign up with SuperTokens Core
    let response = await originalImplementation.signUp(input);

    if (response.status !== "OK") return response;

    const userId = response.user.id;

    // Assign role to the user
    const roleAdded = await authService.addRoleToUser(userId, formData.role);
    if (!roleAdded) {
        console.error("Failed to assign role to the user");
    }

    // Add roles and permissions to session if a session exists
    if (input.session) {
        try {
            await authService.addRolesAndPermissionsToSession(input.session);
            console.log("Roles and permissions added to session");
        } catch (err) {
            console.error("Failed to add roles and permissions to session:", err);
        }
    }

    // Create a payload for the event
    const formDataWithUserId = {
        ...formData,
        userId: userId,
        emailVerified: response.user.loginMethods[0].verified,
        userTimeJoined: response.user.timeJoined,
    };

    // Publish user signup event (optional)
    try {
        await PublishUserEvent(formDataWithUserId);
        console.log("User signup event published successfully.");
    } catch (err) {
        console.error("Failed to publish user signup event:", err);
    }

    console.log("User signed up successfully with roles and session claims updated.");
    return response;
};
