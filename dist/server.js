"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const middlewares_1 = require("./middlewares");
const Repo_1 = require("./Repo");
const Settings_1 = __importDefault(require("./models/Settings"));
const app = express_1.default();
middlewares_1.applyPreMiddlewares(app);
app.use('/api', routes_1.default);
middlewares_1.applyFinalMiddlewares(app);
async function startServer() {
    var _a;
    console.info(`🚀 Starting server...`);
    const settings = await Settings_1.default.getSettings();
    if (!Settings_1.default.isError(settings) && ((_a = settings.data.data) === null || _a === void 0 ? void 0 : _a.repoName)) {
        Repo_1.repoManager.updRepo({
            repoLink: settings.data.data.repoName,
            mainBranch: settings.data.data.mainBranch,
            buildCommand: settings.data.data.buildCommand,
        });
        console.info('✔ Repo settings restored...');
    }
    app.listen(config_1.default.PORT, () => {
        console.info(`✔  Server started on port ${config_1.default.PORT}...`);
    });
}
startServer();
