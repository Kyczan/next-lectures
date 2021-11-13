import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'

import SpeakerView from '../../../features/speakers/view/SpeakerView'

const SpeakerPage: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  return (
    <>
      <Head>
        <title>Mówcy | Szczegóły</title>
      </Head>
      {typeof id === 'string' && <SpeakerView id={id} />}
    </>
  )
}

export default SpeakerPage
