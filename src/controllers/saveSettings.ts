import settingsModel from '../models/Settings'
import { RequestHandler } from 'express'

const handler: RequestHandler = async (req, res, next) => {
  const response = await settingsModel.setSettings({
    data: req.body,
  })

  // TODO: добавить получение списка коммитов и все все

  if (settingsModel.isError(response)) {
    next(response)
  } else {
    res.status(200).json()
  }
}

export default handler
