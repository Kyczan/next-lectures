import { render } from '@testing-library/react'
import { Provider } from 'react-redux'

import { makeStore } from '../../app/store'
import IndexPage from '../../pages/index'

describe('IndexPage', () => {
  let store
  beforeEach(() => {
    store = makeStore()
    fetchMock.resetMocks()
  })

  it('renders', () => {
    render(
      <Provider store={store}>
        <IndexPage />
      </Provider>
    )
  })
})
