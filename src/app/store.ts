import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'

import lecturesReducer from '../features/lectures/lecturesSlice'
import speakersReducer from '../features/speakers/speakersSlice'
import planReducer from '../features/plan/planSlice'
import toastReducer from '../components/toast/toastSlice'

export function makeStore() {
  return configureStore({
    reducer: {
      lectures: lecturesReducer,
      speakers: speakersReducer,
      plan: planReducer,
      toast: toastReducer,
    },
  })
}

const store = makeStore()

export type AppStore = typeof store

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>

export default store
