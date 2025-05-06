
import express from 'express';

const router = express.Router();


// exposing a webhook for other serivces 
router.use('/app-events', async (req, res, next) => {
    try {
        const { payload } = req.body;
        const result = await service.SubscribeEvents(payload);
        console.log("========= User Service received Event =========");
        res.status(200).json(result);
    } catch (error) {
        console.log("did i came here ");
        next(err);
    }
})





export default router;  // ESM default export
