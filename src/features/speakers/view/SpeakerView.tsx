import { useEffect, useMemo, useState } from 'react'
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
import { fetchPlan, selectPlan, IPlanDataItem } from '../../plan/planSlice'
import BackButton from '../../../components/buttons/backButton/BackButton'
import DataError from '../../../components/states/dataError/DataError'
import Page404 from '../../../components/states/page404/Page404'
import ItemDetails from '../../../components/itemDetails/ItemDetails'
import History, { HistoryType } from '../../../components/history/History'
import { formatLecture, formatDate } from '../../../utils/formatters/formatters'

interface ISpeaker {
  id: string
}

const SpeakerView = ({ id }: ISpeaker): JSX.Element => {
  const [filteredPlan, setFilteredPlan] = useState<IPlanDataItem[]>([])
  const [isModalOpen, toggleModal] = useToggle(false)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const speaker = useAppSelector(selectSpeakerById(id))
  const {
    fetch: { status },
  } = useAppSelector(selectSpeakers)
  const {
    data: planData,
    fetch: { status: planStatus },
  } = useAppSelector(selectPlan)

  useEffect(() => {
    if (status === ApiCallStatuses.IDLE) {
      dispatch(fetchSpeakers())
    }
  }, [status, dispatch])

  useEffect(() => {
    if (planStatus === ApiCallStatuses.IDLE) {
      dispatch(fetchPlan())
    }
  }, [planStatus, dispatch])

  useEffect(() => {
    if (speaker) {
      const events = planData.filter(
        (event) => event.speaker?._id === speaker._id
      )
      setFilteredPlan(events)
    }
  }, [planData, speaker])

  const handleDelete = async (e) => {
    e.preventDefault()
    await dispatch(deleteSpeaker(speaker))
    toggleModal()
    router.push(`/speakers`)
  }

  const handleRefresh = () => {
    dispatch(fetchSpeakers())
  }

  const getItemDetails = useMemo(() => {
    if (!speaker) return
    return [
      {
        name: 'Imię i Nazwisko',
        value: <strong>{speaker.name}</strong>,
      },
      {
        name: 'Zbór',
        value: speaker.congregation,
      },
      {
        name: 'Notatka',
        value: speaker.note,
      },
      {
        name: 'Data',
        value: speaker.lastEvent?._id && (
          <Link href={`/plan/${speaker.lastEvent._id}`}>
            {formatDate(speaker.lastEvent.date)}
          </Link>
        ),
      },
      {
        name: 'Wykład',
        value: speaker.lastEvent?.lecture?._id && (
          <Link href={`/lectures/${speaker.lastEvent.lecture._id}`}>
            {formatLecture(speaker.lastEvent.lecture)}
          </Link>
        ),
      },
    ]
  }, [speaker])

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
            <ItemDetails data={getItemDetails} />

            <div className="inline-wrapper inline-wrapper--end">
              <button
                className="secondary with-icon"
                onClick={() => toggleModal()}
                data-testid="delete-btn"
              >
                <FiTrash />
                Usuń
              </button>
              <Link href={`/speakers/${id}/edit`}>
                <a role="button" className="with-icon" data-testid="edit-btn">
                  <FiEdit />
                  Edytuj
                </a>
              </Link>
            </div>
          </article>

          <History data={filteredPlan} type={HistoryType.LECTURE} />

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
