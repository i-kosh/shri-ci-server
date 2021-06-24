import settingsModel from '../models/Settings'
import { RequestHandler } from 'express'
import type { SettingsResponse } from '../../types'

const handler: RequestHandler<unknown, SettingsResponse> = async (
  req,
  res,
  next
) => {
  try {
    const response = await settingsModel.getSettings()

    res.status(200).json(response.data.data)
  } catch (error) {
    next(error)
  }
}

export default handler
