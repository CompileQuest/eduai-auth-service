import { extractFormFields, createPayloadWithEvent } from "../../utils/index.js";
import { PublishUserEvent } from "../../services/publisher.js";

const emailAndPasswordOverride = (originalImplementation) => {
    return {
        ...originalImplementation,

        signUp: async function (input) {
            // TODO: Pre SignUp Logic Here !!
            const formData = extractFormFields(input.userContext); 
            if (!formData) {
                console.error("Form fields are missing in the request");
                return {
                    status: "GENERAL_ERROR",
                    message: "Form fields are missing in the request.",
                };
            }
            let response = await originalImplementation.signUp(input);
            if (response.status === "OK" && response.user.loginMethods.length === 1 && input.session === undefined) {
                // TODO: Post SignUp Logic Here !!
                // Add userId from response to formData
                const formDataWithUserId = {
                    ...formData, // Spread existing formData
                    userId: response.user.id ,// Add userId from response
                    emailVerfied : response.user.loginMethods[0].verified,
                    userTimeJoined: response.user.timeJoined
                };
                const payload = createPayloadWithEvent('CREATE_USER', formDataWithUserId);
                PublishUserEvent(payload);
                console.log('User signed up successfully');
            }
            return response;
        },
 
        signIn: async function (input) {
            let response = await originalImplementation.signIn(input);
            if (response.status === "OK" && input.session === undefined) {
                // TODO: Post SignIn Logic here !!
                console.log('User signed in successfully');
            }

            return response;
        },
    };
};

export { emailAndPasswordOverride } 