import cfg from './config'
import express from 'express'
import apiRouter from './routes'
import { applyPreMiddlewares, applyFinalMiddlewares } from './middlewares'
import { repoManager } from './Repo'
import settingsModel from './models/Settings'

const app = express()
applyPreMiddlewares(app)

app.use('/api', apiRouter)

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
