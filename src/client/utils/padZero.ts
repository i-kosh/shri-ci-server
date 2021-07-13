export const padZero = (number: number, to: number): string => {
  return `${number}`.padStart(to, '0')
}
