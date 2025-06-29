import dotenv from 'dotenv';
import path from 'path';
import { IConfig } from '../types/type-config';

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

export const BRUH = process.env.BRUH!;
export const SERVER_PORT = process.env.SERVER_PORT!;
export const API_BASE = process.env.API_BASE!;
export const MONGO_USER = process.env.MONGO_USER!;
export const MONGO_PASSWORD = process.env.MONGO_PASSWORD!;
export const MONGO_DB_NAME = process.env.MONGO_DB_NAME!;
export const MONGO_HOST = process.env.MONGO_HOST!;
export const MONGO_URL = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DB_NAME}?retryWrites=true`;

const configs: IConfig = {
    bruh: BRUH,
    port: SERVER_PORT,
    api_base: API_BASE,
    mongo_url: MONGO_URL,
    mongo_host: MONGO_HOST,
};

export default configs;
