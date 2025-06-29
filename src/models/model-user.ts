import mongoose, { Schema } from 'mongoose';
import { EGender, EOccupation, EState, EStatus, IUser } from '../types/type-user';

const user_schema = new Schema<IUser>(
    {
        u_email: { type: String, required: true },
        u_password: { type: String, required: true },
        u_name: { type: String },
        u_gender: { type: Number, enum: EGender },
        u_occupation: { type: Number, enum: EOccupation },
        u_state: { type: Number, enum: EState },
        u_status: { type: Number, enum: EStatus },
    },
    { timestamps: true }
);

export const tbl_users = mongoose.model<IUser>('tbl_users', user_schema);
