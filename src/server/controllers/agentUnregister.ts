import { RequestHandler } from 'express'
import type {
  AgentUnregisterResponseBody,
  AgentUnregisterRequestBody,
} from '../../types'
import { ServerError } from '../ServerError'
import agentsQueue from '../AgentsQueue'

type ReqHandler = RequestHandler<
  unknown,
  AgentUnregisterResponseBody,
  AgentUnregisterRequestBody | undefined
>
const handler: ReqHandler = async (req, res, next) => {
  const body = req.body
  try {
    if (!body || !body.agentID || !body.error) {
      next(new ServerError({ status: 400, message: 'Bad request' }))
    } else {
      agentsQueue.unregisterAgent(body.agentID, body.error)
      res.status(200).send()
    }
  } catch (error) {
    next(error)
  }
}

export default handler
