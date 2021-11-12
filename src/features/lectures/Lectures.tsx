import { useEffect, useState } from 'react'
import Head from 'next/head'
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

const Lectures = (): JSX.Element => {
  const [lectures, setLectures] = useState([])
  const router = useRouter()
  const {
    filtered,
    filter: {
      sort,
      sort: { order },
    },
    fetch: { status },
  } = useAppSelector(selectLectures)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (status === ApiCallStatuses.IDLE) {
      dispatch(fetchLectures())
    }
  }, [status, dispatch])

  useEffect(() => {
    setLectures(filtered)
  }, [filtered])

  const handleRowClick = (id) => {
    router.push(`/lectures/${id}`)
  }

  const handleSort = (key) => {
    dispatch(setSort({ key, order: order === 'asc' ? 'desc' : 'asc' }))
  }

  const handleSearch = (value) => {
    dispatch(setSearch(value))
  }

  return (
    <>
      <Head>
        <title>Wykłady</title>
      </Head>
      <section>
        <div className="inline-wrapper">
          <h1>Wykłady</h1>
          <Search onChange={handleSearch} />
        </div>

        {status === ApiCallStatuses.LOADING && 'Loading'}
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
              sortKey="lastDate"
              sortState={sort}
            >
              Ostatnie wygłoszenie
            </SortButton>
          </Col>
        </div>

        <hr />

        {lectures.map((item) => (
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
              <div>{item.lastDate}</div>
              <div>
                <small>{item.lastSpeaker}</small>
              </div>
            </Col>
          </div>
        ))}
      </section>
    </>
  )
}

export default Lectures
