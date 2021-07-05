import { RequestHandler } from 'express'
import { repoManager } from '../Repo'
import buildQueue from '../BuildQueue'
import type { QueueBuildResponse } from '../../types'
import { extractCookies } from '../utils/extractCookies'
import { blue } from 'colors'

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
      const repo = await repoManager.getRepoAsync()
      const commitInfo = await repo.getCommitInfo(req.params.commitHash)
      if (!commitInfo) throw new Error('Error while getting commit info')
      const response = await buildQueue.add({
        authorName: commitInfo.author,
        branchName: repo.params.mainBranch,
        commitHash: commitInfo.hash,
        commitMessage: commitInfo.message,
      })

      res.json(response.data.data)
    } catch (error) {
      next(error)
    }
  }
}

export default handler
