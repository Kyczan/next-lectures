import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Modal from '../../components/modal/Modal'
import { FiEdit, FiTrash, FiSlash } from 'react-icons/fi'

import { ApiCallStatuses } from '../../app/types'
import { useAppSelector, useAppDispatch, useToggle } from '../../app/hooks'
import {
  fetchLectures,
  selectLectures,
  selectLectureById,
  deleteLecture,
} from './lecturesSlice'
import BackButton from '../../components/buttons/backButton/BackButton'

interface ILecture {
  id: string
}

const LectureView = ({ id }: ILecture): JSX.Element => {
  const [isModalOpen, toggleModal] = useToggle(false)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const lecture = useAppSelector(selectLectureById(id))
  const {
    fetch: { status },
  } = useAppSelector(selectLectures)

  useEffect(() => {
    if (status === ApiCallStatuses.IDLE) {
      dispatch(fetchLectures())
    }
  }, [status, dispatch])

  const handleDelete = async (e) => {
    e.preventDefault()
    await dispatch(deleteLecture(lecture))
    toggleModal()
    router.push(`/lectures`)
  }

  return lecture ? (
    <>
      <div className="inline-wrapper">
        <BackButton href="/lectures" />
        <h1>Szczegóły wykładu</h1>
      </div>

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
          <dd>{lecture.lastDate}</dd>
          <dt>
            <small>Ostatni mówca:</small>
          </dt>
          <dd>{lecture.lastSpeaker}</dd>
        </dl>

        <div className="inline-wrapper inline-wrapper--end">
          <a
            href="#"
            role="button"
            className="secondary with-icon"
            onClick={() => toggleModal()}
          >
            <FiTrash />
            Usuń
          </a>
          <Link href={`/lectures/${id}/edit`}>
            <a role="button" className="with-icon">
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
            <button className="secondary with-icon" onClick={handleDelete}>
              <FiTrash />
              Usuń
            </button>
            <button onClick={() => toggleModal()} className="with-icon">
              <FiSlash />
              Anuluj
            </button>
          </footer>
        </>
      </Modal>
    </>
  ) : null
}

export default LectureView
