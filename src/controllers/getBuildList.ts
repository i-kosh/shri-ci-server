import buildModel from '../models/Build'
import { RequestHandler } from 'express'

const handler: RequestHandler = async (req, res, next) => {
  try {
    const response = await buildModel.getBuildList()

    res.json(response.data.data)
  } catch (error) {
    next(error)
  }
}

export default handler
