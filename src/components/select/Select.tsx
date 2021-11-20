import { useField } from 'formik'
import { useEffect, useState } from 'react'

import SelectSearch from 'react-select-search'

import styles from './Select.module.css'

interface ISelectProps {
  label: string
  name: string
  placeholder: string
  options: any
}

const Select = ({
  label,
  name,
  placeholder,
  options,
}: ISelectProps): JSX.Element => {
  const [field, meta, helpers] = useField(name)
  const { value } = meta
  const { setValue } = helpers
  const [localValue, setLocalValue] = useState(value?._id)

  useEffect(() => {
    setLocalValue(value?._id)
  }, [value])

  const handleFilter = (options) => {
    return (val) => {
      if (!val.length) {
        return options
      }
      return options.filter((item) =>
        item.name?.toLowerCase()?.includes(val.toLowerCase())
      )
    }
  }

  const handleChange = (val) => {
    const { data } = options.find((item) => item.data._id === val)
    setLocalValue(val)
    setValue(data)
  }

  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <SelectSearch
        id={name}
        className={(key) => styles[key]}
        options={options}
        placeholder={placeholder}
        search
        filterOptions={handleFilter}
        onChange={handleChange}
        value={localValue}
        // printOptions="always"
      />
    </div>
  )
}

export default Select