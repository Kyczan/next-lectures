import { Provider } from 'react-redux'
import { render, fireEvent, waitFor } from '@testing-library/react'

import { makeStore } from '../../app/store'
import { setSuccessToast, setErrorToast } from './toastSlice'
import Toast from './Toast'

describe('<Toast />', () => {
  let store
  beforeEach(() => {
    store = makeStore()
  })
  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders success toast', async () => {
    const handleClick = () => {
      store.dispatch(setSuccessToast('Success'))
    }
    const { getByTestId, findByText } = render(
      <Provider store={store}>
        <button data-testid="btn" onClick={handleClick}>
          click
        </button>
        <Toast />
      </Provider>
    )

    const btn = getByTestId('btn')
    fireEvent.click(btn)

    const text = await findByText('Success')
    expect(text).toBeInTheDocument()
  })

  it('renders error toast', async () => {
    jest.useFakeTimers()
    const handleClick = () => {
      store.dispatch(setErrorToast('Error'))
    }
    const { getByTestId, findByText } = render(
      <Provider store={store}>
        <button data-testid="btn" onClick={handleClick}>
          click
        </button>
        <Toast />
      </Provider>
    )

    const btn = getByTestId('btn')
    fireEvent.click(btn)

    const text = await findByText('Error')
    expect(text).toBeInTheDocument()
  })

  it('dismisses on delete button click', async () => {
    const handleClick = () => {
      store.dispatch(setErrorToast('Error'))
    }
    const { getByTestId, findByText, findByTestId } = render(
      <Provider store={store}>
        <button data-testid="btn" onClick={handleClick}>
          click
        </button>
        <Toast />
      </Provider>
    )

    const btn = getByTestId('btn')
    fireEvent.click(btn)

    const text = await findByText('Error')
    expect(text).toBeInTheDocument()

    const delBtn = await findByTestId('toast-del-btn')
    fireEvent.click(delBtn)

    expect(text).not.toBeInTheDocument()
  })

  it('it clears toast after timeout', async () => {
    jest.useFakeTimers()
    jest.spyOn(global, 'setTimeout')
    const handleClick = () => {
      store.dispatch(setSuccessToast('Success'))
    }
    const { getByTestId } = render(
      <Provider store={store}>
        <button data-testid="btn" onClick={handleClick}>
          click
        </button>
        <Toast />
      </Provider>
    )

    const btn = getByTestId('btn')
    fireEvent.click(btn)

    jest.runAllTimers()

    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 5000)
  })
})
