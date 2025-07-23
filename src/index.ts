import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import connectDB from './configs/connect-db';
import { CONST_API_BASE, CONST_BRUH, CONST_SERVER_PORT } from './configs/constants';
import { routeNotFound } from './middlewares/mware-notfound';
import corsOptions from './middlewares/mware-cors';
import routeAdmin from './routes/route-admin';

const app: Application = express();

// START: MongoDB
connectDB();

// START: Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[API CALL] ${req.method} ${req.originalUrl} at ${new Date().toISOString()}`);
    next();
});
app.use(cors(corsOptions));
app.use(express.json());

// START: Routes
app.use('/api/admin', routeAdmin);
app.use(routeNotFound);

// START: Server
app.listen(CONST_SERVER_PORT, async () => {
    console.log('------------------------------------------------------------------------------');
    console.log(`[LOG] Server started. URL: ${CONST_API_BASE}:${CONST_SERVER_PORT}`);
    console.log(`[LOG] Using environment. ENV: ${CONST_BRUH}`);
});
