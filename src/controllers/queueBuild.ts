import buildModel from '../models/Build'
import { RequestHandler } from 'express'

export type getBuildParams = {
  commitHash?: string
}

type ReqHandler = RequestHandler<getBuildParams>

const handler: ReqHandler = async (req, res, next) => {
  if (!req.params.commitHash)
    return next(new Error('Missing required parameter'))

  // TODO: Доделать
  const response = await buildModel.queueBuild({
    data: req.body,
  })

  if (buildModel.isError(response)) {
    next(response)
  } else {
    res.json(response.data.data)
  }
}

export default handler
