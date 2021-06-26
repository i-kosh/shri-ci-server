import { useEffect, useState } from 'react'

export const useWasTrue = (dep: unknown) => {
  const [wasTrue, setWasTrue] = useState(false)

  useEffect(() => {
    if (!wasTrue && dep) {
      setWasTrue(true)
    }
  }, [dep])

  return wasTrue
}
