import buildModel from '../models/Build'
import { RequestHandler } from 'express'
import { BuildListParams, BuildListResponse } from '../../types'

type Handler = RequestHandler<
  unknown,
  BuildListResponse,
  unknown,
  BuildListParams
>

const handler: Handler = async (req, res, next) => {
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

export default handler
