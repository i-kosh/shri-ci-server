import settingsModel from '../models/Settings'
import { RequestHandler } from 'express'

const handler: RequestHandler = async (req, res, next) => {
  const response = await settingsModel.getSettings()

  if (settingsModel.isError(response)) {
    next(response)
  } else {
    res.status(200).json(response.data.data)
  }
}

export default handler
