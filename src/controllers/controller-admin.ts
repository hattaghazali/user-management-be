import { v2 as cloudinary } from 'cloudinary';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { MulterError } from 'multer';

import { User } from '../models/model-user';
import { IReqUser } from '../types/type-controller';
import connectDB from '../configs/connect-db';
import { EStatus, IUser } from '../types/type-user';
import { CONST_LIMIT_RECENT_USERS, CONST_LIMIT_USERS_PER_PAGE } from '../configs/constants';
import { Picture } from '../models/model-picture';
import { parseDate } from '../utils/util-date';

export interface IAuthRequest extends Request {
    user?: IUser;
}

const adminLogin = async (req: Request<{}, {}, IReqUser>, res: Response) => {
    await connectDB();
    try {
        const { email, password } = req.body;

        const getUser = await User.findOne({ email: email });

        if (!getUser) {
            res.status(400).json({ success: false, message: `User of ${email} does not exist` });
            return;
        }

        const passwordMatch = await bcrypt.compare(password, getUser.password);

        if (!passwordMatch) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
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
    res.status(200).json(req.user);
};

const adminRegisterAUser = async (req: Request<{}, {}, IReqUser>, res: Response) => {
    try {
        const { email, password, name, gender, occupation, state } = req.body;

        const findUser = await User.findOne({ email: email });

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
            email: email,
            password: hashedPassword,
            name: name,
            status: EStatus.Active,
            gender: gender,
            occupation: occupation,
            state: state,
        });

        if (createUser) {
            res.status(200).json({
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

const adminEditAUserInfo = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        const { email, name, gender, occupation, state } = req.body;

        // Validate and update user information
        if (email) user.email = email;
        if (name) user.name = name;
        if (gender) user.gender = gender;
        if (occupation) user.occupation = occupation;
        if (state) user.state = state;

        await user.save();
        res.status(200).json({ message: 'User information updated successfully' });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: `[LOG] Error of adminEditAUserInfo: ${error.message}`,
            });
            return;
        }
    }
};

const adminEditAUserImage = async (req: Request, res: Response) => {
    try {
        const user = req.params.id;

        const getUserDetails = await User.findById(user);

        if (!getUserDetails) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        // If user already has an avatar (and it's not the default), delete it from Cloudinary
        if (
            getUserDetails.avatar &&
            getUserDetails.avatar.public_id !== 'user-pictures/dxoyhanhlve7j818kusy'
        ) {
            await cloudinary.uploader.destroy(getUserDetails.avatar.public_id);
        }

        // Update user's avatar information
        getUserDetails.avatar = {
            public_id: req.file!.filename, // from multer-storage-cloudinary
            img_url: req.file!.path, // from multer-storage-cloudinary
        };

        await getUserDetails.save();

        res.status(200).json({ user: getUserDetails });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: `[LOG] Error of adminEditAUserImage: ${error.message}`,
            });
            return;
        }
    }
};

