import React from 'react'

import styles from './Search.module.css'

const Search = () => {
  return (
    <input
      className={styles.search}
      type="text"
      id="search"
      name="search"
      placeholder="Szukaj"
    />
  )
}

export default Search
