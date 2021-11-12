/**
 * @jest-environment ./customTestEnv
 */
import mongoose from 'mongoose'

import dbConnect from './dbConnect'

describe('dbConnect', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
  })

  afterAll(() => {
    process.env = OLD_ENV
  })

  it('returns connection when url provided', async () => {
    const mongooseConnectMockFn = jest.fn().mockResolvedValueOnce({})
    mongoose.connect = mongooseConnectMockFn
    process.env.MONGODB_URI = 'test'

    await dbConnect()
    // second invoke should use existing connection
    await dbConnect()

    expect(mongooseConnectMockFn).toHaveBeenCalledTimes(1)
  })

  it('throws error when no db url provided', async () => {
    await expect(dbConnect()).rejects.toThrow(
      'Please define the MONGODB_URI environment variable inside .env.local'
    )
  })
})
