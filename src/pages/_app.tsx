import '@picocss/pico'
import '../styles/global.css'

import { Provider as ReduxProvider } from 'react-redux'
import type { AppProps } from 'next/app'

import store from '../app/store'
import Navbar from '../features/navbar/Navbar'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ReduxProvider store={store}>
      <Navbar />
      <main className="container">
        <Component {...pageProps} />
      </main>
    </ReduxProvider>
  )
}

export default MyApp
