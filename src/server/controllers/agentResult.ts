import { RequestHandler } from 'express'
import type {
  AgentResultRequestBody,
  AgentResultResponseBody,
} from '../../types'
import { ServerError } from '../ServerError'
import agentsQueue from '../AgentsQueue'
import buildModel from '../models/Build'
import { toUnixTime } from '../utils'

type ReqHandler = RequestHandler<
  unknown,
  AgentResultResponseBody,
  AgentResultRequestBody | undefined
>
const handler: ReqHandler = async (req, res, next) => {
  const reqBody = req.body

  if (
    !reqBody ||
    !reqBody.id ||
    (reqBody.status !== 'Fail' && reqBody.status !== 'Success') ||
    reqBody.log == null
  ) {
    next(new ServerError({ status: 400, message: 'Bad request' }))
  } else {
    try {
      const buildResponse = await buildModel.getBuildDetails({
        params: {
          buildId: reqBody.id,
        },
      })
      const currentBuildData = buildResponse.data.data
      if (currentBuildData.status !== 'InProgress') {
        throw new Error('Reported build was not started properly')
      }

      await buildModel.reportBuildFinished({
        data: {
          buildId: reqBody.id,
          buildLog: reqBody.log,
          success: reqBody.status === 'Success',
          duration: toUnixTime(
            Date.now() - new Date(currentBuildData.start).valueOf()
          ),
        },
      })

      agentsQueue.freeAgent(reqBody.agentID)
      res.status(200).send()
    } catch (error) {
      console.error(error)
    }
  }
}

export default handler
