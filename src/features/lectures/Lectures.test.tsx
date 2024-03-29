import { Provider } from 'react-redux'
import router from 'next/router'
import { render, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { makeStore } from '../../app/store'
import lecturesData from '../../../__mocks__/data/lectures.json'
import Lectures from './Lectures'

jest.mock('next/dist/client/router', () => require('next-router-mock'))

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

  it('renders no rows when error occurs and handles refresh', async () => {
    const errorMsg = 'Oops'
    fetchMock.mockRejectOnce(() => Promise.reject(new Error(errorMsg)))
    fetchMock.once(JSON.stringify(lecturesData))

    const { queryAllByTestId, findByTestId, findAllByTestId } = await render(
      <Provider store={store}>
        <Lectures />
      </Provider>
    )

    let rows = queryAllByTestId('lectures-row')
    expect(rows.length).toBe(0)

    const refreshBtn = await findByTestId('refresh')
    fireEvent.click(refreshBtn)

    rows = await findAllByTestId('lectures-row')
    expect(rows.length).toBe(lecturesData.length)
  })

  it('redirects on row click', async () => {
    fetchMock.once(JSON.stringify(lecturesData))

    const { findAllByTestId } = render(
      <Provider store={store}>
        <Lectures />
      </Provider>
    )

    const rows = await findAllByTestId('lectures-row')
    fireEvent.click(rows[0])

    expect(router).toMatchObject({ asPath: `/lectures/${lecturesData[0]._id}` })
  })

  it('handles sort', async () => {
    fetchMock.once(JSON.stringify(lecturesData))

    const { findByText, findAllByTestId } = render(
      <Provider store={store}>
        <Lectures />
      </Provider>
    )

    const sortBtn = await findByText('Tytuł')

    // before any sorting
    const [beforeSort] = await findAllByTestId('title')
    const beforeUtils = within(beforeSort)
    expect(
      beforeUtils.getByText('Super cool lecture with nice title')
    ).toBeInTheDocument()

    fireEvent.click(sortBtn)

    // after first sort - descending
    const [afterSortDesc] = await findAllByTestId('title')
    const afterDescUtils = within(afterSortDesc)
    expect(
      afterDescUtils.getByText('Super cool lecture with nice title 4')
    ).toBeInTheDocument()

    fireEvent.click(sortBtn)

    // after second sort - ascending
    const [afterSortAsc] = await findAllByTestId('title')
    const afterAscUtils = within(afterSortAsc)
    expect(
      afterAscUtils.getByText('Super cool lecture with nice title')
    ).toBeInTheDocument()
  })

  it('handles search', async () => {
    fetchMock.once(JSON.stringify(lecturesData))

    const { getByTestId, findAllByTestId } = render(
      <Provider store={store}>
        <Lectures />
      </Provider>
    )

    // check first thing before searching
    const beforeSearch = await findAllByTestId('title')
    expect(beforeSearch.length).toBe(lecturesData.length)
    const beforeUtils = within(beforeSearch[0])
    expect(
      beforeUtils.getByText('Super cool lecture with nice title')
    ).toBeInTheDocument()

    const search = getByTestId('search-input') as HTMLInputElement
    userEvent.type(search, '2')

    // check first thing after searching
    const afterSearch = await findAllByTestId('title')
    expect(afterSearch.length).toBe(1)
    const afterUtils = within(afterSearch[0])
    expect(
      afterUtils.getByText('Super cool lecture with nice title 2')
    ).toBeInTheDocument()
  })

  it('handles search when nothing found', async () => {
    fetchMock.once(JSON.stringify(lecturesData))

    const { findByTestId } = render(
      <Provider store={store}>
        <Lectures />
      </Provider>
    )

    const search = (await findByTestId('search-input')) as HTMLInputElement
    userEvent.type(search, 'non existing value')
  })

  it('displays empty state when no data and no filter', async () => {
    fetchMock.once(JSON.stringify([]))

    const { findByTestId } = render(
      <Provider store={store}>
        <Lectures />
      </Provider>
    )

    const emptyAdd = await findByTestId('data-empty-add')
    expect(emptyAdd).toBeInTheDocument()
  })
})
