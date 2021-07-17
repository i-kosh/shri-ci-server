import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { SerializedError } from '@reduxjs/toolkit'
import { ErrorResponse } from '../../types'

type Error = FetchBaseQueryError | SerializedError | undefined

interface ExtractedError {
  message: string
  status: number | string
}

export const extractError = (err: Error): ExtractedError => {
  if (err && 'data' in err) {
    const data = err.data as ErrorResponse

    return {
      status: err.status,
      message: data.text,
    }
  }

  return {
    status: 400,
    message: 'Error occurred',
  }
}
