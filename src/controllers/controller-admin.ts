import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/model-user';
import { IReqUser } from '../types/type-controller';

const adminLogin = async (req: Request<{}, {}, IReqUser>, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        const findUser = await User.findOne({ u_email: email });

        if (!findUser) {
            res.status(400).json({
                success: true,
                message: `User of ${email} does not exist`,
            });
            return;
        }

        const passwordMatch = await bcrypt.compare(password, findUser.u_password);

        if (!passwordMatch) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const accessToken = jwt.sign({ _id: findUser._id }, 'SECRET', { expiresIn: '15m' });
        const refreshToken = jwt.sign({ _id: findUser._id }, 'SECRET', { expiresIn: '180d' });

        if (accessToken && refreshToken) {
            res.status(200).json({ accessToken, refreshToken });
            return;
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: `Error of adminLogin: ${error.message}`,
            });
            return;
        }
    }
};

const adminRegisterUser = async (req: Request<{}, {}, IReqUser>, res: Response) => {
    try {
        const { email, password, name, status, gender, occupation, state } = req.body;

        const findUser = await User.findOne({ u_email: email });

        if (findUser) {
            res.status(400).json({
                success: false,
                message: `Email of ${email} already exists`,
            });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const createUser = await User.create({
            u_email: email,
            u_password: hashedPassword,
            u_name: name,
            u_status: status,
            u_gender: gender,
            u_occupation: occupation,
            u_state: state,
        });

        if (createUser) {
            res.status(200).json({
                success: true,
                message: `Successfully created a user!`,
            });
            return;
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: `Error of admin registering a user: ${error.message}`,
            });
            return;
        }
    }
};

const adminGetUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({});
        if (users) {
            res.status(200).json(users);
            return;
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: `Error of getListOfUsers: ${error.message}`,
            });
            return;
        }
    }
};

export { adminGetUsers, adminLogin, adminRegisterUser };
