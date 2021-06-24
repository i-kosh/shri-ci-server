import buildModel from '../models/Build'
import { RequestHandler } from 'express'
import type { BuildResponse, BuildParams } from '../../types'

type ReqHandler = RequestHandler<BuildParams, BuildResponse>

const handler: ReqHandler = async (req, res, next) => {
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

export default handler
