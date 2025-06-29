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
const connect_db_1 = __importDefault(require("./configs/connect-db"));
const configs_1 = __importDefault(require("./configs/configs"));
const route_admin_1 = __importDefault(require("./routes/route-admin"));
const mware_notfound_1 = require("./middlewares/mware-notfound");
const app = (0, express_1.default)();
// START: MongoDB
(0, connect_db_1.default)();
// START: Middleware
app.use(express_1.default.json());
// START: Routes
app.use('/api/admin', route_admin_1.default);
app.use(mware_notfound_1.routeNotFound);
// START: Server
app.listen(configs_1.default.port, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('------------------------------------------------------------------------------');
    console.log(`[LOG] Server started. URL: ${configs_1.default.api_base}:${configs_1.default.port}`);
    console.log(`[LOG] Using environment. ENV: ${configs_1.default.bruh}`);
}));
