import { ErrorRequestHandler } from 'express'
import { ServerError } from '../ServerError'

const handler: ErrorRequestHandler = (err, req, res, next) => {
  const error = new ServerError(err)

  res.status(error.status).json(error)
  next()
}

export default handler
