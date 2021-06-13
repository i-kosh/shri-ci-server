import { ErrorRequestHandler } from 'express'

const isError = (err: unknown): err is Error => {
  return err instanceof Error
}

const handler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(500).json({
    text: isError(err) ? err.message : 'Server error',
  })

  next()
}

export default handler
