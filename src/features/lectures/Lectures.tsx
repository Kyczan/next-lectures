import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import { ApiCallStatuses } from '../../app/types'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import {
  fetchLectures,
  selectLectures,
  setSearch,
  setSort,
} from './lecturesSlice'
import Col from '../../components/col/Col'
import AddButton from '../../components/addButton/AddButton'
import Search from '../../components/search/Search'

const Lectures = (): JSX.Element => {
  const [lectures, setLectures] = useState([])
  const router = useRouter()
  const {
    filtered,
    filter: {
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

  const handleSort = (e, key) => {
    e.preventDefault()
    dispatch(setSort({ key, order: order === 'asc' ? 'desc' : 'asc' }))
  }

  const handleSearch = (value) => {
    dispatch(setSearch(value))
  }

  return (
    <>
      <Head>
        <title>Wykłady</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section>
        <div className="inline-wrapper">
          <h1>Wykłady</h1>
          <Search onChange={handleSearch} />
        </div>

        {status === ApiCallStatuses.LOADING && 'Loading'}
        <AddButton href="/lectures/add">
          <FontAwesomeIcon icon={faPlus} /> Dodaj
        </AddButton>
        <div className="row heading-row">
          <Col flex="0 0 60px" className="right">
            <a href="" onClick={(e) => handleSort(e, 'number')}>
              #
            </a>
          </Col>
          <Col flex="2 1">
            <div>
              <a href="" onClick={(e) => handleSort(e, 'title')}>
                <strong>Tytuł</strong>
              </a>
            </div>
          </Col>
          <Col flex="1 1">
            <div>
              <a href="" onClick={(e) => handleSort(e, 'lastDate')}>
                Ostatnie wygłoszenie
              </a>
            </div>
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
            <Col flex="0 0 60px" className="right">
              {item.number}
            </Col>

            <Col flex="2 1">
              <div>
                <strong>{item.title}</strong>
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
