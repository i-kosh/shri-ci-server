import type { QueueBuild } from './server/models/types'

// GetBuild
export type BuildStatus =
  | 'Success'
  | 'Waiting'
  | 'InProgress'
  | 'Canceled'
  | 'Fail'
export interface Build {
  id: string
  configurationId: string
  buildNumber: number
  commitMessage: string
  commitHash: string
  branchName: string
  authorName: string
  status: BuildStatus
  start: string
  duration: number
}
export type BuildWaitingOrCanceled = Pick<
  Build,
  | 'id'
  | 'configurationId'
  | 'authorName'
  | 'branchName'
  | 'buildNumber'
  | 'commitHash'
  | 'commitMessage'
  | 'status'
> & {
  status: 'Waiting' | 'Canceled'
}
export type BuildWaiting = BuildWaitingOrCanceled & {
  status: 'Waiting'
}
export type BuildCanceled = BuildWaitingOrCanceled & {
  status: 'Canceled'
}
export type BuildInProgress = Pick<
  Build,
  | 'id'
  | 'configurationId'
  | 'authorName'
  | 'branchName'
  | 'buildNumber'
  | 'commitHash'
  | 'commitMessage'
  | 'status'
  | 'start'
> & {
  status: 'InProgress'
}
export type BuildSuccess = Build & {
  status: 'Success'
}
export type BuildFail = Build & {
  status: 'Fail'
}
export type BuildConcatenated =
  | BuildWaiting
  | BuildCanceled
  | BuildInProgress
  | BuildSuccess
  | BuildFail
export type BuildID = string
export type BuildResponse = BuildConcatenated
export interface BuildParams {
  buildId?: string
}

// QueueBuild
export type CommitHash = string
export type QueueBuildResponse = QueueBuild

// BuildList
export interface BuildListParams {
  offset?: number
  limit?: number
}
export type BuildListResponse = BuildConcatenated[]

// BUildLog
export type LogResponse = string
export interface LogParams {
  buildId?: string
}

// Settings Save
// TODO: mainBranch На самом деле обязателен
export interface SettingsSaveRequest {
  buildCommand: string
  mainBranch?: string
  period?: number
  repoName: string
}
export type SettingsSaveResponse = undefined

// SettingsGet
export type SettingsResponse =
  | {
      id: string
      repoName: string
      buildCommand: string
      mainBranch: string
      period?: number
    }
  | undefined

// Errors
export interface ErrorResponse {
  text: string
}

// Server routers types
export type AgentHealthCheckRequestBody = {
  agentID: string
}
export type AgentHealthCheckResponseBody = 'ok' | undefined

export type AgentRegisterRequestBody = { host: string; port: string }
export type AgentRegisterResponseBody =
  | {
      id: string
      maxHealthCheckMiss: number
      healthReportRate: number
    }
  | undefined

export type AgentResultRequestBody = {
  agentID: string
  id: string
  status: 'Success' | 'Fail'
  log: string
}
export type AgentResultResponseBody = void

export type AgentUnregisterRequestBody = {
  agentID: string
  error?: string
}
export type AgentUnregisterResponseBody = void

// Agent routers types

export type AgentBuildRequestBody = {
  id: string
  commitHash: string
  command: string
  repo: string
}
export type AgentBuildResponseBody = 'ok' | undefined
