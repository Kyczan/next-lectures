import { render } from '@testing-library/react'

import BackButton from './BackButton'

describe('<BackButton>', () => {
  it('renders without crashing', () => {
    render(<BackButton href="test" />)
  })
})
