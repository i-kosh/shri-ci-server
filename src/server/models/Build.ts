import DB from './db'
import { AxiosResponse } from 'axios'
import {
  GetBuildListConfig,
  GetBuildListResponse,
  GetBuildLogConfig,
  GetBuildLogResponse,
  GetBuildDetailsConfig,
  GetBuildDetailsResponse,
  QueueBuildConfig,
  QueueBuildResponse,
  ReportBuildStartedConfig,
  ReportBuildStartedResponse,
  ReportBuildFinishedConfig,
  ReportBuildFinishedResponse,
  ReportBuildCanceledConfig,
  ReportBuildCanceledResponse,
} from './types'
import config from '../config'

export class BuildModel extends DB {
  public async getBuildList(
    cfg?: GetBuildListConfig
  ): Promise<AxiosResponse<GetBuildListResponse>> {
    return await this.$axios.get<GetBuildListResponse>('/build/list', {
      params: cfg?.params,
    })
  }

  // TODO: сервер возвращает чанки
  public async getBuildLog(
    cfg?: GetBuildLogConfig
  ): Promise<AxiosResponse<GetBuildLogResponse>> {
    return await this.$axios.get<GetBuildLogResponse>('/build/log', {
      params: cfg?.params,
    })
  }

  public async getBuildDetails(
    cfg?: GetBuildDetailsConfig
  ): Promise<AxiosResponse<GetBuildDetailsResponse>> {
    return await this.$axios.get<GetBuildDetailsResponse>('/build/details', {
      params: cfg?.params,
    })
  }

  public async queueBuild(
    cfg: QueueBuildConfig
  ): Promise<AxiosResponse<QueueBuildResponse>> {
    return await this.$axios.post<QueueBuildResponse>(
      '/build/request',
      cfg.data
    )
  }

  public async reportBuildStarted(
    cfg: ReportBuildStartedConfig
  ): Promise<AxiosResponse<ReportBuildStartedResponse>> {
    return await this.$axios.post<ReportBuildStartedResponse>(
      '/build/start',
      cfg.data
    )
  }

  public async reportBuildFinished(
    cfg: ReportBuildFinishedConfig
  ): Promise<AxiosResponse<ReportBuildFinishedResponse>> {
    return await this.$axios.post<ReportBuildFinishedResponse>(
      '/build/finish',
      cfg.data
    )
  }

  public async reportBuildCanceled(
    cfg: ReportBuildCanceledConfig
  ): Promise<AxiosResponse<ReportBuildCanceledResponse>> {
    return await this.$axios.post<ReportBuildCanceledResponse>(
      '/build/cancel',
      cfg.data
    )
  }
}

export default new BuildModel(config.DB)
