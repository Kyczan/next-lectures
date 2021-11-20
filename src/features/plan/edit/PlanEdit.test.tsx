import { Provider } from 'react-redux'
import router from 'next/router'
import { render, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import PlanEdit from './PlanEdit'
import { makeStore } from '../../../app/store'
import planData from '../../../../__mocks__/data/plan.json'
import lecturesData from '../../../../__mocks__/data/lectures.json'
import speakersData from '../../../../__mocks__/data/speakers.json'

jest.mock('next/dist/client/router', () => require('next-router-mock'))

describe('<PlanEdit />', () => {
  let store
  beforeEach(() => {
    store = makeStore()
    fetchMock.resetMocks()
  })

  it('renders without crash with no props', async () => {
    fetchMock.once(JSON.stringify(planData))
    fetchMock.once(JSON.stringify(lecturesData))
    fetchMock.once(JSON.stringify(speakersData))
    const { findByText } = render(
      <Provider store={store}>
        <PlanEdit />
      </Provider>
    )

    await findByText('Dodawanie wydarzenia')
  })

  it('renders without crash with id', async () => {
    fetchMock.once(JSON.stringify(planData))
    fetchMock.once(JSON.stringify(lecturesData))
    fetchMock.once(JSON.stringify(speakersData))
    const { findByText } = render(
      <Provider store={store}>
        <PlanEdit id={planData[0]._id} />
      </Provider>
    )

    await findByText('Edycja wydarzenia')
  })

  it('renders when error occurs and handles refresh', async () => {
    const errorMsg = 'Oops'
    fetchMock.mockRejectOnce(() => Promise.reject(new Error(errorMsg)))
    fetchMock.mockRejectOnce(() => Promise.reject(new Error(errorMsg)))
    fetchMock.mockRejectOnce(() => Promise.reject(new Error(errorMsg)))
    fetchMock.once(JSON.stringify(planData))
    fetchMock.once(JSON.stringify(lecturesData))
    fetchMock.once(JSON.stringify(speakersData))

    const { findByTestId } = await render(
      <Provider store={store}>
        <PlanEdit id={planData[0]._id} />
      </Provider>
    )

    const refreshBtn = await findByTestId('refresh')
    fireEvent.click(refreshBtn)
  })

  it('shows errors when form has invalid user input', async () => {
    fetchMock.once(JSON.stringify(planData))
    fetchMock.once(JSON.stringify(lecturesData))
    fetchMock.once(JSON.stringify(speakersData))
    const { findAllByTestId, getByText } = render(
      <Provider store={store}>
        <PlanEdit id={planData[0]._id} />
      </Provider>
    )

    const [inputDate] = (await findAllByTestId('input')) as HTMLInputElement[]

    userEvent.clear(inputDate)
    fireEvent.blur(inputDate)

    await waitFor(() => {
      expect(getByText('Data jest wymagana')).toBeInTheDocument()
    })
  })

  it('handles submit when no id provided', async () => {
    fetchMock.once(JSON.stringify(planData))
    fetchMock.once(JSON.stringify(lecturesData))
    fetchMock.once(JSON.stringify(speakersData))
    const { findAllByTestId, getByTestId } = render(
      <Provider store={store}>
        <PlanEdit />
      </Provider>
    )

    const [inputDate] = (await findAllByTestId('input')) as HTMLInputElement[]

    userEvent.type(inputDate, '2021-11-11')
    fireEvent.blur(inputDate)

    const btn = getByTestId('submit-form')

    fetchMock.once(JSON.stringify({ _id: 'e', date: '2021-11-11' }))
    fireEvent.click(btn)

    await waitFor(() => {
      expect(router).toMatchObject({
        asPath: '/plan',
      })
    })
  })

  it('handles submit when id provided', async () => {
    fetchMock.once(JSON.stringify(planData))
    fetchMock.once(JSON.stringify(lecturesData))
    fetchMock.once(JSON.stringify(speakersData))
    const { findAllByTestId, getByTestId } = render(
      <Provider store={store}>
        <PlanEdit id={planData[0]._id} />
      </Provider>
    )

    const [inputDate] = (await findAllByTestId('input')) as HTMLInputElement[]

    userEvent.clear(inputDate)
    userEvent.type(inputDate, '2021-11-11')
    fireEvent.blur(inputDate)

    const btn = getByTestId('submit-form')

    fetchMock.once(JSON.stringify({ ...planData[0], date: '2021-11-11' }))
    fireEvent.click(btn)

    await waitFor(() => {
      expect(router).toMatchObject({
        asPath: `/plan/${planData[0]._id}`,
      })
    })
  })
})
