import { extractFormFields, createPayloadWithEvent, addRoleToUser, addRolesAndPermissionsToSession } from "../../utils/index.js";
import { PublishUserEvent } from "../../services/publisher.js";

const emailAndPasswordOverride = (originalImplementation) => {
    return {
        ...originalImplementation,
        signUp: async function (input) {
            const formData = extractFormFields(input.userContext);
            if (!formData) {
                console.error("Form fields are missing in the request");
                return {
                    status: "GENERAL_ERROR",
                    message: "Form fields are missing in the request.",
                };
            }

            // Call the original signUp implementation
            let response = await originalImplementation.signUp(input);

            if (response.status === "OK") {
                const userId = response.user.id;

                // Assign role to the user in the backend
                const roleAdded = await addRoleToUser(userId, formData.role);
                if (!roleAdded) {
                    console.error("Failed to assign role to the user");
                }

                // Add roles and permissions to session if a session exists
                if (input.session) {
                    try {
                        await addRolesAndPermissionsToSession(input.session);
                        console.log("Roles and permissions added to session");
                    } catch (err) {
                        console.error("Failed to add roles and permissions to session:", err);
                    }
                }

                // Post-signup logic (e.g., event publishing)
                const formDataWithUserId = {
                    ...formData,
                    userId: userId,
                    emailVerified: response.user.loginMethods[0].verified,
                    userTimeJoined: response.user.timeJoined,
                };



                // contact using one of the method here like for example maybe using 
                // contact the user service here !!! if the user srevice didn't create the recored rollback 
                // the authe service to delete the user !!
                // const payload = createPayloadWithEvent("CREATE_USER", formDataWithUserId);
                //  PublishUserEvent(payload);

                console.log("User signed up successfully with roles and session claims updated.");
            }

            return response;
        },
    };
};


export { emailAndPasswordOverride } 