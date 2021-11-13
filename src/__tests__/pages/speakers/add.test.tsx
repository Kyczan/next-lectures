import { render } from '@testing-library/react'
import { Provider } from 'react-redux'

import { makeStore } from '../../../app/store'
import SpeakerPage from '../../../pages/speakers/add'

describe('/speakers/add', () => {
  let store
  beforeEach(() => {
    store = makeStore()
  })

  it('renders', () => {
    render(
      <Provider store={store}>
        <SpeakerPage />
      </Provider>
    )
  })
})
