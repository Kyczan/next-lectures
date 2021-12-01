import { useRouter } from 'next/router'

import { useLectures } from '../../app/hooks/lectures'
import Col from '../../components/col/Col'
import AddButton from '../../components/buttons/addButton/AddButton'
import DataError from '../../components/states/dataError/DataError'
import DataEmpty from '../../components/states/dataEmpty/DataEmpty'
import { formatDate } from '../plan/Plan'

const Lectures = (): JSX.Element => {
  const router = useRouter()
  const { lectures, isLoading, isError } = useLectures()

  const handleRowClick = (id) => {
    router.push(`/lectures/${id}`)
  }

  return (
    <section>
      <div className="inline-wrapper">
        <h1>Wykłady</h1>
      </div>

      {isLoading && <div aria-busy="true"></div>}
      {isError && <DataError onRefresh={() => {}} />}
      {lectures?.length === 0 && <DataEmpty href="/lectures/add" />}
      {lectures?.length > 0 && (
        <>
          <AddButton href="/lectures/add" />
          <div className="row heading-row">
            <Col flex="0 0 60px">#</Col>
            <Col flex="2 1">
              <strong>Tytuł</strong>
            </Col>
            <Col flex="1 1">Ostatnie wygłoszenie</Col>
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
