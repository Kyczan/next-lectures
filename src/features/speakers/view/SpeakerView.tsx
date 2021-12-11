import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Modal from '../../../components/modal/Modal'
import { FiEdit, FiTrash, FiSlash } from 'react-icons/fi'

import { ApiCallStatuses } from '../../../app/types'
import { useAppSelector, useAppDispatch, useToggle } from '../../../app/hooks'
import {
  fetchSpeakers,
  selectSpeakers,
  selectSpeakerById,
  deleteSpeaker,
} from '../speakersSlice'
import BackButton from '../../../components/buttons/backButton/BackButton'
import DataError from '../../../components/states/dataError/DataError'
import Page404 from '../../../components/states/page404/Page404'
import { formatDate, getLecture } from '../../plan/Plan'

interface ISpeaker {
  id: string
}

const SpeakerView = ({ id }: ISpeaker): JSX.Element => {
  const [isModalOpen, toggleModal] = useToggle(false)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const speaker = useAppSelector(selectSpeakerById(id))
  const {
    fetch: { status },
  } = useAppSelector(selectSpeakers)

  useEffect(() => {
    if (status === ApiCallStatuses.IDLE) {
      dispatch(fetchSpeakers())
    }
  }, [status, dispatch])

  const handleDelete = async (e) => {
    e.preventDefault()
    await dispatch(deleteSpeaker(speaker))
    toggleModal()
    router.push(`/speakers`)
  }

  const handleRefresh = () => {
    dispatch(fetchSpeakers())
  }

  return (
    <section>
      <div className="inline-wrapper">
        <BackButton href="/speakers" />
        <h1>Szczegóły mówcy</h1>
      </div>

      {status === ApiCallStatuses.LOADING && (
        <article aria-busy="true"></article>
      )}
      {status === ApiCallStatuses.FAILED && (
        <article>
          <DataError onRefresh={handleRefresh} />
        </article>
      )}
      {status === ApiCallStatuses.SUCCEEDED && !speaker && <Page404 />}
      {status === ApiCallStatuses.SUCCEEDED && speaker && (
        <>
          <article>
            <dl>
              <dt>
                <small>Imię i Nazwisko:</small>
              </dt>
              <dd>
                <strong>{speaker.name}</strong>
              </dd>
              <dt>
                <small>Zbór:</small>
              </dt>
              <dd>{speaker.congregation}</dd>
              <dt>
                <small>Notatka:</small>
              </dt>
              <dd>{speaker.note}</dd>
              <dt>
                <small>Ostatnie wygłoszenie:</small>
              </dt>
              <dd>
                {speaker.lastEvent?._id && (
                  <Link href={`/plan/${speaker.lastEvent._id}`}>
                    {formatDate(speaker.lastEvent.date)}
                  </Link>
                )}
              </dd>
              <dt>
                <small>Ostatni wykład:</small>
              </dt>
              <dd>
                {speaker.lastEvent?.lecture?._id && (
                  <Link href={`/lectures/${speaker.lastEvent.lecture._id}`}>
                    {getLecture(speaker.lastEvent.lecture)}
                  </Link>
                )}
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
              <Link href={`/speakers/${id}/edit`}>
                <a role="button" className="with-icon" data-testid="edit-btn">
                  <FiEdit />
                  Edytuj
                </a>
              </Link>
            </div>
          </article>

          <Modal isOpen={isModalOpen} onRequestClose={toggleModal}>
            <>
              <header>Usunąć tego mówcę?</header>
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

export default SpeakerView
