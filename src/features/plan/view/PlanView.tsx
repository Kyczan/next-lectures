import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Modal from '../../../components/modal/Modal'
import { FiEdit, FiTrash, FiSlash } from 'react-icons/fi'

import { ApiCallStatuses } from '../../../app/types'
import { useAppSelector, useAppDispatch, useToggle } from '../../../app/hooks'
import { fetchPlan, selectPlan, selectPlanById, deletePlan } from '../planSlice'
import BackButton from '../../../components/buttons/backButton/BackButton'
import { getLecture } from '../Plan'

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

  return plan ? (
    <>
      <div className="inline-wrapper">
        <BackButton href="/plan" />
        <h1>Szczegóły wydarzenia</h1>
      </div>

      <article>
        <dl>
          <dt>
            <small>Data:</small>
          </dt>
          <dd>
            <strong>{plan.date}</strong>
          </dd>
          <dt>
            <small>Wykład:</small>
          </dt>
          <dd>{getLecture(plan.lecture)}</dd>
          <dt>
            <small>Notatka:</small>
          </dt>
          <dd>{plan.note}</dd>
          <dt>
            <small>Mówca:</small>
          </dt>
          <dd>{plan.speaker?.name}</dd>
          <dt>
            <small>Zbór:</small>
          </dt>
          <dd>{plan.speaker?.congregation}</dd>
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
  ) : null
}

export default PlanView
