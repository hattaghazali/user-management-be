import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from '../models/model-user';
import { IReqUser } from '../types/type-controller';
import connectDB from '../configs/connect-db';
import { EStatus, IUser } from '../types/type-user';
import { CONST_LIMIT_RECENT_USERS } from '../configs/constants';

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
        const { email, password, name, gender, occupation, state } = req.body;

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
            u_status: EStatus.Active,
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
    const { date_from, date_to } = req.query;

    // Validate query parameters
    if (typeof date_from !== 'string' || typeof date_to !== 'string') {
        res.status(400).json({ error: 'Invalid date_from or date_to format' });
        return;
    }

    // Parse date in either DD/MM/YYYY or YYYY-MM-DD format
    const parseDate = (dateStr: string): Date => {
        if (dateStr.includes('/')) {
            // Handle DD/MM/YYYY
            const [day, month, year] = dateStr.split('/').map(Number);
            return new Date(year, month - 1, day); // Months are 0-based
        } else if (dateStr.includes('-')) {
            // Handle YYYY-MM-DD
            return new Date(dateStr);
        }
        throw new Error('Invalid date format');
    };

    // Parse dates
    let startDate: Date, endDate: Date;
    try {
        startDate = parseDate(date_from);
        endDate = parseDate(date_to);
    } catch (error) {
        res.status(400).json({ error: 'Invalid date format, expected DD/MM/YYYY or YYYY-MM-DD' });
        return;
    }

    // Validate parsed dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        res.status(400).json({ error: 'Invalid date_from or date_to' });
        return;
    }

    // Adjust startDate to previous day and set UTC+8 times
    startDate.setDate(startDate.getDate() - 1); // Move to 2024-12-30 for 2024-12-31
    startDate.setUTCHours(16, 0, 0, 0); // 00:00:00.000 UTC+8 = 2024-12-30T16:00:00.000Z
    endDate.setUTCHours(15, 59, 59, 999); // 23:59:59.999 UTC+8 = 2024-12-31T15:59:59.999Z
    console.log('start date', startDate.toISOString()); // Should log 2024-12-30T16:00:00.000Z
    console.log('end date', endDate.toISOString()); // Should log 2024-12-31T15:59:59.999Z

    const dateFilter = {
        createdAt: {
            $gte: startDate,
            $lte: endDate,
        },
    };

    try {
        const [
            totalUsers,
            totalMales,
            totalFemales,
            totalOccupationStudent,
            totalOccupationEmploy,
            monthlyGenderData,
            latestTenUsersCreated,
        ] = await Promise.all([
            User.countDocuments(dateFilter),
            User.countDocuments({ u_gender: 1, ...dateFilter }),
            User.countDocuments({ u_gender: 2, ...dateFilter }),
            User.countDocuments({ u_occupation: 1, ...dateFilter }),
            User.countDocuments({ u_occupation: 2, ...dateFilter }),
            User.aggregate([
                {
                    $match: dateFilter,
                },
                {
                    $group: {
                        _id: {
                            $month: {
                                date: '$createdAt',
                                timezone: 'Asia/Singapore', // Use UTC+8 for month grouping
                            },
                        },
                        male_user: {
                            $sum: { $cond: [{ $eq: ['$u_gender', 1] }, 1, 0] },
                        },
                        female_user: {
                            $sum: { $cond: [{ $eq: ['$u_gender', 2] }, 1, 0] },
                        },
                    },
                },
                {
                    $sort: { _id: 1 },
                },
            ]),
            User.find()
                .select('u_name u_email u_occupation u_state u_status')
                .sort({ createdAt: -1 })
                .limit(CONST_LIMIT_RECENT_USERS)
                .exec(),
        ]);

        const monthNames = [
            'jan',
            'feb',
            'mar',
            'apr',
            'may',
            'jun',
            'jul',
            'aug',
            'sep',
            'oct',
            'nov',
            'dec',
        ];
        const graph = monthNames.map((month, index) => {
            const monthData = monthlyGenderData.find((data) => data._id === index + 1);
            return {
                month,
                male_user: monthData ? monthData.male_user : 0,
                female_user: monthData ? monthData.female_user : 0,
            };
        });

        res.status(200).json({
            success: true,
            total_users: totalUsers,
            total_male: totalMales,
            total_female: totalFemales,
            total_occupation_student: totalOccupationStudent,
            total_occupation_employ: totalOccupationEmploy,
            graph,
            recent_users: latestTenUsersCreated,
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: `[LOG] Error of adminGetUserDemographics: ${error.message}`,
            });
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
