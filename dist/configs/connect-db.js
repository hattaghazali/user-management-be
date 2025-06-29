"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const configs_1 = __importDefault(require("./configs"));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (mongoose_1.default.connection.readyState === 1) {
            console.log('[LOG] Already connected to MongoDB.');
            return;
        }
        if (mongoose_1.default.connection.readyState === 2) {
            console.log('[LOG] Connection in progress, waiting...');
            yield mongoose_1.default.connection.asPromise();
            return mongoose_1.default.connection;
        }
        const db_connection = yield mongoose_1.default.connect(configs_1.default.mongo_url, {
            connectTimeoutMS: 10000,
            serverSelectionTimeoutMS: 10000,
        });
        console.log('[LOG] MongoDB connected. VERSION:', mongoose_1.default.version);
        console.log('------------------------------------------------------------------------------');
        return db_connection;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('[LOG] MongoDB connection issues.', error);
            return;
        }
    }
});
exports.default = connectDB;
