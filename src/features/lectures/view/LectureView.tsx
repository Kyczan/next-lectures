import Link from 'next/link'
import { useRouter } from 'next/router'
import Modal from '../../../components/modal/Modal'
import { FiEdit, FiTrash, FiSlash } from 'react-icons/fi'

import { useLectureById, deleteLecture } from '../../../app/hooks/lectures'
import { useToggle } from '../../../app/hooks'
import BackButton from '../../../components/buttons/backButton/BackButton'
import { formatDate } from '../../plan/Plan'

interface ILecture {
  id: string
}

const LectureView = ({ id }: ILecture): JSX.Element => {
  const [isModalOpen, toggleModal] = useToggle(false)
  const router = useRouter()
  const { lecture, isLoading } = useLectureById(id)

  const handleDelete = async (e) => {
    e.preventDefault()
    await deleteLecture(lecture)
    toggleModal()
    router.push(`/lectures`)
  }

  return (
    <section>
      <div className="inline-wrapper">
        <BackButton href="/lectures" />
        <h1>Szczegóły wykładu</h1>
      </div>

      {isLoading && <article aria-busy="true"></article>}
      {lecture && (
        <>
          <article>
            <dl>
              <dt>
                <small>Numer:</small>
              </dt>
              <dd>{lecture.number}</dd>
              <dt>
                <small>Tytuł:</small>
              </dt>
              <dd>
                <strong>{lecture.title}</strong>
              </dd>
              <dt>
                <small>Notatka:</small>
              </dt>
              <dd>{lecture.note}</dd>
              <dt>
                <small>Ostatnie wygłoszenie:</small>
              </dt>
              <dd>{formatDate(lecture.lastEvent?.date)}</dd>
              <dt>
                <small>Ostatni mówca:</small>
              </dt>
              <dd>
                {lecture.lastEvent?.speaker?.name}
                {lecture.lastEvent?.speaker?.congregation
                  ? ` (${lecture.lastEvent.speaker.congregation})`
                  : ''}
              </dd>
            </dl>

            <div className="inline-wrapper inline-wrapper--end">
              <a
                href="#"
                role="button"
                className="secondary with-icon"
                onClick={() => toggleModal()}
                data-testid="delete-btn"
              >
                <FiTrash />
                Usuń
              </a>
              <Link href={`/lectures/${id}/edit`}>
                <a role="button" className="with-icon" data-testid="edit-btn">
                  <FiEdit />
                  Edytuj
                </a>
              </Link>
            </div>
          </article>

          <Modal isOpen={isModalOpen} onRequestClose={toggleModal}>
            <>
              <header>Usunąć ten wykład?</header>
              <footer className="inline-wrapper inline-wrapper--end">
                <button
                  className="secondary with-icon"
                  onClick={handleDelete}
                  data-testid="modal-delete-btn"
                >
                  <FiTrash />
                  Usuń
                </button>
                <button
                  onClick={() => toggleModal()}
                  className="with-icon"
                  data-testid="modal-cancel-btn"
                >
                  <FiSlash />
                  Anuluj
                </button>
              </footer>
            </>
          </Modal>
        </>
      )}
    </section>
  )
}

export default LectureView
