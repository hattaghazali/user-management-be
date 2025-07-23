import mongoose from 'mongoose';
import { CONST_MONGO_URL } from './constants';

const connectDB = async () => {
    try {
        // if (mongoose.connection.readyState === 1) {
        //     console.log('[LOG] Already connected to MongoDB.');
        //     return;
        // }

        // if (mongoose.connection.readyState === 2) {
        //     console.log('[LOG] Connection in progress, waiting...');
        //     await mongoose.connection.asPromise();
        //     return mongoose.connection;
        // }

        const db_connection = await mongoose.connect(CONST_MONGO_URL, {
            connectTimeoutMS: 10000,
            serverSelectionTimeoutMS: 10000,
        });

        console.log('[LOG] MongoDB connected. VERSION:', mongoose.version);
        console.log(
            '------------------------------------------------------------------------------'
        );
        return db_connection;
    } catch (error) {
        if (error instanceof Error) {
            console.error('[LOG] MongoDB connection issues.', error);
            return;
        }
    }
};

export default connectDB;
