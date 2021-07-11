import { RequestHandler } from 'express'
import type { AgentBuildRequestBody, AgentBuildResponseBody } from '../../types'
import { Runner } from '../Runner'

type ReqHandler = RequestHandler<
  unknown,
  AgentBuildResponseBody,
  AgentBuildRequestBody | undefined
>
const handler: ReqHandler = async (req, res) => {
  if (global.agentID == null) {
    return res.status(500).json()
  }

  if (
    !req.body ||
    !req.body.id ||
    !req.body.command ||
    !req.body.commitHash ||
    !req.body.repo
  ) {
    return res.status(400).json()
  } else {
    const runner = new Runner(global.agentID)

    runner.run({
      buildID: req.body.id,
      command: req.body.command,
      commitHash: req.body.commitHash,
      repoLink: req.body.repo,
    })

    return res.status(200).json('ok')
  }
}

export default handler
