import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import router from 'next/router'

import { makeStore } from '../../../../app/store'
import Page from '../../../../pages/plan/[id]/edit'

jest.mock('next/dist/client/router', () => require('next-router-mock'))

describe('/plan/[id]/edit', () => {
  let store
  beforeEach(() => {
    store = makeStore()
  })

  it('renders', () => {
    router.push({
      pathname: 'plan/[id]/edit',
      query: { id: 'a' },
    })
    render(
      <Provider store={store}>
        <Page />
      </Provider>
    )
  })
})
