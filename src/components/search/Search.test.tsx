import { render, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Search from './Search'

describe('<Search>', () => {
  const defaultProps = {
    onChange: () => {},
  }

  it('renders without crashing', () => {
    const { getByTestId } = render(<Search {...defaultProps} />)
    const input = getByTestId('search-input') as HTMLInputElement

    userEvent.type(input, 'test')
    expect(input.value).toBe('test')
  })

  it('shows delete button when value is typed', () => {
    const { getByTestId } = render(<Search {...defaultProps} />)
    const input = getByTestId('search-input') as HTMLInputElement

    userEvent.type(input, 'test')

    const btn = getByTestId('search-delete-btn')
    expect(btn).toBeInTheDocument()
  })

  it('deletes input value when button is clicked', () => {
    const { getByTestId } = render(<Search {...defaultProps} />)
    const input = getByTestId('search-input') as HTMLInputElement

    userEvent.type(input, 'test')
    expect(input.value).toBe('test')

    const btn = getByTestId('search-delete-btn')

    fireEvent.click(btn)
    expect(input.value).toBe('')
  })
})
