import Link from 'next/link'
import { FiPlus } from 'react-icons/fi'

import styles from './AddButton.module.css'

interface IAddButtonProps {
  href: string
}

const AddButton = ({ href }: IAddButtonProps): JSX.Element => {
  return (
    <Link href={href}>
      <a role="button" className={`${styles.button} with-icon`}>
        <FiPlus />
        Dodaj
      </a>
    </Link>
  )
}

export default AddButton
