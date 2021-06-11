import cfg from './config'
import express from 'express'
import apiRouter from './routes'
import { beforeRoutes } from './middlewares'
import finalErrorHandler from './middlewares/finalErrorHandler'

const app = express().use(beforeRoutes)
app.use('/api', apiRouter)

app.use(finalErrorHandler)

function startServer() {
  console.info(`🚀 Starting server...`)

  app.listen(cfg.PORT, () => {
    console.info(`✔  Server started...`)
  })
}

startServer()
