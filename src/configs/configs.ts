import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { IConfig } from "../types/config";

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
dotenv.config();
// console.log(`LOG: Loaded ${envFile} for ${node_env} environment`);

export const BRUH = process.env.BRUH!;
export const SERVER_PORT = process.env.SERVER_PORT!;
// export const NODE_ENV_EXPORT = node_env!;
export const API_BASE = process.env.API_BASE!;
export const MONGO_USER = process.env.MONGO_USER!;
export const MONGO_PASSWORD = process.env.MONGO_PASSWORD!;
export const MONGO_DB_NAME = process.env.MONGO_DB_NAME!;
export const MONGO_HOST = process.env.MONGO_HOST!;
export const MONGO_URL = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DB_NAME}?retryWrites=true&w=majority&appName=cluster-one`;

const configs: IConfig = {
  bruh: BRUH,
  port: SERVER_PORT,
  // env: node_env,
  api_base: API_BASE,
  mongo_url: MONGO_URL,
  mongo_host: MONGO_HOST,
  // isDev: dev,
  // isProd: prod,
};

export default configs;
