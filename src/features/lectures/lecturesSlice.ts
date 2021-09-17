import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { AppState } from '../../app/store'
import { ApiCallStatuses, IState } from '../../app/types'

export interface ILecturesDataItem {
  _id: string
  number: number
  title: string
  note?: string
  lastDate?: string
  lastSpeaker?: string
}

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

export const initialState: IState<ILecturesDataItem> = {
  fetch: {
    data: [],
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchLectures.pending, (state) => {
        state.fetch.status = ApiCallStatuses.LOADING
      })
      .addCase(fetchLectures.fulfilled, (state, action) => {
        state.fetch.status = ApiCallStatuses.SUCCEEDED
        state.fetch.data = action.payload
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
        state.add.status = ApiCallStatuses.IDLE
        state.fetch.data.push(action.payload)
        // how to sort this? what if filter/sorter is already applied?
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
        state.update.status = ApiCallStatuses.IDLE
        const id = action.payload._id
        const index = state.fetch.data.findIndex((item) => item._id === id)
        if (index !== -1) state.fetch.data[index] = action.payload
        // how to sort this?
        // what if filter/sorter is already applied and order should change?
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
        state.delete.status = ApiCallStatuses.IDLE
        const id = action.payload
        const index = state.fetch.data.findIndex((item) => item._id === id)
        if (index !== -1) state.fetch.data.splice(index, 1)
      })
      .addCase(deleteLecture.rejected, (state, action) => {
        state.delete.status = ApiCallStatuses.FAILED
        state.delete.error = action.error.message
      })
  },
})

export const selectLectures = (state: AppState): IState<ILecturesDataItem> =>
  state.lectures

export default slice.reducer
