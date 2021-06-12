"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handler = (err, req, res, next) => {
    res.status(400).json({
        text: 'Bad request',
    });
    next();
};
exports.default = handler;
