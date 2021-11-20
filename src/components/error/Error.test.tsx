import { render, fireEvent } from '@testing-library/react'

import Error from './Error'

describe('<Error>', () => {
  it('renders without crashing', () => {
    const onRefreshMockFn = jest.fn()
    const { getByTestId } = render(<Error onRefresh={onRefreshMockFn} />)

    const btn = getByTestId('refresh')
    fireEvent.click(btn)

    expect(onRefreshMockFn).toHaveBeenCalled()
  })
})
