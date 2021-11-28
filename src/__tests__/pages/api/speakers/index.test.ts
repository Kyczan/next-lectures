/**
 * @jest-environment ./customTestEnv
 */
import { createMocks } from 'node-mocks-http'

import speakersHandler from '../../../../pages/api/speakers/index'
import Speaker from '../../../../models/Speaker'
import Plan from '../../../../models/Plan'
import speakersData from '../../../../../__mocks__/data/speakers.json'
import planData from '../../../../../__mocks__/data/plan.json'

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

describe('/api/speakers', () => {
  it('handles GET requests with success', async () => {
    Speaker.find = jest.fn().mockImplementationOnce(() => ({
      sort: jest.fn().mockImplementationOnce(() => ({
        lean: jest.fn().mockResolvedValueOnce(speakersData),
      })),
    }))
    Plan.find = jest.fn().mockImplementationOnce(() => ({
      sort: jest.fn().mockImplementationOnce(() => ({
        lean: jest.fn().mockResolvedValueOnce(planData),
      })),
    }))

    const { req, res } = createMocks({
      method: 'GET',
    })

    await speakersHandler(req, res)

    expect(res._getStatusCode()).toBe(200)
    expect(JSON.parse(res._getData())).toEqual(speakersData)
  })

  it('handles GET requests with error', async () => {
    Speaker.find = jest.fn().mockImplementationOnce(() => ({
      sort: jest.fn().mockImplementationOnce(() => ({
        lean: jest.fn().mockRejectedValueOnce('Error'),
      })),
    }))
    Plan.find = jest.fn().mockImplementationOnce(() => ({
      sort: jest.fn().mockImplementationOnce(() => ({
        lean: jest.fn().mockResolvedValueOnce(planData),
      })),
    }))

    const { req, res } = createMocks({
      method: 'GET',
    })

    await speakersHandler(req, res)

    expect(res._getStatusCode()).toBe(400)
  })

  it('handles POST requests with success', async () => {
    Speaker.create = jest.fn().mockResolvedValueOnce(speakersData[0])
    const { req, res } = createMocks({
      method: 'POST',
      body: speakersData[0],
    })

    await speakersHandler(req, res)

    expect(res._getStatusCode()).toBe(201)
    expect(JSON.parse(res._getData())).toEqual(speakersData[0])
  })

  it('handles POST requests with error', async () => {
    Speaker.create = jest.fn().mockRejectedValueOnce('Error')
    const { req, res } = createMocks({
      method: 'POST',
      body: speakersData[0],
    })

    await speakersHandler(req, res)

    expect(res._getStatusCode()).toBe(400)
  })

  it('handles another methods requests with error', async () => {
    const { req, res } = createMocks({
      method: 'PUT',
    })

    await speakersHandler(req, res)

    expect(res._getStatusCode()).toBe(400)
  })
})
