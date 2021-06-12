"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const getBuildList_1 = __importDefault(require("../controllers/getBuildList"));
const getBuild_1 = __importDefault(require("../controllers/getBuild"));
const getBuildLogs_1 = __importDefault(require("../controllers/getBuildLogs"));
const queueBuild_1 = __importDefault(require("../controllers/queueBuild"));
const cache_1 = require("../middlewares/cache");
const router = express_1.Router();
router.get('/', getBuildList_1.default);
router.get('/:buildId', getBuild_1.default);
router.post('/:commitHash', queueBuild_1.default);
router.get('/:buildId/logs', cache_1.addCache(getBuildLogs_1.default));
exports.default = router;
