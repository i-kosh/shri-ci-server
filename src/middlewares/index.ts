import cors from 'cors'
import express, { Express } from 'express'
import morgan from 'morgan'
import finalErrorHandler from './finalErrorHandler'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import speedLimiter from 'express-slow-down'
import { setReqId, getReqId } from '../utils/getSetReqId'
import { v4 as uuidv4 } from 'uuid'

export const applyPreMiddlewares = (app: Express): void => {
  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000,
      max: 100,
    })
  )
  app.use(
    speedLimiter({
      windowMs: 5 * 60 * 1000,
      delayAfter: 500,
      delayMs: 100,
    })
  )
  app.use(cors())
  app.use(helmet())

  app.use((req, res, next) => {
    setReqId(req, uuidv4())
    next()
  })

  app.use(express.json())
  app.use(
    morgan((tokens, req, res) => {
      return [
        `${getReqId(req)}`,
        '-',
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'),
        tokens['remote-addr'](req, res),
        tokens['response-time'](req, res),
        'ms',
      ].join(' ')
    })
  )
}

export const applyFinalMiddlewares = (app: Express): void => {
  app.use(finalErrorHandler)
}
