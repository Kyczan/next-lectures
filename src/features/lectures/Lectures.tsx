import { useEffect } from 'react'
import { useRouter } from 'next/router'

import { ApiCallStatuses } from '../../app/types'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import {
  fetchLectures,
  selectLectures,
  setSearch,
  setSort,
  ILecturesSortKeys,
} from './lecturesSlice'
import Col from '../../components/col/Col'
import AddButton from '../../components/buttons/addButton/AddButton'
import Search from '../../components/search/Search'
import SortButton from '../../components/buttons/sortButton/SortButton'
import DataError from '../../components/states/dataError/DataError'
import DataEmpty from '../../components/states/dataEmpty/DataEmpty'
import { formatDate } from '../plan/Plan'

const Lectures = (): JSX.Element => {
  const router = useRouter()
  const {
    filtered,
    filter: {
      sort,
      sort: { order },
      search: { value: searchedValue },
    },
    fetch: { status },
  } = useAppSelector(selectLectures)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (status === ApiCallStatuses.IDLE) {
      dispatch(fetchLectures())
    }
  }, [status, dispatch])

  const handleRowClick = (id) => {
    router.push(`/lectures/${id}`)
  }

  const handleSort = (key) => {
    dispatch(setSort({ key, order: order === 'asc' ? 'desc' : 'asc' }))
  }

  const handleSearch = (value) => {
    dispatch(setSearch(value))
  }

  const handleRefresh = () => {
    dispatch(fetchLectures())
  }

  return (
    <section>
      <div className="inline-wrapper">
        <h1>Wykłady</h1>
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
        !searchedValue && <DataEmpty href="/lectures/add" />}
      {status === ApiCallStatuses.SUCCEEDED &&
        (filtered.length > 0 || !!searchedValue) && (
          <>
            <AddButton href="/lectures/add" />
            <div className="row heading-row">
              <Col flex="0 0 60px">
                <SortButton<ILecturesSortKeys>
                  onClick={handleSort}
                  sortKey="number"
                  sortState={sort}
                >
                  #
                </SortButton>
              </Col>
              <Col flex="2 1">
                <SortButton<ILecturesSortKeys>
                  onClick={handleSort}
                  sortKey="title"
                  sortState={sort}
                >
                  <strong>Tytuł</strong>
                </SortButton>
              </Col>
              <Col flex="1 1">
                <SortButton<ILecturesSortKeys>
                  onClick={handleSort}
                  sortKey="lastEvent.date"
                  sortState={sort}
                >
                  Ostatnie wygłoszenie
                </SortButton>
              </Col>
            </div>

            <hr />

            {filtered.map((item) => (
              <div
                className="row"
                key={item._id}
                data-testid="lectures-row"
                onClick={() => handleRowClick(item._id)}
              >
                <Col flex="0 0 60px">{item.number}</Col>

                <Col flex="2 1">
                  <div>
                    <strong data-testid="title">{item.title}</strong>
                  </div>
                  <div>
                    <small>{item.note}</small>
                  </div>
                </Col>

                <Col flex="1 1">
                  <div>{formatDate(item.lastEvent?.date)}</div>
                  <div>
                    <small>
                      {item.lastEvent?.speaker?.name}
                      {item.lastEvent?.speaker?.congregation
                        ? ` (${item.lastEvent.speaker.congregation})`
                        : ''}
                    </small>
                  </div>
                </Col>
              </div>
            ))}
          </>
        )}
    </section>
  )
}

export default Lectures
