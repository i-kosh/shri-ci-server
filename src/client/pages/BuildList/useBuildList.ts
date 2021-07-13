import { useEffect } from 'react'
import {
  useLazyFetchBuildsListQuery,
  useFetchBuildsListQuery,
} from '../../store/buildsApi'
import {
  selectBuildsList,
  addBuildsList,
  setBuildsList,
} from '../../store/buildsSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'

export const useBuildList = () => {
  const loadingLimit = 25
  const dispatch = useAppDispatch()
  const buildList = useAppSelector(selectBuildsList)
  const result = useFetchBuildsListQuery(
    { limit: loadingLimit },
    {
      // Пока придется без кеша, т.к непонятно как инвалидировать если изменился статус билда
      refetchOnMountOrArgChange: true,
    }
  )
  const [fetchBuilds, lazyResult] = useLazyFetchBuildsListQuery()

  useEffect(() => {
    if (result.data) {
      dispatch(setBuildsList(result.data))
    }
  }, [result.data])

  useEffect(() => {
    if (lazyResult.data) {
      dispatch(addBuildsList(lazyResult.data))
    }
  }, [lazyResult.data])

  const lazyDataLessWhenLimit =
    lazyResult.data && lazyResult.data.length < loadingLimit
  const dataLessWhenLimit = result.data && result.data.length < loadingLimit

  return {
    fetchBuilds,
    noMoreBuilds:
      buildList.length < loadingLimit ||
      dataLessWhenLimit ||
      lazyDataLessWhenLimit,
    buildList,
    loadingLimit,
    isLoading: result.isLoading,
  }
}
