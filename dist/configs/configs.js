"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MONGO_URL = exports.MONGO_HOST = exports.MONGO_DB_NAME = exports.MONGO_PASSWORD = exports.MONGO_USER = exports.API_BASE = exports.SERVER_PORT = exports.BRUH = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Determine the environment
const nodeEnv = process.env.NODE_ENV;
// Set the path to the appropriate .env file based on NODE_ENV
let envPath;
switch (nodeEnv) {
    case 'production':
        envPath =
            path_1.default.resolve(__dirname, '../../.env.production') ||
                path_1.default.resolve(__dirname, '../../.env');
        if (!fs_1.default.existsSync(envPath)) {
            console.error(`.env.production not found at ${envPath}`);
            process.exit(1);
        }
        break;
    case 'staging':
        envPath = path_1.default.resolve(__dirname, '../../.env.staging');
        break;
    default:
        envPath = path_1.default.resolve(__dirname, '../../.env.development');
}
// Load the .env file
dotenv_1.default.config({ path: envPath });
exports.BRUH = process.env.BRUH;
exports.SERVER_PORT = process.env.SERVER_PORT;
exports.API_BASE = process.env.API_BASE;
exports.MONGO_USER = process.env.MONGO_USER;
exports.MONGO_PASSWORD = process.env.MONGO_PASSWORD;
exports.MONGO_DB_NAME = process.env.MONGO_DB_NAME;
exports.MONGO_HOST = process.env.MONGO_HOST;
exports.MONGO_URL = `mongodb+srv://${exports.MONGO_USER}:${exports.MONGO_PASSWORD}@${exports.MONGO_HOST}/${exports.MONGO_DB_NAME}`;
const configs = {
    bruh: exports.BRUH,
    port: exports.SERVER_PORT,
    api_base: exports.API_BASE,
    mongo_url: exports.MONGO_URL,
    mongo_host: exports.MONGO_HOST,
};
exports.default = configs;
