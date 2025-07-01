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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const model_user_1 = require("../models/model-user");
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                message: 'Invalid or missing Authorization header',
            });
            return;
        }
        const accessToken = authHeader.replace('Bearer ', '');
        if (!accessToken) {
            res.status(401).json({
                success: false,
                message: 'No accessToken provided',
            });
            console.log(`No accessToken provided`);
            return;
        }
        const verify = jsonwebtoken_1.default.verify(accessToken, 'SECRET');
        if (!verify) {
            res.status(401).json({
                success: false,
                message: '[LOG] Token error, wrong token',
            });
            return;
        }
        // const user = await User.findById({ _id: verify.user?._id });
        const user = yield model_user_1.User.findById({ _id: verify._id }).select('-u_password');
        if (!user) {
            res.status(401).json({
                success: false,
                message: '[LOG] Token error, could not found _id',
            });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                message: `ERROR OF Verify Token: ${error.message}`,
            });
            return;
        }
    }
});
exports.default = verifyToken;
