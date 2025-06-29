import express, { Application } from 'express';
import connectDB from './configs/connect-db';
import configs from './configs/configs';
import route_admin from './routes/route-admin';
import { routeNotFound } from './middlewares/mware-notfound';

const app: Application = express();

// START: MongoDB
connectDB();

// START: Middleware
app.use(express.json());

// START: Routes
app.use('/api/admin', route_admin);
app.use(routeNotFound);

// START: Server
app.listen(configs.port, async () => {
    console.log('------------------------------------------------------------------------------');
    console.log(`[LOG] Server started. URL: ${configs.api_base}:${configs.port}`);
    console.log(`[LOG] Using environment. ENV: ${configs.bruh}`);
});
