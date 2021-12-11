import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FiEdit, FiTrash, FiSlash } from 'react-icons/fi'

import Modal from '../../../components/modal/Modal'
import { ApiCallStatuses } from '../../../app/types'
import { useAppSelector, useAppDispatch, useToggle } from '../../../app/hooks'
import { fetchPlan, selectPlan, selectPlanById, deletePlan } from '../planSlice'
import BackButton from '../../../components/buttons/backButton/BackButton'
import DataError from '../../../components/states/dataError/DataError'
import Page404 from '../../../components/states/page404/Page404'
import {
  formatLecture,
  formatDate,
  formatSpeaker,
} from '../../../utils/formatters/formatters'

interface IPlan {
  id: string
}

const PlanView = ({ id }: IPlan): JSX.Element => {
  const [isModalOpen, toggleModal] = useToggle(false)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const plan = useAppSelector(selectPlanById(id))
  const {
    fetch: { status },
  } = useAppSelector(selectPlan)

  useEffect(() => {
    if (status === ApiCallStatuses.IDLE) {
      dispatch(fetchPlan())
    }
  }, [status, dispatch])

  const handleDelete = async (e) => {
    e.preventDefault()
    await dispatch(deletePlan(plan))
    toggleModal()
    router.push(`/plan`)
  }

  const handleRefresh = () => {
    dispatch(fetchPlan())
  }

  return (
    <section>
      <div className="inline-wrapper">
        <BackButton href="/plan" />
        <h1>Szczegóły wydarzenia</h1>
      </div>

      {status === ApiCallStatuses.LOADING && (
        <article aria-busy="true"></article>
      )}
      {status === ApiCallStatuses.FAILED && (
        <article>
          <DataError onRefresh={handleRefresh} />
        </article>
      )}
      {status === ApiCallStatuses.SUCCEEDED && !plan && <Page404 />}
      {status === ApiCallStatuses.SUCCEEDED && plan && (
        <>
          <article>
            <dl>
              <dt>
                <small>Data</small>
              </dt>
              <dd>
                <strong>{formatDate(plan.date)}</strong>
              </dd>
              <dt>
                <small>Wykład</small>
              </dt>
              <dd>
                {plan.lecture?._id && (
                  <Link href={`/lectures/${plan.lecture._id}`}>
                    {formatLecture(plan.lecture)}
                  </Link>
                )}
              </dd>
              <dt>
                <small>Notatka</small>
              </dt>
              <dd>{plan.note}</dd>
              <dt>
                <small>Mówca</small>
              </dt>
              <dd>
                {plan.speaker?._id && (
                  <Link href={`/speakers/${plan.speaker._id}`}>
                    {formatSpeaker(plan.speaker)}
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
              <Link href={`/plan/${id}/edit`}>
                <a role="button" className="with-icon" data-testid="edit-btn">
                  <FiEdit />
                  Edytuj
                </a>
              </Link>
            </div>
          </article>

          <Modal isOpen={isModalOpen} onRequestClose={toggleModal}>
            <>
              <header>Usunąć to wydarzenie?</header>
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

export default PlanView
