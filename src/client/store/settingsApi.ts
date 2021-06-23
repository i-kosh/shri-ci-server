import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { SettingsResponse, SettingsSaveRequest } from '../../types'

export const settingsApi = createApi({
  tagTypes: ['Settings'],
  reducerPath: 'settingsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
  }),
  endpoints: (builder) => ({
    loadSettings: builder.query<SettingsResponse, null>({
      query: () => '/settings',
      providesTags: ['Settings'],
    }),
    saveSettings: builder.mutation<SettingsSaveRequest, null>({
      query: (newSettings) => ({
        url: '/settings',
        method: 'POST',
        body: newSettings,
      }),
      invalidatesTags: ['Settings'],
    }),
  }),
})

export const { useLoadSettingsQuery, useSaveSettingsMutation } = settingsApi
