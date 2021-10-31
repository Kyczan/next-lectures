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

interface IFetchMethodState<T> extends IMethodState {
  data: T[]
}

interface ISearch {
  keys: string[]
  value: string
}

interface ISort {
  key: string
  order: SortOrder
}
interface IFilter {
  search: ISearch
  sort: ISort
}

export interface IState<T> {
  filtered: T[]
  filter: IFilter
  fetch: IFetchMethodState<T>
  add: IMethodState
  update: IMethodState
  delete: IMethodState
}
