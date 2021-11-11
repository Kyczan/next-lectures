import { render } from '@testing-library/react'
import { Provider } from 'react-redux'

import { makeStore } from '../../../app/store'
import LecturesPage from '../../../pages/lectures/add'

describe('/lectures/add', () => {
  let store
  beforeEach(() => {
    store = makeStore()
  })

  it('renders', () => {
    render(
      <Provider store={store}>
        <LecturesPage />
      </Provider>
    )
  })
})
