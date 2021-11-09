import { ReactNode } from 'react'
import { FaLongArrowAltUp, FaLongArrowAltDown } from 'react-icons/fa'

import { ISort, SortOrder } from '../../../app/types'

import styles from './sortButton.module.css'

interface ISortButtonProps<T> {
  onClick: (key: T) => void
  sortKey: T
  sortState: ISort<T>
  children: ReactNode
}

const SortButton = <T,>({
  onClick,
  sortKey,
  sortState,
  children,
}: ISortButtonProps<T>): JSX.Element => {
  const showIndicator = sortKey === sortState.key
  const indicatorType =
    sortState.order === SortOrder.ASC ? (
      <FaLongArrowAltUp data-testid="icon-up" />
    ) : (
      <FaLongArrowAltDown data-testid="icon-down" />
    )

  const handleClick = (e) => {
    e.preventDefault()
    onClick(sortKey)
  }

  return (
    <a href="" onClick={handleClick} className={styles['sort-button']}>
      {children} {showIndicator && indicatorType}
    </a>
  )
}

export default SortButton
