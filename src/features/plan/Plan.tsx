import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { ApiCallStatuses } from '../../app/types'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { fetchPlan, selectPlan, setSearch, IPlanDataItem } from './planSlice'
import Col from '../../components/col/Col'
import AddButton from '../../components/buttons/addButton/AddButton'
import Search from '../../components/search/Search'

const Plan = (): JSX.Element => {
  const [plan, setPlan] = useState<IPlanDataItem[]>([])
  const router = useRouter()
  const {
    filtered,
    filter: {
      sort,
      sort: { order },
    },
    fetch: { status },
  } = useAppSelector(selectPlan)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (status === ApiCallStatuses.IDLE) {
      dispatch(fetchPlan())
    }
  }, [status, dispatch])

  useEffect(() => {
    setPlan(filtered)
  }, [filtered])

  const handleRowClick = (id) => {
    router.push(`/plan/${id}`)
  }

  const handleSearch = (value) => {
    dispatch(setSearch(value))
  }

  return (
    <section>
      <div className="inline-wrapper">
        <h1>Plan</h1>
        <Search onChange={handleSearch} />
      </div>

      {status === ApiCallStatuses.LOADING && 'Loading'}
      <AddButton href="/plan/add" />
      <div className="row heading-row">
        <Col flex="1 1">
          <strong>Data</strong>
        </Col>
        <Col flex="1 1">Wykład</Col>
        <Col flex="1 1">Mówca</Col>
      </div>

      <hr />

      {plan.map((item) => (
        <div
          className="row"
          key={item._id}
          data-testid="plan-row"
          onClick={() => handleRowClick(item._id)}
        >
          <Col flex="1 1">
            <strong data-testid="date">{item.date}</strong>
          </Col>

          <Col flex="1 1">
            <div>
              <span>{item.lecture}</span>
            </div>
            <div>
              <small>{item.note}</small>
            </div>
          </Col>

          <Col flex="1 1">
            <div>
              <span>{item.speaker}</span>
            </div>
            <div>
              <small>{item.congregation}</small>
            </div>
          </Col>
        </div>
      ))}
    </section>
  )
}

export default Plan
