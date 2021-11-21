import { render } from '@testing-library/react'

import Custom404 from '../../pages/404'

describe('/404', () => {
  it('renders', () => {
    render(<Custom404 />)
  })
})
