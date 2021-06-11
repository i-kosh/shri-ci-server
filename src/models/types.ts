export interface DBresponse<T = unknown> {
  data?: T
  errors?: Array<unknown>
}

//Misc

export interface DBReqConfig {
  params?: Record<string, string | number>
  data?: unknown
}

export type GetBuildListConfig = DBReqConfig & {
  params: {
    offset: number
    limit: number
  }
}

export type GetBuildLogConfig = DBReqConfig & {
  params: {
    buildId: string
  }
}

export type GetBuildDetailsConfig = DBReqConfig & {
  params: {
    buildId: string
  }
}

export type QueueBuildCOnfig = DBReqConfig & {
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
    mainBranch: string
    period: number
    repoName: string
  }
}

// Entity

export type UUID = string
export type ISODate = string

export type BuildStatus = 'Waiting' | 'Failed' | 'Canceled' | 'Success'
export interface BuildEntity {
  authorName: string
  branchName: string
  buildNumber: number
  commitHash: string
  commitMessage: string
  configurationId: UUID
  id: UUID
  status: BuildStatus
  start: ISODate
  duration: number
}

export interface SettingsEntity {
  buildCommand: string
  id: UUID
  mainBranch: string
  period: number
  repoName: string
}

export type GetBuildListResponse = DBresponse<BuildEntity[]>
export type GetBuildLogResponse = DBresponse<Record<string, unknown>>
export type GetBuildDetailsResponse = DBresponse<BuildEntity>
export type QueueBuildResponse = DBresponse<{
  buildNumber: number
  id: UUID
  status: BuildStatus
}>
export type ReportBuildStartedResponse = null
export type ReportBuildFinishedResponse = null
export type ReportBuildCanceledResponse = null

export type GetSettingsResponse = DBresponse<SettingsEntity>
export type SetSettingsResponse = null
export type DeleteSettingsResponse = null
