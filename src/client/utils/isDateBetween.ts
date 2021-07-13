export const isDateBetween = (
  date: string | number,
  from: string | number,
  to: string | number = new Date().toUTCString()
): boolean => {
  const dateParsed = new Date(date).valueOf()
  const fromParsed = new Date(from).valueOf()
  const toParsed = new Date(to).valueOf()

  return fromParsed <= dateParsed && dateParsed <= toParsed
}