const adminGetUsers = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const name = req.query.name as string | undefined;
        const gender = req.query.gender as string | undefined;
        const occupation = req.query.occupation as string | undefined;
        const states = req.query.states as string | undefined;
        const status = req.query.status as string | undefined;
        const dateFrom = req.query.dateFrom as string;
        const dateTo = req.query.dateTo as string;

        const VALID_GENDER = [1, 2];
        const VALID_OCCUPATION = [1, 2];
        const VALID_STATES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
        const VALID_STATUS = [1, 2];

        const limit = CONST_LIMIT_USERS_PER_PAGE;
        const skip = (page - 1) * limit;

        let startDate: Date, endDate: Date;
        try {
            startDate = parseDate(dateFrom);
            endDate = parseDate(dateTo);
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Invalid date format, expected DD/MM/YYYY or YYYY-MM-DD',
            });
            return;
        }

        startDate.setDate(startDate.getDate() - 1); // Move to 2024-12-30 for 2024-12-31
        startDate.setUTCHours(16, 0, 0, 0); // 00:00:00.000 UTC+8 = 2024-12-30T16:00:00.000Z
        endDate.setUTCHours(15, 59, 59, 999);

        let newStates: number[] = [];
        if (states) {
            const parsedStates = states.split(',').map(Number);
            newStates = parsedStates;
        }

        let newOccupations: number[] = [];
        if (occupation) {
            const parsedOccupations = occupation.split(',').map(Number);
            newOccupations = parsedOccupations;
        }

        let newGenders: number[] = [];
        if (gender) {
            const parsedGenders = gender.split(',').map(Number);
            newGenders = parsedGenders;
        }

        let newStatuses: number[] = [];
        if (status) {
            const parsedStatuses = status.split(',').map(Number);
            newStatuses = parsedStatuses;
        }

        const query = {
            ...(name && { name: { $regex: name, $options: 'i' } }),
            state: newStates.length > 0 ? { $in: newStates } : { $in: VALID_STATES },
            occupation:
                newOccupations.length > 0 ? { $in: newOccupations } : { $in: VALID_OCCUPATION },
            gender: newGenders.length > 0 ? { $in: newGenders } : { $in: VALID_GENDER },
            status: newStatuses.length > 0 ? { $in: newStatuses } : { $in: VALID_STATUS },
            createdAt: {
                $gte: startDate,
                $lte: endDate,
            },
        };

        const [totalUsersCount, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .select(
                    'name email gender occupation state status createdAt updatedAt avatar.img_url'
                )
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .lean(),
        ]);

        const totalPages = Math.ceil(totalUsersCount / limit);

        if (totalUsersCount && users) {
            res.status(200).json({
                pagination: {
                    currentPage: page,
                    totalPages: totalPages,
                    limit,
                    totalItems: totalUsersCount,
                },
                results: users,
            });
            return;
        }

        res.status(404).json({
            success: false,
            message: 'No users found',
        });
        return;
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
            .select('name email gender occupation state status avatar createdAt updatedAt')
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

    // Parse dates
    let startDate: Date, endDate: Date;
    try {
        startDate = parseDate(date_from);
        endDate = parseDate(date_to);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Invalid date format, expected DD/MM/YYYY or YYYY-MM-DD',
        });
        return;
    }

    // Validate parsed dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        res.status(400).json({ success: false, message: 'Invalid date_from or date_to' });
        return;
    }

    // Adjust startDate to previous day and set UTC+8 times
    startDate.setDate(startDate.getDate() - 1); // Move to 2024-12-30 for 2024-12-31
    startDate.setUTCHours(16, 0, 0, 0); // 00:00:00.000 UTC+8 = 2024-12-30T16:00:00.000Z
    endDate.setUTCHours(15, 59, 59, 999); // 23:59:59.999 UTC+8 = 2024-12-31T15:59:59.999Z

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
            User.countDocuments({ gender: 1, ...dateFilter }),
            User.countDocuments({ gender: 2, ...dateFilter }),
            User.countDocuments({ occupation: 1, ...dateFilter }),
            User.countDocuments({ occupation: 2, ...dateFilter }),
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
                            $sum: { $cond: [{ $eq: ['$gender', 1] }, 1, 0] },
                        },
                        female_user: {
                            $sum: { $cond: [{ $eq: ['$gender', 2] }, 1, 0] },
                        },
                    },
                },
                {
                    $sort: { _id: 1 },
                },
            ]),
            User.find()
                .select('name email occupation state status')
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

const adminUploadUserPicture = async (req: Request, res: Response) => {
    try {
        // Check if a file was provided
        if (!req.file) {
            res.status(400).json({
                success: false,
                message: 'No file uploaded. Ensure the file is sent with key "pictureFile".',
            });
            return;
        }

        if (!req.file.path || !req.file.filename) {
            res.status(400).json({
                success: false,
                message: 'File upload to Cloudinary failed.',
            });
            return;
        }

        const newPicture = await Picture.create({
            public_id: req.file.filename,
            img_url: req.file.path,
        });

        if (newPicture) {
            res.status(201).json({
                success: true,
                message: 'Image uploaded successfully!',
            });
            return;
        }
    } catch (error) {
        if (error instanceof MulterError) {
            res.status(400).json({
                success: false,
                message: error.message || 'Invalid file upload request.',
            });
            return;
        }

        res.status(400).json({
            success: false,
            message: error || 'An error occurred during file upload.',
        });
        return;
    }
};
export {
    adminGetUsers,
    adminLogin,
    adminRegisterAUser,
    adminGetUserDemographics,
    adminGetAUser,
    adminGetInfo,
    adminEditAUserInfo,
    adminEditAUserImage,
    adminUploadUserPicture,
};
