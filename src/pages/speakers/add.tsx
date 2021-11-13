import type { NextPage } from 'next'
import Head from 'next/head'

import SpeakerEdit from '../../features/speakers/edit/SpeakerEdit'

const SpeakerPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Mówcy | Nowy</title>
      </Head>
      <SpeakerEdit />
    </>
  )
}

export default SpeakerPage
