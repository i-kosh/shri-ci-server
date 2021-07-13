import type { AdditionalParamName, MetricName } from './types'

type AdditionalParams = Record<AdditionalParamName | string, string>

export default class Counter {
  constructor()
  public page: string
  public readonly guid: string
  public readonly reqid: string
  public readonly counterUrl: string
  public readonly additional: AdditionalParams
  public init: (guid: string, reqid: string, page: string) => void
  /**
   * Отправка счётчика. Основной транспорт - sendBeacon, запасной - XMLHttpRequest. Быстро поступающие одиночные события
   * накапливаются и отправляются пачками по MAX_BATCH_COUNTERS штук.
   *
   * @param {String} name
   * @param {Number} value
   */
  public send: (name: MetricName | string, value: number) => void
  public setAdditionalParams: (additionalParams: AdditionalParams) => void
  public sendBatchRequest: () => void
}
