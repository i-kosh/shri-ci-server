"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Settings_1 = __importDefault(require("../models/Settings"));
const handler = async (req, res, next) => {
    const response = await Settings_1.default.getSettings();
    if (Settings_1.default.isError(response)) {
        next(response);
    }
    else {
        res.status(200).json(response.data.data);
    }
};
exports.default = handler;
