import { verifySession } from "supertokens-node/recipe/session/framework/express";
import Multitenancy from "supertokens-node/recipe/multitenancy";
import express from 'express';
import { getUsersNewestFirst } from "supertokens-node";
import { deleteUser } from "supertokens-node";
import AuthService from "../../../services/auth-service.js";

const router = express.Router();
const authService = new AuthService();

router.get("/", async (req, res, next) => {
    try {
        const service = new AuthService();
        const payload = {
            email: "mohasdfamasasfdeasd@gmail.com",
            userId: "22asfasdfasfd=aass23nlf=23nlf23",
            username: "aliasdfaasfsas",
            role: "student",
            emailVerified: true,
            userTimeJoined: new Date("2024-03-07T12:34:56.789Z"), // Ensuring it's a Date object
        };
        const response = await service.createUserInUserService(payload)

        res.status(200).send(response);
    } catch (err) {
        console.log('hellllllllo')
        console.log(err);
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



router.get("/deleteAllUsers", async (req, res) => {
    let allUsers = [];
    let nextPaginationToken = null;
    do {
        let usersResponse;
        try {
            usersResponse = await getUsersNewestFirst({
                tenantId: "public",
                limit: 200,
                ...(nextPaginationToken && { paginationToken: nextPaginationToken }) // Only add if it exists
            });
        } catch (error) {
            console.error("Error fetching users:", error);
            break; // Stop loop if there's an error
        }

        allUsers = allUsers.concat(usersResponse.users);
        nextPaginationToken = usersResponse.nextPaginationToken; // Update the token

    } while (nextPaginationToken); // Keep going until no token is provided

    // Step 2: Delete each user
    let deletedCount = 0;
    for (const user of allUsers) {
        try {
            await deleteUser(user.id);
            deletedCount++;
            console.log(`Deleted user ${deletedCount} with ID: ${user.id}`);
        } catch (error) {
            console.error(`Failed to delete user with ID: ${user.id}`, error);
        }
    }

    res.json({
        message: `Deleted ${deletedCount} users successfully`,
        totalUsers: allUsers.length,
    });
});



router.delete("/deleteUser/:userId", async (req, res, next) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        const deletedUser = await authService.deleteUserById(userId);
        console.log(`Deleted user with ID: ${userId}`);
        console.log("User deleted successfully", deletedUser);
        return res.status(200).json(deletedUser);
    } catch (error) {
        console.log(`Error deleting user with ID: ${userId}`, error);
        console.error(`Failed to delete user with ID: ${userId}`, error);
        next(error);
    }
});



export default router;  // ESM default export
