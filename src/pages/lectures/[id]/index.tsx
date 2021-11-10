import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'

import LectureView from '../../../features/lectures/view/LectureView'

const LecturePage: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  return (
    <>
      <Head>
        <title>Wykłady | Szczegóły</title>
      </Head>
      {typeof id === 'string' && <LectureView id={id} />}
    </>
  )
}

export default LecturePage
