"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildModel = void 0;
const db_1 = __importStar(require("./db"));
const config_1 = __importDefault(require("../config"));
class BuildModel extends db_1.default {
    async getBuildList(cfg) {
        try {
            return await this.$axios.get('/build/list', {
                params: cfg === null || cfg === void 0 ? void 0 : cfg.params,
            });
        }
        catch (error) {
            return new db_1.DBError(error);
        }
    }
    async getBuildLog(cfg) {
        try {
            return await this.$axios.get('/build/log', {
                params: cfg === null || cfg === void 0 ? void 0 : cfg.params,
            });
        }
        catch (error) {
            return new db_1.DBError(error);
        }
    }
    async getBuildDetails(cfg) {
        try {
            return await this.$axios.get('/build/details', {
                params: cfg === null || cfg === void 0 ? void 0 : cfg.params,
            });
        }
        catch (error) {
            return new db_1.DBError(error);
        }
    }
    async queueBuild(cfg) {
        try {
            return await this.$axios.post('/build/request', cfg.data);
        }
        catch (error) {
            return new db_1.DBError(error);
        }
    }
    async reportBuildStarted(cfg) {
        try {
            return await this.$axios.post('/build/start', cfg.data);
        }
        catch (error) {
            return new db_1.DBError(error);
        }
    }
    async reportBuildFinished(cfg) {
        try {
            return await this.$axios.post('/build/finish', cfg.data);
        }
        catch (error) {
            return new db_1.DBError(error);
        }
    }
    async reportBuildCanceled(cfg) {
        try {
            return await this.$axios.post('/build/cancel', cfg.data);
        }
        catch (error) {
            return new db_1.DBError(error);
        }
    }
}
exports.BuildModel = BuildModel;
exports.default = new BuildModel(config_1.default.DB);
