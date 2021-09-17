export enum ApiCallStatuses {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
}

interface IMethodState {
  status: ApiCallStatuses
  error: string | null
}

interface IFetchMethodState<T> extends IMethodState {
  data: T[]
}

export interface IState<T> {
  fetch: IFetchMethodState<T>
  add: IMethodState
  update: IMethodState
  delete: IMethodState
}
