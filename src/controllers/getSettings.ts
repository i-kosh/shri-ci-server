import settingsModel from '../models/Settings'
import { RequestHandler } from 'express'

const handler: RequestHandler = async (req, res, next) => {
  try {
    const response = await settingsModel.getSettings()

    res.status(200).json(response.data.data)
  } catch (error) {
    next(error)
  }
}

export default handler
