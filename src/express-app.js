import express from "express";
import cors from "cors";
import supertokens from "supertokens-node";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { middleware, errorHandler } from "supertokens-node/framework/express";
import { SuperTokensConfig } from "./config/superTokenConfig.js"
import Multitenancy from "supertokens-node/recipe/multitenancy";
import HandleErrors from "./utils/error-handler.js";
import path from "path";
import { fileURLToPath } from "url";
import { WEBSITE_DOMAIN } from "./config/index.js";
import apiRoutes from "./api/index.js";
import rabbitMQClient from "./infrastructure/messageQueue/fireAndForget/RabbitMQClient.js";

export default async function expressApp(app) {
    // Get current directory using import.meta.url
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // app.use(express.json({ limit: '1mb' }));
    // app.use(express.urlencoded({ extended: true, limit: '1mb' }));
    app.use(express.static(path.join(__dirname, 'public'))); // Use path.join with __dirname



    // Initialize SuperTokens
    supertokens.init(SuperTokensConfig);
    app.use(
        cors({
            origin: WEBSITE_DOMAIN,
            allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
            methods: ["GET", "PUT", "POST", "DELETE"],
            credentials: true,
        })
    );



    apiRoutes(app);
    // This exposes all the APIs from SuperTokens to the client.
    app.use(middleware());

    app.use(errorHandler());

    // Error handling
    app.use(HandleErrors);
}
