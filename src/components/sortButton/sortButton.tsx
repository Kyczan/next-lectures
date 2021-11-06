import { ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLongArrowAltUp,
  faLongArrowAltDown,
} from '@fortawesome/free-solid-svg-icons'

import { ISort, SortOrder } from '../../app/types'

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
      <FontAwesomeIcon icon={faLongArrowAltUp} />
    ) : (
      <FontAwesomeIcon icon={faLongArrowAltDown} />
    )

  const handleClick = (e) => {
    e.preventDefault()
    onClick(sortKey)
  }

  return (
    <a href="" onClick={handleClick}>
      {children} {showIndicator && indicatorType}
    </a>
  )
}

export default SortButton
