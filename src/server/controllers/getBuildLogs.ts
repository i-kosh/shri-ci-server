import buildModel from '../models/Build'
import { RequestHandler } from 'express'
import type { LogResponse, LogParams } from '../../types'

type ReqHandler = RequestHandler<LogParams, LogResponse>

const handler: ReqHandler = async (req, res, next) => {
  try {
    if (!req.params.buildId) {
      throw new Error('Missing required parameter')
    }

    const response = await buildModel.getBuildLog({
      params: {
        buildId: req.params.buildId,
      },
    })

    res.json(response.data)
  } catch (error) {
    next(error)
  }
}

export default handler
