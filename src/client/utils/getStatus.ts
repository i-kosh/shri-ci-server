import type { Build } from '../../types'
import { BuildCardProps } from '../components/BuildCard'

export const getStatus = (
  status: Build['status']
): BuildCardProps['status'] => {
  switch (status) {
    case 'Success':
      return 'success'
    case 'Waiting':
      return 'wait'
    case 'InProgress':
      return 'wait'
    default:
      return 'fail'
  }
}
