import type { NextApiHandler } from 'next'
import { getSession } from 'next-auth/client'

const authMiddleware: NextApiHandler = async (req, res) => {
  const session = await getSession({ req })

  // if (!session) {
  //   // Not Signed in
  //   res.status(401)
  //   res.end()
  // }
}

export default authMiddleware
