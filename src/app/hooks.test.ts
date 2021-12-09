import { renderHook, act } from '@testing-library/react-hooks'
import { fireEvent } from '@testing-library/react'
import { useToggle, useInfiniteScroll } from './hooks'

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
