import { render, fireEvent, waitFor } from '@testing-library/react'
import ReactModal from 'react-modal'
import userEvent from '@testing-library/user-event'

import CongregationModal from './CongregationModal'

describe('<CongregationModal />', () => {
  const defaultProps = {
    isOpen: false,
    onRequestClose: () => {},
    onSubmit: () => {},
  }

  it('renders without crash', async () => {
    const props = {
      ...defaultProps,
      isOpen: true,
    }
    const { rerender, container, findByText } = render(
      <CongregationModal {...defaultProps} />
    )
    ReactModal.setAppElement(container)

    rerender(<CongregationModal {...props} />)

    await findByText('Dodaj nowy zbór *')
  })

  it('handles error input', async () => {
    const props = {
      ...defaultProps,
      isOpen: true,
    }
    const { rerender, container, findByTestId, getByText } = render(
      <CongregationModal {...defaultProps} />
    )
    ReactModal.setAppElement(container)

    rerender(<CongregationModal {...props} />)

    const inputName = await findByTestId('input')

    userEvent.clear(inputName)
    fireEvent.blur(inputName)

    await waitFor(() => {
      expect(getByText('Zbór jest wymagany')).toBeInTheDocument()
    })
  })
})
