import { render, screen } from '@testing-library/react'
import ReactModal from 'react-modal'

import Modal from './Modal'

describe('<Modal>', () => {
  const defaultProps = {
    isOpen: false,
    onRequestClose: () => {},
  }

  it('renders without crashing when opened', () => {
    const props = {
      ...defaultProps,
      isOpen: true,
    }
    const { container, rerender } = render(
      <Modal {...defaultProps}>test</Modal>
    )
    ReactModal.setAppElement(container)

    // now the appElement is set we can show the modal component
    rerender(<Modal {...props}>test</Modal>)

    expect(screen.getByText('test')).toBeInTheDocument()
  })
})
