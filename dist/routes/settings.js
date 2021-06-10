"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
router.get('/', (req, res, next) => {
    res.json({ lol: 'получение сохраненных настроек' });
});
router.post('/', (req, res, next) => {
    res.json({ lol: 'cохранение настроек' });
});
exports.default = router;
