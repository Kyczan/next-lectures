import { render } from '@testing-library/react'

import Page404 from './Page404'

describe('<Page404>', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<Page404 />)

    expect(getByText('Nie ma takiej strony')).toBeInTheDocument()
  })
})
