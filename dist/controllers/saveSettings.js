"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Settings_1 = __importDefault(require("../models/Settings"));
const Repo_1 = require("../Repo");
const handler = async (req, res, next) => {
    const response = await Settings_1.default.setSettings({
        data: req.body,
    });
    if (Settings_1.default.isError(response)) {
        next(response);
    }
    else {
        res.status(200).json();
        Repo_1.repoManager.updRepo({
            repoLink: req.body.repoName,
            buildCommand: req.body.buildCommand,
            mainBranch: req.body.mainBranch,
        });
    }
};
exports.default = handler;
