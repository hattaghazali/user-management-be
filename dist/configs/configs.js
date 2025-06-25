"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MONGO_URL = exports.MONGO_HOST = exports.MONGO_DB_NAME = exports.MONGO_PASSWORD = exports.MONGO_USER = exports.API_BASE = exports.SERVER_PORT = exports.BRUH = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
// const node_env = process.env.NODE_ENV!;
// const dev = node_env === "development";
// const prod = node_env === "production";
// Resolve path to .env file
// const envFile = `.env.${node_env}`;
// const envPath = path.resolve(__dirname, `../../${envFile}`);
// Check if .env file exists
// if (!fs.existsSync(envPath)) {
//   throw new Error(`Environment file not found: ${envPath}`);
// }
// Load .env file
dotenv_1.default.config();
// console.log(`LOG: Loaded ${envFile} for ${node_env} environment`);
exports.BRUH = process.env.BRUH;
exports.SERVER_PORT = process.env.SERVER_PORT;
// export const NODE_ENV_EXPORT = node_env!;
exports.API_BASE = process.env.API_BASE;
exports.MONGO_USER = process.env.MONGO_USER;
exports.MONGO_PASSWORD = process.env.MONGO_PASSWORD;
exports.MONGO_DB_NAME = process.env.MONGO_DB_NAME;
exports.MONGO_HOST = process.env.MONGO_HOST;
exports.MONGO_URL = `mongodb+srv://${exports.MONGO_USER}:${exports.MONGO_PASSWORD}@${exports.MONGO_HOST}/${exports.MONGO_DB_NAME}?retryWrites=true&w=majority&appName=cluster-one`;
const configs = {
    bruh: exports.BRUH,
    port: exports.SERVER_PORT,
    // env: node_env,
    api_base: exports.API_BASE,
    mongo_url: exports.MONGO_URL,
    mongo_host: exports.MONGO_HOST,
    // isDev: dev,
    // isProd: prod,
};
exports.default = configs;
