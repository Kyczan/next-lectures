import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { AppState } from '../../app/store'
import { ApiCallStatuses, SortOrder, IState } from '../../app/types'
import { applyFilter } from '../../utils/filter/applyFilter'

export interface IPlanDataItem {
  _id: string
  date: string
  lecture?: string
  note?: string
  speaker?: string
  congregation?: string
}

export type IPlanSearchKeys =
  | 'date'
  | 'lecture'
  | 'note'
  | 'speaker'
  | 'congregation'
export type IPlanSortKeys = 'date'

export const fetchPlan = createAsyncThunk('plan/fetch', async () => {
  const response = await fetch('/api/plan')
  if (!response.ok) {
    throw response.statusText
  }
  const data = await response.json()
  return data as IPlanDataItem[]
})

export const addPlan = createAsyncThunk(
  'plan/add',
  async (addData: IPlanDataItem) => {
    const response = await fetch('/api/plan', {
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
    return data as IPlanDataItem
  }
)

export const updatePlan = createAsyncThunk(
  'plan/update',
  async (updateData: IPlanDataItem) => {
    const { _id, ...body } = updateData
    const response = await fetch(`/api/plan/${_id}`, {
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
    return data as IPlanDataItem
  }
)

export const deletePlan = createAsyncThunk(
  'plan/delete',
  async (deleteData: IPlanDataItem) => {
    const { _id } = deleteData
    const response = await fetch(`/api/plan/${_id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw response.statusText
    }
    return _id
  }
)

export const initialState: IState<
  IPlanDataItem,
  IPlanSearchKeys,
  IPlanSortKeys
> = {
  data: [],
  filtered: [],
  filter: {
    search: {
      keys: ['date', 'lecture', 'note', 'speaker', 'congregation'],
      value: '',
    },
    sort: {
      key: 'date',
      order: SortOrder.DESC,
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
  name: 'plan',
  initialState,
  reducers: {
    setSearch(state, action) {
      state.filter.search.value = action.payload
      state.filtered = applyFilter<IPlanDataItem>(state.data, state.filter)
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchPlan.pending, (state) => {
        state.fetch.status = ApiCallStatuses.LOADING
      })
      .addCase(fetchPlan.fulfilled, (state, action) => {
        state.fetch.status = ApiCallStatuses.SUCCEEDED
        state.data = action.payload
        state.filtered = applyFilter<IPlanDataItem>(state.data, state.filter)
      })
      .addCase(fetchPlan.rejected, (state, action) => {
        state.fetch.status = ApiCallStatuses.FAILED
        state.fetch.error = action.error.message
      })

      // add
      .addCase(addPlan.pending, (state) => {
        state.add.status = ApiCallStatuses.LOADING
      })
      .addCase(addPlan.fulfilled, (state, action) => {
        state.add.status = ApiCallStatuses.IDLE
        state.data.push(action.payload)
        state.filtered = applyFilter<IPlanDataItem>(state.data, state.filter)
      })
      .addCase(addPlan.rejected, (state, action) => {
        state.add.status = ApiCallStatuses.FAILED
        state.add.error = action.error.message
      })

      // update
      .addCase(updatePlan.pending, (state) => {
        state.update.status = ApiCallStatuses.LOADING
      })
      .addCase(updatePlan.fulfilled, (state, action) => {
        state.update.status = ApiCallStatuses.IDLE
        const id = action.payload._id
        const index = state.data.findIndex((item) => item._id === id)
        if (index !== -1) state.data[index] = action.payload
        state.filtered = applyFilter<IPlanDataItem>(state.data, state.filter)
      })
      .addCase(updatePlan.rejected, (state, action) => {
        state.update.status = ApiCallStatuses.FAILED
        state.update.error = action.error.message
      })

      // delete
      .addCase(deletePlan.pending, (state) => {
        state.delete.status = ApiCallStatuses.LOADING
      })
      .addCase(deletePlan.fulfilled, (state, action) => {
        state.delete.status = ApiCallStatuses.IDLE
        const id = action.payload
        const index = state.data.findIndex((item) => item._id === id)
        if (index !== -1) state.data.splice(index, 1)
        state.filtered = applyFilter<IPlanDataItem>(state.data, state.filter)
      })
      .addCase(deletePlan.rejected, (state, action) => {
        state.delete.status = ApiCallStatuses.FAILED
        state.delete.error = action.error.message
      })
  },
})

export const selectPlan = (
  state: AppState
): IState<IPlanDataItem, IPlanSearchKeys, IPlanSortKeys> => state.plan

export const selectPlanById =
  (id?: string) =>
  (state: AppState): IPlanDataItem =>
    id ? state.plan.data.find((item) => item._id === id) : undefined

const { actions, reducer } = slice

export const { setSearch } = actions

export default reducer
