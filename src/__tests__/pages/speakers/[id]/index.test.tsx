import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import router from 'next/router'

import { makeStore } from '../../../../app/store'
import SpeakerPage from '../../../../pages/speakers/[id]/index'

jest.mock('next/dist/client/router', () => require('next-router-mock'))

describe('/speakers/[id]', () => {
  let store
  beforeEach(() => {
    store = makeStore()
  })

  it('renders', () => {
    router.push({
      pathname: 'speakers/[id]',
      query: { id: 'a' },
    })
    render(
      <Provider store={store}>
        <SpeakerPage />
      </Provider>
    )
  })
})
