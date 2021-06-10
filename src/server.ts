import cfg from './config'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'

import apiRouter from './routes'

const app = express()

app.use(cors())
app.use(morgan(cfg.NODE_ENV !== 'production' ? 'dev' : 'combined'))
app.use(express.json())

app.use('/api', apiRouter)

function startServer() {
  console.info(`🚀 Starting server...`)

  app.listen(cfg.PORT, () => {
    console.info(`✔  Server started...`)
  })
}

startServer()
