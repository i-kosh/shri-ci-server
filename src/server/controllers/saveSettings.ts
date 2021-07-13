import settingsModel from '../models/Settings'
import { RequestHandler } from 'express'
import type { SettingsSaveRequest, SettingsSaveResponse } from '../../types'
import { extractCookies } from '../utils/extractCookies'
import { blue } from 'colors'

const handler: RequestHandler<
  unknown,
  SettingsSaveResponse,
  SettingsSaveRequest
> = async (req, res, next) => {
  const cookies = extractCookies(req)

  if (cookies.testMockApi) {
    console.warn(
      blue('saveSettings: test cookie resivied - using mocked response')
    )
    res.status(200).json()
  } else {
    try {
      await settingsModel.setSettings({
        data: {
          ...req.body,
          // TODO: пока так, непонятно что с этим делать
          mainBranch: req.body.mainBranch || 'master',
        },
      })

      res.status(200).json()
    } catch (error) {
      next(error)
    }
  }
}

export default handler
