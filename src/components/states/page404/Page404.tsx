import { ImFilePicture } from 'react-icons/im'

import styles from './Page404.module.css'

const Page404 = (): JSX.Element => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <ImFilePicture className={styles.icon} />
        <hgroup className={styles.title}>
          <h1>404</h1>
          <h3>Nie ma takiej strony</h3>
        </hgroup>
      </div>
    </div>
  )
}

export default Page404
