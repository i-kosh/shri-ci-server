import buildModel from '../models/Build'
import { RequestHandler } from 'express'
import { BuildListParams } from '../../types'

const handler: RequestHandler = async (req, res, next) => {
  const { limit, offset }: BuildListParams = req.query

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
