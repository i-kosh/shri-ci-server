import { padZero } from '../../utils/padZero'

export const useStartDateAndDuration = (
  startDate?: string,
  duration?: string | number
): { startDateString: string; durationString: string } => {
  const date = startDate ? new Date(startDate) : null

  const getStartDateString = () => {
    if (!date) return ''

    const monthsRU = [
      'янв',
      'фев',
      'мар',
      'апр',
      'май',
      'июн',
      'июл',
      'авг',
      'сен',
      'окт',
      'ноя',
      'дек',
    ]

    return `${date.getDate()} ${
      monthsRU[date.getMonth()]
    }, ${date.getHours()}:${padZero(date.getMinutes(), 2)}`
  }
  const getDurationString = () => {
    if (!duration) return ''

    const durationMinutes = parseInt(`${duration}`) / 1000 / 60

    const hours = Math.floor(durationMinutes / 60)
    const minutes = padZero(Math.floor(durationMinutes % 60), 2)

    return `${hours} ч ${minutes} мин`
  }

  return {
    startDateString: getStartDateString(),
    durationString: getDurationString(),
  }
}
