import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './index'
import type { Build } from '../../types'

export interface BuildsState {
  list: Build[]
}

const initialState: BuildsState = {
  list: [],
}

export const buildsSlice = createSlice({
  name: 'builds',
  initialState,
  reducers: {
    setBuildsList: (state, action: PayloadAction<BuildsState['list']>) => {
      state.list = action.payload
    },
    addBuildsList: (state, action: PayloadAction<BuildsState['list']>) => {
      state.list = state.list.concat(action.payload)
    },
  },
})

export const { setBuildsList, addBuildsList } = buildsSlice.actions

export const selectBuildsList = (state: RootState): BuildsState['list'] =>
  state.builds.list
