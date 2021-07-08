export type MetricName =
  | 'connect'
  | 'pageloadtime'
  | 'ttfb'
  | 'lcp'
  | 'fid'
  | 'fcp'
  | 'cls'
  | 'spinnerHide'
  | 'timeSpend'

export type AdditionalParamName = 'platform' | 'userAgent' | 'enviroment'

export interface MetricsResponse {
  requestId: string
  page: string
  name: MetricName
  value: number
  index: number
  timestamp: string
  additional: Record<AdditionalParamName, string>
}

export interface QuantileMetric {
  title: string
  metricName: string
  p25: number
  p50: number
  p75: number
  p95: number
  hits?: number
}

export type QuantileMetricDiff = QuantileMetric & {
  compare: QuantileMetric
  metric: QuantileMetric
}
