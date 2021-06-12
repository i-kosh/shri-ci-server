"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const validateConfig_1 = __importDefault(require("../utils/validateConfig"));
const { parsed, error } = dotenv_1.config();
if (error || !parsed) {
    throw error;
}
const cfg = {
    PORT: parsed.PORT || process.env.PORT || '3030',
    TOKEN: parsed.TOKEN,
    NODE_ENV: parsed.NODE_ENV || process.env.NODE_ENV || 'production',
    DB: parsed.DB,
};
validateConfig_1.default(cfg);
exports.default = Object.freeze(cfg);
