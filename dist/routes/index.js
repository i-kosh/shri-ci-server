"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const settings_1 = __importDefault(require("./settings"));
const builds_1 = __importDefault(require("./builds"));
const router = express_1.Router();
router.use('/settings', settings_1.default);
router.use('/builds', builds_1.default);
exports.default = router;
