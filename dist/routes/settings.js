"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const getSettings_1 = __importDefault(require("../controllers/getSettings"));
const saveSettings_1 = __importDefault(require("../controllers/saveSettings"));
const router = express_1.Router();
router.get('/', getSettings_1.default);
router.post('/', saveSettings_1.default);
exports.default = router;
