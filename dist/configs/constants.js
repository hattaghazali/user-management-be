"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONST_MONGO_URL = exports.CONST_MONGO_HOST = exports.CONST_MONGO_DB_NAME = exports.CONST_MONGO_PASSWORD = exports.CONST_MONGO_USER = exports.CONST_API_BASE = exports.CONST_SERVER_PORT = exports.CONST_BRUH = exports.CONST_CLOUDINARY_API_SECRET = exports.CONST_CLOUDINARY_API_KEY = exports.CONST_CLOUDINARY_CLOUD_NAME = exports.CONST_LIMIT_USERS_PER_PAGE = exports.CONST_LIMIT_RECENT_USERS = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Determine the environment
const nodeEnv = process.env.NODE_ENV;
// Set the path to the appropriate .env file based on NODE_ENV
let envPath;
switch (nodeEnv) {
    case 'production':
        envPath = path_1.default.resolve(__dirname, '../../.env');
        break;
    case 'staging':
        envPath = path_1.default.resolve(__dirname, '../../.env.staging');
        break;
    default:
        envPath = path_1.default.resolve(__dirname, '../../.env.development');
}
// Load the .env file
dotenv_1.default.config({ path: envPath });
exports.CONST_LIMIT_RECENT_USERS = 5;
exports.CONST_LIMIT_USERS_PER_PAGE = 5;
exports.CONST_CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
exports.CONST_CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
exports.CONST_CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
exports.CONST_BRUH = process.env.BRUH;
exports.CONST_SERVER_PORT = process.env.SERVER_PORT;
exports.CONST_API_BASE = process.env.API_BASE;
exports.CONST_MONGO_USER = process.env.MONGO_USER;
exports.CONST_MONGO_PASSWORD = process.env.MONGO_PASSWORD;
exports.CONST_MONGO_DB_NAME = process.env.MONGO_DB_NAME;
exports.CONST_MONGO_HOST = process.env.MONGO_HOST;
exports.CONST_MONGO_URL = `mongodb+srv://${exports.CONST_MONGO_USER}:${exports.CONST_MONGO_PASSWORD}@${exports.CONST_MONGO_HOST}/${exports.CONST_MONGO_DB_NAME}?retryWrites=true`;
