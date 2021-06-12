"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Build_1 = __importDefault(require("../models/Build"));
const Repo_1 = require("../Repo");
const BuildQueue_1 = __importDefault(require("../BuildQueue"));
const handler = async (req, res, next) => {
    try {
        if (!req.params.commitHash) {
            throw new Error('Missing required parameter');
        }
        const repo = await Repo_1.repoManager.getRepoAsync();
        const commitInfo = await repo.getCommitInfo(req.params.commitHash);
        if (!commitInfo)
            throw new Error('Error while getting commit info');
        const response = await BuildQueue_1.default.add({
            authorName: commitInfo.author,
            branchName: repo.params.mainBranch,
            commitHash: commitInfo.hash,
            commitMessage: commitInfo.message,
        });
        if (Build_1.default.isError(response)) {
            return next(response);
        }
        if (Build_1.default.isError(response)) {
            next(response);
        }
        else {
            res.json(response.data.data);
        }
    }
    catch (error) {
        next(error);
    }
};
exports.default = handler;
