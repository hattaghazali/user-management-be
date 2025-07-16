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
exports.adminGetInfo = exports.adminGetAUser = exports.adminGetUserDemographics = exports.adminRegisterAUser = exports.adminLogin = exports.adminGetUsers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const model_user_1 = require("../models/model-user");
const connect_db_1 = __importDefault(require("../configs/connect-db"));
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, connect_db_1.default)();
    try {
        const { email, password } = req.body;
        const getUser = yield model_user_1.User.findOne({ u_email: email });
        if (!getUser) {
            res.status(400).json({
                success: true,
                message: `User of ${email} does not exist`,
            });
            return;
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, getUser.u_password);
        if (!passwordMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const accessToken = jsonwebtoken_1.default.sign({ _id: getUser._id }, 'SECRET', {
            expiresIn: '1d',
        });
        if (accessToken) {
            res.status(200).json({ accessToken });
            return;
        }
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: `[LOG] Error of adminLogin: ${error.message}`,
            });
            return;
        }
    }
});
exports.adminLogin = adminLogin;
const adminGetInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.status(401).json({ success: false, message: 'User not found' });
        return;
    }
    res.json(req.user);
});
exports.adminGetInfo = adminGetInfo;
const adminRegisterAUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name, status, gender, occupation, state } = req.body;
        const findUser = yield model_user_1.User.findOne({ u_email: email });
        if (findUser) {
            res.status(400).json({
                success: false,
                message: `Email of ${email} already exists`,
            });
            return;
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const createUser = yield model_user_1.User.create({
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
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: `[LOG] Error of admin registering a user: ${error.message}`,
            });
            return;
        }
    }
});
exports.adminRegisterAUser = adminRegisterAUser;
const adminGetUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const VALID_STATES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        const page = parseInt(req.query.page) || 1;
        const name = req.query.name || '';
        // const states = req.query.state ? parseInt(req.query.state as string) : undefined;
        const states = req.query.states;
        let statesToQuery = [];
        if (states) {
            const statesArray = states.split(',').map(Number);
            statesToQuery = statesArray;
        }
        // const limit = parseInt(req.query.limit as string) || 5;
        const limit = 10;
        const skip = (page - 1) * limit;
        const findQuery = Object.assign(Object.assign({}, (name && { u_name: { $regex: name, $options: 'i' } })), { u_state: states !== undefined ? { $in: statesToQuery } : { $in: VALID_STATES } });
        const [totalUsersCount, users] = yield Promise.all([
            model_user_1.User.countDocuments(findQuery),
            model_user_1.User.find(findQuery)
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
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: `[LOG] Error of getListOfUsers: ${error.message}`,
            });
            return;
        }
    }
});
exports.adminGetUsers = adminGetUsers;
const adminGetAUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userID = req.params.id;
        const getUserDetails = yield model_user_1.User.findById(userID)
            .select('u_name u_email u_gender u_occupation u_state u_status createdAt updatedAt')
            .lean();
        if (getUserDetails) {
            res.status(200).json(getUserDetails);
        }
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: `[LOG] Error of adminGetAUser: ${error.message}`,
            });
            return;
        }
    }
});
exports.adminGetAUser = adminGetAUser;
const adminGetUserDemographics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const localDateStartOfDay = new Date(2024, 11, 31, 0, 0, 0, 0);
    const localDateEndOfDay = new Date(2024, 11, 31, 23, 59, 59, 999);
    const isoStartOfDay = localDateStartOfDay.toISOString();
    const isoEndOfDay = localDateEndOfDay.toISOString();
    const { date_from, date_to } = req.query;
    // Parse date_from as a Date object (sets time to 00:00:00.000)
    const startDate = new Date(date_from);
    startDate.setHours(0, 0, 0, 0);
    // Parse date_to and set time to 15:59:59.999
    const endDate = new Date(date_to);
    endDate.setHours(23, 59, 59, 999);
    const dateFilter = {
        createdAt: {
            $gte: startDate || isoStartOfDay,
            $lte: endDate || isoEndOfDay,
        },
    };
    try {
        // Aggregate counts for total users, males, females, occupations, and monthly gender data
        const [totalUsers, totalMales, totalFemales, totalOccupationStudent, totalOccupationEmploy, monthlyGenderData,] = yield Promise.all([
            model_user_1.User.countDocuments(dateFilter),
            model_user_1.User.countDocuments(Object.assign({ u_gender: 1 }, dateFilter)),
            model_user_1.User.countDocuments(Object.assign({ u_gender: 2 }, dateFilter)),
            model_user_1.User.countDocuments(Object.assign({ u_occupation: 1 }, dateFilter)),
            model_user_1.User.countDocuments(Object.assign({ u_occupation: 2 }, dateFilter)),
            // Aggregate male and female counts by month within the specified date range
            model_user_1.User.aggregate([
                {
                    $match: dateFilter,
                },
                {
                    $group: {
                        _id: {
                            $month: {
                                date: '$createdAt',
                                timezone: 'UTC', // Explicitly set to UTC to avoid server timezone issues
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
        ]);
        // Create array of all months (1-12) with default values
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
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: `[LOG] Error of adminGetUserDemographics: ${error.message}`,
            });
            return;
        }
    }
});
exports.adminGetUserDemographics = adminGetUserDemographics;
