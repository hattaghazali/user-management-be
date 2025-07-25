import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from '../models/model-user';
import { IReqUser } from '../types/type-controller';
import connectDB from '../configs/connect-db';
import { IUser } from '../types/type-user';

export interface IAuthRequest extends Request {
    user?: IUser;
}

const adminLogin = async (req: Request<{}, {}, IReqUser>, res: Response) => {
    await connectDB();
    try {
        const { email, password } = req.body;

        const getUser = await User.findOne({ u_email: email });

        if (!getUser) {
            res.status(400).json({
                success: true,
                message: `User of ${email} does not exist`,
            });
            return;
        }

        const passwordMatch = await bcrypt.compare(password, getUser.u_password);

        if (!passwordMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const accessToken = jwt.sign({ _id: getUser._id }, 'SECRET', {
            expiresIn: '1d',
        });

        if (accessToken) {
            res.status(200).json({ accessToken });
            return;
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: `[LOG] Error of adminLogin: ${error.message}`,
            });
            return;
        }
    }
};

const adminGetInfo = async (req: IAuthRequest, res: Response) => {
    if (!req.user) {
        res.status(401).json({ success: false, message: 'User not found' });
        return;
    }
    res.json(req.user);
};

const adminRegisterAUser = async (req: Request<{}, {}, IReqUser>, res: Response) => {
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
                message: `[LOG] Error of admin registering a user: ${error.message}`,
            });
            return;
        }
    }
};

const adminGetUsers = async (req: Request, res: Response) => {
    try {
        const VALID_STATES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        const page = parseInt(req.query.page as string) || 1;
        const name = req.query.name || '';
        // const states = req.query.state ? parseInt(req.query.state as string) : undefined;
        const states = req.query.states as string;

        let statesToQuery: number[] = [];
        if (states) {
            const statesArray = states.split(',').map(Number);
            statesToQuery = statesArray;
        }

        // const limit = parseInt(req.query.limit as string) || 5;
        const limit = 10;
        const skip = (page - 1) * limit;

        const findQuery = {
            ...(name && { u_name: { $regex: name, $options: 'i' } }),
            u_state: states !== undefined ? { $in: statesToQuery } : { $in: VALID_STATES },
        };

        const [totalUsersCount, users] = await Promise.all([
            User.countDocuments(findQuery),
            User.find(findQuery)
                .select('u_name u_email u_occupation u_state u_status')
                .skip(skip)
                .limit(limit)
                .lean(), // Convert to plain JavaScript objects for better performance
        ]);

        const totalPages = Math.ceil(totalUsersCount / limit);

        if (totalUsersCount && users) {
            res.status(200).json({
                success: true,
                pagination: {
                    current_page: page,
                    total_page: totalPages,
                    limit,
                    total_users: totalUsersCount,
                },
                users: users,
            });
            return;
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: `[LOG] Error of getListOfUsers: ${error.message}`,
            });
            return;
        }
    }
};

const adminGetAUser = async (req: Request, res: Response) => {
    try {
        const userID = req.params.id;
        console.log(userID);

        const getUserDetails = await User.findById(userID)
            .select('u_name u_email u_gender u_occupation u_state u_status createdAt updatedAt')
            .lean();
        if (getUserDetails) {
            res.status(200).json(getUserDetails);
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: `[LOG] Error of adminGetAUser: ${error.message}`,
            });
            return;
        }
    }
};

const adminGetUserDemographics = async (req: Request, res: Response) => {
    const localDateStartOfDay = new Date(2024, 11, 31, 0, 0, 0, 0);
    const localDateEndOfDay = new Date(2024, 11, 31, 23, 59, 59, 999);
    const isoStartOfDay = localDateStartOfDay.toISOString();
    const isoEndOfDay = localDateEndOfDay.toISOString();

    const { date_from, date_to } = req.query;
    const dateFilter = {
        createdAt: {
            $gte: date_from || isoStartOfDay,
            $lte: date_to || isoEndOfDay,
        },
    };

    try {
        const [
            totalUsers,
            totalMales,
            totalFemales,
            totalOccupationStudent,
            totalOccupationEmploy,
        ] = await Promise.all([
            User.countDocuments(dateFilter),
            User.countDocuments({
                u_gender: 1,
                ...dateFilter,
            }),
            User.countDocuments({
                u_gender: 2,
                ...dateFilter,
            }),
            User.countDocuments({
                u_occupation: 1,
                ...dateFilter,
            }),
            User.countDocuments({
                u_occupation: 2,
                ...dateFilter,
            }),
        ]);
        res.status(200).json({
            success: true,
            total_users: totalUsers,
            total_male: totalMales,
            total_female: totalFemales,
            total_occupation_student: totalOccupationStudent,
            total_occupation_employ: totalOccupationEmploy,
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: `[LOG] Error of adminGetUserDemographics: ${error.message}`,
            });
            return;
        }
    }
};

export {
    adminGetUsers,
    adminLogin,
    adminRegisterAUser,
    adminGetUserDemographics,
    adminGetAUser,
    adminGetInfo,
};
