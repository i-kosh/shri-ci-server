import type { MetricName, QuantileMetric, MetricsResponse } from '../types'
import { quantile } from '../../utils/quantile'

export const showSession = (
  data: MetricsResponse[],
  page: RegExp,
  requestId: string,
  name: MetricName
): QuantileMetric | null => {
  const sampleData = data
    .filter((item) => {
      return (
        item.requestId === requestId &&
        item.name === name &&
        page.test(item.page)
      )
    })
    .map((item) => item.value)

  if (sampleData.length) {
    return {
      title: `${requestId} - ${page}`,
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
