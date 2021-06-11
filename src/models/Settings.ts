import DB, { DBError } from './db'
import { AxiosResponse } from 'axios'
import {
  GetSettingsResponse,
  SetSettingsConfig,
  SetSettingsResponse,
  DeleteSettingsResponse,
} from './types'
import config from '../config'

export class SettingsModel extends DB {
  public async setSettings(
    cfg: SetSettingsConfig
  ): Promise<AxiosResponse<SetSettingsResponse> | DBError> {
    try {
      return await this.$axios.post<SetSettingsResponse>('/conf', cfg.data)
    } catch (error) {
      return new DBError(error)
    }
  }

  public async getSettings(): Promise<
    AxiosResponse<GetSettingsResponse> | DBError
  > {
    try {
      return await this.$axios.get<GetSettingsResponse>('/conf')
    } catch (error) {
      return new DBError(error)
    }
  }

  public async deleteSettings(): Promise<
    AxiosResponse<DeleteSettingsResponse> | DBError
  > {
    try {
      return await this.$axios.delete<DeleteSettingsResponse>('/conf')
    } catch (error) {
      return new DBError(error)
    }
  }
}

export default new SettingsModel(config.DB)
