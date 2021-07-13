import { Request } from 'express'
import type { Cookie } from '@wdio/protocols'

export type CookiesNames = 'testMockApi' | 'testNoSettings'

export interface AvailableCookie extends Cookie {
  name: CookiesNames
}

interface CookiesExtended extends Partial<Record<CookiesNames, string>> {
  haveTestCookies: boolean
}

export const extractCookies = (
  req: Request<any, any, any, any>
): CookiesExtended => {
  return {
    ...req.cookies,
    haveTestCookies: Object.keys(req.cookies).find((val) =>
      val.startsWith('test')
    ),
  }
}
