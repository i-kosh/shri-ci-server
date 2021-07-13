import { red } from 'colors'

export const logError = (err: unknown): void => {
  if (err instanceof Error) {
    if (err.stack) {
      console.error(red(err.stack))
    } else {
      console.error(red(`${err.name}: ${err.message}`))
    }
  } else {
    console.error(err)
  }
}
