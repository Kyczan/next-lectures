import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import router from 'next/router'

import { makeStore } from '../../../../app/store'
import SpeakerPage from '../../../../pages/speakers/[id]/edit'

jest.mock('next/dist/client/router', () => require('next-router-mock'))

describe('/speakers/[id]/edit', () => {
  let store
  beforeEach(() => {
    store = makeStore()
  })

  it('renders', () => {
    router.push({
      pathname: 'speakers/[id]/edit',
      query: { id: 'a' },
    })
    render(
      <Provider store={store}>
        <SpeakerPage />
      </Provider>
    )
  })
})
