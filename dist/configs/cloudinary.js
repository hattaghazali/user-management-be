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
exports.upload = void 0;
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const multer_1 = __importDefault(require("multer"));
const constants_1 = require("./constants");
cloudinary_1.v2.config({
    cloud_name: constants_1.CONST_CLOUDINARY_CLOUD_NAME,
    api_key: constants_1.CONST_CLOUDINARY_API_KEY,
    api_secret: constants_1.CONST_CLOUDINARY_API_SECRET,
});
const allowedFormats = ['jpg', 'png', 'jpeg'];
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: (req, file) => __awaiter(void 0, void 0, void 0, function* () {
        const userID = req.params.id;
        if (!userID) {
            throw new Error('User ID not provided in request params');
        }
        return {
            folder: 'user-pictures',
            allowed_formats: allowedFormats,
            public_id: `user_${userID}_${Date.now()}`, // Unique public_id (e.g., user_507f1f77bcf86cd799439011_1697051234567)
        };
    }),
});
const fileFilter = (req, file, cb) => {
    const mimeType = file.mimetype.toLowerCase();
    if (mimeType === 'image/jpeg' || mimeType === 'image/jpg' || mimeType === 'image/png') {
        cb(null, true);
    }
    else {
        cb(new Error('Unsupported file format. Only JPEG, JPG, and PNG are allowed.'), false);
    }
};
// const fileFilter = (req: any, file: any, cb: any) => {
//     const mimeType = file.mimetype.toLowerCase();
//     if (mimeType === 'image/jpeg' || mimeType === 'image/jpg' || mimeType === 'image/png') {
//         cb(null, true);
//     } else {
//         cb(new Error('Unsupported file format. Only JPEG, JPG, and PNG are allowed.'), false);
//     }
// };
exports.upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 1000 * 1024 }, // 500 KB
    fileFilter: fileFilter,
});
