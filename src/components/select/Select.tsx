import { useField } from 'formik'
import { useEffect, useState } from 'react'
import SelectSearch from 'react-select-search'
import { FiDelete } from 'react-icons/fi'

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
  const { value, touched, error } = meta
  const { setValue } = helpers
  const aria = touched ? { 'aria-invalid': !!error } : {}
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

  const handleReset = () => {
    setLocalValue(null)
    setValue(null)
  }

  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <div className={styles['select-wrapper']}>
        <SelectSearch
          id={name}
          className={(key) => styles[key]}
          options={options}
          placeholder={placeholder}
          search
          filterOptions={handleFilter}
          onChange={handleChange}
          value={localValue}
          renderValue={(valueProps: any) => (
            <input {...valueProps} {...aria} data-testid="select" />
          )}
        />
        {localValue && (
          <button
            className="outline secondary"
            onClick={handleReset}
            data-testid="select-delete-btn"
          >
            <FiDelete />
          </button>
        )}
      </div>
      {touched && error ? (
        <div className={styles.error}>
          <small>{error}</small>
        </div>
      ) : null}
    </div>
  )
}

export default Select
