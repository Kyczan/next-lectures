import { useEffect, useMemo } from 'react'
import Link from 'next/link'
import { FiEdit, FiTrash, FiSlash } from 'react-icons/fi'

import Modal from '../../../components/modal/Modal'
import { ApiCallStatuses } from '../../../app/types'
import {
  useAppSelector,
  useAppDispatch,
  useToggle,
  useMsgOnSuccessAndFailure,
} from '../../../app/hooks'
import {
  fetchPlan,
  selectPlan,
  selectPlanById,
  deletePlan,
  resetDeleteStatus,
} from '../planSlice'
import BackButton from '../../../components/buttons/backButton/BackButton'
import DataError from '../../../components/states/dataError/DataError'
import Page404 from '../../../components/states/page404/Page404'
import ItemDetails from '../../../components/itemDetails/ItemDetails'
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
  const dispatch = useAppDispatch()
  const plan = useAppSelector(selectPlanById(id))
  const {
    fetch: { status },
    delete: { status: deleteStatus },
  } = useAppSelector(selectPlan)

  useEffect(() => {
    if (status === ApiCallStatuses.IDLE) {
      dispatch(fetchPlan())
    }
  }, [status, dispatch])

  // handle delete item
  const onceDeleted = useMsgOnSuccessAndFailure(
    deleteStatus,
    resetDeleteStatus,
    'Usunięto wydarzenie',
    'Błąd podczas usuwania',
    '/plan'
  )

  const handleDelete = async (e) => {
    e.preventDefault()
    await dispatch(deletePlan(plan))
    toggleModal()
  }

  const handleRefresh = () => {
    dispatch(fetchPlan())
  }

  const getItemDetails = useMemo(() => {
    if (!plan) return
    return [
      {
        name: 'Data',
        value: <strong>{formatDate(plan.date)}</strong>,
        copy: formatDate(plan.date),
      },
      {
        name: 'Wykład',
        value: plan.lecture?._id && formatLecture(plan.lecture),
        href: plan.lecture?._id && `/lectures/${plan.lecture._id}`,
        copy: plan.lecture?._id && formatLecture(plan.lecture),
      },
      {
        name: 'Notatka',
        value: plan.note,
        copy: plan.note,
      },
      {
        name: 'Mówca',
        value: plan.speaker?._id && formatSpeaker(plan.speaker),
        href: plan.speaker?._id && `/speakers/${plan.speaker._id}`,
        copy: plan.speaker?._id && formatSpeaker(plan.speaker),
      },
    ]
  }, [plan])

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
      {status === ApiCallStatuses.SUCCEEDED && !plan && !onceDeleted && (
        <Page404 />
      )}
      {status === ApiCallStatuses.SUCCEEDED && plan && (
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
                  aria-busy={deleteStatus === ApiCallStatuses.LOADING}
                  disabled={deleteStatus === ApiCallStatuses.LOADING}
                >
                  <FiTrash />
                  Usuń
                </button>
                <button
                  onClick={() => toggleModal()}
                  className="with-icon"
                  data-testid="modal-cancel-btn"
                  disabled={deleteStatus === ApiCallStatuses.LOADING}
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
