import { ReactChild } from 'react'

import styles from './ItemDetails.module.css'

interface IDataItem {
  name: string
  value: ReactChild
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
          <dd className={styles.def}>{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export default ItemDetails
