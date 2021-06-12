"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCache = void 0;
const bytesToMB = (bytes) => {
    return bytes / 1e6;
};
function addCache(target, cfg = {
    ttl: 1000 * 60 * 5,
    cacheSizeMB: 10,
    itemMaxSizeMB: 1,
}) {
    let memSize = 0;
    const mem = new Map();
    const memSet = (key, val) => {
        if (bytesToMB(memSize) > cfg.cacheSizeMB)
            mem.clear();
        if (bytesToMB(val.sizeBytes) > cfg.itemMaxSizeMB) {
            console.warn(`Item too big (${bytesToMB(val.sizeBytes)})`);
            return;
        }
        mem.set(key, val);
        memSize = memSize + val.sizeBytes;
    };
    return (req, res, next) => {
        const originalResJson = res.json.bind(res);
        const key = req.url;
        const cached = mem.get(key);
        if (!cached || cached.expires <= Date.now()) {
            res.json = (body) => {
                memSet(key, {
                    data: body,
                    expires: Date.now() + cfg.ttl,
                    sizeBytes: Buffer.from(body).byteLength,
                });
                return originalResJson(body);
            };
            target(req, res, next);
        }
        else {
            res.json(cached.data);
        }
    };
}
exports.addCache = addCache;
