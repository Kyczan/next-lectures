import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'

import SpeakerEdit from '../../../features/speakers/edit/SpeakerEdit'

const SpeakerPage: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  return (
    <>
      <Head>
        <title>Mówcy | Edycja</title>
      </Head>
      {typeof id === 'string' && <SpeakerEdit id={id} />}
    </>
  )
}

export default SpeakerPage
