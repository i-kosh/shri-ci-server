import { renderHook } from '@testing-library/react-hooks'
import { useWasTrue } from './useWasTrue'

it('должен помнить было ли значение положительным', () => {
  let initialVal = 0
  const { rerender, result } = renderHook(() => useWasTrue(initialVal))

  expect(result.current).toEqual(false)

  initialVal = 1
  rerender()

  expect(result.current).toEqual(true)

  initialVal = 0
  rerender()

  expect(result.current).toEqual(true)
})
