import dotenv from 'dotenv';
import path from 'path';

// Determine the environment
const nodeEnv = process.env.NODE_ENV;

// Set the path to the appropriate .env file based on NODE_ENV
let envPath;
switch (nodeEnv) {
    case 'production':
        envPath = path.resolve(__dirname, '../../.env');
        break;
    case 'staging':
        envPath = path.resolve(__dirname, '../../.env.staging');
        break;
    default:
        envPath = path.resolve(__dirname, '../../.env.development');
}

// Load the .env file
dotenv.config({ path: envPath });

export const CONST_LIMIT_RECENT_USERS = 5 as number;
export const CONST_LIMIT_USERS_PER_PAGE = 5 as number;

export const CONST_CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME!;
export const CONST_CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY!;
export const CONST_CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET!;
export const CONST_BRUH = process.env.BRUH!;
export const CONST_SERVER_PORT = process.env.SERVER_PORT!;
export const CONST_API_BASE = process.env.API_BASE!;
export const CONST_MONGO_USER = process.env.MONGO_USER!;
export const CONST_MONGO_PASSWORD = process.env.MONGO_PASSWORD!;
export const CONST_MONGO_DB_NAME = process.env.MONGO_DB_NAME!;
export const CONST_MONGO_HOST = process.env.MONGO_HOST!;
export const CONST_MONGO_URL = `mongodb+srv://${CONST_MONGO_USER}:${CONST_MONGO_PASSWORD}@${CONST_MONGO_HOST}/${CONST_MONGO_DB_NAME}?retryWrites=true`;
