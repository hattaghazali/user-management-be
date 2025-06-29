"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeNotFound = void 0;
// 404 Not Found handler
const routeNotFound = (req, res, next) => {
    res.status(404).json({
        message: 'API Route Not Found',
        method: req.method,
        path: req.originalUrl,
    });
};
exports.routeNotFound = routeNotFound;
