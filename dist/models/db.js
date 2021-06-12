"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBError = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../config"));
class DBError extends Error {
    constructor(msg) {
        super(msg);
        this.isError = true;
    }
}
exports.DBError = DBError;
class DB {
    constructor(baseURL) {
        this.baseURL = baseURL;
        this.$axios = axios_1.default.create({
            baseURL: baseURL,
            timeout: 8000,
            headers: {
                Authorization: `Bearer ${config_1.default.TOKEN}`,
            },
        });
    }
    isError(val) {
        return val instanceof DBError;
    }
}
exports.default = DB;
