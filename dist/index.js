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
const express_1 = __importDefault(require("express"));
const configs_1 = __importDefault(require("./configs/configs"));
const connect_db_1 = __importDefault(require("./configs/connect-db"));
const not_found_1 = require("./middlewares/not-found");
const route_basic_1 = __importDefault(require("./routes/route-basic"));
const app = (0, express_1.default)();
// START: Initialize MongoDB connection
(0, connect_db_1.default)();
// START: Middleware
// START: Routes
app.use("/api/user", route_basic_1.default);
// START: Route not found
app.use(not_found_1.notFoundHandler);
// START: Server
app.listen(configs_1.default.port, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`LOG: Server started on PORT:::${configs_1.default.port} ${configs_1.default.bruh}`);
}));
