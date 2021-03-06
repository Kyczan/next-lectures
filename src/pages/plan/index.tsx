import type { NextPage } from 'next'
import Head from 'next/head'

import Plan from '../../features/plan/Plan'

const Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>Plan</title>
      </Head>
      <Plan />
    </>
  )
}

export default Page
