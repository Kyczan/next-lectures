import Link from 'next/link'
import { ReactNode } from 'react'

import styles from './AddButton.module.css'

interface IAddButtonProps {
  href: string
  children: ReactNode
}

const AddButton = ({ href, children }: IAddButtonProps): JSX.Element => {
  return (
    <Link href={href}>
      <a role="button" className={styles.button}>
        {children}
      </a>
    </Link>
  )
}

export default AddButton
