import '@picocss/pico'
import '../styles/global.css'

import { Provider as ReduxProvider } from 'react-redux'
import { Provider as AuthProvider } from 'next-auth/client'
import type { AppProps } from 'next/app'

import store from '../app/store'
import Navbar from '../features/navbar/Navbar'
import Auth from '../components/auth/Auth'
import Toast from '../components/toast/Toast'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider session={pageProps.session}>
      <Auth>
        <ReduxProvider store={store}>
          <Navbar />
          <main className="container">
            <Component {...pageProps} />
            <Toast />
          </main>
        </ReduxProvider>
      </Auth>
    </AuthProvider>
  )
}

export default MyApp
