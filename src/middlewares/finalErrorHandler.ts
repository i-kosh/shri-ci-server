import { ErrorRequestHandler } from 'express'

const handler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(400).json({
    text: 'Bad request',
  })

  next()
}

export default handler
