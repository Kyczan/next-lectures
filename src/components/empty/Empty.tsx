import Link from 'next/link'
import { FiInbox, FiPlus } from 'react-icons/fi'
import { BsInboxFill } from 'react-icons/bs'

import AddButton from '../buttons/addButton/AddButton'

import styles from './Empty.module.css'

interface IEmptyProps {
  href: string
}

const Empty = ({ href }: IEmptyProps): JSX.Element => {
  return (
    <>
      <AddButton href={href} />
      <div className={styles.container}>
        <div className={styles.content}>
          <BsInboxFill className={styles.icon} />
          <div>Niczego tu jeszcze nie ma</div>
          <Link href={href}>
            <a className={styles.add} data-testid="refresh">
              <FiPlus /> Dodaj
            </a>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Empty
