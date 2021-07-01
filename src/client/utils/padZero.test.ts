import { it, expect } from '@jest/globals'
import { padZero } from './padZero'

it('функция работает', () => {
  expect(padZero(5, 3)).toEqual('005')
  expect(padZero(1, 2)).toEqual('01')
})

it('функция для чисел с нулями', () => {
  expect(padZero(10, 2)).toEqual('10')
  expect(padZero(100, 2)).toEqual('100')
  expect(padZero(100, 4)).toEqual('0100')
})

it('функция для отрицательных чисел', () => {
  expect(padZero(-5, 2)).toEqual('-5')
})
