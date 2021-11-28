import { useEffect, ReactNode } from 'react'
import { signIn, useSession } from 'next-auth/client'

import styles from './Auth.module.css'

interface IAuth {
  children: ReactNode
}

const Auth = ({ children }: IAuth): JSX.Element => {
  const [session, loading] = useSession()
  const isUser = !!session?.user
  useEffect(() => {
    if (loading) return // Do nothing while loading
    if (!isUser) signIn('google') // If not authenticated, force log in
  }, [isUser, loading])

  if (isUser) {
    return <>{children}</>
  }

  // Loading
  return (
    <main
      className={`container ${styles.loading}`}
      aria-busy="true"
      data-testid="auth-loader"
    ></main>
  )
}

export default Auth
