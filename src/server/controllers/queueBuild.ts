import { RequestHandler } from 'express'
import type { QueueBuildResponse } from '../../types'
import { extractCookies } from '../utils/extractCookies'
import { blue, yellow } from 'colors'
import { getCommitInfo } from '../utils/getCommitInfo'
import settingsModel from '../models/Settings'
import buildModel from '../models/Build'

type GetBuildParams = {
  commitHash?: string
}
type ReqHandler = RequestHandler<GetBuildParams, QueueBuildResponse>

const handler: ReqHandler = async (req, res, next) => {
  const cookies = extractCookies(req)

  if (cookies.testMockApi) {
    console.warn(
      blue('queueBuild: test cookie resivied - using mocked response')
    )

    res.status(200).json({
      buildNumber: 777,
      id: 'test-build-id',
      status: 'Waiting',
    })
  } else {
    try {
      if (!req.params.commitHash) {
        throw new Error('Missing required parameter')
      }

      console.log(
        yellow(`New build request (commit: ${req.params.commitHash})`)
      )

      const settingsResp = await settingsModel.getSettings()
      const settings = settingsResp.data.data
      if (!settings) throw new Error('No settings found')

      const { author, hash, message } = await getCommitInfo(
        `https://github.com/${settings.repoName}.git`,
        req.params.commitHash
      )

      const result = await buildModel.queueBuild({
        data: {
          authorName: author,
          commitHash: hash,
          commitMessage: message,
          branchName: settings.mainBranch,
        },
      })
      const newBuild = result.data.data

      res.json(newBuild)
    } catch (error) {
      next(error)
    }
  }
}

export default handler
