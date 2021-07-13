import { configureStore } from '@reduxjs/toolkit'
import { settingsSlice } from './settingsSlice'
import { buildsSlice } from './buildsSlice'
import { settingsApi } from './settingsApi'
import { buildsApi } from './buildsApi'
import { setupListeners } from '@reduxjs/toolkit/query'

export const store = configureStore({
  reducer: {
    settings: settingsSlice.reducer,
    builds: buildsSlice.reducer,
    [settingsApi.reducerPath]: settingsApi.reducer,
    [buildsApi.reducerPath]: buildsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(settingsApi.middleware, buildsApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
