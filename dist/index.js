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
const cors_1 = __importDefault(require("cors"));
const connect_db_1 = __importDefault(require("./configs/connect-db"));
const constants_1 = require("./configs/constants");
const mware_notfound_1 = require("./middlewares/mware-notfound");
const mware_cors_1 = __importDefault(require("./middlewares/mware-cors"));
const route_admin_1 = __importDefault(require("./routes/route-admin"));
const app = (0, express_1.default)();
// START: MongoDB
(0, connect_db_1.default)();
// START: Middleware
app.use((req, res, next) => {
    console.log(`[API CALL] ${req.method} ${req.originalUrl} at ${new Date().toISOString()}`);
    next();
});
app.use((0, cors_1.default)(mware_cors_1.default));
app.use(express_1.default.json());
// START: Routes
app.use('/api/admin', route_admin_1.default);
app.use(mware_notfound_1.routeNotFound);
// START: Server
app.listen(constants_1.CONST_SERVER_PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('------------------------------------------------------------------------------');
    console.log(`[LOG] Server started. URL: ${constants_1.CONST_API_BASE}:${constants_1.CONST_SERVER_PORT}`);
    console.log(`[LOG] Using environment. ENV: ${constants_1.CONST_BRUH}`);
}));
