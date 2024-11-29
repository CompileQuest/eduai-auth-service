import ThirdParty from "supertokens-node/recipe/thirdparty";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import Session from "supertokens-node/recipe/session";
import Dashboard from "supertokens-node/recipe/dashboard";
import UserRoles from "supertokens-node/recipe/userroles";
import EmailVerification from "supertokens-node/recipe/emailverification";
import {
    WEBSITE_DOMAIN,
    API_DOMAIN,
    SUPERTOKEN_CONNECTION_URL,
    SUPERTOKEN_API_KEY
} from './index.js'
import util from "util";
import {extractFormFields} from '../utils/index.js';

export const SuperTokensConfig = {
    supertokens: {
        // this is the location of the SuperTokens core.
        connectionURI: SUPERTOKEN_CONNECTION_URL,
        apiKey: SUPERTOKEN_API_KEY,
    },
    appInfo: {
        appName: "SuperTokens Demo App",
        apiDomain: API_DOMAIN,
        websiteDomain: WEBSITE_DOMAIN,
    },
    // recipeList contains all the modules that you want to
    // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
    recipeList: [
        EmailPassword.init({
            signUpFeature: {
                formFields: [{
                    id: "name"
                }, {
                    id: "age",
                    optional:true
                }, {
                    id: "country",
                    optional: true
                }]
            },
            override: {
                functions: (originalImplementation) => {
                    return {
                        ...originalImplementation,

                        // override the email password sign up function
                        signUp: async function (input) {
                            // TODO: some pre sign up logic
                            
                            // Use the helper function to extract form fields
                            const formData = extractFormFields(input.userContext);
                            
                            if (!formData) {
                                console.error("Form fields are missing in the request");
                                return {
                                    status: "GENERAL_ERROR",
                                    message: "Form fields are missing in the request.",
                                };
                            }
                            console.log("this is the form field " , formData)

                            let response = await originalImplementation.signUp(input);

                            if ( 
                                response.status === "OK" &&
                                response.user.loginMethods.length === 1 &&
                                input.session === undefined
                            ) {
                                // TODO: some post sign up logic
                            }

                            return response;
                        },

                        // override the email password sign in function
                        signIn: async function (input) {
                            // TODO: some pre sign in logic

                            let response = await originalImplementation.signIn(input);

                            if (response.status === "OK" && input.session === undefined) {
                                // TODO: some post sign in logic
                                // Todo:  convert it into event driven base in the future
                                // for now using regular http request for this one !!

                            }

                            return response;
                        },
                    };
                },
            }
        }),
        ThirdParty.init({
            override: {
                functions: (originalImplementation) => {
                    return {
                        ...originalImplementation,

                        // override the thirdparty sign in / up function
                        signInUp: async function (input) {
                            // TODO: Some pre sign in / up logic

                            let response = await originalImplementation.signInUp(input);

                            if (response.status === "OK") {
                                let accessToken = response.oAuthTokens["access_token"];
                                let firstName = response.rawUserInfoFromProvider.fromUserInfoAPI["first_name"];


                                if (input.session === undefined) {
                                    if (
                                        response.createdNewRecipeUser &&
                                        response.user.loginMethods.length === 1
                                    ) {
                                        // TODO: some post sign up logic
                                    } else {
                                        // TODO: some post sign in logic
                                    }
                                }
                            }

                            return response;
                        },
                    };
                },
            },
            signInAndUpFeature: {
                providers: [
                    // We have provided you with development keys which you can use for testing.
                    // IMPORTANT: Please replace them with your own OAuth keys for production use.
                    {
                        config: {
                            thirdPartyId: "google",
                            clients: [
                                {
                                    clientId:
                                        "1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com",
                                    clientSecret: "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",
                                },
                            ],
                        },
                    },
                    {
                        config: {
                            thirdPartyId: "github",
                            clients: [
                                {
                                    clientId: "467101b197249757c71f",
                                    clientSecret: "e97051221f4b6426e8fe8d51486396703012f5bd",
                                },
                            ],
                        },
                    },
                    {
                        config: {
                            thirdPartyId: "twitter",
                            clients: [
                                {
                                    clientId: "4398792-WXpqVXRiazdRMGNJdEZIa3RVQXc6MTpjaQ",
                                    clientSecret:
                                        "BivMbtwmcygbRLNQ0zk45yxvW246tnYnTFFq-LH39NwZMxFpdC",
                                },
                            ],
                        },
                    },
                ],
            },
        }),
        EmailVerification.init({
            mode: "OPTIONAL", // or "OPTIONAL"
        }),
        Session.init(),
        Dashboard.init(),
        UserRoles.init(),
    ],
};
