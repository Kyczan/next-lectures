import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import router from 'next/router'

import { makeStore } from '../../../../app/store'
import LecturePage from '../../../../pages/lectures/[id]/edit'

jest.mock('next/dist/client/router', () => require('next-router-mock'))

describe('/lectures/[id]/edit', () => {
  let store
  beforeEach(() => {
    store = makeStore()
  })

  it('renders', () => {
    router.push({
      pathname: 'lectures/[id]/edit',
      query: { id: 'a' },
    })
    render(
      <Provider store={store}>
        <LecturePage />
      </Provider>
    )
  })
})
