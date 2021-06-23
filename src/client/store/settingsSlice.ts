import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './index'

export interface SettingsState {
  values: {
    reponame: string
    command: string
    branch?: string
    minutes?: string
  }
}

const initialState: SettingsState = {
  values: {
    reponame: '',
    command: '',
    branch: '',
    minutes: '',
  },
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<SettingsState['values']>) => {
      state.values = action.payload
    },
  },
})

export const { setSettings } = settingsSlice.actions

export const selectSettings = (state: RootState): SettingsState['values'] =>
  state.settings.values
