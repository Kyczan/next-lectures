import { render } from '@testing-library/react'

import ItemDetails from './ItemDetails'

describe('<ItemDetails>', () => {
  const defaultProps = {
    data: [
      {
        name: 'Name',
        value: 'Value',
      },
    ],
  }

  it('renders without crashing', () => {
    const { getByText } = render(<ItemDetails {...defaultProps} />)

    expect(getByText('Name')).toBeInTheDocument()
  })
})
