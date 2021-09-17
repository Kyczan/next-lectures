import type { NextPage } from 'next'
import Head from 'next/head'

import Lectures from '../../../features/lectures/Lectures'

const LecturesPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Wykłady</title>
      </Head>
      <Lectures />
    </>
  )
}

export default LecturesPage
