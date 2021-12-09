import { useState, useEffect } from 'react'
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

export const useInfiniteScroll = <T>(data: T[]): T[] => {
  const increment = 12
  const [dataLimit, setDataLimit] = useState(increment)

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      if (
        scrollTop + clientHeight >= scrollHeight - 5 &&
        dataLimit < data.length
      ) {
        setDataLimit((d) => d + increment)
      }
    }

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [dataLimit, data, increment])

  return data.slice(0, dataLimit)
}
