import { padZero } from '../../utils/padZero'

export const useStartDateAndDuration = (
  startDate?: string,
  duration?: string | number
): { startDateString: string; durationString: string } => {
  const date = startDate ? new Date(startDate) : null

  const getStartDateString = () => {
    if (!date) return ''

    // const monthsRU = [
    //   'янв',
    //   'фев',
    //   'мар',
    //   'апр',
    //   'май',
    //   'июн',
    //   'июл',
    //   'авг',
    //   'сен',
    //   'окт',
    //   'ноя',
    //   'дек',
    // ]

    const monthsEN = [
      'jan',
      'feb',
      'mar',
      'apr',
      'may',
      'jun',
      'jul',
      'aug',
      'sept',
      'oct',
      'nov',
      'dec',
    ]

    return `${date.getDate()} ${
      monthsEN[date.getMonth()]
    }, ${date.getHours()}:${padZero(date.getMinutes(), 2)}`
  }
  const getDurationString = () => {
    if (!duration) return ''

    const durationMinutes = parseInt(`${duration}`) / 1000 / 60

    const hours = Math.floor(durationMinutes / 60)
    const minutes = padZero(Math.floor(durationMinutes % 60), 2)

    if (hours === 0 && minutes === '00') {
      return 'Less than a minute'
    }

    return `${hours} h ${minutes} min`
  }

  return {
    startDateString: getStartDateString(),
    durationString: getDurationString(),
  }
}
