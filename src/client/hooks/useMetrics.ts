import { extractCounter } from '../metrics/utils/extractCounter'
import { useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'

const { Counter, initial } = extractCounter()

const useTimeSpendMetric = () => {
  const { pathname } = useLocation()
  const isInitial = useRef<boolean>(true)
  const pathMetrics = useRef<{
    start: number
    path: string
  }>({
    start: Date.now(),
    path: initial?.page || window.location.pathname,
  })

  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false
    } else {
      const counter = Counter(pathMetrics.current.path)
      counter.send('timeSpend', Date.now() - pathMetrics.current.start)

      pathMetrics.current = {
        path: pathname,
        start: Date.now(),
      }
    }
  }, [pathname])
}

export const useMetrics = () => {
  useTimeSpendMetric()
  const isSoinnerHideReported = useRef(false)

  return {
    onSpinnerHide: () => {
      if (!isSoinnerHideReported.current) {
        isSoinnerHideReported.current = true
        initial?.send(
          'spinnerHide',
          Date.now() - performance.timing.connectStart
        )
      }
    },
  }
}
