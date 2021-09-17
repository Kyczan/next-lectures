import '@picocss/pico'
import '../styles/global.css'

import { useEffect } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { Provider as AuthProvider, signIn, useSession } from 'next-auth/client'
import type { AppProps } from 'next/app'

import store from '../app/store'
import Navbar from '../features/navbar/Navbar'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider session={pageProps.session}>
      <Auth>
        <ReduxProvider store={store}>
          <Navbar />
          <main className="container">
            <Component {...pageProps} />
          </main>
        </ReduxProvider>
      </Auth>
    </AuthProvider>
  )
}

interface IAuth {
  children: JSX.Element
}

function Auth({ children }: IAuth): JSX.Element {
  const [session, loading] = useSession()
  const isUser = !!session?.user
  useEffect(() => {
    if (loading) return // Do nothing while loading
    if (!isUser) signIn('google') // If not authenticated, force log in
  }, [isUser, loading])

  if (isUser) {
    return children
  }

  // Loading
  return (
    <main className="container">
      <article aria-busy="true"></article>
    </main>
  )
}

export default MyApp
