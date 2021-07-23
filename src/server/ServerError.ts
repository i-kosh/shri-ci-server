import type { ErrorResponse } from '../types'

export interface ServerErrorArgs {
  status: number
  message: string
}

const isServerErrorArgs = (val: unknown): val is ServerErrorArgs => {
  return val instanceof Object && 'status' in val && 'message' in val
}

export class ServerError extends Error {
  public status: number

  public constructor(cfg: ServerErrorArgs | Error) {
    if (cfg instanceof ServerError) {
      super(cfg.message)
      this.status = cfg.status
    } else if (cfg instanceof Error) {
      super(cfg.message)
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
