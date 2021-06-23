// GetBuild
export interface Build {
  id: string
  configurationId: string
  buildNumber: number
  commitMessage: string
  commitHash: string
  branchName: string
  authorName: string
  status: 'Success' | 'Waiting' | 'Canceled' | 'Fail'
  start: string
  duration: number
}
export type BuildID = string
export type BuildResponse = Build

// QueueBuild
export type CommitHash = string
export type QueueBuildResponse = undefined

// BuildList
export interface BuildListParams {
  offset?: number
  limit?: number
}
export type BuildListResponse = Build[]

// BUildLog
export type LogResponse = string

// Settings Save
export interface SettingsSaveRequest {
  buildCommand: string
  mainBranch?: string
  period?: number
  repoName: string
}

// SettingsGet
export interface SettingsResponse {
  id: string
  repoName: string
  buildCommand: string
  mainBranch?: string
  period?: number
}
