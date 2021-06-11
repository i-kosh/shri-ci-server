import buildModel from '../models/Build'
import { RequestHandler } from 'express'

const handler: RequestHandler = async (req, res, next) => {
  const response = await buildModel.getBuildList()

  if (buildModel.isError(response)) {
    next(response)
  } else {
    res.json(response.data.data)
  }
}

export default handler
