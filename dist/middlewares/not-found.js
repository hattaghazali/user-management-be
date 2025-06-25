"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = void 0;
// 404 Not Found handler
const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        message: "API Route Not Found",
        method: req.method,
        path: req.originalUrl,
    });
};
exports.notFoundHandler = notFoundHandler;
