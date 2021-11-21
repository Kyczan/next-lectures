import { Provider } from 'react-redux'
import router from 'next/router'
import { render, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import LectureEdit from './LectureEdit'
import { makeStore } from '../../../app/store'
import lecturesData from '../../../../__mocks__/data/lectures.json'

jest.mock('next/dist/client/router', () => require('next-router-mock'))

describe('<LectureEdit />', () => {
  let store
  beforeEach(() => {
    store = makeStore()
    fetchMock.resetMocks()
  })

  it('renders without crash with no props', async () => {
    fetchMock.once(JSON.stringify(lecturesData))
    const { findByText } = render(
      <Provider store={store}>
        <LectureEdit />
      </Provider>
    )

    await findByText('Dodawanie wykładu')
  })

  it('renders without crash with id', async () => {
    fetchMock.once(JSON.stringify(lecturesData))
    const { findByText } = render(
      <Provider store={store}>
        <LectureEdit id={lecturesData[0]._id} />
      </Provider>
    )

    await findByText('Edycja wykładu')
  })

  it('renders when error occurs and handles refresh', async () => {
    const errorMsg = 'Oops'
    fetchMock.mockRejectOnce(() => Promise.reject(new Error(errorMsg)))
    fetchMock.once(JSON.stringify(lecturesData))

    const { findByTestId } = await render(
      <Provider store={store}>
        <LectureEdit id={lecturesData[0]._id} />
      </Provider>
    )

    const refreshBtn = await findByTestId('refresh')
    fireEvent.click(refreshBtn)
  })

  it('renders 404 error when in edit mode and no item found', async () => {
    fetchMock.once(JSON.stringify(lecturesData))

    const { findByText } = await render(
      <Provider store={store}>
        <LectureEdit id="invalidId" />
      </Provider>
    )

    const page404 = await findByText('404')
    expect(page404).toBeInTheDocument()
  })

  it('shows errors when form has invalid user input', async () => {
    fetchMock.once(JSON.stringify(lecturesData))
    const { findAllByTestId, getByText } = render(
      <Provider store={store}>
        <LectureEdit id={lecturesData[0]._id} />
      </Provider>
    )

    const [inputNumber, inputTitle] = (await findAllByTestId(
      'input'
    )) as HTMLInputElement[]

    userEvent.clear(inputNumber)
    fireEvent.blur(inputNumber)

    await waitFor(() => {
      expect(getByText('Numer jest wymagany')).toBeInTheDocument()
    })

    userEvent.clear(inputTitle)
    fireEvent.blur(inputTitle)

    await waitFor(() => {
      expect(getByText('Tytuł jest wymagany')).toBeInTheDocument()
    })
  })

  it('handles submit when no id provided', async () => {
    fetchMock.once(JSON.stringify(lecturesData))
    const { findAllByTestId, getByTestId } = render(
      <Provider store={store}>
        <LectureEdit />
      </Provider>
    )

    const [inputNumber, inputTitle] = (await findAllByTestId(
      'input'
    )) as HTMLInputElement[]

    userEvent.type(inputNumber, '1')
    fireEvent.blur(inputNumber)
    userEvent.type(inputTitle, 'test')
    fireEvent.blur(inputTitle)

    const btn = getByTestId('submit-form')

    fetchMock.once(JSON.stringify({ _id: 'e', number: '1', title: 'test' }))
    fireEvent.click(btn)

    await waitFor(() => {
      expect(router).toMatchObject({
        asPath: '/lectures',
      })
    })
  })

  it('handles submit when id provided', async () => {
    fetchMock.once(JSON.stringify(lecturesData))
    const { findAllByTestId, getByTestId } = render(
      <Provider store={store}>
        <LectureEdit id={lecturesData[0]._id} />
      </Provider>
    )

    const [inputNumber] = (await findAllByTestId('input')) as HTMLInputElement[]

    userEvent.clear(inputNumber)
    userEvent.type(inputNumber, '111')
    fireEvent.blur(inputNumber)

    const btn = getByTestId('submit-form')

    fetchMock.once(JSON.stringify({ ...lecturesData[0], number: '111' }))
    fireEvent.click(btn)

    await waitFor(() => {
      expect(router).toMatchObject({
        asPath: `/lectures/${lecturesData[0]._id}`,
      })
    })
  })
})
