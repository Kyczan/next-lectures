import { Provider } from 'react-redux'
import router from 'next/router'
import ReactModal from 'react-modal'
import { render, fireEvent, waitFor } from '@testing-library/react'

import SpeakerView from './SpeakerView'
import { makeStore } from '../../../app/store'
import speakersData from '../../../../__mocks__/data/speakers.json'

jest.mock('next/dist/client/router', () => require('next-router-mock'))

describe('<SpeakerView />', () => {
  let store
  beforeEach(() => {
    store = makeStore()
    fetchMock.resetMocks()
  })

  it('renders without crash', async () => {
    fetchMock.once(JSON.stringify(speakersData))
    const { findByText } = render(
      <Provider store={store}>
        <SpeakerView id={speakersData[0]._id} />
      </Provider>
    )

    await findByText('Szczegóły mówcy')
  })

  it('renders without crash when no event details available', async () => {
    fetchMock.once(JSON.stringify(speakersData))
    const { findByText } = render(
      <Provider store={store}>
        <SpeakerView id={speakersData[1]._id} />
      </Provider>
    )

    await findByText('Szczegóły mówcy')
  })

  it('renders when error occurs and handles refresh', async () => {
    const errorMsg = 'Oops'
    fetchMock.mockRejectOnce(() => Promise.reject(new Error(errorMsg)))
    fetchMock.once(JSON.stringify(speakersData))

    const { findByTestId } = await render(
      <Provider store={store}>
        <SpeakerView id={speakersData[0]._id} />
      </Provider>
    )

    const refreshBtn = await findByTestId('refresh')
    fireEvent.click(refreshBtn)
  })

  it('redirects to edit page on Edit btn click', async () => {
    fetchMock.once(JSON.stringify(speakersData))
    const { findByTestId } = render(
      <Provider store={store}>
        <SpeakerView id={speakersData[0]._id} />
      </Provider>
    )

    const btn = await findByTestId('edit-btn')

    fireEvent.click(btn)

    expect(router).toMatchObject({
      asPath: `/speakers/${speakersData[0]._id}/edit`,
    })
  })

  it('opens dialog on click', async () => {
    fetchMock.once(JSON.stringify(speakersData))
    const { container, findByTestId, getByText } = render(
      <Provider store={store}>
        <SpeakerView id={speakersData[0]._id} />
      </Provider>
    )
    ReactModal.setAppElement(container)

    const showModalBtn = await findByTestId('delete-btn')

    fireEvent.click(showModalBtn)

    expect(getByText('Usunąć tego mówcę?')).toBeInTheDocument()
  })

  it('opens dialog and then Delete', async () => {
    fetchMock.once(JSON.stringify(speakersData))
    const { container, findByTestId, queryByText } = render(
      <Provider store={store}>
        <SpeakerView id={speakersData[0]._id} />
      </Provider>
    )
    ReactModal.setAppElement(container)

    const showModalBtn = await findByTestId('delete-btn')
    fireEvent.click(showModalBtn)

    const deleteBtn = await findByTestId('modal-delete-btn')
    fireEvent.click(deleteBtn)

    await waitFor(() => {
      expect(queryByText('Usunąć tego mówcę?')).not.toBeInTheDocument()
      expect(router).toMatchObject({
        asPath: '/speakers',
      })
    })
  })

  it('opens dialog and then Cancel', async () => {
    fetchMock.once(JSON.stringify(speakersData))
    const { container, findByTestId, queryByText } = render(
      <Provider store={store}>
        <SpeakerView id={speakersData[0]._id} />
      </Provider>
    )
    ReactModal.setAppElement(container)

    const showModalBtn = await findByTestId('delete-btn')
    fireEvent.click(showModalBtn)

    const cancelBtn = await findByTestId('modal-cancel-btn')
    fireEvent.click(cancelBtn)

    expect(queryByText('Usunąć tego mówcę?')).not.toBeInTheDocument()
  })
})
