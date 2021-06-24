import { RequestHandler } from 'express'
import { repoManager } from '../Repo'
import buildQueue from '../BuildQueue'
import cfg from '../config'
import type { QueueBuildResponse } from '../../types'

type GetBuildParams = {
  commitHash?: string
}
type ReqHandler = RequestHandler<GetBuildParams, QueueBuildResponse>

const handler: ReqHandler = async (req, res, next) => {
  try {
    if (!req.params.commitHash) {
      throw new Error('Missing required parameter')
    }
    const repo = await repoManager.getRepoAsync()
    const commitInfo = await repo.getCommitInfo(req.params.commitHash)
    if (!commitInfo) throw new Error('Error while getting commit info')

    if (cfg.DRY_BUILD) {
      res.json({
        id: '0',
        status: 'Waiting',
        buildNumber: 123,
      })
    } else {
      const response = await buildQueue.add({
        authorName: commitInfo.author,
        branchName: repo.params.mainBranch,
        commitHash: commitInfo.hash,
        commitMessage: commitInfo.message,
      })

      res.json(response.data.data)
    }
  } catch (error) {
    next(error)
  }
}

export default handler
