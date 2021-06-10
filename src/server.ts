import { config } from 'dotenv'
config()

import cors from 'cors'
import express from 'express'
import morgan from 'morgan'

const app = express()

app.use(cors())
app.use(morgan(process.env.NODE_ENV !== 'production' ? 'dev' : 'combined'))
app.use(express.json())

function startServer() {
  console.info(`🚀 Starting server...`)

  app.listen(process.env.PORT, () => {
    console.info(`✔  Server started...`)
  })
}

startServer()
