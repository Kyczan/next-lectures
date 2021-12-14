import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AppState } from '../../app/store'

export enum ToastType {
  ERROR = 'error',
  SUCCESS = 'success',
}

interface IToastData {
  type: ToastType
  message: string
}

interface IToast {
  data: IToastData
}

export const initialState: IToast = {
  data: null,
}

export const slice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    setSuccessToast(state, action: PayloadAction<string>) {
      state.data = { type: ToastType.SUCCESS, message: action.payload }
    },
    setErrorToast(state, action: PayloadAction<string>) {
      state.data = { type: ToastType.ERROR, message: action.payload }
    },
    resetToast(state) {
      state.data = null
    },
  },
})

export const selectToast = (state: AppState) => state.toast.data

const { actions, reducer } = slice

export const { setSuccessToast, setErrorToast, resetToast } = actions

export default reducer
