import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'

import lecturesReducer from '../features/lectures/lecturesSlice'
import searchReducer from '../components/search/searchSlice'

export function makeStore() {
  return configureStore({
    reducer: {
      lectures: lecturesReducer,
      search: searchReducer,
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
