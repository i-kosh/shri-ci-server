import DB, { DBError } from './db'
import { AxiosResponse } from 'axios'
import {
  GetBuildListConfig,
  GetBuildListResponse,
  GetBuildLogConfig,
  GetBuildLogResponse,
  GetBuildDetailsConfig,
  GetBuildDetailsResponse,
  QueueBuildCOnfig,
  QueueBuildResponse,
  ReportBuildStartedConfig,
  ReportBuildStartedResponse,
  ReportBuildFinishedConfig,
  ReportBuildFinishedResponse,
  ReportBuildCanceledConfig,
  ReportBuildCanceledResponse,
} from './types'
import config from '../config'

class BuildModel extends DB {
  public async getBuildList(
    cfg?: GetBuildListConfig
  ): Promise<AxiosResponse<GetBuildListResponse> | DBError> {
    try {
      return await this.$axios.get<GetBuildListResponse>('/build/list', {
        params: cfg?.params,
      })
    } catch (error) {
      return new DBError(error)
    }
  }

  public async getBuildLog(
    cfg?: GetBuildLogConfig
  ): Promise<AxiosResponse<GetBuildLogResponse> | DBError> {
    try {
      return await this.$axios.get<GetBuildLogResponse>('/build/log', {
        params: cfg?.params,
      })
    } catch (error) {
      return new DBError(error)
    }
  }

  public async getBuildDetails(
    cfg?: GetBuildDetailsConfig
  ): Promise<AxiosResponse<GetBuildDetailsResponse> | DBError> {
    try {
      return await this.$axios.get<GetBuildDetailsResponse>('/build/details', {
        params: cfg?.params,
      })
    } catch (error) {
      return new DBError(error)
    }
  }

  public async queueBuild(
    cfg: QueueBuildCOnfig
  ): Promise<AxiosResponse<QueueBuildResponse> | DBError> {
    try {
      return await this.$axios.post<QueueBuildResponse>(
        '/build/request',
        cfg.data
      )
    } catch (error) {
      return new DBError(error)
    }
  }

  public async reportBuildStarted(
    cfg: ReportBuildStartedConfig
  ): Promise<AxiosResponse<ReportBuildStartedResponse> | DBError> {
    try {
      return await this.$axios.post<ReportBuildStartedResponse>(
        '/build/start',
        cfg.data
      )
    } catch (error) {
      return new DBError(error)
    }
  }

  public async reportBuildFinished(
    cfg: ReportBuildFinishedConfig
  ): Promise<AxiosResponse<ReportBuildFinishedResponse> | DBError> {
    try {
      return await this.$axios.post<ReportBuildFinishedResponse>(
        '/build/finish',
        cfg.data
      )
    } catch (error) {
      return new DBError(error)
    }
  }

  public async reportBuildCanceled(
    cfg: ReportBuildCanceledConfig
  ): Promise<AxiosResponse<ReportBuildCanceledResponse> | DBError> {
    try {
      return await this.$axios.post<ReportBuildCanceledResponse>(
        '/build/cancel',
        cfg.data
      )
    } catch (error) {
      return new DBError(error)
    }
  }
}

export default new BuildModel(config.DB)
