/**
 * @jest-environment ./customTestEnv
 */
import { createMocks } from 'node-mocks-http'

import planHandler from '../../../../pages/api/plan/[id]'
import Plan from '../../../../models/Plan'
import planData from '../../../../../__mocks__/data/plan.json'

jest.mock('../../../../utils/db/dbConnect', () => {
  return {
    __esModule: true,
    default: jest.fn(() => {}),
  }
})

describe('/api/plan/[id]', () => {
  it('handles PUT requests with success', async () => {
    Plan.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(planData[0])
    const { req, res } = createMocks({
      method: 'PUT',
      body: planData[0],
      query: { id: planData[0]._id },
    })

    await planHandler(req, res)

    expect(res._getStatusCode()).toBe(200)
    expect(JSON.parse(res._getData())).toEqual(planData[0])
  })

  it('handles PUT requests when no item is found', async () => {
    Plan.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(null)
    const { req, res } = createMocks({
      method: 'PUT',
      body: {},
      query: { id: planData[0]._id },
    })

    await planHandler(req, res)

    expect(res._getStatusCode()).toBe(400)
  })

  it('handles PUT requests with error', async () => {
    Plan.findByIdAndUpdate = jest.fn().mockRejectedValueOnce('Error')
    const { req, res } = createMocks({
      method: 'PUT',
      body: planData[0],
      query: { id: planData[0]._id },
    })

    await planHandler(req, res)

    expect(res._getStatusCode()).toBe(400)
  })

  it('handles DELETE requests with success', async () => {
    Plan.deleteOne = jest.fn().mockResolvedValueOnce(planData[0])
    const { req, res } = createMocks({
      method: 'DELETE',
      query: { id: planData[0]._id },
    })

    await planHandler(req, res)

    expect(res._getStatusCode()).toBe(200)
    expect(JSON.parse(res._getData())).toEqual(planData[0])
  })

  it('handles DELETE requests when no item is found', async () => {
    Plan.deleteOne = jest.fn().mockResolvedValueOnce(null)
    const { req, res } = createMocks({
      method: 'DELETE',
      query: { id: planData[0]._id },
    })

    await planHandler(req, res)

    expect(res._getStatusCode()).toBe(400)
  })

  it('handles DELETE requests with error', async () => {
    Plan.deleteOne = jest.fn().mockRejectedValueOnce('Error')
    const { req, res } = createMocks({
      method: 'DELETE',
      query: { id: planData[0]._id },
    })

    await planHandler(req, res)

    expect(res._getStatusCode()).toBe(400)
  })

  it('handles another methods requests with error', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    })

    await planHandler(req, res)

    expect(res._getStatusCode()).toBe(400)
  })
})
