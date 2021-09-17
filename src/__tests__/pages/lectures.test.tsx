import { render } from '@testing-library/react'
import { Provider } from 'react-redux'

import { makeStore } from '../../app/store'
import LecturesPage from '../../pages/lectures'

describe('LecturesPage', () => {
  let store
  beforeEach(() => {
    store = makeStore()
    fetchMock.resetMocks()
  })

  it('renders', () => {
    render(
      <Provider store={store}>
        <LecturesPage />
      </Provider>
    )
  })
})
