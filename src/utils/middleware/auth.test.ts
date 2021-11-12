/**
 * @jest-environment ./customTestEnv
 */
import { createMocks } from 'node-mocks-http'
import client from 'next-auth/client'

import authMiddleware from './auth'

jest.mock('next-auth/client')

describe('authMiddleware', () => {
  it('returns 401 when no session is available', async () => {
    client.getSession = jest.fn().mockReturnValueOnce(null)
    const { req, res } = createMocks()

    await authMiddleware(req, res)

    expect(res._getStatusCode()).toBe(401)
  })
})
