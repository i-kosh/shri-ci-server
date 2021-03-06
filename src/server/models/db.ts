import axios, { AxiosInstance } from 'axios'
import config from '../config'

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
}
