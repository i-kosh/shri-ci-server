import type { BuildResponse, BuildStatus, SettingsResponse } from '../../types'

export type UUID = string
export type ISODate = string

interface HasBuildIDParam {
  params: {
    buildId: UUID
  }
}

export interface DBresponse<T = unknown> {
  data: T
  errors?: Array<unknown>
}
export interface DBReqConfig {
  params?: unknown
  data?: unknown
}

// DB Requests
export type GetBuildListConfig = DBReqConfig & {
  params: {
    offset?: number
    limit?: number
  }
}
export type GetBuildLogConfig = DBReqConfig & HasBuildIDParam
export type GetBuildDetailsConfig = DBReqConfig & HasBuildIDParam
export type QueueBuildConfig = DBReqConfig & {
  data: {
    authorName: string
    branchName: string
    commitHash: string
    commitMessage: string
  }
}
export type ReportBuildStartedConfig = DBReqConfig & {
  data: {
    buildId: UUID
    dateTime: ISODate
  }
}
export type ReportBuildFinishedConfig = DBReqConfig & {
  data: {
    buildId: UUID
    buildLog: string
    duration: number
    success: boolean
  }
}
export type ReportBuildCanceledConfig = DBReqConfig & {
  data: {
    buildId: UUID
  }
}
export type SetSettingsConfig = DBReqConfig & {
  data: {
    buildCommand: string
    // TODO: обязательное поле хотя про это ничего сказано не было
    mainBranch: string
    period?: number
    repoName: string
  }
}

// DB Responses
export type QueueBuild = {
  buildNumber: number
  id: UUID
  status: BuildStatus
}

// Entity
export type GetBuildListResponse = DBresponse<BuildResponse[]>
export type GetBuildLogResponse = string
export type GetBuildDetailsResponse = DBresponse<BuildResponse>
export type QueueBuildResponse = DBresponse<QueueBuild>
export type ReportBuildStartedResponse = null
export type ReportBuildFinishedResponse = null
export type ReportBuildCanceledResponse = null

export type GetSettingsResponse = DBresponse<SettingsResponse>
export type SetSettingsResponse = null
export type DeleteSettingsResponse = null
