import type { NextPage } from 'next'
import Head from 'next/head'

import PlanEdit from '../../features/plan/edit/PlanEdit'

const Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>Plan | Nowy</title>
      </Head>
      <PlanEdit />
    </>
  )
}

export default Page
