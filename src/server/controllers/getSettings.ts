import settingsModel from '../models/Settings'
import { RequestHandler } from 'express'
import type { SettingsResponse } from '../../types'
import { extractCookies } from '../utils/extractCookies'
import { blue } from 'colors'

const handler: RequestHandler<unknown, SettingsResponse> = async (
  req,
  res,
  next
) => {
  const cookies = extractCookies(req)

  if (cookies.haveTestCookies) {
    console.warn(
      blue('getSettings: test cookie resivied - using mocked response')
    )

    if (cookies.testNoSettings) {
      res.status(200).json()
    } else if (cookies.testMockApi) {
      res.status(200).json({
        id: 'settingsid',
        repoName: 'test/repo',
        buildCommand: 'npm run build',
        mainBranch: 'main',
        period: 10,
      })
    }
  } else {
    try {
      const response = await settingsModel.getSettings()

      res.status(200).json(response.data.data)
    } catch (error) {
      next(error)
    }
  }
}

export default handler
