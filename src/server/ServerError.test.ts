import { it, describe, expect } from '@jest/globals'
import { ServerError } from './ServerError'

describe('Основыне', () => {
  const testCfg = {
    message: 'error message',
    status: 123,
  }

  it('наследуется от Error', () => {
    const testval = new ServerError(testCfg)

    expect(testval).toBeInstanceOf(Error)
  })

  it('сообщение совпадает с переданным', () => {
    const testErr = new ServerError(testCfg)

    expect(testErr.message).toEqual(testCfg.message)
  })

  it('код совпадает с переданным', () => {
    const testErr = new ServerError(testCfg)

    expect(testErr.status).toEqual(testCfg.status)
  })

  it('фоллбечит на стандартные значения если было передано что-то непонятное', () => {
    const anyThing = { lol: 'kek' }
    // @ts-expect-error
    const testErr = new ServerError(anyThing)

    expect(testErr.status).toEqual(500)
    expect(testErr.message).toEqual('Internal Server Error')
  })

  it('метод toJSON возвращает текст ошибки', () => {
    const test = new ServerError(testCfg).toJSON()
    const match = {
      text: testCfg.message,
    }

    expect(test).toEqual(match)
  })

  it('метод toString возвращает json строку', () => {
    const test = new ServerError(testCfg).toString()
    const match = JSON.stringify({
      text: testCfg.message,
    })

    expect(test).toEqual(match)
  })
})

describe('Перегрузки', () => {
  const testCfg = {
    message: 'error message',
    status: 123,
  }

  it('может принимать обычные аргументы', () => {
    const err = new ServerError(testCfg)

    expect(err.message).toEqual(testCfg.message)
    expect(err.status).toEqual(testCfg.status)
  })

  it('может принимать инстанс Error', () => {
    const errInstanse = new Error(testCfg.message)
    const err = new ServerError(errInstanse)

    expect(err.message).toEqual(testCfg.message)
    expect(err.status).toEqual(500)
  })

  it('может принимать инстанс себя', () => {
    const errInstanse = new ServerError(testCfg)
    const err = new ServerError(errInstanse)

    expect(err.message).toEqual(testCfg.message)
    expect(err.status).toEqual(testCfg.status)
  })
})
