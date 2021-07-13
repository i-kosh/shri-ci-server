import type { MetricName, QuantileMetric, MetricsResponse } from '../types'
import { quantile } from '../../utils/quantile'

export const calcMetricByDate = (
  data: MetricsResponse[],
  page: RegExp,
  name: MetricName,
  date: string
): QuantileMetric | null => {
  const sampleData = data
    .filter(
      (item) =>
        page.test(item.page) &&
        item.name === name &&
        item.timestamp.includes(date)
    )
    .map((item) => item.value)

  if (sampleData.length) {
    return {
      title: `${date}`,
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
