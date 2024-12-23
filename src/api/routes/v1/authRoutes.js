import { verifySession } from "supertokens-node/recipe/session/framework/express";
import Multitenancy from "supertokens-node/recipe/multitenancy";
import express from 'express';


const router = express.Router();


router.get("/",  async (req, res) => {
        console.log("hello");
        try {
            res.status(200).send('<html><body><h1>auth servive is working </h1></body></html>');
        } catch (err) {
            next(err);
        }
    });


    // An example API that requires session verification
router.get("/sessioninfo", verifySession(), async (req, res) => {
        let session = req.session;
        res.send({
            sessionHandle: session.getHandle(),
            userId: session.getUserId(),
            accessTokenPayload: session.getAccessTokenPayload(),
        });
    });

    // This API is used by the frontend to create the tenants dropdown when the app loads.
    // Depending on your UX, you can remove this API.
router.get("/tenants", async (req, res) => {
        let tenants = await Multitenancy.listAllTenants();
        res.send(tenants);
});
    

export default router;  // ESM default export
