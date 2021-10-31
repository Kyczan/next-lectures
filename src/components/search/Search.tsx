import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import styles from './Search.module.css'

interface ISearchProps {
  onChange: (value: string) => void
}

const Search = ({ onChange }: ISearchProps): JSX.Element => {
  const [value, setValue] = useState('')

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
      />
      {value && (
        <button className="outline secondary" onClick={resetSearch}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      )}
    </>
  )
}

export default Search
