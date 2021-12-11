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

  it('renders all rows when added row with future date', async () => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfterTomorrow = new Date(today)
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)
    const data = [
      ...planData,
      {
        _id: 'e',
        date: tomorrow.toISOString().slice(0, 10),
        lecture: null,
        note: '',
        speaker: null,
      },
      {
        _id: 'f',
        date: dayAfterTomorrow.toISOString().slice(0, 10),
        lecture: null,
        note: '',
        speaker: null,
      },
      {
        _id: 'g',
        date: tomorrow.toISOString().slice(0, 10),
        lecture: null,
        note: '',
        speaker: null,
      },
    ]
    fetchMock.once(JSON.stringify(data))

    const { findAllByTestId } = render(
      <Provider store={store}>
        <Plan />
      </Provider>
    )

    const rows = await findAllByTestId('plan-row')
    expect(rows.length).toBe(data.length)
    expect(fetchMock.mock.calls.length).toEqual(1)
  })

  it('renders no rows when error occurs and handles refresh', async () => {
    const errorMsg = 'Oops'
    fetchMock.mockRejectOnce(() => Promise.reject(new Error(errorMsg)))
    fetchMock.once(JSON.stringify(planData))

    const { queryAllByTestId, findByTestId, findAllByTestId } = await render(
      <Provider store={store}>
        <Plan />
      </Provider>
    )

    let rows = queryAllByTestId('plan-row')
    expect(rows.length).toBe(0)

    const refreshBtn = await findByTestId('refresh')
    fireEvent.click(refreshBtn)

    rows = await findAllByTestId('plan-row')
    expect(rows.length).toBe(planData.length)
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
    const beforeSearch = await findAllByTestId('plan-lecture')
    expect(beforeSearch.length).toBe(planData.length)
    const beforeUtils = within(beforeSearch[0])
    expect(
      beforeUtils.getByText(
        `${planData[3].lecture.number}. ${planData[3].lecture.title}`
      )
    ).toBeInTheDocument()

    const search = getByTestId('search-input') as HTMLInputElement
    userEvent.type(search, '2')

    // check first thing after searching
    const afterSearch = await findAllByTestId('plan-lecture')
    expect(afterSearch.length).toBe(1)
    const afterUtils = within(afterSearch[0])
    expect(
      afterUtils.getByText(
        `${planData[2].lecture.number}. ${planData[2].lecture.title}`
      )
    ).toBeInTheDocument()
  })

  it('handles search when nothing found', async () => {
    fetchMock.once(JSON.stringify(planData))

    const { findByTestId } = render(
      <Provider store={store}>
        <Plan />
      </Provider>
    )

    const search = (await findByTestId('search-input')) as HTMLInputElement
    userEvent.type(search, 'non existing value')
  })

  it('displays empty state when no data and no filter', async () => {
    fetchMock.once(JSON.stringify([]))

    const { findByTestId } = render(
      <Provider store={store}>
        <Plan />
      </Provider>
    )

    const emptyAdd = await findByTestId('data-empty-add')
    expect(emptyAdd).toBeInTheDocument()
  })
})
