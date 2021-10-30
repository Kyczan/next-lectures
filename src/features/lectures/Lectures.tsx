import { useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import { ApiCallStatuses } from '../../app/types'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { fetchLectures, selectLectures } from './lecturesSlice'
import Col from '../../components/col/Col'
import AddButton from '../../components/addButton/AddButton'
import Search from '../../components/search/Search'

const Lectures = (): JSX.Element => {
  const router = useRouter()
  const {
    fetch: { data, status },
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

  return (
    <>
      <Head>
        <title>Wykłady</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section>
        <div className="inline-wrapper">
          <h1>Wykłady</h1>
          <Search />
        </div>

        {status === ApiCallStatuses.LOADING && 'Loading'}
        <AddButton href="/lectures/add">
          <FontAwesomeIcon icon={faPlus} /> Dodaj
        </AddButton>
        <div className="row heading-row">
          <Col flex="0 0 60px" className="right">
            #
          </Col>
          <Col flex="2 1">
            <div>
              <strong>Tytuł</strong>
            </div>
          </Col>
          <Col flex="1 1">
            <div>Ostatnie wygłoszenie</div>
          </Col>
        </div>

        <hr />

        {data.map((item) => (
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
