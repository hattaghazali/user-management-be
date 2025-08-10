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
exports.adminUploadUserPicture = exports.adminEditAUserImage = exports.adminEditAUserInfo = exports.adminGetInfo = exports.adminGetAUser = exports.adminGetUserDemographics = exports.adminRegisterAUser = exports.adminLogin = exports.adminGetUsers = void 0;
const cloudinary_1 = require("cloudinary");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const multer_1 = require("multer");
const model_user_1 = require("../models/model-user");
const connect_db_1 = __importDefault(require("../configs/connect-db"));
const type_user_1 = require("../types/type-user");
const constants_1 = require("../configs/constants");
const model_picture_1 = require("../models/model-picture");
const util_date_1 = require("../utils/util-date");
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, connect_db_1.default)();
    try {
        const { email, password } = req.body;
        const getUser = yield model_user_1.User.findOne({ email: email });
        if (!getUser) {
            res.status(400).json({ success: false, message: `User of ${email} does not exist` });
            return;
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, getUser.password);
        if (!passwordMatch) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
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
    res.status(200).json(req.user);
});
exports.adminGetInfo = adminGetInfo;
const adminRegisterAUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name, gender, occupation, state } = req.body;
        const findUser = yield model_user_1.User.findOne({ email: email });
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
            email: email,
            password: hashedPassword,
            name: name,
            status: type_user_1.EStatus.Active,
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
const adminEditAUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield model_user_1.User.findById(req.params.id);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        const { email, name, gender, occupation, state } = req.body;
        // Validate and update user information
        if (email)
            user.email = email;
        if (name)
            user.name = name;
        if (gender)
            user.gender = gender;
        if (occupation)
            user.occupation = occupation;
        if (state)
            user.state = state;
        yield user.save();
        res.status(200).json({ message: 'User information updated successfully' });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: `[LOG] Error of adminEditAUserInfo: ${error.message}`,
            });
            return;
        }
    }
});
exports.adminEditAUserInfo = adminEditAUserInfo;
const adminEditAUserImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.params.id;
        const getUserDetails = yield model_user_1.User.findById(user);
        if (!getUserDetails) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        // If user already has an avatar (and it's not the default), delete it from Cloudinary
        if (getUserDetails.avatar &&
            getUserDetails.avatar.public_id !== 'user-pictures/dxoyhanhlve7j818kusy') {
            yield cloudinary_1.v2.uploader.destroy(getUserDetails.avatar.public_id);
        }
        // Update user's avatar information
        getUserDetails.avatar = {
            public_id: req.file.filename, // from multer-storage-cloudinary
            img_url: req.file.path, // from multer-storage-cloudinary
        };
        yield getUserDetails.save();
        res.status(200).json({ user: getUserDetails });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: `[LOG] Error of adminEditAUserImage: ${error.message}`,
            });
            return;
        }
    }
});
exports.adminEditAUserImage = adminEditAUserImage;
const adminGetUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const name = req.query.name;
        const gender = req.query.gender;
        const occupation = req.query.occupation;
        const states = req.query.states;
        const status = req.query.status;
        const dateFrom = req.query.dateFrom;
        const dateTo = req.query.dateTo;
        const VALID_GENDER = [1, 2];
        const VALID_OCCUPATION = [1, 2];
        const VALID_STATES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
        const VALID_STATUS = [1, 2];
        const limit = constants_1.CONST_LIMIT_USERS_PER_PAGE;
        const skip = (page - 1) * limit;
        let startDate, endDate;
        try {
            startDate = (0, util_date_1.parseDate)(dateFrom);
            endDate = (0, util_date_1.parseDate)(dateTo);
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: 'Invalid date format, expected DD/MM/YYYY or YYYY-MM-DD',
            });
            return;
        }
        startDate.setDate(startDate.getDate() - 1); // Move to 2024-12-30 for 2024-12-31
        startDate.setUTCHours(16, 0, 0, 0); // 00:00:00.000 UTC+8 = 2024-12-30T16:00:00.000Z
        endDate.setUTCHours(15, 59, 59, 999);
        let newStates = [];
        if (states) {
            const parsedStates = states.split(',').map(Number);
            newStates = parsedStates;
        }
        let newOccupations = [];
        if (occupation) {
            const parsedOccupations = occupation.split(',').map(Number);
            newOccupations = parsedOccupations;
        }
        let newGenders = [];
        if (gender) {
            const parsedGenders = gender.split(',').map(Number);
            newGenders = parsedGenders;
        }
        let newStatuses = [];
        if (status) {
            const parsedStatuses = status.split(',').map(Number);
            newStatuses = parsedStatuses;
        }
        const query = Object.assign(Object.assign({}, (name && { name: { $regex: name, $options: 'i' } })), { state: newStates.length > 0 ? { $in: newStates } : { $in: VALID_STATES }, occupation: newOccupations.length > 0 ? { $in: newOccupations } : { $in: VALID_OCCUPATION }, gender: newGenders.length > 0 ? { $in: newGenders } : { $in: VALID_GENDER }, status: newStatuses.length > 0 ? { $in: newStatuses } : { $in: VALID_STATUS }, createdAt: {
                $gte: startDate,
                $lte: endDate,
            } });
        const [totalUsersCount, users] = yield Promise.all([
            model_user_1.User.countDocuments(query),
            model_user_1.User.find(query)
                .select('name email gender occupation state status createdAt updatedAt avatar.img_url')
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
            .select('name email gender occupation state status avatar createdAt updatedAt')
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
    const { date_from, date_to } = req.query;
    // Validate query parameters
    if (typeof date_from !== 'string' || typeof date_to !== 'string') {
        res.status(400).json({ error: 'Invalid date_from or date_to format' });
        return;
    }
    // Parse dates
    let startDate, endDate;
    try {
        startDate = (0, util_date_1.parseDate)(date_from);
        endDate = (0, util_date_1.parseDate)(date_to);
    }
    catch (error) {
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
        const [totalUsers, totalMales, totalFemales, totalOccupationStudent, totalOccupationEmploy, monthlyGenderData, latestTenUsersCreated,] = yield Promise.all([
            model_user_1.User.countDocuments(dateFilter),
            model_user_1.User.countDocuments(Object.assign({ gender: 1 }, dateFilter)),
            model_user_1.User.countDocuments(Object.assign({ gender: 2 }, dateFilter)),
            model_user_1.User.countDocuments(Object.assign({ occupation: 1 }, dateFilter)),
            model_user_1.User.countDocuments(Object.assign({ occupation: 2 }, dateFilter)),
            model_user_1.User.aggregate([
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
            model_user_1.User.find()
                .select('name email occupation state status')
                .sort({ createdAt: -1 })
                .limit(constants_1.CONST_LIMIT_RECENT_USERS)
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
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: `[LOG] Error of adminGetUserDemographics: ${error.message}`,
            });
        }
    }
});
exports.adminGetUserDemographics = adminGetUserDemographics;
const adminUploadUserPicture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const newPicture = yield model_picture_1.Picture.create({
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
    }
    catch (error) {
        if (error instanceof multer_1.MulterError) {
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
});
exports.adminUploadUserPicture = adminUploadUserPicture;
