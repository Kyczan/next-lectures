import { useEffect, ReactNode } from 'react'
import { signIn, useSession } from 'next-auth/client'

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
    <main className="container">
      <article aria-busy="true" data-testid="auth-loader"></article>
    </main>
  )
}

export default Auth
