"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyFinalMiddlewares = exports.applyPreMiddlewares = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const config_1 = __importDefault(require("../config"));
const finalErrorHandler_1 = __importDefault(require("./finalErrorHandler"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_slow_down_1 = __importDefault(require("express-slow-down"));
const applyPreMiddlewares = (app) => {
    app.use(express_rate_limit_1.default({
        windowMs: 1 * 60 * 1000,
        max: 100,
    }));
    app.use(express_slow_down_1.default({
        windowMs: 5 * 60 * 1000,
        delayAfter: 500,
        delayMs: 100,
    }));
    app.use(cors_1.default());
    app.use(helmet_1.default());
    app.use(express_1.default.json());
    app.use(morgan_1.default(config_1.default.NODE_ENV !== 'production' ? 'dev' : 'combined'));
};
exports.applyPreMiddlewares = applyPreMiddlewares;
const applyFinalMiddlewares = (app) => {
    app.use(finalErrorHandler_1.default);
};
exports.applyFinalMiddlewares = applyFinalMiddlewares;
