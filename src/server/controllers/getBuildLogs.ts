import buildModel from '../models/Build'
import { RequestHandler } from 'express'

// TODO: тут сервер возвращает поток

export type getBuildParams = {
  buildId?: string
}

type ReqHandler = RequestHandler<getBuildParams>

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