"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.repoManager = exports.Repo = exports.RepoError = void 0;
const child_process_1 = require("child_process");
const os_1 = require("os");
const path_1 = require("path");
const util_1 = require("util");
const uuid_1 = require("uuid");
const promises_1 = __importDefault(require("fs/promises"));
class RepoError extends Error {
    constructor(msg) {
        super(msg);
    }
}
exports.RepoError = RepoError;
const execFileAsync = util_1.promisify(child_process_1.execFile);
class Repo {
    constructor(params) {
        this.params = params;
        this.failed = !this.isGitLink(params.repoLink);
        this.exist = false;
        this.folderName = uuid_1.v5(params.repoLink, '5235fde0-caf5-11eb-878d-7303d56e8e0a');
        this.fullPath = path_1.join(os_1.tmpdir(), this.folderName);
        this.cloneRepo();
    }
    get gitDirFlag() {
        return `--git-dir=${path_1.join(this.fullPath, '/.git')}`;
    }
    isGitLink(link) {
        return link.endsWith('.git');
    }
    async isGitDir(path) {
        try {
            const stat = await promises_1.default.stat(path);
            if (stat.isDirectory() && stat.size > 1) {
                const dir = await promises_1.default.readdir(path);
                return dir.includes('.git');
            }
            return false;
        }
        catch (error) {
            return false;
        }
    }
    waitRepoReady() {
        let intervalID;
        return new Promise((resolve) => {
            intervalID = setInterval(() => {
                if (this.failed) {
                    clearInterval(intervalID);
                    return resolve(false);
                }
                if (this.exist) {
                    clearInterval(intervalID);
                    return resolve(true);
                }
            }, 100);
        });
    }
    async checkout(to) {
        try {
            if (await this.waitRepoReady()) {
                await execFileAsync('git', [this.gitDirFlag, 'checkout', to]);
                return true;
            }
            throw new Error('Checkout error');
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async cloneRepo() {
        if (this.failed)
            return;
        if (await this.isGitDir(this.fullPath)) {
            this.exist = true;
            return;
        }
        try {
            await execFileAsync('git', ['clone', this.params.repoLink, this.fullPath]);
            if (!(await this.isGitDir(this.fullPath))) {
                throw new RepoError('Repository cloning error');
            }
            this.exist = true;
        }
        catch (error) {
            this.exist = false;
            this.failed = true;
            console.error(error);
        }
    }
    async getCommitInfo(hash) {
        var _a;
        const formatString = '%H&%an&%s';
        const formatSeparator = '&';
        try {
            if (!(await this.waitRepoReady()))
                return null;
            const { stdout } = await execFileAsync('git', [
                this.gitDirFlag,
                'show',
                '-s',
                `--format="${formatString}"`,
                hash,
            ]);
            const parsed = (_a = stdout
                .split('"')[1]) === null || _a === void 0 ? void 0 : _a.split(formatSeparator);
            if (Array.isArray(parsed) && parsed[0] && parsed[1] && parsed[2]) {
                return {
                    hash: parsed[0],
                    author: parsed[1],
                    message: parsed[2],
                };
            }
            throw new RepoError('Error occured while getting commit info');
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }
    async runBuild(commitHash) {
        let log = '';
        let success = false;
        try {
            if (!(await this.waitRepoReady())) {
                throw new Error('Repo error');
            }
            if (!(await this.checkout(commitHash))) {
                throw new Error('git checkout error');
            }
            const { stderr, stdout } = await execFileAsync(`${this.params.buildCommand}`, { cwd: this.fullPath, shell: true });
            log = `${stdout}\n${stderr}`;
            success = true;
        }
        catch (error) {
            log = `${log}\n${error}`;
            success = false;
        }
        return {
            log,
            success,
        };
    }
}
exports.Repo = Repo;
class SingleRepoManager {
    updRepo(params) {
        if (this.repoLink === params.repoLink)
            return;
        this.repoLink = params.repoLink;
        this.repoInstanse = new Repo(params);
        console.info(`New repo ${params.repoLink}`);
    }
    getRepo() {
        return this.repoInstanse ? this.repoInstanse : null;
    }
    getRepoAsync() {
        const maxTimeOut = 1000 * 60 * 1;
        let fullTimeout = 0;
        return new Promise((resolve) => {
            const timeout = setInterval(() => {
                const repo = this.getRepo();
                if (repo) {
                    clearTimeout(timeout);
                    resolve(repo);
                }
                else {
                    fullTimeout = fullTimeout + 100;
                }
                if (fullTimeout >= maxTimeOut) {
                    throw new Error('Repo initialization timeout (1min)');
                }
            }, 100);
        });
    }
}
exports.repoManager = new SingleRepoManager();
