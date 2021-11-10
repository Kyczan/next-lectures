import { renderHook, act } from '@testing-library/react-hooks'
import { useToggle } from './hooks'

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
