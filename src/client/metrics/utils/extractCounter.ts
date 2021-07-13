import type Counter from '../Counter'

declare global {
  interface Window {
    __initialCounter: Counter
    __counter: typeof Counter
  }
}

interface ExtractCounterReturn {
  Counter: (page: string) => Counter
  initial?: typeof window.__initialCounter
}

export const extractCounter = (): ExtractCounterReturn => {
  return {
    Counter: (page) => {
      const newCounter = new window.__counter()
      const initialCounter = window.__initialCounter
      newCounter.init(initialCounter.guid, initialCounter.reqid, page)
      newCounter.setAdditionalParams(window.__initialCounter.additional)
      return newCounter
    },
    initial: window.__initialCounter,
  }
}
