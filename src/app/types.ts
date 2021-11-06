export enum ApiCallStatuses {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
}

export enum SortOrder {
  DESC = 'desc',
  ASC = 'asc',
}

interface IMethodState {
  status: ApiCallStatuses
  error: string | null
}

interface ISearch {
  keys: string[]
  value: string
}

interface ISort {
  key: string
  order: SortOrder
}
export interface IFilter {
  search: ISearch
  sort: ISort
}

export interface IState<T> {
  data: T[]
  filtered: T[]
  filter: IFilter
  fetch: IMethodState
  add: IMethodState
  update: IMethodState
  delete: IMethodState
}
