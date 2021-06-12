import cfg from './config'
import express from 'express'
import apiRouter from './routes'
import { applyPreMiddlewares, applyFinalMiddlewares } from './middlewares'
import { repoManager } from './models/Repo'
import settingsModel from './models/Settings'

const app = express()

applyPreMiddlewares(app)

app.use('/api', apiRouter)

applyFinalMiddlewares(app)

async function startServer() {
  console.info(`🚀 Starting server...`)

  const settings = await settingsModel.getSettings()
  if (!settingsModel.isError(settings) && settings.data.data?.repoName) {
    repoManager.updRepo({
      repoLink: settings.data.data.repoName,
      mainBranch: settings.data.data.mainBranch,
    })
    console.info('✔ Repo settings restored...')
  }

  app.listen(cfg.PORT, () => {
    console.info(`✔  Server started on port ${cfg.PORT}...`)
  })
}

startServer()
