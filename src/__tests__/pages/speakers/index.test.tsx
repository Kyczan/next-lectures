import { render } from '@testing-library/react'
import { Provider } from 'react-redux'

import { makeStore } from '../../../app/store'
import SpeakersPage from '../../../pages/speakers/index'

describe('/speakers', () => {
  let store
  beforeEach(() => {
    store = makeStore()
  })

  it('renders', () => {
    render(
      <Provider store={store}>
        <SpeakersPage />
      </Provider>
    )
  })
})
