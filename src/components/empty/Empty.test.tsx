import { render } from '@testing-library/react'

import Empty from './Empty'

describe('<Empty>', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<Empty href="test" />)

    expect(getByText('Niczego tu jeszcze nie ma')).toBeInTheDocument()
  })
})
