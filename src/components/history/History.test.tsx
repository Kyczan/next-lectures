import { render } from '@testing-library/react'

import History, { HistoryType } from './History'
import { formatDate } from '../../utils/formatters/formatters'
import planData from '../../../__mocks__/data/plan.json'

describe('<History>', () => {
  const defaultProps = {
    data: planData,
    type: HistoryType.LECTURE,
  }

  it('renders without crashing with type lecture', () => {
    const { getByText } = render(<History {...defaultProps} />)

    expect(getByText(formatDate(planData[0].date))).toBeInTheDocument()
  })

  it('renders without crashing with type speaker', () => {
    const props = {
      ...defaultProps,
      type: HistoryType.SPEAKER,
    }
    const { getByText } = render(<History {...props} />)

    expect(getByText(formatDate(planData[0].date))).toBeInTheDocument()
  })
})
