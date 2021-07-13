import { useEffect, useContext } from 'react'
import { useQueueBuildMutation } from '../store/buildsApi'
import { extractError } from '../utils/extractError'
import { ToastsContext } from '../components/ToastBox'
import { useHistory } from 'react-router-dom'

export const useQueueBuild = (): {
  isLoading: boolean
  queueNewBuild: ReturnType<typeof useQueueBuildMutation>[0]
} => {
  const [trigger, { data, error, isError, isLoading }] = useQueueBuildMutation()
  const toastCtx = useContext(ToastsContext)
  const history = useHistory()

  useEffect(() => {
    if (isError && toastCtx) {
      const err = extractError(error)

      toastCtx.add(5000, {
        msg: {
          text: err.message,
          props: {
            style: 'Error',
          },
        },
      })
    } else if (data) {
      history.push(`/build/${data.id}`)
    }
  }, [data, error])

  return {
    queueNewBuild: trigger,
    isLoading,
  }
}
