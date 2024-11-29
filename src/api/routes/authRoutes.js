import { verifySession } from "supertokens-node/recipe/session/framework/express";
import Multitenancy from "supertokens-node/recipe/multitenancy";

// Todo:
export default (app) => {

    // An example API that requires session verification
    app.get("/sessioninfo", verifySession(), async (req, res) => {
        let session = req.session;
        res.send({
            sessionHandle: session.getHandle(),
            userId: session.getUserId(),
            accessTokenPayload: session.getAccessTokenPayload(),
        });
    });

    // This API is used by the frontend to create the tenants dropdown when the app loads.
    // Depending on your UX, you can remove this API.
    app.get("/tenants", async (req, res) => {
        let tenants = await Multitenancy.listAllTenants();
        res.send(tenants);
    });
};
