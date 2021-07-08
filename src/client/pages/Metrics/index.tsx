import React, { FC, useEffect } from 'react'
import { DefaultLayout } from '../../layouts/Default'
import { statsURL } from '../../metrics/config'
import { calcMetricByDate } from '../../metrics/functions/calcMetricByDate'
import { resourcesLoading } from '../../metrics/functions/resourcesLoading'
import { timeSpendOnPages } from '../../metrics/functions/timeSpendOnPages'
import { showSession } from '../../metrics/functions/showSession'
import { compareMetric } from '../../metrics/functions/compareMetric'
import { userAgentByPeriod } from '../../metrics/functions/userAgentByPeriod'

export const MetricsPage: FC = () => {
  useEffect(() => {
    fetch(statsURL).then(async (resp) => {
      const { data } = await resp.json()

      console.log(
        `Статистика по времени от начала загрузки до сокрытия спиннера на любой странице за месяц:`
      )
      console.table(calcMetricByDate(data, /./, 'spinnerHide', '2021-07'))

      console.log(
        `Статистика по времени от начала загрузки до сокрытия спиннера на главной странице за месяц:`
      )
      console.table(calcMetricByDate(data, /\/$/, 'spinnerHide', '2021-07'))

      console.log(`Статистика по времени загрузки ресурсов за год:`)
      console.table(resourcesLoading(data, '2021'))

      console.log(
        `Статистика по времени которое пользователь проводит на странице, выборка за день:`
      )
      console.table(timeSpendOnPages(data, '2021-07-07'))

      console.log(
        `Статистика по конкретной сессии на любой странице (Largest Contentful Paint):`
      )
      console.table(
        showSession(data, /./, '5a8b498e-0549-4706-b67a-caaef7f8e2ea', 'lcp')
      )

      console.log(
        'Разница метрик (fcp на любой странице) за 2021-07-07 по сравнению с 2021-07-08, 2021-07-09 и 2021-07-10:'
      )
      console.table(
        compareMetric(
          calcMetricByDate(data, /./, 'fcp', '2021-07-07'),
          calcMetricByDate(data, /./, 'fcp', '2021-07-08'),
          calcMetricByDate(data, /./, 'fcp', '2021-07-09'),
          calcMetricByDate(data, /./, 'fcp', '2021-07-10')
        )
      )

      console.log('Статистика по useragent с 2021-07 по сегодня:')
      console.table(userAgentByPeriod(data, '2021-07'))
    })
  }, [])

  return (
    <DefaultLayout title="Metrics">
      Метрики в консоли (если перезагрузить с открытой консолью будут таблички)
    </DefaultLayout>
  )
}
