import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import { useAppDispatch } from '../../app/hooks'
import { filterData } from './searchSlice'

import styles from './Search.module.css'

interface ISearchProps {
  data: object[]
  keys: string[]
}

const Search = ({ data, keys }: ISearchProps): JSX.Element => {
  const [value, setValue] = useState('')
  const dispatch = useAppDispatch()

  useEffect(() => {
    const filterParams = {
      data,
      keys,
      value,
    }
    dispatch(filterData(filterParams))
  }, [value])

  const handleChange = (e) => {
    setValue(e.target.value)
  }

  const resetSearch = () => {
    setValue('')
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
