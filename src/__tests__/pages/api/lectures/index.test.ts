/**
 * @jest-environment ./customTestEnv
 */
import { createMocks } from 'node-mocks-http'

import lecturesHandler from '../../../../pages/api/lectures/index'
import Lecture from '../../../../models/Lecture'
import lecturesData from '../../../../../__mocks__/data/lectures.json'

jest.mock('../../../../utils/db/dbConnect', () => {
  return {
    __esModule: true,
    default: jest.fn(() => {}),
  }
})

jest.mock('../../../../utils/middleware/auth', () => {
  return {
    __esModule: true,
    default: jest.fn(() => {}),
  }
})

describe('/api/lectures', () => {
  it('handles GET requests with success', async () => {
    Lecture.find = jest.fn().mockResolvedValueOnce(lecturesData)
    const { req, res } = createMocks({
      method: 'GET',
    })

    await lecturesHandler(req, res)

    expect(res._getStatusCode()).toBe(200)
    expect(JSON.parse(res._getData())).toEqual(lecturesData)
  })

  it('handles GET requests with error', async () => {
    Lecture.find = jest.fn().mockRejectedValueOnce('Error')
    const { req, res } = createMocks({
      method: 'GET',
    })

    await lecturesHandler(req, res)

    expect(res._getStatusCode()).toBe(400)
  })

  it('handles POST requests with success', async () => {
    Lecture.create = jest.fn().mockResolvedValueOnce(lecturesData[0])
    const { req, res } = createMocks({
      method: 'POST',
      body: lecturesData[0],
    })

    await lecturesHandler(req, res)

    expect(res._getStatusCode()).toBe(201)
    expect(JSON.parse(res._getData())).toEqual(lecturesData[0])
  })

  it('handles POST requests with error', async () => {
    Lecture.create = jest.fn().mockRejectedValueOnce('Error')
    const { req, res } = createMocks({
      method: 'POST',
      body: lecturesData[0],
    })

    await lecturesHandler(req, res)

    expect(res._getStatusCode()).toBe(400)
  })

  it('handles another methods requests with error', async () => {
    const { req, res } = createMocks({
      method: 'PUT',
    })

    await lecturesHandler(req, res)

    expect(res._getStatusCode()).toBe(400)
  })
})
