import { useEffect } from 'react'
import { useLazyFetchBuildsListQuery } from '../../store/buildsApi'
import { selectBuildsList, addBuildsList } from '../../store/buildsSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'

export const useBuildList = () => {
  const loadingLimit = 25
  const dispatch = useAppDispatch()
  const buildList = useAppSelector(selectBuildsList)
  const [fetchBuilds, { data, isUninitialized }] = useLazyFetchBuildsListQuery()

  useEffect(() => {
    if (!buildList.length && isUninitialized)
      fetchBuilds({ limit: loadingLimit })

    if (data) {
      dispatch(addBuildsList(data))
    }
  }, [data])

  return {
    fetchBuilds,
    noMoreBuilds: data && data.length < loadingLimit,
    buildList,
    loadingLimit,
  }
}
