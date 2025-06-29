"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_admin_1 = require("../controllers/controller-admin");
const mware_vertifytoken_1 = __importDefault(require("../middlewares/mware-vertifytoken"));
// START: Admin Routes
const router = (0, express_1.Router)();
router.post('/login', controller_admin_1.adminLogin);
router.get('/demographics', mware_vertifytoken_1.default, controller_admin_1.adminGetUserDemographics);
router.get('/user/list-users', mware_vertifytoken_1.default, controller_admin_1.adminGetUsers);
router.get('/user/:id', mware_vertifytoken_1.default, controller_admin_1.adminGetAUser);
router.post('/user/register-user', controller_admin_1.adminRegisterAUser);
exports.default = router;
