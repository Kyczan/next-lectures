import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { AppState } from '../../app/store'
import { ApiCallStatuses, SortOrder, IState } from '../../app/types'
import { applyFilter } from '../../utils/filter/applyFilter'
import { IPlanDataItem } from '../plan/planSlice'

export interface ILecturesDataItem {
  _id: string
  number: string
  title: string
  note?: string
  lastEvent?: IPlanDataItem
}

export type ILecturesSearchKeys = 'number' | 'title' | 'note'
export type ILecturesSortKeys = 'number' | 'title' | 'lastEvent.date'

export const fetchLectures = createAsyncThunk('lectures/fetch', async () => {
  const response = await fetch('/api/lectures')
  if (!response.ok) {
    throw response.statusText
  }
  const data = await response.json()
  return data as ILecturesDataItem[]
})

export const addLecture = createAsyncThunk(
  'lectures/add',
  async (addData: ILecturesDataItem) => {
    const response = await fetch('/api/lectures', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addData),
    })
    if (!response.ok) {
      throw response.statusText
    }
    const data = await response.json()
    return data as ILecturesDataItem
  }
)

export const updateLecture = createAsyncThunk(
  'lectures/update',
  async (updateData: ILecturesDataItem) => {
    const { _id, ...body } = updateData
    const response = await fetch(`/api/lectures/${_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    if (!response.ok) {
      throw response.statusText
    }
    const data = await response.json()
    return data as ILecturesDataItem
  }
)

export const deleteLecture = createAsyncThunk(
  'lectures/delete',
  async (deleteData: ILecturesDataItem) => {
    const { _id } = deleteData
    const response = await fetch(`/api/lectures/${_id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw response.statusText
    }
    return _id
  }
)

export const initialState: IState<
  ILecturesDataItem,
  ILecturesSearchKeys,
  ILecturesSortKeys
> = {
  data: [],
  filtered: [],
  filter: {
    search: {
      keys: ['number', 'title', 'note'],
      value: '',
    },
    sort: {
      key: 'number',
      order: SortOrder.ASC,
    },
  },
  fetch: {
    status: ApiCallStatuses.IDLE,
    error: null,
  },
  add: {
    status: ApiCallStatuses.IDLE,
    error: null,
  },
  update: {
    status: ApiCallStatuses.IDLE,
    error: null,
  },
  delete: {
    status: ApiCallStatuses.IDLE,
    error: null,
  },
}

export const slice = createSlice({
  name: 'lectures',
  initialState,
  reducers: {
    setSearch(state, action) {
      state.filter.search.value = action.payload
      state.filtered = applyFilter<ILecturesDataItem>(state.data, state.filter)
    },
    setSort(state, action) {
      state.filter.sort.key = action.payload.key
      state.filter.sort.order = action.payload.order
      state.filtered = applyFilter<ILecturesDataItem>(state.data, state.filter)
    },
    resetAddStatus(state) {
      state.add = initialState.add
    },
    resetUpdateStatus(state) {
      state.update = initialState.update
    },
    resetDeleteStatus(state) {
      state.delete = initialState.delete
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchLectures.pending, (state) => {
        state.fetch.status = ApiCallStatuses.LOADING
      })
      .addCase(fetchLectures.fulfilled, (state, action) => {
        state.fetch.status = ApiCallStatuses.SUCCEEDED
        state.data = action.payload
        state.filtered = applyFilter<ILecturesDataItem>(
          state.data,
          state.filter
        )
      })
      .addCase(fetchLectures.rejected, (state, action) => {
        state.fetch.status = ApiCallStatuses.FAILED
        state.fetch.error = action.error.message
      })

      // add
      .addCase(addLecture.pending, (state) => {
        state.add.status = ApiCallStatuses.LOADING
      })
      .addCase(addLecture.fulfilled, (state, action) => {
        state.add.status = ApiCallStatuses.SUCCEEDED
        state.data.push(action.payload)
        state.filtered = applyFilter<ILecturesDataItem>(
          state.data,
          state.filter
        )
      })
      .addCase(addLecture.rejected, (state, action) => {
        state.add.status = ApiCallStatuses.FAILED
        state.add.error = action.error.message
      })

      // update
      .addCase(updateLecture.pending, (state) => {
        state.update.status = ApiCallStatuses.LOADING
      })
      .addCase(updateLecture.fulfilled, (state, action) => {
        state.update.status = ApiCallStatuses.SUCCEEDED
        const id = action.payload._id
        const index = state.data.findIndex((item) => item._id === id)
        if (index !== -1)
          state.data[index] = {
            ...state.data[index],
            ...action.payload,
          }
        state.filtered = applyFilter<ILecturesDataItem>(
          state.data,
          state.filter
        )
      })
      .addCase(updateLecture.rejected, (state, action) => {
        state.update.status = ApiCallStatuses.FAILED
        state.update.error = action.error.message
      })

      // delete
      .addCase(deleteLecture.pending, (state) => {
        state.delete.status = ApiCallStatuses.LOADING
      })
      .addCase(deleteLecture.fulfilled, (state, action) => {
        state.delete.status = ApiCallStatuses.SUCCEEDED
        const id = action.payload
        const index = state.data.findIndex((item) => item._id === id)
        if (index !== -1) state.data.splice(index, 1)
        state.filtered = applyFilter<ILecturesDataItem>(
          state.data,
          state.filter
        )
      })
      .addCase(deleteLecture.rejected, (state, action) => {
        state.delete.status = ApiCallStatuses.FAILED
        state.delete.error = action.error.message
      })
  },
})

export const selectLectures = (
  state: AppState
): IState<ILecturesDataItem, ILecturesSearchKeys, ILecturesSortKeys> =>
  state.lectures

export const selectLectureById =
  (id?: string) =>
  (state: AppState): ILecturesDataItem =>
    id ? state.lectures.data.find((item) => item._id === id) : undefined

const { actions, reducer } = slice

export const {
  setSearch,
  setSort,
  resetAddStatus,
  resetUpdateStatus,
  resetDeleteStatus,
} = actions

export default reducer
