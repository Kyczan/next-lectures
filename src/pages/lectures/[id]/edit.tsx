import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'

import LectureEdit from '../../../features/lectures/LectureEdit'

const LecturesPage: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  return (
    <>
      <Head>
        <title>Wykłady | Edycja</title>
      </Head>
      {typeof id === 'string' && <LectureEdit id={id} />}
    </>
  )
}

export default LecturesPage
