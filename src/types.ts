import type { QueueBuild } from './server/models/types'

export type BuildID = string

// GetBuild
export type BuildStatus =
  | 'Success'
  | 'Waiting'
  | 'InProgress'
  | 'Canceled'
  | 'Fail'

interface WithStart {
  start: string
}

interface WithDuration extends WithStart {
  duration: number
}

export interface Build {
  id: BuildID
  configurationId: string
  buildNumber: number
  commitMessage: string
  commitHash: string
  branchName: string
  authorName: string
  status: BuildStatus
}
export interface BuildWaiting extends Build {
  status: 'Waiting'
}
export interface BuildCanceled extends Build {
  status: 'Canceled'
}
export interface BuildInProgress extends Build, WithStart {
  status: 'InProgress'
}
export interface BuildSuccess extends Build, WithDuration {
  status: 'Success'
}
export interface BuildFail extends Build, WithDuration {
  status: 'Fail'
}
export type BuildConcatenated =
  | BuildWaiting
  | BuildCanceled
  | BuildInProgress
  | BuildSuccess
  | BuildFail
export type BuildResponse = BuildConcatenated
export interface BuildParams {
  buildId?: BuildID
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
  buildId?: BuildID
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
