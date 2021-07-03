import { renderHook } from '@testing-library/react-hooks'
import { useQueueBuild } from './useQueueBuild'
import { useQueueBuildMutation } from '../store/buildsApi'
import { useHistory } from 'react-router'

// Mocks

jest.mock('react-router')
jest.mock('../store/buildsApi')
const useQueueBuildMutationMock = useQueueBuildMutation as jest.MockedFunction<
  typeof useQueueBuildMutation
>
const useHistoryMock = useHistory as jest.MockedFunction<typeof useHistory>
const trigger = jest.fn((id: string) => {
  data = {
    id,
  }
  isLoading = false
})
const pushMock = jest.fn()
useHistoryMock.mockImplementation(() => {
  return {
    push: pushMock,
  } as any
})
useQueueBuildMutationMock.mockImplementation(() => {
  return [trigger, { data, error, isError, isLoading }] as any
})

// Test data

let data: unknown = undefined
let isLoading = true
const id = 'testId'
const error = false
const isError = false

// Tests

it('перенаправляет на новую страницу билда если пришли данные', () => {
  const { result, rerender } = renderHook(() => {
    return useQueueBuild()
  })

  expect(pushMock).not.toBeCalled()

  result.current.queueNewBuild(id)
  rerender()

  expect(pushMock).toHaveBeenLastCalledWith(`/build/${id}`)
})
