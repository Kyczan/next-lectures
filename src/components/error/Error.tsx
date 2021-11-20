import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi'

import styles from './Error.module.css'

interface IErrorProps {
  onRefresh: () => void
}

const Error = ({ onRefresh }: IErrorProps): JSX.Element => {
  const handleRefresh = (e) => {
    e.preventDefault()
    onRefresh()
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <FiAlertTriangle className={styles.icon} />
        <div>Coś poszło nie tak. Spróbuj ponownie.</div>
        <a
          href=""
          onClick={handleRefresh}
          className={styles.refresh}
          data-testid="refresh"
        >
          <FiRefreshCw /> Odśwież
        </a>
      </div>
    </div>
  )
}

export default Error
