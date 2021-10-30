import { useState } from 'react'

const useToggle = (initialValue: boolean) => {
  const [value, setValue] = useState(initialValue)

  const toggle = (newValue?: boolean) => {
    setValue((currentValue) =>
      typeof newValue === 'boolean' ? newValue : !currentValue
    )
  }

  return [value, toggle] as const
}

export default useToggle
