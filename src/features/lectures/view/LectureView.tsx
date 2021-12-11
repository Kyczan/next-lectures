import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Modal from '../../../components/modal/Modal'
import { FiEdit, FiTrash, FiSlash } from 'react-icons/fi'

import { ApiCallStatuses } from '../../../app/types'
import { useAppSelector, useAppDispatch, useToggle } from '../../../app/hooks'
import {
  fetchLectures,
  selectLectures,
  selectLectureById,
  deleteLecture,
} from '../lecturesSlice'
import { fetchPlan, selectPlan, IPlanDataItem } from '../../plan/planSlice'
import BackButton from '../../../components/buttons/backButton/BackButton'
import DataError from '../../../components/states/dataError/DataError'
import Page404 from '../../../components/states/page404/Page404'
import ItemDetails from '../../../components/itemDetails/ItemDetails'
import History, { HistoryType } from '../../../components/history/History'
import { formatDate, formatSpeaker } from '../../../utils/formatters/formatters'

interface ILecture {
  id: string
}

const LectureView = ({ id }: ILecture): JSX.Element => {
  const [filteredPlan, setFilteredPlan] = useState<IPlanDataItem[]>([])
  const [isModalOpen, toggleModal] = useToggle(false)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const lecture = useAppSelector(selectLectureById(id))
  const {
    fetch: { status },
  } = useAppSelector(selectLectures)
  const {
    data: planData,
    fetch: { status: planStatus },
  } = useAppSelector(selectPlan)

  useEffect(() => {
    if (status === ApiCallStatuses.IDLE) {
      dispatch(fetchLectures())
    }
  }, [status, dispatch])

  useEffect(() => {
    if (planStatus === ApiCallStatuses.IDLE) {
      dispatch(fetchPlan())
    }
  }, [planStatus, dispatch])

  useEffect(() => {
    if (lecture) {
      const events = planData.filter(
        (event) => event.lecture?._id === lecture._id
      )
      setFilteredPlan(events)
    }
  }, [planData, lecture])

  const handleDelete = async (e) => {
    e.preventDefault()
    await dispatch(deleteLecture(lecture))
    toggleModal()
    router.push(`/lectures`)
  }

  const handleRefresh = () => {
    dispatch(fetchLectures())
  }

  const getItemDetails = useMemo(() => {
    if (!lecture) return
    return [
      {
        name: '#',
        value: lecture.number,
      },
      {
        name: 'Tytuł',
        value: <strong>{lecture.title}</strong>,
      },
      {
        name: 'Notatka',
        value: lecture.note,
      },
      {
        name: 'Data',
        value: lecture.lastEvent?._id && (
          <Link href={`/plan/${lecture.lastEvent._id}`}>
            {formatDate(lecture.lastEvent.date)}
          </Link>
        ),
      },
      {
        name: 'Mówca',
        value: lecture.lastEvent?.speaker?._id && (
          <Link href={`/speakers/${lecture.lastEvent.speaker._id}`}>
            {formatSpeaker(lecture.lastEvent.speaker)}
          </Link>
        ),
      },
    ]
  }, [lecture])

  return (
    <section>
      <div className="inline-wrapper">
        <BackButton href="/lectures" />
        <h1>Szczegóły wykładu</h1>
      </div>

      {status === ApiCallStatuses.LOADING && (
        <article aria-busy="true"></article>
      )}
      {status === ApiCallStatuses.FAILED && (
        <article>
          <DataError onRefresh={handleRefresh} />
        </article>
      )}
      {status === ApiCallStatuses.SUCCEEDED && !lecture && <Page404 />}
      {status === ApiCallStatuses.SUCCEEDED && lecture && (
        <>
          <article>
            <ItemDetails data={getItemDetails} />

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

          <History data={filteredPlan} type={HistoryType.SPEAKER} />

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
