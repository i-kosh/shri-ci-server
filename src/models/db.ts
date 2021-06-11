import axios, { AxiosInstance, AxiosResponse } from 'axios'
import config from '../config'

export class DBError extends Error {
  public isError: boolean

  constructor(msg: string) {
    super(msg)

    this.isError = true
  }
}

export default class DB {
  protected $axios: AxiosInstance

  constructor(private baseURL: string) {
    this.$axios = axios.create({
      baseURL: baseURL,
      timeout: 8000, // 8sec
      headers: {
        Authorization: `Bearer ${config.TOKEN}`,
      },
    })
  }

  public isError(val: AxiosResponse<unknown> | DBError): val is DBError {
    return val instanceof DBError
  }
}
