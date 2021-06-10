import { config } from 'dotenv'
config()

import cors from 'cors'
import express from 'express'
import morgan from 'morgan'

import apiRouter from './routes'

const app = express()

app.use(cors())
app.use(morgan(process.env.NODE_ENV !== 'production' ? 'dev' : 'combined'))
app.use(express.json())

app.use('/api', apiRouter)

function startServer() {
  console.info(`🚀 Starting server...`)

  app.listen(process.env.PORT, () => {
    console.info(`✔  Server started...`)
  })
}

startServer()
