import { RequestHandler } from 'express'
import type {
  AgentRegisterRequestBody,
  AgentRegisterResponseBody,
} from '../../types'
import { ServerError } from '../ServerError'
import agentsQueue from '../AgentsQueue'

type ReqHandler = RequestHandler<
  unknown,
  AgentRegisterResponseBody,
  AgentRegisterRequestBody | undefined
>
const handler: ReqHandler = async (req, res, next) => {
  const body = req.body
  try {
    if (!body || !body.host || !body.port) {
      next(new ServerError({ status: 400, message: 'Bad request' }))
    } else {
      const agentId = await agentsQueue.registerAgent(body.host, body.port)
      res.status(200).send(agentId)
    }
  } catch (error) {
    next(error)
  }
}

export default handler
