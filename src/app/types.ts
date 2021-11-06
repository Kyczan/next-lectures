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

interface ISearch<SearchType> {
  keys: SearchType[]
  value: string
}

export interface ISort<SortType> {
  key: SortType
  order: SortOrder
}
export interface IFilter<SearchType, SortType> {
  search: ISearch<SearchType>
  sort: ISort<SortType>
}

export interface IState<DataType, SearchType, SortType> {
  data: DataType[]
  filtered: DataType[]
  filter: IFilter<SearchType, SortType>
  fetch: IMethodState
  add: IMethodState
  update: IMethodState
  delete: IMethodState
}
