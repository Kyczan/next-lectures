import { createSlice } from '@reduxjs/toolkit'
import type { AppState } from '../../app/store'

const filterDataFn = ({ data, keys, value }) => {
  return data.filter((item) =>
    keys.some((key) => item[key].toLowerCase().includes(value.toLowerCase()))
  )
}

export const initialState = {
  filtered: [],
}

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    filterData(state, action) {
      state.filtered = filterDataFn(action.payload)
    },
  },
})

export const selectFilteredData = (state: AppState) => state.search.filtered

const { actions, reducer } = searchSlice

export const { filterData } = actions

export default reducer
