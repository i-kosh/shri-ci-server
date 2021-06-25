import cfg from './config'
import express from 'express'
import apiRouter from './routes/api'
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
    .then(({ data }) => {
      if (data.data) {
        repoManager.updRepo({
          repoLink: data.data.repoName,
          mainBranch: data.data.mainBranch,
          buildCommand: data.data.buildCommand,
        })
        console.info('✔  Repo settings restored...')
      } else {
        console.log('No settings found')
      }
    })
    .catch((err) => {
      console.warn(err)
    })

  app.listen(cfg.PORT, () => {
    console.info(`✔  Server started on port ${cfg.PORT}...`)
  })
}
startServer()
