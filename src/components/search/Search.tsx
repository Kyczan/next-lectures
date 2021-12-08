import { useState } from 'react'
import { FiDelete } from 'react-icons/fi'

import styles from './Search.module.css'

interface ISearchProps {
  onChange: (value: string) => void
  init: string
}

const Search = ({ onChange, init }: ISearchProps): JSX.Element => {
  const [value, setValue] = useState(init)

  const handleChange = (e) => {
    setValue(e.target.value)
    onChange(e.target.value)
  }

  const resetSearch = () => {
    setValue('')
    onChange('')
  }

  return (
    <>
      <input
        className={styles.search}
        type="text"
        id="search"
        name="search"
        placeholder="Szukaj"
        value={value}
        onChange={handleChange}
        data-testid="search-input"
      />
      {value && (
        <button
          className="outline secondary"
          onClick={resetSearch}
          data-testid="search-delete-btn"
        >
          <FiDelete />
        </button>
      )}
    </>
  )
}

export default Search
