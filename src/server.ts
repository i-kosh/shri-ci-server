import cfg from './config'
import express from 'express'
import apiRouter from './routes'
import { applyPreMiddlewares, applyFinalMiddlewares } from './middlewares'

const app = express()

applyPreMiddlewares(app)

app.use('/api', apiRouter)

applyFinalMiddlewares(app)

function startServer() {
  console.info(`🚀 Starting server...`)

  app.listen(cfg.PORT, () => {
    console.info(`✔  Server started on port ${cfg.PORT}...`)
  })
}

startServer()
