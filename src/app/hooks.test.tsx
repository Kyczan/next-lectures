import { Provider } from 'react-redux'
import { useRouter } from 'next/router'
import { renderHook, act } from '@testing-library/react-hooks'
import { fireEvent } from '@testing-library/react'
import {
  useToggle,
  useInfiniteScroll,
  useMsgOnSuccessAndFailure,
} from './hooks'
import { ApiCallStatuses } from './types'
import { resetDeleteStatus } from '../features/lectures/lecturesSlice'
import { makeStore } from './store'

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: () => ({
    push: jest.fn(() => Promise.resolve(true)),
  }),
}))

describe('useToggle', () => {
  it('allows to toggle value', () => {
    const { result } = renderHook(() => useToggle(false))
    act(() => {
      const toggle = result.current[1]
      toggle()
    })

    const value = result.current[0]
    expect(value).toBe(true)
  })

  it('allows to set value', () => {
    const { result } = renderHook(() => useToggle(false))
    act(() => {
      const toggle = result.current[1]
      toggle(true)
    })

    const value = result.current[0]
    expect(value).toBe(true)
  })
})

describe('useInfiniteScroll', () => {
  it('limits data', () => {
    const data = Array.from(Array(30).keys())
    const { result } = renderHook(() => useInfiniteScroll(data))
    const limitedData = result.current

    fireEvent.scroll(window, { target: { scrollY: 0 } })

    expect(limitedData.length).toEqual(12)
  })
})

describe('useMsgOnSuccessAndFailure', () => {
  let store
  beforeEach(() => {
    store = makeStore()
  })

  it('dispatch message on success', () => {
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )
    const data = [
      ApiCallStatuses.SUCCEEDED,
      resetDeleteStatus,
      'ok',
      'not ok',
      '/target',
    ] as const
    const { result } = renderHook(() => useMsgOnSuccessAndFailure(...data), {
      wrapper,
    })
    const onceSucceeded = result.current

    expect(onceSucceeded).toBe(true)
  })

  it('dispatch message on failure', () => {
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )
    const data = [
      ApiCallStatuses.FAILED,
      resetDeleteStatus,
      'ok',
      'not ok',
      '/target',
    ] as const
    const { result } = renderHook(() => useMsgOnSuccessAndFailure(...data), {
      wrapper,
    })
    const onceSucceeded = result.current

    expect(onceSucceeded).toBe(false)
  })
})
