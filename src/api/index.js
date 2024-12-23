import authRoutes from './routes/v1/authRoutes.js';
import appEvent from './routes/v1/app-events.js'

export default (app) => {
    app.use('/api/v1/auth', authRoutes); // Register version 1 routes
    app.use('/api/v1/auth', appEvent);
};
