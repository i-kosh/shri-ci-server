import { Request } from 'express'

const reqIdSymbol = Symbol('requestid')

export const getReqId = <T extends Request>(request: T): string | undefined => {
  const req = request as T & { [reqIdSymbol]?: string }
  return req[reqIdSymbol]
}

export const setReqId = <T extends Request>(request: T, id: string): void => {
  const req = request as T & { [reqIdSymbol]?: string }
  req[reqIdSymbol] = id
  return
}
