import { Request } from 'express'

const reqIdSymbol = Symbol('requestid')

interface HasReqID extends Request {
  [reqIdSymbol]?: string
}

export const getReqId = <T extends HasReqID>(
  request: T
): string | undefined => {
  return request[reqIdSymbol]
}

export const setReqId = <T extends HasReqID>(request: T, id: string): void => {
  request[reqIdSymbol] = id
  return
}
