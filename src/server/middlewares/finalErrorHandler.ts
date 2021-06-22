import { ErrorRequestHandler } from 'express'

class ServerError extends Error {
  constructor(msg?: string) {
    super(msg)
  }

  public toJSON() {
    return {
      text: this.message || 'Internal Server Error',
    }
  }

  public toString() {
    return JSON.stringify(this.toJSON())
  }
}

const handler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(500).json(new ServerError('Internal Server Error'))

  next()
}

export default handler
