import { Provider } from 'react-redux'
import router from 'next/router'
import ReactModal from 'react-modal'
import { render, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import SpeakerEdit from './SpeakerEdit'
import { makeStore } from '../../../app/store'
import speakersData from '../../../../__mocks__/data/speakers.json'

jest.mock('next/dist/client/router', () => require('next-router-mock'))

describe('<SpeakerEdit />', () => {
  let store
  beforeEach(() => {
    store = makeStore()
    fetchMock.resetMocks()
  })

  it('renders without crash with no props', async () => {
    fetchMock.once(JSON.stringify(speakersData))
    const { findByText } = render(
      <Provider store={store}>
        <SpeakerEdit />
      </Provider>
    )

    await findByText('Dodawanie mówcy')
  })

  it('renders without crash with id', async () => {
    fetchMock.once(JSON.stringify(speakersData))
    const { findByText } = render(
      <Provider store={store}>
        <SpeakerEdit id={speakersData[0]._id} />
      </Provider>
    )

    await findByText('Edycja mówcy')
  })

  it('renders without crash with id and without congregation', async () => {
    fetchMock.once(JSON.stringify(speakersData))
    const { findByText } = render(
      <Provider store={store}>
        <SpeakerEdit id={speakersData[1]._id} />
      </Provider>
    )

    await findByText('Edycja mówcy')
  })

  it('renders when error occurs and handles refresh', async () => {
    const errorMsg = 'Oops'
    fetchMock.mockRejectOnce(() => Promise.reject(new Error(errorMsg)))
    fetchMock.once(JSON.stringify(speakersData))

    const { findByTestId } = await render(
      <Provider store={store}>
        <SpeakerEdit id={speakersData[0]._id} />
      </Provider>
    )

    const refreshBtn = await findByTestId('refresh')
    fireEvent.click(refreshBtn)
  })

  it('renders 404 error when in edit mode and no item found', async () => {
    fetchMock.once(JSON.stringify(speakersData))

    const { findByText } = await render(
      <Provider store={store}>
        <SpeakerEdit id="invalidId" />
      </Provider>
    )

    const page404 = await findByText('404')
    expect(page404).toBeInTheDocument()
  })

  it('shows errors when form has invalid user input', async () => {
    fetchMock.once(JSON.stringify(speakersData))
    const { findAllByTestId, getByText } = render(
      <Provider store={store}>
        <SpeakerEdit id={speakersData[0]._id} />
      </Provider>
    )

    const [inputName] = (await findAllByTestId('input')) as HTMLInputElement[]

    userEvent.clear(inputName)
    fireEvent.blur(inputName)

    await waitFor(() => {
      expect(getByText('Imię i Nazwisko jest wymagane')).toBeInTheDocument()
    })
  })

  it('handles submit when no id provided', async () => {
    fetchMock.once(JSON.stringify(speakersData))
    const { findAllByTestId, getByTestId } = render(
      <Provider store={store}>
        <SpeakerEdit />
      </Provider>
    )

    const [inputName] = (await findAllByTestId('input')) as HTMLInputElement[]

    userEvent.type(inputName, 'John Smith')
    fireEvent.blur(inputName)

    const btn = getByTestId('submit-form')

    fetchMock.once(JSON.stringify({ _id: 'e', name: 'John Smith' }))
    fireEvent.click(btn)

    await waitFor(() => {
      expect(router).toMatchObject({
        asPath: '/speakers',
      })
    })
  })

  it('handles submit when id provided', async () => {
    fetchMock.once(JSON.stringify(speakersData))
    const { findAllByTestId, getByTestId } = render(
      <Provider store={store}>
        <SpeakerEdit id={speakersData[0]._id} />
      </Provider>
    )

    const [inputName] = (await findAllByTestId('input')) as HTMLInputElement[]

    userEvent.clear(inputName)
    userEvent.type(inputName, 'Jean-Luc Picard')
    fireEvent.blur(inputName)

    const btn = getByTestId('submit-form')

    fetchMock.once(
      JSON.stringify({ ...speakersData[0], name: 'Jean-Luc Picard' })
    )
    fireEvent.click(btn)

    await waitFor(() => {
      expect(router).toMatchObject({
        asPath: `/speakers/${speakersData[0]._id}`,
      })
    })
  })

  it('opens dialog on click', async () => {
    fetchMock.once(JSON.stringify(speakersData))
    const { container, findByTestId, getByText } = render(
      <Provider store={store}>
        <SpeakerEdit id={speakersData[0]._id} />
      </Provider>
    )
    ReactModal.setAppElement(container)

    const showModalBtn = await findByTestId('add-congregation-btn')

    fireEvent.click(showModalBtn)

    expect(getByText('Dodaj nowy zbór *')).toBeInTheDocument()
  })

  it('opens dialog and then adds new congregation', async () => {
    fetchMock.once(JSON.stringify(speakersData))
    const { container, findByTestId, findAllByTestId, queryByText } = render(
      <Provider store={store}>
        <SpeakerEdit id={speakersData[0]._id} />
      </Provider>
    )
    ReactModal.setAppElement(container)

    const showModalBtn = await findByTestId('add-congregation-btn')
    fireEvent.click(showModalBtn)

    const inputNames = (await findAllByTestId('input')) as HTMLInputElement[]
    const congregationInput = inputNames[inputNames.length - 1]

    userEvent.clear(congregationInput)
    userEvent.type(congregationInput, 'Enterprise')
    fireEvent.blur(congregationInput)

    const addBtn = await findByTestId('modal-save-congregation-btn')
    fireEvent.click(addBtn)

    await waitFor(() => {
      expect(queryByText('Dodaj nowy zbór *')).not.toBeInTheDocument()
    })
  })
})
