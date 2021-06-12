"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Build_1 = __importDefault(require("./models/Build"));
const db_1 = require("./models/db");
const Repo_1 = require("./Repo");
class BuildQueue {
    constructor(concurrent = 1) {
        this.concurrent = concurrent;
        this.queue = [];
        this.buildsInProgress = 0;
    }
    waitQueue() {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (this.buildsInProgress < this.concurrent) {
                    clearInterval(interval);
                    resolve(true);
                }
            }, 3000);
        });
    }
    async proccessQueue() {
        try {
            const repo = Repo_1.repoManager.getRepo();
            if (!repo)
                throw new Error('Repo error');
            while (this.queue.length && (await this.waitQueue())) {
                const current = this.queue.shift();
                if (!current)
                    return;
                await Build_1.default.reportBuildStarted({
                    data: {
                        buildId: current.id,
                        dateTime: new Date().toISOString(),
                    },
                });
                const buildStartTimestamp = Date.now();
                this.buildsInProgress++;
                const { log, success } = await repo.runBuild(current.commitHash);
                this.buildsInProgress--;
                await Build_1.default.reportBuildFinished({
                    data: {
                        buildId: current.id,
                        success,
                        buildLog: log,
                        duration: Date.now() - buildStartTimestamp,
                    },
                });
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    addToQueue(build) {
        this.queue.push(build);
        if (this.buildsInProgress < 1) {
            this.proccessQueue();
        }
    }
    async add(cfg) {
        var _a;
        try {
            const repo = Repo_1.repoManager.getRepo();
            if (!repo)
                throw new Error('Repo error');
            const response = await Build_1.default.queueBuild({
                data: cfg,
            });
            if (Build_1.default.isError(response) || !response.data.data)
                return response;
            this.addToQueue({
                id: (_a = response.data.data) === null || _a === void 0 ? void 0 : _a.id,
                commitHash: cfg.commitHash,
                buildCommand: repo.params.buildCommand,
            });
            return response;
        }
        catch (error) {
            console.error(error);
            return new db_1.DBError('Error while add to queue');
        }
    }
}
exports.default = new BuildQueue();
