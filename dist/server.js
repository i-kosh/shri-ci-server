"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
dotenv_1.config();
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const app = express_1.default();
app.use(cors_1.default());
app.use(morgan_1.default(process.env.NODE_ENV !== 'production' ? 'dev' : 'combined'));
app.use(express_1.default.json());
function startServer() {
    console.info(`🚀 Starting server...`);
    app.listen(process.env.PORT, () => {
        console.info(`✔  Server started...`);
    });
}
startServer();
