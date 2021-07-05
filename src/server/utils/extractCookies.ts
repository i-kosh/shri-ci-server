import { Request } from 'express'
import type { Cookie } from '@wdio/protocols'

export type CookiesNames = 'mockApi'

export interface AvailableCookie extends Cookie {
  name: CookiesNames
}

export const extractCookies = (
  req: Request<any>
): Partial<Record<CookiesNames, string>> => {
  return req.cookies
}
