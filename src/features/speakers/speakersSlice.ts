import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { AppState } from '../../app/store'
import { ApiCallStatuses, SortOrder, IState } from '../../app/types'
import { applyFilter } from '../../utils/filter/applyFilter'
import { IPlanDataItem } from '../plan/planSlice'

export interface ISpeakersDataItem {
  _id: string
  name: string
  congregation?: string
  note?: string
  lastEvent?: IPlanDataItem
}

export type ISpeakersSearchKeys = 'name' | 'congregation' | 'note'
export type ISpeakersSortKeys = 'name' | 'congregation' | 'lastEvent.date'

export const fetchSpeakers = createAsyncThunk('speakers/fetch', async () => {
  const response = await fetch('/api/speakers')
  if (!response.ok) {
    throw response.statusText
  }
  const data = await response.json()
  return data as ISpeakersDataItem[]
})

export const addSpeaker = createAsyncThunk(
  'speakers/add',
  async (addData: ISpeakersDataItem) => {
    const response = await fetch('/api/speakers', {
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
    return data as ISpeakersDataItem
  }
)

export const updateSpeaker = createAsyncThunk(
  'speakers/update',
  async (updateData: ISpeakersDataItem) => {
    const { _id, ...body } = updateData
    const response = await fetch(`/api/speakers/${_id}`, {
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
    return data as ISpeakersDataItem
  }
)

export const deleteSpeaker = createAsyncThunk(
  'speakers/delete',
  async (deleteData: ISpeakersDataItem) => {
    const { _id } = deleteData
    const response = await fetch(`/api/speakers/${_id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw response.statusText
    }
    return _id
  }
)

export const initialState: IState<
  ISpeakersDataItem,
  ISpeakersSearchKeys,
  ISpeakersSortKeys
> = {
  data: [],
  filtered: [],
  filter: {
    search: {
      keys: ['name', 'congregation', 'note'],
      value: '',
    },
    sort: {
      key: 'name',
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
  name: 'speakers',
  initialState,
  reducers: {
    setSearch(state, action) {
      state.filter.search.value = action.payload
      state.filtered = applyFilter<ISpeakersDataItem>(state.data, state.filter)
    },
    setSort(state, action) {
      state.filter.sort.key = action.payload.key
      state.filter.sort.order = action.payload.order
      state.filtered = applyFilter<ISpeakersDataItem>(state.data, state.filter)
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
      .addCase(fetchSpeakers.pending, (state) => {
        state.fetch.status = ApiCallStatuses.LOADING
      })
      .addCase(fetchSpeakers.fulfilled, (state, action) => {
        state.fetch.status = ApiCallStatuses.SUCCEEDED
        state.data = action.payload
        state.filtered = applyFilter<ISpeakersDataItem>(
          state.data,
          state.filter
        )
      })
      .addCase(fetchSpeakers.rejected, (state, action) => {
        state.fetch.status = ApiCallStatuses.FAILED
        state.fetch.error = action.error.message
      })

      // add
      .addCase(addSpeaker.pending, (state) => {
        state.add.status = ApiCallStatuses.LOADING
      })
      .addCase(addSpeaker.fulfilled, (state, action) => {
        state.add.status = ApiCallStatuses.SUCCEEDED
        state.data.push(action.payload)
        state.filtered = applyFilter<ISpeakersDataItem>(
          state.data,
          state.filter
        )
      })
      .addCase(addSpeaker.rejected, (state, action) => {
        state.add.status = ApiCallStatuses.FAILED
        state.add.error = action.error.message
      })

      // update
      .addCase(updateSpeaker.pending, (state) => {
        state.update.status = ApiCallStatuses.LOADING
      })
      .addCase(updateSpeaker.fulfilled, (state, action) => {
        state.update.status = ApiCallStatuses.SUCCEEDED
        const id = action.payload._id
        const index = state.data.findIndex((item) => item._id === id)
        if (index !== -1)
          state.data[index] = {
            ...state.data[index],
            ...action.payload,
          }
        state.filtered = applyFilter<ISpeakersDataItem>(
          state.data,
          state.filter
        )
      })
      .addCase(updateSpeaker.rejected, (state, action) => {
        state.update.status = ApiCallStatuses.FAILED
        state.update.error = action.error.message
      })

      // delete
      .addCase(deleteSpeaker.pending, (state) => {
        state.delete.status = ApiCallStatuses.LOADING
      })
      .addCase(deleteSpeaker.fulfilled, (state, action) => {
        state.delete.status = ApiCallStatuses.SUCCEEDED
        const id = action.payload
        const index = state.data.findIndex((item) => item._id === id)
        if (index !== -1) state.data.splice(index, 1)
        state.filtered = applyFilter<ISpeakersDataItem>(
          state.data,
          state.filter
        )
      })
      .addCase(deleteSpeaker.rejected, (state, action) => {
        state.delete.status = ApiCallStatuses.FAILED
        state.delete.error = action.error.message
      })
  },
})

export const selectSpeakers = (
  state: AppState
): IState<ISpeakersDataItem, ISpeakersSearchKeys, ISpeakersSortKeys> =>
  state.speakers

export const selectSpeakerById =
  (id?: string) =>
  (state: AppState): ISpeakersDataItem =>
    id ? state.speakers.data.find((item) => item._id === id) : undefined

const { actions, reducer } = slice

export const {
  setSearch,
  setSort,
  resetAddStatus,
  resetUpdateStatus,
  resetDeleteStatus,
} = actions

export default reducer
