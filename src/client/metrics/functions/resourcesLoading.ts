import type { QuantileMetric, MetricsResponse } from '../types'
import { quantile } from '../../utils/quantile'

export const resourcesLoading = (
  data: MetricsResponse[],
  date: string
): QuantileMetric[] | null => {
  const map = new Map<string, number[]>()
  const oneDay = 1000 * 60 * 60 * 24
  const dateParsed = new Date(date).valueOf()

  data.forEach((val) => {
    const valDateParsed = new Date(val.timestamp).valueOf()
    const isSameDay = dateParsed - valDateParsed < oneDay

    if (val.name.startsWith('/') && isSameDay) {
      const curr = map.get(val.name)
      if (!curr) {
        map.set(val.name, [val.value])
      } else {
        curr.push(val.value)
      }
    }
  })

  if (map.size) {
    const arr: QuantileMetric[] = []

    map.forEach((val, key) => {
      arr.push({
        metricName: key,
        p25: quantile(val, 0.25),
        p50: quantile(val, 0.5),
        p75: quantile(val, 0.75),
        p95: quantile(val, 0.95),
        title: date,
      })
    })

    return arr
  } else {
    return null
  }
}
