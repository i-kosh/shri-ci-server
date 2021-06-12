import buildModel from '../models/Build'
import { RequestHandler } from 'express'

export type getBuildParams = {
  buildId?: string
}

type ReqHandler = RequestHandler<getBuildParams>

const handler: ReqHandler = async (req, res, next) => {
  if (!req.params.buildId) return next(new Error('Missing required parameter'))

  const response = await buildModel.getBuildLog({
    params: {
      buildId: req.params.buildId,
    },
  })

  if (buildModel.isError(response)) {
    next(response)
  } else {
    res.json(response.data)
  }
}

export default handler
