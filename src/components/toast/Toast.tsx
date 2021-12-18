import { useEffect } from 'react'
import { FiAlertTriangle, FiCheckCircle } from 'react-icons/fi'
import { IoIosClose } from 'react-icons/io'

import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { resetToast, selectToast, ToastType } from './toastSlice'

import styles from './Toast.module.css'

const Toast = () => {
  const dispatch = useAppDispatch()
  const toast = useAppSelector(selectToast)
  const types = {
    [ToastType.ERROR]: <FiAlertTriangle />,
    [ToastType.SUCCESS]: <FiCheckCircle />,
  }

  // auto delete toast
  useEffect(() => {
    if (!toast) return

    const id = setTimeout(() => {
      dispatch(resetToast())
    }, 5000)

    return () => {
      clearTimeout(id)
    }
  }, [toast, dispatch])

  const handleDelete = () => {
    dispatch(resetToast())
  }

  if (!toast) return null
  return (
    <div className={styles.container}>
      <div className={`${styles.toast} ${styles[`toast-${toast.type}`]}`}>
        {types[toast.type]}
        <div>{toast.message}</div>
        <button
          className={`icon-button ${styles.close}`}
          onClick={handleDelete}
          data-testid="toast-del-btn"
        >
          <IoIosClose />
        </button>
      </div>
    </div>
  )
}

export default Toast
