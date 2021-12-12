import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'

import { ApiCallStatuses } from '../../app/types'
import {
  useAppSelector,
  useAppDispatch,
  useInfiniteScroll,
} from '../../app/hooks'
import { fetchPlan, selectPlan, setSearch } from './planSlice'
import Col from '../../components/col/Col'
import CalendarCard from '../../components/calendarCard/CalendarCard'
import AddButton from '../../components/buttons/addButton/AddButton'
import Search from '../../components/search/Search'
import DataError from '../../components/states/dataError/DataError'
import DataEmpty from '../../components/states/dataEmpty/DataEmpty'
import { formatLecture, formatDate } from '../../utils/formatters/formatters'

import styles from './Plan.module.css'

const Plan = (): JSX.Element => {
  const router = useRouter()
  const {
    data,
    filtered,
    filter: {
      search: { value: searchedValue },
    },
    fetch: { status },
  } = useAppSelector(selectPlan)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (status === ApiCallStatuses.IDLE) {
      dispatch(fetchPlan())
    }
  }, [status, dispatch])

  const limitedData = useInfiniteScroll(filtered)

  const handleRowClick = (id) => {
    router.push(`/plan/${id}`)
  }

  const handleSearch = (value) => {
    dispatch(setSearch(value))
  }

  const handleRefresh = () => {
    dispatch(fetchPlan())
  }

  const nearestFutureEvent = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const futureEvents = data.filter((item) => new Date(item.date) >= today)
    futureEvents.sort((a, b) => (a.date > b.date ? 1 : -1))
    return futureEvents[0]
  }, [data])

  const isPrevSameMonth = (index) => {
    if (index === 0) return false
    if (index === limitedData.length) return false
    const current = new Date(limitedData[index].date)
    const previous = new Date(limitedData[index - 1].date)
    return current.getMonth() === previous.getMonth()
  }

  const getRowClass = (item, index) => {
    const topBorder = !isPrevSameMonth(index) ? styles['row-top'] : ''
    const bottomBorder = !isPrevSameMonth(index + 1) ? styles['row-bottom'] : ''

    const highlightedCls =
      nearestFutureEvent?._id === item._id ? styles['row-highlighted'] : ''
    const errorCls =
      !item.lecture && !item.speaker && !item.note ? styles['row-error'] : ''
    return `row ${styles.row} ${highlightedCls} ${errorCls} ${topBorder} ${bottomBorder}`
  }

  return (
    <section>
      <div className="inline-wrapper">
        <h1>Plan</h1>
        {status === ApiCallStatuses.SUCCEEDED &&
          (filtered.length > 0 || !!searchedValue) && (
            <Search onChange={handleSearch} init={searchedValue} />
          )}
      </div>

      {status === ApiCallStatuses.LOADING && <div aria-busy="true"></div>}
      {status === ApiCallStatuses.FAILED && (
        <DataError onRefresh={handleRefresh} />
      )}
      {status === ApiCallStatuses.SUCCEEDED &&
        filtered.length === 0 &&
        !searchedValue && <DataEmpty href="/plan/add" />}
      {status === ApiCallStatuses.SUCCEEDED &&
        (filtered.length > 0 || !!searchedValue) && (
          <>
            <AddButton href="/plan/add" />

            {limitedData.map((item, index) => (
              <div
                className={getRowClass(item, index)}
                key={item._id}
                data-testid="plan-row"
                onClick={() => handleRowClick(item._id)}
              >
                {!isPrevSameMonth(index) && (
                  <div className={styles['row-month']}>
                    {formatDate(item.date, false)}
                  </div>
                )}
                <Col flex="0 0 60px" className={styles.calendar}>
                  <CalendarCard day={new Date(item.date).getDate()} />
                </Col>

                <Col flex="2 1">
                  <div>
                    <span data-testid="plan-lecture">
                      {formatLecture(item.lecture)}
                    </span>
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
