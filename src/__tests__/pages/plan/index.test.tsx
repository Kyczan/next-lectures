import { render } from '@testing-library/react'
import { Provider } from 'react-redux'

import { makeStore } from '../../../app/store'
import Page from '../../../pages/plan/index'

describe('/plan', () => {
  let store
  beforeEach(() => {
    store = makeStore()
  })

  it('renders', () => {
    render(
      <Provider store={store}>
        <Page />
      </Provider>
    )
  })
})
