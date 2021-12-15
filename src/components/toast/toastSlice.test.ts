import { makeStore, AppStore } from '../../app/store'

import {
  setSuccessToast,
  setErrorToast,
  resetToast,
  selectToast,
  ToastType,
} from './toastSlice'

describe('toastSlice', () => {
  let store: AppStore
  beforeEach(() => {
    store = makeStore()
    fetchMock.resetMocks()
  })

  it('setSuccessToast', async () => {
    const expectedState = {
      type: ToastType.SUCCESS,
      message: 'Success',
    }
    await store.dispatch(setSuccessToast('Success'))
    const appState = store.getState()

    expect(appState.toast.data).toEqual(expectedState)
  })

  it('setErrorToast', async () => {
    const expectedState = {
      type: ToastType.ERROR,
      message: 'Error',
    }
    await store.dispatch(setErrorToast('Error'))
    const appState = store.getState()

    expect(appState.toast.data).toEqual(expectedState)
  })

  it('resetToast', async () => {
    const expectedState = {
      type: ToastType.ERROR,
      message: 'Error',
    }
    await store.dispatch(setErrorToast('Error'))
    let appState = store.getState()

    expect(appState.toast.data).toEqual(expectedState)

    await store.dispatch(resetToast())
    appState = store.getState()

    expect(appState.toast.data).toEqual(null)
  })

  it('handles selectToast', async () => {
    const expectedState = {
      type: ToastType.ERROR,
      message: 'Error',
    }
    await store.dispatch(setErrorToast('Error'))
    const appState = store.getState()

    const data = selectToast(appState)
    expect(data).toEqual(expectedState)
  })
})
