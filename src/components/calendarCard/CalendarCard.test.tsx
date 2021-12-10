import { render } from '@testing-library/react'

import CalendarCard from './CalendarCard'

describe('<CalendarCard>', () => {
  const defaultProps = {
    day: 10,
  }

  it('renders without crashing', () => {
    const { getByText } = render(<CalendarCard {...defaultProps} />)

    expect(getByText('10')).toBeInTheDocument()
  })
})
