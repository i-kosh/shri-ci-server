import type { QuantileMetric, QuantileMetricDiff } from '../types'

export const compareMetric = (
  ...args: Array<QuantileMetric | null>
): QuantileMetricDiff[] => {
  if (!args || args.length < 2) return []

  const diffs: QuantileMetricDiff[] = []

  const compare = args[0]
  for (let i = 1; i < args.length; i++) {
    const metric = args[i]

    if (compare && metric) {
      diffs.push({
        title:
          compare.title !== metric.title
            ? `${compare.title} - ${metric.title}`
            : metric.title,
        metricName:
          compare.metricName !== metric.metricName
            ? `${compare.metricName} diff:(${metric.metricName})`
            : metric.metricName,
        p25: compare.p25 - metric.p25,
        p50: compare.p50 - metric.p50,
        p75: compare.p75 - metric.p75,
        p95: compare.p95 - metric.p95,
        hits: compare.hits && metric.hits && compare.hits - metric.hits,

        compare,
        metric,
      })
    }
  }

  return diffs
}
