import { render } from '@testing-library/react'
import client from 'next-auth/client'

import Auth from './Auth'

jest.mock('next-auth/client')

describe('<Auth />', () => {
  it('renders children when signed', () => {
    const mockSession = {
      user: { email: 'a', name: 'b', image: 'c' },
    }
    client.useSession = jest.fn().mockReturnValueOnce([mockSession, false])

    const { getByText } = render(<Auth>test</Auth>)

    expect(getByText('test')).toBeInTheDocument()
  })

  it('signs in when not signed', () => {
    const signInMockFn = jest.fn()
    const mockSession = {
      user: null,
    }
    client.useSession = jest.fn().mockReturnValueOnce([mockSession, false])
    client.signIn = signInMockFn

    render(<Auth>test</Auth>)

    expect(signInMockFn).toHaveBeenCalled()
  })

  it('renders loader when not signed yet', () => {
    client.useSession = jest.fn().mockReturnValueOnce([null, true])

    const { getByTestId } = render(<Auth>test</Auth>)

    expect(getByTestId('auth-loader')).toBeInTheDocument()
  })
})
