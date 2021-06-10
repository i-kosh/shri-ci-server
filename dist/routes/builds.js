"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
router.get('/', (req, res, next) => {
    res.json({ lol: 'получение списка сборок' });
});
router.get('/:commitHash', (req, res, next) => {
    res.json({ lol: 'получение информации о конкретной сборке' });
});
router.post('/:commitHash', (req, res, next) => {
    res.json({ lol: 'добавление сборки в очередь' });
});
router.get('/:commitHash/logs', (req, res, next) => {
    res.json({ lol: 'получение логов билда (сплошной текст)' });
});
exports.default = router;
