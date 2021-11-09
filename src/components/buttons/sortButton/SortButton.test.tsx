import { render, fireEvent } from '@testing-library/react'

import SortButton from './SortButton'
import { SortOrder } from '../../../app/types'

describe('<SortButton>', () => {
  type SortKeys = 'test' | 'test2'
  const sortState = {
    order: SortOrder.ASC,
    key: 'test' as SortKeys,
  }
  const defaultProps = {
    onClick: () => {},
    sortKey: 'test' as SortKeys,
    sortState,
  }

  it('renders correct children', () => {
    const { getByText } = render(
      <SortButton<SortKeys> {...defaultProps}>sort</SortButton>
    )

    expect(getByText('sort')).toBeInTheDocument()
  })

  it('renders without icon when sortKey is different', () => {
    const props = {
      ...defaultProps,
      sortKey: 'test2' as SortKeys,
    }

    const { queryByTestId } = render(
      <SortButton<SortKeys> {...props}>sort</SortButton>
    )

    expect(queryByTestId('icon-down')).not.toBeInTheDocument()
    expect(queryByTestId('icon-up')).not.toBeInTheDocument()
  })

  it('renders with UP icon when sort order is ASC', () => {
    const props = {
      ...defaultProps,
      sortState: {
        ...sortState,
        order: SortOrder.ASC,
      },
    }

    const { queryByTestId } = render(
      <SortButton<SortKeys> {...props}>sort</SortButton>
    )

    expect(queryByTestId('icon-up')).toBeInTheDocument()
    expect(queryByTestId('icon-down')).not.toBeInTheDocument()
  })

  it('renders with DOWN icon when sort order is DESC', () => {
    const props = {
      ...defaultProps,
      sortState: {
        ...sortState,
        order: SortOrder.DESC,
      },
    }

    const { queryByTestId } = render(
      <SortButton<SortKeys> {...props}>sort</SortButton>
    )

    expect(queryByTestId('icon-down')).toBeInTheDocument()
    expect(queryByTestId('icon-up')).not.toBeInTheDocument()
  })

  it('handles click', () => {
    const clickMockFn = jest.fn()
    const props = {
      ...defaultProps,
      onClick: clickMockFn,
    }

    const { getByText } = render(
      <SortButton<SortKeys> {...props}>sort</SortButton>
    )

    fireEvent.click(getByText('sort'))

    expect(clickMockFn).toHaveBeenCalled()
  })
})
