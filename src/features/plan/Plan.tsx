import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { ApiCallStatuses } from '../../app/types'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { fetchPlan, selectPlan, setSearch, IPlanDataItem } from './planSlice'
import Col from '../../components/col/Col'
import AddButton from '../../components/buttons/addButton/AddButton'
import Search from '../../components/search/Search'

export const getLecture = (lecture) => {
  if (!lecture || !lecture.number || !lecture.title) return ''

  return `${lecture.number}. ${lecture.title}`
}

export const formatDate = (str) => {
  const date = new Date(str)
  const options = { year: 'numeric', month: 'long', day: 'numeric' } as const
  return new Intl.DateTimeFormat('pl-PL', options).format(date)
}

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
        {status === ApiCallStatuses.SUCCEEDED && (
          <Search onChange={handleSearch} />
        )}
      </div>

      {status === ApiCallStatuses.LOADING && <div aria-busy="true"></div>}
      {status === ApiCallStatuses.FAILED && 'Error'}
      {status === ApiCallStatuses.SUCCEEDED && (
        <>
          <AddButton href="/plan/add" />
          <div className="row heading-row">
            <Col flex="1 2">
              <strong>Data</strong>
            </Col>
            <Col flex="2 1">Wykład</Col>
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
              <Col flex="1 2">
                <strong data-testid="date">{formatDate(item.date)}</strong>
              </Col>

              <Col flex="2 1">
                <div>
                  <span>{getLecture(item.lecture)}</span>
                </div>
                <div>
                  <small>{item.note}</small>
                </div>
              </Col>

              <Col flex="1 1">
                <div>
                  <span>{item.speaker?.name}</span>
                </div>
                <div>
                  <small>{item.speaker?.congregation}</small>
                </div>
              </Col>
            </div>
          ))}
        </>
      )}
    </section>
  )
}

export default Plan
