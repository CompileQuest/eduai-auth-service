import express from "express"
import { AUTH_SERVICE_PORT } from "./config/index.js";
import expressApp from "./express-app.js";
const StartServer = async () => {

    const app = express();
    await expressApp(app);


    app.listen(AUTH_SERVICE_PORT, () => {
        console.log(`auth service listening on port ${AUTH_SERVICE_PORT}`);
    })
        .on('error', (err) => {
            console.log(err);
            process.exit();
        })
}

StartServer();