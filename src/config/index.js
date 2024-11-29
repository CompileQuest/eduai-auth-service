import dotenv from "dotenv";

// Load environment variables based on the current NODE_ENV
if (process.env.NODE_ENV !== "prod") {
    console.log("Uploading development Env");
    const configFile = `./.env.${process.env.NODE_ENV}`;
    console.log("The config file is:", configFile);
    dotenv.config({ path: configFile });
} else {
    dotenv.config();
}

// Export environment variables using ES Module syntax
export const AUTH_SERVICE_PORT = process.env.AUTH_SERVICE_PORT;
export const WEBSITE_DOMAIN = process.env.WEBSITE_DOMAIN;
export const API_DOMAIN = process.env.API_DOMAIN;
export const SUPERTOKEN_CONNECTION_URL = process.env.SUPERTOKEN_CONNECTION_URL;
export const SUPERTOKEN_API_KEY = process.env.SUPERTOKEN_API_KEY;
