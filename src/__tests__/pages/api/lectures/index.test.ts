// needs node env to run
import { createMocks } from 'node-mocks-http'

import lecturesHandler from '../../../../pages/api/lectures/index'

describe('/api/lectures', () => {
  it('handles requests', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    })

    await lecturesHandler(req, res)

    expect(res._getStatusCode()).toBe(200)
    // expect(JSON.parse(res._getData())).toEqual(
    //   expect.objectContaining({
    //     message: 'Your favorite animal is dog',
    //   })
    // )
  })
})
