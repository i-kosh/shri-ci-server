import { yellow } from 'colors'
import { logError } from './logError'

interface AdditionalCfg {
  addTimeout?: number
  numberOfRetry?: number
  label?: string
  maxRetries?: number
  suppressError?: boolean
  timeoutCoef?: number
}
type AsyncFunc<T = unknown> = () => Promise<T>

export const retry = async <T>(
  fn: AsyncFunc<T>,
  addCfg?: AdditionalCfg
): Promise<T> => {
  const conf: Required<AdditionalCfg> = {
    addTimeout: addCfg?.addTimeout || 500,
    numberOfRetry: addCfg?.numberOfRetry || 0,
    maxRetries: addCfg?.maxRetries || 10,
    label: addCfg?.label || '',
    suppressError: addCfg?.suppressError || false,
    timeoutCoef: 1.5,
  }

  if (conf.label) {
    console.log(
      conf.numberOfRetry >= 1
        ? `${conf.label} ${yellow(
            `(retry ${conf.numberOfRetry} of ${conf.maxRetries}, ${conf.addTimeout} ms)`
          )}`
        : conf.label
    )
  }

  try {
    return await fn()
  } catch (error) {
    if (conf.numberOfRetry >= conf.maxRetries) {
      return Promise.reject(error)
    } else {
      if (!conf.suppressError) {
        logError(error)
      }

      return new Promise((res, rej) => {
        setTimeout(async () => {
          try {
            const result = await retry(fn, {
              ...addCfg,
              addTimeout: Math.round(conf.addTimeout * conf.timeoutCoef),
              numberOfRetry: conf.numberOfRetry + 1,
            })

            res(result)
          } catch (error) {
            rej(error)
          }
        }, conf.addTimeout)
      })
    }
  }
}
