
import express from 'express';

const router = express.Router();

  
    // exposing a webhook for other serivces 
router.use('/app-events', async (req, res, next) => {
        const { payload } = req.body;
        const result = await service.SubscribeEvents(payload);
        console.log("========= User Service received Event =========");
        res.status(200).json(result);
})
    


export default router;  // ESM default export
