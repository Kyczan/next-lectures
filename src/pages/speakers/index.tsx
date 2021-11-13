import type { NextPage } from 'next'
import Head from 'next/head'

import Speakers from '../../features/speakers/Speakers'

const SpeakersPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Mówcy</title>
      </Head>
      <Speakers />
    </>
  )
}

export default SpeakersPage
