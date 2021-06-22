import DB from './db'
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
  ): Promise<AxiosResponse<SetSettingsResponse>> {
    return await this.$axios.post<SetSettingsResponse>('/conf', cfg.data)
  }

  public async getSettings(): Promise<AxiosResponse<GetSettingsResponse>> {
    return await this.$axios.get<GetSettingsResponse>('/conf')
  }

  public async deleteSettings(): Promise<
    AxiosResponse<DeleteSettingsResponse>
  > {
    return await this.$axios.delete<DeleteSettingsResponse>('/conf')
  }
}

export default new SettingsModel(config.DB)
