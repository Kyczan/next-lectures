import { render } from '@testing-library/react'

import AddButton from './AddButton'

describe('<AddButton>', () => {
  it('renders without crashing', () => {
    render(<AddButton href="test" />)
  })
})
