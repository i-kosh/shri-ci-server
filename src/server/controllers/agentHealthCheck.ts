import { RequestHandler } from 'express'
import { ServerError } from '../ServerError'
import agentsQueue from '../AgentsQueue'
import type {
  AgentHealthCheckRequestBody,
  AgentHealthCheckResponseBody,
} from '../../types'

type ReqHandler = RequestHandler<
  unknown,
  AgentHealthCheckResponseBody,
  AgentHealthCheckRequestBody | undefined
>
const handler: ReqHandler = async (req, res, next) => {
  try {
    if (!req.body || !req.body.agentID) {
      next(new ServerError({ status: 400, message: 'Bad request' }))
    } else {
      agentsQueue.reportHealth(req.body.agentID)
      res.status(200).json('ok')
    }
  } catch (error) {
    next(error)
  }
}

export default handler
