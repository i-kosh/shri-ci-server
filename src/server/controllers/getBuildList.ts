import buildModel from '../models/Build'
import { RequestHandler } from 'express'
import { BuildListParams, BuildListResponse } from '../../types'
import { extractCookies } from '../utils/extractCookies'
import { blue } from 'colors'

const createStubResponse = (docCount: number): BuildListResponse => {
  const arr: BuildListResponse = []

  for (let i = 0; i < docCount; i++) {
    arr.push({
      authorName: 'authorName',
      branchName: 'main',
      buildNumber: 777,
      commitHash: 'commitHash',
      commitMessage: 'commitMessage',
      configurationId: 'configurationId',
      id: 'test-build-id',
      status: 'Success',
      duration: 60 * 30, // 30min
      start: new Date(0).toISOString().replace('Z', ''),
    })
  }

  return arr
}

type Handler = RequestHandler<
  unknown,
  BuildListResponse,
  unknown,
  BuildListParams
>

const handler: Handler = async (req, res, next) => {
  const cookies = extractCookies(req)

  if (cookies.testMockApi) {
    console.warn(
      blue('getBuildList: test cookie resivied - using mocked response')
    )

    res.json(createStubResponse(25))
  } else {
    const { limit, offset } = req.query

    try {
      const response = await buildModel.getBuildList({
        params: {
          limit,
          offset,
        },
      })

      res.json(response.data.data)
    } catch (error) {
      next(error)
    }
  }
}

export default handler
