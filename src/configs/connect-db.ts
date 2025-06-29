import mongoose from 'mongoose';
import configs from './configs';

const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            console.log('LOG: Already connected to MongoDB.');
            return;
        }

        const db_connection = await mongoose.connect(configs.mongo_url, {
            connectTimeoutMS: 5000,
            serverSelectionTimeoutMS: 5000,
        });
        if (db_connection) {
            console.log('[LOG] MongoDB connected. VERSION:', db_connection.version);
            console.log(
                '------------------------------------------------------------------------------'
            );
            return;
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error('[LOG] MongoDB connection issues.', error);
            return;
        }
    }
};

export default connectDB;
