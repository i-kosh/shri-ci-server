import settingsModel from '../models/Settings'
import { RequestHandler } from 'express'
import { repoManager } from '../Repo'

const handler: RequestHandler = async (req, res, next) => {
  const response = await settingsModel.setSettings({
    data: req.body,
  })

  if (settingsModel.isError(response)) {
    next(response)
  } else {
    res.status(200).json()

    repoManager.updRepo({
      repoLink: req.body.repoName,
      buildCommand: req.body.buildCommand,
      mainBranch: req.body.mainBranch,
    })
  }
}

export default handler
