import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer, { FileFilterCallback } from 'multer';
import {
    CONST_CLOUDINARY_API_KEY,
    CONST_CLOUDINARY_API_SECRET,
    CONST_CLOUDINARY_CLOUD_NAME,
} from './constants';
import { Request } from 'express';

interface ICustomCloudinaryParams {
    folder?: string;
    allowed_formats?: string[];
    public_id: string;
}

cloudinary.config({
    cloud_name: CONST_CLOUDINARY_CLOUD_NAME,
    api_key: CONST_CLOUDINARY_API_KEY,
    api_secret: CONST_CLOUDINARY_API_SECRET,
});

const allowedFormats = ['jpg', 'png', 'jpeg'];

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req: Request, file: Express.Multer.File): Promise<ICustomCloudinaryParams> => {
        const userID = req.params.id;
        if (!userID) {
            throw new Error('User ID not provided in request params');
        }
        return {
            folder: 'user-pictures',
            allowed_formats: allowedFormats,
            public_id: `user_${userID}_${Date.now()}`, // Unique public_id (e.g., user_507f1f77bcf86cd799439011_1697051234567)
        };
    },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const mimeType = file.mimetype.toLowerCase();
    if (mimeType === 'image/jpeg' || mimeType === 'image/jpg' || mimeType === 'image/png') {
        cb(null, true);
    } else {
        cb(
            new Error('Unsupported file format. Only JPEG, JPG, and PNG are allowed.') as any,
            false
        );
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

export const upload = multer({
    storage: storage,
    limits: { fileSize: 500 * 1024 }, // 500 KB
    fileFilter: fileFilter,
});
