import cors from 'cors'
import express, { Express } from 'express'
import morgan from 'morgan'
import cfg from '../config'
import finalErrorHandler from './finalErrorHandler'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import speedLimiter from 'express-slow-down'

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

  app.use(express.json())
  app.use(morgan(cfg.NODE_ENV !== 'production' ? 'dev' : 'combined'))
}

export const applyFinalMiddlewares = (app: Express): void => {
  app.use(finalErrorHandler)
}
