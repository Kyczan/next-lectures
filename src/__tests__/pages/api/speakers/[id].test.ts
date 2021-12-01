/**
 * @jest-environment ./customTestEnv
 */
import { createMocks } from 'node-mocks-http'

import speakersHandler from '../../../../pages/api/speakers/[id]'
import Speaker from '../../../../models/Speaker'
import speakersData from '../../../../../__mocks__/data/speakers.json'

jest.mock('../../../../utils/db/dbConnect', () => {
  return {
    __esModule: true,
    default: jest.fn(() => {}),
  }
})

describe('/api/speakers/[id]', () => {
  it('handles PUT requests with success', async () => {
    Speaker.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(speakersData[0])
    const { req, res } = createMocks({
      method: 'PUT',
      body: speakersData[0],
      query: { id: speakersData[0]._id },
    })

    await speakersHandler(req, res)

    expect(res._getStatusCode()).toBe(200)
    expect(JSON.parse(res._getData())).toEqual(speakersData[0])
  })

  it('handles PUT requests when no item is found', async () => {
    Speaker.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(null)
    const { req, res } = createMocks({
      method: 'PUT',
      body: {},
      query: { id: speakersData[0]._id },
    })

    await speakersHandler(req, res)

    expect(res._getStatusCode()).toBe(400)
  })

  it('handles PUT requests with error', async () => {
    Speaker.findByIdAndUpdate = jest.fn().mockRejectedValueOnce('Error')
    const { req, res } = createMocks({
      method: 'PUT',
      body: speakersData[0],
      query: { id: speakersData[0]._id },
    })

    await speakersHandler(req, res)

    expect(res._getStatusCode()).toBe(400)
  })

  it('handles DELETE requests with success', async () => {
    Speaker.deleteOne = jest.fn().mockResolvedValueOnce(speakersData[0])
    const { req, res } = createMocks({
      method: 'DELETE',
      query: { id: speakersData[0]._id },
    })

    await speakersHandler(req, res)

    expect(res._getStatusCode()).toBe(200)
    expect(JSON.parse(res._getData())).toEqual(speakersData[0])
  })

  it('handles DELETE requests when no item is found', async () => {
    Speaker.deleteOne = jest.fn().mockResolvedValueOnce(null)
    const { req, res } = createMocks({
      method: 'DELETE',
      query: { id: speakersData[0]._id },
    })

    await speakersHandler(req, res)

    expect(res._getStatusCode()).toBe(400)
  })

  it('handles DELETE requests with error', async () => {
    Speaker.deleteOne = jest.fn().mockRejectedValueOnce('Error')
    const { req, res } = createMocks({
      method: 'DELETE',
      query: { id: speakersData[0]._id },
    })

    await speakersHandler(req, res)

    expect(res._getStatusCode()).toBe(400)
  })

  it('handles another methods requests with error', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    })

    await speakersHandler(req, res)

    expect(res._getStatusCode()).toBe(400)
  })
})
