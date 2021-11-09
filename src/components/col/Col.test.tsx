import { render } from '@testing-library/react'

import Col from './Col'

describe('<Col>', () => {
  const defaultProps = {
    flex: '0 0 60px',
    className: 'test-classname',
  }

  it('renders without crashing', () => {
    const { getByText } = render(<Col {...defaultProps}>test</Col>)

    expect(getByText('test')).toBeInTheDocument()
  })
})
