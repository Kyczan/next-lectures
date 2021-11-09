import { Provider } from 'react-redux'
import { render } from '@testing-library/react'

import { makeStore } from '../../app/store'
import lecturesData from '../../../__mocks__/data/lectures.json'

import Lectures from './Lectures'

describe('<Lectures />', () => {
  let store
  beforeEach(() => {
    store = makeStore()
    fetchMock.resetMocks()
  })

  it('renders all rows without error', async () => {
    fetchMock.once(JSON.stringify(lecturesData))

    const { findAllByTestId } = render(
      <Provider store={store}>
        <Lectures />
      </Provider>
    )

    const rows = await findAllByTestId('lectures-row')
    expect(rows.length).toBe(lecturesData.length)
    expect(fetchMock.mock.calls.length).toEqual(1)
  })

  it('renders no rows when error occurs', async () => {
    const errorMsg = 'Oops'
    fetchMock.mockRejectOnce(() => Promise.reject(new Error(errorMsg)))

    const { queryAllByTestId } = await render(
      <Provider store={store}>
        <Lectures />
      </Provider>
    )

    const rows = queryAllByTestId('lectures-row')
    expect(rows.length).toBe(0)
    expect(fetchMock.mock.calls.length).toEqual(1)
  })
})
