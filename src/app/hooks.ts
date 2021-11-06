import { useState } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, AppState } from './store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector

export const useToggle = (initialValue: boolean) => {
  const [value, setValue] = useState(initialValue)

  const toggle = (newValue?: boolean) => {
    setValue((currentValue) =>
      typeof newValue === 'boolean' ? newValue : !currentValue
    )
  }

  return [value, toggle] as const
}
