import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'

import PlanView from '../../../features/plan/view/PlanView'

const Page: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  return (
    <>
      <Head>
        <title>Plan | Szczegóły</title>
      </Head>
      {typeof id === 'string' && <PlanView id={id} />}
    </>
  )
}

export default Page
