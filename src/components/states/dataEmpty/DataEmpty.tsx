import Link from 'next/link'
import { FiPlus } from 'react-icons/fi'
import { BsInboxFill } from 'react-icons/bs'

import AddButton from '../../buttons/addButton/AddButton'

import styles from './DataEmpty.module.css'

interface IDataEmptyProps {
  href: string
}

const DataEmpty = ({ href }: IDataEmptyProps): JSX.Element => {
  return (
    <>
      <AddButton href={href} />
      <div className={styles.container}>
        <div className={styles.content}>
          <BsInboxFill className={styles.icon} />
          <div>Niczego tu jeszcze nie ma</div>
          <Link href={href}>
            <a className={styles.add} data-testid="data-empty-add">
              <FiPlus /> Dodaj
            </a>
          </Link>
        </div>
      </div>
    </>
  )
}

export default DataEmpty
