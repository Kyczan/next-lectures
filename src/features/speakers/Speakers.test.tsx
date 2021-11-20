import { Provider } from 'react-redux'
import router from 'next/router'
import { render, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { makeStore } from '../../app/store'
import speakersData from '../../../__mocks__/data/speakers.json'
import Speakers from './Speakers'

jest.mock('next/dist/client/router', () => require('next-router-mock'))

describe('<Speakers />', () => {
  let store
  beforeEach(() => {
    store = makeStore()
    fetchMock.resetMocks()
  })

  it('renders all rows without error', async () => {
    fetchMock.once(JSON.stringify(speakersData))

    const { findAllByTestId } = render(
      <Provider store={store}>
        <Speakers />
      </Provider>
    )

    const rows = await findAllByTestId('speakers-row')
    expect(rows.length).toBe(speakersData.length)
    expect(fetchMock.mock.calls.length).toEqual(1)
  })

  it('renders no rows when error occurs', async () => {
    const errorMsg = 'Oops'
    fetchMock.mockRejectOnce(() => Promise.reject(new Error(errorMsg)))

    const { queryAllByTestId } = await render(
      <Provider store={store}>
        <Speakers />
      </Provider>
    )

    const rows = queryAllByTestId('speakers-row')
    expect(rows.length).toBe(0)
    expect(fetchMock.mock.calls.length).toEqual(1)
  })

  it('redirects on row click', async () => {
    fetchMock.once(JSON.stringify(speakersData))

    const { findAllByTestId } = render(
      <Provider store={store}>
        <Speakers />
      </Provider>
    )

    const rows = await findAllByTestId('speakers-row')
    fireEvent.click(rows[0])

    expect(router).toMatchObject({ asPath: `/speakers/${speakersData[0]._id}` })
  })

  it('handles sort', async () => {
    fetchMock.once(JSON.stringify(speakersData))

    const { findByText, findAllByTestId } = render(
      <Provider store={store}>
        <Speakers />
      </Provider>
    )

    const sortBtn = await findByText('Zbór')

    // before any sorting
    const [beforeSort] = await findAllByTestId('congregation')
    const beforeUtils = within(beforeSort)
    expect(beforeUtils.getByText('Shire South')).toBeInTheDocument()

    fireEvent.click(sortBtn)

    // after first sort - descending
    const [afterSortDesc] = await findAllByTestId('congregation')
    const afterDescUtils = within(afterSortDesc)
    expect(afterDescUtils.getByText('Shire South')).toBeInTheDocument()

    fireEvent.click(sortBtn)

    // after second sort - ascending
    const [afterSortAsc] = await findAllByTestId('congregation')
    const afterAscUtils = within(afterSortAsc)
    expect(afterAscUtils.getByText('Gondor')).toBeInTheDocument()
  })

  it('handles search', async () => {
    fetchMock.once(JSON.stringify(speakersData))

    const { getByTestId, findAllByTestId } = render(
      <Provider store={store}>
        <Speakers />
      </Provider>
    )

    // check first thing before searching
    const beforeSearch = await findAllByTestId('congregation')
    expect(beforeSearch.length).toBe(speakersData.length)
    const beforeUtils = within(beforeSearch[0])
    expect(beforeUtils.getByText('Shire South')).toBeInTheDocument()

    const search = getByTestId('search-input') as HTMLInputElement
    userEvent.type(search, 'Mo')

    // check first thing after searching
    const afterSearch = await findAllByTestId('congregation')
    expect(afterSearch.length).toBe(1)
    const afterUtils = within(afterSearch[0])
    expect(afterUtils.getByText('Mordor')).toBeInTheDocument()
  })
})
