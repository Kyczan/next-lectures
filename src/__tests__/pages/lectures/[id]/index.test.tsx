import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import router from 'next/router'

import { makeStore } from '../../../../app/store'
import LecturePage from '../../../../pages/lectures/[id]/index'

jest.mock('next/dist/client/router', () => require('next-router-mock'))

describe('/lectures/[id]', () => {
  let store
  beforeEach(() => {
    store = makeStore()
  })

  it('renders', () => {
    router.push({
      pathname: 'lectures/[id]',
      query: { id: 'a' },
    })
    render(
      <Provider store={store}>
        <LecturePage />
      </Provider>
    )
  })
})
