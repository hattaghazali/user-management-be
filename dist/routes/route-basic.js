"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_basic_1 = require("../controllers/controller-basic");
// START BASIC ROUTING
const router = (0, express_1.Router)();
router.get("/list-users", controller_basic_1.getListOfUsers);
exports.default = router;
