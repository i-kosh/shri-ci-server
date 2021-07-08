import type { MetricsResponse } from '../types'
import { isDateBetween } from '../../utils/isDateBetween'

export const userAgentByPeriod = (
  data: MetricsResponse[],
  dateFrom: string,
  dateTo?: string
) => {
  const map = new Map<
    string,
    {
      value: number
      percent: number
    }
  >()

  const filtered = data.filter(
    (item) =>
      item.name === 'connect' &&
      item.additional.userAgent &&
      isDateBetween(item.timestamp, dateFrom, dateTo)
  )

  filtered.forEach((item) => {
    const userAgent = item.additional.userAgent

    const prevValue = map.get(userAgent) || {
      percent: 0,
      value: 0,
    }
    map.set(userAgent, {
      value: prevValue.value + 1,
      percent: Math.round(((prevValue.value + 1) / filtered.length) * 100),
    })
  })

  return Array.from(map).reduce((accum: any, val) => {
    accum.push({
      name: val[0],
      value: val[1].value,
      percent: val[1].percent,
    })

    return accum
  }, [])
}
