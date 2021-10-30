import { ReactNode } from 'react'
import * as ReactModal from 'react-modal'

import styles from './Modal.module.css'

ReactModal.setAppElement('#__next')

interface IModal {
  isOpen: boolean
  onRequestClose: () => void
  children: ReactNode
}

const Modal = ({ isOpen, onRequestClose, children }: IModal): JSX.Element => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <div className={styles.content}>{children}</div>
    </ReactModal>
  )
}

export default Modal
