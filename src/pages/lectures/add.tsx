import type { NextPage } from 'next'
import Head from 'next/head'

import LectureEdit from '../../features/lectures/LectureEdit'

const LecturesPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Wykłady</title>
      </Head>
      <LectureEdit />
    </>
  )
}

export default LecturesPage
