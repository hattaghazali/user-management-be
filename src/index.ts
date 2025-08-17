import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './configs/connect-db';
import { CONST_API_BASE, CONST_BRUH, CONST_SERVER_PORT } from './configs/constants';
import { routeNotFound } from './middlewares/mware-notfound';
import corsOptions from './middlewares/mware-cors';
import routeAdmin from './routes/route-admin';
import { MulterError } from 'multer';

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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// START: Routes
app.use('/api/admin', routeAdmin);
app.use(routeNotFound);

// Global error-handling middleware (must be after all routes)
// app.use((err: any, req: Request, res: Response, next: NextFunction) => {
//     // Handle Multer-specific errors and fileFilter errors
//     if (
//         err instanceof MulterError ||
//         err.message === 'Unsupported file format. Only JPG and PNG are allowed.'
//     ) {
//         res.status(400).json({
//             success: false,
//             message: err.message || 'Invalid file upload request.',
//         });
//         return;
//     }

//     // Handle other errors
//     res.status(err.status || 500).json({
//         success: false,
//         message: err.message || 'An unexpected error occurred.',
//     });
//     return;
// });

// START: Server
app.listen(CONST_SERVER_PORT, async () => {
    console.log('------------------------------------------------------------------------------');
    console.log(`[LOG] Server started. URL: ${CONST_API_BASE}:${CONST_SERVER_PORT}`);
    console.log(`[LOG] Using environment. ENV: ${CONST_BRUH}`);
});
