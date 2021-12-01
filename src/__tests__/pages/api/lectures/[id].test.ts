/**
 * @jest-environment ./customTestEnv
 */
import { createMocks } from 'node-mocks-http'

import lecturesHandler from '../../../../pages/api/lectures/[id]'
import Lecture from '../../../../models/Lecture'
import lecturesData from '../../../../../__mocks__/data/lectures.json'

jest.mock('../../../../utils/db/dbConnect', () => {
  return {
    __esModule: true,
    default: jest.fn(() => {}),
  }
})

describe('/api/lectures/[id]', () => {
  it('handles PUT requests with success', async () => {
    Lecture.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(lecturesData[0])
    const { req, res } = createMocks({
      method: 'PUT',
      body: lecturesData[0],
      query: { id: lecturesData[0]._id },
    })

    await lecturesHandler(req, res)

    expect(res._getStatusCode()).toBe(200)
    expect(JSON.parse(res._getData())).toEqual(lecturesData[0])
  })

  it('handles PUT requests when no item is found', async () => {
    Lecture.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(null)
    const { req, res } = createMocks({
      method: 'PUT',
      body: {},
      query: { id: lecturesData[0]._id },
    })

    await lecturesHandler(req, res)

    expect(res._getStatusCode()).toBe(400)
  })

  it('handles PUT requests with error', async () => {
    Lecture.findByIdAndUpdate = jest.fn().mockRejectedValueOnce('Error')
    const { req, res } = createMocks({
      method: 'PUT',
      body: lecturesData[0],
      query: { id: lecturesData[0]._id },
    })

    await lecturesHandler(req, res)

    expect(res._getStatusCode()).toBe(400)
  })

  it('handles DELETE requests with success', async () => {
    Lecture.deleteOne = jest.fn().mockResolvedValueOnce(lecturesData[0])
    const { req, res } = createMocks({
      method: 'DELETE',
      query: { id: lecturesData[0]._id },
    })

    await lecturesHandler(req, res)

    expect(res._getStatusCode()).toBe(200)
    expect(JSON.parse(res._getData())).toEqual(lecturesData[0])
  })

  it('handles DELETE requests when no item is found', async () => {
    Lecture.deleteOne = jest.fn().mockResolvedValueOnce(null)
    const { req, res } = createMocks({
      method: 'DELETE',
      query: { id: lecturesData[0]._id },
    })

    await lecturesHandler(req, res)

    expect(res._getStatusCode()).toBe(400)
  })

  it('handles DELETE requests with error', async () => {
    Lecture.deleteOne = jest.fn().mockRejectedValueOnce('Error')
    const { req, res } = createMocks({
      method: 'DELETE',
      query: { id: lecturesData[0]._id },
    })

    await lecturesHandler(req, res)

    expect(res._getStatusCode()).toBe(400)
  })

  it('handles another methods requests with error', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    })

    await lecturesHandler(req, res)

    expect(res._getStatusCode()).toBe(400)
  })
})
