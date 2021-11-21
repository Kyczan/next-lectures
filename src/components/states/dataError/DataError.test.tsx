import { render, fireEvent } from '@testing-library/react'

import DataError from './DataError'

describe('<DataError>', () => {
  it('renders without crashing', () => {
    const onRefreshMockFn = jest.fn()
    const { getByTestId } = render(<DataError onRefresh={onRefreshMockFn} />)

    const btn = getByTestId('refresh')
    fireEvent.click(btn)

    expect(onRefreshMockFn).toHaveBeenCalled()
  })
})
