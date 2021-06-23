import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface SettingsResponse {
  id: string
  repoName: string
  buildCommand: string
  mainBranch?: string
  period?: number
}

export const settingsApi = createApi({
  reducerPath: 'settingsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
  }),
  endpoints: (builder) => ({
    loadSettings: builder.query<SettingsResponse, null>({
      query: () => '/settings',
    }),
  }),
})

export const { useLoadSettingsQuery } = settingsApi
