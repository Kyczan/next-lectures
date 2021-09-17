import { useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

import { ApiCallStatuses } from '../../app/types'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { fetchLectures, selectLectures } from './lecturesSlice'
import Col from '../../components/col/Col'

const Lectures = (): JSX.Element => {
  const {
    fetch: { data, status },
  } = useAppSelector(selectLectures)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (status === ApiCallStatuses.IDLE) {
      dispatch(fetchLectures())
    }
  }, [status, dispatch])

  return (
    <>
      <Head>
        <title>Wykłady</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section>
        <dialog>test</dialog>
        {status === ApiCallStatuses.LOADING && 'Loading'}

        <div className="row">
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

        {data.map((item) => (
          <div className="row" key={item._id} data-testid="lectures-row">
            <Col flex="0 0 60px" className="right">
              <Link href={`/lectures/${item._id}/edit`}>
                <a className="contrast">{item.number}</a>
              </Link>
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
