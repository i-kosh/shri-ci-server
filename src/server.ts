import cfg from './config'
import express from 'express'
import apiRouter from './routes'
import middlewares from './middlewares'

const app = express().use(middlewares)
app.use('/api', apiRouter)

function startServer() {
  console.info(`🚀 Starting server...`)

  app.listen(cfg.PORT, () => {
    console.info(`✔  Server started...`)
  })
}

startServer()
