import buildModel from '../models/Build'
import { RequestHandler } from 'express'
import type { BuildResponse, BuildParams } from '../../types'
import { extractCookies } from '../utils/extractCookies'
import { blue } from 'colors'

type ReqHandler = RequestHandler<BuildParams, BuildResponse>

const handler: ReqHandler = async (req, res, next) => {
  const cookies = extractCookies(req)

  if (cookies.testMockApi) {
    console.warn(blue('getBuild: test cookie resivied - using mocked response'))

    res.json({
      authorName: 'authorName',
      branchName: 'main',
      buildNumber: 777,
      commitHash: 'commitHash',
      commitMessage: 'commitMessage',
      configurationId: 'configurationId',
      id: 'test-build-id',
      status: 'Success',
      duration: 1000 * 60 * 30, // 30min
      start: new Date(0).toUTCString(),
    })
  } else {
    try {
      if (!req.params.buildId) {
        throw new Error('Missing required parameter')
      }

      const response = await buildModel.getBuildDetails({
        params: {
          buildId: req.params.buildId,
        },
      })

      res.json(response.data.data)
    } catch (error) {
      next(error)
    }
  }
}

export default handler
