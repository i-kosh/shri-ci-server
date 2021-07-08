import type { MetricName, QuantileMetric, MetricsResponse } from '../types'
import { quantile } from '../../utils/quantile'
import { isDateBetween } from '../../utils/isDateBetween'

export const showMetricByPeriod = (
  data: MetricsResponse[],
  page: RegExp,
  name: MetricName,
  from: string,
  to?: string
): QuantileMetric | null => {
  const sampleData = data
    .filter((item) => {
      return (
        page.test(item.page) &&
        item.name === name &&
        isDateBetween(item.timestamp, from, to)
      )
    })
    .map((item) => item.value)

  if (sampleData.length) {
    return {
      title: `${from} - ${to}`,
      metricName: name,
      p25: quantile(sampleData, 0.25),
      p50: quantile(sampleData, 0.5),
      p75: quantile(sampleData, 0.75),
      p95: quantile(sampleData, 0.95),
      hits: sampleData.length,
    }
  } else {
    return null
  }
}
