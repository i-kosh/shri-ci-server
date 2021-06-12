import buildModel from '../models/Build'
import { RequestHandler } from 'express'
import { repoManager } from '../Repo'
import buildQueue from '../BuildQueue'

type getBuildParams = {
  commitHash?: string
}
type ReqHandler = RequestHandler<getBuildParams>

const handler: ReqHandler = async (req, res, next) => {
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

    if (buildModel.isError(response)) {
      return next(response)
    }

    if (buildModel.isError(response)) {
      next(response)
    } else {
      res.json(response.data.data)
    }
  } catch (error) {
    next(error)
  }
}

export default handler
