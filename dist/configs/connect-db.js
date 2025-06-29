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
            console.log('LOG: Already connected to MongoDB.');
            return;
        }
        const db_connection = yield mongoose_1.default.connect(configs_1.default.mongo_url, {
            connectTimeoutMS: 5000,
            serverSelectionTimeoutMS: 5000,
        });
        if (db_connection) {
            console.log('[LOG] MongoDB connected. VERSION:', db_connection.version);
            console.log('------------------------------------------------------------------------------');
            return;
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('[LOG] MongoDB connection issues.', error);
            return;
        }
    }
});
exports.default = connectDB;
