import { render } from '@testing-library/react'

import Navbar from './Navbar'

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
    }
  },
}))

describe('<Navbar>', () => {
  it('renders without crashing', () => {
    render(<Navbar />)
  })
})
