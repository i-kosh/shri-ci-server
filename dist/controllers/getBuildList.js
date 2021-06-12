"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Build_1 = __importDefault(require("../models/Build"));
const handler = async (req, res, next) => {
    const response = await Build_1.default.getBuildList();
    if (Build_1.default.isError(response)) {
        next(response);
    }
    else {
        res.json(response.data.data);
    }
};
exports.default = handler;
