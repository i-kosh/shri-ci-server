import type { ErrorResponse } from '../types'

export interface ServerErrorArgs {
  status: number
  message: string
}

const isServerErrorArgs = (val: unknown): val is ServerErrorArgs => {
  if (val instanceof Object) {
    return 'status' in val && 'message' in val
  }

  return false
}

export class ServerError extends Error {
  public status: number

  constructor(cfg: ServerErrorArgs)
  constructor(error: unknown) {
    const cfg = error
    if (error instanceof ServerError) {
      super(error.message)
      this.status = error.status
    } else if (error instanceof Error) {
      super(error.message)
      this.status = 500
    } else if (isServerErrorArgs(cfg)) {
      super(cfg.message)
      this.status = cfg.status
    } else {
      super('Internal Server Error')
      this.status = 500
    }
  }

  public toJSON(): ErrorResponse {
    return {
      text: this.message,
    }
  }

  public toString(): string {
    return JSON.stringify(this.toJSON())
  }
}
