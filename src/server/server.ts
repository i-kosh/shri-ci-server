import cfg from './config'
import express from 'express'
import apiRouter from './routes'
import { applyPreMiddlewares, applyFinalMiddlewares } from './middlewares'
import { repoManager } from './Repo'
import settingsModel from './models/Settings'
import { resolve } from 'path'

const pathToStatic = cfg.isDev
  ? resolve(__dirname, '../../dist/static')
  : resolve(__dirname, '../static')

const app = express()
applyPreMiddlewares(app)

app.use('/api', apiRouter)
app.use('/static', express.static(pathToStatic))
app.use('*', (req, res) => {
  res.sendFile(resolve(pathToStatic, '../index.html'))
})
applyFinalMiddlewares(app)

function startServer() {
  console.info(`🚀 Starting server...`)

  settingsModel
    .getSettings()
    .then((settings) => {
      repoManager.updRepo({
        repoLink: settings.data.data.repoName,
        mainBranch: settings.data.data.mainBranch,
        buildCommand: settings.data.data.buildCommand,
      })
      console.info('✔  Repo settings restored...')
    })
    .catch((err) => {
      console.warn(err)
    })

  app.listen(cfg.PORT, () => {
    console.info(`✔  Server started on port ${cfg.PORT}...`)
  })
}
startServer()
