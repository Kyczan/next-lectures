import { Provider } from 'react-redux'
import router from 'next/router'
import { render, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { makeStore } from '../../app/store'
import planData from '../../../__mocks__/data/plan.json'
import Plan from './Plan'

jest.mock('next/dist/client/router', () => require('next-router-mock'))

describe('<Plan />', () => {
  let store
  beforeEach(() => {
    store = makeStore()
    fetchMock.resetMocks()
  })

  it('renders all rows without error', async () => {
    fetchMock.once(JSON.stringify(planData))

    const { findAllByTestId } = render(
      <Provider store={store}>
        <Plan />
      </Provider>
    )

    const rows = await findAllByTestId('plan-row')
    expect(rows.length).toBe(planData.length)
    expect(fetchMock.mock.calls.length).toEqual(1)
  })

  it('renders no rows when error occurs', async () => {
    const errorMsg = 'Oops'
    fetchMock.mockRejectOnce(() => Promise.reject(new Error(errorMsg)))

    const { queryAllByTestId } = await render(
      <Provider store={store}>
        <Plan />
      </Provider>
    )

    const rows = queryAllByTestId('plan-row')
    expect(rows.length).toBe(0)
    expect(fetchMock.mock.calls.length).toEqual(1)
  })

  it('redirects on row click', async () => {
    fetchMock.once(JSON.stringify(planData))

    const { findAllByTestId } = render(
      <Provider store={store}>
        <Plan />
      </Provider>
    )

    const rows = await findAllByTestId('plan-row')
    fireEvent.click(rows[0])

    // data is sorted in DESC order
    expect(router).toMatchObject({ asPath: `/plan/${planData[3]._id}` })
  })

  it('handles search', async () => {
    fetchMock.once(JSON.stringify(planData))

    const { getByTestId, findAllByTestId } = render(
      <Provider store={store}>
        <Plan />
      </Provider>
    )

    // check first thing before searching
    // data is sorted in DESC order
    const beforeSearch = await findAllByTestId('date')
    expect(beforeSearch.length).toBe(planData.length)
    const beforeUtils = within(beforeSearch[0])
    expect(beforeUtils.getByText('2021-02-04')).toBeInTheDocument()

    const search = getByTestId('search-input') as HTMLInputElement
    userEvent.type(search, '2021-02-03')

    // check first thing after searching
    const afterSearch = await findAllByTestId('date')
    expect(afterSearch.length).toBe(1)
    const afterUtils = within(afterSearch[0])
    expect(afterUtils.getByText('2021-02-03')).toBeInTheDocument()
  })
})