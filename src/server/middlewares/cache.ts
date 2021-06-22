import { RequestHandler } from 'express'
import { getReqId } from '../utils/getSetReqId'
import { bytesToMB } from '../utils/bytesToMB'

interface Cached {
  expires: number
  data: unknown
  sizeBytes: number
}
interface Params {
  ttl?: number
  cacheSizeMB?: number
  itemMaxSizeMB?: number
}
type reqKey = string

const defaultParams: Readonly<Required<Params>> = {
  ttl: 1000 * 60 * 10, // 10min
  cacheSizeMB: 10,
  itemMaxSizeMB: 1,
}

export function addCache(target: RequestHandler, cfg?: Params): RequestHandler {
  const cfgParams = {
    ...defaultParams,
    ...cfg,
  }

  let memSize = 0
  const mem: Map<reqKey, Cached> = new Map()

  const memSet = (key: string, val: Cached) => {
    // TODO: сделать нормальное вытеснение из кеша
    if (bytesToMB(memSize) > cfgParams.cacheSizeMB) mem.clear()
    if (bytesToMB(val.sizeBytes) > cfgParams.itemMaxSizeMB) {
      console.warn(
        `Item biger than 'itemMaxSizeMB' (${bytesToMB(val.sizeBytes).toFixed(
          2
        )} > ${cfgParams.itemMaxSizeMB}) caching skipped`
      )
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
          const expires = Date.now() + cfgParams.ttl
          const sizeBytes = Buffer.from(`${body}`).byteLength
          console.log(
            `Caching new data:
              exp=${new Date(expires).toUTCString()}
              size=${bytesToMB(sizeBytes).toFixed(2)}mb`
          )
          memSet(key, {
            data: body,
            expires,
            sizeBytes,
          })

          const loadPrecent = (
            (cfgParams.cacheSizeMB / 100) *
            bytesToMB(memSize)
          ).toFixed(2)
          console.log(
            `Current cache loading ${loadPrecent}% (${bytesToMB(
              memSize
            ).toFixed(2)}mb of ${cfgParams.cacheSizeMB}mb)`
          )
        }

        return originalResJson(body)
      }

      target(req, res, next)
    } else {
      console.log(`Serving cached data for ${getReqId(req)}`)
      res.json(cached.data)
    }
  }
}
