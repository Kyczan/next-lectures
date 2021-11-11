import { Provider } from 'react-redux'
import router from 'next/router'
import ReactModal from 'react-modal'
import { render, fireEvent, waitFor } from '@testing-library/react'

import LectureView from './LectureView'
import { makeStore } from '../../../app/store'
import lecturesData from '../../../../__mocks__/data/lectures.json'

jest.mock('next/dist/client/router', () => require('next-router-mock'))

describe('<LectureView />', () => {
  let store
  beforeEach(() => {
    store = makeStore()
    fetchMock.resetMocks()
  })

  it('renders without crash', async () => {
    fetchMock.once(JSON.stringify(lecturesData))
    const { findByText } = render(
      <Provider store={store}>
        <LectureView id={lecturesData[0]._id} />
      </Provider>
    )

    await findByText('Szczegóły wykładu')
  })

  it('redirects to edit page on Edit btn click', async () => {
    fetchMock.once(JSON.stringify(lecturesData))
    const { findByTestId } = render(
      <Provider store={store}>
        <LectureView id={lecturesData[0]._id} />
      </Provider>
    )

    const btn = await findByTestId('edit-btn')

    fireEvent.click(btn)

    expect(router).toMatchObject({
      asPath: `/lectures/${lecturesData[0]._id}/edit`,
    })
  })

  it('opens dialog on click', async () => {
    fetchMock.once(JSON.stringify(lecturesData))
    const { container, findByTestId, getByText } = render(
      <Provider store={store}>
        <LectureView id={lecturesData[0]._id} />
      </Provider>
    )
    ReactModal.setAppElement(container)

    const showModalBtn = await findByTestId('delete-btn')

    fireEvent.click(showModalBtn)

    expect(getByText('Usunąć ten wykład?')).toBeInTheDocument()
  })

  it('opens dialog and then Delete', async () => {
    fetchMock.once(JSON.stringify(lecturesData))
    const { container, findByTestId, queryByText } = render(
      <Provider store={store}>
        <LectureView id={lecturesData[0]._id} />
      </Provider>
    )
    ReactModal.setAppElement(container)

    const showModalBtn = await findByTestId('delete-btn')
    fireEvent.click(showModalBtn)

    const deleteBtn = await findByTestId('modal-delete-btn')
    fireEvent.click(deleteBtn)

    await waitFor(() => {
      expect(queryByText('Usunąć ten wykład?')).not.toBeInTheDocument()
      expect(router).toMatchObject({
        asPath: '/lectures',
      })
    })
  })

  it('opens dialog and then Cancel', async () => {
    fetchMock.once(JSON.stringify(lecturesData))
    const { container, findByTestId, queryByText } = render(
      <Provider store={store}>
        <LectureView id={lecturesData[0]._id} />
      </Provider>
    )
    ReactModal.setAppElement(container)

    const showModalBtn = await findByTestId('delete-btn')
    fireEvent.click(showModalBtn)

    const cancelBtn = await findByTestId('modal-cancel-btn')
    fireEvent.click(cancelBtn)

    expect(queryByText('Usunąć ten wykład?')).not.toBeInTheDocument()
  })
})