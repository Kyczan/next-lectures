import { render } from '@testing-library/react'

import DataEmpty from './DataEmpty'

describe('<DataEmpty>', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<DataEmpty href="test" />)

    expect(getByText('Niczego tu jeszcze nie ma')).toBeInTheDocument()
  })
})
