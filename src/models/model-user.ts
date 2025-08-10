import mongoose, { Schema } from 'mongoose';
import { EGender, EOccupation, EState, EStatus, IUser } from '../types/type-user';

const userSchema = new Schema<IUser>(
    {
        email: { type: String, required: true },
        password: { type: String, required: true },
        name: { type: String },
        gender: { type: Number, enum: EGender },
        occupation: { type: Number, enum: EOccupation },
        state: { type: Number, enum: EState },
        status: { type: Number, enum: EStatus },
        avatar: {
            public_id: {
                type: String,
                required: true,
                default: 'user-pictures/dxoyhanhlve7j818kusy',
            },
            img_url: {
                type: String,
                required: true,
                default:
                    'https://res.cloudinary.com/hattacloudinary/image/upload/v1754327277/user-pictures/dxoyhanhlve7j818kusy.jpg',
            },
        },
    },
    { timestamps: true, collection: 'User' }
);

export const User = mongoose.model<IUser>('User', userSchema);
