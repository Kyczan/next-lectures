/**
 * @jest-environment ./customTestEnv
 */
import { createMocks } from 'node-mocks-http'

import planHandler from '../../../../pages/api/plan/index'
import Plan from '../../../../models/Plan'
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

describe('/api/plan', () => {
  it('handles GET requests with success', async () => {
    Plan.find = jest.fn().mockImplementationOnce(() => ({
      sort: jest.fn().mockImplementationOnce(() => ({
        lean: jest.fn().mockResolvedValueOnce(planData),
      })),
    }))
    const { req, res } = createMocks({
      method: 'GET',
    })

    await planHandler(req, res)

    expect(res._getStatusCode()).toBe(200)
    expect(JSON.parse(res._getData())).toEqual(planData)
  })

  it('handles GET requests with error', async () => {
    Plan.find = jest.fn().mockImplementationOnce(() => ({
      sort: jest.fn().mockImplementationOnce(() => ({
        lean: jest.fn().mockRejectedValueOnce('Error'),
      })),
    }))
    const { req, res } = createMocks({
      method: 'GET',
    })

    await planHandler(req, res)

    expect(res._getStatusCode()).toBe(400)
  })

  it('handles POST requests with success', async () => {
    Plan.create = jest.fn().mockResolvedValueOnce(planData[0])
    const { req, res } = createMocks({
      method: 'POST',
      body: planData[0],
    })

    await planHandler(req, res)

    expect(res._getStatusCode()).toBe(201)
    expect(JSON.parse(res._getData())).toEqual(planData[0])
  })

  it('handles POST requests with error', async () => {
    Plan.create = jest.fn().mockRejectedValueOnce('Error')
    const { req, res } = createMocks({
      method: 'POST',
      body: planData[0],
    })

    await planHandler(req, res)

    expect(res._getStatusCode()).toBe(400)
  })

  it('handles another methods requests with error', async () => {
    const { req, res } = createMocks({
      method: 'PUT',
    })

    await planHandler(req, res)

    expect(res._getStatusCode()).toBe(400)
  })
})
