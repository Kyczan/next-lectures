import { render } from '@testing-library/react'

import Navbar from './Navbar'

jest.mock('next/dist/client/router', () => require('next-router-mock'))

describe('<Navbar>', () => {
  it('renders without crashing', () => {
    render(<Navbar />)
  })
})
