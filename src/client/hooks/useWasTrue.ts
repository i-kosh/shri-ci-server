import { useEffect, useState } from 'react'

export const useWasTrue = (dep: unknown): boolean => {
  const [wasTrue, setWasTrue] = useState(false)

  useEffect(() => {
    if (!wasTrue && dep) {
      setWasTrue(true)
    }
  }, [dep])

  return wasTrue
}
