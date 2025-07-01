import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/model-user';
import { IUser } from '../types/type-user';

export interface IAuthRequest extends Request {
    user?: IUser;
}

const verifyToken = async (req: IAuthRequest, res: Response, next: NextFunction) => {
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

        const verify = jwt.verify(accessToken, 'SECRET') as { _id: string };
        if (!verify) {
            res.status(401).json({
                success: false,
                message: '[LOG] Token error, wrong token',
            });
            return;
        }

        // const user = await User.findById({ _id: verify.user?._id });
        const user = await User.findById({ _id: verify._id }).select('-u_password');
        if (!user) {
            res.status(401).json({
                success: false,
                message: '[LOG] Token error, could not found _id',
            });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                message: `ERROR OF Verify Token: ${error.message}`,
            });
            return;
        }
    }
};
export default verifyToken;
