"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loggingMiddleware = (req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
};
exports.default = loggingMiddleware;
