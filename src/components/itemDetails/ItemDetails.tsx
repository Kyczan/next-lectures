import { ReactChild } from 'react'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'

import CopyButton from '../buttons/copyButton/CopyButton'
import GotoButton from '../buttons/gotoButton/GotoButton'

import styles from './ItemDetails.module.css'

interface IDataItem {
  name: string
  value: ReactChild
  href?: string
  copy?: string
}

interface IItemDetailsProps {
  data: IDataItem[]
}

const ItemDetails = ({ data }: IItemDetailsProps): JSX.Element => {
  return (
    <dl className={styles.list}>
      {data.map((item) => (
        <div key={item.name} className={styles.wrapper}>
          <dt className={styles.term}>
            <small>{item.name}</small>
          </dt>
          <dd className={styles.def}>
            {item.value} <GotoButton href={item.href} />{' '}
            {item.copy && <CopyButton text={item.copy} />}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export default ItemDetails
