import { RequestHandler } from 'express'

interface Cached {
  expires: number
  data: unknown
  sizeBytes: number
}
interface Params {
  ttl: number
  cacheSizeMB: number
  itemMaxSizeMB: number
}
type reqKey = string

const bytesToMB = (bytes: number) => {
  return bytes / 1e6
}

export function addCache(
  target: RequestHandler,
  cfg: Params = {
    ttl: 1000 * 60 * 5, // 5min
    cacheSizeMB: 10,
    itemMaxSizeMB: 1,
  }
): RequestHandler {
  let memSize = 0
  const mem: Map<reqKey, Cached> = new Map()

  const memSet = (key: string, val: Cached) => {
    // TODO: сделать нормально
    if (bytesToMB(memSize) > cfg.cacheSizeMB) mem.clear()
    if (bytesToMB(val.sizeBytes) > cfg.itemMaxSizeMB) {
      console.warn(`Item too big (${bytesToMB(val.sizeBytes)})`)
      return
    }

    mem.set(key, val)
    memSize = memSize + val.sizeBytes
  }

  return (req, res, next) => {
    const originalResJson = res.json.bind(res)
    const key = req.url
    const cached = mem.get(key)

    if (!cached || cached.expires <= Date.now()) {
      res.json = (body) => {
        if (!(body instanceof Error)) {
          memSet(key, {
            data: body,
            expires: Date.now() + cfg.ttl,
            sizeBytes: Buffer.from(`${body}`).byteLength,
          })
        }

        return originalResJson(body)
      }

      target(req, res, next)
    } else {
      res.json(cached.data)
    }
  }
}
