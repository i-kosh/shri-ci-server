import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  BuildListResponse,
  LogResponse,
  BuildResponse,
  QueueBuildResponse,
  BuildListParams,
  BuildID,
  CommitHash,
} from '../../types'

export const buildsApi = createApi({
  tagTypes: ['BuildList'],
  reducerPath: 'buildsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
  }),
  endpoints: (builder) => ({
    fetchBuildsList: builder.query<BuildListResponse, BuildListParams>({
      query: ({ limit, offset }) => ({
        url: '/builds',
        params: {
          limit,
          offset,
        },
      }),
      providesTags: ['BuildList'],
    }),
    fetchBuild: builder.query<BuildResponse, BuildID>({
      query: (id) => `/builds/${id}`,
    }),
    fetchBuildLog: builder.query<LogResponse, BuildID>({
      query: (id) => `/builds/${id}/logs`,
    }),
    queueBuild: builder.mutation<QueueBuildResponse, CommitHash>({
      query: (commitHash) => ({
        url: `/builds/${commitHash}`,
        method: 'POST',
      }),
      invalidatesTags: ['BuildList'],
    }),
  }),
})

export const {
  useFetchBuildsListQuery,
  useFetchBuildLogQuery,
  useFetchBuildQuery,
  useQueueBuildMutation,
} = buildsApi
