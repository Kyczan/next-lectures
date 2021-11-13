import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'

import PlanEdit from '../../../features/plan/edit/PlanEdit'

const Page: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  return (
    <>
      <Head>
        <title>Plan | Edycja</title>
      </Head>
      {typeof id === 'string' && <PlanEdit id={id} />}
    </>
  )
}

export default Page
