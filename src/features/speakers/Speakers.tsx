import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { ApiCallStatuses } from '../../app/types'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import {
  fetchSpeakers,
  selectSpeakers,
  setSearch,
  setSort,
  ISpeakersSortKeys,
  ISpeakersDataItem,
} from './speakersSlice'
import Col from '../../components/col/Col'
import AddButton from '../../components/buttons/addButton/AddButton'
import Search from '../../components/search/Search'
import SortButton from '../../components/buttons/sortButton/SortButton'
import Error from '../../components/error/Error'
import Empty from '../../components/empty/Empty'

const Speakers = (): JSX.Element => {
  const [speakers, setSpeakers] = useState<ISpeakersDataItem[]>([])
  const router = useRouter()
  const {
    filtered,
    filter: {
      sort,
      sort: { order },
    },
    fetch: { status },
  } = useAppSelector(selectSpeakers)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (status === ApiCallStatuses.IDLE) {
      dispatch(fetchSpeakers())
    }
  }, [status, dispatch])

  useEffect(() => {
    setSpeakers(filtered)
  }, [filtered])

  const handleRowClick = (id) => {
    router.push(`/speakers/${id}`)
  }

  const handleSort = (key) => {
    dispatch(setSort({ key, order: order === 'asc' ? 'desc' : 'asc' }))
  }

  const handleSearch = (value) => {
    dispatch(setSearch(value))
  }

  const handleRefresh = () => {
    dispatch(fetchSpeakers())
  }

  return (
    <section>
      <div className="inline-wrapper">
        <h1>Mówcy</h1>
        {status === ApiCallStatuses.SUCCEEDED && speakers.length > 0 && (
          <Search onChange={handleSearch} />
        )}
      </div>

      {status === ApiCallStatuses.LOADING && <div aria-busy="true"></div>}
      {status === ApiCallStatuses.FAILED && <Error onRefresh={handleRefresh} />}
      {status === ApiCallStatuses.SUCCEEDED && speakers.length === 0 && (
        <Empty href="/speakers/add" />
      )}
      {status === ApiCallStatuses.SUCCEEDED && speakers.length > 0 && (
        <>
          <AddButton href="/speakers/add" />
          <div className="row heading-row">
            <Col flex="1 1">
              <SortButton<ISpeakersSortKeys>
                onClick={handleSort}
                sortKey="name"
                sortState={sort}
              >
                <strong>Imię i Nazwisko</strong>
              </SortButton>
            </Col>
            <Col flex="1 1">
              <SortButton<ISpeakersSortKeys>
                onClick={handleSort}
                sortKey="congregation"
                sortState={sort}
              >
                Zbór
              </SortButton>
            </Col>
            <Col flex="1 1">
              <SortButton<ISpeakersSortKeys>
                onClick={handleSort}
                sortKey="lastDate"
                sortState={sort}
              >
                Ostatnie wygłoszenie
              </SortButton>
            </Col>
          </div>

          <hr />

          {speakers.map((item) => (
            <div
              className="row"
              key={item._id}
              data-testid="speakers-row"
              onClick={() => handleRowClick(item._id)}
            >
              <Col flex="1 1">
                <div>
                  <strong>{item.name}</strong>
                </div>
                <div>
                  <small>{item.note}</small>
                </div>
              </Col>

              <Col flex="1 1">
                <span data-testid="congregation">{item.congregation}</span>
              </Col>

              <Col flex="1 1">{item.lastDate}</Col>
            </div>
          ))}
        </>
      )}
    </section>
  )
}

export default Speakers
