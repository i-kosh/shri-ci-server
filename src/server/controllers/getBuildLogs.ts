import buildModel from '../models/Build'
import { RequestHandler } from 'express'
import type { LogResponse, LogParams } from '../../types'
import { extractCookies } from '../utils/extractCookies'
import { blue } from 'colors'

const testLog = `
THIS IS TEST LOG
> npm run dev:server

> shri-ci-server@1.0.0 dev:server /home/ikosh/dev/shri-ci-server
> cross-env NODE_ENV=development nodemon

[nodemon] 2.0.7
[nodemon] to restart at any time, enter
[nodemon] watching path(s): src/server/**/*
[nodemon] watching extensions: ts,tsx,js,jsx,json
[nodemon] starting ts-node ./src/server/server.ts --project ./src/server/tsconfig.json
Config:
{
  PORT: '3030',
  TOKEN: 'token',
  NODE_ENV: 'development',
  DB: 'https://example.com',
  isDev: true,
  isProd: false,
  DRY_BUILD: false
}
`

type ReqHandler = RequestHandler<LogParams, LogResponse>

const handler: ReqHandler = async (req, res, next) => {
  const cookies = extractCookies(req)

  if (cookies.testMockApi) {
    console.warn(
      blue('getBuildLog: test cookie resivied - using mocked response')
    )

    res.status(200).json(testLog)
  } else {
    try {
      if (!req.params.buildId) {
        throw new Error('Missing required parameter')
      }

      const response = await buildModel.getBuildLog({
        params: {
          buildId: req.params.buildId,
        },
      })

      res.json(response.data)
    } catch (error) {
      next(error)
    }
  }
}

export default handler
