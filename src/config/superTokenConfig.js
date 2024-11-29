import { SignUpFormFields } from './GeneralConfigs/formFieldsConfig.js';
import { emailAndPasswordOverride } from './overrides/emailAndPasswordOverride.js';
import { socialLoginOverride } from './overrides/SocialLoginOverride.js';
import { thirdPartyProviders } from './providers/thirdPartyProviders.js';
import { SUPERTOKEN_CONNECTION_URL, SUPERTOKEN_API_KEY, WEBSITE_DOMAIN, API_DOMAIN } from "./index.js"
import EmailPassword from "supertokens-node/recipe/emailpassword";
import ThirdParty from "supertokens-node/recipe/thirdparty";
import Session from "supertokens-node/recipe/session";
import UserRoles from "supertokens-node/recipe/userroles";
import Dashboard from "supertokens-node/recipe/dashboard";
import EmailVerification from "supertokens-node/recipe/emailverification";

export const SuperTokensConfig = {
    supertokens: {
        connectionURI: SUPERTOKEN_CONNECTION_URL,
        apiKey: SUPERTOKEN_API_KEY,
    },
    appInfo: {
        appName: "SuperTokens Demo App",
        apiDomain: API_DOMAIN,
        websiteDomain: WEBSITE_DOMAIN,
    },
    recipeList: [
        EmailPassword.init({
            signUpFeature: {
                formFields: SignUpFormFields,
            },
            override: {
                functions: emailAndPasswordOverride,
            },
        }),
        ThirdParty.init({
            override: {
                functions: socialLoginOverride,
            },
            signInAndUpFeature: {
                providers: thirdPartyProviders,
            },
        }),
        EmailVerification.init({ mode: "OPTIONAL" }),
        Session.init(),
        Dashboard.init(),
        UserRoles.init(),
    ],
};
