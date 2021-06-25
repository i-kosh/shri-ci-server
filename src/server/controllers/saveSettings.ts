import settingsModel from '../models/Settings'
import { RequestHandler } from 'express'
import { repoManager } from '../Repo'
import type { SettingsSaveRequest, SettingsSaveResponse } from '../../types'

const handler: RequestHandler<
  unknown,
  SettingsSaveResponse,
  SettingsSaveRequest
> = async (req, res, next) => {
  try {
    await settingsModel.setSettings({
      data: req.body,
    })

    const repo = repoManager.updRepo({
      repoLink: req.body.repoName,
      buildCommand: req.body.buildCommand,
      mainBranch: req.body.mainBranch,
    })

    await repo.waitRepoReady()

    res.status(200).json()
  } catch (error) {
    next(error)
  }
}

export default handler
