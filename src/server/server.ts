import cfg from './config'
import express from 'express'
import apiRouter from './routes/api'
import {
  applyPreMiddlewares,
  applyFinalMiddlewares,
  applyAfterMiddlewares,
} from './middlewares'
import { resolve } from 'path'
import { BuildsQueue } from './BuildsQueue'

const pathToStatic = cfg.isDev
  ? resolve(__dirname, '../../dist/static')
  : resolve(__dirname, '../static')

const app = express()
applyPreMiddlewares(app)

app.use('/api', apiRouter)
app.use('/static', express.static(pathToStatic))
app.get('*', (req, res) => {
  res.sendFile(resolve(pathToStatic, '../index.html'))
})
applyAfterMiddlewares(app)
applyFinalMiddlewares(app)

function startServer() {
  console.info(`🚀 Starting server...`)
  app.listen(cfg.PORT, () => {
    new BuildsQueue().start()
    console.info(`✔  Server started http://localhost:${cfg.PORT}`)
  })
}
startServer()
