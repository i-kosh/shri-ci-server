import type { QuantileMetric, MetricsResponse } from '../types'
import { quantile } from '../../utils/quantile'
import { isDateBetween } from '../../utils/isDateBetween'

export const timeSpendOnPages = (
  data: MetricsResponse[],
  dateFrom: string,
  dateTo?: string
): QuantileMetric[] | null => {
  const map = new Map<string, number[]>()

  data.forEach((val) => {
    if (
      val.name === 'timeSpend' &&
      isDateBetween(val.timestamp, dateFrom, dateTo)
    ) {
      const curr = map.get(val.page)
      if (!curr) {
        map.set(val.page, [val.value])
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
        title: `${dateFrom}${dateTo ? ` - ${dateTo}` : ''}`,
      })
    })

    return arr
  } else {
    return null
  }
}
