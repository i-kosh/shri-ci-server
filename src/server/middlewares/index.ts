import cors from 'cors'
import express, { Express } from 'express'
import morgan from 'morgan'
import finalErrorHandler from './finalErrorHandler'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import speedLimiter from 'express-slow-down'
import { setReqId, getReqId } from '../utils/getSetReqId'
import { v4 as uuidv4 } from 'uuid'
import { ServerError } from '../ServerError'
import cookieParser from 'cookie-parser'

export const applyPreMiddlewares = (app: Express): void => {
  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000,
      max: 1000,
    })
  )
  app.use(
    speedLimiter({
      windowMs: 5 * 60 * 1000,
      delayAfter: 2500,
      delayMs: 100,
    })
  )
  app.use(cors())
  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'script-src': ["'self'", "'unsafe-eval'"],
        },
      },
    })
  )

  app.use(cookieParser())

  app.use((req, res, next) => {
    setReqId(req, uuidv4())
    next()
  })

  app.use(express.json())
  app.use(
    morgan((tokens, req, res) => {
      return [
        tokens['response-time'](req, res),
        'ms',
        '|',
        tokens['remote-addr'](req, res),
        '|',
        tokens.method(req, res),
        tokens.status(req, res),
        tokens.url(req, res),
        tokens.res(req, res, 'content-length'),
        '-',
        `${getReqId(req)}`,
      ].join(' ')
    })
  )
}

export const applyAfterMiddlewares = (app: Express): void => {
  app.use((req, res, next) => {
    next(new ServerError({ status: 404, message: 'Not Found' }))
  })
}

export const applyFinalMiddlewares = (app: Express): void => {
  app.use(finalErrorHandler)
}
