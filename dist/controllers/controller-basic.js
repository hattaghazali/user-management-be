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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListOfUsers = void 0;
const users_1 = require("../models/users");
const getListOfUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield users_1.User.find({});
        if (users) {
            res.status(200).json(users);
            return;
        }
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: `Error of getListOfUsers: ${error.message}`,
            });
            return;
        }
    }
});
exports.getListOfUsers = getListOfUsers;
