import type { BuildStatus } from '../../types'
import { BuildCardProps } from '../components/BuildCard'

export const getStatus = (status: BuildStatus): BuildCardProps['status'] => {
  switch (status) {
    case 'Success':
      return 'success'
    case 'Fail':
      return 'fail'
    case 'Waiting':
      return 'wait'
    case 'InProgress':
      return 'inProgress'
    default:
      return 'canceled'
  }
}
