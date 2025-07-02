"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const corsOptions = {
    origin: 'http://localhost:5173', // MatchING FE's address
    methods: ['GET', 'POST'], // Specify the allowed HTTP methods
    credentials: true,
};
exports.default = corsOptions;
